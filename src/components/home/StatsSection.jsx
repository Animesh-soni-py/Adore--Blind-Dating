import { useRef, useEffect, useState } from 'react';

const stats = [
  { value: 12847, suffix: '', label: 'Matches Made' },
  { value: 94, suffix: '%', label: 'Satisfaction Rate' },
  { value: 7, suffix: ' Days', label: 'Avg. First Reveal' },
  { value: 50, suffix: '+', label: 'Cities Active' },
];

function CountUp({ target, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-dark py-16 lg:py-20 relative overflow-hidden" aria-label="Statistics">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,94,138,0.06) 0%, transparent 70%)' }} />

      <div className="container-adore relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="relative group">
              {/* Glow behind number */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle, rgba(255,94,138,0.15) 0%, transparent 70%)' }} />
              </div>
              <p className="font-display text-4xl lg:text-5xl font-extrabold text-pink mb-2 relative z-10 transition-transform duration-300 group-hover:scale-105">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="font-display text-xs font-semibold tracking-[2px] uppercase text-white/50 relative z-10">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
