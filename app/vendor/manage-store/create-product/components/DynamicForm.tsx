'use client';
import React from 'react';

interface DynamicFormProps {
  category: string;
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ category, formData, onInputChange }) => {
  // Events, Experiences, Tour Guide, Influencer forms
  const renderEventsForm = () => (
    <div className="space-y-6">
      {/* Event Name */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Event Name
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={formData.productName || ''}
            onChange={(e) => onInputChange('productName', e.target.value)}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
            placeholder="Enter event name"
          />
        </div>
      </div>

      {/* Sub-category */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Sub-category
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <select
            value={formData.subCategory || ''}
            onChange={(e) => onInputChange('subCategory', e.target.value)}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
          >
            <option value="">Select sub-category</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="meetup">Meetup</option>
            <option value="exhibition">Exhibition</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2.22 5.47L8 11.25L13.78 5.47" stroke="#616161" strokeWidth="0.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const event = new CustomEvent('openSubcategoryModal');
            window.dispatchEvent(event);
          }}
          className="mt-2 text-[#6CC049] text-[16px] font-bold font-urbanist hover:text-[#5AA83A] transition-colors duration-200 underline cursor-pointer"
        >
          Add a new sub-category
        </button>
      </div>

      {/* Event Date */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Event Date
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="date"
          value={formData.eventDate || ''}
          onChange={(e) => onInputChange('eventDate', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        />
      </div>

      {/* Event Time */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Event Time
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="time"
          value={formData.eventTime || ''}
          onChange={(e) => onInputChange('eventTime', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        />
      </div>

      {/* Event End Date */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Event End Date
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="date"
          value={formData.eventEndDate || ''}
          onChange={(e) => onInputChange('eventEndDate', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        />
      </div>

      {/* Event End Time */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Event End Time
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="time"
          value={formData.eventEndTime || ''}
          onChange={(e) => onInputChange('eventEndTime', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        />
      </div>

      {/* Venue */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Venue
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="text"
          value={formData.venue || ''}
          onChange={(e) => onInputChange('venue', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter venue name"
        />
      </div>

      {/* Max Attendees */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Max Attendees
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="number"
          value={formData.maxAttendees || ''}
          onChange={(e) => onInputChange('maxAttendees', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter maximum attendees"
        />
      </div>

      {/* Product Type */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Product Type
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <select
          value={formData.productType || 'GENERAL_PRODUCT'}
          onChange={(e) => onInputChange('productType', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
        >
          <option value="GENERAL_PRODUCT">General Product</option>
          <option value="RESTAURANT_SERVICE">Restaurant Service</option>
          <option value="FOOD_ITEM">Food Item</option>
          <option value="HOTEL">Hotel</option>
          <option value="APARTMENT">Apartment</option>
        </select>
      </div>

      {/* Event Type */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Event Type
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <select
          value={formData.eventType || 'PAID'}
          onChange={(e) => onInputChange('eventType', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
        >
          <option value="PAID">Paid Event</option>
          <option value="FREE">Free Event</option>
          <option value="ADULT">Adult Event</option>
          <option value="CHILD">Child Event</option>
          <option value="STANDARD_MEET_AND_GREET">Standard Meet and Greet</option>
          <option value="VIP_EXPERIENCE">VIP Experience</option>
        </select>
      </div>

      {/* Age Restriction */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Age Restriction
          </label>
        </div>
        <input
          type="text"
          value={formData.ageRestriction || ''}
          onChange={(e) => onInputChange('ageRestriction', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., 18+, 21+, All ages"
        />
      </div>

      {/* Dress Code */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Dress Code
          </label>
        </div>
        <input
          type="text"
          value={formData.dressCode || ''}
          onChange={(e) => onInputChange('dressCode', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., Formal, Casual, Black tie"
        />
      </div>
    </div>
  );

  // Hotels form
  const renderHotelsForm = () => (
    <div className="space-y-6">
      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Check-in Date
        </label>
        <input
          type="date"
          value={formData.checkInDate || ''}
          onChange={(e) => onInputChange('checkInDate', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        />
      </div>

      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Check-out Date
        </label>
        <input
          type="date"
          value={formData.checkOutDate || ''}
          onChange={(e) => onInputChange('checkOutDate', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        />
      </div>

      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Room Type
        </label>
        <select
          value={formData.roomType || ''}
          onChange={(e) => onInputChange('roomType', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        >
          <option value="">Select room type</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
          <option value="deluxe">Deluxe</option>
          <option value="presidential">Presidential</option>
        </select>
      </div>

      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Number of Guests
        </label>
        <input
          type="number"
          value={formData.guests || ''}
          onChange={(e) => onInputChange('guests', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter number of guests"
        />
      </div>

      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Amenities
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Parking', 'Room Service', 'Airport Shuttle'].map((amenity) => (
            <label key={amenity} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.amenities?.includes(amenity) || false}
                onChange={(e) => {
                  const currentAmenities = formData.amenities || [];
                  if (e.target.checked) {
                    onInputChange('amenities', [...currentAmenities, amenity]);
                  } else {
                    onInputChange('amenities', currentAmenities.filter((a: string) => a !== amenity));
                  }
                }}
                className="w-4 h-4 text-[#6CC049] border-gray-300 rounded focus:ring-[#6CC049]"
              />
              <span className="text-[14px] font-urbanist text-[#212121]">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // Accommodation form
  const renderAccommodationForm = () => (
    <div className="space-y-6">
      {/* Property Type */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Property Type
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <select
          value={formData.propertyType || ''}
          onChange={(e) => onInputChange('propertyType', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
        >
          <option value="">Select property type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
          <option value="studio">Studio</option>
          <option value="penthouse">Penthouse</option>
        </select>
      </div>

      {/* Sub-category */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Sub-category
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <select
            value={formData.subCategory || ''}
            onChange={(e) => onInputChange('subCategory', e.target.value)}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
          >
            <option value="">Select sub-category</option>
            <option value="luxury">Luxury</option>
            <option value="budget">Budget</option>
            <option value="business">Business</option>
            <option value="family">Family</option>
            <option value="vacation">Vacation</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2.22 5.47L8 11.25L13.78 5.47" stroke="#616161" strokeWidth="0.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const event = new CustomEvent('openSubcategoryModal');
            window.dispatchEvent(event);
          }}
          className="mt-2 text-[#6CC049] text-[16px] font-bold font-urbanist hover:text-[#5AA83A] transition-colors duration-200 underline cursor-pointer"
        >
          Add a new sub-category
        </button>
      </div>

      {/* Listing Type */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Listing Type
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <select
          value={formData.listingType || ''}
          onChange={(e) => onInputChange('listingType', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
        >
          <option value="">Select listing type</option>
          <option value="rental">Rental</option>
          <option value="sale">Sale</option>
          <option value="short-term">Short-term</option>
          <option value="long-term">Long-term</option>
        </select>
      </div>

      {/* Property Name */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Property Name
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="text"
          value={formData.propertyName || ''}
          onChange={(e) => onInputChange('propertyName', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter property name"
        />
      </div>

      {/* Daily Rate */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Daily Rate
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="number"
          step="0.01"
          value={formData.dailyRate || ''}
          onChange={(e) => onInputChange('dailyRate', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter daily rate"
        />
      </div>

      {/* Max Guests */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Max Guests
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="number"
          value={formData.maxGuests || ''}
          onChange={(e) => onInputChange('maxGuests', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter maximum guests"
        />
      </div>

      {/* Bedrooms */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Bedrooms
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="number"
          value={formData.bedrooms || ''}
          onChange={(e) => onInputChange('bedrooms', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter number of bedrooms"
        />
      </div>

      {/* Bathrooms */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Bathrooms
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="number"
          value={formData.bathrooms || ''}
          onChange={(e) => onInputChange('bathrooms', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter number of bathrooms"
        />
      </div>

      {/* Total Area */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Total Area
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="text"
          value={formData.totalArea || ''}
          onChange={(e) => onInputChange('totalArea', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., 1200 sq ft"
        />
      </div>

      {/* Furnishing Status */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Furnishing Status
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <select
          value={formData.furnishingStatus || ''}
          onChange={(e) => onInputChange('furnishingStatus', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
        >
          <option value="">Select furnishing status</option>
          <option value="furnished">Furnished</option>
          <option value="semi-furnished">Semi-furnished</option>
          <option value="unfurnished">Unfurnished</option>
        </select>
      </div>

      {/* Amenities */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Amenities
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <select
          value={formData.amenities || 'WIFI'}
          onChange={(e) => onInputChange('amenities', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
        >
          <option value="WIFI">WiFi</option>
          <option value="KITCHEN">Kitchen</option>
          <option value="BALCONY">Balcony</option>
        </select>
      </div>

      {/* Floor Number */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Floor Number
          </label>
        </div>
        <input
          type="text"
          value={formData.floorNumber || ''}
          onChange={(e) => onInputChange('floorNumber', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., 5th floor"
        />
      </div>

      {/* Parking Spaces */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Parking Spaces
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="number"
          value={formData.parkingSpaces || ''}
          onChange={(e) => onInputChange('parkingSpaces', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter number of parking spaces"
        />
      </div>

      {/* Check-in Time */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Check-in Time
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="text"
          value={formData.checkInTime || ''}
          onChange={(e) => onInputChange('checkInTime', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., 3:00 PM"
        />
      </div>

      {/* Check-out Time */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Check-out Time
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="text"
          value={formData.checkOutTime || ''}
          onChange={(e) => onInputChange('checkOutTime', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., 11:00 AM"
        />
      </div>

      {/* House Rules */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            House Rules
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <select
          value={formData.houseRules || 'NO_SMOKING'}
          onChange={(e) => onInputChange('houseRules', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
        >
          <option value="NO_SMOKING">No Smoking</option>
          <option value="NO_PARTIES">No Parties</option>
        </select>
      </div>

      {/* Cancellation Policy */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Cancellation Policy
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="text"
          value={formData.cancellationPolicy || ''}
          onChange={(e) => onInputChange('cancellationPolicy', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter cancellation policy"
        />
      </div>
    </div>
  );

  // Reservation form
  const renderReservationForm = () => (
    <div className="space-y-6">
      {/* Product Name */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Product Name
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="text"
          value={formData.productName || ''}
          onChange={(e) => onInputChange('productName', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter product name"
        />
      </div>

      {/* Sub-category */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Sub-category
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <select
            value={formData.subCategory || ''}
            onChange={(e) => onInputChange('subCategory', e.target.value)}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
          >
            <option value="">Select sub-category</option>
            <option value="fine-dining">Fine Dining</option>
            <option value="casual">Casual</option>
            <option value="fast-food">Fast Food</option>
            <option value="cafe">Cafe</option>
            <option value="bar">Bar</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2.22 5.47L8 11.25L13.78 5.47" stroke="#616161" strokeWidth="0.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const event = new CustomEvent('openSubcategoryModal');
            window.dispatchEvent(event);
          }}
          className="mt-2 text-[#6CC049] text-[16px] font-bold font-urbanist hover:text-[#5AA83A] transition-colors duration-200 underline cursor-pointer"
        >
          Add a new sub-category
        </button>
      </div>

      {/* Product Type */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Product Type
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="text"
          value={formData.productType || ''}
          onChange={(e) => onInputChange('productType', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter product type"
        />
      </div>

      {/* Service Type */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Service Type
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="text"
          value={formData.serviceType || ''}
          onChange={(e) => onInputChange('serviceType', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter service type"
        />
      </div>

      {/* Cuisine Type */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Cuisine Type
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <select
          value={formData.cuisineType || 'CONTINENTAL'}
          onChange={(e) => onInputChange('cuisineType', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
        >
          <option value="CONTINENTAL">Continental</option>
          <option value="NIGERIAN">Nigerian</option>
        </select>
      </div>

      {/* Operating Hours */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Operating Hours
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="number"
          value={formData.operatingHours || ''}
          onChange={(e) => onInputChange('operatingHours', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter operating hours (e.g., 12)"
        />
      </div>

      {/* Table Capacity */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Table Capacity
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="number"
          value={formData.tableCapacity || ''}
          onChange={(e) => onInputChange('tableCapacity', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter table capacity"
        />
      </div>

      {/* Reservation Fee */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Reservation Fee
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="number"
          step="0.01"
          value={formData.reservationFee || ''}
          onChange={(e) => onInputChange('reservationFee', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter reservation fee"
        />
      </div>

      {/* Reservation Duration */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Reservation Duration (hours)
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="number"
          value={formData.reservationDuration || ''}
          onChange={(e) => onInputChange('reservationDuration', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter reservation duration in hours"
        />
      </div>

      {/* Accepts Walk-ins */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Accepts Walk-ins
          </label>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="acceptsWalkIns"
              checked={formData.acceptsWalkIns === true}
              onChange={() => onInputChange('acceptsWalkIns', true)}
              className="w-4 h-4 text-[#6CC049] bg-gray-100 border-gray-300 focus:ring-[#6CC049] focus:ring-2"
            />
            <span className="text-[14px] sm:text-[16px] font-urbanist text-[#212121]">Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="acceptsWalkIns"
              checked={formData.acceptsWalkIns === false}
              onChange={() => onInputChange('acceptsWalkIns', false)}
              className="w-4 h-4 text-[#6CC049] bg-gray-100 border-gray-300 focus:ring-[#6CC049] focus:ring-2"
            />
            <span className="text-[14px] sm:text-[16px] font-urbanist text-[#212121]">No</span>
          </label>
        </div>
      </div>

      {/* Dress Code */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Dress Code
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="text"
          value={formData.dressCode || ''}
          onChange={(e) => onInputChange('dressCode', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., Formal, Casual, Smart Casual"
        />
      </div>

      {/* Special Features */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Special Features
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <select
          value={formData.specialFeatures || 'LIVE_BAND'}
          onChange={(e) => onInputChange('specialFeatures', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
        >
          <option value="LIVE_BAND">Live Band</option>
          <option value="OUTDOOR_SEATING">Outdoor Seating</option>
        </select>
      </div>
    </div>
  );

  // Cars form
  const renderCarsForm = () => (
    <div className="space-y-6">
      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Vehicle Type
        </label>
        <select
          value={formData.vehicleType || ''}
          onChange={(e) => onInputChange('vehicleType', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        >
          <option value="">Select vehicle type</option>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="hatchback">Hatchback</option>
          <option value="coupe">Coupe</option>
          <option value="convertible">Convertible</option>
          <option value="truck">Truck</option>
          <option value="van">Van</option>
        </select>
      </div>

      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Brand
        </label>
        <input
          type="text"
          value={formData.brand || ''}
          onChange={(e) => onInputChange('brand', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter vehicle brand"
        />
      </div>

      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Model
        </label>
        <input
          type="text"
          value={formData.model || ''}
          onChange={(e) => onInputChange('model', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter vehicle model"
        />
      </div>

      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Year
        </label>
        <input
          type="number"
          value={formData.year || ''}
          onChange={(e) => onInputChange('year', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter year"
        />
      </div>

      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Mileage
        </label>
        <input
          type="number"
          value={formData.mileage || ''}
          onChange={(e) => onInputChange('mileage', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter mileage"
        />
      </div>

      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Transmission
        </label>
        <select
          value={formData.transmission || ''}
          onChange={(e) => onInputChange('transmission', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        >
          <option value="">Select transmission</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
          <option value="semi-automatic">Semi-automatic</option>
        </select>
      </div>
    </div>
  );

  // Fashion form
  const renderFashionForm = () => (
    <div className="space-y-6">
      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Item Type
        </label>
        <select
          value={formData.itemType || ''}
          onChange={(e) => onInputChange('itemType', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        >
          <option value="">Select item type</option>
          <option value="clothing">Clothing</option>
          <option value="shoes">Shoes</option>
          <option value="accessories">Accessories</option>
          <option value="jewelry">Jewelry</option>
          <option value="bags">Bags</option>
          <option value="watches">Watches</option>
        </select>
      </div>

      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Size
        </label>
        <input
          type="text"
          value={formData.size || ''}
          onChange={(e) => onInputChange('size', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter size (e.g., M, L, XL, 42, etc.)"
        />
      </div>

      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Color
        </label>
        <input
          type="text"
          value={formData.color || ''}
          onChange={(e) => onInputChange('color', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter color"
        />
      </div>

      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Brand
        </label>
        <input
          type="text"
          value={formData.brand || ''}
          onChange={(e) => onInputChange('brand', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter brand name"
        />
      </div>

      <div className="w-[450px]">
        <label className="block text-[14px] font-medium text-[#212121] font-urbanist mb-2">
          Condition
        </label>
        <select
          value={formData.condition || ''}
          onChange={(e) => onInputChange('condition', e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        >
          <option value="">Select condition</option>
          <option value="new">New</option>
          <option value="like-new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>
    </div>
  );

  // Create Product form for food, supermarket, pharmacy, restaurant, others
  const renderCreateProductForm = () => (
    <div className="space-y-6">
      {/* Product Name */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Product Name
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={formData.productName || ''}
            onChange={(e) => onInputChange('productName', e.target.value)}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
            placeholder="Enter product name"
          />
        </div>
      </div>

      {/* Sub-category */}
      <div className="w-full max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Sub-category
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <select
            value={formData.subCategory || ''}
            onChange={(e) => onInputChange('subCategory', e.target.value)}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
          >
            <option value="">Select sub-category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Garden</option>
            <option value="sports">Sports</option>
            <option value="books">Books</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2.22 5.47L8 11.25L13.78 5.47" stroke="#616161" strokeWidth="0.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const event = new CustomEvent('openSubcategoryModal');
            window.dispatchEvent(event);
          }}
          className="mt-2 text-[#6CC049] text-[16px] font-bold font-urbanist hover:text-[#5AA83A] transition-colors duration-200 underline cursor-pointer"
        >
          Add a new sub-category
        </button>
      </div>
    </div>
  );

  // Render appropriate form based on category
  const renderForm = () => {
    switch (category) {
      case 'events':
      case 'experiences':
      case 'tour_guide':
      case 'influencer':
        return renderEventsForm();
      case 'hotels':
        return renderHotelsForm();
      case 'apartment':
        return renderAccommodationForm();
      case 'club':
        return renderReservationForm();
      case 'cars':
        return renderCarsForm();
      case 'fashion':
        return renderFashionForm();
      case 'food':
      case 'supermarket':
      case 'pharmacy':
      case 'restaurant':
      case 'others':
        return renderCreateProductForm();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderForm()}
    </div>
  );
};

export default DynamicForm;