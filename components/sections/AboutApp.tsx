'use client';
import { 
  MapPin, 
  Users, 
  Sparkles, 
  Heart,
  Car,
  Shield
} from 'lucide-react';

export default function AboutApp() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[#212121] font-urbanist mb-8">
            About the App
          </h2>
          <div className="w-24 h-1 bg-[#6CC049] mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <p className="text-xl text-[#616161] font-urbanist leading-relaxed">
                <span className="font-semibold text-[#6CC049]">Naija Connect by Fidelity Bank</span> is a smart, location-based lifestyle app designed to make every festive season in Nigeria unforgettable.
              </p>
              
              <p className="text-xl text-[#616161] font-urbanist leading-relaxed">
                Created for diaspora returnees, tourists, and local explorers, it's your one-stop companion for travel, entertainment, accommodation, and seamless financial experiences.
              </p>
              
              <p className="text-xl text-[#616161] font-urbanist leading-relaxed">
                Powered by AI and built with community at its core, Naija Connect helps you discover, plan, and enjoy local adventures ranging from hidden food spots and nightlife to premium lounges and cultural events.
              </p>
              
              <p className="text-xl text-[#616161] font-urbanist leading-relaxed">
                Whether you're home for Christmas, Sallah, or vacation, Naija Connect makes exploring Nigeria feel like one big, organized and effortlessly beautiful experience waiting for you to enjoy.
              </p>
            </div>
          </div>

          {/* Right: Feature Cards with Images */}
          <div className="grid grid-cols-2 gap-6">
            <div className="relative h-48 rounded-2xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center" 
                alt="Location-based discovery"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-white" />
                  <h3 className="text-xl font-semibold font-urbanist">Location-Based</h3>
                </div>
                <p className="text-base text-white/90 font-urbanist">Smart discovery based on your location</p>
              </div>
            </div>

            <div className="relative h-48 rounded-2xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&crop=center" 
                alt="Community-driven platform"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-white" />
                  <h3 className="text-xl font-semibold font-urbanist">Community-Driven</h3>
                </div>
                <p className="text-base text-white/90 font-urbanist">Built with community at its core</p>
              </div>
            </div>

            <div className="relative h-48 rounded-2xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop&crop=center" 
                alt="AI-powered technology"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <h3 className="text-xl font-semibold font-urbanist">AI-Powered</h3>
                </div>
                <p className="text-base text-white/90 font-urbanist">Intelligent recommendations and planning</p>
              </div>
            </div>

            <div className="relative h-48 rounded-2xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&crop=center" 
                alt="Festive celebrations"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-white" />
                  <h3 className="text-xl font-semibold font-urbanist">Festive Focus</h3>
                </div>
                <p className="text-base text-white/90 font-urbanist">Designed for every festive season</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}