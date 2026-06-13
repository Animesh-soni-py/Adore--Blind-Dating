import { useState, useEffect, useCallback, useRef } from 'react';
import TestimonialIllustration from '../illustrations/TestimonialIllustration';

const testimonials = [
  {
    quote: 'I was so tired of being judged by my photos on other apps. ADORE gave me the chance to show who I really am. My match and I bonded over our shared interests before anything else. It felt so natural and real.',
    name: 'Priya K.',
    city: 'Jabalpur',
    matchDuration: 'Together 8 months',
  },
  {
    quote: 'The personality quiz matched me with someone I never would have swiped right on — and now she\'s the love of my life. Blind dating removes the superficial layer and gets straight to what matters.',
    name: 'Arjun M.',
    city: 'Jabalpur',
    matchDuration: 'Together 1 year',
  },
  {
    quote: 'As someone in my late 30s, I thought dating apps weren\'t for me. ADORE proved me wrong. The conversations are deeper, the matches are better, and the people are genuine. I wish this existed 10 years ago.',
    name: 'Sneha R.',
    city: 'Jabalpur',
    matchDuration: 'Together 5 months',
  },
  {
    quote: 'We bonded over our shared love of astronomy and terrible cooking skills before we ever saw each other. That\'s the kind of foundation you want for a relationship. Thank you, ADORE.',
    name: 'Karthik S.',
    city: 'Jabalpur',
    matchDuration: 'Together 11 months',
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);
  const sectionRef = useRef(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  /* Auto-advance every 5 seconds */
  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, [next]);

  function handleManualNav(direction) {
    clearInterval(intervalRef.current);
    direction === 'next' ? next() : prev();
    intervalRef.current = setInterval(next, 5000);
  }

  /* Scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.12 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  const t = testimonials[current];

  return (
    <section
      id="testimonials"
      className="py-20 lg:py-5xl scroll-mt-20"
      style={{ background: 'linear-gradient(180deg, #0F0A1E 0%, #1A1A2E 50%, #2D1B69 100%)' }}
      aria-label="Testimonials"
    >
      <div className="container-adore">
        <div className="text-center mb-14">
          <p className="font-display text-caption font-bold tracking-[3px] uppercase text-pink mb-4 italic">
            Real Stories
          </p>
          <h2 className="font-display text-section-h2 font-extrabold text-white">
            What Our <span className="text-pink">Members Say</span>
          </h2>
        </div>

        <div
          ref={sectionRef}
          className="reveal-section grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center"
        >
          {/* Left: Quote */}
          <div className="relative">
            <div className="quote-mark mb-2" aria-hidden="true">❝</div>
            <div className="overflow-hidden">
              <p
                key={current}
                className="font-body text-xl md:text-2xl italic text-white/65 leading-relaxed mb-8 max-w-[560px] transition-opacity duration-500"
                style={{ animation: 'fadeUp 0.5s ease both' }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="mb-8">
              <p className="font-display text-base font-bold text-white italic">{t.name}</p>
              <p className="text-sm text-white/45">
                {t.city} · {t.matchDuration}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleManualNav('prev')}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-pink hover:border-pink transition-colors"
                aria-label="Previous testimonial"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => handleManualNav('next')}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-pink hover:border-pink transition-colors"
                aria-label="Next testimonial"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dots */}
              <div className="flex gap-2 ml-4">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      clearInterval(intervalRef.current);
                      setCurrent(i);
                      intervalRef.current = setInterval(next, 5000);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === current ? 'bg-pink w-6' : 'bg-white/20'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-current={i === current ? 'true' : undefined}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:block">
            <TestimonialIllustration className="w-[320px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
