'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface SimpleAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export const SimpleAddressInput: React.FC<SimpleAddressInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter address',
  label = 'Address',
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use refs for immediate updates, no state delays
  const currentValueRef = useRef<string>(value || '');
  const [selectedFromAutocomplete, setSelectedFromAutocomplete] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Initialize input value once
  useEffect(() => {
    if (inputRef.current && value) {
      inputRef.current.value = value;
      currentValueRef.current = value;
    }
  }, []);

  // Load Google Maps
  useEffect(() => {
    const loadGoogleMaps = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.error('Google Maps API key not found');
        return;
      }

      try {
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places'],
        });

        await loader.load();
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['establishment', 'geocode'],
          fields: ['formatted_address', 'name'],
        }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        confirmSelection();
      });

      // Fallback: confirm on Enter
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          // Allow Google to update selection first
          setTimeout(confirmSelection, 0);
        }
      };
      inputRef.current.addEventListener('keydown', onKeyDown);

      // Fallback: confirm on mouse click selection
      const onDocMouseDown = () => {
        // Delay to allow Google suggestion click to resolve
        setTimeout(confirmSelection, 0);
      };
      document.addEventListener('mousedown', onDocMouseDown, true);

      // Cleanup listeners
      const currentInput = inputRef.current;
      return () => {
        currentInput?.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('mousedown', onDocMouseDown, true);
      };
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded]);

  const confirmSelection = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && (place.formatted_address || place.name)) {
      const selectedAddress = place.formatted_address || place.name || '';

      console.log('Address selected from Google:', selectedAddress);

      // Update ref immediately - no state delays
      currentValueRef.current = selectedAddress;

      // Update input element directly
      if (inputRef.current) {
        inputRef.current.value = selectedAddress;
      }

      // Update visual indicator
      setSelectedFromAutocomplete(true);
      setForceUpdate(prev => prev + 1);

      // Call onChange with the value from ref
      onChange(currentValueRef.current);

      console.log('Value stored in ref:', currentValueRef.current);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Update ref immediately
    currentValueRef.current = newValue;

    // If user starts typing after having a selected address, clear the selection
    if (selectedFromAutocomplete) {
      setSelectedFromAutocomplete(false);
    }

    // Pass whatever is in the input to parent
    onChange(newValue);
  };

  const handleClear = () => {
    currentValueRef.current = '';
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setSelectedFromAutocomplete(false);
    onChange('');
  };

  return (
    <div className="w-full max-w-full sm:max-w-[450px]">
      <div className="flex items-center gap-2 mb-2">
        <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
          {label}
        </label>
        {required && (
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        )}
      </div>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          defaultValue={value}
          onChange={handleInputChange}
          className={`w-full h-12 px-4 border rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:ring-1 ${
            selectedFromAutocomplete
              ? 'bg-green-50 border-[#6CC049] focus:border-[#6CC049] focus:ring-[#6CC049] pr-20'
              : 'bg-[#EEEEEE] border-[#EEEEEE] focus:border-[#6CC049] focus:ring-[#6CC049]'
          }`}
          placeholder={placeholder}
        />
        {selectedFromAutocomplete && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-[10px] text-[#6CC049] font-medium">✓ Selected</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-[#616161] hover:text-[#212121] text-xs"
            >
              ✕
            </button>
          </div>
        )}
      </div>
      {selectedFromAutocomplete && (
        <p className="mt-1 text-[11px] text-[#6CC049]">
          Address selected from Google Maps
        </p>
      )}
    </div>
  );
};
