'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'iconsax-react';
import { SuccessModal } from '@/components/vendor/modals/SuccessModal';
import { DeleteConfirmModal } from '@/components/vendor/modals/DeleteConfirmModal';
import { DeleteSuccessModal } from '@/components/vendor/modals/DeleteSuccessModal';
import { VendorDashboardLayout } from '@/components/vendor/VendorDashboardLayout';
import { useVendor } from '@/contexts/VendorContext';
import { getLogisticsAreaById, updateLogisticsArea, deleteLogisticsArea, LogisticsArea } from '@/services/logisticsService';
import toast from 'react-hot-toast';

const AreaDetail = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { vendorData, loading: vendorLoading } = useVendor();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    areaName: '',
    feeAmount: '',
  });

  const logisticsId = params?.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    const loadAreaData = async () => {
      if (!logisticsId) {
        setError('Invalid area ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Loading area with ID:', logisticsId);
        
        const response = await getLogisticsAreaById(logisticsId);
        
        console.log('🔍 Edit page response:', response);
        
        if (response.responseCode === 200) {
          const area = response.data;
          
          console.log('🔍 Area data received:', area);
          
          if (area) {
            setFormData({
              areaName: area.deliveryArea,
              feeAmount: area.deliveryFee.toString(),
            });
          } else {
            setError('Area not found');
          }
        } else {
          throw new Error(response.responseMessage || 'Failed to load area data');
        }
      } catch (error) {
        console.error('Error loading area data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load area data');
      } finally {
        setLoading(false);
      }
    };

    if (!vendorLoading) {
      loadAreaData();
    }

    // Check if delete action is requested
    const action = searchParams?.get('action');
    if (action === 'delete') {
      setShowDeleteConfirm(true);
    }
  }, [searchParams, params?.id, vendorLoading, logisticsId]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    if (!vendorData?.id || !vendorData?.email || !logisticsId) {
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

      const payload = {
        deliveryArea: formData.areaName.trim(),
        deliveryFee: parseFloat(formData.feeAmount),
        vendorId: vendorData.id,
        vendorEmail: vendorData.email,
      };

      const response = await updateLogisticsArea(logisticsId, payload);

      if (response.responseCode === 200) {
        toast.success('Area updated successfully');
        setShowSuccessModal(true);
        setIsEditMode(false);
      } else {
        throw new Error(response.responseMessage || 'Failed to update area');
      }
    } catch (error) {
      console.error('Error updating area:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update area');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!logisticsId) {
      toast.error('Invalid area ID');
      return;
    }

    try {
      setShowDeleteConfirm(false);
      setIsSubmitting(true);

      const response = await deleteLogisticsArea(logisticsId);

      if (response.responseCode === 200) {
        toast.success('Area deleted successfully');
        setShowDeleteSuccess(true);
      } else {
        throw new Error(response.responseMessage || 'Failed to delete area');
      }
    } catch (error) {
      console.error('Error deleting area:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete area');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseDeleteSuccess = () => {
    setShowDeleteSuccess(false);
    router.push('/vendor/logistics-setup');
  };

  if (vendorLoading || loading) {
    return (
      <VendorDashboardLayout>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[var(--greenHex)] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading area details...</span>
            </div>
          </div>
        </div>
      </VendorDashboardLayout>
    );
  }

  if (error) {
    return (
      <VendorDashboardLayout>
        <div className="p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-[var(--greenHex)] text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </VendorDashboardLayout>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit area details' : formData.areaName}
          </h1>
        </div>

      {/* Form/Details */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl space-y-6">
        {/* Area Name */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Area name
          </label>
          {isEditMode ? (
            <input
              type="text"
              value={formData.areaName}
              onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
              className="w-full px-4 py-3 !bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-[var(--greenHex)] focus:!bg-gray-100 transition-all"
              required
            />
          ) : (
            <p className="text-base text-gray-900 py-2">{formData.areaName}</p>
          )}
        </div>

        {/* Fee Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Delivery Fee (₦)
          </label>
          {isEditMode ? (
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.feeAmount}
              onChange={(e) => setFormData({ ...formData, feeAmount: e.target.value })}
              className="w-full px-4 py-3 !bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-[var(--greenHex)] focus:!bg-gray-100 transition-all"
              required
            />
          ) : (
            <p className="text-base text-gray-900 py-2">₦{parseFloat(formData.feeAmount || '0').toLocaleString()}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex gap-4">
          {isEditMode ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-full transition-all duration-200 font-medium ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[var(--greenHex)] text-white hover:bg-green-600'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="flex-1 px-6 py-3 bg-[var(--greenHex)] text-white rounded-full hover:bg-green-600 transition-all duration-200 font-medium"
            >
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isSubmitting}
            className={`flex-1 px-6 py-3 rounded-full transition-all duration-200 font-medium ${
              isSubmitting
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-red-100 text-red-500 hover:bg-red-200'
            }`}
          >
            Delete
          </button>
        </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="Area Saved"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />

      {/* Delete Success Modal */}
      <DeleteSuccessModal
        isOpen={showDeleteSuccess}
        onClose={handleCloseDeleteSuccess}
      />
      </div>
    </VendorDashboardLayout>
  );
};

export default AreaDetail;
