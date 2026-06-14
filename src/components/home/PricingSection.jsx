import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import PaymentModal from '../payments/PaymentModal';

const plans = [
  {
    name: 'Standard',
    emoji: '💕',
    price: 199,
    popular: false,
    features: [
      'Basic personality quiz',
      'Standard matching algorithm will match you',
      'Profile verification',
      'Community access',
    ],
    cta: 'Get Started',
    gradient: 'from-mint/20 to-mint/5',
    borderColor: 'border-mint/50',
  },
  {
    name: 'Premium',
    emoji: '💘',
    price: 399,
    popular: true,
    features: [
      'Priority matching queue',
      'Advanced quiz insights',
      'Profile boost monthly',
      'Read receipts',
      'Professional dating coach',
      'Premium support',
    ],
    cta: 'Go Premium',
    gradient: 'from-pink/15 to-lavender/15',
    borderColor: 'border-pink/50',
  },
];

export default function PricingSection() {
  const sectionRef = useRef(null);
  const { isAuthenticated, profile, refreshProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    refreshProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePlanClick(e, plan) {
    if (isAuthenticated) {
      e.preventDefault();
      setSelectedPlan({
        name: plan.name,
        price: plan.price,
        features: plan.features,
      });
      setIsPaymentOpen(true);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.08 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  function formatPrice(price) {
    if (price === 0) return 'Free';
    return `₹${price.toLocaleString('en-IN')}`;
  }

  return (
    <section id="pricing" className="py-20 lg:py-5xl scroll-mt-20" aria-label="Pricing">
      <div className="container-adore">
        {profile?.is_premium ? (
          <div className="text-center max-w-[500px] mx-auto py-12">
            <span className="text-5xl mb-4 block">👑</span>
            <h3 className="font-display text-2xl font-bold text-white mb-2 italic">You're Premium!</h3>
            <p className="text-white/50 font-body">You already have an active premium plan.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <p className="font-display text-caption font-bold tracking-[3px] uppercase text-pink mb-4 italic">
                Simple Pricing
              </p>
              <h2 className="font-display text-section-h2 font-extrabold text-white mb-4">
                Find Your <span className="text-pink">Perfect Plan</span>
              </h2>
              <p className="font-body text-body text-white/50 max-w-[500px] mx-auto mb-8">
                One-time payment. No recurring charges. Pay once and unlock your plan forever.
              </p>
            </div>
            <div
              ref={sectionRef}
              className="reveal-section stagger-children grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[780px] mx-auto"
            >
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 border-white/10 p-7 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-card-elevated ${
                  plan.popular ? 'ring-2 ring-pink/30 scale-[1.03] shadow-glow-pink' : ''
                }`}
                style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm">
                    Most Popular
                  </span>
                )}

                <div className="text-center mb-6">
                  <span className="text-3xl mb-3 block">{plan.emoji}</span>
                  <h3 className="font-display text-xl font-bold text-white mb-2 italic">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-display text-4xl font-extrabold text-white">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-sm text-white/40 font-body">
                      one-time
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm font-body text-white/70">
                      <svg className="w-4 h-4 text-pink flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={isAuthenticated ? '#' : '/signup'}
                  onClick={(e) => handlePlanClick(e, plan)}
                >
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
      {isPaymentOpen && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          plan={selectedPlan}
        />
      )}
    </section>
  );
}
