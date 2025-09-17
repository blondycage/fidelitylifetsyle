'use client';
import React, { useState } from 'react';
import { FidelityLogo } from '@/components/ui/FidelityLogo';

interface BusinessVerificationProps {
  onPrev: () => void;
}

export const BusinessVerification: React.FC<BusinessVerificationProps> = ({ onPrev }) => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    routingNumber: '',
    accountType: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Handle final submission
    console.log('Submitting verification...');
  };

  const handlePrev = () => {
    onPrev();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
         
          <h1 className="text-2xl font-bold text-[var(--blueHex)] font-[var(--fontPlayfair)]">
            Business Verification
          </h1>
          <p className="text-[var(--greyHex)] mt-2 font-[var(--fontOpen)]">
            Getting you set-up with Fidelity services
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--greenHex)] rounded-full"></div>
            <div className="text-sm text-[var(--greenHex)]">Profile info</div>
            <div className="w-8 h-px bg-[var(--greenHex)]"></div>
            <div className="w-2 h-2 bg-[var(--greenHex)] rounded-full"></div>
            <div className="text-sm text-[var(--greenHex)]">Business Verification</div>
            <div className="w-8 h-px bg-[var(--blueHex)]"></div>
            <div className="w-2 h-2 bg-[var(--blueHex)] rounded-full"></div>
            <div className="text-sm text-[var(--blueHex)]">Confirmation</div>
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--blueHex)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--blueHex)] mb-2 font-[var(--fontPlayfair)]">
              Account Verification
            </h3>
            <p className="text-sm text-[var(--greyHex)] font-[var(--fontOpen)]">
              Enter your account details for verification
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--greyHex)] mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--borderHex)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
                placeholder="Enter your account number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--greyHex)] mb-1">
                Routing Number
              </label>
              <input
                type="text"
                value={formData.routingNumber}
                onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--borderHex)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
                placeholder="Enter routing number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--greyHex)] mb-1">
                Account Type
              </label>
              <select
                value={formData.accountType}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--borderHex)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
              >
                <option value="">Select account type</option>
                <option value="business">Business Checking</option>
                <option value="savings">Business Savings</option>
                <option value="current">Current Account</option>
              </select>
            </div>
          </div>

          {/* Verification Steps */}
        

          {/* Form Actions */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              className="px-6 py-2 text-[var(--greyHex)] border border-[var(--borderHex)] rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-2 bg-[var(--blueHex)] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};