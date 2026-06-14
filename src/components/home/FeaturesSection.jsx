import { useRef, useEffect } from 'react';

const features = [
  {
    emoji: '💬',
    title: 'Personality First',
    description: 'Get to know their humor, values, and vibe through our in-depth personality quiz. We match based on who you are, not just how you look.',
    bg: 'bg-mint',
    iconBg: 'bg-mint/40',
  },
  {
    emoji: '🔒',
    title: 'Fully Verified',
    description: 'Every member goes through identity verification. Zero fake profiles, zero catfishing. Just real people looking for real connection.',
    bg: 'bg-yellow',
    iconBg: 'bg-yellow/60',
  },
  {
    emoji: '💘',
    title: 'AI-Powered Matching',
    description: 'Our compatibility engine analyzes values, interests, and communication style to find your top matches every week.',
    bg: 'bg-blush',
    iconBg: 'bg-blush/40',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <section id="features" className="py-20 lg:py-5xl relative scroll-mt-20" aria-label="Features">
      <div className="container-adore">
        <div className="text-center mb-14">
          <p className="font-display text-caption font-bold tracking-[3px] uppercase text-pink mb-4 italic">
            Why ADORE
          </p>
          <h2 className="font-display text-section-h2 font-extrabold text-white">
            What Makes Us <span className="text-pink">Different</span>
          </h2>
        </div>

        <div
          ref={sectionRef}
          className="reveal-section stagger-children grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <div
              key={i}
              className={`rounded-xl p-7 border border-white/10 transition-all duration-250 ease-out hover:-translate-y-1 hover:shadow-card-hover`}
              style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-5 ${feature.iconBg}`}
              >
                {feature.emoji}
              </div>
              <h3 className="font-display text-card-h3 font-bold text-white mb-3 italic">
                {feature.title}
              </h3>
              <p className="text-[15px] font-body text-white/55 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
