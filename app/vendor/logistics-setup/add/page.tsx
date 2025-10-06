'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'iconsax-react';
import { SuccessModal } from '@/components/vendor/modals/SuccessModal';
import { VendorDashboardLayout } from '@/components/vendor/VendorDashboardLayout';

const AddNewArea = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    areaName: '',
    feeAmount: '',
    active: true,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get existing areas from localStorage
    const saved = localStorage.getItem('logisticsAreas');
    const areas = saved ? JSON.parse(saved) : [];

    // Create new area
    const newArea = {
      id: Date.now().toString(),
      areaName: formData.areaName,
      deliveryFee: parseFloat(formData.feeAmount),
      status: formData.active ? 'Active' : 'Inactive'
    };

    // Add to areas and save
    areas.push(newArea);
    localStorage.setItem('logisticsAreas', JSON.stringify(areas));

    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.push('/vendor/logistics-setup');
  };

  return (
    <VendorDashboardLayout>
      <div className="p-6 lg:p-8">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={24} color="currentColor" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add new area</h1>
      </div>

      {/* Form */}
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
        {/* Area Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area name
          </label>
          <input
            type="text"
            value={formData.areaName}
            onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
            className="w-full px-4 py-3 !bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-[var(--greenHex)] focus:!bg-gray-100 transition-all"
            placeholder=""
            required
          />
        </div>

        {/* Fee Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fee amount
          </label>
          <input
            type="text"
            value={formData.feeAmount}
            onChange={(e) => setFormData({ ...formData, feeAmount: e.target.value })}
            className="w-full px-4 py-3 !bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-[var(--greenHex)] focus:!bg-gray-100 transition-all"
            placeholder=""
            required
          />
        </div>

        {/* Active Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Active
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, active: !formData.active })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.active ? 'bg-[var(--greenHex)]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-[var(--greenHex)] text-white rounded-full hover:bg-green-600 transition-all duration-200 font-medium"
          >
            Add
          </button>
        </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        title="Area Added"
      />
      </div>
    </VendorDashboardLayout>
  );
};

export default AddNewArea;
