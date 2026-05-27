import { FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Footer from './components/Footer';

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-12 hidden lg:flex flex-col items-center justify-center gap-5 z-40">
      <a href="https://github.com/aswin2002" target="_blank" rel="noopener noreferrer"
        className="text-muted hover:text-accent transition-colors duration-200">
        <FiGithub size={17} />
      </a>
      <a href="https://www.linkedin.com/in/aswyyyn/" target="_blank" rel="noopener noreferrer"
        className="text-muted hover:text-accent transition-colors duration-200">
        <FiLinkedin size={17} />
      </a>
      <a href="https://www.instagram.com/aswyyyn/" target="_blank" rel="noopener noreferrer"
        className="text-muted hover:text-accent transition-colors duration-200">
        <FiInstagram size={17} />
      </a>
      <div className="w-px h-16 bg-white/15 mt-2" />
    </aside>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#1b1b1b] font-mono text-fg">
      <Sidebar />
      <Navbar />
      <main className="lg:ml-12">
        <Hero />
        <Stats />
        <Projects />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
