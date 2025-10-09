'use client';
import React, { useState } from 'react';
import { CloseCircle } from 'iconsax-react';

interface UpdatePricesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (updateType: 'percentage' | 'fixed' | 'new', value: number) => void;
  selectedCount: number;
}

export const UpdatePricesModal: React.FC<UpdatePricesModalProps> = ({
  isOpen,
  onClose,
  onApply,
  selectedCount
}) => {
  const [updateType, setUpdateType] = useState<'percentage' | 'fixed' | 'new'>('percentage');
  const [value, setValue] = useState<string>('');

  if (!isOpen) return null;

  const handleApply = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || value === '') {
      return;
    }
    onApply(updateType, numValue);
    setValue('');
  };

  const handleClose = () => {
    setValue('');
    setUpdateType('percentage');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <CloseCircle size={24} variant="Bold" />
        </button>

        {/* Content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Prices</h2>
          <p className="text-sm text-gray-500">
            Apply a price update to all selected products
          </p>
        </div>

        {/* Radio Options */}
        <div className="space-y-4 mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="updateType"
              value="percentage"
              checked={updateType === 'percentage'}
              onChange={(e) => setUpdateType(e.target.value as 'percentage')}
              className="w-5 h-5 text-[var(--greenHex)] border-gray-300 focus:ring-[var(--greenHex)]"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">Increase by percentage</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="updateType"
              value="fixed"
              checked={updateType === 'fixed'}
              onChange={(e) => setUpdateType(e.target.value as 'fixed')}
              className="w-5 h-5 text-[var(--greenHex)] border-gray-300 focus:ring-[var(--greenHex)]"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">Increase by fixed amount</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="updateType"
              value="new"
              checked={updateType === 'new'}
              onChange={(e) => setUpdateType(e.target.value as 'new')}
              className="w-5 h-5 text-[var(--greenHex)] border-gray-300 focus:ring-[var(--greenHex)]"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">Set new price</span>
          </label>
        </div>

        {/* Value Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {updateType === 'percentage' && 'Percentage (%)'}
            {updateType === 'fixed' && 'Amount ($)'}
            {updateType === 'new' && 'New Price ($)'}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={updateType === 'percentage' ? '10' : '50'}
            className="w-full px-4 py-3 !bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-[var(--greenHex)] focus:!bg-gray-100 transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!value || value === '0'}
            className="flex-1 px-6 py-3 bg-[var(--greenHex)] text-white rounded-full hover:bg-green-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
