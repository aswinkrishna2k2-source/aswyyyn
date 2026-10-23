export interface SkillCategory {
  category: string;
  skills: string[];
}

export const skills: SkillCategory[] = [
  {
    category: 'Frontend',
    skills: ['React.js', 'Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Bootstrap'],
  },
  {
    category: 'Mobile',
    skills: ['React Native', 'Expo', 'Android Studio'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express.js', 'Socket.io', 'REST APIs'],
  },
  {
    category: 'Database',
    skills: ['MongoDB', 'MySQL', 'Supabase', 'Firebase'],
  },
  {
    category: 'CMS',
    skills: ['WordPress'],
  },
  {
    category: 'Hosting',
    skills: ['AWS', 'Hostinger', 'Vercel'],
  },
  {
    category: 'Design',
    skills: ['Figma', 'Adobe Premiere Pro'],
  },
  {
    category: 'Tools',
    skills: ['Git'],
  },
];
