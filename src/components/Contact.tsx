import { FiGithub, FiLinkedin, FiInstagram, FiMail } from 'react-icons/fi';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInLeft, fadeInRight, staggerContainer, slideUp, viewport } from '../utils/animations';
import { font } from '../utils/fontsize';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  const inputClass =
    `contact-input w-full bg-surface border border-white/10 px-4 py-2.5 text-fg ${font.small} placeholder-muted/40 transition-colors duration-200 font-mono`;

  return (
    <section id="contact" className="py-20 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="section-header"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className={`section-title ${font.sectionTitle}`}>
            <span className="text-accent">#</span>contact
          </h2>
          <div className="section-line" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left — slides in from left */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.p variants={fadeInLeft} className={`text-fg font-bold ${font.heroRole} mb-3`}>
              Have a project? Let's talk.
            </motion.p>
            <motion.p variants={slideUp} className={`text-muted ${font.contactBody} leading-relaxed mb-8 max-w-sm`}>
              I like unique ideas and the kind of problems that don't have obvious answers.
              If you've got something interesting brewing, I'm all ears.
            </motion.p>

            <motion.div variants={slideUp} className="space-y-3">
              <div className="border border-white/10 p-4">
                <p className={`text-muted ${font.contactLabel} mb-2 font-semibold`}>Reach me here</p>
                <div className="space-y-2">
                  <a
                    href="mailto:aswinkrishna2k2@gmail.com"
                    className={`flex items-center gap-3 ${font.small} text-muted hover:text-fg transition-colors`}
                  >
                    <FiMail size={14} className="text-accent" />
                    aswinkrishna2k2@gmail.com
                  </a>
                  <a
                    href="https://www.linkedin.com/in/aswyyyn/"
                    className={`flex items-center gap-3 ${font.small} text-muted hover:text-fg transition-colors`}
                    target="_blank" rel="noopener noreferrer"
                  >
                    <FiLinkedin size={14} className="text-accent" />
                    linkedin.com/in/aswyyyn
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div variants={slideUp} className="flex gap-4 mt-8">
              {[
                { icon: FiGithub,    href: 'https://github.com/aswin2002',          label: 'GitHub'    },
                { icon: FiLinkedin,  href: 'https://www.linkedin.com/in/aswyyyn/',  label: 'LinkedIn'  },
                { icon: FiInstagram, href: 'https://www.instagram.com/aswyyyn/',    label: 'Instagram' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="social-icon w-9 h-9 border border-white/10 flex items-center justify-center text-muted transition-colors duration-200"
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — slides in from right */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {sent ? (
              <motion.div
                className="border border-white/10 p-8 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <span className="text-accent text-2xl block mb-3">✓</span>
                <p className={`text-fg font-semibold ${font.body} mb-1`}>Message sent!</p>
                <p className={`text-muted ${font.small} mb-6`}>I'll get back to you soon.</p>
                <button onClick={() => setSent(false)} className={`btn-ghost ${font.small}`}>
                  Send another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`${font.small} text-muted block mb-1.5`}>
                    <span className="text-accent">// </span>name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={`${font.small} text-muted block mb-1.5`}>
                    <span className="text-accent">// </span>email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={`${font.small} text-muted block mb-1.5`}>
                    <span className="text-accent">// </span>message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    required
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-accent w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send message!!'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
