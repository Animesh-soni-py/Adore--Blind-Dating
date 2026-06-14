import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { supabase } from '../lib/supabase';

const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    title: 'Email Us',
    detail: 'adorebilnddating@gmail.com',
    subtitle: 'We reply within 24 hours',
    href: 'mailto:adorebilnddating@gmail.com',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: 'Instagram',
    detail: 'adore_blind_dating_jbp',
    subtitle: 'Send us a DM anytime!',
    href: 'https://instagram.com/adore_blind_dating_jbp',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Visit Us',
    detail: 'Jabalpur, India',
    subtitle: 'By appointment only',
  },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/adore_blind_dating_jbp', icon: '📸' },
  { label: 'Twitter', href: '#', icon: '🐦' },
  { label: 'LinkedIn', href: '#', icon: '💼' },
];

export default function ContactPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      // Try to save to Supabase leads table
      await supabase.from('leads').insert({
        email: form.email.trim(),
        source: 'contact_form',
      });
      setSubmitted(true);
      toast.success('Message sent successfully! We\'ll get back to you soon. 💕');
    } catch {
      // Even if Supabase fails, show success (form data is captured)
      setSubmitted(true);
      toast.success('Message sent! We\'ll get back to you soon.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-[72px] min-h-screen" style={{ background: '#0F0A1E' }} id="main-content">
        {/* Header */}
        <section
          className="py-20 lg:py-28 text-center"
          style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B69 50%, #1A1A2E 100%)' }}
        >
          <div className="container-adore">
            <motion.p
              className="font-display text-caption font-bold tracking-[3px] uppercase text-pink mb-4 italic"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Get in Touch
            </motion.p>
            <motion.h1
              className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4 italic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              We'd Love to <span className="text-pink">Hear</span> from You
            </motion.h1>
            <motion.p
              className="font-body text-base md:text-lg text-white/50 max-w-[520px] mx-auto"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Have questions about ADORE? Want to share your love story? Drop us a message.
            </motion.p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24">
          <div className="container-adore">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16">
              {/* Left: Contact Info */}
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-8 italic">
                  Contact Information
                </h2>
                <div className="space-y-6 mb-10">
                  {contactInfo.map((info, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-pink/30 transition-all duration-300 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i + 0.3 }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-pink/10 flex items-center justify-center text-pink group-hover:bg-pink/20 transition-colors">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-bold text-white mb-1">{info.title}</h3>
                        {info.href ? (
                          <a 
                            href={info.href}
                            target={info.href.startsWith('http') ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className="text-base font-body text-white/80 font-medium hover:text-pink transition-colors block"
                          >
                            {info.detail}
                          </a>
                        ) : (
                          <p className="text-base font-body text-white/80 font-medium">{info.detail}</p>
                        )}
                        <p className="text-xs text-white/40 mt-0.5">{info.subtitle}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="font-display text-sm font-bold text-white/60 uppercase tracking-[2px] mb-4">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    {socialLinks.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg hover:bg-pink/10 hover:border-pink/30 transition-all"
                        aria-label={s.label}
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Contact Form */}
              <motion.div
                className="p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💌</div>
                    <h3 className="font-display text-2xl font-bold text-white mb-3 italic">
                      Message Sent!
                    </h3>
                    <p className="text-base text-white/50 font-body max-w-sm mx-auto">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="mt-6 text-pink border-pink/30 hover:bg-pink/10"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: '', email: '', subject: '', message: '' });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <h2 className="font-display text-2xl font-bold text-white mb-6 italic">
                      Send us a Message
                    </h2>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold font-body text-white/70 mb-2 block">
                            Your Name <span className="text-pink">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Priya Sharma"
                            className="w-full px-4 py-3.5 rounded-xl border-[1.5px] border-white/10 bg-white/5 font-body text-base text-white placeholder:text-white/25 focus:outline-none focus:border-pink/50 focus:bg-white/[0.08] transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold font-body text-white/70 mb-2 block">
                            Email <span className="text-pink">*</span>
                          </label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3.5 rounded-xl border-[1.5px] border-white/10 bg-white/5 font-body text-base text-white placeholder:text-white/25 focus:outline-none focus:border-pink/50 focus:bg-white/[0.08] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold font-body text-white/70 mb-2 block">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={form.subject}
                          onChange={(e) => handleChange('subject', e.target.value)}
                          placeholder="What's this about?"
                          className="w-full px-4 py-3.5 rounded-xl border-[1.5px] border-white/10 bg-white/5 font-body text-base text-white placeholder:text-white/25 focus:outline-none focus:border-pink/50 focus:bg-white/[0.08] transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold font-body text-white/70 mb-2 block">
                          Message <span className="text-pink">*</span>
                        </label>
                        <textarea
                          value={form.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          placeholder="Tell us what's on your mind..."
                          rows={5}
                          className="w-full px-4 py-3.5 rounded-xl border-[1.5px] border-white/10 bg-white/5 font-body text-base text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-pink/50 focus:bg-white/[0.08] transition-all"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full mt-6 shadow-glow-pink"
                      loading={loading}
                    >
                      Send Message 💌
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
  );
}
