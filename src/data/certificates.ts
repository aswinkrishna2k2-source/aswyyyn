import aiEngineering from '../assets/certificates/AI Engineering Udemy.png';
import fullStackBootcamp from '../assets/certificates/Udemy_webdev.png';
import sslTlsGuide from '../assets/certificates/udemy_ssl.png';
import entrixInternship from '../assets/certificates/Entrix_certificate.png';
import stackupInternship from '../assets/certificates/StackUP_.png';

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
}

export const certificates: Certificate[] = [
  {
    id: 1,
    title: 'Internship Certificate — Node.js Development',
    issuer: 'Stackup Learning Hub',
    date: '2023 – 2024',
    image: stackupInternship,
  },
  {
    id: 2,
    title: 'Certificate of Internship — Jr. Frontend Developer (React)',
    issuer: 'Entrix Labs',
    date: '2024 – 2025',
    image: entrixInternship,
  },
  {
    id: 5,
    title: 'AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents',
    issuer: 'Udemy',
    date: 'June 2026',
    image: aiEngineering,
  },
  {
    id: 4,
    title: 'The Complete Full-Stack Web Development Bootcamp',
    issuer: 'Udemy',
    date: 'Dec 2025',
    image: fullStackBootcamp,
  },
  {
    id: 3,
    title: 'The Complete SSL and TLS Guide: HTTP to HTTPS',
    issuer: 'Udemy',
    date: 'Nov 2025',
    image: sslTlsGuide,
  },
];
