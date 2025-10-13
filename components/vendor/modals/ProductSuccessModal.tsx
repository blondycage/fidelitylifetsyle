'use client';
import React from 'react';
import { CloseCircle } from 'iconsax-react';

interface ProductSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductSuccessModal: React.FC<ProductSuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
          {/* Success Icon with concentric circles */}
          <div className="relative mb-8">
            {/* Outer circle - lightest green */}
            <div className="absolute inset-0 w-32 h-32 bg-green-100 rounded-full opacity-40"></div>
            {/* Middle circle */}
            <div className="absolute inset-0 w-32 h-32 flex items-center justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full opacity-60"></div>
            </div>
            {/* Inner circle with icon */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="w-16 h-16 bg-[#6CC049] rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-urbanist">
            Product Created Successfully!
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8 font-urbanist">
            Your product has been created and images uploaded successfully. You can now view it in your store.
          </p>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#6CC049] text-white rounded-full hover:bg-[#5AA03A] transition-all duration-200 font-medium font-urbanist"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};