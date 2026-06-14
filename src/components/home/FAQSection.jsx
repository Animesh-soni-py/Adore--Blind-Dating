import { useRef, useEffect } from 'react';
import Accordion from '../ui/Accordion';

const faqs = [
  {
    question: 'How does ADORE blind dating work?',
    answer: 'ADORE matches you based on your personality quiz results, not photos. Our AI-powered algorithm finds the most compatible people based on your values, interests, and lifestyle preferences.',
  },
  {
    question: 'Do I have to pay for ADORE?',
    answer: 'Creating a profile and getting matched is available on affordable plans starting at just ₹199/month. Premium features including unlimited matches and priority matching are available on our ₹299/month plan.',
  },
  {
    question: 'What if I don\'t feel a connection?',
    answer: 'That\'s okay! You\'ll be matched with new people each week based on your compatibility scores. When you find the right connection, you can take the next step together.',
  },
  {
    question: 'Is there a verification process?',
    answer: 'Yes. Every member goes through identity verification to ensure authenticity. This eliminates fake profiles and creates a safe, trustworthy community for everyone.',
  },
  {
    question: 'How are matches calculated?',
    answer: 'Our AI analyzes your personality quiz responses, interests, values, and lifestyle preferences to find people who genuinely align with you. Each match shows a compatibility score to help you decide.',
  },
  {
    question: 'Can I update my quiz answers?',
    answer: 'Absolutely! You can retake the personality quiz anytime from your profile settings. Your matches will be recalculated based on your updated answers.',
  },
  {
    question: 'Is ADORE available in my city?',
    answer: 'We\'re currently active exclusively in Jabalpur. We plan to expand to other cities soon, but for now, we are focused on creating the best blind dating experience right here in Jabalpur.',
  },
  {
    question: 'How is my data protected?',
    answer: 'Your privacy is our priority. All data is encrypted, and your photos are only visible to matches you\'ve mutually agreed to reveal with. We never share your data with third parties.',
  },
];

export default function FAQSection() {
  const sectionRef = useRef(null);

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

  return (
    <section id="faq" className="py-20 lg:py-5xl" style={{ background: 'linear-gradient(180deg, #0F0A1E 0%, #1A1A2E 100%)' }} aria-label="Frequently asked questions">
      <div className="container-adore">
        <div className="text-center mb-14">
          <p className="font-display text-caption font-bold tracking-[3px] uppercase text-pink mb-4 italic">
            Got Questions?
          </p>
          <h2 className="font-display text-section-h2 font-extrabold text-white">
            Frequently Asked <span className="text-pink">Questions</span>
          </h2>
        </div>

        <div
          ref={sectionRef}
          className="reveal-section max-w-[700px] mx-auto"
        >
          <Accordion items={faqs} />
        </div>
      </div>
    </section>
  );
}
