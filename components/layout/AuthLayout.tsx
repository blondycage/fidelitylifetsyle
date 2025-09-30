'use client';
import React, { useState, useEffect } from 'react';
import { FidelityLogo } from '@/components/ui/FidelityLogo';
import { ArrowLeft, ArrowRight } from 'iconsax-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const slideImages = [
  {
    url: 'https://i.ibb.co/qFxjY1sW/Images.png',
    title: 'Premium Banking',
    description: 'Experience luxury lifestyle banking with exclusive benefits'
  },
  {
    url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop&crop=center&q=80',
    title: 'Luxury Hotels',
    description: 'Access premium accommodations and world-class hospitality'
  },
  {
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop&crop=center&q=80',
    title: 'Fine Dining',
    description: 'Discover exceptional restaurants and culinary experiences'
  },
  {
    url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop&crop=center&q=80',
    title: 'Entertainment',
    description: 'Enjoy exclusive events, concerts, and premium entertainment'
  },
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&crop=center&q=80',
    title: 'Fashion & Style',
    description: 'Shop the latest trends from premium fashion brands'
  },
  {
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&h=800&fit=crop&crop=center&q=80',
    title: 'Wellness & Spa',
    description: 'Rejuvenate with luxury wellness and spa experiences'
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
    <div className="h-screen w-full flex overflow-hidden auth-container">
      <div className="w-full bg-white flex flex-col lg:flex-row h-full">
        {/* Image Section - Slider with overlay and border radius */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden h-full">
          {slideImages.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url('${slide.url}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />

              {/* Curved overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-transparent">
                {/* SVG Curve */}
                <svg
                  className="absolute bottom-0 right-0 w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,100 Q50,0 100,100 L100,100 L0,100 Z"
                    fill="rgba(255,255,255,0.1)"
                  />
                </svg>
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex items-end">
                <div className="p-8 text-white z-10">
                  <h3 className="text-4xl font-bold mb-3 font-urbanist drop-shadow-lg">
                    {slide.title}
                  </h3>
                  <p className="text-xl opacity-90 font-urbanist max-w-md drop-shadow">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {slideImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-110'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 z-20"
          >
            <ArrowLeft size={20} color="white" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slideImages.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 z-20"
          >
            <ArrowRight size={20} color="white" />
          </button>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-start relative h-full overflow-y-auto">
          {/* Mobile curved overlay */}
          <div className="lg:hidden absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-50 to-green-50 opacity-30">
            <svg
              className="absolute top-0 left-0 w-full h-full"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 Q50,20 100,0 L100,0 L0,0 Z"
                fill="rgba(59, 130, 246, 0.1)"
              />
            </svg>
          </div>

          <div className="max-w-lg w-full space-y-4 sm:space-y-6 relative z-10 auth-form p-4 sm:p-6 lg:p-8 my-4 sm:my-6">
            <div className="text-center">
              <div className="flex justify-center mx-auto mb-6">
                <FidelityLogo showText={false} size="xl" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--blueHex)] font-urbanist">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-2 text-lg text-[var(--greyHex)] font-urbanist">
                  {subtitle}
                </p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};