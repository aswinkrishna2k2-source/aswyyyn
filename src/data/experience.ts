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
    role: 'Full Stack Developer',
    company: 'Codeeaq',
    duration: '2025 – Present',
    type: 'Remote · Trivandrum / Dubai',
    color: '#cbff4c',
    contributions: [
      'Building and maintaining full-stack products for clients across regions',
      'Leading frontend architecture with React, TypeScript, and Tailwind',
      'Shipping React Native apps to App Store and Play Store',
    ],
  },
  {
    id: 2,
    role: 'Frontend Developer',
    company: 'Entrix Labs',
    duration: '2024 – 2025',
    type: 'Hybrid · Technopark, Trivandrum',
    color: '#cbff4c',
    contributions: [
      'Delivered production-ready React UIs from Figma designs',
      'Integrated REST APIs and optimised bundle performance',
      'Worked closely with design and backend teams in an Agile setup',
    ],
  },
  {
    id: 3,
    role: 'MERN Stack Intern',
    company: 'Stackup',
    duration: '2023 – 2024',
    type: 'Onsite · Technopark, Trivandrum',
    color: '#cbff4c',
    contributions: [
      'Built full-stack features across React front-end and Node/Express back-end',
      'Worked with MongoDB for data modelling and API development',
      'Contributed to live products used by real users',
    ],
  },
];
