'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'iconsax-react';
import { SuccessModal } from '@/components/vendor/modals/SuccessModal';
import { DeleteConfirmModal } from '@/components/vendor/modals/DeleteConfirmModal';
import { DeleteSuccessModal } from '@/components/vendor/modals/DeleteSuccessModal';
import { VendorDashboardLayout } from '@/components/vendor/VendorDashboardLayout';

const AreaDetail = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const [formData, setFormData] = useState({
    areaName: '',
    feeAmount: '',
    active: true,
  });

  useEffect(() => {
    // Load area data from localStorage
    const saved = localStorage.getItem('logisticsAreas');
    if (saved) {
      const areas = JSON.parse(saved);
      const area = areas.find((a: any) => a.id === params?.id);
      if (area) {
        setFormData({
          areaName: area.areaName,
          feeAmount: area.deliveryFee.toString(),
          active: area.status === 'Active',
        });
      }
    }

    // Check if delete action is requested
    const action = searchParams?.get('action');
    if (action === 'delete') {
      setShowDeleteConfirm(true);
    }
  }, [searchParams, params?.id]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    // Get existing areas from localStorage
    const saved = localStorage.getItem('logisticsAreas');
    if (saved) {
      const areas = JSON.parse(saved);
      const index = areas.findIndex((a: any) => a.id === params?.id);
      if (index !== -1) {
        areas[index] = {
          ...areas[index],
          areaName: formData.areaName,
          deliveryFee: parseFloat(formData.feeAmount),
          status: formData.active ? 'Active' : 'Inactive',
        };
        localStorage.setItem('logisticsAreas', JSON.stringify(areas));
      }
    }

    setShowSuccessModal(true);
    setIsEditMode(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);

    // Remove from localStorage
    const saved = localStorage.getItem('logisticsAreas');
    if (saved) {
      const areas = JSON.parse(saved);
      const filtered = areas.filter((a: any) => a.id !== params?.id);
      localStorage.setItem('logisticsAreas', JSON.stringify(filtered));
    }

    setShowDeleteSuccess(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseDeleteSuccess = () => {
    setShowDeleteSuccess(false);
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
            Fee amount
          </label>
          {isEditMode ? (
            <input
              type="text"
              value={formData.feeAmount}
              onChange={(e) => setFormData({ ...formData, feeAmount: e.target.value })}
              className="w-full px-4 py-3 !bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-[var(--greenHex)] focus:!bg-gray-100 transition-all"
              required
            />
          ) : (
            <p className="text-base text-gray-900 py-2">${formData.feeAmount}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Status
          </label>
          {isEditMode ? (
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
              <span className="ml-3 text-sm text-gray-700">Active</span>
            </div>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium py-2">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              Active
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex gap-4">
          {isEditMode ? (
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-[var(--greenHex)] text-white rounded-full hover:bg-green-600 transition-all duration-200 font-medium"
            >
              Save
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
            className="flex-1 px-6 py-3 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-all duration-200 font-medium"
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
