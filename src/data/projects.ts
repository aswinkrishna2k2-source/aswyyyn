import servesitesLogo from '../assets/logos/servesites.svg';
import cresidenceLogo from '../assets/logos/cresidence.png';

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  liveUrl: string;
  featured?: boolean;
  logo?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}

export const featuredProjects: Project[] = [
  {
    id: 1,
    title: 'ServeSites',
    description: 'A platform that transforms nonprofit websites into guided donation experiences. Built for Codeeaq — features branded Generosity Pages, a connected Giving Card, and a seamless donor flow that converts visitors into givers.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind'],
    gradient: 'from-blue-500/20 to-cyan-500/20',
    liveUrl: 'https://servesites.com/',
    featured: true,
    logo: servesitesLogo,
  },
  {
    id: 2,
    title: 'cResidence',
    description: 'A mobile residence management system built for Codeeaq. Streamlines property operations with tenant management, maintenance requests, payment tracking, and real-time notifications — available on iOS and Android.',
    tags: ['React Native', 'Node.js', 'MongoDB', 'Expo'],
    gradient: 'from-violet-500/20 to-purple-500/20',
    liveUrl: '#',
    featured: true,
    logo: cresidenceLogo,
    appStoreUrl: 'https://apps.apple.com/us/app/cresidence/id6768594817',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.codeeaq.residence&pli=1',
  },
];

export const otherProjects: Project[] = [
  {
    id: 3,
    title: 'Gamified LMS',
    description: 'MCQ-based learning platform with XP points, leaderboards, badges, and adaptive difficulty to boost engagement.',
    tags: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    gradient: 'from-emerald-500/20 to-teal-500/20',
    liveUrl: '#',
  },
  {
    id: 4,
    title: 'Employee Management System',
    description: 'Full-stack CRUD app for managing employee records, departments, payroll, and attendance with role-based access control.',
    tags: ['React', 'Express', 'MySQL', 'JWT'],
    gradient: 'from-orange-500/20 to-amber-500/20',
    liveUrl: '#',
  },
  {
    id: 5,
    title: 'Website Builder',
    description: 'Drag-and-drop visual page builder for creating responsive websites without code, with live preview and clean HTML/CSS export.',
    tags: ['React', 'TypeScript', 'DnD Kit', 'Tailwind'],
    gradient: 'from-pink-500/20 to-rose-500/20',
    liveUrl: '#',
  },
  {
    id: 6,
    title: 'Dev Portfolio CMS',
    description: 'Headless CMS for managing portfolio content — projects, skills, and experience — with a live-reload preview and one-click Vercel deploy.',
    tags: ['Next.js', 'Sanity', 'TypeScript', 'Tailwind'],
    gradient: '',
    liveUrl: '#',
  },
  {
    id: 7,
    title: 'Real-time Chat App',
    description: 'End-to-end encrypted messaging app with rooms, typing indicators, read receipts, and media sharing. Built with Socket.io and Redis pub/sub.',
    tags: ['React', 'Node.js', 'Socket.io', 'Redis'],
    gradient: '',
    liveUrl: '#',
  },
  {
    id: 8,
    title: 'Expense Tracker',
    description: 'Personal finance tracker with categorized spending, monthly budget goals, CSV import, and visual breakdowns via Chart.js.',
    tags: ['React', 'Express', 'MongoDB', 'Chart.js'],
    gradient: '',
    liveUrl: '#',
  },
];
