'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'iconsax-react';
import { SuccessModal } from '@/components/vendor/modals/SuccessModal';
import { VendorDashboardLayout } from '@/components/vendor/VendorDashboardLayout';
import { useVendor } from '@/contexts/VendorContext';
import { createLogisticsArea, CreateLogisticsPayload } from '@/services/logisticsService';
import toast from 'react-hot-toast';

const AddNewArea = () => {
  const router = useRouter();
  const { vendorData, loading: vendorLoading } = useVendor();
  const [formData, setFormData] = useState({
    areaName: '',
    feeAmount: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendorData?.id || !vendorData?.email) {
      toast.error('Vendor data not available. Please try again.');
      return;
    }

    if (!formData.areaName.trim()) {
      toast.error('Area name is required');
      return;
    }

    if (!formData.feeAmount || parseFloat(formData.feeAmount) <= 0) {
      toast.error('Please enter a valid delivery fee');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: CreateLogisticsPayload = {
        deliveryArea: formData.areaName.trim(),
        deliveryFee: parseFloat(formData.feeAmount),
        vendorId: vendorData.id,
        vendorEmail: vendorData.email,
      };

      const response = await createLogisticsArea(payload);

      if (response.responseCode === 200) {
        toast.success('Delivery area created successfully');
        setShowSuccessModal(true);
      } else {
        throw new Error(response.responseMessage || 'Failed to create delivery area');
      }
    } catch (error) {
      console.error('Error creating delivery area:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create delivery area');
    } finally {
      setIsSubmitting(false);
    }
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
            Delivery Fee (₦)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.feeAmount}
            onChange={(e) => setFormData({ ...formData, feeAmount: e.target.value })}
            className="w-full px-4 py-3 !bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-[var(--greenHex)] focus:!bg-gray-100 transition-all"
            placeholder="Enter delivery fee"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting || vendorLoading}
            className={`w-full px-6 py-3 rounded-full transition-all duration-200 font-medium ${
              isSubmitting || vendorLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[var(--greenHex)] text-white hover:bg-green-600'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </div>
            ) : (
              'Add Delivery Area'
            )}
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
