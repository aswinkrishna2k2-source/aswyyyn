import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useSections } from '../layout/SectionProvider';
import { profile } from '../../data/profile';
import { EASE } from '../../lib/motion';
import { gsap, useScrollScene } from '../../lib/gsap';

const NAME = 'ASWIN.';
const ZOOM_LETTER = NAME.indexOf('I'); // the camera flies into the stem of the I

/**
 * One copy of the giant name. Two identical copies are stacked around the portrait:
 * solid behind it and outlined in front, so the name reads solid on the background and
 * as an outline wherever it crosses the photo.
 */
function NameLayer({ variant, ready }: { variant: 'solid' | 'outline'; ready: boolean }) {
  return (
    <div aria-hidden className={`p-name hero-name ${variant === 'solid' ? 'z-0 text-accent' : 'p-outline text-outline z-20'}`}>
      {Array.from(NAME).map((ch, i) => (
        <span key={i} className={`inline-block ${i === ZOOM_LETTER ? 'p-i' : ''}`}>
          <motion.span
            className="inline-block"
            initial={{ y: '40%', opacity: 0 }}
            animate={ready ? { y: '0%', opacity: 1 } : undefined}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 + i * 0.06 }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

/**
 * "Hi, I'm" sits directly above the A and the role + tagline directly below it. An invisible copy
 * of the name, set with exactly the same metrics as the real layers, gives us the A's left edge
 * and the name's top/bottom at every screen size.
 *
 * The wrapper inherits the name's huge font size, and letter-spacing in em resolves to an absolute
 * length there, so every line below sets its own size, weight and tracking.
 */
function Greeting({ ready }: { ready: boolean }) {
  return (
    <div aria-hidden className="hero-name pointer-events-none z-30">
      <span className="relative inline-block">
        <span className="invisible">
          {Array.from(NAME).map((ch, i) => (
            <span key={i} className="inline-block">
              {ch}
            </span>
          ))}
        </span>
        <span className="p-hi absolute bottom-full left-0 mb-3 block md:-mb-[0.03em]">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            className="story-serif -ml-[0.02em] block whitespace-nowrap text-[clamp(2rem,3.4vw,3.25rem)] leading-none text-fg"
          >
            <span className="text-accent">Hi,</span> I'm
          </motion.span>
        </span>
        <span className="p-sub absolute inset-x-0 top-full mt-2 block whitespace-normal text-left leading-none">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
            className="block"
          >
            <span className="block text-[clamp(1rem,4.4vw,1.5rem)] font-semibold leading-[1.25] tracking-[-0.02em] text-fg">
              Full Stack Developer<span className="text-accent">.</span> UI/UX Designer<span className="text-accent">.</span>
            </span>
            <span className="story-serif mt-1 block text-[clamp(1.5rem,6.6vw,2.25rem)] leading-[1.05] text-fg">
              Engineering for the <span className="text-accent">AI Era.</span>
            </span>
          </motion.span>
        </span>
      </span>
    </div>
  );
}

/**
 * Tells first-time visitors the page continues. Fades in once the intro has settled, bobs gently,
 * fades out as soon as scrolling starts, and scrolls down for anyone who taps it instead.
 */
function ScrollCue({ ready, onClick }: { ready: boolean; onClick: () => void }) {
  // z-[45] keeps the cue above the lime fill layer (z-40), which stays hit-testable for the logo colour check
  return (
    <div className="p-hint pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] z-[45] flex justify-center md:bottom-32">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8, ease: EASE, delay: 1.3 }}
      >
        <button
          type="button"
          onClick={onClick}
          aria-label="Scroll down to see more"
          className="pointer-events-auto flex h-10 animate-nudge items-center gap-2.5 rounded-full border border-white/15 bg-ink/75 px-4 backdrop-blur-md transition-colors hover:border-accent"
        >
          <span aria-hidden className="relative h-4 w-[2px] overflow-hidden rounded-full bg-white/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-hint rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-fg">Scroll</span>
        </button>
      </motion.div>
    </div>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const { goTo } = useSections();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  /*
   * Scroll scene. "Hi, I'm" clears away while ASWIN grows straight through the portrait
   * (outlined where it crosses the photo, solid everywhere else). On phones it also travels down
   * onto the face. Then the photo fades and the name dives into the I until the screen is lime,
   * which is exactly the colour the About section opens on.
   */
  useScrollScene(sectionRef, ({ isDesktop }) => {
    const stage = stageRef.current!;
    const layers = gsap.utils.toArray<HTMLElement>('.p-name');
    const letter = layers[0].querySelector<HTMLElement>('.p-i')!;
    const portrait = stage.querySelector<HTMLElement>('.hero-portrait')!;

    // offset* values ignore transforms, so these stay correct when re-measured mid-zoom
    const originX = () => letter.offsetLeft + letter.offsetWidth / 2;
    const originY = () => letter.offsetTop + letter.offsetHeight / 2;
    const origin = () => `${originX()}px ${originY()}px`;
    // phones: distance from the I down to eye level on the portrait
    const drop = () => (isDesktop ? 0 : portrait.offsetTop + portrait.offsetHeight * 0.38 - (layers[0].offsetTop + originY()));
    const zoom = () => {
      const fs = parseFloat(getComputedStyle(layers[0]).fontSize);
      const x = layers[0].offsetLeft + originX();
      const y = layers[0].offsetTop + originY() + drop();
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      // scale until the I's stem (≈0.15em wide, ≈0.7em tall) covers the whole stage
      return 1.3 * Math.max(Math.max(x, w - x) / (0.075 * fs), Math.max(y, h - y) / (0.34 * fs));
    };

    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
      })
      .to('.p-hi, .p-sub', { opacity: 0, y: -24, duration: 0.12 }, 0)
      .to('.p-hint', { opacity: 0, y: 16, duration: 0.05 }, 0)
      .fromTo(
        '.p-photo',
        { yPercent: 0, scale: 1 },
        isDesktop
          ? { yPercent: 10, scale: 1.06, transformOrigin: '50% 0%', duration: 0.56, ease: 'power1.inOut' }
          : { scale: 1.06, transformOrigin: '50% 100%', duration: 0.56, ease: 'power1.inOut' },
        0,
      )
      // phase 1: grow through the photo (force3D off keeps the text crisp instead of a stretched bitmap)
      .fromTo(
        layers,
        { scale: 1, y: 0, transformOrigin: origin },
        { scale: isDesktop ? 1.7 : 2.3, y: drop, transformOrigin: origin, duration: 0.5, ease: 'power2.inOut', force3D: false },
        0.04,
      )
      .to('.p-photo', { opacity: 0, duration: 0.16 }, 0.56)
      .to('.p-outline', { opacity: 0, duration: 0.1 }, 0.66)
      // phase 2: dive into the I
      .to(layers, { scale: zoom, duration: 0.42, ease: 'power3.in', force3D: false }, 0.54)
      .to('.p-fill', { opacity: 1, duration: 0.06 }, 0.94);
  });

  return (
    <section id="home" ref={sectionRef} aria-labelledby="home-title" className={reduce ? 'relative' : 'relative h-[260svh]'}>
      <div ref={stageRef} className={`hero-stage relative h-[100svh] min-h-[560px] overflow-hidden ${reduce ? '' : 'sticky top-0'}`}>
        <h1 id="home-title" className="sr-only">
          Hi, I'm {profile.name}
        </h1>
        <p className="sr-only">Full Stack Developer. UI/UX Designer. Engineering for the AI Era.</p>

        <NameLayer variant="solid" ready={ready} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.2, ease: EASE, delay: 0.05 }}
          className="hero-portrait z-10"
        >
          <img
            src="/images/aswin_cutout.webp"
            alt="Illustrated portrait of Aswin Krishnan"
            width={1040}
            height={840}
            fetchPriority="high"
            className="p-photo block h-auto w-full"
          />
        </motion.div>

        <NameLayer variant="outline" ready={ready} />
        <Greeting ready={ready} />
        <ScrollCue ready={ready} onClick={() => goTo('about')} />

        {!reduce && <div aria-hidden className="p-fill absolute inset-0 z-40 bg-accent opacity-0" />}
      </div>
    </section>
  );
}
