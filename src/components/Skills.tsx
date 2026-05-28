import { motion } from 'framer-motion';
import { slideUp, fadeInLeft, staggerContainer, viewport } from '../utils/animations';
import { font } from '../utils/fontsize';

function DotGrid({ rows = 8, cols = 7 }: { rows?: number; cols?: number }) {
  return (
    <div className="dot-grid" style={{ gridTemplateColumns: `repeat(${cols}, 10px)` }}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <span key={i} className="w-2 h-2 rounded-full bg-muted/20 block" />
      ))}
    </div>
  );
}

function LogoDecor() {
  return (
    <svg
      width="114" height="114" viewBox="0 0 114 114"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ color: 'rgb(var(--accent))' }}
    >
      <mask id="sd-mask-1" fill="white">
        <path fillRule="evenodd" clipRule="evenodd" d="M57.5 0H85.75H114V28.25V56.5V84.75H85.75H57.5V56.5H85.75V28.25H57.5V0Z"/>
      </mask>
      <path d="M57.5 0V-1H56.5V0H57.5ZM114 0H115V-1H114V0ZM114 84.75V85.75H115V84.75H114ZM57.5 84.75H56.5V85.75H57.5V84.75ZM57.5 56.5V55.5H56.5V56.5H57.5ZM85.75 56.5V57.5H86.75V56.5H85.75ZM85.75 28.25H86.75V27.25H85.75V28.25ZM57.5 28.25H56.5V29.25H57.5V28.25ZM85.75 -1H57.5V1H85.75V-1ZM114 -1H85.75V1H114V-1ZM115 28.25V0H113V28.25H115ZM115 56.5V28.25H113V56.5H115ZM115 84.75V56.5H113V84.75H115ZM85.75 85.75H114V83.75H85.75V85.75ZM85.75 83.75H57.5V85.75H85.75V83.75ZM58.5 84.75V56.5H56.5V84.75H58.5ZM57.5 57.5H85.75V55.5H57.5V57.5ZM84.75 28.25V56.5H86.75V28.25H84.75ZM57.5 29.25H85.75V27.25H57.5V29.25ZM56.5 0V28.25H58.5V0H56.5Z" fill="currentColor" mask="url(#sd-mask-1)"/>
      <mask id="sd-mask-2" maskUnits="userSpaceOnUse" x="0" y="27.2501" width="59" height="87" fill="black">
        <rect fill="white" y="27.2501" width="59" height="87"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M1 28.2501H29.25H57.5V56.5001H29.25V84.7501H57.5V113H29.25H1V84.7501V56.5001V28.2501Z"/>
      </mask>
      <path d="M1 28.2501V27.2501H0V28.2501H1ZM57.5 28.2501H58.5V27.2501H57.5V28.2501ZM57.5 56.5001V57.5001H58.5V56.5001H57.5ZM29.25 56.5001V55.5001H28.25V56.5001H29.25ZM29.25 84.7501H28.25V85.7501H29.25V84.7501ZM57.5 84.7501H58.5V83.7501H57.5V84.7501ZM57.5 113V114H58.5V113H57.5ZM1 113H0V114H1V113ZM29.25 27.2501H1V29.2501H29.25V27.2501ZM57.5 27.2501H29.25V29.2501H57.5V27.2501ZM58.5 56.5001V28.2501H56.5V56.5001H58.5ZM29.25 57.5001H57.5V55.5001H29.25V57.5001ZM30.25 84.7501V56.5001H28.25V84.7501H30.25ZM29.25 85.7501H57.5V83.7501H29.25V85.7501ZM56.5 84.7501V113H58.5V84.7501H56.5ZM57.5 112H29.25V114H57.5V112ZM1 114H29.25V112H1V114ZM0 84.7501V113H2V84.7501H0ZM0 56.5001V84.7501H2V56.5001H0ZM0 28.2501V56.5001H2V28.2501H0Z" fill="currentColor" mask="url(#sd-mask-2)"/>
    </svg>
  );
}

const categories = [
  { title: 'Languages',  items: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],                          span: 1 },
  { title: 'Frameworks', items: ['React.js', 'Next.js', 'Bootstrap', 'Tailwind CSS', 'React Native', 'WordPress'], span: 2 },
  { title: 'Backend',    items: ['Node.js', 'Express.js'],                                            span: 2 },
  { title: 'Databases',  items: ['MongoDB', 'MySQL'],                                                 span: 1 },
  { title: 'Tools',      items: ['Git', 'Figma', 'REST APIs', 'VS Code'],                             span: 1 },
  { title: 'Other',      items: ['Agile / Scrum', 'UI / UX Design', 'Responsive Design'],             span: 2 },
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="section-header"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className={`section-title ${font.sectionTitle}`}>
            <span className="text-accent">#</span>skills
          </h2>
          <div className="section-line" />
        </motion.div>

        <div className="grid lg:grid-cols-[160px_1fr] gap-12 items-start">
          {/* Left decorative column */}
          <motion.div
            className="flex flex-row justify-center lg:flex-col lg:justify-start gap-6 lg:gap-8 items-center lg:items-start mb-2 lg:mb-0"
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="hidden lg:block"><DotGrid rows={5} cols={5} /></div>
            <LogoDecor />
            <div className="hidden lg:block"><DotGrid rows={4} cols={4} /></div>
          </motion.div>

          {/* Skill boxes — stagger in */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {categories.map((cat) => (
              <motion.div
                key={cat.title}
                className={`skill-box ${cat.span === 2 ? 'sm:col-span-2' : ''}`}
                variants={slideUp}
                whileHover={{ scale: 1.015, transition: { duration: 0.2, ease: 'easeOut' } }}
              >
                <h4 className={`text-accent ${font.skillCategory} font-semibold mb-3 pb-2 border-b border-white/10`}>
                  {cat.title}
                </h4>
                <p className={`text-muted ${font.skillItem} leading-relaxed`}>
                  {cat.items.join(' / ')}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
