import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { FiMaximize2, FiPause, FiPlay } from 'react-icons/fi';
import type { ProjectVoice } from '../../data/projects';
import type { VoiceClip } from '../../hooks/useVoiceClip';

const BRAND = '#e91939';

export const IDLE_CLIP: VoiceClip = {
  playing: false,
  progress: 0,
  duration: 0,
  toggle: () => {},
  readLevels: () => false,
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  return `0:${String(Math.round(seconds)).padStart(2, '0')}`;
}

interface VoiceStageProps {
  voice: ProjectVoice;
  /** Screenshots of the assistant; the first is shown in front, the second layered behind it */
  images: string[];
  clip?: VoiceClip;
  /** 'card' is visual only (controls live elsewhere); 'hero' adds the play button */
  variant?: 'card' | 'hero';
  /** hero only: enlarge a screenshot */
  onOpen?: (index: number) => void;
  className?: string;
}

/**
 * The assistant's screens floating on a dark stage in her brand glow. While her intro plays, the
 * glow and the bars react to the real frequency levels of her voice; otherwise a slow idle wave
 * keeps the stage alive.
 */
export default function VoiceStage({ voice, images, clip = IDLE_CLIP, variant = 'card', onOpen, className = '' }: VoiceStageProps) {
  const hero = variant === 'hero';
  const count = hero ? 36 : 28;
  const rootRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const readRef = useRef(clip.readLevels);
  readRef.current = clip.readLevels;
  const [front, back] = images;

  // Drive the bars and glow from a rAF loop that only runs while the stage is on screen
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const levels = new Float32Array(count);
    const smooth = new Float32Array(count).fill(0.15);
    let frame = 0;

    const tick = (t: number) => {
      frame = requestAnimationFrame(tick);
      if (!readRef.current(levels)) {
        for (let i = 0; i < count; i++) {
          levels[i] = reduce ? 0.16 : 0.12 + 0.13 * (0.5 + 0.5 * Math.sin(t / 480 + i * 0.42)) * (0.55 + 0.45 * Math.sin(t / 1100 - i * 0.18));
        }
      }
      const bars = barsRef.current?.children;
      let sum = 0;
      for (let i = 0; i < count; i++) {
        smooth[i] += (levels[i] - smooth[i]) * 0.32;
        sum += smooth[i];
        (bars?.[i] as HTMLElement | undefined)?.style.setProperty('--l', smooth[i].toFixed(3));
      }
      root.style.setProperty('--a', (sum / count).toFixed(3));
    };

    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) frame = requestAnimationFrame(tick);
    });
    io.observe(root);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [count, reduce]);

  const panel = 'block h-full w-auto max-w-none rounded-xl border border-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] md:rounded-2xl';

  const Panel = ({ src, index, className: cls, style }: { src: string; index: number; className: string; style?: React.CSSProperties }) =>
    hero && onOpen ? (
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`View screen ${index + 1} full size`}
        className={`group absolute ${cls}`}
        style={style}
      >
        <img src={src} alt="" draggable={false} className={panel} />
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink/85 text-fg opacity-0 transition group-hover:opacity-100">
          <FiMaximize2 size={14} aria-hidden />
        </span>
      </button>
    ) : (
      <span className={`absolute ${cls}`} style={style}>
        <img src={src} alt="" loading="lazy" draggable={false} className={panel} />
      </span>
    );

  return (
    <div
      ref={rootRef}
      className={`relative isolate overflow-hidden bg-ink-deep [container-type:inline-size] ${className}`}
      style={{ backgroundImage: `radial-gradient(60% 65% at 50% 45%, ${BRAND}33, transparent 72%)` }}
    >
      {/* glow that breathes with her voice */}
      <span
        aria-hidden
        className="absolute left-1/2 top-[44%] h-[70%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: BRAND, opacity: 'calc(0.12 + var(--a, 0.15) * 0.6)' }}
      />

      {/* the two screens, layered */}
      <div className={`absolute inset-x-0 top-0 flex items-center justify-center ${hero ? 'bottom-[30%] pt-[6%] md:bottom-[26%] md:pt-[3%]' : 'bottom-[18%] pt-[5%]'}`}>
        {/* panels are sized by height, but capped by the stage width so both always fit on narrow screens */}
        <div className={`relative ${hero ? 'h-[min(86%,50cqw)]' : 'h-[min(88%,48cqw)]'}`}>
          {back && (
            <Panel
              src={back}
              index={1}
              className="left-0 top-0 h-full origin-bottom-left opacity-70"
              style={{ transform: 'translateX(-8%) translateY(4%) rotate(5deg) scale(0.92)' }}
            />
          )}
          {front && (
            <Panel
              src={front}
              index={0}
              className="left-0 top-0 h-full origin-bottom-right"
              style={{ transform: 'translateX(-92%) rotate(-3deg)' }}
            />
          )}
        </div>
      </div>

      {/* voice bars + controls */}
      <div
        className={`absolute inset-x-0 bottom-0 z-10 flex flex-col items-center bg-gradient-to-t from-ink-deep via-ink-deep/90 to-transparent px-4 ${
          hero ? 'gap-4 pb-6 pt-10 md:pb-8' : 'pb-3 pt-6 md:pb-5'
        }`}
      >
        <div ref={barsRef} aria-hidden className={`flex items-center ${hero ? 'h-12 gap-1 md:h-16 md:gap-[5px]' : 'h-7 gap-[3px] md:h-12 md:gap-1'}`}>
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className={`h-full rounded-full ${hero ? 'w-[3px] md:w-[5px]' : 'w-[3px] md:w-1'}`}
              style={{
                transform: 'scaleY(calc(0.1 + var(--l, 0.15) * 0.9))',
                background: `linear-gradient(to top, ${BRAND}, #ffffff)`,
                opacity: 0.85,
              }}
            />
          ))}
        </div>

        {hero && (
          <>
            <button type="button" onClick={clip.toggle} aria-pressed={clip.playing} className="btn btn-primary">
              {clip.playing ? <FiPause aria-hidden /> : <FiPlay aria-hidden />}
              {clip.playing ? 'Pause' : voice.label}
            </button>
            <div className="flex items-center gap-3 font-mono text-[11px] text-muted">
              <span className="tabular-nums">{formatTime(clip.progress * clip.duration)}</span>
              <span className="h-1 w-32 overflow-hidden rounded-full bg-white/10 md:w-44">
                <span className="block h-full rounded-full bg-accent" style={{ width: `${clip.progress * 100}%` }} />
              </span>
              <span className="tabular-nums">{formatTime(clip.duration)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
