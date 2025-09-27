'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CloseCircle } from 'iconsax-react';

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

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (formData.accountNumber.length < 10) {
      newErrors.accountNumber = 'Account number must be at least 10 digits';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'BVN is required';
    } else if (formData.idNumber.length !== 11) {
      newErrors.idNumber = 'BVN must be 11 digits';
    } else if (!/^\d+$/.test(formData.idNumber)) {
      newErrors.idNumber = 'BVN must contain only numbers';
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

      if (response.ok && data.data !== false) {
        toast.success(data.responseMessage || 'Verification successful!');
        onComplete();
        onClose();
      } else if (response.ok && data.data === false) {
        // Handle case where API returns 200 but data is false
        toast.error('Verification failed. Check credentials or try again later.');
        setErrors({
          general: 'Verification failed. Please check your BVN and account number or try again later.'
        });
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-black font-urbanist">
                Business Verification
              </h2>
              <p className="text-[var(--greyHex)] mt-1 text-xs sm:text-sm font-urbanist">
                Continue with an existing fidelity account.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--greenHex)] hover:text-green-700 ml-2 sm:ml-4 p-1 transition-all duration-200"
            >
              <CloseCircle size={24} color="currentColor" />
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
                Account number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  className={`w-full px-3 py-2 sm:py-3 border border-dashed border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--greenHex)] text-sm sm:text-base ${
                    errors.accountNumber ? 'ring-2 ring-red-500' : ''
                  }`}
                  placeholder="Enter your account number"
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
                className={`w-full px-3 py-2 sm:py-3 border border-[var(--borderHex)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--greenHex)] text-sm sm:text-base ${
                  errors.idNumber ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="Enter your 11-digit BVN"
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
            className={`w-full py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-200 flex items-center justify-center text-sm sm:text-base shadow-md hover:shadow-lg ${
              isLoading
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-[var(--greenHex)] text-white hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)]'
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