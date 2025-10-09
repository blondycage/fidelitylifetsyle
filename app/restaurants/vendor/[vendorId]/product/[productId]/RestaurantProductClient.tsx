'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface RestaurantProductClientProps {
  vendorId: string;
  productId: string;
  productData: any;
}

const RestaurantProductClient: React.FC<RestaurantProductClientProps> = ({ vendorId, productId, productData }) => {
  const [selectedFaq, setSelectedFaq] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showReviews, setShowReviews] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getCurrentPrice = () => {
    const size = productData.sizes.find((s: any) => s.name === selectedSize);
    const addonPrice = selectedAddons.reduce((total, addonName) => {
      const addon = productData.addons.find((a: any) => a.name === addonName);
      return total + (addon ? addon.price : 0);
    }, 0);
    return (size ? size.price : productData.price) + addonPrice;
  };

  const toggleAddon = (addonName: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonName) 
        ? prev.filter(name => name !== addonName)
        : [...prev, addonName]
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productData.images.length) % productData.images.length);
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
      
      {/* Product Header Section */}
      <section className="px-[60px] py-8">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Link href={`/restaurants/vendor/${vendorId}`} className="flex items-center gap-3">
                <Image src="/images/icon-arrow-left-large.svg" alt="Back" width={24} height={24} />
                <h1 className="text-[40px] font-bold text-black font-urbanist leading-[1.1]">
                  {productData.name}
                </h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Image src="/images/icon-star.svg" alt="Star" width={20} height={20} />
                <span className="text-[#212121] text-[16px] font-semibold font-urbanist">
                  {productData.rating}
                </span>
                <span className="text-[#616161] text-[14px] font-urbanist">
                  ({productData.reviewsCount} reviews)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/images/icon-clock.svg" alt="Time" width={20} height={20} />
                <span className="text-[#616161] text-[16px] font-urbanist">
                  {productData.preparationTime}
                </span>
              </div>
            </div>
          </div>
          
          {/* Restaurant Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Image src="/images/icon-location.svg" alt="Location" width={20} height={20} />
              <span className="text-[#616161] text-[16px] font-urbanist">{productData.restaurant}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#616161] text-[16px] font-urbanist">Cuisine:</span>
              <span className="text-[#212121] text-[16px] font-semibold font-urbanist">
                {productData.cuisine}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#616161] text-[16px] font-urbanist">Delivery:</span>
              <span className="text-[#212121] text-[16px] font-semibold font-urbanist">
                {productData.deliveryTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="px-[60px] py-8">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex gap-8">
            {/* Product Images */}
            <div className="w-[600px] space-y-4">
              <div className="relative h-[400px] rounded-[24px] overflow-hidden">
                <Image 
                  src={productData.images[currentImageIndex]} 
                  alt={productData.name}
                  fill
                  className="object-cover"
                />
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Image src="/images/icon-arrow-left.svg" alt="Previous" width={20} height={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Image src="/images/icon-arrow-right.svg" alt="Next" width={20} height={20} />
                </button>
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[14px] font-semibold px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {productData.images.length}
                </div>
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex gap-2">
                {productData.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-[120px] h-[80px] rounded-[12px] overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-[#6CC049]' : ''
                    }`}
                  >
                    <Image src={image} alt={`${productData.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 space-y-6">
              {/* Price and Discount */}
              <div className="flex items-center gap-4">
                <span className="text-[#6CC049] text-[32px] font-bold font-urbanist">
                  ₦{getCurrentPrice().toLocaleString()}
                </span>
                {productData.originalPrice && (
                  <span className="text-[#9E9E9E] text-[20px] font-urbanist line-through">
                    ₦{productData.originalPrice.toLocaleString()}
                  </span>
                )}
                {productData.originalPrice && (
                  <span className="bg-[#FF6B6B] text-white text-[14px] font-semibold px-2 py-1 rounded">
                    Save ₦{(productData.originalPrice - productData.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-[20px] font-semibold text-black font-urbanist">Description</h3>
                <p className="text-[#616161] text-[16px] font-urbanist leading-[1.5]">
                  {productData.description}
                </p>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <h3 className="text-[20px] font-semibold text-black font-urbanist">Size</h3>
                <div className="space-y-2">
                  {productData.sizes.map((size: any) => (
                    <label key={size.name} className="flex items-center justify-between p-4 border-2 rounded-[12px] cursor-pointer hover:border-[#6CC049] transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="size"
                          value={size.name}
                          checked={selectedSize === size.name}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="w-5 h-5 text-[#6CC049]"
                        />
                        <div>
                          <div className="text-[16px] font-semibold text-black font-urbanist">{size.name}</div>
                          <div className="text-[14px] text-[#616161] font-urbanist">{size.description}</div>
                        </div>
                      </div>
                      <span className="text-[#6CC049] text-[18px] font-bold font-urbanist">
                        ₦{size.price.toLocaleString()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div className="space-y-3">
                <h3 className="text-[20px] font-semibold text-black font-urbanist">Add-ons</h3>
                <div className="space-y-2">
                  {productData.addons.map((addon: any) => (
                    <label key={addon.name} className="flex items-center justify-between p-4 border-2 rounded-[12px] cursor-pointer hover:border-[#6CC049] transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes(addon.name)}
                          onChange={() => toggleAddon(addon.name)}
                          className="w-5 h-5 text-[#6CC049]"
                        />
                        <span className="text-[16px] font-semibold text-black font-urbanist">{addon.name}</span>
                      </div>
                      <span className="text-[#6CC049] text-[18px] font-bold font-urbanist">
                        +₦{addon.price.toLocaleString()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-[18px] font-semibold text-black font-urbanist">Quantity:</span>
                  <div className="flex items-center gap-2 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg px-3 py-2">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-[#616161] hover:text-[#212121]"
                    >
                      -
                    </button>
                    <span className="text-[#212121] text-[16px] font-semibold font-urbanist px-2">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#616161] hover:text-[#212121]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-[#6CC049] text-white text-[20px] font-semibold font-urbanist py-4 px-8 rounded-[60px] hover:bg-[#5AA03A] transition-colors duration-200">
                    Add to Cart - ₦{(getCurrentPrice() * quantity).toLocaleString()}
                  </button>
                  <button className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center hover:bg-[#E0E0E0] transition-colors">
                    <Image src="/images/icon-heart.svg" alt="Favorite" width={24} height={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="px-[60px] py-8">
        <div className="max-w-[1320px] mx-auto">
          <div className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] p-8">
            <div className="flex gap-8">
              {/* Ingredients & Nutrition */}
              <div className="w-1/2 space-y-6">
                <h2 className="text-[24px] font-semibold text-black font-urbanist">Ingredients & Nutrition</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[18px] font-semibold text-black font-urbanist mb-3">Ingredients</h3>
                    <ul className="space-y-2">
                      {productData.ingredients.map((ingredient: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#6CC049] rounded-full"></div>
                          <span className="text-[#616161] text-[16px] font-urbanist">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-black font-urbanist mb-3">Nutrition Info</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#F5F5F5] rounded-lg p-3">
                        <div className="text-[#616161] text-[14px] font-urbanist">Calories</div>
                        <div className="text-[#212121] text-[18px] font-semibold font-urbanist">{productData.nutritionInfo.calories}</div>
                      </div>
                      <div className="bg-[#F5F5F5] rounded-lg p-3">
                        <div className="text-[#616161] text-[14px] font-urbanist">Protein</div>
                        <div className="text-[#212121] text-[18px] font-semibold font-urbanist">{productData.nutritionInfo.protein}</div>
                      </div>
                      <div className="bg-[#F5F5F5] rounded-lg p-3">
                        <div className="text-[#616161] text-[14px] font-urbanist">Carbs</div>
                        <div className="text-[#212121] text-[18px] font-semibold font-urbanist">{productData.nutritionInfo.carbs}</div>
                      </div>
                      <div className="bg-[#F5F5F5] rounded-lg p-3">
                        <div className="text-[#616161] text-[14px] font-urbanist">Fat</div>
                        <div className="text-[#212121] text-[18px] font-semibold font-urbanist">{productData.nutritionInfo.fat}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Allergens & Reviews */}
              <div className="w-1/2 space-y-6">
                <h2 className="text-[24px] font-semibold text-black font-urbanist">Allergens & Reviews</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[18px] font-semibold text-black font-urbanist mb-3">Allergens</h3>
                    <div className="space-y-2">
                      {productData.allergens.map((allergen: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#FF6B6B] rounded-full"></div>
                          <span className="text-[#616161] text-[16px] font-urbanist">{allergen}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-black font-urbanist mb-3">Customer Reviews</h3>
                    <div className="space-y-3">
                      {productData.reviews.slice(0, 3).map((review: any) => (
                        <div key={review.id} className="bg-[#F5F5F5] rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <Image src={review.avatar} alt={review.author} width={32} height={32} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="text-[14px] font-semibold text-black font-urbanist">{review.author}</div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Image key={i} src="/images/icon-star.svg" alt="Star" width={12} height={12} className={i < review.rating ? 'opacity-100' : 'opacity-30'} />
                                ))}
                                <span className="text-[12px] text-[#616161] font-urbanist ml-1">{review.timeAgo}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[14px] text-black font-urbanist">{review.comment}</p>
                        </div>
                      ))}
                      <button 
                        onClick={() => setShowReviews(!showReviews)}
                        className="text-[#6CC049] text-[16px] font-semibold font-urbanist hover:underline"
                      >
                        {showReviews ? 'Show Less' : `View All ${productData.reviewsCount} Reviews`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You Might Also Like Section */}
      <section className="px-[60px] py-8">
        <div className="max-w-[1320px] mx-auto">
          <h2 className="text-[30px] font-semibold text-black font-urbanist mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-4 gap-6">
            {productData.relatedProducts.map((product: any) => (
              <Link
                key={product.id}
                href={`/restaurants/vendor/${vendorId}/product/${product.id}`}
                className="bg-white rounded-[17.89px] shadow-[0px_0.75px_2.98px_0px_rgba(12,12,13,0.05),0px_0.75px_2.98px_0px_rgba(12,12,13,0.1)] overflow-hidden hover:scale-105 transition-transform duration-200"
              >
                <div className="relative w-full h-[200px]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-[16px] font-bold text-[#212121] font-urbanist leading-[1.2]">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6CC049] text-[18px] font-bold font-urbanist">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <Image src="/images/icon-star.svg" alt="Star" width={16} height={16} />
                      <span className="text-[#616161] text-[14px] font-urbanist">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/images/icon-clock.svg" alt="Time" width={16} height={16} />
                    <span className="text-[#616161] text-[12px] font-urbanist">{product.preparationTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-[60px] py-8">
        <div className="max-w-[1320px] mx-auto">
          <div className="bg-[#FAFAFA] rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.1)] p-[84px_60px]">
            <div className="flex gap-6">
              <div className="w-[588px] space-y-12">
                <h2 className="text-[#012168] text-[60px] font-bold font-urbanist leading-[1]">
                  FAQs
                </h2>
                <div className="space-y-6">
                  {productData.faqs.map((faq: any) => (
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
                      {productData.faqs.find((faq: any) => faq.id === selectedFaq)?.answer || 'Select a question to view the answer'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RestaurantProductClient;