import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import PricingSection from '../components/home/PricingSection';
import BlogSection from '../components/home/BlogSection';
import CTASection from '../components/home/CTASection';
import FAQSection from '../components/home/FAQSection';

export default function HomePage() {
  return (
    <main id="main-content" className="relative">
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, #0F0A1E 0%, #1A1A2E 18%, #2D1B69 38%, #1A1A2E 58%, #2D1B69 75%, #1A1A2E 90%, #0F0A1E 100%)',
          backgroundSize: '100% 200%',
          animation: 'gradient-scroll 20s ease-in-out infinite alternate',
        }}
        aria-hidden="true"
      />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <BlogSection />
      <CTASection />
      <FAQSection />
    </main>
  );
}
