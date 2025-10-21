'use client';
import { 
  CheckCircle,
  Eye,
  Heart,
  Home,
  Star,
  User
} from 'lucide-react';

export default function VisionMission() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[#212121] font-urbanist mb-8">
            Our Vision & Mission
          </h2>
          <div className="w-24 h-1 bg-[#6CC049] mx-auto rounded-full"></div>
        </div>

        {/* Quote Section */}
        <div className="text-center mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="text-6xl text-[#6CC049]/20 font-serif mb-4">"</div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#212121] font-urbanist mb-8 leading-tight">
                Where Experience Meets Convenience
              </h3>
              <div className="text-6xl text-[#6CC049]/20 font-serif absolute -bottom-4 right-0">"</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Vision */}
          <div className="space-y-8">
            <div className="relative h-64 rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center"
                alt="Our Vision"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#6CC049] rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white " strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-urbanist">Our Vision</h3>
                </div>
                <p className="text-white/90 font-urbanist leading-relaxed">
                  The Naija Connect App is Fidelity Bank's bold step into experiential tourism and lifestyle banking. It bridges the gap between travel, culture, and finance, offering users a smarter, more connected way to experience Nigeria's festive seasons.
                </p>
              </div>
            </div>

            <div className="relative h-64 rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center"
                alt="Our Mission"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#6CC049] rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-urbanist">Our Mission</h3>
                </div>
                <p className="text-white/90 font-urbanist leading-relaxed">
                  With location intelligence, curated partnerships, and seamless payments, Fidelity Bank positions itself as the preferred lifestyle and financial partner for tourists and Nigerians in the diaspora — not just in December, but all year round.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Key Points */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#212121] font-urbanist">Why Naija Connect?</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-32 rounded-xl overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop&crop=center"
                    alt="Location Intelligence"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-sm font-semibold text-white font-urbanist mb-1">Location Intelligence</h4>
                    <p className="text-xs text-white/90 font-urbanist">Smart discovery based on your location</p>
                  </div>
                </div>

                <div className="relative h-32 rounded-xl overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&crop=center"
                    alt="Curated Partnerships"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-sm font-semibold text-white font-urbanist mb-1">Curated Partnerships</h4>
                    <p className="text-xs text-white/90 font-urbanist">Handpicked venues and experiences</p>
                  </div>
                </div>

                <div className="relative h-32 rounded-xl overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=200&fit=crop&crop=center"
                    alt="Community Focus"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-sm font-semibold text-white font-urbanist mb-1">Community Focus</h4>
                    <p className="text-xs text-white/90 font-urbanist">Built for travelers and locals</p>
                  </div>
                </div>

                <div className="relative h-32 rounded-xl overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop&crop=center"
                    alt="Year-Round Experience"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-sm font-semibold text-white font-urbanist mb-1">Year-Round Experience</h4>
                    <p className="text-xs text-white/90 font-urbanist">For every season and celebration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-[#6CC049] to-[#5AA03A] p-12 rounded-2xl text-white">
            <h3 className="text-3xl font-bold font-urbanist mb-4">
              Ready to Experience Nigeria Like Never Before?
            </h3>
            <p className="text-xl text-white/90 font-urbanist mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already discovering, planning, and enjoying local adventures with Naija Connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#6CC049] px-8 py-4 rounded-xl font-semibold font-urbanist hover:bg-white/90 transition-colors">
                Download Now
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold font-urbanist hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}