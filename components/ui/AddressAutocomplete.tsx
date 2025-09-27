'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface AddressDetails {
  address: string;
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteProps {
  name: string;
  placeholder: string;
  label: string;
  value: string;
  onChange: (details: AddressDetails) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  name,
  placeholder,
  label,
  value,
  onChange,
  error,
  required = false,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const isSelectingFromAutocomplete = useRef(false);

  // Update input value when external value changes
  useEffect(() => {
    if (!isSelectingFromAutocomplete.current) {
      setInputValue(value);
    }
  }, [value]);

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
          fields: ['formatted_address', 'geometry.location', 'name'],
        }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();

        if (place && place.geometry && place.geometry.location) {
          isSelectingFromAutocomplete.current = true;

          const selectedAddress = place.formatted_address || place.name || '';
          const addressDetails: AddressDetails = {
            address: selectedAddress,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          };

          setInputValue(selectedAddress);
          onChange(addressDetails);

          // Reset the flag after a short delay to allow the state to update
          setTimeout(() => {
            isSelectingFromAutocomplete.current = false;
          }, 100);
        }
      });
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Only call onChange if not selecting from autocomplete
    if (!isSelectingFromAutocomplete.current) {
      onChange({
        address: newValue,
        latitude: 0,
        longitude: 0,
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        ref={inputRef}
        type="text"
        name={name}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className="w-full px-4 py-3 bg-[var(--inputHex)] border border-[var(--borderHex)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent placeholder-[var(--inputPlaceholderHex)]"
        required={required}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};