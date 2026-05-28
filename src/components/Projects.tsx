import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { SiAppstore, SiGoogleplay } from 'react-icons/si';
import { featuredProjects, otherProjects, type Project } from '../data/projects';
import { font } from '../utils/fontsize';
import { palette } from '../utils/palette';
import { slideUp, fadeInLeft, staggerContainer, fastStagger, viewport } from '../utils/animations';

function FeaturedCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const accent = palette.accent;

  return (
    <motion.div
      className="project-card flex flex-col"
      variants={slideUp}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
    >
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
    </motion.div>
  );
}

function OtherCard({ project, index }: { project: Project; index: number }) {
  const accent = palette.accent;

  return (
    <motion.div
      className="flex flex-col p-4 border border-white/8 bg-white/2 hover:bg-white/4 transition-colors"
      style={{ borderLeftColor: `${accent}50`, borderLeftWidth: '2px' }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ x: 3, transition: { duration: 0.2, ease: 'easeOut' } }}
    >
      <h4 className={`text-fg font-semibold ${font.cardTitle} mb-1`}>{project.title}</h4>
      <p className={`${font.cardTag} text-muted mb-3 leading-relaxed line-clamp-2 flex-1`}>
        {project.description}
      </p>
      <p className={`${font.cardTag} text-muted/60`}>{project.tags.join('  ·  ')}</p>
    </motion.div>
  );
}

const INITIAL_SHOW = 3;

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? otherProjects : otherProjects.slice(0, INITIAL_SHOW);

  return (
    <section id="works" className="py-20 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="section-header"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className={`section-title ${font.sectionTitle}`}>
            <span className="text-accent">#</span>projects
          </h2>
          <div className="section-line" />
        </motion.div>

        {/* Featured — stagger cards */}
        <motion.div
          className="grid sm:grid-cols-2 gap-5 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {featuredProjects.map(project => (
            <FeaturedCard key={project.id} project={project} />
          ))}
        </motion.div>

        {/* Other work label */}
        <motion.div
          className="mb-5 flex items-center gap-4"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <span className={`${font.small} text-muted whitespace-nowrap`}>
            <span className="text-accent">#</span>other works
          </span>
          <div className="h-px flex-1 bg-white/8" />
        </motion.div>

        {/* Other cards */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
          variants={fastStagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <AnimatePresence initial={false}>
            {visible.map((project, i) => (
              <OtherCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View more / less */}
        {otherProjects.length > INITIAL_SHOW && (
          <motion.div
            className="mt-6 flex justify-center"
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <button
              onClick={() => setShowAll(s => !s)}
              className={`btn-ghost ${font.small} flex items-center gap-1.5`}
            >
              {showAll
                ? <><FiChevronUp size={13} /> show less</>
                : <><FiChevronDown size={13} /> view more ({otherProjects.length - INITIAL_SHOW} more)</>
              }
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
