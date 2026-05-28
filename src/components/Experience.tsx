import { motion } from 'framer-motion';
import { slideUp, fadeInLeft, staggerContainer, viewport } from '../utils/animations';
import { experiences } from '../data/experience';
import { font } from '../utils/fontsize';

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="section-header"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className={`section-title ${font.sectionTitle}`}>
            <span className="text-accent">#</span>experience
          </h2>
          <div className="section-line" />
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              className="border border-white/10 hover:border-accent/30 transition-colors duration-200 p-7"
              variants={slideUp}
              whileHover={{ x: 4, transition: { duration: 0.2, ease: 'easeOut' } }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-accent ${font.small} font-mono`}>
                      {String(experiences.length - i).padStart(2, '0')}
                    </span>
                    <h3 className={`text-fg font-bold ${font.expRole}`}>{exp.role}</h3>
                  </div>
                  <div className="flex items-center gap-3 pl-9">
                    <span className={`text-accent ${font.expCompany}`}>{exp.company}</span>
                    <span className="text-muted">·</span>
                    <span className={`text-muted ${font.label}`}>{exp.type}</span>
                  </div>
                </div>
                <span className={`${font.small} text-muted border border-white/10 px-3 py-1`}>
                  {exp.duration}
                </span>
              </div>

              <ul className="pl-9 space-y-2">
                {exp.contributions.map((item) => (
                  <li key={item} className={`text-muted ${font.expBody} flex gap-2`}>
                    <span className="text-accent flex-shrink-0">~</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
