import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import type { EmailData, Geo } from '../utils/analytics';
import { readStorage, writeStorage } from '../lib/storage';
import { sections } from '../data/sections';
import { getProjectBySlug } from '../data/projects';

type Analytics = typeof import('../utils/analytics');
type Device = ReturnType<Analytics['getDeviceInfo']>;

const TAG_PARAMS = ['ref', 'utm_source', 'utm_medium', 'utm_campaign'];

/**
 * The tag on a personal link (aswin.work/?ref=rahul, or a utm_source), so a visit can be traced to the
 * person or place the link was given to. Instagram never says which account tapped a link, so this is
 * how you tell your bio link from a DM or a story. Read once at load, before the address bar is tidied.
 */
const LINK_TAG = (() => {
  const params = new URLSearchParams(window.location.search);
  return (params.get('ref') ?? params.get('utm_source') ?? '').trim().slice(0, 60);
})();

/** Drops the tag from the address bar, so a link they copy and pass on doesn't carry it */
function clearLinkTag() {
  const url = new URL(window.location.href);
  if (!TAG_PARAMS.some((p) => url.searchParams.has(p))) return;
  TAG_PARAMS.forEach((p) => url.searchParams.delete(p));
  window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
}

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

    const a         = activity.current;
    const startedAt = new Date();
    let   sent      = false; // delivered
    let   sending   = false; // a request is in flight
    let   geo: Geo  = {};

    // The tracking code (user-agent parsing, the email builder) loads once the page is up instead of
    // holding up the first render; geo and the exact device model are fetched as soon as it arrives
    const ready = import('../utils/analytics').then((m) => {
      const device = m.getDeviceInfo();
      m.fetchGeo().then(g => { geo = g; });
      m.refineDeviceInfo(device);
      return { m, device };
    });

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

    const collect = (m: Analytics, device: Device, type: EmailData['type']): EmailData => ({
      type,
      visitTime:      m.getVisitTime(type === 'resume' ? new Date() : startedAt),
      geo,
      ...device,
      screen:         `${window.screen.width} × ${window.screen.height}`,
      viewport:       `${window.innerWidth} × ${window.innerHeight}`,
      language:       navigator.language,
      connection:     m.getConnection(),
      source:         m.getTrafficSource(),
      linkTag:        linkTag || undefined,
      linkTagEarlier: !LINK_TAG && !!earlierTag,
      contact:        m.getKnownContact(),
      visitorId,
      visitCount,
      lastVisit,
      timeOnSite:     secondsSince(a.start),
      sectionTimes:   sections.map(({ label }) => ({ label, seconds: a.seconds[label] ?? 0 })),
      scrollDepth:    a.scrollDepth,
      journey:        [...a.journey],
    });

    // One visit email per session. It only counts once EmailJS accepts it: a failed send (network blip,
    // page frozen mid-request) is retried the next time the visitor leaves.
    const sendVisit = () => {
      if (sent || sending) return;
      sending = true;
      ready
        .then(({ m, device }) => {
          const data = collect(m, device, 'visit');
          return m.sendAnalyticsEmail(m.emailSubject(data), m.buildEmail(data));
        })
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
    const handleResumeDownload = () => {
      a.journey.push({ at: secondsSince(a.start), label: 'Downloaded resume' });
      ready
        .then(async ({ m, device }) => {
          geo = await m.fetchGeo();
          const data = collect(m, device, 'resume');
          await m.sendAnalyticsEmail(m.emailSubject(data), m.buildEmail(data));
        })
        .catch(() => {});
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
