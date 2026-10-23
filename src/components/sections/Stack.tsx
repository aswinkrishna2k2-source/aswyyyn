import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { IconType } from 'react-icons';
import { FaAws } from 'react-icons/fa';
import {
  SiAndroidstudio,
  SiBootstrap,
  SiCss,
  SiExpo,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiGit,
  SiHostinger,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiSocketdotio,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiWordpress,
} from 'react-icons/si';
import { TbApi, TbBrandAdobePremier } from 'react-icons/tb';
import SectionHeading from '../ui/SectionHeading';
import { skills, type SkillCategory } from '../../data/skills';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { EASE, pad2 } from '../../lib/motion';
import { gsap, useScrollScene } from '../../lib/gsap';
import { scrollToTarget } from '../../lib/smoothScroll';

const LOGOS: Record<string, IconType> = {
  'React.js': SiReact,
  'Next.js': SiNextdotjs,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  'Tailwind CSS': SiTailwindcss,
  HTML5: SiHtml5,
  CSS3: SiCss,
  Bootstrap: SiBootstrap,
  'React Native': SiReact,
  Expo: SiExpo,
  'Android Studio': SiAndroidstudio,
  'Node.js': SiNodedotjs,
  'Express.js': SiExpress,
  'Socket.io': SiSocketdotio,
  'REST APIs': TbApi,
  MongoDB: SiMongodb,
  MySQL: SiMysql,
  Supabase: SiSupabase,
  Firebase: SiFirebase,
  WordPress: SiWordpress,
  AWS: FaAws,
  Hostinger: SiHostinger,
  Vercel: SiVercel,
  Figma: SiFigma,
  'Adobe Premiere Pro': TbBrandAdobePremier,
  Git: SiGit,
};

const total = skills.length;
const TITLE = 'My *stack.*';
const INTRO = 'The tools I use to design, build and ship.';

const toolCount = (n: number) => `${n} tool${n === 1 ? '' : 's'}`;

const tileClass =
  'group relative flex aspect-[5/4] flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-3 transition-colors duration-300 hover:border-accent/50 md:aspect-[4/3] md:rounded-3xl md:p-5';

function TileContent({ name, i }: { name: string; i: number }) {
  const Logo = LOGOS[name];
  return (
    <>
      <span className="label text-[10px] text-muted/50 md:text-[11px]">{pad2(i + 1)}</span>
      {Logo && (
        <Logo
          aria-hidden
          className="absolute right-3 top-3 h-6 w-6 text-muted/60 transition-colors duration-300 group-hover:text-accent md:right-5 md:top-5 md:h-8 md:w-8"
        />
      )}
      <span className="text-[13px] font-semibold leading-tight tracking-tight md:text-lg">{name}</span>
    </>
  );
}

// ── Desktop: pinned scene that steps through the categories ─────────────────

function DealtTiles({ cat }: { cat: SkillCategory }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.ul key={cat.category} className="grid grid-cols-4 gap-3">
        {cat.skills.map((s, i) => (
          <motion.li
            key={s}
            layout="position"
            initial={{ opacity: 0, y: 28, scale: 0.94, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(6px)', transition: { duration: 0.18 } }}
            transition={{ duration: 0.55, ease: EASE, delay: i * 0.045 }}
            className={tileClass}
          >
            <TileContent name={s} i={i} />
          </motion.li>
        ))}
      </motion.ul>
    </AnimatePresence>
  );
}

/**
 * The category index sits big on the left (current one in lime, the rest as faint outlines) with
 * a rail that fills as you scroll; the current category's tools re-deal as logo tiles.
 */
function PinnedScene() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const cat = skills[active];

  useScrollScene(ref, () => {
    gsap.fromTo(
      '.k-progress',
      { scale: 0 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => setActive(Math.min(total - 1, Math.floor(self.progress * total))),
        },
      },
    );
  });

  // Clicking a category scrolls to the point in the scene where it's shown
  const jumpTo = (i: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const top = stage.getBoundingClientRect().top + window.scrollY;
    const span = stage.offsetHeight - window.innerHeight;
    scrollToTarget(top + span * ((i + 0.5) / total));
  };

  return (
    <section id="stack" ref={ref} aria-labelledby="stack-title" className="relative">
      <div className="px-8 pt-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading id="stack" title={TITLE} intro={INTRO} />
        </div>
      </div>

      <div ref={stageRef} className="relative" style={{ height: `${total * 60 + 40}svh` }}>
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-8 pb-32 pt-16">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-12 gap-12">
            <div className="col-span-5 flex gap-6">
              <span aria-hidden className="relative w-[2px] shrink-0 rounded-full bg-white/10">
                <span className="k-progress absolute inset-0 origin-top bg-accent" />
              </span>
              <ol className="space-y-1">
                {skills.map((c, i) => {
                  const on = i === active;
                  return (
                    <li key={c.category}>
                      <button
                        type="button"
                        onClick={() => jumpTo(i)}
                        aria-current={on ? 'true' : undefined}
                        className="group flex items-baseline gap-4 py-1 text-left"
                      >
                        <span className={`label w-6 transition-colors duration-300 ${on ? 'text-accent' : 'text-muted/50'}`}>{pad2(i + 1)}</span>
                        <span
                          className={`display text-[clamp(2.5rem,min(4.6vw,7svh),4.25rem)] transition-all duration-500 ease-story ${
                            on ? 'translate-x-2 text-accent' : 'text-outline-soft group-hover:text-white/40'
                          }`}
                        >
                          {c.category}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="col-span-7 self-start pt-3">
              <div className="mb-4 flex items-center justify-between">
                <p className="label text-muted">
                  {cat.category} · <span className="text-fg">{toolCount(cat.skills.length)}</span>
                </p>
                <p className="label text-muted">
                  <span className="text-fg">{pad2(active + 1)}</span> / {pad2(total)}
                </p>
              </div>
              <DealtTiles cat={cat} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Phones (and reduced motion): a compact list, each category's tools as logo pills ──

const pill = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

function CompactList() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="px-4 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="stack" title={TITLE} intro={INTRO} />

        <div className="mt-10 border-t border-white/10 md:mt-14">
          {skills.map((c, ci) => (
            <div key={c.category} className="border-b border-white/10 py-5 md:grid md:grid-cols-12 md:gap-6 md:py-7">
              <div className="mb-3.5 flex items-baseline justify-between gap-4 md:col-span-3 md:mb-0 md:block">
                <h3 className="flex items-baseline gap-2.5">
                  <span className="label text-accent">{pad2(ci + 1)}</span>
                  <span className="text-lg font-semibold tracking-tight">{c.category}</span>
                </h3>
                <p className="label text-muted/60 md:mt-1.5 md:pl-[2.1rem]">{toolCount(c.skills.length)}</p>
              </div>
              <motion.ul
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ staggerChildren: 0.04 }}
                className="flex flex-wrap gap-2 md:col-span-9"
              >
                {c.skills.map((s) => {
                  const Logo = LOGOS[s];
                  return (
                    <motion.li
                      key={s}
                      variants={pill}
                      className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] pl-3 pr-3.5 text-sm font-medium tracking-tight"
                    >
                      {Logo && <Logo aria-hidden className="h-4 w-4 shrink-0 text-muted" />}
                      {s}
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Stack() {
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 768px)');
  return wide && !reduce ? <PinnedScene /> : <CompactList />;
}
