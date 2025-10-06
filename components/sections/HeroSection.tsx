'use client';
import Image from 'next/image';
import { 
  Building, 
  Car, 
  ShoppingBag, 
  Heart,
  Star,
  Home,
  Shield,
  Airplane,
  Headphone,
  Lock,
  Message
} from 'iconsax-react';

export default function HeroSection() {
  const categories = [
    { name: 'Accommodation', icon: Building, color: '#4994C0' },
    { name: 'Food & Dining', icon: Home, color: '#77C049' },
    { name: 'Events & Entertainment', icon: Star, color: '#C07549' },
    { name: 'Cultural & Heritage', icon: Shield, color: '#4462BC' },
    { name: 'Adventure & Outdoor Activities', icon: Airplane, color: '#7D49C0' },
    { name: 'Lifestyle & Entertainment', icon: Headphone, color: '#C049B0' },
    { name: 'Family-Friendly Activities', icon: Lock, color: '#44BCB4' },
    { name: 'Community & Philanthropy', icon: Message, color: '#14804A' },
    { name: 'Wellness & Relaxation', icon: Heart, color: '#6CC049' },
    { name: 'Shopping & Retail', icon: ShoppingBag, color: '#4994C0' },
    { name: 'Transportation', icon: Car, color: '#4462BC' },
  ];

  return (
    <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Video with image fallback */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          loop={false}
          poster="/images/hero-background.png"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[56px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col items-center gap-16">
        {/* Header and Buttons */}
        <div className="flex flex-col items-center gap-6 w-full animate-[fadeDown_700ms_ease-out_150ms_both]">
          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center leading-[1.1em] font-urbanist max-w-4xl">
            Discover extraordinary moments right where you are
          </h1>

          {/* App Store Badges (accurate from Figma) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <a href="#" className="h-10 inline-flex items-center">
              <img src="/images/footer-badge-google-play.svg" alt="Get it on Google Play" className="h-10 w-auto" />
            </a>
            <a href="#" className="h-10 inline-flex items-center">
              <img src="/images/footer-badge-app-store.svg" alt="Download on the App Store" className="h-10 w-auto" />
            </a>
          </div>
        </div>

        {/* Category Cards - Wrap centered (no scrollbar) */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full pb-2 animate-[fadeUp_700ms_ease-out_150ms_both]">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index} className="flex flex-col items-center gap-2 w-[120px]">
                {/* Category Icon Card */}
                <div className="relative w-[80px] h-[80px] rounded-full p-[3px] bg-gradient-to-r from-[#6CC049] to-[#012168]/70">
                  <div className="w-full h-full rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center">
                    <IconComponent 
                      size={32} 
                      color={category.color}
                    />
                  </div>
                </div>
                
                {/* Category Name */}
                <span className="text-[#F7F7F5] font-bold text-sm leading-[1.2em] text-center font-urbanist">
                  {category.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}