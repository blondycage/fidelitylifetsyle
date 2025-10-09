'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface AccommodationDetailProps {
  params: Promise<{
    id: string;
  }>;
}

const AccommodationDetailPage = async ({ params }: AccommodationDetailProps) => {
  const { id } = await params;
  const [searchQuery, setSearchQuery] = useState('');

  // Real accommodation data - in a real app, this would be fetched based on the ID
  const accommodation = {
    id: parseInt(id),
    name: 'Radisson Blue Anchorage Hotels',
    location: '1 Ozumba Mbadiwe Avenue, Victoria Island, Lagos, Nigeria',
    price: 200000,
    rating: 4.8,
    reviews: 124,
    images: [
      '/images/accommodation-detail-1.jpg',
      '/images/accommodation-detail-2.jpg',
      '/images/accommodation-detail-3.jpg',
      '/images/accommodation-detail-4.jpg'
    ],
    amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Air conditioning', 'Laundry'],
    description: 'Experience luxury and comfort at Radisson Blue Anchorage Hotels, located in the heart of Victoria Island. Our modern facilities and exceptional service ensure a memorable stay.',
    rooms: [
      {
        id: 1,
        name: 'Deluxe King Room',
        price: 200000,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
        amenities: ['King Bed', 'City View', 'WiFi', 'Air Conditioning'],
        roomsLeft: 4
      },
      {
        id: 2,
        name: 'Executive Suite',
        price: 350000,
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop',
        amenities: ['King Bed', 'Ocean View', 'WiFi', 'Air Conditioning', 'Mini Bar'],
        roomsLeft: 2
      },
      {
        id: 3,
        name: 'Presidential Suite',
        price: 500000,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
        amenities: ['King Bed', 'Panoramic View', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Butler Service'],
        roomsLeft: 1
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      
      {/* Hotel Header Section */}
      <section className="px-[60px] py-[40px]">
        <div className="space-y-4">
          <h1 className="text-[40px] font-bold text-black font-urbanist leading-[1.1]">
            {accommodation.name}
          </h1>
          <div className="flex items-center gap-2">
            <Image src="/images/icon-location.svg" alt="Location" width={24} height={24} />
            <span className="text-[#616161] text-base font-urbanist">
              {accommodation.location} - show on map
            </span>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="px-[60px] pb-[60px] bg-[#FAFAFA]">
        <div className="space-y-8">
          {/* Header with Search and Filter */}
          <div className="flex items-center justify-between">
            <h2 className="text-[30px] font-semibold text-black font-urbanist">Products</h2>
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
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')}>
                      <Image src="/images/icon-close.svg" alt="Close" width={16} height={16} />
                    </button>
                  )}
                </div>
              </div>
              <button className="flex items-center gap-2 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-lg px-2 py-2 h-10">
                <Image src="/images/icon-sort.svg" alt="Sort" width={20} height={20} />
                <span className="text-[#9E9E9E] text-base font-urbanist">Filter</span>
              </button>
            </div>
          </div>

          {/* Room Cards Grid */}
          <div className="grid grid-cols-3 gap-6">
            {accommodation.rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] overflow-hidden">
                <div className="relative h-[214px] bg-cover bg-center" 
                     style={{ backgroundImage: `url(${room.image})` }}>
                  {/* No navigation arrows for room cards - single image only */}
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-[#616161] text-[20px] font-semibold font-urbanist">
                      {room.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[#212121] text-[20px] font-semibold font-urbanist">
                          ₦{room.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-[#FACD15]/20 rounded-lg px-3 py-2 flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#FF981F] rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-[#FF981F] text-[10px] font-urbanist">
                          {room.roomsLeft} rooms left
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-[#E0E0E0]"></div>
                  
                  <button className="w-full bg-[#6CC049] text-white text-[20px] font-semibold font-urbanist py-2 px-8 rounded-full hover:bg-[#5AA03A] transition-colors duration-200">
                    Continue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AccommodationDetailPage;