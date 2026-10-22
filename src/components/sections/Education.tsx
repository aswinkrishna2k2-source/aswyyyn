import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiMaximize2 } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import Lightbox from '../ui/Lightbox';
import { certificates } from '../../data/certificates';
import { education } from '../../data/profile';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { EASE, pad2 } from '../../lib/motion';

const total = certificates.length;

/**
 * One certificate: the paper on a cream mount, then issuer, date and title. On devices with a mouse
 * the card tilts toward the cursor with a soft sheen following it.
 */
function CertCard({ i, onOpen, big = false, className = '' }: { i: number; onOpen: (i: number) => void; big?: boolean; className?: string }) {
  const c = certificates[i];
  const ref = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const tilt = fine && !reduce;

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el || !tilt) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * (big ? 6 : 9)}deg) rotateY(${(x - 0.5) * (big ? 8 : 12)}deg) translateY(-4px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(i)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={`Open certificate: ${c.title}`}
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-ink-raised p-2 text-left transition-[transform,border-color,box-shadow] duration-300 ease-story hover:border-accent/40 hover:shadow-[0_30px_60px_-24px_rgba(0,0,0,0.9)] md:p-2.5 ${className}`}
    >
      <span className={`relative block overflow-hidden rounded-[1.1rem] bg-[#f4f4ef] ${big ? 'min-h-0 flex-1' : 'aspect-[4/3]'}`}>
        <img
          src={c.image}
          alt=""
          loading="lazy"
          draggable={false}
          className={`absolute inset-0 h-full w-full object-contain transition-transform duration-500 ease-story group-hover:scale-[1.03] ${big ? 'p-3 md:p-5' : 'p-1.5 md:p-2'}`}
        />
        {/* sheen that follows the cursor */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.35), transparent 45%)' }}
        />
        <span className="absolute right-2.5 top-2.5 flex h-8 items-center gap-1.5 rounded-full bg-ink/85 px-3 text-xs font-semibold text-fg opacity-0 backdrop-blur transition group-hover:opacity-100 md:right-3 md:top-3">
          <FiMaximize2 size={12} aria-hidden /> View
        </span>
      </span>
      <span className="block px-2 pb-1.5 pt-3.5 md:px-2.5">
        <span className="label flex items-center justify-between gap-3 text-accent">
          <span className="truncate">{c.issuer}</span>
          <span className="shrink-0 text-muted">{c.date}</span>
        </span>
        <span className={`mt-2 block font-semibold leading-snug tracking-tight ${big ? 'text-xl md:text-2xl' : 'line-clamp-2 text-[15px]'}`}>{c.title}</span>
      </span>
    </button>
  );
}

/** Tablet & desktop: every certificate at a glance in a bento grid; the first one large. */
function CertGrid({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <ul className="grid grid-cols-4 gap-4 [perspective:1400px] lg:gap-5">
      {certificates.map((c, i) => (
        <motion.li
          key={c.id}
          initial={{ opacity: 0, y: 70, rotateX: -16, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={{ duration: 0.9, ease: EASE, delay: i * 0.09 }}
          className={i === 0 ? 'col-span-2 row-span-2' : 'col-span-1'}
        >
          <CertCard i={i} onOpen={onOpen} big={i === 0} />
        </motion.li>
      ))}
    </ul>
  );
}

/**
 * Phones: a swipeable row that snaps each certificate to the centre. The centred card sits full
 * size; its neighbours ease back and dim, so it's always clear which one you're on.
 */
function CertCarousel({ onOpen }: { onOpen: (i: number) => void }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      [...track.children].forEach((child, i) => {
        const el = child as HTMLElement;
        const center = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.min(1, Math.abs(center - mid) / el.offsetWidth);
        if (!reduce) {
          const card = el.firstElementChild as HTMLElement | null;
          if (card) {
            card.style.transform = `scale(${1 - d * 0.08})`;
            card.style.opacity = String(1 - d * 0.45);
          }
        }
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    track.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [reduce]);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const el = track?.children[i] as HTMLElement | undefined;
    if (!track || !el) return;
    track.scrollTo({ left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div>
      <motion.ul
        ref={trackRef}
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 0.9, ease: EASE }}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-[9vw] pb-2"
      >
        {certificates.map((c, i) => (
          <li key={c.id} className="w-[82vw] shrink-0 snap-center">
            <div className="h-full origin-center will-change-transform">
              <CertCard i={i} onOpen={onOpen} />
            </div>
          </li>
        ))}
      </motion.ul>

      <div className="mt-5 flex items-center justify-between px-4">
        <div className="flex items-center gap-1">
          {certificates.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show certificate ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
              className="grid h-8 place-items-center px-1"
            >
              <span className={`block h-1.5 rounded-full transition-all duration-500 ease-story ${i === active ? 'w-6 bg-accent' : 'w-1.5 bg-white/25'}`} />
            </button>
          ))}
        </div>
        <p className="label text-muted" aria-live="polite">
          <span className="text-fg">{pad2(active + 1)}</span> / {pad2(total)}
          <span className="ml-2 text-muted/60">· Swipe</span>
        </p>
      </div>
    </div>
  );
}

export default function Education() {
  const [open, setOpen] = useState<number | null>(null);
  const wide = useMediaQuery('(min-width: 768px)');

  return (
    <section id="education" aria-labelledby="education-title" className="relative pb-20 md:pb-36">
      <div className="px-4 pt-20 md:px-8 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            id="education"
            title="Always *learning.*"
            intro="The degrees, internship and courses behind the work."
          />

          <ol className="mt-12 overflow-hidden border-t border-white/10">
            {education.map((e, i) => (
              <motion.li
                key={e.degree}
                initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
                className="grid gap-1 border-b border-white/10 py-6 md:grid-cols-12 md:items-baseline md:gap-6"
              >
                <span className="label text-accent md:col-span-3">{e.period}</span>
                <span className="text-2xl font-semibold tracking-tight md:col-span-6 md:text-3xl">{e.degree}</span>
                <span className="story-serif text-xl text-muted md:col-span-3 md:text-right md:text-2xl">{e.school}</span>
              </motion.li>
            ))}
          </ol>

          <div className="mt-16 flex items-end justify-between gap-4 md:mt-24">
            <h3 className="text-3xl font-bold tracking-tight md:text-5xl">
              Certi<span className="story-serif font-normal text-accent">ficates</span>
            </h3>
            <p className="label pb-1 text-muted">{pad2(total)} earned</p>
          </div>
          <span aria-hidden className="mt-5 block h-px bg-white/10" />
        </div>
      </div>

      {/* clip sideways so the carousel's slide-in offset can never widen the page */}
      <div className="mt-8 overflow-x-clip md:mt-10 md:px-8">
        <div className="mx-auto max-w-6xl">{wide ? <CertGrid onOpen={setOpen} /> : <CertCarousel onOpen={setOpen} />}</div>
      </div>

      <Lightbox
        items={certificates.map((c) => ({ src: c.image, alt: `${c.title} — ${c.issuer}`, caption: `${c.title} · ${c.issuer}, ${c.date}` }))}
        index={open}
        onChange={setOpen}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}
