'use client';
import React, { useState } from 'react';

interface ProfileCompletionProps {
  onNext: () => void;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    phoneNumber: '',
    // Business Info
    businessName: '',
    businessNumber: '',
    category: '',
    address: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveForLater = () => {
    // Save form data logic here
    console.log('Saving for later...');
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 pt-8">
          <h1 className="text-2xl font-bold text-[var(--blueHex)] font-[var(--fontPlayfair)]">
            Complete your profile
          </h1>
          <p className="text-[var(--greyHex)] mt-2 font-[var(--fontOpen)]">
            Let's get you started, ready to streamline
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--blueHex)] rounded-full"></div>
            <div className="text-sm text-[var(--blueHex)]">Profile info</div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="text-sm text-[var(--greyHex)]">Business Verification</div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="text-sm text-[var(--greyHex)]">Confirmation</div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mx-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--blueHex)] mb-4 font-[var(--fontPlayfair)]">
                Personal Info
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--greyHex)] mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--borderHex)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--greyHex)] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--borderHex)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--greyHex)] mb-1">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--borderHex)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--blueHex)] mb-4 font-[var(--fontPlayfair)]">
                Business Info
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--greyHex)] mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--borderHex)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--greyHex)] mb-1">
                    Business Number
                  </label>
                  <input
                    type="text"
                    value={formData.businessNumber}
                    onChange={(e) => handleInputChange('businessNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--borderHex)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--greyHex)] mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--borderHex)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
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
                  <label className="block text-sm font-medium text-[var(--greyHex)] mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--borderHex)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--greyHex)] mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-[var(--borderHex)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleSaveForLater}
              className="px-6 py-2 text-[var(--greyHex)] border border-[var(--borderHex)] rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Save for later
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-2 bg-[var(--blueHex)] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};