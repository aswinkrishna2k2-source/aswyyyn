import { UAParser } from 'ua-parser-js';
import emailjs from '@emailjs/browser';

export const WEB3FORMS_KEY = '1db95c9e-78ff-4c96-bdb1-0fcf91009521';

export const EJS_PUBLIC_KEY  = 'w0ugTfG96Ffg3bQ4y';
export const EJS_SERVICE_ID  = 'service_xzzut0k';
export const EJS_TEMPLATE_ID = 'template_rdcx6nr';

// ── Geo — fetched once, cached for the session ───────────────────────────────
let geoCache: Record<string, string> | null = null;

export async function fetchGeo(): Promise<Record<string, string>> {
  if (geoCache) return geoCache;
  try {
    const res = await fetch('https://ipapi.co/json/');
    geoCache = await res.json();
  } catch {
    geoCache = {};
  }
  return geoCache!;
}

// ── Device / browser info ────────────────────────────────────────────────────
export function getDeviceInfo() {
  const { browser, os, device } = new UAParser().getResult();
  return {
    deviceType: device.type
      ? device.type.charAt(0).toUpperCase() + device.type.slice(1)
      : 'Desktop',
    deviceModel:
      device.vendor && device.model
        ? `${device.vendor} ${device.model}`
        : device.vendor || 'Unknown',
    browserName: browser.name ?? 'Unknown',
    browserVersion: browser.version ?? '',
    osName: os.name ?? 'Unknown',
    osVersion: os.version ?? '',
  };
}

// ── Formatted visit time (IST) ───────────────────────────────────────────────
export function getVisitTime(): string {
  return (
    new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + ' IST'
  );
}

// ── Send via EmailJS (renders full HTML) ─────────────────────────────────────
export async function sendAnalyticsEmail(subject: string, html: string): Promise<void> {
  await emailjs.send(
    EJS_SERVICE_ID,
    EJS_TEMPLATE_ID,
    { subject, message: html },
    { publicKey: EJS_PUBLIC_KEY },
  );
}

// ── HTML email builder ───────────────────────────────────────────────────────

/* eslint-disable max-len */

const C = {
  bg:       '#111111',
  surface:  '#1e1e1e',
  card:     '#252526',
  border:   '#2e2e2e',
  accent:   '#cbff4c',
  fg:       '#e4e4e4',
  muted:    '#abb2bf',
  dim:      '#555555',
};

const pill = (text: string, fg = C.accent, bg = 'rgba(203,255,76,0.1)') =>
  `<span style="display:inline-block;background:${bg};color:${fg};font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.5px;padding:3px 10px;border-radius:20px;margin:2px 3px 2px 0;">${text}</span>`;

const chip = (text: string) =>
  `<span style="display:inline-block;background:${C.card};color:${C.muted};font-family:Arial,Helvetica,sans-serif;font-size:10px;padding:3px 9px;border-radius:4px;border:1px solid ${C.border};margin:2px 3px 2px 0;">${text}</span>`;

function kv(label: string, value: string): string {
  return `
  <tr>
    <td width="120" valign="top" style="padding:5px 16px 5px 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;color:${C.dim};text-transform:uppercase;letter-spacing:1px;white-space:nowrap;">${label}</td>
    <td valign="top" style="padding:5px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${C.fg};line-height:1.5;">${value}</td>
  </tr>`;
}

function card(icon: string, title: string, body: string): string {
  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
  <tr>
    <td width="3" bgcolor="${C.accent}" style="border-radius:3px 0 0 3px;">&nbsp;</td>
    <td bgcolor="${C.card}" style="border:1px solid ${C.border};border-left:none;border-radius:0 4px 4px 0;padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td bgcolor="${C.card}" style="padding:10px 16px 8px;border-bottom:1px solid ${C.border};border-radius:0 4px 0 0;">
            <span style="font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:${C.accent};">${icon}&nbsp; ${title}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 16px 12px;">${body}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

export interface EmailData {
  type: 'visit' | 'resume';
  visitTime: string;
  geo: Record<string, string>;
  deviceType: string;
  deviceModel: string;
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  screen: string;
  viewport: string;
  language: string;
  referrer: string;
  url: string;
  isReturn: boolean;
  sectionsVisited?: string[];
  timeOnPage?: string;
}

export function buildEmail(d: EmailData): string {
  const isResume = d.type === 'resume';
  const title    = isResume ? '&#128196; Resume Downloaded' : '&#128065; New Portfolio Visit';
  const subtitle = isResume
    ? 'Someone downloaded your resume — strong interest signal.'
    : 'aswyyyn.vercel.app';

  const locationBody = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${kv('IP',       d.geo.ip           ?? 'Unknown')}
      ${kv('Country',  d.geo.country_name ?? 'Unknown')}
      ${kv('Region',   d.geo.region       ?? 'Unknown')}
      ${kv('City',     d.geo.city         ?? 'Unknown')}
      ${kv('ISP',      d.geo.org          ?? 'Unknown')}
      ${kv('Timezone', d.geo.timezone     ?? 'Unknown')}
    </table>`;

  const deviceBody = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${kv('Type',    pill(d.deviceType))}
      ${kv('Model',   d.deviceModel || 'Unknown')}
      ${kv('Browser', pill(`${d.browserName} ${d.browserVersion}`.trim(), C.fg, C.card))}
      ${kv('OS',      `${d.osName} ${d.osVersion}`.trim())}
    </table>`;

  const displayBody = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${kv('Screen',   d.screen)}
      ${kv('Viewport', d.viewport)}
      ${kv('Language', d.language)}
    </table>`;

  const trafficBody = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${kv('Referrer', d.referrer)}
      ${kv('URL', `<span style="word-break:break-all;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${C.fg};">${d.url}</span>`)}
    </table>`;

  const engagementCard = (d.timeOnPage || d.sectionsVisited?.length) ? card('&#128200;', 'Engagement', `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${d.timeOnPage ? kv('Time Spent', `<span style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:${C.accent};">${d.timeOnPage}</span>`) : ''}
      ${d.sectionsVisited?.length ? kv('Sections', d.sectionsVisited.map(s => chip(s)).join('')) : ''}
    </table>`) : '';

  const returnRow = d.isReturn
    ? `<td align="right">${pill('&#8617; Return Visit', C.accent, 'rgba(203,255,76,0.12)')}</td>`
    : '';

  return `<!DOCTYPE html>
<html lang="en" style="color-scheme:dark;background:${C.bg};">
<head>
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<style>
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
  @media (prefers-color-scheme: light) {
    html, body, table, td { background-color: ${C.bg} !important; color: ${C.fg} !important; }
  }
  @media print {
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { background: ${C.bg} !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.bg} !important;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="background:${C.bg} !important;">
<tr><td align="center" bgcolor="${C.bg}" style="background:${C.bg} !important;padding:28px 16px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

  <!-- Header -->
  <tr>
    <td bgcolor="${C.surface}" style="background:${C.surface} !important;border-top:3px solid ${C.accent};border-radius:6px 6px 0 0;padding:28px 32px 18px;">
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${C.accent};">PORTFOLIO ANALYTICS</p>
      <h1 style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;color:${C.fg} !important;">${title}</h1>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${C.muted} !important;">${subtitle}</p>
    </td>
  </tr>

  <!-- Time + return visitor strip -->
  <tr>
    <td bgcolor="${C.card}" style="background:${C.card} !important;padding:10px 32px;border-left:1px solid ${C.border};border-right:1px solid ${C.border};">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${C.muted} !important;">&#128336;&nbsp; ${d.visitTime}</td>
          ${returnRow}
        </tr>
      </table>
    </td>
  </tr>

  <!-- Cards body -->
  <tr>
    <td bgcolor="${C.bg}" style="background:${C.bg} !important;padding:14px 32px 20px;border:1px solid ${C.border};border-top:none;border-radius:0 0 6px 6px;">

      ${card('&#128205;', 'Location', locationBody)}
      ${card('&#128241;', 'Device', deviceBody)}
      ${engagementCard}
      ${card('&#128190;', 'Display', displayBody)}
      ${card('&#128279;', 'Traffic Source', trafficBody)}

      <!-- PDF export guide -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:4px;">
        <tr>
          <td bgcolor="${C.card}" style="background:${C.card} !important;border:1px solid ${C.border};border-radius:4px;padding:10px 16px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:${C.dim} !important;line-height:1.7;">
              <span style="color:${C.accent};font-weight:700;">Save as PDF:</span>
              &nbsp;Gmail &rarr; &nbsp;&#8942;&nbsp; More &rarr; Print &rarr; Save as PDF
              &nbsp;&nbsp;<span style="color:${C.dim};">(Dark background preserved)</span>
            </p>
          </td>
        </tr>
      </table>

      <!-- Footer -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">
        <tr>
          <td style="border-top:1px solid ${C.border};padding-top:12px;text-align:center;">
            <span style="font-family:Arial,Helvetica,sans-serif;font-size:10px;color:${C.dim} !important;">
              aswyyyn.vercel.app &nbsp;&bull;&nbsp; Portfolio Analytics &nbsp;&bull;&nbsp; Auto-generated
            </span>
          </td>
        </tr>
      </table>

    </td>
  </tr>

</table>
</td></tr>
</table>

</body>
</html>`;
}
