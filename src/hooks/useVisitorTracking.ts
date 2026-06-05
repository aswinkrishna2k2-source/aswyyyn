import { useEffect } from 'react';
import {
  fetchGeo,
  getDeviceInfo,
  getVisitTime,
  buildEmail,
  sendAnalyticsEmail,
  EJS_PUBLIC_KEY,
  EJS_SERVICE_ID,
  EJS_TEMPLATE_ID,
} from '../utils/analytics';

const SECTIONS = [
  { id: 'home',       label: 'Hero'       },
  { id: 'works',      label: 'Projects'   },
  { id: 'experience', label: 'Experience' },
  { id: 'skills',     label: 'Skills'     },
  { id: 'about-me',   label: 'About'      },
  { id: 'contact',    label: 'Contact'    },
];

export function useVisitorTracking() {
  useEffect(() => {
    if (sessionStorage.getItem('_vt')) return;

    const visitTime      = getVisitTime();
    const device         = getDeviceInfo();
    const startTime      = Date.now();
    const sectionsVisited: string[] = [];
    let   sent           = false;
    let   geo: Record<string, string> = {};

    // Pre-fetch geo immediately so it's cached when the user leaves
    fetchGeo().then(g => { geo = g; });

    // Return visitor detection
    const isReturn = !!localStorage.getItem('_lv');
    localStorage.setItem('_lv', new Date().toISOString());

    // Observe sections scrolled into view
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = SECTIONS.find(s => s.id === entry.target.id);
            if (section && !sectionsVisited.includes(section.label)) {
              sectionsVisited.push(section.label);
            }
          }
        });
      },
      { threshold: 0.25 },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Build email payload from current state
    const buildPayload = () => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const timeOnPage =
        elapsed >= 60
          ? `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`
          : `${elapsed}s`;

      const html = buildEmail({
        type: 'visit',
        visitTime,
        geo,
        ...device,
        screen:          `${window.screen.width} × ${window.screen.height}`,
        viewport:        `${window.innerWidth} × ${window.innerHeight}`,
        language:        navigator.language,
        referrer:        document.referrer || 'Direct / Bookmark',
        url:             window.location.href,
        isReturn,
        sectionsVisited: [...sectionsVisited],
        timeOnPage,
      });

      const subject = `Portfolio Visit — ${geo.city ?? 'Unknown'}, ${geo.country_name ?? 'Unknown'} · ${device.deviceType} · ${device.browserName}`;
      return { subject, html };
    };

    // Primary: send when tab is hidden (tab switch / minimize / navigate away)
    // Page is still alive here so async EmailJS SDK works fine
    const handleVisibilityChange = () => {
      if (!document.hidden || sent) return;
      sent = true;
      const { subject, html } = buildPayload();
      sendAnalyticsEmail(subject, html)
        .then(() => sessionStorage.setItem('_vt', '1'))
        .catch(() => {});
    };

    // Fallback: direct tab close — use fetch keepalive to EmailJS REST API
    // (SDK can't keepalive; keepalive fetch survives tab close)
    const handleBeforeUnload = () => {
      if (sent) return;
      sent = true;
      const { subject, html } = buildPayload();
      fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method:    'POST',
        headers:   { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          service_id:      EJS_SERVICE_ID,
          template_id:     EJS_TEMPLATE_ID,
          user_id:         EJS_PUBLIC_KEY,
          template_params: { subject, message: html },
        }),
      });
      sessionStorage.setItem('_vt', '1');
    };

    // Safety net: send after 30 min for visitors who leave the tab open indefinitely
    const maxTimer = setTimeout(() => {
      if (sent) return;
      handleVisibilityChange();
    }, 30 * 60 * 1000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Resume download tracking
    const handleResumeDownload = async () => {
      const latestGeo = await fetchGeo();
      const html = buildEmail({
        type:     'resume',
        visitTime: getVisitTime(),
        geo:      latestGeo,
        ...device,
        screen:   `${window.screen.width} × ${window.screen.height}`,
        viewport: `${window.innerWidth} × ${window.innerHeight}`,
        language: navigator.language,
        referrer: document.referrer || 'Direct / Bookmark',
        url:      window.location.href,
        isReturn,
      });
      const subject = `Resume Downloaded — ${latestGeo.city ?? 'Unknown'}, ${latestGeo.country_name ?? 'Unknown'} · ${device.deviceType} · ${device.browserName}`;
      sendAnalyticsEmail(subject, html).catch(() => {});
    };

    document.addEventListener('portfolio:resume-download', handleResumeDownload);

    return () => {
      clearTimeout(maxTimer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('portfolio:resume-download', handleResumeDownload);
    };
  }, []);
}
