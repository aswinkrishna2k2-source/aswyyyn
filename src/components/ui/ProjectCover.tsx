import { useRef } from 'react';
import { useInView } from 'framer-motion';
import type { Project } from '../../data/projects';
import { getProjectThumbs } from '../../utils/projectGallery';
import { getCover } from '../../lib/projects';

/** Three portrait app screenshots fanned out like cards in a hand. */
export function PhoneFan({ images, className = '' }: { images: string[]; className?: string }) {
  const [center, left, right] = images;
  const phone = 'absolute h-[82%] w-auto rounded-[1.1rem] border-[3px] border-ink shadow-[0_24px_48px_-16px_rgba(0,0,0,0.55)]';

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-accent ${className}`}>
      {left && <img src={left} alt="" loading="lazy" className={phone} style={{ transform: 'translateX(-58%) rotate(-9deg)' }} />}
      {right && <img src={right} alt="" loading="lazy" className={phone} style={{ transform: 'translateX(58%) rotate(9deg)' }} />}
      {center && <img src={center} alt="" loading="lazy" className={`${phone} z-10`} />}
    </div>
  );
}

/** Narrower screens fit more columns. `perScreen` is seconds per screenshot, which keeps the drift the same speed; `fill` is the fewest a column can hold and still loop without a gap. */
function wallLayout(ratio: number) {
  if (ratio < 0.7) return { columns: 4, perScreen: 16, fill: 3 };
  if (ratio < 1.2) return { columns: 3, perScreen: 13, fill: 3 };
  return { columns: 2, perScreen: 8, fill: 6 };
}

/** Deals the screenshots out into columns, topping up short ones with the images that come next. */
function dealColumns(images: string[], columns: number, fill: number) {
  return Array.from({ length: columns }, (_, c) => {
    const column = images.filter((_, i) => i % columns === c);
    let next = images.indexOf(column[column.length - 1]) + 1;
    while (column.length < fill) column.push(images[next++ % images.length]);
    return column;
  });
}

/**
 * Every screenshot of a project on a slowly drifting, slightly tilted wall. Neighbouring columns run in
 * opposite directions. It stops under the mouse, and while `moving` is off or the wall is off screen.
 */
function ScreenWall({ images, ratio, moving, className = '' }: { images: string[]; ratio: number; moving: boolean; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const onScreen = useInView(rootRef);
  const { columns, perScreen, fill } = wallLayout(ratio);
  const fit = ratio < 1 ? 'object-top' : 'object-left-top';

  return (
    <div ref={rootRef} className={`group/wall relative overflow-hidden bg-ink-deep ${className}`}>
      <div className="absolute -inset-x-[8%] -inset-y-[20%] flex -rotate-6 gap-2 md:gap-3">
        {dealColumns(images, Math.min(columns, images.length), fill).map((column, c) => (
          <div
            key={c}
            className="min-w-0 flex-1 animate-wall-drift self-start group-hover/wall:[animation-play-state:paused] motion-reduce:animate-none"
            style={{
              animationDuration: `${column.length * perScreen * (1 + c * 0.12)}s`,
              animationDelay: `${-c * 2.5}s`,
              animationDirection: c % 2 ? 'reverse' : 'normal',
              animationPlayState: moving && onScreen ? undefined : 'paused',
            }}
          >
            {/* two copies, so the column can loop on itself at -50% */}
            {[...column, ...column].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className={`mb-2 w-full rounded-lg border border-white/10 object-cover md:mb-3 md:rounded-xl ${fit}`}
                style={{ aspectRatio: String(ratio) }}
              />
            ))}
          </div>
        ))}
      </div>
      {/* a pixel past the edges, so a bright screenshot can't show as a thin line once the card is scaled */}
      <span aria-hidden className="pointer-events-none absolute -inset-x-px -top-px h-[14%] bg-gradient-to-b from-ink-deep to-transparent" />
      <span aria-hidden className="pointer-events-none absolute -inset-x-px -bottom-px h-[14%] bg-gradient-to-t from-ink-deep to-transparent" />
    </div>
  );
}

/** The visual for a project: a wall of its screenshots, a logo, or a monogram fallback. */
export default function ProjectCover({ project, className = '', moving = true }: { project: Project; className?: string; moving?: boolean }) {
  const screens = getProjectThumbs(project.slug);
  if (screens.length > 1) {
    return <ScreenWall images={screens} ratio={project.screenRatio ?? (project.cover === 'phones' ? 0.46 : 1.9)} moving={moving} className={className} />;
  }

  const cover = getCover(project);
  if (cover && cover !== project.logo) {
    return (
      <div className={`overflow-hidden bg-ink-deep ${className}`}>
        <img
          src={cover}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover object-left-top transition-transform duration-700 ease-story group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div className={`grid place-items-center bg-accent/10 ${className}`}>
      {cover ? (
        <img src={cover} alt="" loading="lazy" className="max-h-[55%] max-w-[60%] object-contain" />
      ) : (
        <span className="display text-7xl text-accent">{project.title.charAt(0)}</span>
      )}
    </div>
  );
}
