import { motion } from 'framer-motion';
import { staggerContainer, slideUp, fadeInLeft, viewport } from '../utils/animations';
import { font } from '../utils/fontsize';

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

        <motion.div
          className="max-w-2xl"
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
              24-year-old tech enthusiast based in Kollam, Kerala. I build fast,
              clean web and mobile apps using the MERN stack and React Native.
            </p>
            <p>
              I care about details — good UX, readable code, and shipping things
              that actually work.
            </p>
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
      </div>
    </section>
  );
}
