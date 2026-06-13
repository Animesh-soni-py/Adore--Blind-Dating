import PricingSection from '../components/home/PricingSection';
import Accordion from '../components/ui/Accordion';

const billingFaqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes! You can cancel anytime from your dashboard. Your premium features will remain active until the end of your current billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept UPI payments. Simply scan the QR code and pay using any UPI app like Google Pay, PhonePe, or Paytm.',
  },
  {
    question: 'Is there a free trial for Premium?',
    answer: 'New members get a 7-day free trial of Premium features when they complete their personality quiz and get their first match.',
  },
  {
    question: 'Can I switch between plans?',
    answer: 'Absolutely! You can upgrade or downgrade at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the change takes effect at the end of your current billing period.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a full refund within the first 7 days of any paid subscription if you\'re not satisfied. After 7 days, we\'ll provide a prorated credit toward future billing.',
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
