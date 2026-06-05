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

    const lines = [
      `New visitor on aswyyyn.vercel.app`,
      ``,
      `Time        : ${visitTime} IST`,
      ``,
      `Device Type : ${deviceType}`,
      `Device Model: ${deviceModel}`,
      ``,
      `Browser     : ${browser.name ?? 'Unknown'} ${browser.version ?? ''}`.trim(),
      `OS          : ${os.name ?? 'Unknown'} ${os.version ?? ''}`.trim(),
      ``,
      `Screen      : ${window.screen.width} x ${window.screen.height}`,
      `Viewport    : ${window.innerWidth} x ${window.innerHeight}`,
      `Language    : ${navigator.language}`,
      ``,
      `Referrer    : ${referrer}`,
      `URL         : ${window.location.href}`,
    ];

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Portfolio Visit — ${deviceType} · ${os.name ?? 'Unknown'} · ${browser.name ?? 'Unknown'}`,
        from_name: 'Portfolio Analytics',
        email: 'visitor@portfolio.local',
        message: lines.join('\n'),
      }),
    })
      .then(() => sessionStorage.setItem('_vt', '1'))
      .catch(() => {});
  }, []);
}
