import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import HeroIllustration from '../illustrations/HeroIllustration';
import FloatingDecorators from '../illustrations/FloatingDecorators';

const stats = [
  { value: '12,000+', label: 'Matches Made' },
  { value: '94%', label: 'Satisfaction' },
  { value: 'Only in', label: 'Jabalpur' },
];

const floatingHearts = [
  { left: '10%', top: '20%', delay: 0, size: 12 },
  { left: '85%', top: '30%', delay: 1.5, size: 8 },
  { left: '25%', top: '70%', delay: 0.8, size: 10 },
  { left: '70%', top: '15%', delay: 2, size: 14 },
  { left: '50%', top: '80%', delay: 0.3, size: 6 },
];

export default function HeroSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const parallaxEls = sectionRef.current.querySelectorAll('[data-parallax]');
    
    function handleScroll() {
      const y = window.scrollY;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        el.style.transform = `translateY(${y * speed}px)`;
      });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B69 60%, #3D1A78 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient-shift 12s ease infinite',
      }}
      aria-label="Hero section"
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,168,240,0.15) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-50px] left-[-50px] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,94,138,0.1) 0%, transparent 70%)' }} />

      {/* Floating hearts */}
      {floatingHearts.map((heart, i) => (
        <div
          key={i}
          className="floating-particle"
          style={{
            left: heart.left,
            top: heart.top,
            animationDelay: `${heart.delay}s`,
            fontSize: heart.size,
          }}
        >
          💕
        </div>
      ))}

      <div className="container-adore relative z-10 py-32 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Badge variant="white" className="mb-6 border-pink/50 bg-pink/20 text-pink">
                Blind Dating Reimagined
              </Badge>
            </motion.div>

            <motion.h1
              className="font-display text-hero font-extrabold text-white mb-5 italic"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Fall in Love with Their{' '}
              <span className="text-gradient-pink pr-[0.15em]" style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(135deg, #FF5E8A, #C8A8F0)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                Soul
              </span>{' '}
              First
            </motion.h1>

            <motion.p
              className="text-body font-body text-white/50 max-w-[420px] mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              ADORE matches you based on personality, values, and compatibility — not photos. 
              Discover people who truly align with you. Real connections start here.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 mb-10"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link to="/city-selection">
                <Button variant="primary" size="lg" className="shadow-glow-pink hover:shadow-glow-pink-lg transition-shadow">
                  Start Your Journey
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="ghost" size="lg" className="text-white border-white/30 hover:bg-white/10">
                  See How It Works
                </Button>
              </a>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-white/80">
                    {stat.value}
                  </span>
                  <span className="text-xs text-white/35">{stat.label}</span>
                  {i < stats.length - 1 && (
                    <span className="text-white/15 ml-3">·</span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Illustration + Decorators */}
          <div className="relative" data-parallax="0.05">
            <FloatingDecorators className="absolute inset-0 z-0" />
            <HeroIllustration className="relative z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
