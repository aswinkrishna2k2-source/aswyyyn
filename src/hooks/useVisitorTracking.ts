import { useEffect } from 'react';
import { UAParser } from 'ua-parser-js';

const WEB3FORMS_KEY = '1db95c9e-78ff-4c96-bdb1-0fcf91009521';

export function useVisitorTracking() {
  useEffect(() => {
    if (sessionStorage.getItem('_vt')) return;

    const parser = new UAParser();
    const { browser, os, device } = parser.getResult();

    const deviceType = device.type
      ? device.type.charAt(0).toUpperCase() + device.type.slice(1)
      : 'Desktop';

    const deviceModel =
      device.vendor && device.model
        ? `${device.vendor} ${device.model}`
        : device.vendor || 'Unknown';

    const now = new Date();
    const visitTime = now.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const referrer = document.referrer || 'Direct / Bookmark';

    // Fetch IP geolocation then send the combined email
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then((geo: Record<string, string>) => {
        const lines = [
          `New visitor on aswyyyn.vercel.app`,
          ``,
          `Time        : ${visitTime} IST`,
          ``,
          `-- Location (IP) --`,
          `IP          : ${geo.ip ?? 'Unknown'}`,
          `Country     : ${geo.country_name ?? 'Unknown'}`,
          `Region      : ${geo.region ?? 'Unknown'}`,
          `City        : ${geo.city ?? 'Unknown'}`,
          `ISP         : ${geo.org ?? 'Unknown'}`,
          `Timezone    : ${geo.timezone ?? 'Unknown'}`,
          ``,
          `-- Device --`,
          `Device Type : ${deviceType}`,
          `Device Model: ${deviceModel}`,
          ``,
          `-- Browser / OS --`,
          `Browser     : ${browser.name ?? 'Unknown'} ${browser.version ?? ''}`.trim(),
          `OS          : ${os.name ?? 'Unknown'} ${os.version ?? ''}`.trim(),
          ``,
          `-- Display --`,
          `Screen      : ${window.screen.width} x ${window.screen.height}`,
          `Viewport    : ${window.innerWidth} x ${window.innerHeight}`,
          `Language    : ${navigator.language}`,
          ``,
          `-- Traffic --`,
          `Referrer    : ${referrer}`,
          `URL         : ${window.location.href}`,
        ];

        return fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `Portfolio Visit — ${geo.city ?? 'Unknown'}, ${geo.country_name ?? 'Unknown'} · ${deviceType} · ${browser.name ?? 'Unknown'}`,
            from_name: 'Portfolio Analytics',
            email: 'visitor@portfolio.local',
            message: lines.join('\n'),
          }),
        });
      })
      .then(() => sessionStorage.setItem('_vt', '1'))
      .catch(() => {});
  }, []);
}
