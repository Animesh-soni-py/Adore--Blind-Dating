import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle, illustration }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#0F0A1E' }} id="main-content">
      {/* Left: Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark via-dark-purple to-dark-plum items-center justify-center p-12 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,94,138,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-50px] left-[-50px] w-[350px] h-[350px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(200,168,240,0.1) 0%, transparent 70%)' }} />

        <div className="relative z-10 text-center max-w-md">
          {illustration || (
            <div className="mb-8">
              <svg viewBox="0 0 300 260" fill="none" className="w-full max-w-[280px] mx-auto" aria-hidden="true">
                {/* Heart */}
                <path d="M150 220 C150 220 70 160 70 110 C70 82 93 60 120 60 C136 60 150 72 150 86 C150 72 164 60 180 60 C207 60 230 82 230 110 C230 160 150 220 150 220Z" stroke="#FF5E8A" strokeWidth="3" fill="none" opacity="0.7" />
                <path d="M150 180 C150 180 100 135 100 105 C100 90 112 78 125 78 C134 78 143 85 150 95 C157 85 166 78 175 78 C188 78 200 90 200 105 C200 135 150 180 150 180Z" fill="#FFB3C6" opacity="0.3" />
                {/* Stars */}
                <circle cx="60" cy="50" r="3" fill="#C8A8F0" opacity="0.5" />
                <circle cx="240" cy="40" r="2" fill="#FFB3C6" opacity="0.5" />
                <circle cx="30" cy="120" r="2" fill="#B8F0E4" opacity="0.4" />
                <circle cx="270" cy="150" r="2.5" fill="#C8A8F0" opacity="0.4" />
                <circle cx="150" cy="30" r="2" fill="#FFF3B0" opacity="0.5" />
              </svg>
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 mb-4">
            <span className="font-display text-2xl font-extrabold text-white italic">ADORE</span>
            <span className="font-display text-2xl font-semibold text-pink italic">Blind Dating</span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed">
            Fall in love with their soul first. The premium blind dating platform where personality comes before photos.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-1.5 mb-8">
            <Link to="/" className="flex items-center gap-1.5">
              <span className="font-display text-xl font-extrabold text-white italic">ADORE</span>
              <span className="font-display text-xl font-semibold text-pink italic">Blind Dating</span>
            </Link>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-normal mb-3 italic">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body text-base md:text-lg text-white/50 leading-relaxed mb-8">
              {subtitle}
            </p>
          )}

          {children}
        </motion.div>
      </div>
    </div>
  );
}
