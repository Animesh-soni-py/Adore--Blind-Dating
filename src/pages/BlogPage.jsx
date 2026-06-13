import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const posts = [
  {
    category: 'Love Stories',
    title: 'How We Went from Blind Chat to Moving In Together',
    excerpt: 'Priya and Arjun matched on ADORE with a 96% compatibility score. After 7 days of deep conversations about their shared love of cooking and travel...',
    date: 'Mar 15, 2026',
    readTime: '5 min read',
  },
  {
    category: 'Dating Tips',
    title: '5 Conversation Starters That Actually Work in Blind Dating',
    excerpt: 'Forget "hey" and "what\'s up." When you can\'t rely on photos, your words become everything. Here are five conversation openers that lead to deeper connections...',
    date: 'Mar 10, 2026',
    readTime: '4 min read',
  },
  {
    category: 'Insights',
    title: 'The Psychology Behind Why Blind Dating Creates Stronger Bonds',
    excerpt: 'Research shows that couples who form emotional connections before seeing each other report 40% higher relationship satisfaction.',
    date: 'Mar 5, 2026',
    readTime: '7 min read',
  },
  {
    category: 'Love Stories',
    title: 'From 5,000 Kilometers Apart to a Life Together',
    excerpt: 'When Riya in Jabalpur matched with Vikram in Jabalpur, neither expected the connection they found. Here\'s how they made long-distance blind dating work.',
    date: 'Feb 28, 2026',
    readTime: '6 min read',
  },
  {
    category: 'Product',
    title: 'Introducing: Enhanced Compatibility Scoring v2',
    excerpt: 'We\'ve upgraded our matching algorithm to consider 8 new personality dimensions. Here\'s what changed and why it means better matches for you.',
    date: 'Feb 20, 2026',
    readTime: '3 min read',
  },
  {
    category: 'Insights',
    title: 'Why 7 Days Is the Perfect Amount of Time for Blind Chat',
    excerpt: 'We crunched the data. Here\'s why the 7-day blind period creates the perfect balance of anticipation and authentic connection.',
    date: 'Feb 14, 2026',
    readTime: '5 min read',
  },
];

export default function BlogPage() {
  return (
    <main className="pt-[72px] min-h-screen" style={{ background: '#0F0A1E' }} id="main-content">
        <div className="container-adore py-12 lg:py-20">
          {/* Header */}
          <div className="text-center mb-14">
            <Badge variant="pink" className="mb-4">Stories & Insights</Badge>
            <h1 className="font-display text-section-h2 font-extrabold text-white mb-4">
              The ADORE <span className="text-pink">Blog</span>
            </h1>
            <p className="text-body text-white/50 max-w-[500px] mx-auto">
              Love stories, dating tips, and insights from the team behind ADORE Blind Dating.
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Card key={i} bgColor="bg-white/5" padding="p-6" className="border border-white/10">
                <div className="h-[160px] rounded-lg bg-gradient-to-br from-mint/30 via-yellow/20 to-blush/30 mb-5 flex items-center justify-center">
                  <span className="font-display text-4xl opacity-30">
                    {post.category === 'Love Stories' ? '💕' : post.category === 'Dating Tips' ? '💡' : '🔬'}
                  </span>
                </div>
                <Badge variant="pink" className="mb-3">{post.category}</Badge>
                <h2 className="font-display text-lg font-bold text-white mb-2 hover:text-pink transition-colors cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-sm text-white/50 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/35">{post.date}</span>
                  <span className="text-xs text-white/35">{post.readTime}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
