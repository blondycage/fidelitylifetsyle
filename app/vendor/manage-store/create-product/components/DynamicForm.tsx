'use client';
import React, { useRef, useEffect, useState } from 'react';
import ArrayInput from './ArrayInput';
import { SubcategoryItem } from '@/services/subcategoryService';
import { Loader } from '@googlemaps/js-api-loader';

interface DynamicFormProps {
  businessType: string;
  formData: any;
  onInputChange: (field: string, value: any) => void;
  subcategories?: SubcategoryItem[];
  subcategoriesLoading?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ businessType, formData, onInputChange, subcategories = [], subcategoriesLoading = false }) => {
  // Google Maps Autocomplete state
  const addressInputRef = useRef<HTMLInputElement>(null);
  const venueInputRef = useRef<HTMLInputElement>(null);
  const addressAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const venueAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [isVenueSelected, setIsVenueSelected] = useState(false);
  const [addressInputValue, setAddressInputValue] = useState('');
  const [venueInputValue, setVenueInputValue] = useState('');
  const isSelectingFromAutocomplete = useRef(false);

  // Load Google Maps
  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        console.error('Google Maps API key not found');
        return;
      }

      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places'],
        });

        await loader.load();
        console.log('Google Maps loaded successfully');
        setIsGoogleMapsLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    loadGoogleMaps();
  }, []);

  // Initialize autocomplete for address field
  useEffect(() => {
    if (isGoogleMapsLoaded && addressInputRef.current && !addressAutocompleteRef.current) {
      console.log('Initializing Google Places Autocomplete for Address');

      addressAutocompleteRef.current = new google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          types: ['establishment', 'geocode'],
          fields: ['formatted_address', 'geometry.location', 'name'],
        }
      );

      addressAutocompleteRef.current.addListener('place_changed', () => {
        const place = addressAutocompleteRef.current?.getPlace();

        if (place && place.geometry && place.geometry.location) {
          isSelectingFromAutocomplete.current = true;

          const selectedAddress = place.formatted_address || place.name || '';
          
          // Update form data with selected address and coordinates
          onInputChange('address', selectedAddress);
          onInputChange('addressLatitude', place.geometry.location.lat());
          onInputChange('addressLongitude', place.geometry.location.lng());
          
          // Update local address state - clear input value so it shows selected address
          setAddressInputValue('');
          setIsAddressSelected(true);

          setTimeout(() => {
            isSelectingFromAutocomplete.current = false;
          }, 100);
        }
      });
    }

    return () => {
      if (addressAutocompleteRef.current) {
        google.maps.event.clearInstanceListeners(addressAutocompleteRef.current);
      }
    };
  }, [isGoogleMapsLoaded, onInputChange]);

  // Sync input values with form data
  useEffect(() => {
    if (formData.address && !isAddressSelected) {
      setAddressInputValue(formData.address);
    }
    if (formData.venue && !isVenueSelected) {
      setVenueInputValue(formData.venue);
    }
  }, [formData.address, formData.venue, isAddressSelected, isVenueSelected]);

  // Initialize autocomplete for venue field
  useEffect(() => {
    if (isGoogleMapsLoaded && venueInputRef.current && !venueAutocompleteRef.current) {
      console.log('Initializing Google Places Autocomplete for Venue');

      venueAutocompleteRef.current = new google.maps.places.Autocomplete(
        venueInputRef.current,
        {
          types: ['establishment'],
          fields: ['formatted_address', 'geometry.location', 'name'],
        }
      );

      venueAutocompleteRef.current.addListener('place_changed', () => {
        const place = venueAutocompleteRef.current?.getPlace();

        if (place && place.geometry && place.geometry.location) {
          isSelectingFromAutocomplete.current = true;

          const selectedVenue = place.formatted_address || place.name || '';
          
          // Update form data with selected venue and coordinates
          onInputChange('venue', selectedVenue);
          onInputChange('venueLatitude', place.geometry.location.lat());
          onInputChange('venueLongitude', place.geometry.location.lng());
          
          // Update local venue state - clear input value so it shows selected venue
          setVenueInputValue('');
          setIsVenueSelected(true);

          setTimeout(() => {
            isSelectingFromAutocomplete.current = false;
          }, 100);
        }
      });
    }

    return () => {
      if (venueAutocompleteRef.current) {
        google.maps.event.clearInstanceListeners(venueAutocompleteRef.current);
      }
    };
  }, [isGoogleMapsLoaded, onInputChange]);

  // Handle address input changes
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAddressInputValue(newValue);
    
    // If user starts typing after having a selected address, clear the selection
    if (isAddressSelected && !isSelectingFromAutocomplete.current) {
      setIsAddressSelected(false);
      // Clear the form data address when user starts typing manually
      onInputChange('address', '');
    }

    // Don't update formData for manual typing - only for autocomplete selections
  };

  // Effect to set price to 0 for free events
  useEffect(() => {
    if (formData.eventType === 'FREE' && formData.price !== '0') {
      onInputChange('price', '0');
    }
  }, [formData.eventType, formData.price, onInputChange]);

  // Handle venue input changes
  const handleVenueInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setVenueInputValue(newValue);
    
    // If user starts typing after having a selected venue, clear the selection
    if (isVenueSelected && !isSelectingFromAutocomplete.current) {
      setIsVenueSelected(false);
      // Clear the form data venue when user starts typing manually
      onInputChange('venue', '');
    }
    
    // Clear address when venue is filled
    if (newValue && formData.address) {
      onInputChange('address', '');
      setAddressInputValue('');
      setIsAddressSelected(false);
    }

    // Don't update formData for manual typing - only for autocomplete selections
  };

  // Handle address input changes with venue clearing
  const handleAddressInputChangeWithVenue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAddressInputValue(newValue);
    
    // If user starts typing after having a selected address, clear the selection
    if (isAddressSelected && !isSelectingFromAutocomplete.current) {
      setIsAddressSelected(false);
      // Clear the form data address when user starts typing manually
      onInputChange('address', '');
    }
    
    // Clear venue when address is filled
    if (newValue && formData.venue) {
      onInputChange('venue', '');
      setVenueInputValue('');
      setIsVenueSelected(false);
    }

    // Don't update formData for manual typing - only for autocomplete selections
  };
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

      {/* Address - Only show if venue is not filled */}
      {!formData.venue && (
        <div className="w-full max-w-full sm:max-w-[450px]">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
              Address
            </label>
          </div>
          <div className="relative">
            <input
              ref={addressInputRef}
              type="text"
              value={isAddressSelected ? formData.address : addressInputValue}
              onChange={handleAddressInputChangeWithVenue}
              onFocus={() => {
                if (isAddressSelected && formData.address) {
                  setAddressInputValue(formData.address);
                }
              }}
              className={`w-full h-12 px-4 bg-[#EEEEEE] border rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:ring-1 focus:ring-[#6CC049] ${
                isAddressSelected
                  ? 'border-[#6CC049] bg-green-50'
                  : 'border-[#EEEEEE]'
              }`}
              placeholder="Enter event address"
            />
            {/* Clear button */}
            {(formData.address || addressInputValue) && (
              <button
                type="button"
                onClick={() => {
                  onInputChange('address', '');
                  setAddressInputValue('');
                  setIsAddressSelected(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
          {/* Success indicator */}
          {isAddressSelected && (
            <div className="mt-2 flex items-center gap-2 text-[#6CC049] text-[12px] font-urbanist">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Address selected from Google Maps
            </div>
          )}
        </div>
      )}

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
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] [color-scheme:light]"
            style={{ colorScheme: 'light' }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.333 6h9.334M8 1v3.333M8 1a3.333 3.333 0 0 0-3.333 3.333V6M8 1a3.333 3.333 0 0 1 3.333 3.333V6M3.333 6v6.667A1.333 1.333 0 0 0 4.667 14h6.666a1.333 1.333 0 0 0 1.334-1.333V6" stroke="#616161" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
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
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.333a6.667 6.667 0 1 0 0 13.334A6.667 6.667 0 0 0 8 1.333ZM8 4v4l2.667 1.6" stroke="#616161" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
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
            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] [color-scheme:light]"
            style={{ colorScheme: 'light' }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.333 6h9.334M8 1v3.333M8 1a3.333 3.333 0 0 0-3.333 3.333V6M8 1a3.333 3.333 0 0 1 3.333 3.333V6M3.333 6v6.667A1.333 1.333 0 0 0 4.667 14h6.666a1.333 1.333 0 0 0 1.334-1.333V6" stroke="#616161" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
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
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.333a6.667 6.667 0 1 0 0 13.334A6.667 6.667 0 0 0 8 1.333ZM8 4v4l2.667 1.6" stroke="#616161" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
       
      </div>

      {/* Venue */}
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Venue
          </label>
        </div>
        <div className="relative">
          <input
            ref={venueInputRef}
            type="text"
            value={isVenueSelected ? formData.venue : venueInputValue}
            onChange={handleVenueInputChange}
            onFocus={() => {
              if (isVenueSelected && formData.venue) {
                setVenueInputValue(formData.venue);
              }
            }}
            className={`w-full h-12 px-4 bg-[#EEEEEE] border rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:ring-1 focus:ring-[#6CC049] ${
              isVenueSelected
                ? 'border-[#6CC049] bg-green-50'
                : 'border-[#EEEEEE]'
            }`}
            placeholder="Enter venue name"
          />
          {/* Clear button */}
          {(formData.venue || venueInputValue) && (
            <button
              type="button"
              onClick={() => {
                onInputChange('venue', '');
                setVenueInputValue('');
                setIsVenueSelected(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
        {/* Success indicator */}
        {isVenueSelected && (
          <div className="mt-2 flex items-center gap-2 text-[#6CC049] text-[12px] font-urbanist">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Venue selected from Google Maps
          </div>
        )}
      </div>

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
            <option value="ADULT">Adult Event</option>
            <option value="CHILD">Child Event</option>
            <option value="STANDARD_MEET_AND_GREET">Standard Meet and Greet</option>
            <option value="VIP_EXPERIENCE">VIP Experience</option>
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Address
          </label>
        </div>
        <div className="relative">
          <input
            ref={addressInputRef}
            type="text"
            value={isAddressSelected ? formData.address : addressInputValue}
            onChange={handleAddressInputChange}
            onFocus={() => {
              if (isAddressSelected && formData.address) {
                setAddressInputValue(formData.address);
              }
            }}
            className={`w-full h-12 px-4 bg-[#EEEEEE] border rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:ring-1 focus:ring-[#6CC049] ${
              isAddressSelected
                ? 'border-[#6CC049] bg-green-50'
                : 'border-[#EEEEEE]'
            }`}
            placeholder="Enter property address"
          />
          {/* Clear button */}
          {(formData.address || addressInputValue) && (
            <button
              type="button"
              onClick={() => {
                onInputChange('address', '');
                setAddressInputValue('');
                setIsAddressSelected(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
        {/* Success indicator */}
        {isAddressSelected && (
          <div className="mt-2 flex items-center gap-2 text-[#6CC049] text-[12px] font-urbanist">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Address selected from Google Maps
          </div>
        )}
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
      <div className="w-full max-w-full sm:max-w-[450px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
            Address
          </label>
        </div>
        <div className="relative">
          <input
            ref={addressInputRef}
            type="text"
            value={isAddressSelected ? formData.address : addressInputValue}
            onChange={handleAddressInputChange}
            onFocus={() => {
              if (isAddressSelected && formData.address) {
                setAddressInputValue(formData.address);
              }
            }}
            className={`w-full h-12 px-4 bg-[#EEEEEE] border rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:ring-1 focus:ring-[#6CC049] ${
              isAddressSelected
                ? 'border-[#6CC049] bg-green-50'
                : 'border-[#EEEEEE]'
            }`}
            placeholder="Enter address"
          />
          {/* Clear button */}
          {(formData.address || addressInputValue) && (
            <button
              type="button"
              onClick={() => {
                onInputChange('address', '');
                setAddressInputValue('');
                setIsAddressSelected(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
        {/* Success indicator */}
        {isAddressSelected && (
          <div className="mt-2 flex items-center gap-2 text-[#6CC049] text-[12px] font-urbanist">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Address selected from Google Maps
          </div>
        )}
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
          type="number"
          value={formData.operatingHours || ''}
          onChange={(e) => onInputChange('operatingHours', e.target.value)}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder="Enter operating hours (e.g., 12)"
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

  // Render appropriate form based on business type
  const renderForm = () => {
    switch (businessType) {
      case 'EVENTS':
      case 'EXPERIENCES':
      case 'TOUR_GUIDE':
      case 'INFLUENCER':
        return renderEventsForm();
      case 'HOTEL':
      case 'HOSPITALITY':
      case 'APARTMENT':
        return renderAccommodationForm();
      case 'CLUB':
      case 'RESERVATIONS':
        return renderReservationForm();
      case 'FASHION':
        return renderFashionForm();
      case 'RESTAURANT':
      case 'SUPERMARKET':
      case 'PHARMACY':
      case 'OTHERS':
        return renderCreateProductForm();
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