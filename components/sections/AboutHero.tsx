'use client';
import Image from 'next/image';

export default function AboutHero() {
  return (
    <section className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image with gradient overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&crop=center"
          alt="People connecting and networking"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#6CC049]/90 via-[#5AA03A]/80 to-[#4A8A2F]/90"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white font-urbanist leading-tight">
            About Naija Connect
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 font-urbanist max-w-4xl mx-auto leading-relaxed">
            Where Experience Meets Convenience
          </p>
          <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
    </section>
  );
}