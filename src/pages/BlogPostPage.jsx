import { useParams, Link } from 'react-router-dom';
import { posts } from '../data/blogPosts';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="pt-[72px] min-h-screen flex items-center justify-center" style={{ background: '#0F0A1E' }}>
        <div className="text-center">
          <span className="text-5xl block mb-4">📝</span>
          <h1 className="font-display text-2xl font-bold text-white mb-2">Post not found</h1>
          <Link to="/blog">
            <Button variant="primary" size="md" className="mt-4">← Back to Blog</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-[72px] min-h-screen" style={{ background: '#0F0A1E' }} id="main-content">
      <div className="container-adore py-12 lg:py-20 max-w-[720px] mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-pink font-semibold hover:underline mb-8 min-h-[44px]"
        >
          ← Back to Blog
        </Link>

        <div className="mb-8">
          <Badge variant="pink" className="mb-4">
            {post.category === 'Love Stories' ? '💕 ' : post.category === 'Dating Tips' ? '💡 ' : '🔬 '}
            {post.category}
          </Badge>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="h-[320px] rounded-xl overflow-hidden mb-10 relative">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-white/70 leading-relaxed whitespace-pre-line font-body">
          {post.content}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <Link to="/blog">
            <Button variant="ghost" size="md" className="text-white border-white/30">
              ← Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
