import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';

function getInitials(profile) {
  if (!profile) return '?';
  const first = profile.first_name?.[0] || '';
  const last = profile.last_name?.[0] || '';
  return (first + last).toUpperCase() || profile.email?.[0]?.toUpperCase() || '?';
}

function isLinkActive(linkHref, currentPath) {
  if (linkHref.startsWith('/#')) return false;
  return currentPath === linkHref;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signOutConfirm, setSignOutConfirm] = useState(false);
  const { isAuthenticated, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [location.pathname]);

  const activeNavLinks = isAuthenticated
    ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Matches', href: '/matches' },
        ...(profile?.is_premium ? [] : [{ label: 'Pricing', href: '/pricing' }]),
        { label: 'Blog', href: '/blog' },
        { label: 'About', href: '/about' },
      ]
    : [
        { label: 'About', href: '/about' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Stories', href: '/#testimonials' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
      ];

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollToHash = useCallback((hash) => {
    const id = hash.replace('#', '');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }, []);

  useEffect(() => {
    if (location.hash) {
      scrollToHash(location.hash);
    }
  }, [location.pathname, location.hash, scrollToHash]);

  function handleNavClick(href) {
    setMobileOpen(false);
    if (href.startsWith('/#')) {
      const hash = href.replace('/', '');
      const id = hash.replace('#', '');
      if (location.pathname === '/') {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          navigate({ pathname: '/', hash }, { replace: true });
          return;
        }
      }
      navigate({ pathname: '/', hash }, { replace: true });
    }
  }

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          (scrolled || location.pathname !== '/') ? 'nav-blur-dark' : 'bg-transparent'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-adore">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-0.5 flex-shrink-0" aria-label="ADORE Blind Dating home">
              <span className={cn(
                "font-display text-[22px] font-extrabold transition-colors text-white italic"
              )}>ADORE</span>
              <span className="font-display text-[22px] font-semibold text-pink ml-1.5 italic">Blind Dating</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-7">
              {activeNavLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    "nav-link-underline font-body text-nav font-medium transition-colors",
                    "text-white/80 hover:text-white",
                    isLinkActive(link.href, location.pathname) && "nav-active font-semibold"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Avatar */}
                  {profile && (
                    <Link to="/profile/edit">
                      <div
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-pink to-lavender flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-pink/50 transition-all"
                        title={`Edit profile - ${profile.first_name || profile.email}`}
                      >
                        {profile.profile_photo_url ? (
                          <img src={profile.profile_photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          getInitials(profile)
                        )}
                      </div>
                    </Link>
                  )}
                  <Link to="/dashboard">
                    <Button variant="primary" size="sm">Dashboard</Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="transition-colors text-white border-white/30 hover:border-white/60 hover:bg-white/10"
                    onClick={() => setSignOutConfirm(true)}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="transition-colors text-white border-white/30 hover:border-white/60 hover:bg-white/10"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm">Join Now</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <motion.span
                className={cn("block w-6 h-0.5 rounded-full origin-center transition-colors bg-white")}
                animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className={cn("block w-6 h-0.5 rounded-full transition-colors bg-white")}
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className={cn("block w-6 h-0.5 rounded-full origin-center transition-colors bg-white")}
                animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-dark/95 backdrop-blur-lg flex flex-col pt-[72px]"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex flex-col items-center justify-center flex-1 gap-6 px-8">
              {activeNavLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 + 0.1 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={cn(
                      "font-display text-2xl font-bold text-white hover:text-pink transition-colors italic",
                      isLinkActive(link.href, location.pathname) && "text-pink"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                className="flex flex-col gap-3 w-full max-w-xs mt-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="primary" size="lg" className="w-full">Dashboard</Button>
                    </Link>
                    <Button variant="ghost" size="lg" className="w-full" onClick={() => setSignOutConfirm(true)}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button variant="primary" size="lg" className="w-full">Join Now</Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="ghost" size="lg" className="w-full">Sign In</Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign Out Confirmation */}
      <AnimatePresence>
        {signOutConfirm && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSignOutConfirm(false)}
          >
            <motion.div
              className="w-full max-w-sm bg-dark border border-white/10 rounded-2xl p-6"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <span className="text-4xl block mb-3">👋</span>
                <h3 className="font-display text-lg font-bold text-white mb-1">Leave already?</h3>
                <p className="text-sm text-white/50">Are you sure you want to sign out?</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1 text-white border-white/20 hover:bg-white/10"
                  onClick={() => setSignOutConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    setSignOutConfirm(false);
                    signOut();
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
