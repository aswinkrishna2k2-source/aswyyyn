import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-[#1b1b1b] border border-white/10 text-muted hover:text-accent hover:border-accent/40 transition-colors duration-200 shadow-lg"
        >
          <FiArrowUp size={17} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
