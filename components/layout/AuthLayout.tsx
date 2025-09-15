'use client';
import React, { useState, useEffect } from 'react';
import { FidelityLogo } from '@/components/ui/FidelityLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const slideImages = [
  {
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop&crop=center&q=80',
    title: 'Exquisite Dining',
    description: 'Discover world-class restaurants and culinary masterpieces'
  },
  {
    url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop&crop=center&q=80',
    title: 'Luxury Hotels',
    description: 'Experience premium accommodations and hospitality'
  },
  {
    url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop&crop=center&q=80',
    title: 'Live Entertainment',
    description: 'Enjoy concerts, shows and vibrant nightlife'
  },
  {
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop&crop=center&q=80',
    title: 'Exclusive Events',
    description: 'Access premium events and lifestyle experiences'
  },
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&crop=center&q=80',
    title: 'Fashion & Style',
    description: 'Discover the latest trends and designer collections'
  },
  {
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&h=800&fit=crop&crop=center&q=80',
    title: 'Wellness & Spa',
    description: 'Rejuvenate with premium wellness experiences'
  }
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Form Section - Full width on mobile, 40% on desktop */}
      <div className="w-full lg:w-2/5 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F8FAFB] via-[#E6F7FF] to-[#E8FFF1] relative z-10">
        <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="mx-auto mb-6">
              <FidelityLogo showText={false} size="xl" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--blueHex)] font-[var(--fontPlayfair)]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-[var(--greyHex)] font-[var(--fontOpen)]">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>

      {/* Slideshow Section - 60% on desktop, hidden on mobile */}
      <div className="hidden lg:block w-3/5 relative bg-gradient-to-br from-[var(--blueHex)] to-[var(--greenHex)] overflow-hidden">
        {slideImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background image */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(1, 33, 104, 0.3), rgba(108, 192, 73, 0.3)), url(${slide.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />

            {/* Backup img element */}
            <img
              src={slide.url}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="p-8 text-white z-10">
                <h3 className="text-4xl font-bold mb-4 font-[var(--fontPlayfair)] text-shadow-lg">
                  {slide.title}
                </h3>
                <p className="text-xl opacity-90 font-[var(--fontOpen)] max-w-md text-shadow">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slideImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>

        {/* Fidelity Bank Logo/Branding */}
        <div className="absolute top-8 left-8">
          <div className="text-white">
           
            <p className="text-xl opacity-80 font-[var(--fontOpen)] ml-1">Lifestyle Banking</p>
          </div>
        </div>
      </div>
    </div>
  );
};