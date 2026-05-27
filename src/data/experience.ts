export interface Experience {
  id: number;
  role: string;
  company: string;
  duration: string;
  type: string;
  contributions: string[];
  color: string;
}

export const experiences: Experience[] = [
  {
    id: 1,
    role: 'Frontend Developer Intern',
    company: 'Entrix Labs',
    duration: '2023 – 2024',
    type: 'Internship',
    color: '#0ea5e9',
    contributions: [
      'Built responsive React components used across production applications',
      'Implemented pixel-perfect UI from Figma designs with smooth animations',
      'Collaborated with backend team to integrate REST APIs seamlessly',
      'Improved page load performance by 40% through code splitting and lazy loading',
    ],
  },
  {
    id: 2,
    role: 'Junior Developer Intern',
    company: 'LearnBuds',
    duration: '2022 – 2023',
    type: 'Internship',
    color: '#8b5cf6',
    contributions: [
      'Developed interactive learning modules using React and modern JS',
      'Built gamification features including quizzes and progress tracking',
      'Contributed to a MongoDB-backed Express.js API layer',
      'Worked in an Agile team, participating in sprints and code reviews',
    ],
  },
];
