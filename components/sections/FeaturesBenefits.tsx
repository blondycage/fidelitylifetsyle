'use client';
import { 
  Building, 
  Star, 
  ShoppingBag, 
  Car,
  Heart,
  Home,
  Shield,
  Message,
  Lock,
  Plane
} from 'lucide-react';

export default function FeaturesBenefits() {
  const exploreFeatures = [
    {
      icon: Building,
      title: "Accommodation Booking",
      description: "Find and book hotels, serviced apartments, or homestays that match your budget and vibe across the country.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=500&fit=crop&crop=center"
    },
    {
      icon: Star,
      title: "Event Access",
      description: "Discover and buy tickets for concerts, festivals, and local events all in one place.",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=500&fit=crop&crop=center"
    },
    {
      icon: ShoppingBag,
      title: "Food & Dining",
      description: "Order meals from your favorite restaurants with seamless delivery options.",
      image: "placeholder-product.png"
    },
    {
      icon: Car,
      title: "Car Rentals",
      description: "Access verified, convenient car hire options wherever you are in Nigeria.",
      image: "https://www.pivotmotors.com/wp-content/uploads/2019/05/Lexus-LX570-Bnr.jpg"
    }
  ];

  const liveBetterFeatures = [
    {
      icon: Star,
      title: "Exclusive Discounts",
      description: "Get exclusive deals on hotels, event tickets, and experiences.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=500&fit=crop&crop=center"
    },
    {
      icon: Heart,
      title: "Premium Lounge Access",
      description: "Enjoy VIP treatment with app-based QR lounge entry (subscription-based).",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=500&fit=crop&crop=center"
    },
    {
      icon: Star,
      title: "Personalized Recommendations",
      description: "Relish AI-powered suggestions based on your preferences and previous experiences.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=500&fit=crop&crop=center"
    },
    {
      icon: Home,
      title: "Community & Culture",
      description: "Connect with other travelers, share experiences, and explore Nigeria through local eyes.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop&crop=center"
    }
  ];

  const bankFeatures = [
    {
      icon: Shield,
      title: "Financial Integration",
      description: "Open a Fidelity account, make payments, and manage savings directly within the app — safe, secure, and instant.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&crop=center"
    }
  ];

  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[#212121] font-urbanist mb-8">
            Features & Benefits
          </h2>
          <div className="w-24 h-1 bg-[#6CC049] mx-auto rounded-full"></div>
        </div>

        {/* Explore Seamlessly */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-[#212121] font-urbanist mb-6">Explore Seamlessly</h3>
            <p className="text-lg text-[#616161] font-urbanist max-w-2xl mx-auto">
              Everything you need to discover and experience Nigeria in one place
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {exploreFeatures.map((feature, index) => (
              <div key={index} className="relative h-80 rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300">
                <img 
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <feature.icon className="w-6 h-6 text-white" />
                    <h4 className="text-xl font-semibold font-urbanist">{feature.title}</h4>
                  </div>
                  <p className="text-white/90 font-urbanist leading-relaxed text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Better */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-[#212121] font-urbanist mb-6">Live Better</h3>
            <p className="text-lg text-[#616161] font-urbanist max-w-2xl mx-auto">
              Premium experiences and personalized services for the discerning traveler
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {liveBetterFeatures.map((feature, index) => (
              <div key={index} className="relative h-80 rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300">
                <img 
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <feature.icon className="w-6 h-6 text-white" />
                    <h4 className="text-xl font-semibold font-urbanist">{feature.title}</h4>
                  </div>
                  <p className="text-white/90 font-urbanist leading-relaxed text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bank as You Go */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-[#212121] font-urbanist mb-6">Bank as You Go</h3>
            <p className="text-lg text-[#616161] font-urbanist max-w-2xl mx-auto">
              Seamless financial integration powered by Fidelity Bank
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {bankFeatures.map((feature, index) => (
              <div key={index} className="relative h-64 rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300">
                <img 
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6CC049]/90 to-[#5AA03A]/90"></div>
                <div className="absolute inset-0 flex items-center p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-semibold font-urbanist mb-4 text-white">{feature.title}</h4>
                      <p className="text-white/90 font-urbanist leading-relaxed text-lg">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}