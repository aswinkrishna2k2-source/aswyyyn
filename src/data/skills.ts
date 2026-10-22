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
    skills: ['React Native', 'Expo'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express.js', 'Socket.io'],
  },
  {
    category: 'Database',
    skills: ['MongoDB', 'MySQL'],
  },
  {
    category: 'Tools',
    skills: ['Git', 'Figma', 'REST APIs'],
  },
];
