export interface Stat {
  value: number;
  suffix: string;
  label: string;
  color: string;
}

export const stats: Stat[] = [
  { value: 5, suffix: '+', label: 'Projects Built', color: '#0ea5e9' },
  { value: 15, suffix: '+', label: 'Technologies Mastered', color: '#8b5cf6' },
  { value: 2, suffix: '', label: 'Internship Experiences', color: '#06b6d4' },
  { value: 1000, suffix: '+', label: 'Learning Hours', color: '#f59e0b' },
];
