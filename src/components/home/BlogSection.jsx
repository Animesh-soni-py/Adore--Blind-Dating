import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';

const blogPosts = [
  {
    slug: 'how-we-went-from-blind-chat-to-moving-in-together',
    category: 'Love Stories',
    title: 'How We Went from Blind Chat to Moving In Together',
    imageUrl: '/images/blog/love_story_1.png',
    excerpt: 'Priya and Arjun matched on ADORE with a 96% compatibility score. After 7 days of deep conversations about their shared love of cooking and travel...',
  },
  {
    slug: '5-conversation-starters-that-actually-work-in-blind-dating',
    category: 'Dating Tips',
    title: '5 Conversation Starters That Actually Work in Blind Dating',
    imageUrl: '/images/blog/dating_tips.png',
    excerpt: 'Forget "hey" and "what\'s up." When you can\'t rely on photos, your words become everything. Here are five conversation openers that lead to deeper connections...',
  },
  {
    slug: 'the-psychology-behind-why-blind-dating-creates-stronger-bonds',
    category: 'Insights',
    title: 'The Psychology Behind Why Blind Dating Creates Stronger Bonds',
    imageUrl: '/images/blog/psychology_bonds.png',
    excerpt: 'Research shows that couples who form emotional connections before seeing each other report 40% higher relationship satisfaction. Here\'s the science behind it...',
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
    <section className="py-20 lg:py-5xl" aria-label="Blog and love stories">
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
            <Link
              key={i}
              to={`/blog/${post.slug}`}
              className="rounded-xl border border-white/10 overflow-hidden transition-all duration-250 ease-out hover:-translate-y-1 hover:shadow-card-hover group cursor-pointer block"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              {/* Illustration header */}
              <div className="h-[180px] overflow-hidden relative">
                <img 
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
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
                <span className="text-sm font-medium text-pink group-hover:underline">
                  Read Story →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
