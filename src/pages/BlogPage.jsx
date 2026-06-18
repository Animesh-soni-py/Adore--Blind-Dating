import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import { posts } from '../data/blogPosts';

function BlogCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-elevated block p-6"
    >
      <div className="h-[160px] rounded-lg overflow-hidden mb-5 relative">
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <Badge variant="pink" className="mb-3">{post.category}</Badge>
      <h2 className="font-display text-lg font-bold text-white mb-2 hover:text-pink transition-colors">
        {post.title}
      </h2>
      <p className="text-sm text-white/50 leading-relaxed mb-4">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/35">{post.date}</span>
        <span className="text-xs text-white/35">{post.readTime}</span>
      </div>
      <div className="mt-4">
        <span className="text-sm text-pink font-semibold">Read more →</span>
      </div>
    </Link>
  );
}

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
              <BlogCard key={i} post={post} />
            ))}
          </div>
        </div>
      </main>
  );
}
