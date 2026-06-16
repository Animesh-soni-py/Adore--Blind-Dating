import PricingSection from '../components/home/PricingSection';
import Accordion from '../components/ui/Accordion';

const billingFaqs = [
  {
    question: 'Is this a one-time payment?',
    answer: 'Yes! Pay once and unlock your plan forever. No recurring subscriptions, no hidden charges.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept UPI payments. Simply scan the QR code and pay using any UPI app like Google Pay, PhonePe, or Paytm.',
  },
  {
    question: 'How long does verification take?',
    answer: 'Once you submit your payment UTR, our team verifies it within 24 hours and activates your plan.',
  },
  {
    question: 'Can I upgrade from Standard to Premium?',
    answer: 'Yes! You can upgrade anytime by paying the difference between plans.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a full refund within the first 7 days of purchase if you\'re not satisfied.',
  },
];

export default function PricingPage() {
  return (
    <main className="pt-[72px]" id="main-content">
        <PricingSection />

        {/* Billing FAQ */}
        <section className="py-20 lg:py-5xl" style={{ background: 'linear-gradient(180deg, #0F0A1E 0%, #1A1A2E 100%)' }} aria-label="Billing FAQ">
          <div className="container-adore">
            <div className="text-center mb-14">
              <p className="font-display text-caption font-bold tracking-[3px] uppercase text-pink mb-4 italic">
                Billing Questions
              </p>
              <h2 className="font-display text-section-h2 font-extrabold text-white">
                Pricing <span className="text-pink">FAQ</span>
              </h2>
            </div>
            <div className="max-w-[700px] mx-auto">
              <Accordion items={billingFaqs} />
            </div>
          </div>
        </section>
      </main>
  );
}
