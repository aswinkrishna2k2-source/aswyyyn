import { UAParser } from 'ua-parser-js';
import emailjs from '@emailjs/browser';

export const WEB3FORMS_KEY = '1db95c9e-78ff-4c96-bdb1-0fcf91009521';

const EJS_PUBLIC_KEY  = 'w0ugTfG96Ffg3bQ4y';
const EJS_SERVICE_ID  = 'service_xzzut0k';
const EJS_TEMPLATE_ID = 'template_rdcx6nr';

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

function row(label: string, value: string): string {
  return `
    <tr>
      <td width="110" valign="top" style="padding:5px 0 5px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;color:#555555;text-transform:uppercase;letter-spacing:1px;">${label}</td>
      <td valign="top" style="padding:5px 0 5px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#e4e4e4;line-height:1.5;">${value}</td>
    </tr>`;
}

function card(icon: string, title: string, rows: [string, string][]): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
    <tr>
      <td bgcolor="#252526" style="border:1px solid #2e2e2e;border-radius:4px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td bgcolor="#252526" style="padding:10px 16px 9px;border-bottom:1px solid #2a2a2a;border-radius:4px 4px 0 0;">
              <span style="font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#cbff4c;">${icon}&nbsp; ${title}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:4px 16px 6px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${rows.map(([l, v]) => row(l, v)).join('')}
              </table>
            </td>
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
  const title    = isResume ? '&#128196; Resume Downloaded' : '&#128065; New Visitor';
  const subtitle = isResume
    ? 'Someone downloaded your resume — strong interest signal.'
    : `aswyyyn.vercel.app`;

  const returnBadge = d.isReturn
    ? `&nbsp;<span style="background:#cbff4c;color:#1b1b1b;font-family:Arial,sans-serif;font-size:9px;font-weight:700;padding:2px 8px;border-radius:2px;letter-spacing:1px;vertical-align:middle;">RETURN VISITOR</span>`
    : '';

  const locationRows: [string, string][] = [
    ['IP',       d.geo.ip          ?? 'Unknown'],
    ['Country',  d.geo.country_name ?? 'Unknown'],
    ['Region',   d.geo.region       ?? 'Unknown'],
    ['City',     d.geo.city         ?? 'Unknown'],
    ['ISP',      d.geo.org          ?? 'Unknown'],
    ['Timezone', d.geo.timezone     ?? 'Unknown'],
  ];

  const deviceRows: [string, string][] = [
    ['Type',    d.deviceType],
    ['Model',   d.deviceModel],
    ['Browser', `${d.browserName} ${d.browserVersion}`.trim()],
    ['OS',      `${d.osName} ${d.osVersion}`.trim()],
  ];

  const displayRows: [string, string][] = [
    ['Screen',   d.screen],
    ['Viewport', d.viewport],
    ['Language', d.language],
  ];

  const trafficRows: [string, string][] = [
    ['Referrer', d.referrer],
    ['URL',      `<span style="word-break:break-all;font-size:11px;">${d.url}</span>`],
  ];

  const engagementRows: [string, string][] = [];
  if (d.timeOnPage)         engagementRows.push(['Time Spent',  d.timeOnPage]);
  if (d.sectionsVisited?.length)
    engagementRows.push(['Sections', d.sectionsVisited.join(' &rarr; ')]);

  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#1b1b1b">
<tr><td align="center" bgcolor="#1b1b1b" style="padding:28px 16px;">
<table width="600" cellpadding="0" cellspacing="0" border="0">

  <!-- Header -->
  <tr>
    <td bgcolor="#252526" style="border-top:3px solid #cbff4c;border-radius:6px 6px 0 0;padding:28px 32px 20px;">
      <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#cbff4c;">PORTFOLIO ANALYTICS</p>
      <h1 style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#e4e4e4;">${title}</h1>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#abb2bf;">${subtitle}${returnBadge}</p>
    </td>
  </tr>

  <!-- Time strip -->
  <tr>
    <td bgcolor="#1e1e1e" style="padding:10px 32px;border-left:1px solid #2e2e2e;border-right:1px solid #2e2e2e;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#abb2bf;">&#128336;&nbsp; ${d.visitTime}</td>
          ${d.isReturn ? '<td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#cbff4c;font-weight:700;">&#8617; Return Visit</td>' : ''}
        </tr>
      </table>
    </td>
  </tr>

  <!-- Cards -->
  <tr>
    <td bgcolor="#1b1b1b" style="padding:16px 32px 20px;border:1px solid #2e2e2e;border-top:none;border-radius:0 0 6px 6px;">

      ${card('&#128205;', 'Location', locationRows)}
      ${card('&#128241;', 'Device', deviceRows)}
      ${engagementRows.length ? card('&#128200;', 'Engagement', engagementRows) : ''}
      ${card('&#128190;', 'Display', displayRows)}
      ${card('&#128279;', 'Traffic Source', trafficRows)}

      <!-- Footer -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;">
        <tr>
          <td style="border-top:1px solid #2a2a2a;padding-top:14px;text-align:center;">
            <span style="font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#3a3a3a;">
              aswyyyn.vercel.app &nbsp;&bull;&nbsp; Portfolio Analytics &nbsp;&bull;&nbsp; Auto-generated
            </span>
          </td>
        </tr>
      </table>

    </td>
  </tr>

</table>
</td></tr>
</table>`;
}
