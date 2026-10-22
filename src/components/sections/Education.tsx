import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiMaximize2 } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import Lightbox from '../ui/Lightbox';
import { certificates } from '../../data/certificates';
import { education } from '../../data/profile';
import { EASE, pad2 } from '../../lib/motion';
import { gsap, ScrollTrigger, useScrollScene } from '../../lib/gsap';

const total = certificates.length;

function Paper({ i }: { i: number }) {
  const c = certificates[i];
  return (
    <span className="block aspect-[4/3] overflow-hidden rounded-xl bg-[#f4f4ef] md:rounded-2xl">
      <img src={c.image} alt={`${c.title} — ${c.issuer}`} loading="lazy" draggable={false} className="h-full w-full object-contain p-1.5 md:p-2" />
    </span>
  );
}

/**
 * Cover-flow: certificates sit in a row in 3D space. Scrolling glides the row sideways; the one
 * in the middle faces you flat with a reflection underneath, its neighbours tilt away and dim.
 */
function CoverFlow({ onOpen }: { onOpen: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const cert = certificates[active];

  useScrollScene(ref, ({ isDesktop }) => {
    const cards = gsap.utils.toArray<HTMLElement>('.cf-card');
    const shades = cards.map((c) => c.querySelector<HTMLElement>('.cf-shade')!);
    const proxy = { p: 0 };
    let last = -1;
    gsap.set(cards, { xPercent: -50, yPercent: -50 });

    const render = () => {
      const width = cards[0].offsetWidth;
      const spacing = width * (isDesktop ? 0.58 : 0.62);
      cards.forEach((card, i) => {
        const d = i - proxy.p;
        const ad = Math.abs(d);
        gsap.set(card, {
          x: d * spacing,
          z: -Math.min(ad, 3) * 170,
          rotateY: gsap.utils.clamp(-52, 52, -d * 48),
          scale: 1 - Math.min(ad, 2) * 0.06,
          opacity: ad > 2.4 ? 0 : 1 - Math.max(0, ad - 1.4),
          zIndex: 100 - Math.round(ad * 10),
        });
        gsap.set(shades[i], { opacity: Math.min(ad, 1) * 0.55 });
      });
      const idx = Math.round(proxy.p);
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
    };

    render();
    gsap.to(proxy, {
      p: total - 1,
      ease: 'none',
      onUpdate: render,
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom bottom', scrub: 0.7 },
    });
    ScrollTrigger.addEventListener('refresh', render);
    return () => ScrollTrigger.removeEventListener('refresh', render);
  });

  return (
    <div ref={ref} className="relative" style={{ height: `${total * 50 + 100}svh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pb-8 pt-16 md:pb-28 md:pt-12">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-8">
          <p className="label text-muted">Certificates</p>
          <p className="label text-muted">
            <span className="text-fg">{pad2(active + 1)}</span> / {pad2(total)}
          </p>
        </div>

        {/* the 3D stage */}
        <div className="relative mt-6 h-[calc(min(80vw,520px)*0.75+3rem)] md:mt-8 md:h-[calc(min(38vw,520px)*0.75+4rem)]">
          {/* perspective on the list (no shared 3D space) so tilted neighbours layer by z-index instead of slicing through each other */}
          <ul className="absolute inset-0 [perspective:1300px]">
            {certificates.map((c, i) => (
              <li key={c.id} className="cf-card absolute left-1/2 top-1/2 w-[min(80vw,520px)] will-change-transform md:w-[min(38vw,520px)]">
                <button
                  type="button"
                  onClick={() => onOpen(i)}
                  aria-label={`Open certificate: ${c.title}`}
                  className="group relative block w-full rounded-2xl border border-white/10 bg-ink-raised p-1.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] [-webkit-box-reflect:below_10px_linear-gradient(transparent_78%,rgba(255,255,255,0.1))] md:rounded-[1.4rem] md:p-2"
                >
                  <Paper i={i} />
                  <span aria-hidden className="cf-shade pointer-events-none absolute inset-0 rounded-[inherit] bg-ink" />
                  <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink/85 text-fg opacity-0 transition group-hover:opacity-100 md:right-4 md:top-4">
                    <FiMaximize2 size={14} aria-hidden />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* details of the certificate in the middle */}
        <div className="mx-auto mt-8 w-full max-w-2xl px-4 text-center md:mt-10" aria-live="polite">
          <div className="relative h-[6.5rem] overflow-hidden md:h-[6rem]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={cert.id}
                initial={{ y: 40, opacity: 0, filter: 'blur(6px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: -30, opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: EASE }}
                className="absolute inset-x-0 top-0"
              >
                <p className="label text-accent">
                  {cert.issuer} · {cert.date}
                </p>
                <p className="mt-3 text-balance text-xl font-semibold leading-snug tracking-tight md:text-2xl">{cert.title}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex gap-1.5" aria-hidden>
              {certificates.map((c, i) => (
                <span
                  key={c.id}
                  className={`h-1.5 rounded-full transition-all duration-500 ease-story ${i === active ? 'w-6 bg-accent' : 'w-1.5 bg-white/20'}`}
                />
              ))}
            </div>
            <button type="button" onClick={() => onOpen(active)} className="btn btn-ghost !min-h-[40px] !px-4 !text-sm">
              <FiMaximize2 aria-hidden /> View certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Reduced motion: a plain swipeable row. */
function CertRow({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <div className="px-4 pb-20 pt-14 md:px-8">
      <ul className="no-scrollbar mx-auto flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto">
        {certificates.map((c, i) => (
          <li key={c.id} className="w-[80%] shrink-0 snap-start sm:w-[360px]">
            <button type="button" onClick={() => onOpen(i)} className="block w-full text-left" aria-label={`Open certificate: ${c.title}`}>
              <span className="block rounded-2xl border border-white/10 bg-ink-raised p-1.5">
                <Paper i={i} />
              </span>
              <span className="label mt-4 block text-accent">
                {c.issuer} · {c.date}
              </span>
              <span className="mt-2 block font-semibold leading-snug">{c.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Education() {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <section id="education" aria-labelledby="education-title" className="relative">
      <div className="px-4 pt-20 md:px-8 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            id="education"
            title="Always *learning.*"
            intro="Degrees, an internship and the courses since. Scroll through the certificates; tap one to open it."
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
        </div>
      </div>

      {reduce ? <CertRow onOpen={setOpen} /> : <CoverFlow onOpen={setOpen} />}

      <Lightbox
        items={certificates.map((c) => ({ src: c.image, alt: `${c.title} — ${c.issuer}`, caption: `${c.title} · ${c.issuer}, ${c.date}` }))}
        index={open}
        onChange={setOpen}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}
