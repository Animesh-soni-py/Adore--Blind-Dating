import { useRef, useEffect } from 'react';
import PhoneMockup from '../illustrations/PhoneMockup';

const steps = [
  {
    number: '01',
    title: 'Create Your Profile',
    description: 'Fill out our personality quiz covering your values, lifestyle, and what makes you tick. No photos needed yet.',
  },
  {
    number: '02',
    title: 'Get Matched',
    description: 'Our AI analyzes your responses and finds your most compatible matches based on genuine personality alignment.',
  },
  {
    number: '03',
    title: 'Compare Interests',
    description: 'Review your compatibility score and shared interests with each match to see who truly aligns with you.',
  },
  {
    number: '04',
    title: 'Connect & Grow',
    description: 'Once matched, explore your mutual interests and decide if you\'d like to take the next step together.',
  },
];

export default function HowItWorksSection() {
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
    <section
      id="how-it-works"
      className="py-20 lg:py-5xl scroll-mt-20"
      aria-label="How It Works"
    >
      <div className="container-adore">
        <div className="text-center mb-14">
          <p className="font-display text-caption font-bold tracking-[3px] uppercase text-pink mb-4 italic">
            Simple & Magical
          </p>
          <h2 className="font-display text-section-h2 font-extrabold text-white">
            How Adore <span className="text-pink">Works</span>
          </h2>
        </div>

        <div
          ref={sectionRef}
          className="reveal-section grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left: Steps */}
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex gap-5 group"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="flex-shrink-0">
                  <span className="font-display text-3xl font-extrabold text-pink/30 group-hover:text-pink transition-colors duration-300 italic">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-pink transition-colors duration-300 italic">
                    {step.title}
                  </h3>
                  <p className="text-[15px] font-body text-white/55 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Phone Mockup */}
          <div className="hidden md:block">
            <PhoneMockup className="mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
