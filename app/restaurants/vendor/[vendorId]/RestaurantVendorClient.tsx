'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface RestaurantVendorClientProps {
  vendorId: string;
  restaurantData: any;
}

const RestaurantVendorClient: React.FC<RestaurantVendorClientProps> = ({ vendorId, restaurantData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: number]: number}>({});

  const nextImage = (itemId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (itemId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      
      {/* Restaurant Header Section */}
      <section className="px-[60px] py-[40px]">
        <div className="max-w-[1361px] mx-auto space-y-4">
          <h1 className="text-[40px] font-bold text-black font-urbanist leading-[1.1]">
            {restaurantData.name}
          </h1>
          <div className="flex items-center gap-2">
            <Image src="/images/icon-location.svg" alt="Location" width={24} height={24} />
            <p className="text-[#616161] text-base font-urbanist">
              {restaurantData.location}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Image src="/images/icon-star.svg" alt="Star" width={20} height={20} />
              <span className="text-[#212121] text-[16px] font-semibold font-urbanist">
                {restaurantData.rating}
              </span>
              <span className="text-[#616161] text-[14px] font-urbanist">
                ({restaurantData.reviews} reviews)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#616161] text-[14px] font-urbanist">Cuisine:</span>
              <span className="text-[#212121] text-[14px] font-semibold font-urbanist">
                {restaurantData.cuisine}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#616161] text-[14px] font-urbanist">Price:</span>
              <span className="text-[#212121] text-[14px] font-semibold font-urbanist">
                {restaurantData.priceRange}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#616161] text-[14px] font-urbanist">Delivery:</span>
              <span className="text-[#212121] text-[14px] font-semibold font-urbanist">
                {restaurantData.deliveryTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items Section */}
      <section className="px-[60px] py-[60px] bg-[#FAFAFA]">
        <div className="max-w-[1320px] mx-auto space-y-8">
          {/* Header with Search and Filter */}
          <div className="flex justify-between items-center">
            <h2 className="text-[30px] font-semibold text-black font-urbanist leading-[1.13]">
              Menu Items
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex items-center gap-1 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-lg px-2 py-2 w-[272px] h-10">
                  <Image src="/images/icon-search.svg" alt="Search" width={20} height={20} />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    className="flex-1 bg-transparent text-[#9E9E9E] text-base font-urbanist outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Image src="/images/icon-close.svg" alt="Close" width={16} height={16} />
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-lg px-2 py-2 h-10">
                <Image src="/images/icon-sort.svg" alt="Filter" width={20} height={20} />
                <span className="text-[#9E9E9E] text-base font-urbanist">Filter</span>
              </div>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-3 gap-6">
            {restaurantData.menuItems.map((item: any) => {
              const currentIndex = currentImageIndex[item.id] || 0;
              const currentImage = item.image;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] border border-[#F5F5F5] overflow-hidden"
                  style={{ width: '424px' }}
                >
                  {/* Image Section */}
                  <div className="relative h-[214px]">
                    <Image
                      src={currentImage}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />

                    {/* Navigation Arrows */}
                    <div className="absolute top-[91px] left-6 right-6 flex justify-between">
                      <button
                        onClick={() => prevImage(item.id, 1)}
                        className="w-8 h-8 bg-white rounded-full shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Image src="/images/icon-arrow-left.svg" alt="Previous" width={20} height={20} />
                      </button>
                      <button
                        onClick={() => nextImage(item.id, 1)}
                        className="w-8 h-8 bg-white rounded-full shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Image src="/images/icon-arrow-right.svg" alt="Next" width={20} height={20} />
                      </button>
                    </div>

                    {/* Preparation Time Badge */}
                    <div className="absolute top-4 right-4 bg-black/70 text-white text-[12px] font-semibold font-urbanist px-3 py-1 rounded-full">
                      {item.preparationTime}
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="p-6 space-y-4">
                    {/* Header Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[#616161] text-[20px] font-semibold font-urbanist leading-[1.2]">
                          {item.name}
                        </h3>
                        <span className="text-[#6CC049] text-[18px] font-bold font-urbanist">
                          ₦{item.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#9E9E9E] text-[14px] font-urbanist leading-[1.4]">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#E2F2DB] text-[#6CC049] text-[12px] font-semibold font-urbanist px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-[#E0E0E0]"></div>

                    {/* Add to Cart Button */}
                    <Link 
                      href={`/restaurants/vendor/${vendorId}/product/${item.id}`}
                      className="w-full bg-[#6CC049] text-white text-[20px] font-semibold font-urbanist py-2 px-8 rounded-[60px] hover:bg-[#5AA03A] transition-colors duration-200 flex items-center justify-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RestaurantVendorClient;