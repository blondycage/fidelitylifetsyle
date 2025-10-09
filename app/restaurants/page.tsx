'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const RestaurantsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Mock restaurant data with correct image references
  const restaurants = [
    {
      id: 1,
      name: 'Nkoyo Restaurant',
      category: 'Fine Dining',
      location: 'Victoria Island, Lagos',
      image: '/images/restaurant-card-1-3f0b44.png',
      rating: 4.8,
      reviews: 124,
      priceRange: '₦₦₦₦',
      cuisine: 'Nigerian',
      deliveryTime: '25-35 min'
    },
    {
      id: 2,
      name: 'Shiro Restaurant',
      category: 'Asian Fusion',
      location: 'Lekki Phase 1, Lagos',
      image: '/images/restaurant-card-2-3f0b44.png',
      rating: 4.6,
      reviews: 89,
      priceRange: '₦₦₦',
      cuisine: 'Japanese',
      deliveryTime: '20-30 min'
    },
    {
      id: 3,
      name: 'Bottles Restaurant',
      category: 'Casual Dining',
      location: 'Ikoyi, Lagos',
      image: '/images/restaurant-card-3-3f0b44.png',
      rating: 4.7,
      reviews: 156,
      priceRange: '₦₦₦',
      cuisine: 'International',
      deliveryTime: '30-40 min'
    },
    {
      id: 4,
      name: 'Yellow Chilli',
      category: 'Fine Dining',
      location: 'Victoria Island, Lagos',
      image: '/images/restaurant-card-4-3f0b44.png',
      rating: 4.9,
      reviews: 203,
      priceRange: '₦₦₦₦',
      cuisine: 'Indian',
      deliveryTime: '25-35 min'
    },
    {
      id: 5,
      name: 'Sky Restaurant',
      category: 'Fine Dining',
      location: 'Lekki Phase 1, Lagos',
      image: '/images/restaurant-card-5-3f0b44.png',
      rating: 4.5,
      reviews: 78,
      priceRange: '₦₦₦₦',
      cuisine: 'Continental',
      deliveryTime: '35-45 min'
    },
    {
      id: 6,
      name: 'Bottles Restaurant',
      category: 'Casual Dining',
      location: 'Ikoyi, Lagos',
      image: '/images/restaurant-card-6-3f0b44.png',
      rating: 4.4,
      reviews: 92,
      priceRange: '₦₦₦',
      cuisine: 'Mediterranean',
      deliveryTime: '20-30 min'
    },
    {
      id: 7,
      name: 'Nkoyo Restaurant',
      category: 'Fine Dining',
      location: 'Victoria Island, Lagos',
      image: '/images/restaurant-card-7-3f0b44.png',
      rating: 4.8,
      reviews: 124,
      priceRange: '₦₦₦₦',
      cuisine: 'Nigerian',
      deliveryTime: '25-35 min'
    },
    {
      id: 8,
      name: 'Shiro Restaurant',
      category: 'Asian Fusion',
      location: 'Lekki Phase 1, Lagos',
      image: '/images/restaurant-card-8-3f0b44.png',
      rating: 4.6,
      reviews: 89,
      priceRange: '₦₦₦',
      cuisine: 'Japanese',
      deliveryTime: '20-30 min'
    },
    {
      id: 9,
      name: 'Bottles Restaurant',
      category: 'Casual Dining',
      location: 'Ikoyi, Lagos',
      image: '/images/restaurant-card-9-3f0b44.png',
      rating: 4.7,
      reviews: 156,
      priceRange: '₦₦₦',
      cuisine: 'International',
      deliveryTime: '30-40 min'
    },
    {
      id: 10,
      name: 'Yellow Chilli',
      category: 'Fine Dining',
      location: 'Victoria Island, Lagos',
      image: '/images/restaurant-card-10-3f0b44.png',
      rating: 4.9,
      reviews: 203,
      priceRange: '₦₦₦₦',
      cuisine: 'Indian',
      deliveryTime: '25-35 min'
    },
    {
      id: 11,
      name: 'Sky Restaurant',
      category: 'Fine Dining',
      location: 'Lekki Phase 1, Lagos',
      image: '/images/restaurant-card-11-3f0b44.png',
      rating: 4.5,
      reviews: 78,
      priceRange: '₦₦₦₦',
      cuisine: 'Continental',
      deliveryTime: '35-45 min'
    },
    {
      id: 12,
      name: 'Bottles Restaurant',
      category: 'Casual Dining',
      location: 'Ikoyi, Lagos',
      image: '/images/restaurant-card-12-3f0b44.png',
      rating: 4.4,
      reviews: 92,
      priceRange: '₦₦₦',
      cuisine: 'Mediterranean',
      deliveryTime: '20-30 min'
    }
  ];

  const categories = ['Fine Dining', 'Casual Dining', 'Asian Fusion', 'Fast Food', 'Cafe', 'Bar & Grill'];
  const locations = ['Victoria Island', 'Lekki Phase 1', 'Ikoyi', 'Surulere', 'Yaba', 'Gbagada'];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      
      {/* Hero Section with Background Image and Search - Exact Figma Design */}
      <section className="relative h-[400px] bg-gradient-to-b from-black/24 to-black/60">
        <Image
          src="/images/restaurants-hero-bg.png"
          alt="Restaurants Hero"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1320px] mx-auto px-[60px] w-full">
            <div className="max-w-[487px] space-y-9">
              {/* Text Content */}
              <div className="space-y-3">
                <h1 className="text-[48px] font-bold font-urbanist leading-[1.1] text-white">
                  Discover Amazing Restaurants
                </h1>
                <p className="text-[20px] font-urbanist leading-[1.2] text-white opacity-90">
                  Find the best dining experiences in Lagos
                </p>
              </div>
              
              {/* Search Bar - Integrated in Hero */}
              <div className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-[#FAFAFA] border-2 border-[#6CC049] rounded-[16px] px-4 py-4">
                      <Image src="/images/icon-search.svg" alt="Search" width={24} height={24} />
                      <input
                        type="text"
                        placeholder="Search restaurant name"
                        className="bg-transparent text-[#212121] text-[16px] font-urbanist outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <button className="w-[52px] h-[52px] bg-[#6CC049] rounded-full flex items-center justify-center">
                    <Image src="/images/icon-arrow-right.svg" alt="Search" width={32} height={32} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-[60px] py-[40px]">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex gap-6">
            {/* Filter Sidebar - Exact Figma Design */}
            <div className="w-[312px] bg-[#FAFAFA] rounded-[8px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)] p-2 h-fit">
              <div className="space-y-2">
                {/* Filter Header */}
                <div className="flex items-center justify-between px-2 py-2">
                  <h3 className="text-[20px] font-bold text-[#212121] font-urbanist">Filter by:</h3>
                  <button className="border-2 border-[#012168] rounded-[60px] px-8 py-2 text-[#012168] text-[16px] font-semibold font-urbanist hover:bg-[#012168] hover:text-white transition-colors duration-200">
                    Reset
                  </button>
                </div>

                <div className="w-full h-px bg-[#E0E0E0]"></div>

                {/* Search Restaurant Name */}
                <div className="px-4 py-4 space-y-3">
                  <h3 className="text-[14px] font-bold text-[#212121] font-urbanist">Search restaurant name</h3>
                  <div className="flex items-center gap-2 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-[8px] px-2 py-2 w-[272px] h-10">
                    <Image src="/images/icon-search.svg" alt="Search" width={16} height={16} />
                    <input
                      type="text"
                      placeholder="Eric kaiser"
                      className="flex-1 bg-transparent text-[#212121] text-[14px] font-urbanist outline-none"
                    />
                  </div>
                </div>

                <div className="w-full h-px bg-[#E0E0E0]"></div>

                {/* Categories */}
                <div className="px-4 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-[#212121] font-urbanist">Categories</h3>
                    <Image src="/images/icon-arrow-down.svg" alt="Expand" width={16} height={16} />
                  </div>
                  <div className="flex items-center gap-2 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-[8px] px-2 py-2 w-[272px] h-10">
                    <Image src="/images/icon-search.svg" alt="Search" width={16} height={16} />
                    <input
                      type="text"
                      placeholder="Label"
                      className="flex-1 bg-transparent text-[#212121] text-[14px] font-urbanist outline-none"
                    />
                    <Image src="/images/icon-close.svg" alt="Close" width={16} height={16} />
                  </div>
                </div>

                <div className="w-full h-px bg-[#E0E0E0]"></div>

                {/* Price Range */}
                <div className="px-4 py-4 space-y-3">
                  <h3 className="text-[14px] font-bold text-[#212121] font-urbanist">Price</h3>
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-[#F5F5F5] rounded-full">
                      <div className="w-3/4 h-full bg-[#6CC049] rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-[12px] font-urbanist text-[#616161]">
                      <span>₦0</span>
                      <span>₦50,000+</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-[#E0E0E0]"></div>

                {/* Popular Locations */}
                <div className="px-4 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-[#212121] font-urbanist">Popular Locations</h3>
                    <Image src="/images/icon-arrow-down.svg" alt="Expand" width={16} height={16} />
                  </div>
                  <div className="flex items-center gap-2 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-[8px] px-2 py-2 w-[272px] h-10">
                    <Image src="/images/icon-search.svg" alt="Search" width={16} height={16} />
                    <input
                      type="text"
                      placeholder="Label"
                      className="flex-1 bg-transparent text-[#212121] text-[14px] font-urbanist outline-none"
                    />
                    <Image src="/images/icon-close.svg" alt="Close" width={16} height={16} />
                  </div>
                </div>

                <div className="w-full h-px bg-[#E0E0E0]"></div>

                {/* Dining Options */}
                <div className="px-4 py-4 space-y-3">
                  <h3 className="text-[14px] font-bold text-[#212121] font-urbanist">Dining Options</h3>
                  <div className="space-y-1 bg-white rounded-[8px] p-2 shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)]">
                    <label className="flex items-center justify-between p-2 bg-[#F5F5F5] rounded-[8px] cursor-pointer">
                      <span className="text-[14px] font-urbanist text-[#212121]">Delivery</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-urbanist text-[#616161]">20</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#6CC049]" />
                      </div>
                    </label>
                    <label className="flex items-center justify-between p-2 rounded-[8px] cursor-pointer hover:bg-[#F5F5F5]">
                      <span className="text-[14px] font-urbanist text-[#212121]">Takeaway</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-urbanist text-[#616161]">20</span>
                        <input type="checkbox" className="w-4 h-4 text-[#6CC049]" />
                      </div>
                    </label>
                    <label className="flex items-center justify-between p-2 rounded-[8px] cursor-pointer hover:bg-[#F5F5F5]">
                      <span className="text-[14px] font-urbanist text-[#212121]">Dine-in</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-urbanist text-[#616161]">20</span>
                        <input type="checkbox" className="w-4 h-4 text-[#6CC049]" />
                      </div>
                    </label>
                    <label className="flex items-center justify-between p-2 rounded-[8px] cursor-pointer hover:bg-[#F5F5F5]">
                      <span className="text-[14px] font-urbanist text-[#212121]">Outdoor-dining</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-urbanist text-[#616161]">20</span>
                        <input type="checkbox" className="w-4 h-4 text-[#6CC049]" />
                      </div>
                    </label>
                  </div>
                  <div className="flex justify-center">
                    <button className="text-[#012168] text-[22px] font-semibold font-urbanist hover:underline">
                      See more
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Cards Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    href={`/restaurants/vendor/${restaurant.id}`}
                    className="bg-white rounded-[17.89px] shadow-[0px_0.75px_2.98px_0px_rgba(12,12,13,0.05),0px_0.75px_2.98px_0px_rgba(12,12,13,0.1)] overflow-hidden hover:scale-105 transition-transform duration-200"
                    style={{ width: '312px', height: '323.32px' }}
                  >
                    <div className="relative w-full h-[214px]">
                      <Image
                        src={restaurant.image}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-[17.89px] space-y-[8.95px]">
                      <div className="space-y-[2.98px]">
                        <h3 className="text-[#212121] text-[14.91px] font-bold font-urbanist leading-[1.2]">
                          {restaurant.name}
                        </h3>
                        <p className="text-[#616161] text-[10.44px] font-urbanist leading-[1.2]">
                          {restaurant.location}
                        </p>
                      </div>

                      <button className="w-full bg-[#6CC049] text-white text-[11.93px] font-semibold font-urbanist py-[5.96px] px-[23.85px] rounded-[44.73px] hover:bg-[#5AA03A] transition-colors duration-200 flex items-center justify-center gap-[2.98px]">
                        Discover More
                        <Image src="/images/icon-arrow-right.svg" alt="Arrow Right" width={17.89} height={17.89} />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RestaurantsPage;