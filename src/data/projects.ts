import servesitesLogo from '../assets/logos/servesites.svg';
import cresidenceLogo from '../assets/logos/cresidence.png';

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  status?: string;
  tags: string[];
  /** One-line hook shown on story cards */
  tagline: string;
  /** Who it was built for — omitted for personal builds */
  client?: string;
  platform: string;
  /** 'phones' renders portrait app screenshots as a fanned trio instead of a single cover */
  cover?: 'phones';
  liveUrl: string;
  githubUrl?: string;
  featured?: boolean;
  logo?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}

export const featuredProjects: Project[] = [
  {
    id: 1,
    slug: 'servesites',
    title: 'ServeSites',
    tagline: 'Turning nonprofit websites into guided giving experiences.',
    client: 'Codeeaq',
    platform: 'Web platform',
    description: 'A platform that transforms nonprofit websites into guided donation experiences. Built for Codeeaq — features branded Generosity Pages, a connected Giving Card, and a seamless donor flow that converts visitors into givers.',
    longDescription: 'ServeSites gives nonprofits a full donor-experience platform instead of a bare donate button. Admins track every gift and donor in the Impact dashboard, build branded, on-site donation flows called Expressions (popups, buttons, embedded cards), run time-boxed fundraising campaigns as Moments with live progress and leaderboards, and define named Purposes so every dollar is tagged to what it actually funds. A drag-and-drop Generosity Page builder lets nonprofits ship a full donation landing page — hero, story, suggested gift tiers, recurring/one-time toggles — without writing code, then preview and publish it straight to their site.',
    // status: 'Actively Maintained',
    tags: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind'],
    liveUrl: 'https://servesites.com/',
    githubUrl: '#',
    featured: true,
    logo: servesitesLogo,
  },
  {
    id: 2,
    slug: 'cresidence',
    title: 'cResidence',
    tagline: 'Running a residence from your pocket: tenants, maintenance, payments.',
    client: 'Codeeaq',
    platform: 'iOS & Android',
    cover: 'phones',
    description: 'A mobile residence management system built for Codeeaq. Streamlines property operations with tenant management, maintenance requests, payment tracking, and real-time notifications — available on iOS and Android.',
    tags: ['React Native', 'Node.js', 'MongoDB', 'Expo'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    logo: cresidenceLogo,
    appStoreUrl: 'https://apps.apple.com/us/app/cresidence/id6768594817',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.codeeaq.residence&pli=1',
  },
  {
    id: 9,
    slug: 'meryal-water-park',
    title: 'Meryal Waterpark',
    tagline: "The online front door to Qatar's largest waterpark.",
    client: 'Entrix Labs',
    platform: 'Website',
    description: 'Qatar\'s largest waterpark — a 6-acre beachfront destination in Lusail with 53 slides across 69 attractions, built for Entrix Labs.',
    longDescription: 'Website for Meryal Waterpark, the largest waterpark in Qatar, set on Qetaifan Island North in Lusail. The park spans 6 acres with 53 slides and 69 attractions in total, headlined by the 85m Icon Tower ("Rig 1938") — an oil-rig-inspired structure with two Guinness World Record attempts for tallest waterpark tower and most rides on a single tower, home to Vertigo, the world\'s tallest water slide at a 76.3m drop. Other signature rides include Alghazal, a twisting rollercoaster-style water ride, and Rapid Refinery, the Middle East\'s first hybrid water slide combining a Ferris-wheel-style raft ride with sharp twists. The park also has a wave pool, lazy river, dedicated kids\' splash areas, an Italian restaurant, a kids club, and sandy beachfront shores.',
    // status: 'Live',
    tags: ['Next.js', 'React', 'Tailwind'],
    liveUrl: 'https://meryalwaterpark.com/',
    githubUrl: '#',
    featured: true,
  },
  {
    id: 10,
    slug: 'cparish',
    title: 'cParish',
    tagline: "A parish's records, directory and announcements in one secure app.",
    client: 'Codeeaq',
    platform: 'iOS & Android',
    description: 'A parish management app built for Codeeaq. Digitizes member directories, family records, and sacrament registers for Catholic parishes with secure phone-OTP sign-in — available on iOS and Android.',
    longDescription: 'cParish is a parish management app that brings a Catholic parish\'s member directory, family records, and sacrament registers (Baptism, Confirmation, Marriage, and more) into one secure app, in English and Malayalam. Parish members can view their family\'s membership details, sacrament history, BCC (Basic Christian Community) unit info, and parish announcements. Parish administrators get a complete, organized member and family registry, can manage sacrament records, organize members into BCC units, and send announcements directly to the community — all behind role-based access. Accounts are provisioned by the parish administrator and sign-in happens over secure phone OTP, so member data stays private and visible only to verified parish members, replacing the paper records and scattered spreadsheets many parishes rely on.',
    tags: ['React Native', 'Node.js', 'MongoDB', 'Expo'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    appStoreUrl: 'https://apps.apple.com/in/app/cparish/id6781975967',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.codeeaq.parish',
  },
];

export const otherProjects: Project[] = [
  {
    id: 3,
    slug: 'gamified-lms',
    title: 'Gamified LMS',
    tagline: 'Quizzes that play like a game: XP, streaks, badges and live leaderboards.',
    platform: 'Web app',
    description: 'MCQ-based learning platform with XP points, leaderboards, badges, and adaptive difficulty to boost engagement.',
    longDescription: 'A learning management system built around game mechanics instead of a flat quiz list. Every correct answer earns XP that feeds a live leaderboard, streaks unlock badges, and an adaptive-difficulty engine adjusts the next question\'s weight based on the learner\'s recent accuracy so the quiz stays challenging without becoming discouraging. Instructors get a dashboard to author MCQ sets, tag them by topic and difficulty, and watch class-wide progress in real time over a Socket.io connection — no page refresh needed to see a leaderboard shuffle.',
    tags: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 4,
    slug: 'employee-management-system',
    title: 'Employee Management System',
    tagline: 'Records, payroll and attendance for a growing team, behind role-based access.',
    platform: 'Web app',
    description: 'Full-stack CRUD app for managing employee records, departments, payroll, and attendance with role-based access control.',
    longDescription: 'An internal HR tool covering the day-to-day admin work a growing team accumulates: employee records with document uploads, a department/reporting-line hierarchy, monthly payroll computation with configurable allowances and deductions, and clock-in/clock-out attendance tracking. Access is role-gated with JWT-authenticated sessions — admins manage the org chart and payroll rules, managers approve leave and view their team\'s attendance, and employees see only their own records. Every payroll run and record edit is written to an audit log for accountability.',
    tags: ['React', 'Express', 'MySQL', 'JWT'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 5,
    slug: 'website-builder',
    title: 'Website Builder',
    tagline: 'Drag, drop, and export clean HTML/CSS. No code required.',
    platform: 'Web app',
    description: 'Drag-and-drop visual page builder for creating responsive websites without code, with live preview and clean HTML/CSS export.',
    longDescription: 'A no-code page builder where sections and components are dragged onto a canvas from a library (hero, gallery, pricing table, contact form, and more), then styled through property panels rather than raw CSS. Every edit renders live at desktop, tablet, and mobile breakpoints simultaneously so responsive behavior is checked as you build, not after. Full undo/redo history covers every drag, resize, and style change, and the finished page exports as clean, dependency-free HTML/CSS — no builder-specific runtime required to host it.',
    tags: ['React', 'TypeScript', 'DnD Kit', 'Tailwind'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 6,
    slug: 'dev-portfolio-cms',
    title: 'Dev Portfolio CMS',
    tagline: 'Portfolio content as forms, not commits, with one-click Vercel deploys.',
    platform: 'Web app',
    description: 'Headless CMS for managing portfolio content — projects, skills, and experience — with a live-reload preview and one-click Vercel deploy.',
    longDescription: 'A Sanity-backed content layer for a Next.js portfolio, so updating a project entry, skill, or job title is a form edit instead of a code change and redeploy. Content schemas cover projects, skills, and experience with structured fields (tags, dates, media), and a live-preview route reflects draft edits instantly via Sanity\'s webhook before anything is published. Publishing triggers a Vercel deploy hook automatically, so the change ships without touching the terminal — images are optimized and served through Sanity\'s CDN pipeline on the way out.',
    tags: ['Next.js', 'Sanity', 'TypeScript', 'Tailwind'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 7,
    slug: 'realtime-chat-app',
    title: 'Real-time Chat App',
    tagline: 'Encrypted, instant messaging that scales out with Redis pub/sub.',
    platform: 'Web app',
    description: 'End-to-end encrypted messaging app with rooms, typing indicators, read receipts, and media sharing. Built with Socket.io and Redis pub/sub.',
    longDescription: 'A messaging app built for instant feel: Socket.io handles the live connection for typing indicators and read receipts, while a Redis pub/sub layer fans messages out across multiple server instances so the app scales horizontally without users in the same room landing on different, disconnected servers. Messages are end-to-end encrypted client-side before they ever touch the wire, rooms support both direct and group conversations, and media (images, files) uploads through signed URLs so the app server never has to buffer large payloads.',
    tags: ['React', 'Node.js', 'Socket.io', 'Redis'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 8,
    slug: 'expense-tracker',
    title: 'Expense Tracker',
    tagline: 'Raw transactions in, a clear monthly budget picture out.',
    platform: 'Web app',
    description: 'Personal finance tracker with categorized spending, monthly budget goals, CSV import, and visual breakdowns via Chart.js.',
    longDescription: 'A personal finance tracker that turns raw transactions into a monthly budget picture. Spending is auto-sorted into categories, editable per transaction, and rolled up into Chart.js breakdowns so overspending in a category is visible at a glance rather than buried in a list. Bank statements import via CSV with a column-mapping step for different export formats, monthly budget goals trigger a warning as a category approaches its limit, and recurring transactions (rent, subscriptions) are detected automatically after a couple of repeats so they don\'t need re-entering every month.',
    tags: ['React', 'Express', 'MongoDB', 'Chart.js'],
    liveUrl: '#',
    githubUrl: '#',
  },
];

export const allProjects: Project[] = [...featuredProjects, ...otherProjects];

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find(project => project.slug === slug);
}
