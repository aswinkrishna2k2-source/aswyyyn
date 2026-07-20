import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiGithub, FiChevronDown, FiChevronUp, FiArrowUpRight } from 'react-icons/fi';
import { SiAppstore, SiGoogleplay } from 'react-icons/si';
import { featuredProjects, otherProjects, type Project } from '../data/projects';
import { getProjectGallery } from '../utils/projectGallery';
import { font } from '../utils/fontsize';
import { palette } from '../utils/palette';
import { slideUp, fadeInLeft, staggerContainer, fastStagger, viewport } from '../utils/animations';

function ProjectCardBody({ project, badge = false }: { project: Project; badge?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const accent = palette.accent;
  const cover = project.logo ?? getProjectGallery(project.slug)[0];

  return (
    <>
      <Link to={`/projects/${project.slug}`} className="h-48 relative border-b border-white/10 overflow-hidden block">
        {cover ? (
          <img
            src={cover}
            alt={project.title}
            className={`absolute inset-0 w-full h-full ${project.logo ? 'object-contain p-6' : 'object-cover'}`}
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
        {badge && (
          <span
            className={`absolute top-3 right-3 ${font.small} px-2 py-0.5 border backdrop-blur-sm`}
            style={{ color: accent, borderColor: `${accent}50`, background: `${accent}15` }}
          >
            featured
          </span>
        )}
        {project.status && (
          <span
            className={`absolute top-3 left-3 ${font.small} px-2 py-0.5 border backdrop-blur-sm inline-flex items-center gap-1.5`}
            style={{ color: accent, borderColor: `${accent}50`, background: `${accent}15` }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: accent }}
              />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: accent }} />
            </span>
            {project.status}
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <p className={`${font.cardTag} text-muted mb-2 leading-relaxed`}>
          {project.tags.join('  ')}
        </p>
        <Link to={`/projects/${project.slug}`}>
          <h3 className={`text-fg font-bold ${font.cardTitle} mb-2 hover:text-accent transition-colors`}>{project.title}</h3>
        </Link>

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
          <Link to={`/projects/${project.slug}`} className={`btn-accent ${font.small} inline-flex items-center gap-1.5`}>
            <FiArrowUpRight size={13} /> Details
          </Link>
          {project.githubUrl && project.githubUrl !== '#' && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={`btn-ghost ${font.small}`}>
              <FiGithub size={13} /> GitHub
            </a>
          )}
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
          {!project.appStoreUrl && !project.playStoreUrl && project.liveUrl !== '#' && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={`btn-ghost ${font.small}`}>
              <FiExternalLink size={13} /> Live
            </a>
          )}
        </div>
      </div>
    </>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <motion.div
      className="project-card flex flex-col"
      variants={slideUp}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
    >
      <ProjectCardBody project={project} badge />
    </motion.div>
  );
}

function OtherCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      className="project-card flex flex-col"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
    >
      <ProjectCardBody project={project} />
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
            <span className="text-accent">#</span>contributed projects
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
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
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
