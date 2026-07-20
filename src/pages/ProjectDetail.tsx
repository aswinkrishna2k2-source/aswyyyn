import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi';
import { SiAppstore, SiGoogleplay } from 'react-icons/si';
import { getProjectBySlug } from '../data/projects';
import { getProjectGallery } from '../utils/projectGallery';
import ImageCarousel from '../components/ImageCarousel';
import { font } from '../utils/fontsize';
import { palette } from '../utils/palette';
import { fadeInLeft, fadeInUp } from '../utils/animations';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const gallery = slug ? getProjectGallery(slug) : [];
  const accent = palette.accent;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#1b1b1b] font-mono text-fg">
      <main className="py-20 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInLeft}>
            <Link
              to="/#works"
              className={`inline-flex items-center gap-1.5 text-muted hover:text-accent transition-colors ${font.small} mb-10`}
            >
              <FiArrowLeft size={14} /> back to projects
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            {project.logo && (
              <div
                className="w-20 h-20 flex-shrink-0 flex items-center justify-center border overflow-hidden"
                style={{ borderColor: `${accent}30`, background: `${accent}10` }}
              >
                <img src={project.logo} alt={project.title} className="w-full h-full object-contain p-3" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-fg font-bold ${font.sectionTitle}`}>{project.title}</h1>
                {project.status && (
                  <span
                    className={`${font.small} px-2 py-0.5 border inline-flex items-center gap-1.5`}
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
              </div>
              <p className={`${font.cardTag} text-muted leading-relaxed`}>{project.tags.join('  ·  ')}</p>
            </div>
          </motion.div>

          <motion.p
            className={`text-muted ${font.aboutBody} leading-relaxed max-w-3xl mb-8`}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            {project.longDescription ?? project.description}
          </motion.p>

          <motion.div
            className="flex gap-3 flex-wrap mb-14"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            {project.liveUrl && project.liveUrl !== '#' && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={`btn-accent ${font.button} inline-flex items-center gap-1.5`}>
                <FiExternalLink size={14} /> Visit Live Site
              </a>
            )}
            {project.githubUrl && project.githubUrl !== '#' && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={`btn-ghost ${font.small}`}>
                <FiGithub size={14} /> GitHub
              </a>
            )}
            {project.appStoreUrl && (
              <a href={project.appStoreUrl} target="_blank" rel="noopener noreferrer" className={`btn-ghost ${font.small}`}>
                <SiAppstore size={14} /> App Store
              </a>
            )}
            {project.playStoreUrl && (
              <a href={project.playStoreUrl} target="_blank" rel="noopener noreferrer" className={`btn-ghost ${font.small}`}>
                <SiGoogleplay size={14} /> Play Store
              </a>
            )}
          </motion.div>

          {gallery.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px 0px' }}
              variants={fadeInUp}
            >
              <div className="mb-5 flex items-center gap-4">
                <span className={`${font.small} text-muted whitespace-nowrap`}>
                  <span className="text-accent">#</span>gallery
                </span>
                <div className="h-px flex-1 bg-white/8" />
              </div>
              <ImageCarousel images={gallery} alt={project.title} />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
