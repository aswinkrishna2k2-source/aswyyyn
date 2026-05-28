import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCode } from 'react-icons/fi';
import { font } from '../utils/fontsize';

const navLinks = [
  { label: 'home',     href: '#home'     },
  { label: 'works',    href: '#works'    },
  { label: 'skills',   href: '#skills'   },
  { label: 'about-me', href: '#about-me' },
  { label: 'contact',  href: '#contact'  },
];

export default function Navbar() {
  const [active, setActive] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string, label: string) => {
    setActive(label);
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden backdrop-blur-sm bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-[#1b1b1b]/95 backdrop-blur-sm border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 lg:px-16 flex items-center justify-between h-16">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNav('#home', 'home'); }}
            className={`text-fg font-bold ${font.navLogo} hover:text-accent transition-colors duration-200`}
          >
            <FiCode className="text-accent" size={22} />
          </a>

          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNav(link.href, link.label)}
                  className={`${font.navLink} transition-colors duration-200 ${
                    active === link.label ? 'text-fg' : 'text-muted hover:text-fg'
                  }`}
                >
                  <span className="text-accent">#</span>{link.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            className="md:hidden text-muted hover:text-fg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 space-y-1.5">
              <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden bg-[#1b1b1b]/95 border-t border-white/5 px-6 py-4 space-y-4"
            >
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href, link.label)}
                  className={`block ${font.navLink} text-muted hover:text-fg transition-colors w-full text-left`}
                >
                  <span className="text-accent">#</span>{link.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
