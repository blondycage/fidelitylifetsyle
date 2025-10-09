'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const VendorPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: number]: number}>({});

  // Mock vendor data based on the accommodation ID
  const vendorData = {
    id: id,
    name: 'Radisson Blue Anchorage Hotels',
    location: '1 Ozumba Mbadiwe Avenue, Victoria Island, Lagos, Nigeria- show on map',
    rooms: [
      {
        id: 1,
        name: 'Deluxe King Room',
        price: 200000,
        images: ['/images/accommodation-card-1.png'],
        roomsLeft: 4,
        amenities: ['WiFi', 'Pool', 'Gym', 'Kitchen']
      },
      {
        id: 2,
        name: 'Deluxe King Room',
        price: 200000,
        images: ['/images/accommodation-card-2.png'],
        roomsLeft: 4,
        amenities: ['WiFi', 'Pool', 'Gym', 'Kitchen']
      },
      {
        id: 3,
        name: 'Deluxe King Room',
        price: 200000,
        images: ['/images/accommodation-card-3.png'],
        roomsLeft: 4,
        amenities: ['WiFi', 'Pool', 'Gym', 'Kitchen']
      },
      {
        id: 4,
        name: 'Deluxe King Room',
        price: 200000,
        images: ['/images/accommodation-card-1.png'],
        roomsLeft: 4,
        amenities: ['WiFi', 'Pool', 'Gym', 'Kitchen']
      },
      {
        id: 5,
        name: 'Deluxe King Room',
        price: 200000,
        images: ['/images/accommodation-card-2.png'],
        roomsLeft: 4,
        amenities: ['WiFi', 'Pool', 'Gym', 'Kitchen']
      },
      {
        id: 6,
        name: 'Deluxe King Room',
        price: 200000,
        images: ['/images/accommodation-card-3.png'],
        roomsLeft: 4,
        amenities: ['WiFi', 'Pool', 'Gym', 'Kitchen']
      }
    ]
  };

  const nextImage = (roomId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (roomId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      
      {/* Vendor Header Section */}
      <section className="px-[60px] py-[40px]">
        <div className="max-w-[1361px] mx-auto space-y-4">
          <h1 className="text-[40px] font-bold text-black font-urbanist leading-[1.1]">
            {vendorData.name}
          </h1>
          <div className="flex items-center gap-2">
            <Image src="/images/icon-location.svg" alt="Location" width={24} height={24} />
            <p className="text-[#616161] text-base font-urbanist">
              {vendorData.location}
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="px-[60px] py-[60px] bg-[#FAFAFA]">
        <div className="max-w-[1320px] mx-auto space-y-8">
          {/* Header with Search and Filter */}
          <div className="flex justify-between items-center">
            <h2 className="text-[30px] font-semibold text-black font-urbanist leading-[1.13]">
              Products
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex items-center gap-1 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-lg px-2 py-2 w-[272px] h-10">
                  <Image src="/images/icon-search.svg" alt="Search" width={20} height={20} />
                  <input
                    type="text"
                    placeholder="Search..."
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

          {/* Room Cards Grid */}
          <div className="grid grid-cols-3 gap-6">
            {vendorData.rooms.map((room) => {
              const currentIndex = currentImageIndex[room.id] || 0;
              const currentImage = room.images[currentIndex];
              
              return (
                <div 
                  key={room.id} 
                  className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] border border-[#F5F5F5] overflow-hidden"
                  style={{ width: '424px' }}
                >
                  {/* Image Section */}
                  <div className="relative h-[214px]">
                    <Image 
                      src={currentImage} 
                      alt={room.name}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Navigation Arrows - Exact Figma positioning */}
                    <div className="absolute top-[91px] left-6 right-6 flex justify-between">
                      <button 
                        onClick={() => prevImage(room.id, room.images.length)}
                        className="w-8 h-8 bg-white rounded-full shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Image src="/images/icon-arrow-left.svg" alt="Previous" width={20} height={20} />
                      </button>
                      <button 
                        onClick={() => nextImage(room.id, room.images.length)}
                        className="w-8 h-8 bg-white rounded-full shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Image src="/images/icon-arrow-right.svg" alt="Next" width={20} height={20} />
                      </button>
                    </div>
                    
                    {/* Image Counter - Exact Figma positioning and styling */}
                    <div className="absolute bottom-4 right-4 bg-gradient-to-b from-[#3A3A3A] to-[#666666] rounded-[24px] px-4 py-2 flex items-center gap-2 backdrop-blur-sm">
                      <Image src="/images/icon-arrow-down.svg" alt="Gallery" width={16} height={16} className="rotate-90" />
                      <span className="text-white text-base font-bold font-urbanist">{room.images.length}</span>
                    </div>
                  </div>
                  
                  {/* Description Section - Exact Figma layout */}
                  <div className="p-6 space-y-8">
                    {/* Header Section */}
                    <div className="space-y-2">
                      <h3 className="text-[#616161] text-[20px] font-semibold font-urbanist leading-[1.2]">
                        {room.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-black text-[20px] font-semibold font-urbanist leading-[1.2]">
                            ₦{room.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-[rgba(250,204,21,0.2)] rounded-[10px] px-3 py-2 flex items-center gap-2">
                          <Image src="/images/icon-info-circle.svg" alt="Info" width={18} height={18} />
                          <span className="text-[#FF981F] text-[10px] font-urbanist leading-[1.6] tracking-[0.03em]">
                            {room.roomsLeft} rooms left
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="w-full h-px bg-[#E0E0E0]"></div>
                    
                    {/* Continue Button */}
                    <Link 
                      href={`/product/${room.id}`}
                      className="w-full bg-[#6CC049] text-white text-[20px] font-semibold font-urbanist py-2 px-8 rounded-[60px] hover:bg-[#5AA03A] transition-colors duration-200 flex items-center justify-center"
                    >
                      Continue
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

export default VendorPage;