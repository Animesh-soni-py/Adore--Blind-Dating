import { useRef, useEffect } from 'react';
import Badge from '../ui/Badge';

const blogPosts = [
  {
    category: 'Love Stories',
    title: 'How We Went from Blind Chat to Moving In Together',
    excerpt: 'Priya and Arjun matched on ADORE with a 96% compatibility score. After 7 days of deep conversations about their shared love of cooking and travel...',
    illustration: (
      <svg viewBox="0 0 400 200" fill="none" className="w-full h-full" aria-hidden="true">
        <rect width="400" height="200" fill="#F5F0FF" rx="12" />
        <circle cx="150" cy="100" r="40" fill="#FFB3C6" opacity="0.3" />
        <circle cx="250" cy="100" r="40" fill="#B8F0E4" opacity="0.3" />
        <ellipse cx="200" cy="100" rx="30" ry="28" fill="#FF5E8A" opacity="0.2" />
        {/* Beach couple silhouettes */}
        <circle cx="175" cy="85" r="12" fill="#C8A8F0" opacity="0.5" />
        <path d="M165 120 Q175 108 185 120" fill="#C8A8F0" opacity="0.4" />
        <circle cx="225" cy="85" r="12" fill="#FFB3C6" opacity="0.5" />
        <path d="M215 120 Q225 108 235 120" fill="#FFB3C6" opacity="0.4" />
        {/* Heart between */}
        <path d="M200 95 C200 95 194 91 194 87 C194 85 196 83 198 83 C199 83 200 84 200 85 C200 84 201 83 202 83 C204 83 206 85 206 87 C206 91 200 95 200 95Z" fill="#FF5E8A" opacity="0.7" />
        {/* Sun */}
        <circle cx="340" cy="40" r="20" fill="#FFF3B0" opacity="0.6" />
        {/* Waves */}
        <path d="M0 160 Q50 150 100 160 Q150 170 200 160 Q250 150 300 160 Q350 170 400 160 L400 200 L0 200Z" fill="#B8F0E4" opacity="0.3" />
      </svg>
    ),
  },
  {
    category: 'Dating Tips',
    title: '5 Conversation Starters That Actually Work in Blind Dating',
    excerpt: 'Forget "hey" and "what\'s up." When you can\'t rely on photos, your words become everything. Here are five conversation openers that lead to deeper connections...',
    illustration: (
      <svg viewBox="0 0 400 200" fill="none" className="w-full h-full" aria-hidden="true">
        <rect width="400" height="200" fill="#FFF3B0" rx="12" />
        {/* Puzzle pieces forming heart */}
        <g transform="translate(130, 30)">
          <rect x="0" y="40" width="60" height="60" rx="8" fill="#FF5E8A" opacity="0.25" transform="rotate(-5 30 70)" />
          <rect x="50" y="30" width="60" height="60" rx="8" fill="#C8A8F0" opacity="0.25" transform="rotate(5 80 60)" />
          <rect x="25" y="80" width="60" height="60" rx="8" fill="#B8F0E4" opacity="0.25" transform="rotate(2 55 110)" />
          {/* Heart in center */}
          <path d="M70 80 C70 80 58 72 58 64 C58 60 62 57 66 57 C68 57 70 58 70 60 C70 58 72 57 74 57 C78 57 82 60 82 64 C82 72 70 80 70 80Z" fill="#FF5E8A" opacity="0.6" />
        </g>
        {/* Chat bubbles */}
        <rect x="280" y="40" width="80" height="30" rx="15" fill="white" opacity="0.6" />
        <rect x="290" y="80" width="60" height="30" rx="15" fill="#FFB3C6" opacity="0.4" />
        <circle cx="295" cy="55" r="3" fill="#C8A8F0" opacity="0.5" />
        <circle cx="305" cy="55" r="3" fill="#C8A8F0" opacity="0.5" />
        <circle cx="315" cy="55" r="3" fill="#C8A8F0" opacity="0.5" />
      </svg>
    ),
  },
  {
    category: 'Insights',
    title: 'The Psychology Behind Why Blind Dating Creates Stronger Bonds',
    excerpt: 'Research shows that couples who form emotional connections before seeing each other report 40% higher relationship satisfaction. Here\'s the science behind it...',
    illustration: (
      <svg viewBox="0 0 400 200" fill="none" className="w-full h-full" aria-hidden="true">
        <rect width="400" height="200" fill="#FFB3C6" opacity="0.2" rx="12" />
        {/* City skyline silhouette */}
        <rect x="40" y="100" width="30" height="80" rx="2" fill="#1A1A2E" opacity="0.08" />
        <rect x="80" y="80" width="25" height="100" rx="2" fill="#1A1A2E" opacity="0.06" />
        <rect x="115" y="110" width="35" height="70" rx="2" fill="#1A1A2E" opacity="0.08" />
        <rect x="160" y="90" width="20" height="90" rx="2" fill="#1A1A2E" opacity="0.05" />
        <rect x="250" y="95" width="30" height="85" rx="2" fill="#1A1A2E" opacity="0.07" />
        <rect x="290" y="75" width="25" height="105" rx="2" fill="#1A1A2E" opacity="0.06" />
        <rect x="325" y="105" width="35" height="75" rx="2" fill="#1A1A2E" opacity="0.08" />
        {/* Couple silhouettes on a bench */}
        <circle cx="190" cy="115" r="10" fill="#C8A8F0" opacity="0.4" />
        <circle cx="215" cy="115" r="10" fill="#FFB3C6" opacity="0.4" />
        <rect x="178" y="130" width="50" height="5" rx="2" fill="#E8C97A" opacity="0.4" />
        {/* Moon */}
        <circle cx="340" cy="40" r="18" fill="#FFF3B0" opacity="0.5" />
        {/* Stars */}
        <circle cx="60" cy="30" r="2" fill="#E8C97A" opacity="0.5" />
        <circle cx="140" cy="45" r="1.5" fill="#E8C97A" opacity="0.4" />
        <circle cx="270" cy="25" r="2" fill="#E8C97A" opacity="0.5" />
        <circle cx="220" cy="40" r="1" fill="#E8C97A" opacity="0.3" />
      </svg>
    ),
  },
];

export default function BlogSection() {
  const sectionRef = useRef(null);

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

  return (
    <section className="py-20 lg:py-5xl" style={{ background: 'linear-gradient(180deg, #1A1A2E 0%, #0F0A1E 100%)' }} aria-label="Blog and love stories">
      <div className="container-adore">
        <div className="text-center mb-14">
          <p className="font-display text-caption font-bold tracking-[3px] uppercase text-pink mb-4 italic">
            Stories & Insights
          </p>
          <h2 className="font-display text-section-h2 font-extrabold text-white">
            From Our <span className="text-pink">Blog</span>
          </h2>
        </div>

        <div
          ref={sectionRef}
          className="reveal-section stagger-children grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {blogPosts.map((post, i) => (
            <article
              key={i}
              className="rounded-xl border border-white/10 overflow-hidden transition-all duration-250 ease-out hover:-translate-y-1 hover:shadow-card-hover group cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              {/* Illustration header */}
              <div className="h-[180px] overflow-hidden">
                {post.illustration}
              </div>

              <div className="p-6">
                <Badge variant="pink" className="mb-3">
                  {post.category}
                </Badge>
                <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-pink transition-colors italic">
                  {post.title}
                </h3>
                <p className="text-sm font-body text-white/50 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <span className="text-sm font-medium text-pink hover:underline">
                  Read Story →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
