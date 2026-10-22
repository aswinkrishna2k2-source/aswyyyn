import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiX } from 'react-icons/fi';
import Dialog from './Dialog';
import { EASE } from '../../lib/motion';

export interface LightboxItem {
  src: string;
  alt: string;
  caption: string;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}

const slide = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
};

export default function Lightbox({ items, index, onChange, onClose }: LightboxProps) {
  const [dir, setDir] = useState(0);
  const lastIndex = useRef(0);
  if (index !== null) lastIndex.current = index;
  const shown = index ?? lastIndex.current;
  const item = items[shown];
  const many = items.length > 1;

  const go = (step: number) => {
    setDir(step);
    onChange((shown + step + items.length) % items.length);
  };

  useEffect(() => {
    if (index === null || !many) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  if (!item) return null;

  return (
    <Dialog open={index !== null} onClose={onClose} labelledBy="lightbox-caption" variant="fullscreen">
      <div className="flex h-full flex-col bg-ink-deep/95">
        <div className="flex items-center justify-between px-4 pb-2 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:px-8">
          <span className="label text-muted">
            {shown + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            data-autofocus
            aria-label="Close"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition hover:border-white/40"
          >
            <FiX aria-hidden />
          </button>
        </div>

        <div
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 md:px-20"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.img
              key={item.src}
              src={item.src}
              alt={item.alt}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: EASE }}
              drag={many ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
              draggable={false}
              className="max-h-full max-w-full select-none rounded-2xl object-contain"
            />
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 md:px-8">
          <p id="lightbox-caption" className="min-w-0 flex-1 text-sm text-muted">
            {item.caption}
          </p>
          {many && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous"
                className="grid h-12 w-12 place-items-center rounded-full border border-white/15 transition hover:border-accent hover:text-accent"
              >
                <FiArrowLeft aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next"
                className="grid h-12 w-12 place-items-center rounded-full bg-accent text-ink transition active:scale-95"
              >
                <FiArrowRight aria-hidden />
              </button>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}
