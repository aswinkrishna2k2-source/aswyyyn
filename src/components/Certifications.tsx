import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiX, FiAward } from 'react-icons/fi';
import { fadeInLeft, viewport } from '../utils/animations';
import { font } from '../utils/fontsize';
import { certificates } from '../data/certificates';

const AUTOPLAY_SECONDS = 4;
const TRANSITION_SECONDS = 1;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

export default function Certifications() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(AUTOPLAY_SECONDS);

  const paused = isHovered || lightboxOpen;
  const total = certificates.length;
  const cert = certificates[current];

  const goTo = (index: number) => {
    const next = (index + total) % total;
    setDirection(next > current || (current === total - 1 && next === 0) ? 1 : -1);
    setCurrent(next);
    setSecondsLeft(AUTOPLAY_SECONDS);
  };

  useEffect(() => {
    if (paused) return;
    const tick = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setDirection(1);
          setCurrent((c) => (c + 1) % total);
          return AUTOPLAY_SECONDS;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [paused, total]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') goTo(current + 1);
      if (e.key === 'ArrowLeft') goTo(current - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, current]);

  return (
    <section id="certifications" className="py-20 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="section-header"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className={`section-title ${font.sectionTitle}`}>
            <span className="text-accent">#</span>certifications
          </h2>
          <div className="section-line" />
        </motion.div>

        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid lg:grid-cols-[1fr_280px] gap-6"
        >
          {/* Main display */}
          <div
            className="relative select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative cert-frame overflow-hidden h-[260px] sm:h-[400px] lg:h-[440px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.img
                  key={cert.id}
                  src={cert.image}
                  alt={`${cert.title} certificate`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: TRANSITION_SECONDS, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0 w-full h-full object-contain cursor-zoom-in p-3 sm:p-6"
                  onClick={() => setLightboxOpen(true)}
                />
              </AnimatePresence>

              <span className={`cert-timer-badge absolute top-3 right-3 ${font.certMeta} px-2.5 py-1 pointer-events-none`}>
                {String(secondsLeft).padStart(2, '0')}s
              </span>

              <button
                className="carousel-nav-btn absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-opacity duration-200"
                style={{ opacity: isHovered ? 1 : 0 }}
                onClick={() => goTo(current - 1)}
                aria-label="Previous certificate"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                className="carousel-nav-btn absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-opacity duration-200"
                style={{ opacity: isHovered ? 1 : 0 }}
                onClick={() => goTo(current + 1)}
                aria-label="Next certificate"
              >
                <FiChevronRight size={18} />
              </button>
            </div>

            {/* Timer / progress track */}
            <div className="flex gap-1.5 mt-3">
              {certificates.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${c.title}`}
                  className="carousel-timer-track h-[3px] flex-1 overflow-hidden"
                >
                  {i < current && <div className="h-full w-full" style={{ background: 'rgb(var(--accent))' }} />}
                  {i === current && (
                    <div
                      key={`${current}-${paused}`}
                      className={`carousel-timer-fill h-full ${paused ? 'paused' : ''}`}
                      style={{ animationDuration: `${AUTOPLAY_SECONDS}s` }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="mt-4"
              >
                <h4 className={`${font.certTitle} font-semibold text-fg leading-snug`}>
                  {cert.title}
                </h4>
                <p className={`${font.certIssuer} text-accent mt-1`}>
                  {cert.issuer} <span className="text-muted">— {cert.date}</span>
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Mobile / tablet picker — wrapping grid, no scrollbar */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 lg:hidden">
              {certificates.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => goTo(i)}
                  aria-label={`View ${c.title}`}
                  className={`cert-thumb flex flex-col items-center justify-center gap-1 py-2.5 px-1 text-center ${
                    i === current ? 'active' : ''
                  }`}
                >
                  <FiAward size={15} style={{ color: 'rgb(var(--accent))' }} />
                  <span className={`${font.certMeta} text-fg truncate w-full leading-tight`}>{c.issuer}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Thumbnail rail — desktop only */}
          <div className="hidden lg:flex lg:flex-col gap-2.5">
            {certificates.map((c, i) => (
              <button
                key={c.id}
                onClick={() => goTo(i)}
                aria-label={`View ${c.title}`}
                className={`cert-thumb flex items-center gap-2.5 p-2 w-full text-left ${
                  i === current ? 'active' : ''
                }`}
              >
                <span
                  className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                  style={{ color: 'rgb(var(--accent))' }}
                >
                  <FiAward size={18} />
                </span>
                <span className="min-w-0">
                  <span className={`block ${font.certMeta} text-fg truncate`}>{c.issuer}</span>
                  <span className={`block ${font.certMeta} text-muted`}>{c.date}</span>
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-5 right-5 text-muted hover:text-accent transition-colors"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              <FiX size={26} />
            </button>
            <button
              className="absolute left-5 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors"
              onClick={(e) => { e.stopPropagation(); goTo(current - 1); }}
              aria-label="Previous"
            >
              <FiChevronLeft size={28} />
            </button>
            <button
              className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors"
              onClick={(e) => { e.stopPropagation(); goTo(current + 1); }}
              aria-label="Next"
            >
              <FiChevronRight size={28} />
            </button>
            <motion.img
              key={cert.id}
              src={cert.image}
              alt={`${cert.title} certificate`}
              className="max-w-full max-h-full object-contain bg-white"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            />
            <span className={`absolute bottom-6 ${font.small} text-muted`}>
              {cert.title} · {current + 1} / {total}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
