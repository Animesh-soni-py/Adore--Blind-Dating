import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const teamValues = [
  {
    emoji: '💘',
    title: 'Connection Over Looks',
    description: 'We believe the best relationships start with personality, not photos. Our entire platform is built around fostering genuine emotional connections.',
  },
  {
    emoji: '🛡️',
    title: 'Safety First',
    description: 'Every member is verified, every conversation is private, and every report is taken seriously. Your safety is non-negotiable.',
  },
  {
    emoji: '🧠',
    title: 'Science-Backed Matching',
    description: 'Our compatibility engine is built on relationship psychology research, analyzing values, communication styles, and life goals.',
  },
  {
    emoji: '🌏',
    title: 'For Everyone',
    description: 'ADORE is designed for people of all ages, backgrounds, and orientations who are tired of superficial swiping and ready for something real.',
  },
];

export default function AboutPage() {
  return (
    <main className="pt-[72px]" id="main-content">
        {/* Hero */}
        <section className="bg-dark py-20 lg:py-5xl text-center">
          <div className="container-adore">
            <h1 className="font-display text-section-h2 font-extrabold text-white mb-5">
              We&apos;re on a Mission to Make Dating{' '}
              <span className="text-pink">Deeper</span>
            </h1>
            <p className="text-body text-white/50 max-w-[600px] mx-auto leading-relaxed mb-8">
              ADORE Blind Dating was founded in 2026 with a simple idea: what if dating apps focused on who you are, not what you look like? We&apos;re building a world where personality comes first.
            </p>
            <Link to="/signup">
              <Button variant="primary" size="lg">
                Join the Movement
              </Button>
            </Link>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 lg:py-5xl" style={{ background: '#0F0A1E' }}>
          <div className="container-adore">
            <div className="text-center mb-14">
              <p className="font-display text-caption font-bold tracking-[3px] uppercase text-pink mb-4">
                What We Believe
              </p>
              <h2 className="font-display text-section-h2 font-extrabold text-white">
                Our Core <span className="text-pink">Values</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
              {teamValues.map((val, i) => (
                <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-7">
                  <span className="text-3xl mb-4 block">{val.emoji}</span>
                  <h3 className="font-display text-card-h3 font-bold text-white mb-3">{val.title}</h3>
                  <p className="text-body text-white/70 leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 lg:py-5xl" style={{ background: 'linear-gradient(180deg, #0F0A1E 0%, #1A1A2E 100%)' }}>
          <div className="container-adore max-w-[700px]">
            <p className="font-display text-caption font-bold tracking-[3px] uppercase text-pink mb-4 text-center">
              Our Story
            </p>
            <h2 className="font-display text-section-h2 font-extrabold text-white mb-8 text-center">
              Why We Built <span className="text-pink">ADORE</span>
            </h2>
            <div className="space-y-5 text-body text-white/70 leading-relaxed">
              <p>
                It started with a conversation between two friends who were tired of the dating app scene. Swipe, match, small talk, ghost. Repeat. The magic of getting to know someone — the real getting-to-know-you — was lost in a sea of filtered selfies and pickup lines.
              </p>
              <p>
                We wondered: what if you could fall for someone&apos;s mind before you ever saw their face? What if compatibility was measured by values and conversation, not by height and job title?
              </p>
              <p>
                That&apos;s how ADORE was born. A platform where your personality takes the lead, where 7 days of blind conversation build authentic connection, and where the big reveal is the beginning of something real — not the end of another swipe session.
              </p>
              <p className="font-display text-lg font-bold text-white pt-4">
                Fall in love with their soul first. 💘
              </p>
            </div>
          </div>
        </section>
      </main>
  );
}
