
import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ServicesSection from '@/components/sections/ServicesSection';
import VendorSection from '@/components/sections/VendorSection';
import FAQSection from '@/components/sections/FAQSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ServicesSection />
        <VendorSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
