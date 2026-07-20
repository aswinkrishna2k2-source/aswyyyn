import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { font } from '../utils/fontsize';

const AUTOPLAY_MS = 4500;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -48 : 48, opacity: 0 }),
};

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const singleImage = images.length <= 1;
  const paused = isHovered || lightboxOpen || singleImage;

  const goTo = (index: number) => {
    if (singleImage) return;
    const next = (index + images.length) % images.length;
    setDirection(next > current || (current === images.length - 1 && next === 0) ? 1 : -1);
    setCurrent(next);
  };

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
    <>
      <div
        className="relative select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative project-card overflow-hidden ${singleImage ? '' : 'h-[280px] sm:h-[420px]'}`}>
          {singleImage ? (
            <img
              src={images[0]}
              alt={`${alt} screenshot`}
              className="block w-full h-auto cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            />
          ) : (
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.img
                key={current}
                src={images[current]}
                alt={`${alt} screenshot ${current + 1}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 w-full h-full object-contain bg-black/20 cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              />
            </AnimatePresence>
          )}

          {!singleImage && (
            <span
              className={`absolute top-3 right-3 ${font.small} px-2 py-0.5 border backdrop-blur-sm text-accent border-accent/50 bg-[#1b1b1b]/70 pointer-events-none`}
            >
              {current + 1} / {images.length}
            </span>
          )}

          {images.length > 1 && (
            <>
              <button
                className="carousel-nav-btn absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-opacity duration-200"
                style={{ opacity: isHovered ? 1 : 0 }}
                onClick={() => goTo(current - 1)}
                aria-label="Previous image"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                className="carousel-nav-btn absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-opacity duration-200"
                style={{ opacity: isHovered ? 1 : 0 }}
                onClick={() => goTo(current + 1)}
                aria-label="Next image"
              >
                <FiChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-1.5 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className="carousel-timer-track h-[3px] flex-1 overflow-hidden"
              >
                {i < current && <div className="h-full w-full" style={{ background: 'rgb(var(--accent))' }} />}
                {i === current && (
                  <div
                    key={current}
                    className={`carousel-timer-fill h-full ${paused ? 'paused' : ''}`}
                    style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                    onAnimationEnd={() => { if (!isHovered && !lightboxOpen) goTo(current + 1); }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
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
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors"
                  onClick={e => { e.stopPropagation(); goTo(current - 1); }}
                  aria-label="Previous"
                >
                  <FiChevronLeft size={28} />
                </button>
                <button
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors"
                  onClick={e => { e.stopPropagation(); goTo(current + 1); }}
                  aria-label="Next"
                >
                  <FiChevronRight size={28} />
                </button>
              </>
            )}
            <motion.img
              key={current}
              src={images[current]}
              alt=""
              className="max-w-full max-h-full object-contain"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
            />
            {!singleImage && (
              <span className={`absolute bottom-6 ${font.small} text-muted`}>
                {current + 1} / {images.length}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
