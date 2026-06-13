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
    <main id="main-content">
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
