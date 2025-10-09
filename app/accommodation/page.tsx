'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const AccommodationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Houses']);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['Lekki']);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 120 });
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: number]: number}>({});

  // Real accommodation data with proper mock details
  const accommodations = [
    {
      id: 1,
      name: 'Radisson Blue Anchorage Hotels',
      location: 'Victoria Island, Lagos',
      price: 250000,
      images: ['/images/accommodation-card-1.png'],
      rating: 4.8,
      reviews: 124,
      amenities: ['WiFi', 'Pool', 'Gym', 'Kitchen'],
      roomsLeft: 4
    },
    {
      id: 2,
      name: 'Luxury Villa Resort',
      location: 'Lekki Phase 1, Lagos',
      price: 180000,
      images: ['/images/accommodation-card-2.png'],
      rating: 4.6,
      reviews: 89,
      amenities: ['WiFi', 'Air Conditioning', 'Laundry'],
      roomsLeft: 2
    },
    {
      id: 3,
      name: 'Beachfront Paradise',
      location: 'Tarkwa Bay, Lagos',
      price: 320000,
      images: ['/images/accommodation-card-3.png'],
      rating: 4.9,
      reviews: 156,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
      roomsLeft: 1
    },
    {
      id: 4,
      name: 'Modern City Apartments',
      location: 'Ikoyi, Lagos',
      price: 150000,
      images: ['/images/accommodation-card-1.png'],
      rating: 4.4,
      reviews: 67,
      amenities: ['WiFi', 'Kitchen', 'Laundry'],
      roomsLeft: 8
    },
    {
      id: 5,
      name: 'Executive Business Suites',
      location: 'Banana Island, Lagos',
      price: 450000,
      images: ['/images/accommodation-card-2.png'],
      rating: 4.9,
      reviews: 203,
      amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant'],
      roomsLeft: 3
    },
    {
      id: 6,
      name: 'Family Comfort Homes',
      location: 'Surulere, Lagos',
      price: 120000,
      images: ['/images/accommodation-card-3.png'],
      rating: 4.2,
      reviews: 45,
      amenities: ['WiFi', 'Kitchen', 'Air Conditioning'],
      roomsLeft: 12
    },
    {
      id: 7,
      name: 'Penthouse Luxury',
      location: 'Victoria Island, Lagos',
      price: 600000,
      images: ['/images/accommodation-card-1.png'],
      rating: 5.0,
      reviews: 78,
      amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Laundry'],
      roomsLeft: 1
    },
    {
      id: 8,
      name: 'Boutique Hotel Experience',
      location: 'Yaba, Lagos',
      price: 95000,
      images: ['/images/accommodation-card-2.png'],
      rating: 4.1,
      reviews: 34,
      amenities: ['WiFi', 'Restaurant', 'Laundry'],
      roomsLeft: 15
    },
    {
      id: 9,
      name: 'Cozy Studio Retreat',
      location: 'Ikeja, Lagos',
      price: 85000,
      images: ['/images/accommodation-card-3.png'],
      rating: 4.3,
      reviews: 56,
      amenities: ['WiFi', 'Kitchen'],
      roomsLeft: 6
    },
    {
      id: 10,
      name: 'Garden View Resort',
      location: 'Lekki, Lagos',
      price: 200000,
      images: ['/images/accommodation-card-1.png'],
      rating: 4.7,
      reviews: 98,
      amenities: ['WiFi', 'Pool', 'Garden', 'Restaurant'],
      roomsLeft: 5
    },
    {
      id: 11,
      name: 'Urban Business Center',
      location: 'Victoria Island, Lagos',
      price: 300000,
      images: ['/images/accommodation-card-2.png'],
      rating: 4.5,
      reviews: 112,
      amenities: ['WiFi', 'Gym', 'Conference Room', 'Restaurant'],
      roomsLeft: 7
    },
    {
      id: 12,
      name: 'Seaside Luxury Suites',
      location: 'Tarkwa Bay, Lagos',
      price: 400000,
      images: ['/images/accommodation-card-3.png'],
      rating: 4.8,
      reviews: 134,
      amenities: ['WiFi', 'Pool', 'Spa', 'Beach Access'],
      roomsLeft: 2
    },
    {
      id: 13,
      name: 'Downtown Executive',
      location: 'Ikoyi, Lagos',
      price: 280000,
      images: ['/images/accommodation-card-1.png'],
      rating: 4.6,
      reviews: 87,
      amenities: ['WiFi', 'Gym', 'Restaurant', 'Laundry'],
      roomsLeft: 4
    },
    {
      id: 14,
      name: 'Hillside Villa Resort',
      location: 'Lekki, Lagos',
      price: 350000,
      images: ['/images/accommodation-card-2.png'],
      rating: 4.9,
      reviews: 167,
      amenities: ['WiFi', 'Pool', 'Spa', 'Garden', 'Restaurant'],
      roomsLeft: 3
    },
    {
      id: 15,
      name: 'Metropolitan Plaza',
      location: 'Victoria Island, Lagos',
      price: 220000,
      images: ['/images/accommodation-card-3.png'],
      rating: 4.4,
      reviews: 73,
      amenities: ['WiFi', 'Gym', 'Restaurant', 'Air Conditioning'],
      roomsLeft: 9
    }
  ];

  const categories = [
    { name: 'Houses', count: 20 },
    { name: 'Hotels', count: 20 },
    { name: 'Condos', count: 20 },
    { name: 'Airbnbs', count: 20 },
    { name: 'Apartments', count: 20 }
  ];

  const locations = [
    { name: 'Lekki', count: 20 },
    { name: 'Victoria Island', count: 20 },
    { name: 'Odubudu Ranch', count: 20 },
    { name: 'Wavering Towers', count: 20 },
    { name: 'Olumo Rock', count: 20 }
  ];

  const amenities = [
    { name: 'WiFi', icon: '/images/icon-wifi.svg' },
    { name: 'Gym', icon: '/images/icon-gym.svg' },
    { name: 'Pool', icon: '/images/icon-pool.svg' },
    { name: 'Kitchen', icon: '/images/icon-kitchen.svg' },
    { name: 'Spa', icon: '/images/icon-spa.svg' },
    { name: 'Restaurant', icon: '/images/icon-restaurant.svg' },
    { name: 'Air conditioning', icon: '/images/icon-air-conditioning.svg' },
    { name: 'Laundry', icon: '/images/icon-laundry.svg' }
  ];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationToggle = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const nextImage = (accommodationId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [accommodationId]: ((prev[accommodationId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (accommodationId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [accommodationId]: ((prev[accommodationId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-cover bg-center" 
               style={{ 
                 backgroundImage: "url('/images/accommodation-hero-bg-clean.png')",
                 backgroundSize: 'cover',
                 backgroundRepeat: 'no-repeat'
               }}>
        {/* Gradient overlay exactly as in Figma */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/24 via-black/40 to-black/60"></div>
        
        <div className="relative z-10 px-[60px] py-[60px]">
          <div className="max-w-[487px] space-y-[36px]">
            {/* Text Section */}
            <div className="space-y-[12px]">
              <h1 className="text-[40px] font-semibold text-white font-urbanist leading-[1.1]">
                Discover your perfect stay
              </h1>
              <p className="text-white text-base leading-[1.25] font-urbanist">
                From luxury hotels to cozy apartments — browse curated properties designed for every kind of trip.
              </p>
            </div>
            
            {/* Filter Bar - Exact Figma specifications */}
            <div className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] flex items-center justify-between w-[487px] h-[80px] px-[8px] pr-[24px]">
              <div className="flex items-center gap-[24px]">
                <div className="flex items-center gap-[8px] px-[16px] py-[16px]">
                  <Image src="/images/icon-location.svg" alt="Location" width={24} height={24} />
                  <span className="text-[#9E9E9E] text-base font-urbanist">Location</span>
                </div>
                <div className="w-0 h-[36px] bg-[#E2F2DB]"></div>
              </div>
              <div className="flex items-center justify-center w-[52px] h-[52px] bg-[#6CC049] rounded-full">
                <Image src="/images/icon-search.svg" alt="Search" width={32} height={32} />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="px-[60px] py-[60px]">
        <div className="flex gap-6 max-w-[1440px] mx-auto">
          {/* Filter Sidebar */}
          <div className="w-[312px] bg-white rounded-lg shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)] p-2">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2">
              <h3 className="text-[20px] font-bold text-[#212121] font-urbanist">Filter by:</h3>
              <button className="px-8 py-2 border-2 border-[#012168] rounded-full text-[#012168] text-base font-semibold font-urbanist">
                Reset
              </button>
            </div>

            <div className="w-full h-px bg-[#E0E0E0] my-2"></div>

            {/* Search Property Name */}
            <div className="px-4 py-4">
              <h4 className="text-[14px] font-bold text-[#212121] font-urbanist mb-3">Search property name</h4>
              <div className="relative">
                <div className="flex items-center gap-1 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-lg px-2 py-2 w-full h-10">
                  <Image src="/images/icon-search.svg" alt="Search" width={20} height={20} />
                  <input
                    type="text"
                    placeholder="e.g Continental hotel"
                    className="flex-1 bg-transparent text-[#9E9E9E] text-base font-urbanist outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-[#E0E0E0] my-2"></div>

            {/* Categories */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[14px] font-bold text-[#212121] font-urbanist">Categories</h4>
                <Image src="/images/icon-arrow-down.svg" alt="Arrow Down" width={16} height={16} />
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-2 hover:bg-[#F5F5F5] rounded-lg">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCategoryToggle(category.name)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selectedCategories.includes(category.name)
                            ? 'bg-[#6CC049] border-[#6CC049]'
                            : 'border-[#BDBDBD]'
                        }`}
                      >
                        {selectedCategories.includes(category.name) && (
                          <div className="w-2 h-2 bg-white rounded-sm"></div>
                        )}
                      </button>
                      <span className={`text-[12px] font-semibold font-urbanist ${
                        selectedCategories.includes(category.name) ? 'text-[#212121]' : 'text-[#757575]'
                      }`}>
                        {category.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#757575] font-urbanist">{category.count}</span>
                  </div>
                ))}
              </div>
              <button className="text-[#012168] text-[12px] font-semibold font-urbanist mt-2 flex items-center gap-1">
                See more <Image src="/images/icon-arrow-down.svg" alt="Arrow Down" width={16} height={16} />
              </button>
            </div>

            <div className="w-full h-px bg-[#E0E0E0] my-2"></div>

            {/* Price Range */}
            <div className="px-4 py-4">
              <h4 className="text-[14px] font-bold text-[#212121] font-urbanist mb-4">Price</h4>
              <div className="space-y-4">
                <div className="relative px-3">
                  <div className="h-4 bg-[#CCD3E1] rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 bg-[#012168] rounded-full transform -translate-y-1"></div>
                    <div className="absolute top-0 left-0 w-[135px] h-4 bg-[#012168] rounded-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 bg-[#012168] rounded-full transform -translate-y-1"></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-[#9E9E9E] text-base font-urbanist">From:</span>
                    <div className="w-20 h-10 border border-[#F5F5F5] rounded-[10px] flex items-center justify-center">
                      <span className="text-[#212121] text-base font-semibold font-urbanist">$0</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[#9E9E9E] text-base font-urbanist">To:</span>
                    <div className="w-20 h-10 border border-[#F5F5F5] rounded-[10px] flex items-center justify-center">
                      <span className="text-[#212121] text-base font-semibold font-urbanist">$120</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-[#E0E0E0] my-2"></div>

            {/* Popular Locations */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[14px] font-bold text-[#212121] font-urbanist">Popular Locations</h4>
                <Image src="/images/icon-arrow-down.svg" alt="Arrow Down" width={16} height={16} />
              </div>
              <div className="space-y-2">
                {locations.map((location) => (
                  <div key={location.name} className="flex items-center justify-between p-2 hover:bg-[#F5F5F5] rounded-lg">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLocationToggle(location.name)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selectedLocations.includes(location.name)
                            ? 'bg-[#6CC049] border-[#6CC049]'
                            : 'border-[#BDBDBD]'
                        }`}
                      >
                        {selectedLocations.includes(location.name) && (
                          <div className="w-2 h-2 bg-white rounded-sm"></div>
                        )}
                      </button>
                      <span className={`text-[12px] font-semibold font-urbanist ${
                        selectedLocations.includes(location.name) ? 'text-[#212121]' : 'text-[#757575]'
                      }`}>
                        {location.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#757575] font-urbanist">{location.count}</span>
                  </div>
                ))}
              </div>
              <button className="text-[#012168] text-[12px] font-semibold font-urbanist mt-2 flex items-center gap-1">
                See more <Image src="/images/icon-arrow-down.svg" alt="Arrow Down" width={16} height={16} />
              </button>
            </div>

            <div className="w-full h-px bg-[#E0E0E0] my-2"></div>

            {/* Amenities */}
            <div className="px-4 py-4">
              <h4 className="text-[14px] font-bold text-[#212121] font-urbanist mb-4">Amenities</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {amenities.slice(0, 4).map((amenity) => (
                    <button
                      key={amenity.name}
                      onClick={() => handleAmenityToggle(amenity.name)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-[10px] border h-[84px] ${
                        selectedAmenities.includes(amenity.name)
                          ? 'bg-[#6CC049] border-[#6CC049] text-white'
                          : 'bg-white border-[#F5F5F5] text-[#012168]'
                      }`}
                    >
                      <Image 
                        src={amenity.icon} 
                        alt={amenity.name} 
                        width={24} 
                        height={24}
                        className={selectedAmenities.includes(amenity.name) ? 'invert' : ''}
                      />
                      <span className="text-[12px] font-semibold font-urbanist text-center">
                        {amenity.name}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {amenities.slice(4, 8).map((amenity) => (
                    <button
                      key={amenity.name}
                      onClick={() => handleAmenityToggle(amenity.name)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-[10px] border h-[84px] ${
                        selectedAmenities.includes(amenity.name)
                          ? 'bg-[#6CC049] border-[#6CC049] text-white'
                          : 'bg-white border-[#F5F5F5] text-[#012168]'
                      }`}
                    >
                      <Image 
                        src={amenity.icon} 
                        alt={amenity.name} 
                        width={24} 
                        height={24}
                        className={selectedAmenities.includes(amenity.name) ? 'invert' : ''}
                      />
                      <span className="text-[12px] font-semibold font-urbanist text-center">
                        {amenity.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Accommodation Cards Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-6" style={{ width: '984px' }}>
              {accommodations.map((accommodation) => {
                return (
                  <Link 
                    key={accommodation.id} 
                    href={`/vendor/${accommodation.id}`}
                    className="bg-white rounded-[17.89px] shadow-[0px_0.75px_2.98px_0px_rgba(12,12,13,0.05),0px_0.75px_2.98px_0px_rgba(12,12,13,0.1)] overflow-hidden hover:scale-105 transition-transform duration-200"
                    style={{ width: '312px', height: '323.32px' }}
                  >
                    <div className="relative w-full h-[214px]">
                      <Image 
                        src={accommodation.images[0]} 
                        alt={accommodation.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="p-[17.89px] space-y-[8.95px]">
                      <div className="space-y-[2.98px]">
                        <h3 className="text-[#212121] text-[14.91px] font-bold font-urbanist leading-[1.2]">
                          {accommodation.name}
                        </h3>
                        <p className="text-[#616161] text-[10.44px] font-urbanist leading-[1.2]">
                          {accommodation.location}
                        </p>
                      </div>
                      
                      <button className="w-full bg-[#6CC049] text-white text-[11.93px] font-semibold font-urbanist py-[5.96px] px-[23.85px] rounded-[44.73px] hover:bg-[#5AA03A] transition-colors duration-200 flex items-center justify-center gap-[2.98px]">
                        Discover More
                        <Image src="/images/icon-arrow-right.svg" alt="Arrow Right" width={17.89} height={17.89} />
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AccommodationPage;