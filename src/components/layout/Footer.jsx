import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';

const productLinks = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
];


const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Cookie Policy', href: '#' },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/adore_blind_dating_jbp/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleNewsletter(e) {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setSubmitting(true);
      await supabase.from('leads').insert({
        email: email.trim(),
        source: 'homepage',
      });
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Newsletter signup error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <hr className="section-divider" />
      <footer className="bg-dark py-8 lg:py-16" role="contentinfo">
      <div className="container-adore">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 lg:gap-8">
          {/* Col 1: Logo + Tagline + Social (full width on mobile) */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="font-display text-lg lg:text-xl font-extrabold text-white">ADORE</span>
              <span className="font-display text-lg lg:text-xl font-semibold text-pink">Blind Dating</span>
            </div>
            <p className="text-xs lg:text-sm text-white/40 leading-relaxed mb-4 max-w-[280px]">
              Fall in love with their soul first. The premium blind dating platform where personality comes before photos.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/35 hover:text-pink transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h3 className="font-display text-[10px] lg:text-xs font-bold tracking-[2px] uppercase text-white/50 mb-4 lg:mb-5">
              Product
            </h3>
            <ul className="space-y-2 lg:space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-xs lg:text-sm text-white/40 hover:text-white transition-colors duration-200 min-h-[30px] sm:min-h-[36px] flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h3 className="font-display text-[10px] lg:text-xs font-bold tracking-[2px] uppercase text-white/50 mb-4 lg:mb-5">
              Company
            </h3>
            <ul className="space-y-2 lg:space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-xs lg:text-sm text-white/40 hover:text-white transition-colors duration-200 min-h-[30px] sm:min-h-[36px] flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-display text-[10px] lg:text-xs font-bold tracking-[2px] uppercase text-white/50 mb-4 lg:mb-5">
              Stay in the Loop
            </h3>
            <p className="text-xs lg:text-sm text-white/35 mb-3 lg:mb-4">
              Get dating tips, success stories, and early access to new features.
            </p>
            {submitted ? (
              <p className="text-xs lg:text-sm text-lime font-medium">Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 min-h-[44px] px-4 py-2.5 bg-white/10 border border-white/10 rounded-lg text-xs lg:text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-pink transition-colors"
                  aria-label="Email for newsletter"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={submitting}
                  className="flex-shrink-0 min-h-[44px]"
                >
                  Join
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 lg:mt-16 pt-4 lg:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 lg:gap-4">
          <p className="text-[10px] lg:text-xs text-white/25">
            © {new Date().getFullYear()} ADORE Blind Dating. All rights reserved.
          </p>
          <div className="flex items-center gap-4 lg:gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-[10px] lg:text-xs text-white/25 hover:text-white/50 transition-colors min-h-[28px] sm:min-h-[36px] flex items-center"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
