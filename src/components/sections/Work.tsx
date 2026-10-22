import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { FiArrowUpRight, FiPause, FiPlay } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import ProjectCover from '../ui/ProjectCover';
import { featuredProjects, otherProjects, type Project } from '../../data/projects';
import { getCover, getProjectLinks } from '../../lib/projects';
import { EASE, pad2 } from '../../lib/motion';
import { useVoiceClip } from '../../hooks/useVoiceClip';

interface StackCardProps {
  project: Project;
  i: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
}

/** Cards pin under the header and pile up; earlier ones shrink back as new ones land on top. */
function StackCard({ project, i, total, progress, reduce }: StackCardProps) {
  const buried = total - 1 - i; // how many cards will land on top of this one
  const range = [i / total, 1];
  const scale = useTransform(progress, range, [1, 1 - buried * 0.05]);
  const rotateX = useTransform(progress, range, [0, buried * 5]);
  const dim = useTransform(progress, range, [0, buried * 0.2]);
  const holderRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: arrival } = useScroll({ target: holderRef, offset: ['start end', 'start start'] });
  const zoom = useTransform(arrival, [0, 1], [1.35, 1]);
  const lift = useTransform(arrival, [0, 1], [8, 0]);
  const links = getProjectLinks(project);
  const clip = useVoiceClip(project.voice?.intro);

  return (
    <div
      ref={holderRef}
      className="sticky pb-6 md:pb-10"
      style={{ top: `calc(env(safe-area-inset-top) + 5.5rem + ${i * 14}px)`, perspective: 1400 }}
    >
      <motion.article
        style={reduce ? undefined : { scale, rotateX, rotate: lift, transformOrigin: '50% 0%' }}
        className="card group relative grid overflow-hidden shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.6)] md:grid-cols-12"
      >
        {!reduce && <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-10 bg-black" />}
        <Link
          to={`/projects/${project.slug}`}
          tabIndex={-1}
          aria-hidden
          className="block h-[clamp(150px,28svh,300px)] overflow-hidden md:order-2 md:col-span-7 md:h-[min(460px,62svh)]"
        >
          <motion.div style={{ scale: reduce ? 1 : zoom }} className="h-full w-full">
            <ProjectCover project={project} clip={clip} className="h-full w-full" />
          </motion.div>
        </Link>

        <div className="flex flex-col p-5 md:col-span-5 md:p-10">
          <div className="label flex items-center justify-between gap-4 text-muted">
            <span>
              {pad2(i + 1)} / {pad2(total)}
            </span>
            <span>{project.platform}</span>
          </div>
          <h3 className="display mt-4 text-[clamp(2.25rem,9vw,3.5rem)]">
            <Link to={`/projects/${project.slug}`} className="transition-colors hover:text-accent">
              {project.title}
            </Link>
          </h3>
          {project.client && <p className="label mt-2 text-accent">for {project.client}</p>}
          <p className="story-serif mt-3 text-[1.4rem] leading-[1.15] text-fg/90 md:text-[1.7rem]">{project.tagline}</p>
          {project.voice && (
            <button
              type="button"
              onClick={clip.toggle}
              aria-pressed={clip.playing}
              className="mt-4 flex h-11 items-center gap-2.5 self-start rounded-full border border-white/15 pl-1.5 pr-4 text-sm font-semibold transition hover:border-accent hover:text-accent"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-ink">
                {clip.playing ? <FiPause aria-hidden /> : <FiPlay aria-hidden className="translate-x-px" />}
              </span>
              {clip.playing ? 'Pause' : project.voice.label}
            </button>
          )}
          <ul className="mt-4 hidden flex-wrap gap-1.5 min-[400px]:flex">
            {project.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center gap-2 pt-6">
            <Link to={`/projects/${project.slug}`} className="btn btn-primary flex-1 sm:flex-none">
              View project <FiArrowUpRight aria-hidden />
            </Link>
            {links.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} on ${label}`}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 transition hover:border-accent hover:text-accent"
              >
                <Icon aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function SideQuests() {
  return (
    <div className="mt-24 md:mt-32">
      <Reveal className="flex items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="label text-muted">Personal builds</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
            Side <span className="story-serif font-normal text-accent">quests</span>
          </h3>
        </div>
        <p className="label text-muted">{otherProjects.length} builds</p>
      </Reveal>

      <ul>
        {otherProjects.map((p, i) => {
          const thumb = getCover(p);
          return (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 48, clipPath: 'inset(0% 0% 100% 0%)' }}
              whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.9, ease: EASE, delay: (i % 3) * 0.06 }}
              className="border-b border-white/10"
            >
              <Link to={`/projects/${p.slug}`} className="group flex items-center gap-4 py-5 md:gap-8 md:py-7">
                <span className="label w-6 shrink-0 text-muted transition-colors group-hover:text-accent">{pad2(i + 1)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xl font-semibold tracking-tight transition-colors group-hover:text-accent md:text-3xl">
                    {p.title}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[15px] leading-snug text-muted md:line-clamp-1 md:text-base">{p.tagline}</span>
                  <span className="label mt-2 block truncate text-muted/70">{p.tags.join(' · ')}</span>
                </span>
                {thumb && (
                  <img
                    src={thumb}
                    alt=""
                    loading="lazy"
                    className="hidden h-20 w-32 shrink-0 rounded-xl object-cover object-left-top opacity-60 transition duration-500 group-hover:opacity-100 sm:block"
                  />
                )}
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 transition group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                  <FiArrowUpRight aria-hidden />
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Work() {
  const stackRef = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] });

  return (
    <section id="work" aria-labelledby="work-title" className="px-4 pb-16 pt-20 md:px-8 md:pb-20 md:pt-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="work"
          title="Things I've helped *ship*."
          intro="My latest work. Tap any project for the full breakdown."
        />

        <div ref={stackRef} className="relative mt-14 md:mt-20">
          {featuredProjects.map((project, i) => (
            <StackCard
              key={project.id}
              project={project}
              i={i}
              total={featuredProjects.length}
              progress={scrollYProgress}
              reduce={reduce}
            />
          ))}
        </div>

        <SideQuests />
      </div>
    </section>
  );
}
