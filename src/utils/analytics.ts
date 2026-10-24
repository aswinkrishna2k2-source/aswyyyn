import { UAParser } from 'ua-parser-js';
import { readStorage, writeStorage } from '../lib/storage';

export const WEB3FORMS_KEY = '1db95c9e-78ff-4c96-bdb1-0fcf91009521';

const EJS_PUBLIC_KEY  = 'w0ugTfG96Ffg3bQ4y';
const EJS_SERVICE_ID  = 'service_xzzut0k';
const EJS_TEMPLATE_ID = 'template_rdcx6nr';

// ── Geo — approximate, from the visitor's IP ─────────────────────────────────
// An IP lookup only knows where the visitor's network meets the internet. On Jio or Airtel in Kerala
// that's Thiruvananthapuram or Kochi wherever the person really is, and every provider agrees, so the
// email labels it approximate. ipwho.is stands in when ipapi.co is down or rate-limited.
export type Geo = Record<string, string>;

const timeout = () => (typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(6000) : undefined);

async function fromIpapi(): Promise<Geo> {
  const res = await fetch('https://ipapi.co/json/', { signal: timeout() });
  const geo = await res.json();
  if (!res.ok || geo.error || !geo.ip) throw new Error('ipapi.co unavailable');
  return geo;
}

async function fromIpwho(): Promise<Geo> {
  const res = await fetch('https://ipwho.is/', { signal: timeout() });
  const g = await res.json();
  if (!g.success) throw new Error('ipwho.is unavailable');
  return {
    ip: g.ip,
    city: g.city,
    region: g.region,
    country_name: g.country,
    country_code: g.country_code,
    postal: g.postal,
    latitude: String(g.latitude),
    longitude: String(g.longitude),
    timezone: g.timezone?.id,
    org: g.connection?.org || g.connection?.isp,
  };
}

let geoRequest: Promise<Geo> | null = null;

/** Looked up once per page load and shared by everyone who asks */
export function fetchGeo(): Promise<Geo> {
  geoRequest ??= (async () => {
    for (const lookup of [fromIpapi, fromIpwho]) {
      try {
        return await lookup();
      } catch {
        /* try the next provider */
      }
    }
    return {};
  })();
  return geoRequest;
}

// ── Device / browser info ────────────────────────────────────────────────────
// Instagram's and Facebook's in-app browsers name the exact iPhone ("iPhone15,3"), which Safari never does
const IPHONES: Record<string, string> = {
  'iPhone12,1': 'iPhone 11', 'iPhone12,3': 'iPhone 11 Pro', 'iPhone12,5': 'iPhone 11 Pro Max', 'iPhone12,8': 'iPhone SE (2nd gen)',
  'iPhone13,1': 'iPhone 12 mini', 'iPhone13,2': 'iPhone 12', 'iPhone13,3': 'iPhone 12 Pro', 'iPhone13,4': 'iPhone 12 Pro Max',
  'iPhone14,4': 'iPhone 13 mini', 'iPhone14,5': 'iPhone 13', 'iPhone14,2': 'iPhone 13 Pro', 'iPhone14,3': 'iPhone 13 Pro Max',
  'iPhone14,6': 'iPhone SE (3rd gen)', 'iPhone14,7': 'iPhone 14', 'iPhone14,8': 'iPhone 14 Plus',
  'iPhone15,2': 'iPhone 14 Pro', 'iPhone15,3': 'iPhone 14 Pro Max', 'iPhone15,4': 'iPhone 15', 'iPhone15,5': 'iPhone 15 Plus',
  'iPhone16,1': 'iPhone 15 Pro', 'iPhone16,2': 'iPhone 15 Pro Max',
  'iPhone17,1': 'iPhone 16 Pro', 'iPhone17,2': 'iPhone 16 Pro Max', 'iPhone17,3': 'iPhone 16', 'iPhone17,4': 'iPhone 16 Plus', 'iPhone17,5': 'iPhone 16e',
};

export function getDeviceInfo() {
  const ua = navigator.userAgent;
  const { browser, os, device } = new UAParser(ua).getResult();
  const iphone = ua.match(/\((iPhone\d+,\d+);/)?.[1] ?? ua.match(/FBDV\/(iPhone\d+,\d+)/)?.[1];
  return {
    deviceType: device.type
      ? device.type.charAt(0).toUpperCase() + device.type.slice(1)
      : 'Desktop',
    deviceModel: iphone
      ? IPHONES[iphone] ?? iphone
      : device.vendor && device.model
        ? `${device.vendor} ${device.model}`
        : device.vendor || 'Unknown',
    browserName: browser.name ?? 'Unknown',
    browserVersion: browser.version ?? '',
    osName: os.name ?? 'Unknown',
    osVersion: os.version ?? '',
  };
}

type HighEntropyUA = { getHighEntropyValues(hints: string[]): Promise<{ model?: string; platformVersion?: string }> };

/**
 * Chrome's user-agent string hides the phone model and reports Windows 11 as 10; its client hints still
 * tell the truth. Fills both into `device`.
 */
export async function refineDeviceInfo(device: ReturnType<typeof getDeviceInfo>) {
  const uaData = (navigator as Navigator & { userAgentData?: HighEntropyUA }).userAgentData;
  if (!uaData) return;
  try {
    const { model, platformVersion } = await uaData.getHighEntropyValues(['model', 'platformVersion']);
    if (model) device.deviceModel = model;
    if (device.osName === 'Windows' && platformVersion) device.osVersion = parseInt(platformVersion, 10) >= 13 ? '11' : '10';
  } catch {
    /* hints unavailable */
  }
}

/** Wi-Fi or mobile data, where the browser says (mostly Chrome on Android) */
export function getConnection(): string {
  const type = (navigator as Navigator & { connection?: { type?: string } }).connection?.type ?? '';
  return ({ wifi: 'Wi-Fi', cellular: 'Mobile data', ethernet: 'Ethernet' } as Record<string, string>)[type] ?? '';
}

// ── Formatted visit time (IST) ───────────────────────────────────────────────
export function getVisitTime(): string {
  const now = new Date();
  const timeZone = 'Asia/Kolkata';
  const date = now.toLocaleDateString('en-GB', { timeZone, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const time = now.toLocaleTimeString('en-IN', { timeZone, hour: 'numeric', minute: '2-digit' });
  return `${date.replace(',', '')} · ${time} IST`;
}

// ── Traffic source ───────────────────────────────────────────────────────────
const REFERRERS: [RegExp, string][] = [
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)facebook\.com$|^fb\.me$/, 'Facebook'],
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, 'LinkedIn'],
  [/^t\.co$|(^|\.)(x|twitter)\.com$/, 'X'],
  [/(^|\.)whatsapp\.com$|^wa\.me$/, 'WhatsApp'],
  [/(^|\.)github\.com$/, 'GitHub'],
  [/(^|\.)google\./, 'Google'],
  [/(^|\.)bing\.com$/, 'Bing'],
  [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo'],
];

const TAG_PARAMS = ['ref', 'utm_source', 'utm_medium', 'utm_campaign'];

/**
 * The tag on a personal link (aswin.work/?ref=rahul, or a utm_source), so a visit can be traced to the
 * person or place the link was given to. Instagram never says which account tapped a link, so this is
 * how you tell your bio link from a DM or a story.
 */
export function getLinkTag(): string {
  const params = new URLSearchParams(window.location.search);
  return (params.get('ref') ?? params.get('utm_source') ?? '').trim().slice(0, 60);
}

/** Drops the tag from the address bar, so a link they copy and pass on doesn't carry it */
export function clearLinkTag() {
  const url = new URL(window.location.href);
  if (!TAG_PARAMS.some((p) => url.searchParams.has(p))) return;
  TAG_PARAMS.forEach((p) => url.searchParams.delete(p));
  window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
}

/** Where the visitor came from: an in-app browser, or the referring site */
export function getTrafficSource(): string {
  const ua = navigator.userAgent;
  if (/Instagram/.test(ua)) return 'Instagram app';
  if (/FBAN|FBAV|FB_IAB/.test(ua)) return 'Facebook app';
  if (/LinkedInApp/.test(ua)) return 'LinkedIn app';

  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, '');
    if (host === window.location.hostname.replace(/^www\./, '')) return 'Direct';
    return REFERRERS.find(([re]) => re.test(host))?.[1] ?? host;
  } catch {
    return 'Direct'; // no referrer: typed, bookmarked, or opened from a messaging app
  }
}

// ── People who've written in ─────────────────────────────────────────────────
export interface KnownContact {
  name: string;
  email: string;
  /** When they sent the message (ISO) */
  at: string;
}

/** After someone sends a message through the contact form, their later visits arrive under their name */
export function rememberContact(name: string, email: string) {
  writeStorage('local', '_who', JSON.stringify({ name: name.trim(), email: email.trim(), at: new Date().toISOString() }));
}

export function getKnownContact(): KnownContact | undefined {
  try {
    const who = JSON.parse(readStorage('local', '_who') ?? 'null');
    return who?.name && who?.email ? who : undefined;
  } catch {
    return undefined;
  }
}

// ── Send via EmailJS's REST API (renders full HTML) ──────────────────────────
// keepalive lets the request finish even if the page is hidden, frozen or closed mid-send, which is
// exactly when visit emails go out (the SDK's plain fetch gets cancelled when a phone freezes the tab)
export async function sendAnalyticsEmail(subject: string, html: string): Promise<void> {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
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
  if (!res.ok) throw new Error(`EmailJS ${res.status}: ${await res.text()}`);
}

// ── Email ────────────────────────────────────────────────────────────────────
// Tables and inline styles only, since that's what Gmail, Outlook and Apple Mail all render. One fluid
// column up to 560px reads on a phone without zooming; the charts are table cells sized in percent.

/* eslint-disable max-len */

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
  /** Wi-Fi / Mobile data, when the browser reports it */
  connection: string;
  source: string;
  /** Tag from a personal link (?ref=rahul); `linkTagEarlier` when it came from a previous visit */
  linkTag?: string;
  linkTagEarlier?: boolean;
  /** Name and email from the contact form, if they've ever sent a message */
  contact?: KnownContact;
  /** Random ID kept in their browser, to tie visits from the same person together */
  visitorId: string;
  /** This browser's nth visit, and when the previous one was (ISO) */
  visitCount: number;
  lastVisit?: string;
  /** Seconds on the site so far */
  timeOnSite: number;
  /** Seconds spent on each home section, in page order */
  sectionTimes: { label: string; seconds: number }[];
  /** How far down the home page they got, 0–100 */
  scrollDepth: number;
  /** Pages they opened, with seconds since arrival */
  journey: { at: number; label: string }[];
}

const C = {
  bg:     '#1b1b1b',
  card:   '#252526',
  track:  '#3a3a3c',
  accent: '#cbff4c',
  ink:    '#1b1b1b',
  fg:     '#ededed',
  muted:  '#a1a1a6',
  dim:    '#76767b',
};
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace";

const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function formatDuration(total: number): string {
  if (total < 60) return `${total}s`;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m ${total % 60}s`;
}

const clock = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;

const ordinal = (n: number) => {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffix[(v - 20) % 10] || suffix[v] || 'th');
};


const place = (geo: Record<string, string>) => [geo.city, geo.country_name].filter(Boolean).join(', ');

function since(iso?: string): string {
  const mins = iso ? Math.round((Date.now() - new Date(iso).getTime()) / 60000) : NaN;
  if (!(mins >= 0)) return '';
  if (mins < 60) return `${Math.max(mins, 1)} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

/** The visitor's own clock, when they're outside IST */
function theirTime(tz?: string): string {
  if (!tz || tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return '';
  try {
    return `${new Date().toLocaleTimeString('en-IN', { timeZone: tz, hour: 'numeric', minute: '2-digit' })} their time`;
  } catch {
    return '';
  }
}

export function emailSubject(d: EmailData): string {
  const who = [d.contact?.name ?? (place(d.geo) || 'Unknown location'), d.linkTag && `via ${d.linkTag}`].filter(Boolean).join(' · ');
  return d.type === 'resume'
    ? `Resume Downloaded — ${who} · ${d.deviceType}`
    : `Portfolio Visit — ${who} · ${formatDuration(d.timeOnSite)} · ${d.deviceType}`;
}

// Hosting and VPN networks: a visit from one is a cloud server, a VPN user, or a bot
const CLOUD = /amazon|aws|google llc|google cloud|digitalocean|ovh|hetzner|linode|akamai|oracle|alibaba|tencent|contabo|vultr|choopa|m247|datacamp|leaseweb|scaleway|cloudflare/i;

// Building blocks
const table = (rows: string, style = '', bg = '') =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"${bg ? ` bgcolor="${bg}"` : ''} style="border-collapse:separate;${bg ? `background:${bg};` : ''}${style}">${rows}</table>`;

const text = (size: number, color: string, content: string, extra = '') =>
  `<div style="font-family:${SANS};font-size:${size}px;line-height:1.4;color:${color};${extra}">${content}</div>`;

const label = (content: string) =>
  `<div style="font-family:${MONO};font-size:11px;line-height:1.4;letter-spacing:1.5px;text-transform:uppercase;color:${C.dim};">${content}</div>`;

const gap = (h: number) => `<div style="height:${h}px;line-height:${h}px;font-size:0;">&nbsp;</div>`;

/** Horizontal bar: lime fill on a dark track, pct 0–100 */
function bar(pct: number, height = 8): string {
  const w = Math.round(Math.min(100, Math.max(0, pct)));
  const r = `${height / 2}px`;
  const cell = (width: number, color: string, radius: string) =>
    `<td width="${width}%" height="${height}" style="width:${width}%;height:${height}px;background:${color};border-radius:${radius};font-size:0;line-height:0;">&nbsp;</td>`;
  if (w <= 0) return table(`<tr>${cell(100, C.track, r)}</tr>`);
  if (w >= 100) return table(`<tr>${cell(100, C.accent, r)}</tr>`);
  return table(`<tr>${cell(w, C.accent, `${r} 0 0 ${r}`)}${cell(100 - w, C.track, `0 ${r} ${r} 0`)}</tr>`);
}

/** One block per home section, lit where they spent time */
function segments(lit: boolean[]): string {
  const w = (100 / lit.length).toFixed(2);
  const block = (on: boolean) =>
    table(`<tr><td height="6" style="height:6px;background:${on ? C.accent : C.track};border-radius:3px;font-size:0;line-height:0;">&nbsp;</td></tr>`);
  return table(`<tr>${lit.map((on, i) => `<td width="${w}%" style="padding-right:${i < lit.length - 1 ? 3 : 0}px;">${block(on)}</td>`).join('')}</tr>`);
}

const card = (title: string, body: string) =>
  `<tr><td style="padding:0 0 12px;">${table(`<tr><td style="padding:18px 18px 20px;">${label(title)}${gap(14)}${body}</td></tr>`, 'border-radius:16px;', C.card)}</td></tr>`;

function stat(title: string, value: string, sub: string, viz = ''): string {
  return `${label(title)}${text(24, C.fg, value, 'margin-top:6px;font-weight:700;letter-spacing:-0.3px;')}${text(12, C.muted, sub, 'margin-top:2px;')}${viz ? `<div style="margin-top:10px;">${viz}</div>` : ''}`;
}

export function buildEmail(d: EmailData): string {
  const isResume  = d.type === 'resume';
  const where     = place(d.geo);
  const duration  = formatDuration(d.timeOnSite);
  const seen      = d.sectionTimes.filter((s) => s.seconds > 0);
  const sawHome   = seen.length > 0;
  const top       = d.sectionTimes.reduce((a, b) => (b.seconds > a.seconds ? b : a), d.sectionTimes[0]);
  const longest   = Math.max(1, ...d.sectionTimes.map((s) => s.seconds));
  const their     = theirTime(d.geo.timezone);
  const came      = d.linkTag ? `${d.linkTag} link` : d.source;
  const preheader = isResume
    ? `Resume downloaded after ${duration} on the site · via ${came}`
    : `${duration} on the site · ${seen.length} of ${d.sectionTimes.length} sections · via ${came}`;

  const header = `
<tr><td style="padding:2px 2px 22px;">${table(`<tr>
  <td style="font-family:${SANS};font-size:15px;font-weight:700;color:${C.fg};"><span style="color:${C.accent};">/</span>whoami</td>
  <td align="right"><span style="display:inline-block;background:${C.accent};color:${C.ink};font-family:${MONO};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:5px 11px;border-radius:999px;">${isResume ? 'Resume downloaded' : 'New visit'}</span></td>
</tr>`)}</td></tr>`;

  const linkPill = d.linkTag
    ? `<div style="margin-top:12px;"><span style="display:inline-block;border:1px solid ${C.accent};color:${C.accent};font-family:${MONO};font-size:12px;padding:4px 10px;border-radius:999px;">Link &middot; ${esc(d.linkTag)}${d.linkTagEarlier ? ' (earlier visit)' : ''}</span></div>`
    : '';

  const hero = `
<tr><td style="padding:0 2px 22px;">
  ${label(d.contact ? 'Known visitor' : 'Approx. location')}
  ${text(28, C.fg, esc(d.contact?.name ?? (where || 'Unknown location')), 'margin-top:6px;font-weight:700;line-height:1.2;letter-spacing:-0.5px;')}
  ${text(16, C.muted, isResume
    ? `Downloaded your resume after <b style="color:${C.accent};">${duration}</b> on the site`
    : `Spent <b style="color:${C.accent};">${duration}</b> on your portfolio`, 'margin-top:6px;')}
  ${linkPill}
  ${text(13, C.dim, [d.contact && where && `Near ${esc(where)}`, esc(d.visitTime), their].filter(Boolean).join(' · '), 'margin-top:12px;')}
</td></tr>`;

  const overview = card('Overview', table(`
<tr>
  <td width="50%" valign="top" style="padding:0 8px 20px 0;">${stat('Time on site', duration, isResume ? 'so far' : 'until they left')}</td>
  <td width="50%" valign="top" style="padding:0 0 20px 8px;">${stat('Scrolled', sawHome ? `${d.scrollDepth}%` : '—', sawHome ? 'of the home page' : 'home not opened', bar(d.scrollDepth, 6))}</td>
</tr>
<tr>
  <td width="50%" valign="top" style="padding:0 8px 0 0;">${stat('Sections', `${seen.length} of ${d.sectionTimes.length}`, 'viewed', segments(d.sectionTimes.map((s) => s.seconds > 0)))}</td>
  <td width="50%" valign="top" style="padding:0 0 0 8px;">${stat('Visit', ordinal(d.visitCount), d.visitCount > 1 && since(d.lastVisit) ? `last here ${since(d.lastVisit)}` : 'first time here')}</td>
</tr>`));

  const sections = sawHome
    ? card('Time by section', `${table(d.sectionTimes.map(({ label: name, seconds }) => `
<tr>
  <td width="88" style="padding:5px 10px 5px 0;font-family:${SANS};font-size:13px;color:${seconds ? C.fg : C.dim};white-space:nowrap;">${name}</td>
  <td style="padding:5px 0;">${bar(seconds ? Math.max(4, (seconds / longest) * 100) : 0)}</td>
  <td width="54" align="right" style="padding:5px 0 5px 10px;font-family:${MONO};font-size:12px;color:${seconds && seconds === top.seconds ? C.accent : C.muted};white-space:nowrap;">${seconds ? formatDuration(seconds) : '—'}</td>
</tr>`).join(''))}${text(13, C.muted, `Most time on <b style="color:${C.fg};">${top.label}</b>`, 'margin-top:12px;')}`)
    : '';

  const steps = d.journey.slice(0, 10);
  // Skipped only when they stayed on the home page, which the section chart already covers
  const journey = d.journey.length > 1 || d.journey[0]?.label !== 'Home'
    ? card('Journey', `${table(steps.map(({ at, label: page }) => `
<tr>
  <td width="44" valign="top" style="padding:4px 0;font-family:${MONO};font-size:12px;line-height:20px;color:${C.dim};">${clock(at)}</td>
  <td width="18" valign="top" style="padding:10px 0 0;"><div style="width:8px;height:8px;border-radius:4px;background:${C.accent};font-size:0;line-height:0;">&nbsp;</div></td>
  <td valign="top" style="padding:4px 0;font-family:${SANS};font-size:14px;line-height:20px;color:${C.fg};">${esc(page)}</td>
</tr>`).join(''))}${d.journey.length > steps.length ? text(13, C.muted, `+ ${d.journey.length - steps.length} more`, 'margin-top:6px;') : ''}`)
    : '';

  const row = (k: string, v: string) => (v ? `
<tr>
  <td width="84" valign="top" style="padding:6px 12px 6px 0;font-family:${SANS};font-size:13px;line-height:20px;color:${C.dim};white-space:nowrap;">${k}</td>
  <td valign="top" style="padding:6px 0;font-family:${SANS};font-size:14px;line-height:20px;color:${C.fg};word-break:break-word;">${v}</td>
</tr>` : '');

  const g = d.geo;
  const mapLink = g.latitude && g.longitude
    ? ` <a href="https://maps.google.com/?q=${esc(g.latitude)},${esc(g.longitude)}" style="color:${C.accent};text-decoration:none;white-space:nowrap;">Map&nbsp;&#8599;</a>`
    : '';
  const model = d.deviceModel !== 'Unknown' ? d.deviceModel : d.deviceType;
  const note = (s: string) => ` <span style="color:${C.dim};">&middot; ${s}</span>`;
  const area = [g.city, g.region, g.country_name].filter(Boolean).join(', ');
  const visitor = card('Visitor', table([
    row('Contact', d.contact
      ? `${esc(d.contact.name)}<br><a href="mailto:${esc(d.contact.email)}" style="color:${C.accent};text-decoration:none;">${esc(d.contact.email)}</a>${since(d.contact.at) ? note(`messaged you ${since(d.contact.at)}`) : ''}`
      : ''),
    row('Link', d.linkTag ? `${esc(d.linkTag)}${d.linkTagEarlier ? note('from an earlier visit') : ''}` : ''),
    row('Source', esc(d.source)),
    row('Visitor', `#${esc(d.visitorId)}`),
    row('Location', area ? `${esc(area)}${note('approx.')}${mapLink}` : ''),
    row('Network', g.org ? `${esc(g.org)}${CLOUD.test(g.org) ? note('cloud server or VPN') : ''}` : ''),
    row('Connection', esc(d.connection)),
    row('Device', esc([model, `${d.osName} ${d.osVersion}`.trim()].filter(Boolean).join(' · '))),
    row('Browser', esc(`${d.browserName} ${d.browserVersion.split('.')[0]}`.trim())),
    row('Screen', `${esc(d.screen)} <span style="color:${C.dim};">· window ${esc(d.viewport)}</span>`),
    row('Language', esc(d.language)),
  ].join('')));

  const footer = `
<tr><td style="padding:10px 2px 0;">
  ${text(12, C.dim, [g.ip && `IP ${esc(g.ip)}`, g.timezone && esc(g.timezone)].filter(Boolean).join(' · '), 'word-break:break-all;')}
  ${text(12, C.dim, 'Sent by your portfolio at aswin.work', 'margin-top:4px;')}
</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
</head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
${table(`<tr><td align="center" style="padding:24px 14px 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
${header}${hero}${overview}${sections}${journey}${visitor}${footer}
</table>
</td></tr>`, '', C.bg)}
</body>
</html>`;
}
