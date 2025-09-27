'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FidelityLogo } from '@/components/ui/FidelityLogo';
import {
  Home,
  Shop,
  Box,
  MoneyRecive,
  Truck,
  Verify,
  Profile,
  Logout,
  SearchNormal1,
  Notification,
  ArrowLeft,
} from 'iconsax-react';
import { fetchVendorByEmail } from '@/services/authService';
import { VendorData } from '@/types/api';

const VendorProfilePage = () => {
  const router = useRouter();
  const [activeMenuItem, setActiveMenuItem] = useState('Profile');
  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phoneNumber: '',
    // Business Info
    businessName: '',
    businessPhone: '',
    category: '',
    address: '',
    description: ''
  });

  const menuItems = [
    { name: 'Dashboard', icon: Home, active: false },
    { name: 'Manage Store', icon: Shop, active: false },
    { name: 'Manage Orders', icon: Box, active: false },
    { name: 'Earnings', icon: MoneyRecive, active: false },
    { name: 'Logistics Setup', icon: Truck, active: false },
    { name: 'Business Verification', icon: Verify, active: false },
  ];

  // Fetch vendor data on component mount
  useEffect(() => {
    const loadVendorData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');

        if (!token || !userEmail) {
          toast.error('Authentication required. Please sign in again.');
          router.push('/signin');
          return;
        }

        const response = await fetchVendorByEmail(userEmail, token);

        if (response.responseCode === 200 && response.data) {
          const vendor = response.data;
          setVendorData(vendor);

          // Populate form with vendor data
          setFormData({
            name: `${vendor.firstName} ${vendor.lastName}`,
            email: vendor.email,
            phoneNumber: vendor.phoneNumber,
            businessName: vendor.businessProfile.name,
            businessPhone: vendor.phoneNumber, // Using personal phone as business phone if not separate
            category: vendor.businessType.toLowerCase(),
            address: vendor.businessProfile.address,
            description: vendor.businessProfile.description
          });
        } else {
          toast.error('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error loading vendor data:', error);
        toast.error('Error loading profile data');
      } finally {
        setLoading(false);
      }
    };

    loadVendorData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    router.push('/signin');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveForLater = () => {
    console.log('Saving for later...');
  };

  const handleNext = () => {
    console.log('Form submitted:', formData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--blueHex)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--greyHex)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <div className="lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 flex">
        <div className="flex flex-col flex-grow bg-white shadow-lg overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-white">
            <FidelityLogo showText={false} size="md" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveMenuItem(item.name);
                    if (item.name === 'Dashboard') {
                      router.push('/vendor/dashboard');
                    } else if (item.name === 'Business Verification') {
                      router.push('/vendor/business-verification');
                    }
                  }}
                  className={`w-full flex items-center px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                    activeMenuItem === item.name
                      ? 'bg-[var(--greenHex)] text-white shadow-md'
                      : 'text-[var(--greyHex)] hover:bg-blue-50 hover:text-[var(--greenHex)]'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-200 ${
                    activeMenuItem === item.name
                      ? 'bg-white/20'
                      : 'bg-transparent group-hover:bg-blue-100'
                  }`}>
                    <IconComponent
                      size={18}
                      color={activeMenuItem === item.name ? 'white' : 'currentColor'}
                      variant={activeMenuItem === item.name ? 'Bold' : 'Outline'}
                    />
                  </div>
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => setActiveMenuItem('Profile')}
              className={`w-full flex items-center px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                activeMenuItem === 'Profile'
                  ? 'bg-[var(--greenHex)] text-white shadow-md'
                  : 'text-[var(--greyHex)] hover:bg-blue-50 hover:text-[var(--greenHex)]'
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-200 ${
                activeMenuItem === 'Profile'
                  ? 'bg-white/20'
                  : 'bg-transparent group-hover:bg-blue-100'
              }`}>
                <Profile
                  size={18}
                  color={activeMenuItem === 'Profile' ? 'white' : 'currentColor'}
                  variant={activeMenuItem === 'Profile' ? 'Bold' : 'Outline'}
                />
              </div>
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-3 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg mr-3 bg-transparent group-hover:bg-red-100 transition-all duration-200">
                <Logout size={18} color="currentColor" variant="Outline" />
              </div>
              Log out
            </button>
          </div>
        </div>
      </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16">
            {/* Mobile menu button */}
            <button className="lg:hidden p-2 rounded-md text-[var(--greenHex)] hover:text-blue-700 transition-all duration-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" />
              </svg>
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blueHex)] focus:border-[var(--blueHex)] transition-all duration-200"
                />
                <SearchNormal1 size={20} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Notifications and profile */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-[var(--greyHex)] hover:text-[var(--greenHex)] transition-all duration-200 rounded-lg hover:bg-blue-50">
                <Notification size={24} variant="Outline" />
              </button>
              <button className="p-2 text-[var(--greyHex)] hover:text-[var(--greenHex)] transition-all duration-200 rounded-lg hover:bg-blue-50">
                <Profile size={24} variant="Outline" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => router.back()}
                  className="mr-4 p-2 text-[var(--greyHex)] hover:text-[var(--greenHex)] transition-all duration-200 rounded-lg hover:bg-blue-50"
                >
                  <ArrowLeft size={24} color="currentColor" />
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-urbanist">Edit Profile</h1>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div>
                  <h2 className="text-lg font-semibold text-[var(--greenHex)] mb-6 font-urbanist">
                    Personal Info
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div>
                  <h2 className="text-lg font-semibold text-[var(--greenHex)] mb-6 font-urbanist">
                    Business Info
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                        Business name
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                        placeholder="Enter business name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        value={formData.businessPhone}
                        onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                        placeholder="Enter business phone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                      >
                        <option value="">Select category</option>
                        <option value="hotel">Hotel</option>
                        <option value="influencer">Influencer</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="club">Club</option>
                        <option value="supermarket">Supermarket</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="fashion">Fashion</option>
                        <option value="tour_guide">Tour Guide</option>
                        <option value="experiences">Experiences</option>
                        <option value="events">Events</option>
                        <option value="others">Others</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                        placeholder="Enter address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all resize-none"
                        placeholder="Describe your business..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveForLater}
                  className="px-8 py-3 text-[var(--greyHex)] border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Save for later
                </button>
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-[var(--greenHex)] text-white rounded-full font-semibold hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)] transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="min-h-screen bg-white">
          {/* Mobile Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="p-2 text-[var(--greenHex)] hover:text-blue-700 transition-all duration-200 rounded-lg hover:bg-blue-50"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-lg font-semibold text-gray-900 font-urbanist">Edit Profile</h1>
              <div className="w-8"></div>
            </div>
          </header>

          {/* Mobile Content */}
          <main className="p-4">
            <div className="space-y-6">
              {/* Personal Info Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[var(--greenHex)] mb-4 font-urbanist">
                  Personal Info
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Business Info Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[var(--greenHex)] mb-4 font-urbanist">
                  Business Info
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                      Business name
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                      placeholder="Enter business name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      value={formData.businessPhone}
                      onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                      placeholder="Enter business phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                    >
                      <option value="">Select category</option>
                      <option value="retail">Retail</option>
                      <option value="services">Services</option>
                      <option value="technology">Technology</option>
                      <option value="food">Food & Beverage</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                      placeholder="Enter address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all resize-none"
                      placeholder="Describe your business..."
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Form Actions */}
              <div className="flex flex-col space-y-3 pb-8">
                <button
                  onClick={handleNext}
                  className="w-full px-8 py-3 bg-[var(--greenHex)] text-white rounded-full font-semibold hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)] transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Next
                </button>
                <button
                  onClick={handleSaveForLater}
                  className="w-full px-8 py-3 text-[var(--greyHex)] border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Save for later
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default VendorProfilePage;