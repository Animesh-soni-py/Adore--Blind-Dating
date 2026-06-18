import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const steps = [
  {
    number: '01',
    title: 'Fill the Questionnaire',
    description:
      'Tell us about yourself through our thoughtful 23-step questionnaire. No small talk — only meaningful insights about your personality, lifestyle, and what you\'re looking for in a partner.',
    icon: '📝',
    color: 'from-pink/20 to-pink/5',
    borderColor: 'border-pink/20',
  },
  {
    number: '02',
    title: 'We Match You',
    description:
      'Our compatibility engine analyzes your responses — values, lifestyle, communication style, and date preferences — to find people who truly resonate with who you are. No algorithms gaming attention.',
    icon: '💘',
    color: 'from-lavender/20 to-lavender/5',
    borderColor: 'border-lavender/20',
  },
  {
    number: '03',
    title: 'Your Blind Date',
    description:
      'If a match is confirmed, you begin your blind chat journey. 7 days of genuine conversation — no photos, no judgment. When you\'re both ready, reveal and decide your next chapter.',
    icon: '✨',
    color: 'from-lime/20 to-lime/5',
    borderColor: 'border-lime/20',
  },
];

const faqs = [
  {
    q: 'How is ADORE different from other dating apps?',
    a: 'We match you based on personality and compatibility — not just looks. You chat blindly for 7 days before any photo reveal, creating genuine connections built on conversation.',
  },
  {
    q: 'Is my information safe?',
    a: 'Absolutely. Your data is encrypted and never shared without your consent. We take your privacy seriously.',
  },
  {
    q: 'What if I don\'t like my match?',
    a: 'No pressure! After the blind chat period, both parties choose whether to reveal photos and continue. You can always part as friends.',
  },
  {
    q: 'How long does the matching process take?',
    a: 'Once you complete your profile questionnaire, you\'ll start receiving compatible matches within a few days.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="pt-[72px] min-h-screen" style={{ background: '#0F0A1E' }} id="main-content">
        {/* Breadcrumb + Hero */}
        <section
          className="py-12 lg:py-24 text-center"
          style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B69 50%, #1A1A2E 100%)' }}
        >
          <div className="container-adore">
            <motion.p
              className="text-sm text-white/40 mb-6 font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              {' / '}
              <span className="text-white/60">How It Works</span>
            </motion.p>
            <motion.h1
              className="font-display text-4xl md:text-5xl font-extrabold text-white mb-5 italic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              How <span className="text-pink">ADORE</span> Works
            </motion.h1>
            <motion.p
              className="font-body text-base md:text-lg text-white/50 max-w-[560px] mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              ADORE is designed to give you genuine conversations, not endless swipes.
              Here's how the magic works.
            </motion.p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-10 lg:py-20">
          <div className="container-adore max-w-[900px]">
            <div className="space-y-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className={`relative p-8 md:p-10 rounded-3xl bg-gradient-to-br ${step.color} border ${step.borderColor} backdrop-blur-sm`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * i + 0.3 }}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-pink/20 flex items-center justify-center">
                        <span className="font-display text-xl font-extrabold text-pink italic">{step.number}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{step.icon}</span>
                        <h2 className="font-display text-xl md:text-2xl font-bold text-white italic">
                          {step.title}
                        </h2>
                      </div>
                      <p className="font-body text-base text-white/55 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="absolute left-[3.25rem] bottom-0 translate-y-full w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10 lg:py-20 border-t border-white/5">
          <div className="container-adore max-w-[800px]">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-display text-caption font-bold tracking-[3px] uppercase text-pink mb-3 italic">
                Common Questions
              </p>
              <h2 className="font-display text-3xl font-extrabold text-white italic">
                Frequently Asked
              </h2>
            </motion.div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.details
                  key={i}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink/20 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                >
                  <summary className="font-display text-base font-bold text-white list-none flex items-center justify-between">
                    {faq.q}
                    <span className="text-pink ml-4 transition-transform group-open:rotate-45 text-xl">+</span>
                  </summary>
                  <p className="mt-4 font-body text-sm text-white/50 leading-relaxed">
                    {faq.a}
                  </p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 lg:py-24 text-center">
          <div className="container-adore">
            <motion.h2
              className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4 italic"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Begin Your <span className="text-pink">Journey?</span>
            </motion.h2>
            <motion.p
              className="font-body text-base text-white/50 mb-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Fill out our questionnaire and let us find someone who truly gets you.
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/city-selection">
                <Button variant="primary" size="lg" className="shadow-glow-pink">
                  Start Your Journey →
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" size="lg" className="text-white border-white/30 hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
  );
}
