import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  fetchGeo,
  getDeviceInfo,
  refineDeviceInfo,
  getConnection,
  getVisitTime,
  getTrafficSource,
  getLinkTag,
  clearLinkTag,
  getKnownContact,
  buildEmail,
  emailSubject,
  sendAnalyticsEmail,
  type EmailData,
} from '../utils/analytics';
import { readStorage, writeStorage } from '../lib/storage';
import { sections } from '../data/sections';
import { getProjectBySlug } from '../data/projects';

// Read once at load, before anything tidies the address bar
const LINK_TAG = getLinkTag();

/** What the visitor did on this page load */
interface Activity {
  start: number;
  /** Seconds per home section label */
  seconds: Record<string, number>;
  /** Furthest point reached on the home page, 0–100 */
  scrollDepth: number;
  journey: { at: number; label: string }[];
}

const secondsSince = (start: number) => Math.round((Date.now() - start) / 1000);

function pageLabel(pathname: string): string {
  if (pathname === '/') return 'Home';
  const slug = pathname.match(/^\/projects\/([^/]+)/)?.[1];
  return (slug && getProjectBySlug(slug)?.title) || pathname;
}

export function useVisitorTracking() {
  const { pathname } = useLocation();
  const activity = useRef<Activity>({ start: Date.now(), seconds: {}, scrollDepth: 0, journey: [] });

  // Every page they open, for the journey timeline
  useEffect(() => {
    const a = activity.current;
    a.journey.push({ at: secondsSince(a.start), label: pageLabel(pathname) });
  }, [pathname]);

  useEffect(() => {
    clearLinkTag();
    if (readStorage('session', '_vt')) return;

    const a          = activity.current;
    const visitTime  = getVisitTime();
    const device     = getDeviceInfo();
    const source     = getTrafficSource();
    const connection = getConnection();
    let   sent       = false; // delivered
    let   sending    = false; // a request is in flight
    let   geo: Record<string, string> = {};

    // Pre-fetch geo and the exact device model so they're ready when the user leaves
    fetchGeo().then(g => { geo = g; });
    refineDeviceInfo(device);

    // Return visitor detection: a stable ID, how many visits from this browser, and when the last one was
    let visitorId = readStorage('local', '_vid');
    if (!visitorId) {
      visitorId = Math.random().toString(36).slice(2, 6).toUpperCase();
      writeStorage('local', '_vid', visitorId);
    }
    const lastVisit  = readStorage('local', '_lv') ?? undefined;
    const visitCount = Number(readStorage('local', '_vc') ?? (lastVisit ? 1 : 0)) + 1;
    writeStorage('local', '_vc', String(visitCount));
    writeStorage('local', '_lv', new Date().toISOString());

    // A personal link's tag sticks to the browser, so a later untagged visit still traces back to it
    const earlierTag = readStorage('local', '_ref') ?? '';
    if (LINK_TAG) writeStorage('local', '_ref', LINK_TAG);
    const linkTag = LINK_TAG || earlierTag;

    // Once a second while they're looking: credit the home section under the middle of the screen,
    // and note how far down the page they've got
    const tick = setInterval(() => {
      if (document.visibilityState !== 'visible' || window.location.pathname !== '/') return;
      const middle = window.innerHeight / 2;
      for (const { id, label } of sections) {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (rect && rect.top <= middle && rect.bottom > middle) {
          a.seconds[label] = (a.seconds[label] ?? 0) + 1;
          break;
        }
      }
      const depth = ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100;
      a.scrollDepth = Math.max(a.scrollDepth, Math.min(100, Math.round(depth)));
    }, 1000);

    const collect = (type: EmailData['type']): EmailData => ({
      type,
      visitTime:    type === 'resume' ? getVisitTime() : visitTime,
      geo,
      ...device,
      screen:       `${window.screen.width} × ${window.screen.height}`,
      viewport:     `${window.innerWidth} × ${window.innerHeight}`,
      language:     navigator.language,
      connection,
      source,
      linkTag:        linkTag || undefined,
      linkTagEarlier: !LINK_TAG && !!earlierTag,
      contact:      getKnownContact(),
      visitorId,
      visitCount,
      lastVisit,
      timeOnSite:   secondsSince(a.start),
      sectionTimes: sections.map(({ label }) => ({ label, seconds: a.seconds[label] ?? 0 })),
      scrollDepth:  a.scrollDepth,
      journey:      [...a.journey],
    });

    // One visit email per session. It only counts once EmailJS accepts it: a failed send (network blip,
    // page frozen mid-request) is retried the next time the visitor leaves.
    const sendVisit = () => {
      if (sent || sending) return;
      sending = true;
      const data = collect('visit');
      sendAnalyticsEmail(emailSubject(data), buildEmail(data))
        .then(() => {
          sent = true;
          writeStorage('session', '_vt', '1');
        })
        .catch(() => {})
        .finally(() => { sending = false; });
    };

    // Send as the visitor leaves: tab switch, minimise, app switch, screen lock (visibilitychange), and
    // tab close or navigating away, which iOS reports through pagehide rather than beforeunload
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') sendVisit();
    };

    // Safety net: send after 30 min for visitors who leave the tab open indefinitely
    const maxTimer = setTimeout(sendVisit, 30 * 60 * 1000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', sendVisit);

    // Resume download tracking: its own email, and a step in the visit's journey
    const handleResumeDownload = async () => {
      a.journey.push({ at: secondsSince(a.start), label: 'Downloaded resume' });
      geo = await fetchGeo();
      const data = collect('resume');
      sendAnalyticsEmail(emailSubject(data), buildEmail(data)).catch(() => {});
    };

    document.addEventListener('portfolio:resume-download', handleResumeDownload);

    return () => {
      clearInterval(tick);
      clearTimeout(maxTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', sendVisit);
      document.removeEventListener('portfolio:resume-download', handleResumeDownload);
    };
  }, []);
}
