'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface BusinessVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const BusinessVerificationModal: React.FC<BusinessVerificationModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    idNumber: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'BVN is required';
    } else if (formData.idNumber.length !== 11) {
      newErrors.idNumber = 'BVN must be 11 digits';
    } 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Making API call with data:', { idNumber: formData.idNumber, accountNumber: formData.accountNumber });
    setIsLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/vendor/verify-bvn', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          idNumber: formData.idNumber,
          accountNumber: formData.accountNumber,
        }),
      });

      console.log('API response status:', response.status);
      const data = await response.json();
      console.log('API response data:', data);

      if (response.ok) {
        toast.success(data.responseMessage || 'Verification successful!');
        onComplete();
        onClose();
      } else {
        toast.error(data.responseMessage || 'Verification failed');
        if (data.responseCode === 400) {
          setErrors({
            general: data.responseMessage || 'Invalid BVN or account number'
          });
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Network error. Please try again.');
      setErrors({
        general: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-black font-[var(--fontPlayfair)]">
                Business Verification
              </h2>
              <p className="text-[var(--greyHex)] mt-1 text-xs sm:text-sm font-[var(--fontOpen)]">
                Continue with an existing fidelity account.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 ml-2 sm:ml-4 p-1"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[var(--greyHex)] mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 sm:py-3 bg-gray-100 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-[var(--greyHex)] text-sm sm:text-base ${
                  errors.name ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="John Doe"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-[var(--greyHex)] mb-2">
                Account number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  className={`w-full px-3 py-2 sm:py-3 border border-dashed border-blue-300 rounded-md focus:outline-none   text-sm sm:text-base ${
                    errors.accountNumber ? 'ring-2 ring-red-500' : ''
                  }`}
                  placeholder=""
                  disabled={isLoading}
                />
                
              </div>
              {errors.accountNumber && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.accountNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-[var(--greyHex)] mb-2">
                BVN
              </label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                className={`w-full px-3 py-2 sm:py-3 border border-[var(--borderHex)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] text-sm sm:text-base ${
                  errors.idNumber ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder=""
                maxLength={11}
                disabled={isLoading}
              />
              {errors.idNumber && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.idNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-2.5 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm sm:text-base ${
              isLoading
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-[var(--blueHex)] text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};