import { FiGithub, FiLinkedin, FiInstagram, FiCode } from 'react-icons/fi';
import { font } from '../utils/fontsize';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 px-6 lg:px-16 lg:ml-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left */}
          <div>
            <div className={`text-fg font-bold ${font.navLogo} mb-1`}>
              <FiCode className="text-accent" size={22} />
            </div>
            <p className={`text-muted ${font.small}`}>aswinkrishna2k2@gmail.com</p>
            <p className={`text-muted ${font.small} mt-0.5`}>MERN Stack Engineer ·Android/iOS Developer</p>
          </div>

          {/* Right */}
          <div className="text-right">
            <div className="flex items-center gap-4 justify-end">
              <a href="https://github.com/aswin2002" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors" aria-label="GitHub">
                <FiGithub size={16} />
              </a>
              <a href="https://www.linkedin.com/in/aswyyyn/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors" aria-label="LinkedIn">
                <FiLinkedin size={16} />
              </a>
              <a href="https://www.instagram.com/aswyyyn/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors" aria-label="Instagram">
                <FiInstagram size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-6 pt-6 text-center">
          <p className={`text-muted/50 ${font.small}`}>
            © Copyright {new Date().getFullYear()}. Built with passion by{' '}
            <span className="text-accent">~aswyyyn</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
