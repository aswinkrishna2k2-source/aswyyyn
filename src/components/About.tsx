import { motion } from 'framer-motion';
import { staggerContainer, slideUp, fadeInLeft, scaleIn, viewport } from '../utils/animations';
import { font } from '../utils/fontsize';
import { about } from '../data/about';

export default function About() {
  return (
    <section id="about-me" className="py-20 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="section-header"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className={`section-title ${font.sectionTitle}`}>
            <span className="text-accent">#</span>about-me
          </h2>
          <div className="section-line" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — bio */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.h3
              variants={slideUp}
              className={`text-fg font-bold ${font.aboutHeading} mb-6`}
            >
              Hello, I'm <span className="text-accent">Aswin!</span>
            </motion.h3>

            <motion.div
              variants={slideUp}
              className={`space-y-4 text-muted ${font.aboutBody} leading-relaxed`}
            >
              <p>
                23-year-old tech enthusiast based in Kollam, Kerala, with 2+ years of experience
                building fast, clean web and mobile apps using the MERN stack and React Native.
              </p>
              <p>
                I care about details — good UX, readable code, and shipping things
                that actually work.
              </p>
            </motion.div>

            {/* Education */}
            <motion.div variants={slideUp} className="mt-8 border border-white/10 p-5">
              <p className={`text-accent ${font.small} font-semibold mb-4`}>
                <span className="text-accent">//</span> education
              </p>
              <div className="space-y-4">
                <div>
                  <p className={`text-fg font-semibold ${font.body}`}>MBA in Business Analytics</p>
                  <p className={`text-muted ${font.small} mt-0.5`}>Amrita University · 2026 – Present</p>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <p className={`text-fg font-semibold ${font.body}`}>Internship in Full Stack Development</p>
                  <p className={`text-muted ${font.small} mt-0.5`}>Stackup · 2023 – 2024</p>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <p className={`text-fg font-semibold ${font.body}`}>Bachelor of Arts in English</p>
                  <p className={`text-muted ${font.small} mt-0.5`}>Kerala University · 2020 – 2023</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={slideUp}>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className={`btn-accent ${font.button} mt-8`}
              >
                Contact me →
              </button>
            </motion.div>
          </motion.div>

          {/* Right — timeline */}
          <motion.div
            className="space-y-4 hidden lg:block"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {about.cards.map((card) => (
              <motion.div
                key={card.year}
                className="border border-white/10 hover:border-accent/30 transition-colors duration-200 p-5"
                variants={scaleIn}
                whileHover={{ x: 4, transition: { duration: 0.2, ease: 'easeOut' } }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`${font.small} font-mono px-2 py-0.5 border`}
                    style={{ color: card.color, borderColor: `${card.color}40`, background: `${card.color}15` }}
                  >
                    {card.year}
                  </span>
                  <h4 className={`text-fg font-semibold ${font.body}`}>{card.title}</h4>
                </div>
                <p className={`text-muted ${font.small} leading-relaxed`}>{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
