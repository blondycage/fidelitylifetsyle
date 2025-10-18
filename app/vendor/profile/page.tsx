'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  ArrowLeft,
} from 'iconsax-react';
import { fetchVendorByEmail, updateVendor } from '@/services/authService';
import { VendorData, VendorUpdatePayload } from '@/types/api';
import { getCategories, Category } from '@/services/categoryService';
import { SimpleAddressInput } from '@/app/vendor/manage-store/create-product/components/SimpleAddressInput';
import { validatePhoneNumber, formatPhoneNumber } from '@/utils/validation';

const VendorProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phoneNumber: '',
    username: '',
    // Business Info
    businessName: '',
    businessPhone: '',
    category: '',
    address: '',
    description: '',
    latitude: 0,
    longitude: 0
  });

  const [updateLoading, setUpdateLoading] = useState(false);
  const [phoneErrors, setPhoneErrors] = useState<{ personal: string; business: string }>({ personal: '', business: '' });

  // Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        console.log('✅ Categories loaded for profile page:', fetchedCategories);
        console.log('📊 Current formData.category:', formData.category);
      } catch (error) {
        console.error('❌ Error loading categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Debug formData changes
  useEffect(() => {
    console.log('📝 FormData updated:', formData);
  }, [formData]);


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
            username: vendor.email, // We'll use email as username for now
            businessName: vendor.businessProfile.name,
            businessPhone: vendor.phoneNumber, // Using personal phone as business phone if not separate
            category: vendor.businessType,
            address: vendor.businessProfile.address,
            description: vendor.businessProfile.description,
            latitude: vendor.businessProfile.latitude || 0,
            longitude: vendor.businessProfile.longitude || 0
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



  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      // Keep username in sync with email
      if (field === 'email') {
        newData.username = value;
      }

      // Debug category selection
      if (field === 'category') {
        console.log('🔄 Category changed to:', value);
      }

      return newData;
    });
  };

  const handlePhoneChange = (field: 'phoneNumber' | 'businessPhone', value: string) => {
    const formattedValue = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    setPhoneErrors(prev => ({ ...prev, [field === 'phoneNumber' ? 'personal' : 'business']: '' }));
  };

  const validatePhone = (field: 'phoneNumber' | 'businessPhone', value: string) => {
    const validation = validatePhoneNumber(value);
    const errorKey = field === 'phoneNumber' ? 'personal' : 'business';
    setPhoneErrors(prev => ({ ...prev, [errorKey]: validation.error }));
    return validation.isValid;
  };

  const handleSaveForLater = () => {
    console.log('Saving for later...');
  };

  const handleNext = async () => {
    if (!vendorData) {
      toast.error('Vendor data not loaded');
      return;
    }

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.businessName.trim() || !formData.address.trim()) {
      toast.error('All required fields must be filled.');
      return;
    }

    // Validate phone numbers
    const isPersonalPhoneValid = validatePhone('phoneNumber', formData.phoneNumber);
    const isBusinessPhoneValid = validatePhone('businessPhone', formData.businessPhone);
    
    if (!isPersonalPhoneValid || !isBusinessPhoneValid) {
      toast.error('Please fix phone number errors before saving');
      return;
    }

    setUpdateLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please sign in again.');
        router.push('/signin');
        return;
      }

      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Prepare the update payload
      const updatePayload: VendorUpdatePayload = {
        firstName,
        lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        username: formData.username,
        businessType: formData.category.toUpperCase() as any,
        businessProfileDTO: {
          id: vendorData.businessProfile.id,
          name: formData.businessName,
          address: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
          description: formData.description
        }
      };

      console.log('Updating vendor with payload:', updatePayload);

      const response = await updateVendor(updatePayload, token);

      if (response.responseCode === 200) {
        toast.success('Profile updated successfully!');
        // Optionally refresh the vendor data
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          const updatedVendor = await fetchVendorByEmail(userEmail, token);
          if (updatedVendor.responseCode === 200) {
            setVendorData(updatedVendor.data);
          }
        }
      } else {
        toast.error(response.responseMessage || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating vendor profile:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout 
        pageTitle="Edit Profile"
        pageDescription="Update your personal and business information"
      >
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#6CC049] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading profile...</span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <style jsx global>{`
        .pac-container {
          z-index: 9999 !important;
          border-radius: 8px !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        .pac-item {
          padding: 12px 16px !important;
          font-size: 14px !important;
          border-bottom: 1px solid #f3f4f6 !important;
          cursor: pointer !important;
        }
        .pac-item:hover {
          background-color: #f9fafb !important;
        }
        .pac-item-selected {
          background-color: #dbeafe !important;
        }
      `}</style>
      
      <DashboardLayout 
        pageTitle="Edit Profile"
        pageDescription="Update your personal and business information"
      >
        <div className="p-6 lg:p-8">
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
                        onChange={(e) => handlePhoneChange('phoneNumber', e.target.value)}
                        onBlur={(e) => validatePhone('phoneNumber', e.target.value)}
                        className={`w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all ${phoneErrors.personal ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="Enter your phone number (11 digits)"
                        maxLength={11}
                      />
                      {phoneErrors.personal && (
                        <p className="text-red-500 text-sm mt-1">{phoneErrors.personal}</p>
                      )}
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
                        onChange={(e) => handlePhoneChange('businessPhone', e.target.value)}
                        onBlur={(e) => validatePhone('businessPhone', e.target.value)}
                        className={`w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all ${phoneErrors.business ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="Enter business phone (11 digits)"
                        maxLength={11}
                      />
                      {phoneErrors.business && (
                        <p className="text-red-500 text-sm mt-1">{phoneErrors.business}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] transition-all"
                        disabled={categoriesLoading}
                      >
                        <option value="">
                          {categoriesLoading ? 'Loading categories...' : 'Select category'}
                        </option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.description}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <SimpleAddressInput
                        value={formData.address || ''}
                        onChange={(value) => handleInputChange('address', value)}
                        placeholder="Enter business address"
                        label="Address"
                        required={false}
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
                  disabled={updateLoading}
                  className="px-8 py-3 bg-[var(--greenHex)] text-white rounded-full font-semibold hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default VendorProfilePage;