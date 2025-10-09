'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ProductDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const [selectedFaq, setSelectedFaq] = useState(1);

  // Mock product data based on the product ID
  const productData = {
    id: id,
    name: 'Deluxe King Room',
    price: 238000,
    pricePerNight: '/night',
    description: `Radisson Blu Anchorage Hotel is a stylish waterfront property located in the heart of Victoria Island, offering guests the perfect balance between vibrant city life and the calm of Lagos Lagoon.

Radisson Blu Anchorage Hotel is a stylish waterfront property located in the heart of Victoria Island, offering guests the perfect balance between vibrant city life and the calm of Lagos Lagoon.

Whether you are visiting for business or leisure, Radisson Blu ensures an experience of comfort and sophistication.`,
    amenities: [
      { name: 'WiFi', icon: '/images/icon-wifi.svg' },
      { name: 'Gym', icon: '/images/icon-gym.svg' },
      { name: 'Pool', icon: '/images/icon-pool.svg' },
      { name: 'Kitchen', icon: '/images/icon-kitchen.svg' },
      { name: 'Spa', icon: '/images/icon-spa.svg' },
      { name: 'Restaurant', icon: '/images/icon-restaurant.svg' },
      { name: 'Air conditioning', icon: '/images/icon-air-conditioning.svg' },
      { name: 'Laundry', icon: '/images/icon-laundry.svg' }
    ],
    rating: 4.8,
    reviewCount: 100,
    reviewCategories: [
      { name: 'Comfortable', rating: 4.8 },
      { name: 'Cleanliness', rating: 4.8 },
      { name: 'Service', rating: 4.9 },
      { name: 'Location', rating: 4.7 },
      { name: 'Value', rating: 4.8 }
    ],
    reviews: [
      {
        id: 1,
        author: 'Sarah Johnson',
        comment: 'Absolutely stunning room with breathtaking views of the lagoon. The service was impeccable and the staff went above and beyond to make our stay memorable.',
        timeAgo: '2 days ago',
        avatar: '/images/accommodation-card-1.png'
      },
      {
        id: 2,
        author: 'Michael Chen',
        comment: 'Perfect location in Victoria Island. The room was spacious and clean, and the amenities were top-notch. Highly recommend for business travelers.',
        timeAgo: '1 week ago',
        avatar: '/images/accommodation-card-2.png'
      },
      {
        id: 3,
        author: 'Adebayo Okafor',
        comment: 'Excellent value for money. The pool area is fantastic and the restaurant serves delicious local cuisine. Will definitely be back!',
        timeAgo: '3 days ago',
        avatar: '/images/accommodation-card-3.png'
      },
      {
        id: 4,
        author: 'Emma Williams',
        comment: 'The spa services were incredible and the room was beautifully decorated. Perfect for a romantic getaway. The staff was very attentive.',
        timeAgo: '5 days ago',
        avatar: '/images/accommodation-card-1.png'
      },
      {
        id: 5,
        author: 'David Thompson',
        comment: 'Great hotel with modern facilities. The WiFi was fast and reliable, perfect for remote work. The gym equipment is excellent too.',
        timeAgo: '1 week ago',
        avatar: '/images/accommodation-card-2.png'
      }
    ],
    faqs: [
      {
        id: 1,
        question: 'What time is check-in and check-out?',
        answer: 'Check-in time is 3:00 PM and check-out is 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability and additional charges.',
        isOpen: true
      },
      {
        id: 2,
        question: 'What amenities are included in the room?',
        answer: 'All rooms include complimentary WiFi, air conditioning, flat-screen TV, minibar, coffee maker, iron and ironing board, safe, and daily housekeeping service.',
        isOpen: false
      },
      {
        id: 3,
        question: 'Is parking available at the hotel?',
        answer: 'Yes, we offer complimentary valet parking for all guests. Self-parking is also available in our secure underground garage at no additional charge.',
        isOpen: false
      },
      {
        id: 4,
        question: 'What is the hotel\'s cancellation policy?',
        answer: 'Free cancellation is available up to 24 hours before your scheduled arrival date. Cancellations made within 24 hours may be subject to a one-night room charge.',
        isOpen: false
      },
      {
        id: 5,
        question: 'Does the hotel have a restaurant and bar?',
        answer: 'Yes, we have an on-site restaurant serving international and local cuisine, plus a rooftop bar with stunning lagoon views. Room service is available 24/7.',
        isOpen: false
      },
      {
        id: 6,
        question: 'Is the hotel pet-friendly?',
        answer: 'Unfortunately, we do not allow pets in our hotel. We recommend contacting nearby pet-friendly accommodations if you\'re traveling with pets.',
        isOpen: false
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 0.9;
            transform: translateY(0);
          }
        }
      `}</style>
      <Header />
      
      {/* Product Header Section - Exact Figma Layout */}
      <section className="px-[60px] py-0">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-center justify-between py-[32px]">
            <div className="flex items-center gap-3">
              <Link href="/accommodation" className="flex items-center gap-3">
                <Image src="/images/icon-arrow-left-large.svg" alt="Back" width={24} height={24} />
                <h1 className="text-[40px] font-bold text-black font-urbanist leading-[1.1]">
                  {productData.name}
                </h1>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-black text-[20px] font-semibold font-urbanist leading-[1.2]">
                ₦{productData.price.toLocaleString()}
              </span>
              <span className="text-[#757575] text-[16px] font-semibold font-urbanist leading-[1.25]">
                {productData.pricePerNight}
              </span>
            </div>
          </div>
          
          {/* Reserve Button - Exact Figma positioning */}
          <div className="flex justify-end mb-8">
            <button className="w-[194px] h-[52px] bg-[#6CC049] text-white text-[20px] font-semibold font-urbanist rounded-[60px] hover:bg-[#5AA03A] transition-colors duration-200">
              Reserve
            </button>
          </div>
          
          {/* Filter Bar - Exact Figma styling */}
          <div className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] p-0 mb-8">
            <div className="flex items-center justify-between px-[24px] py-[16px]">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-[#FAFAFA] border-2 border-[#6CC049] rounded-[16px] px-4 py-4">
                  <Image src="/images/icon-calendar.svg" alt="Calendar" width={24} height={24} />
                  <span className="text-[#212121] text-[16px] font-urbanist">Oct 22 - Oct 26</span>
                </div>
                <div className="w-px h-9 bg-[#6CC049]"></div>
                <div className="flex items-center gap-2 bg-[#FAFAFA] border-2 border-[#6CC049] rounded-[16px] px-4 py-4">
                  <Image src="/images/icon-bed.svg" alt="Bed" width={24} height={24} />
                  <span className="text-[#212121] text-[16px] font-urbanist">Suite</span>
                </div>
                <div className="w-px h-9 bg-[#6CC049]"></div>
                <div className="flex items-center gap-2 bg-[#FAFAFA] border-2 border-[#6CC049] rounded-[16px] px-4 py-4">
                  <Image src="/images/icon-frame.svg" alt="Guests" width={24} height={24} />
                  <span className="text-[#212121] text-[16px] font-urbanist">2 Guests</span>
                </div>
              </div>
              <button className="w-[52px] h-[52px] bg-[#6CC049] rounded-full flex items-center justify-center">
                <Image src="/images/icon-arrow-right.svg" alt="Search" width={32} height={32} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section - Exact Figma Layout */}
      <section className="px-[60px] py-[60px]">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex gap-6">
            {/* Main Image - Exact dimensions */}
            <div className="relative w-[648px] h-[660px] rounded-[32px] overflow-hidden">
              <Image 
                src="/images/product-main-image.png" 
                alt={productData.name}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Side Images - Exact Figma layout */}
            <div className="flex flex-col gap-6 w-[648px]">
              <div className="relative w-full h-[324px] rounded-[32px] overflow-hidden">
                <Image 
                  src="/images/product-side-image-1-5f031c.png" 
                  alt={productData.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex gap-6">
                <div className="relative w-[312px] h-[312px] rounded-[32px] overflow-hidden">
                  <Image 
                    src="/images/product-side-image-2.png" 
                    alt={productData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-[312px] h-[312px] rounded-[32px] overflow-hidden bg-gradient-to-b from-black/24 to-black/60">
                  <Image 
                    src="/images/product-side-image-3.png" 
                    alt={productData.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-[60px] font-bold font-urbanist">+20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section - Exact Figma Layout */}
      <section className="px-[60px] py-[60px]">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex flex-col items-center gap-[60px]">
            {/* About Section */}
            <div className="w-full space-y-8">
              <h2 className="text-[30px] font-semibold text-black font-urbanist leading-[1.13]">
                About This Property
              </h2>
              <p className="text-[#616161] text-[16px] font-urbanist leading-[1.25] max-w-[840px]">
                {productData.description}
              </p>
            </div>

            {/* Amenities Section - Exact Figma grid */}
            <div className="w-full space-y-8">
              <h2 className="text-[30px] font-semibold text-black font-urbanist leading-[1.13]">
                Ammenities
              </h2>
              <div className="flex flex-col gap-3 max-w-[540px]">
                <div className="flex gap-3">
                  {productData.amenities.slice(0, 4).map((amenity, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 p-4 bg-white border border-[#F5F5F5] rounded-[10px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] w-[126px] h-[84px]">
                      <Image src={amenity.icon} alt={amenity.name} width={24} height={24} />
                      <span className="text-[#012168] text-[16px] font-semibold font-urbanist text-center">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  {productData.amenities.slice(4, 8).map((amenity, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 p-4 bg-white border border-[#F5F5F5] rounded-[10px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] w-[126px] h-[84px]">
                      <Image src={amenity.icon} alt={amenity.name} width={24} height={24} />
                      <span className="text-[#012168] text-[16px] font-semibold font-urbanist text-center">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section - Exact Figma layout */}
            <div className="w-full space-y-8">
              <h2 className="text-[30px] font-semibold text-black font-urbanist leading-[1.13]">
                Reviews
              </h2>
              <div className="flex flex-col gap-8">
                {/* Rating and Tags Section */}
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-4">
                    <span className="text-black text-[60px] font-semibold font-urbanist leading-[1]">
                      {productData.rating}
                    </span>
                    <div className="flex flex-col gap-1 w-[152px]">
                      <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Image key={i} src="/images/icon-star.svg" alt="Star" width={24} height={24} />
                        ))}
                      </div>
                      <span className="text-[#616161] text-[14px] font-urbanist leading-[1.2]">
                        Based on {productData.reviewCount} reviews
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-6 w-[424px]">
                    {productData.reviewCategories.map((category, index) => (
                      <div key={index} className="bg-[#E9EDF5] rounded-[10px] px-3 py-1">
                        <span className="text-[#5A6376] text-[14px] font-semibold font-urbanist">
                          {category.name} {category.rating}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Review Cards Section */}
                <div className="flex gap-6">
                  {productData.reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="flex-1 bg-white border border-[#F5F5F5] rounded-[12px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] p-3">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <Image src={review.avatar} alt={review.author} width={48} height={48} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-black text-[16px] font-bold font-urbanist">
                          {review.author}
                        </span>
                      </div>
                      <p className="text-black text-[14px] font-urbanist leading-[1.2] mb-3">
                        {review.comment}
                      </p>
                      <div className="flex items-center gap-6">
                        <span className="text-[#757575] text-[14px] font-urbanist">
                          {review.timeAgo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* See More Button */}
                <div className="flex justify-center">
                  <button className="border-2 border-[#012168] rounded-[60px] px-8 py-4 text-[#012168] text-[20px] font-semibold font-urbanist hover:bg-[#012168] hover:text-white transition-colors duration-200">
                    See more
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ Section - Interactive with animations */}
            <div className="w-full bg-[#FAFAFA] rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.1)] p-[84px_60px]">
              <div className="flex gap-6">
                <div className="w-[588px] space-y-12">
                  <h2 className="text-[#012168] text-[60px] font-bold font-urbanist leading-[1]">
                    FAQs
                  </h2>
                  <div className="space-y-6">
                    {productData.faqs.map((faq) => (
                      <div 
                        key={faq.id} 
                        className={`p-6 rounded-[16px] cursor-pointer transition-all duration-300 ${
                          selectedFaq === faq.id 
                            ? 'bg-[#E2F2DB] border-3 border-[#366024] shadow-lg' 
                            : 'bg-[#FAFAFA] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.1)] hover:shadow-md'
                        }`}
                        onClick={() => setSelectedFaq(faq.id)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className={`text-[30px] font-bold font-urbanist transition-colors duration-300 ${
                            selectedFaq === faq.id ? 'text-[#366024]' : 'text-[#9E9E9E]'
                          }`}>
                            {faq.question}
                          </h3>
                          <Image 
                            src="/images/icon-arrow-right-outline.svg" 
                            alt="Arrow" 
                            width={28} 
                            height={28}
                            className={`transform transition-all duration-300 ${
                              selectedFaq === faq.id ? 'rotate-90 scale-110' : 'rotate-0 scale-100'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-[588px] space-y-12">
                  <h2 className="text-[#012168] text-[60px] font-bold font-urbanist leading-[1]">
                    Ans.
                  </h2>
                  <div className="bg-[#366024] rounded-[16px] p-6 h-[391px] flex items-center justify-center transition-all duration-500">
                    <div className="text-center">
                      <p 
                        key={selectedFaq}
                        className="text-white text-[24px] font-semibold font-urbanist leading-[1.17] opacity-90"
                        style={{
                          animation: 'fadeIn 0.5s ease-in-out'
                        }}
                      >
                        {productData.faqs.find(faq => faq.id === selectedFaq)?.answer || 'Select a question to view the answer'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reserve Button - Exact Figma positioning */}
            <button className="w-full max-w-[1320px] bg-[#6CC049] text-white text-[20px] font-semibold font-urbanist py-4 px-8 rounded-[60px] hover:bg-[#5AA03A] transition-colors duration-200">
              Reserve
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;