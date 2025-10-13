'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createSubcategory } from '@/services/subcategoryService';
import toast from 'react-hot-toast';

interface AddSubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subcategoryName: string) => void;
  vendorId: number;
}

const AddSubcategoryModal: React.FC<AddSubcategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vendorId
}) => {
  const [subcategoryName, setSubcategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = async () => {
    if (!subcategoryName.trim()) return;

    try {
      setIsCreating(true);
      console.log('🚀 Creating subcategory:', { vendorId, subcategoryName: subcategoryName.trim() });
      
      const response = await createSubcategory(vendorId, subcategoryName.trim());
      
      if (response.responseCode === 200) {
        toast.success('Subcategory created successfully!');
        onSave(subcategoryName.trim());
        setSubcategoryName('');
        onClose();
      } else {
        toast.error(response.responseMessage || 'Failed to create subcategory');
      }
    } catch (error) {
      console.error('❌ Error creating subcategory:', error);
      toast.error('Failed to create subcategory. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setSubcategoryName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000070] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[12px] w-full max-w-[500px] h-[300px] flex flex-col justify-center px-[25px] py-[43px]">
        <div className="flex flex-col items-end gap-8 w-full max-w-[450px]">
          {/* Header and Input Section */}
          <div className="flex flex-col gap-6 w-full">
            {/* Title */}
            <h2 className="text-[24px] font-semibold font-urbanist text-black leading-[1.17]">
              Create Sub-category
            </h2>

            {/* Input Field */}
            <div className="flex flex-col gap-1 w-full">
              {/* Label */}
              <div className="flex items-center gap-1">
                <label className="text-[16px] font-normal font-urbanist text-[#616161] leading-[1.25] tracking-[0.02em]">
                  Sub-category Name
                </label>
                <span className="text-[12px] font-normal font-urbanist text-[rgba(255,56,60,0.5)] leading-[1.5] tracking-[0.017em]">
                  *
                </span>
              </div>

              {/* Input */}
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center gap-2 px-2 py-2 bg-[#EEEEEE] rounded-[8px] w-full">
                  <div className="flex items-center flex-1">
                    <input
                      type="text"
                      value={subcategoryName}
                      onChange={(e) => setSubcategoryName(e.target.value)}
                      placeholder="Continental hotel"
                      className="w-full bg-transparent text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 px-8 py-2 h-10 border-2 border-[#6CC049] rounded-[60px] bg-transparent hover:bg-[#6CC049] hover:text-white transition-colors duration-200"
            >
              <span className="text-[20px] font-semibold font-urbanist text-[#6CC049] leading-[1.2] hover:text-white">
                Cancel
              </span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!subcategoryName.trim() || isCreating}
              className={`flex items-center justify-center gap-2 px-8 py-2 h-10 rounded-[60px] transition-colors duration-200 ${
                subcategoryName.trim() && !isCreating
                  ? 'bg-[#6CC049] hover:bg-[#5AA83A] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[20px] font-semibold font-urbanist leading-[1.2]">
                    Creating...
                  </span>
                </>
              ) : (
                <span className="text-[20px] font-semibold font-urbanist leading-[1.2]">
                  Save
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubcategoryModal;