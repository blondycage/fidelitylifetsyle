'use client';
import React, { useState,useEffect } from 'react';
import ArrayInput from './ArrayInput';
import { SimpleAddressInput } from './SimpleAddressInput';
import { SubcategoryItem } from '@/services/subcategoryService';

interface DynamicFormProps {
  businessType: string;
  formData: any;
  onInputChange: (field: string, value: any) => void;
  onNext: () => void;
  subcategories?: SubcategoryItem[];
  subcategoriesLoading?: boolean;
  isSubmitting?: boolean;
  hideButton?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ businessType, formData, onInputChange, onNext, subcategories = [], subcategoriesLoading = false, isSubmitting = false, hideButton = false }) => {

  // Validation function to check if required fields are filled
  const isFormValid = () => {
    // Always require product name (or property name for accommodation)
    const hasProductName = businessType === 'HOSPITALITY' || businessType === 'APARTMENT' 
      ? formData.propertyName?.trim() 
      : formData.productName?.trim();
    
    if (!hasProductName) {
      return false;
    }
    
    // Check if availability dates are required and filled
    const hasAvailabilityDates = formData.availableStartDate && formData.availableEndDate;
    
    // For business types that require availability dates, check if they exist
    const requiresAvailabilityDates = ['HOSPITALITY', 'APARTMENT', 'HOTEL', 'HOTELS', 'CLUB', 'RESERVATIONS'];
    
    if (requiresAvailabilityDates.includes(businessType)) {
      if (!hasAvailabilityDates) {
        return false;
      }
    }
    
    return true;
  };

  const isNextDisabled = !isFormValid() || isSubmitting;






  // Effect to set price to 0 for free events
  useEffect(() => {
    if (formData.eventType === 'FREE' && formData.price !== '0') {
      onInputChange('price', '0');
    }
  }, [formData.eventType, formData.price, onInputChange]);


  // Events, Experiences, Tour Guide, Influencer forms
  const renderEventsForm = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Event Name */}
      <div className="w-full max-w-full sm:max-w-[450px]">
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

      {/* Description */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Description
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <textarea
            value={formData.description || ''}
            onChange={(e) => onInputChange('description', e.target.value)}
            className="w-full h-24 px-4 py-3 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] resize-none"
            placeholder="Enter event description"
            rows={3}
          />
        </div>
      </div>


      {/* Sub-category */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Sub-category
          </label>
        </div>
        <div className="relative">
          <select
            value={formData.subCategory || formData.subcategoryId || ''}
            onChange={(e) => {
              const selectedSubcategory = subcategories?.find(sub => sub.subcategoryId.toString() === e.target.value);
              onInputChange('subCategory', e.target.value);
              onInputChange('subcategoryName', selectedSubcategory?.subcategoryName || '');
              onInputChange('subcategoryId', selectedSubcategory?.subcategoryId || null);
            }}
            disabled={subcategoriesLoading}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none disabled:opacity-50"
          >
            <option value="">
              {subcategoriesLoading ? 'Loading subcategories...' : 'Select sub-category'}
            </option>
            {subcategories?.map((subcategory) => (
              <option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
                {subcategory.subcategoryName}
              </option>
            ))}
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Event Date
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <input
            type="date"
            value={formData.eventDate || ''}
            onChange={(e) => onInputChange('eventDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] [color-scheme:light]"
            style={{ colorScheme: 'light' }}
          />
        </div>
      </div>

      {/* Event Time */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Event Time
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <input
            type="time"
            value={formData.eventTime || ''}
            onChange={(e) => onInputChange('eventTime', e.target.value)}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] [color-scheme:light]"
            style={{ colorScheme: 'light' }}
            step="1"
          />
        </div>
       
      </div>

      {/* Event End Date */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Event End Date
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <input
            type="date"
            value={formData.eventEndDate || ''}
            onChange={(e) => onInputChange('eventEndDate', e.target.value)}
            min={formData.eventDate || new Date().toISOString().split('T')[0]}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] [color-scheme:light]"
            style={{ colorScheme: 'light' }}
          />
        </div>
      </div>

      {/* Event End Time */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Event End Time
          </label>
        </div>
        <div className="relative">
          <input
            type="time"
            value={formData.eventEndTime || ''}
            onChange={(e) => onInputChange('eventEndTime', e.target.value)}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] [color-scheme:light]"
            style={{ colorScheme: 'light' }}
            step="1"
          />
        </div>
       
      </div>

      {/* Venue - Only show if address is not filled */}
      {!formData.address && (
        <SimpleAddressInput
          value={formData.venue || ''}
          onChange={(value) => onInputChange('venue', value)}
          placeholder="Enter venue name"
          label="Venue"
          required={false}
        />
      )}

      {/* Max Attendees */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Max Attendees
          </label>
        </div>
        <input
          type="number"
          min="1"
          max="2147483647"
          value={formData.maxAttendees || ''}
          onChange={(e) => onInputChange('maxAttendees', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter maximum attendees"
        />
        
      </div>

      {/* Product Type */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Product Type
          </label>
        </div>
        <div className="relative">
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
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2.22 5.47L8 11.25L13.78 5.47" stroke="#616161" strokeWidth="0.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Event Type */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Event Type
          </label>
        </div>
        <div className="relative">
          <select
            value={formData.eventType || 'PAID'}
            onChange={(e) => onInputChange('eventType', e.target.value)}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
          >
            <option value="PAID">Paid Event</option>
            <option value="FREE">Free Event</option>
          
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2.22 5.47L8 11.25L13.78 5.47" stroke="#616161" strokeWidth="0.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Age Restriction */}
      <div className="w-full max-w-full sm:max-w-[450px]">
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
      <div className="w-full max-w-full sm:max-w-[450px]">
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

      {/* Price */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Price
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            value={formData.eventType === 'FREE' ? '0' : (formData.price || '')}
            onChange={(e) => onInputChange('price', e.target.value)}
            disabled={formData.eventType === 'FREE'}
            className={`w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] ${formData.eventType === 'FREE' ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={formData.eventType === 'FREE' ? 'Free event - Price set to 0' : 'Enter event price'}
          />
          {formData.eventType === 'FREE' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6CC049]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L10.5 5.5L15.5 6L12 9.5L13 14.5L8 12L3 14.5L4 9.5L0.5 6L5.5 5.5L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
        {formData.eventType === 'FREE' && (
          <div className="mt-2 text-[12px] text-[#6CC049] font-urbanist">
            Free event - Price automatically set to 0
          </div>
        )}
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

  // Hotel form
  const renderHotelForm = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Hotel Name */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Hotel Name
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={formData.productName || ''}
            onChange={(e) => onInputChange('productName', e.target.value)}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
            placeholder="Enter hotel name"
          />
        </div>
      </div>

      {/* Sub-category */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Sub-category
          </label>
        </div>
        <div className="relative">
          <select
            value={formData.subCategory || formData.subcategoryId || ''}
            onChange={(e) => {
              const selectedSubcategory = subcategories?.find(sub => sub.subcategoryId.toString() === e.target.value);
              onInputChange('subCategory', e.target.value);
              onInputChange('subcategoryName', selectedSubcategory?.subcategoryName || '');
              onInputChange('subcategoryId', selectedSubcategory?.subcategoryId || null);
            }}
            disabled={subcategoriesLoading}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none disabled:opacity-50"
          >
            <option value="">
              {subcategoriesLoading ? 'Loading subcategories...' : 'Select sub-category'}
            </option>
            {subcategories?.map((subcategory) => (
              <option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
                {subcategory.subcategoryName}
              </option>
            ))}
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

      {/* Description */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Description
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <textarea
            value={formData.description || ''}
            onChange={(e) => onInputChange('description', e.target.value)}
            className="w-full h-24 px-4 py-3 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] resize-none"
            placeholder="Enter hotel description"
            rows={3}
          />
        </div>
      </div>

      {/* Address */}
      <SimpleAddressInput
        value={formData.address || ''}
        onChange={(value) => onInputChange('address', value)}
        placeholder="Enter hotel address"
        label="Address"
        required={true}
      />


      {/* Check-in Time */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Check-in Time
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            value={formData.checkInTime || ''}
            onChange={(e) => onInputChange('checkInTime', e.target.value)}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
            placeholder="e.g., 2:00 PM"
          />
        </div>
      </div>

      {/* Check-out Time */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Check-out Time
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            value={formData.checkOutTime || ''}
            onChange={(e) => onInputChange('checkOutTime', e.target.value)}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
            placeholder="e.g., 11:00 AM"
          />
        </div>
      </div>

      {/* Property Amenities */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Property Amenities
          </label>
        </div>
        <ArrayInput
          label="Property Amenities"
          value={Array.isArray(formData.propertyAmenities) ? formData.propertyAmenities : []}
          onChange={(value) => onInputChange('propertyAmenities', value)}
          placeholder="Add amenity (e.g., WiFi, Pool, Gym)"
        />
      </div>

      {/* Available Start Date */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Available Start Date
          </label>
        </div>
        <div className="relative">
          <input
            type="date"
            value={formData.availableStartDate || ''}
            onChange={(e) => onInputChange('availableStartDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          />
        </div>
      </div>

      {/* Available End Date */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Available End Date
          </label>
        </div>
        <div className="relative">
          <input
            type="date"
            value={formData.availableEndDate || ''}
            onChange={(e) => onInputChange('availableEndDate', e.target.value)}
            min={formData.availableStartDate || new Date().toISOString().split('T')[0]}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          />
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Cancellation Policy
          </label>
        </div>
        <div className="relative">
          <textarea
            value={formData.cancellationPolicy || ''}
            onChange={(e) => onInputChange('cancellationPolicy', e.target.value)}
            className="w-full h-24 px-4 py-3 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] resize-none"
            placeholder="Enter cancellation policy"
            rows={3}
          />
        </div>
      </div>

      {/* Next Button */}
      {!hideButton && (
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled}
            className={`px-6 py-3 rounded-lg text-[14px] font-urbanist transition-colors ${
              isNextDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#6CC049] text-white hover:bg-[#5AAE3A]'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );

  // Accommodation form
  const renderAccommodationForm = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Property Type */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Property Type
          </label>
        </div>
        <input
          type="text"
          value={formData.propertyType || ''}
          onChange={(e) => onInputChange('propertyType', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., Duplex, Apartment, House, Villa"
        />
      </div>

      {/* Sub-category */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Sub-category
          </label>
        </div>
        <div className="relative">
          <select
            value={formData.subCategory || formData.subcategoryId || ''}
            onChange={(e) => {
              const selectedSubcategory = subcategories?.find(sub => sub.subcategoryId.toString() === e.target.value);
              onInputChange('subCategory', e.target.value);
              onInputChange('subcategoryName', selectedSubcategory?.subcategoryName || '');
              onInputChange('subcategoryId', selectedSubcategory?.subcategoryId || null);
            }}
            disabled={subcategoriesLoading}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none disabled:opacity-50"
          >
            <option value="">
              {subcategoriesLoading ? 'Loading subcategories...' : 'Select sub-category'}
            </option>
            {subcategories?.map((subcategory) => (
              <option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
                {subcategory.subcategoryName}
              </option>
            ))}
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Listing Type
          </label>
        </div>
        <select
          value={formData.listingType || ''}
          onChange={(e) => onInputChange('listingType', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
        >
          <option value="">Select listing type</option>
          <option value="Affordable">Affordable</option>
          <option value="Luxury">Luxury</option>
          <option value="Budget">Budget</option>
          <option value="Premium">Premium</option>
          <option value="Standard">Standard</option>
        </select>
      </div>

      {/* Property Name */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Property Name
          </label>
        </div>
        <input
          type="text"
          value={formData.propertyName || ''}
          onChange={(e) => onInputChange('propertyName', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter property name"
        />
      </div>

      {/* Description */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Description
          </label>
        </div>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onInputChange('description', e.target.value)}
          className="w-full h-24 px-4 py-3 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] resize-none"
          placeholder="Enter property description"
        />
      </div>

      {/* Address */}
      <SimpleAddressInput
        value={formData.address || ''}
        onChange={(value) => onInputChange('address', value)}
        placeholder="Enter property address"
        label="Address"
        required={false}
      />

      {/* Daily Rate */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Daily Rate
          </label>
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Max Guests
          </label>
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Bedrooms
          </label>
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Bathrooms
          </label>
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Total Area
          </label>
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Furnishing Status
          </label>
        </div>
        <input
          type="text"
          value={formData.furnishingStatus || ''}
          onChange={(e) => onInputChange('furnishingStatus', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., well furnished, semi-furnished"
        />
      </div>

      {/* Amenities */}
      <ArrayInput
        label="Amenities"
        value={Array.isArray(formData.amenities) ? formData.amenities : []}
        onChange={(value) => onInputChange('amenities', value)}
        placeholder="e.g., swimming, wifi, kitchen, balcony"
        helpText="Press Enter to add each amenity"
      />

      {/* Floor Number */}
      <div className="w-full max-w-full sm:max-w-[450px]">
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Parking Spaces
          </label>
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Check-in Time
          </label>
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Check-out Time
          </label>
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
      <ArrayInput
        label="House Rules"
        value={Array.isArray(formData.houseRules) ? formData.houseRules : []}
        onChange={(value) => onInputChange('houseRules', value)}
        placeholder="e.g., No smoking, No parties, No pets"
        helpText="Press Enter to add each rule"
      />

      {/* Cancellation Policy */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Cancellation Policy
          </label>
        </div>
        <input
          type="text"
          value={formData.cancellationPolicy || ''}
          onChange={(e) => onInputChange('cancellationPolicy', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter cancellation policy"
        />
      </div>

      {/* Available Start Date */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Available Start Date
          </label>
        </div>
        <input
          type="date"
          value={formData.availableStartDate || ''}
          onChange={(e) => onInputChange('availableStartDate', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        />
      </div>

      {/* Available End Date */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Available End Date
          </label>
        </div>
        <input
          type="date"
          value={formData.availableEndDate || ''}
          onChange={(e) => onInputChange('availableEndDate', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        />
      </div>
    </div>
  );

  // Reservation form
  const renderReservationForm = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Product Name */}
      <div className="w-full max-w-full sm:max-w-[450px]">
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Sub-category
          </label>
        </div>
        <div className="relative">
          <select
            value={formData.subCategory || formData.subcategoryId || ''}
            onChange={(e) => {
              const selectedSubcategory = subcategories?.find(sub => sub.subcategoryId.toString() === e.target.value);
              onInputChange('subCategory', e.target.value);
              onInputChange('subcategoryName', selectedSubcategory?.subcategoryName || '');
              onInputChange('subcategoryId', selectedSubcategory?.subcategoryId || null);
            }}
            disabled={subcategoriesLoading}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none disabled:opacity-50"
          >
            <option value="">
              {subcategoriesLoading ? 'Loading subcategories...' : 'Select sub-category'}
            </option>
            {subcategories?.map((subcategory) => (
              <option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
                {subcategory.subcategoryName}
              </option>
            ))}
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

      {/* Description */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Description
          </label>
        </div>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onInputChange('description', e.target.value)}
          className="w-full h-24 px-4 py-3 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] resize-none"
          placeholder="Enter description"
        />
      </div>

      {/* Address */}
      <SimpleAddressInput
        value={formData.address || ''}
        onChange={(value) => onInputChange('address', value)}
        placeholder="Enter address"
        label="Address"
        required={false}
      />

      {/* Product Type */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Product Type
          </label>
        </div>
        <div className="relative">
          <select
            value={formData.productType || ''}
            onChange={(e) => onInputChange('productType', e.target.value)}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
          >
            <option value="">Select product type</option>
            <option value="RESTAURANT_SERVICE">Restaurant Service</option>
            <option value="FOOD_ITEM">Food Item</option>
            <option value="GENERAL_PRODUCT">General Product</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2.22 5.47L8 11.25L13.78 5.47" stroke="#616161" strokeWidth="0.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Service Type */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Service Type
          </label>
        </div>
        <input
          type="text"
          value={formData.serviceType || ''}
          onChange={(e) => onInputChange('serviceType', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., Dine In, Takeaway, Delivery, Catering"
        />
      </div>

      {/* Cuisine Type */}
      <ArrayInput
        label="Cuisine Type"
        value={Array.isArray(formData.cuisineType) ? formData.cuisineType : []}
        onChange={(value) => onInputChange('cuisineType', value)}
        placeholder="e.g., Continental, Italian, Chinese, Indian"
        helpText="Press Enter to add each cuisine type"
      />

      {/* Operating Hours */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Operating Hours
          </label>
        </div>
        <input
          type="text"
          value={formData.operatingHours || ''}
          onChange={(e) => onInputChange('operatingHours', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter operating hours (e.g., 9 AM - 5 PM)"
        />
      </div>

      {/* Table Capacity */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Table Capacity
          </label>
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Reservation Fee
          </label>
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Reservation Duration (minutes)
          </label>
        </div>
        <input
          type="number"
          value={formData.reservationDuration || ''}
          onChange={(e) => onInputChange('reservationDuration', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., 120"
        />
      </div>

      {/* Accepts Walk-ins */}
      <div className="w-full max-w-full sm:max-w-[450px]">
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
      <div className="w-full max-w-full sm:max-w-[450px]">
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
          placeholder="e.g., Formal, Casual, Smart Casual"
        />
      </div>

      {/* Special Features */}
      <ArrayInput
        label="Special Features"
        value={Array.isArray(formData.specialFeatures) ? formData.specialFeatures : []}
        onChange={(value) => onInputChange('specialFeatures', value)}
        placeholder="e.g., Live Band, DJ, Karaoke, Dance Floor"
        helpText="Press Enter to add each feature"
      />

      {/* Available Start Date */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Available Start Date
          </label>
        </div>
        <input
          type="date"
          value={formData.availableStartDate || ''}
          onChange={(e) => onInputChange('availableStartDate', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        />
      </div>

      {/* Available End Date */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Available End Date
          </label>
        </div>
        <input
          type="date"
          value={formData.availableEndDate || ''}
          onChange={(e) => onInputChange('availableEndDate', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
        />
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
    <div className="space-y-4 sm:space-y-6">
      {/* Product Name */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Product Name
          </label>
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Sub-category
          </label>
        </div>
        <div className="relative">
          <select
            value={formData.subCategory || formData.subcategoryId || ''}
            onChange={(e) => {
              const selectedSubcategory = subcategories?.find(sub => sub.subcategoryId.toString() === e.target.value);
              onInputChange('subCategory', e.target.value);
              onInputChange('subcategoryName', selectedSubcategory?.subcategoryName || '');
              onInputChange('subcategoryId', selectedSubcategory?.subcategoryId || null);
            }}
            disabled={subcategoriesLoading}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none disabled:opacity-50"
          >
            <option value="">
              {subcategoriesLoading ? 'Loading subcategories...' : 'Select sub-category'}
            </option>
            {subcategories?.map((subcategory) => (
              <option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
                {subcategory.subcategoryName}
              </option>
            ))}
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

  // Food form
  const renderFoodForm = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Food Name */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Food Name
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="text"
          value={formData.productName || ''}
          onChange={(e) => onInputChange('productName', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter food name"
        />
      </div>

      {/* Description */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Description
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onInputChange('description', e.target.value)}
          className="w-full h-24 px-4 py-3 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] resize-none"
          placeholder="Enter food description"
          rows={3}
        />
      </div>

      {/* Address */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Address
          </label>
        </div>
        <SimpleAddressInput
          value={formData.address || ''}
          onChange={(address, lat, lng) => {
            onInputChange('address', address);
            onInputChange('addressLatitude', lat);
            onInputChange('addressLongitude', lng);
          }}
          placeholder="Enter restaurant address"
        />
      </div>

      {/* Sub-category */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Sub-category
          </label>
        </div>
        <div className="relative">
          <select
            value={formData.subCategory || formData.subcategoryId || ''}
            onChange={(e) => {
              const selectedSubcategory = subcategories?.find(sub => sub.subcategoryId.toString() === e.target.value);
              onInputChange('subCategory', e.target.value);
              onInputChange('subcategoryName', selectedSubcategory?.subcategoryName || '');
              onInputChange('subcategoryId', selectedSubcategory?.subcategoryId || null);
            }}
            disabled={subcategoriesLoading}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none disabled:opacity-50"
          >
            <option value="">
              {subcategoriesLoading ? 'Loading subcategories...' : 'Select sub-category'}
            </option>
            {subcategories?.map((subcategory) => (
              <option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
                {subcategory.subcategoryName}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('openSubcategoryModal'))}
          className="mt-2 text-[#6CC049] text-[12px] font-urbanist hover:underline"
        >
          + Add new sub-category
        </button>
      </div>

      {/* Price */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Price
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="number"
          step="0.01"
          value={formData.price || ''}
          onChange={(e) => onInputChange('price', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter price"
        />
      </div>

      {/* Stock Quantity */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Stock Quantity
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="number"
          value={formData.stockQuantity || ''}
          onChange={(e) => onInputChange('stockQuantity', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter stock quantity"
        />
      </div>

      {/* Food Category */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Food Category
          </label>
        </div>
        <input
          type="text"
          value={formData.foodCategory || ''}
          onChange={(e) => onInputChange('foodCategory', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., Main Course, Appetizer, Dessert"
        />
      </div>

      {/* Dietary Info */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Dietary Information
          </label>
        </div>
        <ArrayInput
          values={formData.dietaryInfo || []}
          onChange={(values) => onInputChange('dietaryInfo', values)}
          placeholder="e.g., Vegetarian, Vegan, Gluten-Free"
        />
      </div>

      {/* Spice Level */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Spice Level
          </label>
        </div>
        <select
          value={formData.spiceLevel || ''}
          onChange={(e) => onInputChange('spiceLevel', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
        >
          <option value="">Select spice level</option>
          <option value="Mild">Mild</option>
          <option value="Medium">Medium</option>
          <option value="Hot">Hot</option>
          <option value="Very Hot">Very Hot</option>
        </select>
      </div>

      {/* Ingredients */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Ingredients
          </label>
        </div>
        <ArrayInput
          values={formData.ingredients || []}
          onChange={(values) => onInputChange('ingredients', values)}
          placeholder="e.g., Chicken, Rice, Vegetables"
        />
      </div>

      {/* Allergens */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Allergens
          </label>
        </div>
        <ArrayInput
          values={formData.allergens || []}
          onChange={(values) => onInputChange('allergens', values)}
          placeholder="e.g., Nuts, Dairy, Shellfish"
        />
      </div>

      {/* Preparation Time */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Preparation Time (minutes)
          </label>
        </div>
        <input
          type="number"
          value={formData.preparationTime || ''}
          onChange={(e) => onInputChange('preparationTime', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter preparation time in minutes"
        />
      </div>

      {/* Serving Size */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Serving Size
          </label>
        </div>
        <input
          type="text"
          value={formData.servingSize || ''}
          onChange={(e) => onInputChange('servingSize', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., 1 plate, 2 pieces, 500g"
        />
      </div>

      {/* Delivery Options */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Delivery Options
          </label>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.availableForDelivery || false}
              onChange={(e) => onInputChange('availableForDelivery', e.target.checked)}
              className="w-4 h-4 text-[#6CC049] bg-gray-100 border-gray-300 rounded focus:ring-[#6CC049] focus:ring-2"
            />
            <span className="text-[14px] font-urbanist text-[#212121]">Available for Delivery</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.availableForPickup || false}
              onChange={(e) => onInputChange('availableForPickup', e.target.checked)}
              className="w-4 h-4 text-[#6CC049] bg-gray-100 border-gray-300 rounded focus:ring-[#6CC049] focus:ring-2"
            />
            <span className="text-[14px] font-urbanist text-[#212121]">Available for Pickup</span>
          </label>
        </div>
      </div>

      {/* Delivery Fee */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Delivery Fee
          </label>
        </div>
        <input
          type="number"
          step="0.01"
          value={formData.deliveryFee || ''}
          onChange={(e) => onInputChange('deliveryFee', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter delivery fee"
        />
      </div>

      {/* Minimum Order for Delivery */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Minimum Order for Delivery
          </label>
        </div>
        <input
          type="number"
          step="0.01"
          value={formData.minimumOrderForDelivery || ''}
          onChange={(e) => onInputChange('minimumOrderForDelivery', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter minimum order amount"
        />
      </div>

      {/* Operating Hours */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Operating Hours (hours per day)
          </label>
        </div>
        <input
          type="text"
          value={formData.operatingHours || ''}
          onChange={(e) => onInputChange('operatingHours', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter operating hours (e.g., 9 AM - 5 PM)"
        />
      </div>

      {/* Accepts Walk-ins */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Accepts Walk-ins
          </label>
        </div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.acceptsWalkIns || false}
            onChange={(e) => onInputChange('acceptsWalkIns', e.target.checked)}
            className="w-4 h-4 text-[#6CC049] bg-gray-100 border-gray-300 rounded focus:ring-[#6CC049] focus:ring-2"
          />
          <span className="text-[14px] font-urbanist text-[#212121]">Yes, accepts walk-ins</span>
        </label>
      </div>
    </div>
  );

  // Car rental form
  const renderCarForm = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Car Name */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Car Name
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <input
          type="text"
          value={formData.productName || ''}
          onChange={(e) => onInputChange('productName', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter car name"
        />
      </div>

      {/* Description */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Description
          </label>
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        </div>
        <div className="relative">
          <textarea
            value={formData.description || ''}
            onChange={(e) => onInputChange('description', e.target.value)}
            className="w-full h-24 px-4 py-3 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] resize-none"
            placeholder="Enter car description"
            rows={3}
          />
        </div>
      </div>

      {/* Subcategory */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Subcategory
          </label>
        </div>
        <div className="relative">
          <select
            value={formData.subcategoryId || ''}
            onChange={(e) => onInputChange('subcategoryId', e.target.value ? parseInt(e.target.value) : '')}
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none cursor-pointer"
          >
            <option value="">Select a subcategory (optional)</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
                {subcategory.subcategoryName}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-[#9E9E9E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            // This will be handled by the parent component
            if (typeof window !== 'undefined') {
              const event = new CustomEvent('openSubcategoryModal');
              window.dispatchEvent(event);
            }
          }}
          className="mt-2 text-[#6CC049] text-[12px] font-urbanist hover:underline"
        >
          Add a new sub-category
        </button>
      </div>

      {/* Address */}
      <SimpleAddressInput
        value={formData.address || ''}
        onChange={(value) => onInputChange('address', value)}
        placeholder="Enter address"
        label="Address"
        required={false}
      />

      {/* Price */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Price
          </label>
        </div>
        <input
          type="number"
          value={formData.price || ''}
          onChange={(e) => onInputChange('price', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter price"
        />
      </div>

      {/* Car Make */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Car Make
          </label>
        </div>
        <input
          type="text"
          value={formData.carMake || ''}
          onChange={(e) => onInputChange('carMake', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., Toyota, Honda, BMW"
        />
      </div>

      {/* Car Model */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Car Model
          </label>
        </div>
        <input
          type="text"
          value={formData.carModel || ''}
          onChange={(e) => onInputChange('carModel', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., Camry, Civic, X5"
        />
      </div>

      {/* Car Year */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Car Year
          </label>
        </div>
        <input
          type="number"
          value={formData.carYear || ''}
          onChange={(e) => onInputChange('carYear', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., 2020"
          min="1900"
          max="2030"
        />
      </div>

      {/* License Plate */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            License Plate
          </label>
        </div>
        <input
          type="text"
          value={formData.licensePlate || ''}
          onChange={(e) => onInputChange('licensePlate', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., ABC-1234"
        />
      </div>

      {/* Car Type */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Car Type
          </label>
        </div>
        <select
          value={formData.carType || ''}
          onChange={(e) => onInputChange('carType', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
        >
          <option value="">Select car type</option>
          <option value="SEDAN">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="HATCHBACK">Hatchback</option>
          <option value="COUPE">Coupe</option>
          <option value="CONVERTIBLE">Convertible</option>
          <option value="WAGON">Wagon</option>
          <option value="PICKUP">Pickup</option>
          <option value="VAN">Van</option>
          <option value="TRUCK">Truck</option>
        </select>
      </div>

      {/* Seats */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Number of Seats
          </label>
        </div>
        <input
          type="number"
          value={formData.seats || ''}
          onChange={(e) => onInputChange('seats', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="e.g., 5"
          min="1"
          max="50"
        />
      </div>

      {/* Hourly Rate */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Hourly Rate
          </label>
        </div>
        <input
          type="number"
          value={formData.hourlyRate || ''}
          onChange={(e) => onInputChange('hourlyRate', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter hourly rate"
          min="0"
          step="0.01"
        />
      </div>

      {/* Daily Rate */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Daily Rate
          </label>
        </div>
        <input
          type="number"
          value={formData.dailyRate || ''}
          onChange={(e) => onInputChange('dailyRate', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter daily rate"
          min="0"
          step="0.01"
        />
      </div>

      {/* Monthly Rate */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Monthly Rate
          </label>
        </div>
        <input
          type="number"
          value={formData.monthlyRate || ''}
          onChange={(e) => onInputChange('monthlyRate', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter monthly rate"
          min="0"
          step="0.01"
        />
      </div>

      {/* Security Deposit */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Security Deposit
          </label>
        </div>
        <input
          type="number"
          value={formData.securityDeposit || ''}
          onChange={(e) => onInputChange('securityDeposit', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter security deposit"
          min="0"
          step="0.01"
        />
      </div>

      {/* Has Driver */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Includes Driver
          </label>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasDriver"
              value="true"
              checked={formData.hasDriver === true}
              onChange={() => onInputChange('hasDriver', true)}
              className="w-4 h-4 text-[#6CC049] focus:ring-[#6CC049]"
            />
            <span className="text-[14px] font-urbanist text-[#212121]">Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasDriver"
              value="false"
              checked={formData.hasDriver === false}
              onChange={() => onInputChange('hasDriver', false)}
              className="w-4 h-4 text-[#6CC049] focus:ring-[#6CC049]"
            />
            <span className="text-[14px] font-urbanist text-[#212121]">No</span>
          </label>
        </div>
      </div>

      {/* Available Days */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Available Days
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <label key={day} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.availableDays?.includes(day) || false}
                onChange={(e) => {
                  const currentDays = formData.availableDays || [];
                  if (e.target.checked) {
                    onInputChange('availableDays', [...currentDays, day]);
                  } else {
                    onInputChange('availableDays', currentDays.filter(d => d !== day));
                  }
                }}
                className="w-4 h-4 text-[#6CC049] focus:ring-[#6CC049] rounded"
              />
              <span className="text-[12px] sm:text-[14px] font-urbanist text-[#212121]">{day}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Available Hours */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Available Hours
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-urbanist text-[#616161] mb-1 block">Start Time</label>
            <input
              type="time"
              value={formData.availableHoursStart || ''}
              onChange={(e) => onInputChange('availableHoursStart', e.target.value)}
              className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
            />
          </div>
          <div>
            <label className="text-[12px] font-urbanist text-[#616161] mb-1 block">End Time</label>
            <input
              type="time"
              value={formData.availableHoursEnd || ''}
              onChange={(e) => onInputChange('availableHoursEnd', e.target.value)}
              className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
            />
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Terms and Conditions
          </label>
        </div>
        <textarea
          value={formData.termsAndConditions || ''}
          onChange={(e) => onInputChange('termsAndConditions', e.target.value)}
          className="w-full h-24 px-4 py-3 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] resize-none"
          placeholder="Enter terms and conditions"
          rows={3}
        />
      </div>

      {/* Addons */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Add-ons
          </label>
        </div>
        <div className="space-y-3">
          {formData.addons?.map((addon, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[12px] font-urbanist text-[#616161] mb-1 block">Name</label>
                  <input
                    type="text"
                    value={addon.name}
                    onChange={(e) => {
                      const newAddons = [...(formData.addons || [])];
                      newAddons[index] = { ...addon, name: e.target.value };
                      onInputChange('addons', newAddons);
                    }}
                    className="w-full h-10 px-3 bg-white border border-gray-300 rounded text-[12px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
                    placeholder="Add-on name"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-urbanist text-[#616161] mb-1 block">Price</label>
                  <input
                    type="number"
                    value={addon.price}
                    onChange={(e) => {
                      const newAddons = [...(formData.addons || [])];
                      newAddons[index] = { ...addon, price: e.target.value };
                      onInputChange('addons', newAddons);
                    }}
                    className="w-full h-10 px-3 bg-white border border-gray-300 rounded text-[12px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      const newAddons = (formData.addons || []).filter((_, i) => i !== index);
                      onInputChange('addons', newAddons);
                    }}
                    className="w-full h-10 bg-red-500 text-white rounded text-[12px] font-urbanist hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <label className="text-[12px] font-urbanist text-[#616161] mb-1 block">Description</label>
                <input
                  type="text"
                  value={addon.description}
                  onChange={(e) => {
                    const newAddons = [...(formData.addons || [])];
                    newAddons[index] = { ...addon, description: e.target.value };
                    onInputChange('addons', newAddons);
                  }}
                  className="w-full h-10 px-3 bg-white border border-gray-300 rounded text-[12px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
                  placeholder="Add-on description"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newAddons = [...(formData.addons || []), { name: '', price: '', description: '' }];
              onInputChange('addons', newAddons);
            }}
            className="w-full h-12 border-2 border-dashed border-[#6CC049] text-[#6CC049] rounded-lg text-[14px] font-urbanist hover:bg-[#6CC049] hover:text-white transition-colors"
          >
            + Add Add-on
          </button>
        </div>
      </div>

      {/* Next Button */}
      {!hideButton && (
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled}
            className={`px-6 py-3 rounded-lg text-[14px] font-urbanist transition-colors ${
              isNextDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#6CC049] text-white hover:bg-[#5AAE3A]'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );

  // Render appropriate form based on business type
  const renderForm = () => {
    const upperBusinessType = businessType?.toUpperCase();
    
    switch (upperBusinessType) {
      case 'EVENTS':
      case 'EXPERIENCES':
      case 'TOUR_GUIDE':
      case 'INFLUENCER':
        return renderEventsForm();
      case 'HOTEL':
      case 'HOTELS':
        return renderHotelForm();
      case 'HOSPITALITY':
      case 'APARTMENT':
        return renderAccommodationForm();
      case 'CLUB':
      case 'RESERVATIONS':
        return renderReservationForm();
      case 'CARS':
        return renderCarForm();
      case 'FASHION':
      case 'SUPERMARKET':
      case 'PHARMACY':
      case 'OTHERS':
        return renderCreateProductForm();
      case 'RESTAURANT':
        return renderFoodForm();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {renderForm()}
    </div>
  );
};

export default DynamicForm;