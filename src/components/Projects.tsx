import { useState } from 'react';
import { FiExternalLink, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { SiAppstore, SiGoogleplay } from 'react-icons/si';
import { featuredProjects, otherProjects, type Project } from '../data/projects';
import { font } from '../utils/fontsize';
import { palette } from '../utils/palette';

const accentMap: Record<string, string> = {
  'from-blue-500/20 to-cyan-500/20':     '#0ea5e9',
  'from-violet-500/20 to-purple-500/20': '#8b5cf6',
  'from-emerald-500/20 to-teal-500/20':  '#10b981',
  'from-orange-500/20 to-amber-500/20':  '#f59e0b',
  'from-pink-500/20 to-rose-500/20':     '#ec4899',
};

function FeaturedCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const accent = accentMap[project.gradient] ?? palette.accent;

  return (
    <div className="project-card flex flex-col">
      {/* Image area */}
      <div className="h-48 relative border-b border-white/10 overflow-hidden">
        {project.logo ? (
          <img
            src={project.logo}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-contain p-6"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `${accent}12` }}
          >
            <div
              className={`w-14 h-14 flex items-center justify-center font-bold ${font.cardTitle} border`}
              style={{ color: accent, borderColor: `${accent}40`, background: `${accent}15` }}
            >
              {project.title.charAt(0)}
            </div>
          </div>
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 120%, ${accent}40 0%, transparent 65%)`,
          }}
        />
        <span
          className={`absolute top-3 right-3 ${font.small} px-2 py-0.5 border backdrop-blur-sm`}
          style={{ color: accent, borderColor: `${accent}50`, background: `${accent}15` }}
        >
          featured
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className={`${font.cardTag} text-muted mb-2 leading-relaxed`}>
          {project.tags.join('  ')}
        </p>
        <h3 className={`text-fg font-bold ${font.cardTitle} mb-2`}>{project.title}</h3>

        <div className="mb-4 flex-1">
          <p className={`text-muted ${font.cardBody} leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {project.description}
          </p>
          <button
            onClick={() => setExpanded(e => !e)}
            className={`mt-1 flex items-center gap-0.5 ${font.small} transition-colors`}
            style={{ color: accent }}
          >
            {expanded ? <><FiChevronUp size={13} /> less</> : <><FiChevronDown size={13} /> more</>}
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {project.appStoreUrl && (
            <a href={project.appStoreUrl} target="_blank" rel="noopener noreferrer" className={`btn-ghost ${font.small}`}>
              <SiAppstore size={13} /> App Store
            </a>
          )}
          {project.playStoreUrl && (
            <a href={project.playStoreUrl} target="_blank" rel="noopener noreferrer" className={`btn-ghost ${font.small}`}>
              <SiGoogleplay size={13} /> Play Store
            </a>
          )}
          {!project.appStoreUrl && !project.playStoreUrl && (
            project.liveUrl !== '#' ? (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={`btn-ghost ${font.small}`}>
                <FiExternalLink size={13} /> Live
              </a>
            ) : (
              <button className={`btn-ghost ${font.small}`}>
                <FiExternalLink size={13} /> Live
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function OtherCard({ project }: { project: Project }) {
  const accent = accentMap[project.gradient] ?? palette.accent;

  return (
    <div
      className="flex flex-col p-4 border border-white/8 bg-white/2 hover:bg-white/4 transition-colors"
      style={{ borderLeftColor: `${accent}50`, borderLeftWidth: '2px' }}
    >
      <h4 className={`text-fg font-semibold ${font.cardTitle} mb-1`}>{project.title}</h4>
      <p className={`${font.cardTag} text-muted mb-3 leading-relaxed line-clamp-2 flex-1`}>
        {project.description}
      </p>
      <p className={`${font.cardTag} text-muted/60`}>{project.tags.join('  ·  ')}</p>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="works" className="py-20 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="section-header">
          <h2 className={`section-title ${font.sectionTitle}`}>
            <span className="text-accent">#</span>projects
          </h2>
          <div className="section-line" />
        </div>

        {/* Featured */}
        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {featuredProjects.map(project => (
            <FeaturedCard key={project.id} project={project} />
          ))}
        </div>

        {/* Other work */}
        <div className="mb-5 flex items-center gap-4">
          <span className={`${font.small} text-muted whitespace-nowrap`}>other work</span>
          <div className="h-px flex-1 bg-white/8" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {otherProjects.map(project => (
            <OtherCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
