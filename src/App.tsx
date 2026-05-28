import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Footer from './components/Footer';

const sidebarContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 1.0 } },
};

const sidebarItem = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

function Sidebar() {
  return (
    <motion.aside
      variants={sidebarContainer}
      initial="hidden"
      animate="visible"
      className="fixed left-0 top-0 bottom-0 w-12 hidden lg:flex flex-col items-center justify-center gap-5 z-40"
    >
      <motion.a
        variants={sidebarItem}
        href="https://github.com/aswin2002"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted hover:text-accent transition-colors duration-200"
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
      >
        <FiGithub size={17} />
      </motion.a>
      <motion.a
        variants={sidebarItem}
        href="https://www.linkedin.com/in/aswyyyn/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted hover:text-accent transition-colors duration-200"
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
      >
        <FiLinkedin size={17} />
      </motion.a>
      <motion.a
        variants={sidebarItem}
        href="https://www.instagram.com/aswyyyn/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted hover:text-accent transition-colors duration-200"
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
      >
        <FiInstagram size={17} />
      </motion.a>
      <motion.div
        variants={sidebarItem}
        className="w-px h-16 bg-white/15 mt-2"
      />
    </motion.aside>
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
