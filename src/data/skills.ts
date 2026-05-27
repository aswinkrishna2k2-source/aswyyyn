export interface Skill {
  name: string;
  level: number;
  icon?: string;
}

export interface SkillCategory {
  category: string;
  color: string;
  skills: Skill[];
}

export const skills: SkillCategory[] = [
  {
    category: 'Frontend',
    color: '#0ea5e9',
    skills: [
      { name: 'React.js', level: 92 },
      { name: 'Next.js', level: 82 },
      { name: 'JavaScript', level: 90 },
      { name: 'TypeScript', level: 78 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'HTML5', level: 95 },
      { name: 'CSS3', level: 92 },
      { name: 'Bootstrap', level: 85 },
    ],
  },
  {
    category: 'Backend',
    color: '#8b5cf6',
    skills: [
      { name: 'Node.js', level: 80 },
      { name: 'Express.js', level: 78 },
    ],
  },
  {
    category: 'Database',
    color: '#06b6d4',
    skills: [
      { name: 'MongoDB', level: 78 },
      { name: 'MySQL', level: 72 },
    ],
  },
  {
    category: 'Tools',
    color: '#f59e0b',
    skills: [
      { name: 'Git', level: 85 },
      { name: 'Figma', level: 75 },
      { name: 'REST APIs', level: 85 },
    ],
  },
];
