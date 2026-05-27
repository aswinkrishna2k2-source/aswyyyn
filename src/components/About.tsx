import { font } from '../utils/fontsize';

export default function About() {
  return (
    <section id="about-me" className="py-20 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="section-header">
          <h2 className={`section-title ${font.sectionTitle}`}>
            <span className="text-accent">#</span>about-me
          </h2>
          <div className="section-line" />
        </div>

        <div className="max-w-2xl">
          <h3 className={`text-fg font-bold ${font.aboutHeading} mb-6`}>
            Hello, I'm <span className="text-accent">Aswin!</span>
          </h3>

          <div className={`space-y-4 text-muted ${font.aboutBody} leading-relaxed`}>
            <p>
              24-year-old tech enthusiast based in Kollam, Kerala. I build fast,
              clean web and mobile apps using the MERN stack and React Native.
            </p>
            <p>
              I care about details — good UX, readable code, and shipping things
              that actually work.
            </p>
          </div>

          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className={`btn-accent ${font.button} mt-8`}
          >
            Contact me →
          </button>
        </div>
      </div>
    </section>
  );
}
