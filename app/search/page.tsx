'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown2 } from 'iconsax-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Categories');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = [
    {
      name: 'Accommodation',
      icon: '/images/category-accommodation.svg',
      bgColor: 'rgba(119, 192, 73, 0.2)',
      iconColor: '#77C049',
      href: '/accommodation'
    },
    {
      name: 'Restaurant',
      icon: '/images/category-restaurant.svg',
      bgColor: 'rgba(192, 117, 73, 0.2)',
      iconColor: '#C07549'
    },
    {
      name: 'Club',
      icon: '/images/category-club.svg',
      bgColor: 'rgba(125, 73, 192, 0.2)',
      iconColor: '#7D49C0'
    },
    {
      name: 'Events',
      icon: '/images/category-events.svg',
      bgColor: 'rgba(68, 188, 180, 0.2)',
      iconColor: '#44BCB4'
    },
    {
      name: 'Fashion',
      icon: '/images/category-fashion.svg',
      bgColor: 'rgba(68, 98, 188, 0.2)',
      iconColor: '#4462BC'
    },
    {
      name: 'Car rental',
      icon: '/images/category-car.svg',
      bgColor: 'rgba(192, 73, 176, 0.2)',
      iconColor: '#C049B0'
    }
  ];

  const recentSearches = [
    'Victoria Island',
    'Odubudu Ranch',
    'Wavering Towers',
    'Olumo Rock'
  ];

  const trendingSearches = [
    { name: 'Victoria Island', count: '20' },
    { name: 'Odubudu Ranch', count: '20' },
    { name: 'Wavering Towers', count: '20' },
    { name: 'Olumo Rock', count: '20' }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      
      <main className="max-w-[1440px] mx-auto">
        {/* Hero Section */}
        <section className="px-[60px] py-[60px]">
          <div className="space-y-[60px]">
            {/* Text Content */}
            <div className="space-y-3 px-0">
              <h1 className="text-[40px] font-bold text-black font-urbanist leading-[1.1]">
                Explore What's Around You
              </h1>
              <p className="text-[#616161] text-base leading-[1.25] font-urbanist">
                Find stays, food, and entertainment tailored to your lifestyle.
              </p>
            </div>

            {/* Search Controls */}
            <div className="flex items-center justify-between gap-[60px] px-0">
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center gap-[6px] bg-[#F5F5F5] border-2 border-[#E0E0E0] rounded-lg px-2 py-2 h-10"
                >
                  <span className="text-[#9E9E9E] font-semibold text-base font-urbanist">
                    {selectedCategory}
                  </span>
                  <ArrowDown2 size={20} className="text-black" />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      {categories.map((category) => (
                        <button
                          key={category.name}
                          onClick={() => {
                            setSelectedCategory(category.name);
                            setShowCategoryDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md text-sm font-medium text-gray-700"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Bar and Filter */}
              <div className="flex items-center gap-2">
                {/* Search Bar */}
                <div className="relative">
                  <div className="flex items-center gap-1 bg-white border-2 border-[#E0E0E0] rounded-lg px-2 py-2 w-[272px] h-10">
                    <Image src="/images/icon-search.svg" alt="Search" width={20} height={20} />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-[#9E9E9E] text-base font-urbanist placeholder-[#9E9E9E] focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-[#9E9E9E] hover:text-gray-700"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Button */}
                <button className="flex items-center gap-2 bg-white border-2 border-[#E0E0E0] rounded-lg px-2 py-2 h-10">
                  <Image src="/images/icon-sort.svg" alt="Sort" width={20} height={20} />
                  <span className="text-[#9E9E9E] text-base font-urbanist">Filter</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="px-[80px] pb-[60px]">
          <div className="flex justify-between gap-4">
            {categories.map((category, index) => {
              const CategoryComponent = category.href ? Link : 'div';
              const categoryProps = category.href ? { href: category.href } : {};
              
              return (
                <CategoryComponent
                  key={category.name}
                  {...categoryProps}
                  className="w-[160px] h-[160px] rounded-[32px] border border-white shadow-[0px_0px_8px_4px_rgba(255,255,255,0.25)] cursor-pointer hover:scale-105 transition-transform duration-200 flex-shrink-0"
                  style={{ backgroundColor: category.bgColor }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    {/* Icon - smaller and centered */}
                    <div className="w-12 h-12 mb-4 flex items-center justify-center">
                      <Image
                        src={category.icon}
                        alt={category.name}
                        width={48}
                        height={48}
                        className="w-full h-full"
                        style={{ filter: `hue-rotate(${category.iconColor === '#77C049' ? '0deg' : 
                          category.iconColor === '#C07549' ? '30deg' :
                          category.iconColor === '#7D49C0' ? '60deg' :
                          category.iconColor === '#44BCB4' ? '90deg' :
                          category.iconColor === '#4462BC' ? '120deg' : '150deg'})` }}
                      />
                    </div>
                    
                    {/* Category Name */}
                    <h3 className="text-[20px] font-bold text-black font-urbanist text-center">
                      {category.name}
                    </h3>
                  </div>
                </CategoryComponent>
              );
            })}
          </div>
        </section>

        {/* Search Suggestions Section */}
        <section className="px-[80px] pb-[60px]">
          <div className="space-y-[32px]">
            {/* Recent Searches */}
            <div className="space-y-4">
              <h2 className="text-[14px] font-bold text-[#212121] font-urbanist uppercase tracking-[1.43%] px-4">
                Recent
              </h2>
              <div className="p-2 space-y-[2px]">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <Image src="/images/icon-clock.svg" alt="Clock" width={16} height={16} className="text-[#BDBDBD]" />
                    <span className="text-[#757575] text-[12px] font-semibold font-urbanist">
                      {search}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E0E0E0] h-px"></div>

            {/* Trending Searches */}
            <div className="space-y-4">
              <h2 className="text-[14px] font-bold text-[#212121] font-urbanist uppercase tracking-[1.43%] px-4">
                Trending
              </h2>
              <div className="p-2 space-y-[2px]">
                {trendingSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image src="/images/icon-trend-up.svg" alt="Trend Up" width={16} height={16} className="text-[#BDBDBD]" />
                      <span className="text-[#757575] text-[12px] font-semibold font-urbanist">
                        {search.name}
                      </span>
                    </div>
                    <span className="text-[#757575] text-[10px] font-urbanist">
                      {search.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;