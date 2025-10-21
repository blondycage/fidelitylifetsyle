import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/sections/AboutHero';
import AboutApp from '@/components/sections/AboutApp';
import FeaturesBenefits from '@/components/sections/FeaturesBenefits';
import VisionMission from '@/components/sections/VisionMission';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <AboutHero />
        <AboutApp />
        <FeaturesBenefits />
        <VisionMission />
      </main>
      <Footer />
    </div>
  );
}