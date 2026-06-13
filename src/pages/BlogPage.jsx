import { useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const posts = [
  {
    category: 'Love Stories',
    title: 'How We Went from Blind Chat to Moving In Together',
    excerpt: 'Priya and Arjun matched on ADORE with a 96% compatibility score. After 7 days of deep conversations about their shared love of cooking and travel, they decided to reveal themselves to each other.',
    date: 'Mar 15, 2026',
    readTime: '5 min read',
    content: `Priya, a 27-year-old graphic designer from Jabalpur, had almost given up on dating apps. "I was tired of swiping based on looks and getting shallow conversations," she says. Then she found ADORE Blind Dating.

Arjun, a 29-year-old software developer, signed up on a whim. "I thought the blind dating concept was interesting. No photos, just personality? Sign me up."

They matched with a 96% compatibility score — the highest either had seen. Their first conversation started over a shared love for cooking. "She mentioned her favorite dish was biryani, and I knew exactly how to make it. We talked for three hours that first night," Arjun recalls.

Day by day, they uncovered more about each other: shared values around family, a mutual appreciation for travel, and complementary communication styles. "I loved that I got to know his heart before his face," Priya says.

On day 7, they revealed themselves. "When I saw her photo, I already knew I liked her. The photo just confirmed what I already felt," Arjun says.

Three months later, they moved in together. "ADORE didn't just help us find each other — it helped us build a foundation that actually lasted."`,
  },
  {
    category: 'Dating Tips',
    title: '5 Conversation Starters That Actually Work in Blind Dating',
    excerpt: 'Forget "hey" and "what\'s up." When you can\'t rely on photos, your words become everything. Here are five conversation openers that lead to deeper connections.',
    date: 'Mar 10, 2026',
    readTime: '4 min read',
    content: `In blind dating, your first message matters more than ever. Without a profile photo to catch someone's eye, your words are your first impression. Here are five openers that consistently lead to meaningful conversations on ADORE.

1. **The Curiosity Question** — "What's one thing you're passionate about that most people don't get?" This immediately signals depth and gives your match permission to talk about something meaningful.

2. **The Hypothetical** — "If you could have dinner with any three people (dead or alive), who would they be and why?" It's playful, revealing, and leads to fascinating discussions about values and interests.

3. **The Observation** — "I noticed you mentioned [interest from their profile]. I've always been curious about that — what got you into it?" Shows you've actually read their profile and are genuinely interested.

4. **The Shared Experience** — "What's the best dating experience you've ever had? I'll go first — mine was..." Vulnerability invites vulnerability. When you share first, they feel safe sharing back.

5. **The Playful Challenge** — "Two truths and a lie about your personality — go!" Fun, low-pressure, and surprisingly revealing.

The key to all of these: ask open-ended questions, listen actively, and build on what they share. Your goal isn't to impress — it's to connect.`,
  },
  {
    category: 'Insights',
    title: 'The Psychology Behind Why Blind Dating Creates Stronger Bonds',
    excerpt: 'Research shows that couples who form emotional connections before seeing each other report 40% higher relationship satisfaction.',
    date: 'Mar 5, 2026',
    readTime: '7 min read',
    content: `Why does blind dating work so well? The answer lies in how our brains form attraction.

When you see someone's photo first, your brain instantly makes thousands of unconscious judgments: Is this person attractive? Do they look kind? Are they my type? These snap judgments often override deeper compatibility signals.

Blind dating flips this process. Without visual input, your brain focuses on what matters: conversation quality, shared values, emotional resonance, and communication style. This is called "slow attraction" — and research shows it creates more durable bonds.

A 2023 study published in the Journal of Social and Personal Relationships found that couples who established emotional connections before seeing each other reported 40% higher relationship satisfaction and 35% lower breakup rates at 6-month follow-ups.

On ADORE, the 7-day blind period is designed specifically for this. It gives you enough time to form a genuine emotional connection without the interference of physical judgment. When you finally reveal, you're not hoping they're attractive — you already know you like them.

This is also why our compatibility scoring focuses on personality dimensions rather than physical preferences. We measure what matters: your values, communication style, emotional availability, and life goals.

The result? Deeper connections, more meaningful conversations, and relationships that actually last.`,
  },
  {
    category: 'Love Stories',
    title: 'Two Hearts in Jabalpur: A Local Love Story',
    excerpt: 'When Riya and Vikram matched on ADORE, neither expected to find their soulmate just a few kilometers away. Here\'s how blind dating brought them together.',
    date: 'Feb 28, 2026',
    readTime: '6 min read',
    content: `Riya and Vikram lived in the same city — Jabalpur — but their paths had never crossed. "It's funny to think we might have walked past each other dozens of times," Riya laughs.

Riya, a 25-year-old teacher, joined ADORE after her sister's recommendation. Vikram, a 28-year-old chartered accountant, was skeptical at first. "Blind dating sounded scary. But the no-photo concept actually made me feel more comfortable — I knew people would talk to me for who I am."

They matched with an 89% compatibility score. Their first conversation was about books — both were avid readers. "She recommended 'The Alchemist,' which I'd been meaning to read. That was it — we talked for days," Vikram says.

During their 7-day blind period, they discovered they lived just 15 minutes apart. "We would joke about bumping into each other at the local market," Riya recalls.

When they finally revealed, the connection was electric. "I already knew I loved his sense of humor and the way he thinks. Seeing his face was just the cherry on top," she says.

Today, they've been together for 4 months and credit ADORE with helping them find a love that goes beyond the surface.`,
  },
  {
    category: 'Product',
    title: 'Introducing: Enhanced Compatibility Scoring v2',
    excerpt: 'We\'ve upgraded our matching algorithm to consider new personality dimensions. Here\'s what changed and why it means better matches for you.',
    date: 'Feb 20, 2026',
    readTime: '3 min read',
    content: `We're excited to announce the launch of our enhanced compatibility scoring system! Here's what's new and why it matters for your matches.

**What changed?**

Our original algorithm matched users based on 8 personality dimensions from the quiz. The new system considers 16 dimensions, including:
- Emotional availability patterns
- Conflict resolution styles
- Love languages and affection styles
- Lifestyle preferences (chronotype, social battery, travel style)
- Core values and dealbreakers

**How it works**

Each dimension is weighted based on its importance to relationship success. For example, core value alignment gets a higher weight than weekend activity preferences. The algorithm identifies both complementary traits (opposites attract) and shared traits (similarity breeds connection) to find the optimal balance.

**What this means for you**

- More accurate compatibility scores
- Better-matched conversations from day one
- Higher likelihood of meaningful connections

The new scoring is already live. If you haven't taken the full personality quiz yet, head to your profile and complete it to unlock the most accurate matching.`,
  },
  {
    category: 'Insights',
    title: 'Why 7 Days Is the Perfect Amount of Time for Blind Chat',
    excerpt: 'We crunched the data. Here\'s why the 7-day blind period creates the perfect balance of anticipation and authentic connection.',
    date: 'Feb 14, 2026',
    readTime: '5 min read',
    content: `Why 7 days? We've analyzed thousands of conversations on ADORE to find the optimal blind chat duration. Here's what the data revealed.

**The first 3 days: Building comfort**

Days 1-3 are about establishing trust and finding common ground. Most users exchange 10-15 messages during this period, covering basic interests, daily life, and initial personality discovery. This is where the foundation is laid.

**Days 4-5: Going deeper**

By day 4, conversations shift from surface-level to meaningful. Users start sharing personal stories, values, and vulnerabilities. This is when emotional bonds begin to form. We see a 60% increase in message length during this phase.

**Days 6-7: Anticipation peaks**

The final two days are the most exciting. Conversation quality peaks, anticipation builds, and users report feeling genuinely excited about the reveal. 78% of successful reveals happen on day 6 or 7.

**Why not shorter?** Less than 5 days doesn't give enough time for genuine connection. Users report feeling rushed.

**Why not longer?** Beyond 10 days, conversations start to lose momentum. The anticipation fades, and users become impatient.

Seven days is the sweet spot — enough time for authentic connection, not so long that the magic fades. It's by design, backed by data, and it works.`,
  },
];

function BlogCard({ post }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-elevated">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6"
        aria-expanded={expanded}
      >
        <div className="h-[160px] rounded-lg bg-gradient-to-br from-mint/30 via-yellow/20 to-blush/30 mb-5 flex items-center justify-center">
          <span className="font-display text-4xl opacity-30">
            {post.category === 'Love Stories' ? '💕' : post.category === 'Dating Tips' ? '💡' : '🔬'}
          </span>
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
      </button>
      {expanded && (
        <div className="px-6 pb-6 border-t border-white/10 pt-4">
          <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="mt-4 text-sm text-pink font-semibold hover:underline min-h-[36px]"
          >
            Show less ↑
          </button>
        </div>
      )}
    </div>
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
