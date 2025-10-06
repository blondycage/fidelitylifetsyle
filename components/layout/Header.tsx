'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, CloseCircle, ArrowDown2 } from 'iconsax-react';
import Image from 'next/image';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const locationRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLocation = () => {
    setIsLocationOpen(!isLocationOpen);
  };

  const truncateAddress = (text: string, max = 26) => {
    if (!text) return '';
    return text.length > max ? text.slice(0, max - 1) + '…' : text;
  };

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white backdrop-blur-[80px] sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-[60px] py-5">
        <div className="flex justify-between items-center">
          {/* Logo and Location */}
          <div className="flex items-center gap-2">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative w-[140.77px] h-[60px]">
                <Image
                  src="/images/logo-web.svg"
                  alt="Naija Connect"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Location Selector */}
            <div className="relative" ref={locationRef}>
              <button
                onClick={toggleLocation}
                className="flex items-center gap-2 bg-[#E1FCEF] hover:bg-[#D4F7E7] transition-colors duration-200 rounded-[24px] px-4 py-2 backdrop-blur-[8px]"
              >
                {/* Nigerian Flag Icon from Figma */}
                <Image src="/images/flag-ng.svg" alt="Nigeria" width={24} height={24} />
                
                <span className="text-[#14804A] font-bold text-base font-urbanist">
                  {selectedAddress ? truncateAddress(selectedAddress) : 'Victoria Island, LA'}
                </span>
                
                <Image src="/images/icon-arrow-down.svg" alt="Expand" width={16} height={16} className={isLocationOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>

              {/* Location Dropdown */}
              {isLocationOpen && (
                <div className="absolute top-full left-0 mt-2 w-[360px] bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50">
                  <AddressAutocomplete
                    name="header-location"
                    label="Search location"
                    placeholder="Type an address or place..."
                    value={selectedAddress}
                    onChange={(details) => {
                      setSelectedAddress(details.address);
                      
                      setIsLocationOpen(false);
                    }}
                    className=""
                  />
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-14">
            <Link 
              href="/" 
              className="text-[#9E9E9E] hover:text-[#6CC049] transition-colors duration-200 font-semibold text-xl font-urbanist"
            >
              Home
            </Link>
            <Link 
              href="/experiences" 
              className="text-[#9E9E9E] hover:text-[#6CC049] transition-colors duration-200 font-semibold text-xl font-urbanist"
            >
              Experiences
            </Link>
            <Link 
              href="/become-vendor" 
              className="text-[#9E9E9E] hover:text-[#6CC049] transition-colors duration-200 font-semibold text-xl font-urbanist"
            >
              Become a Vendor
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/signin"
              className="border-2 border-[#6CC049] text-[#6CC049] px-8 py-3 rounded-[60px] hover:bg-[#6CC049] hover:text-white transition-colors duration-200 font-semibold text-xl font-urbanist"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-[#6CC049] text-white px-8 py-3 rounded-[60px] hover:bg-[#5BA83E] transition-colors duration-200 font-semibold text-xl font-urbanist"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-[#6CC049] transition-colors duration-200"
            >
              {isMenuOpen ? (
                <CloseCircle size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-4">
              <Link
                href="/"
                className="block text-[#9E9E9E] hover:text-[#6CC049] transition-colors duration-200 font-semibold text-xl font-urbanist"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/experiences"
                className="block text-[#9E9E9E] hover:text-[#6CC049] transition-colors duration-200 font-semibold text-xl font-urbanist"
                onClick={() => setIsMenuOpen(false)}
              >
                Experiences
              </Link>
              <Link
                href="/become-vendor"
                className="block text-[#9E9E9E] hover:text-[#6CC049] transition-colors duration-200 font-semibold text-xl font-urbanist"
                onClick={() => setIsMenuOpen(false)}
              >
                Become a Vendor
              </Link>
              
              <div className="pt-4 space-y-3">
              <Link
                href="/signin"
                className="block border-2 border-[#6CC049] text-[#6CC049] px-6 py-3 rounded-[60px] hover:bg-[#6CC049] hover:text-white transition-colors duration-200 font-semibold text-xl font-urbanist text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block bg-[#6CC049] text-white px-6 py-3 rounded-[60px] hover:bg-[#5BA83E] transition-colors duration-200 font-semibold text-xl font-urbanist text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}