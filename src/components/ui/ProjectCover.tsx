import type { Project } from '../../data/projects';
import { getProjectGallery } from '../../utils/projectGallery';
import { getCover } from '../../lib/projects';
import type { VoiceClip } from '../../hooks/useVoiceClip';
import VoiceStage from './VoiceStage';

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

/** The visual for a project: fanned phones, a screenshot, a logo, or a monogram fallback. */
export default function ProjectCover({ project, className = '', clip }: { project: Project; className?: string; clip?: VoiceClip }) {
  if (project.cover === 'voice' && project.voice) {
    return <VoiceStage voice={project.voice} images={getProjectGallery(project.slug)} clip={clip} className={className} />;
  }

  if (project.cover === 'phones') {
    return <PhoneFan images={getProjectGallery(project.slug).slice(0, 3)} className={className} />;
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
