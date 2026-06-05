import { useEffect } from 'react';
import {
  fetchGeo,
  getDeviceInfo,
  getVisitTime,
  buildEmail,
  sendAnalyticsEmail,
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

    const visitTime  = getVisitTime();
    const device     = getDeviceInfo();
    const startTime  = Date.now();
    const sectionsVisited: string[] = [];

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

    // Send visit email after 10 s (captures initial scroll + avoids bot spam)
    const timer = setTimeout(async () => {
      const geo     = await fetchGeo();
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
        screen:   `${window.screen.width} × ${window.screen.height}`,
        viewport: `${window.innerWidth} × ${window.innerHeight}`,
        language: navigator.language,
        referrer: document.referrer || 'Direct / Bookmark',
        url:      window.location.href,
        isReturn,
        sectionsVisited: [...sectionsVisited],
        timeOnPage,
      });

      const subject = `Portfolio Visit — ${geo.city ?? 'Unknown'}, ${geo.country_name ?? 'Unknown'} · ${device.deviceType} · ${device.browserName}`;

      sendAnalyticsEmail(subject, html)
        .then(() => sessionStorage.setItem('_vt', '1'))
        .catch(() => {});
    }, 10000);

    // Resume download tracking
    const handleResumeDownload = async () => {
      const geo = await fetchGeo();
      const html = buildEmail({
        type: 'resume',
        visitTime: getVisitTime(),
        geo,
        ...device,
        screen:   `${window.screen.width} × ${window.screen.height}`,
        viewport: `${window.innerWidth} × ${window.innerHeight}`,
        language: navigator.language,
        referrer: document.referrer || 'Direct / Bookmark',
        url:      window.location.href,
        isReturn,
      });

      const subject = `Resume Downloaded — ${geo.city ?? 'Unknown'}, ${geo.country_name ?? 'Unknown'} · ${device.deviceType} · ${device.browserName}`;
      sendAnalyticsEmail(subject, html).catch(() => {});
    };

    document.addEventListener('portfolio:resume-download', handleResumeDownload);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener('portfolio:resume-download', handleResumeDownload);
    };
  }, []);
}
