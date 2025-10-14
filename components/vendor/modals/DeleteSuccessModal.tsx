'use client';
import React from 'react';
import { CloseCircle, Trash } from 'iconsax-react';

interface DeleteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteSuccessModal: React.FC<DeleteSuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" style={{ minHeight: '100vh' }}>
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <CloseCircle size={24} variant="Bold" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Area Deleted</h2>

          {/* Delete Icon with concentric circles */}
          <div className="relative mb-8">
            {/* Outer circle - lightest red */}
            <div className="absolute inset-0 w-32 h-32 bg-red-100 rounded-full opacity-40"></div>
            {/* Middle circle */}
            <div className="absolute inset-0 w-32 h-32 flex items-center justify-center">
              <div className="w-24 h-24 bg-red-100 rounded-full opacity-60"></div>
            </div>
            {/* Inner circle with icon */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <Trash size={32} color="white" variant="Bold" />
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[var(--greenHex)] text-white rounded-full hover:bg-green-600 transition-all duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
