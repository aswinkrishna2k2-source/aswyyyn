import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useDragControls, type PanInfo } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { EASE } from '../../lib/motion';
import { getLenis } from '../../lib/smoothScroll';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  /** 'sheet' slides up from the bottom on phones and floats centred on wider screens */
  variant?: 'sheet' | 'fullscreen';
  size?: 'md' | 'lg';
}

export default function Dialog({ open, onClose, labelledBy, children, variant = 'sheet', size = 'md' }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const wide = useMediaQuery('(min-width: 768px)');
  const dragControls = useDragControls();
  const isSheet = variant === 'sheet';
  const draggable = isSheet && !wide;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    getLenis()?.stop();

    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      (panel?.querySelector<HTMLElement>('[data-autofocus]') ?? panel)?.focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      const panel = panelRef.current;
      if (e.key !== 'Tab' || !panel) return;
      const nodes = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === first || current === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      root.style.overflow = prevOverflow;
      getLenis()?.start();
      previous?.focus({ preventScroll: true });
    };
  }, [open]);

  const panelMotion = !isSheet
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : wide
      ? { initial: { opacity: 0, y: 24, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 16, scale: 0.98 } }
      : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) onCloseRef.current();
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div key="dialog" className="fixed inset-0 z-[90]">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onCloseRef.current()}
          />
          <div
            className={`pointer-events-none absolute inset-0 flex ${
              isSheet ? 'items-end md:items-center md:justify-center md:p-6' : ''
            }`}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledBy}
              tabIndex={-1}
              {...panelMotion}
              transition={{ duration: 0.45, ease: EASE }}
              drag={draggable ? 'y' : false}
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={onDragEnd}
              className={`pointer-events-auto relative flex flex-col outline-none ${
                isSheet
                  ? `max-h-[88svh] w-full overflow-hidden rounded-t-[1.75rem] border border-white/10 bg-ink-raised pb-[env(safe-area-inset-bottom)] shadow-[0_-24px_64px_-24px_rgba(0,0,0,0.8)] md:rounded-[1.75rem] md:pb-0 ${
                      size === 'lg' ? 'md:max-w-2xl' : 'md:max-w-lg'
                    }`
                  : 'h-full w-full'
              }`}
            >
              {draggable && (
                <div
                  aria-hidden
                  onPointerDown={(e) => dragControls.start(e)}
                  className="flex shrink-0 cursor-grab touch-none justify-center pb-1 pt-3"
                >
                  <span className="h-1.5 w-10 rounded-full bg-white/25" />
                </div>
              )}
              <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
