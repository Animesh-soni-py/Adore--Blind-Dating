import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import CTAIllustration from '../illustrations/CTAIllustration';

const floatingHearts = [
  { left: '5%', top: '15%', delay: 0, size: 16 },
  { left: '90%', top: '25%', delay: 1, size: 12 },
  { left: '15%', top: '75%', delay: 2, size: 10 },
  { left: '80%', top: '65%', delay: 0.5, size: 14 },
];

export default function CTASection() {
  return (
    <section className="relative py-12 lg:py-5xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #2D1B69 0%, #3D1A78 50%, #FF5E8A 150%)' }} aria-label="Call to action">
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
            opacity: 0.15,
          }}
        >
          💕
        </div>
      ))}

      <div className="container-adore relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div>
            <h2 className="font-display text-section-h2 font-extrabold text-white mb-5 italic">
              Ready to Meet Someone{' '}
              <span className="text-dark">Real</span>?
            </h2>
            <p className="text-body font-body text-white/70 max-w-[440px] mb-8 leading-relaxed">
              Join thousands of people who chose personality over photos. 
              Your next great connection is one quiz away. Sign up free — no credit card, no commitment, just real people.
            </p>
            <Link to="/signup">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-dark border-dark shadow-neo hover:shadow-neo-hover relative group"
              >
                <span className="relative z-10">Join Adore Free</span>
                {/* Pulsing glow */}
                <span className="absolute inset-0 rounded-xl bg-white/30 animate-pulse-ring pointer-events-none group-hover:bg-white/50" />
              </Button>
            </Link>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:block">
            <CTAIllustration className="max-w-[380px] ml-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
