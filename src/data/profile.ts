export const profile = {
  name: 'Aswin Krishnan',
  handle: 'aswyyyn',
  role: 'Full-stack & React Native developer',
  location: 'Kollam, Kerala',
  born: '2002-10-25',
  /** First role (the Stackup internship) — drives the "N+ years of experience" count */
  careerStart: '2023-12-01',
  email: 'aswinkrishna2k2@gmail.com',
  resume: { href: '/resume.pdf', fileName: 'Aswin_Krishnan_Resume.pdf' },
  company: { name: 'Codeeaq', url: 'https://codeeaq.com/' },
};

export type SocialKey = 'github' | 'linkedin' | 'instagram';

export const socials: { key: SocialKey; name: string; url: string; display: string }[] = [
  { key: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/aswyyyn/', display: 'linkedin.com/in/aswyyyn' },
  { key: 'github', name: 'GitHub', url: 'https://github.com/aswin2002', display: 'github.com/aswin2002' },
  { key: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/aswyyyn/', display: 'instagram.com/aswyyyn' },
];

export const education = [
  { degree: 'MBA in Business Analytics', school: 'Amrita University', period: '2026 – Present' },
  { degree: 'Internship in Full Stack Development', school: 'Stackup', period: '2023 – 2024' },
  { degree: 'Bachelor of Arts in English', school: 'Kerala University', period: '2020 – 2023' },
];

/** Whole years from an ISO date (YYYY-MM-DD) until today, so age and experience stay current */
export function yearsSince(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const now = new Date();
  const month = now.getMonth() + 1;
  const passed = month > m || (month === m && now.getDate() >= d);
  return now.getFullYear() - y - (passed ? 0 : 1);
}

export function trackResumeDownload() {
  document.dispatchEvent(new CustomEvent('portfolio:resume-download'));
}
