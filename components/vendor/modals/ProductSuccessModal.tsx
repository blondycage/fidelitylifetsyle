'use client';
import React from 'react';
import { CloseCircle } from 'iconsax-react';

interface ProductSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  productCreationResult?: { success: boolean; productId?: number; error?: string } | null;
  imageUploadResult?: { success: boolean; error?: string } | null;
}

export const ProductSuccessModal: React.FC<ProductSuccessModalProps> = ({
  isOpen,
  onClose,
  productCreationResult,
  imageUploadResult
}) => {
  // Debug logging
  console.log('🔍 ProductSuccessModal - productCreationResult:', productCreationResult);
  console.log('🔍 ProductSuccessModal - imageUploadResult:', imageUploadResult);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ minHeight: '100vh' }}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <CloseCircle size={24} variant="Bold" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Dynamic Icon based on results */}
          <div className="relative mb-8">
            {/* Outer circle */}
            <div className={`absolute inset-0 w-32 h-32 rounded-full opacity-40 ${
              productCreationResult?.success && imageUploadResult?.success 
                ? 'bg-green-100' 
                : productCreationResult?.success 
                ? 'bg-yellow-100' 
                : 'bg-red-100'
            }`}></div>
            {/* Middle circle */}
            <div className="absolute inset-0 w-32 h-32 flex items-center justify-center">
              <div className={`w-24 h-24 rounded-full opacity-60 ${
                productCreationResult?.success && imageUploadResult?.success 
                  ? 'bg-green-100' 
                  : productCreationResult?.success 
                  ? 'bg-yellow-100' 
                  : 'bg-red-100'
              }`}></div>
            </div>
            {/* Inner circle with icon */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                productCreationResult?.success && imageUploadResult?.success 
                  ? 'bg-[#6CC049]' 
                  : productCreationResult?.success 
                  ? 'bg-[#FF9800]' 
                  : 'bg-[#F44336]'
              }`}>
                {productCreationResult?.success && imageUploadResult?.success ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : productCreationResult?.success ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 18L18 6M6 6L18 18"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-urbanist">
            {productCreationResult?.success && imageUploadResult?.success 
              ? 'Product Created Successfully!' 
              : productCreationResult?.success 
              ? 'Product Created with Issues' 
              : 'Product Creation Failed'}
          </h2>

          {/* Dynamic Description */}
          <div className="text-gray-600 mb-8 font-urbanist space-y-3">
            {productCreationResult?.success && imageUploadResult?.success ? (
              <p>Your product has been created and images uploaded successfully. You can now view it in your store.</p>
            ) : productCreationResult?.success ? (
              <div className="space-y-2">
                <p className="text-green-600 font-semibold">✅ Product created successfully!</p>
                <p className="text-red-600 font-semibold">❌ Image upload failed: {imageUploadResult?.error || 'Unknown error'}</p>
                <p className="text-sm">You can edit your product in the dashboard to add images later.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-600 font-semibold">❌ Product creation failed: {productCreationResult?.error || 'Unknown error'}</p>
                <p className="text-sm">Please try again or contact support if the issue persists.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            {productCreationResult?.success && (
              <button
                onClick={() => {
                  window.location.href = '/vendor/manage-store';
                  onClose();
                }}
                className="w-full px-6 py-3 bg-[#6CC049] text-white rounded-full hover:bg-[#5AA03A] transition-all duration-200 font-medium font-urbanist"
              >
                View in Dashboard
              </button>
            )}
            <button
              onClick={onClose}
              className={`w-full px-6 py-3 rounded-full transition-all duration-200 font-medium font-urbanist ${
                productCreationResult?.success 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-[#6CC049] text-white hover:bg-[#5AA03A]'
              }`}
            >
              {productCreationResult?.success ? 'Close' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};