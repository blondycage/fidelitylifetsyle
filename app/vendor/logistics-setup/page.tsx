'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash } from 'iconsax-react';
import { VendorDashboardLayout } from '@/components/vendor/VendorDashboardLayout';
import { useVendor } from '@/contexts/VendorContext';
import { getLogisticsAreas, deleteLogisticsArea, LogisticsArea } from '@/services/logisticsService';
import { DeleteConfirmModal } from '@/components/vendor/modals/DeleteConfirmModal';
import toast from 'react-hot-toast';

const LogisticsSetup = () => {
  const router = useRouter();
  const { vendorData, loading: vendorLoading } = useVendor();
  const [areas, setAreas] = useState<LogisticsArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10,
    first: true,
    last: true,
    numberOfElements: 0
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    logisticsId: null as number | null,
    areaName: ''
  });

  // Fetch logistics areas from backend
  const fetchLogisticsAreas = async (page: number = 0, size: number = 10) => {
    if (!vendorData?.id) {
      setError('Vendor data not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getLogisticsAreas(vendorData.id, page, size);
      
      if (response.responseCode === 200) {
        const areasList = response.data.logisticsResponseList || [];
        console.log('🔍 Areas received:', areasList);
        setAreas(Array.isArray(areasList) ? areasList : []);
        
        // Calculate pagination info from the actual response structure
        const totalPages = Math.ceil(response.data.totalCount / response.data.size);
        const currentPage = response.data.page - 1; // Convert 1-based backend to 0-based frontend
        
        console.log('🔍 Setting pagination state:', {
          backendPage: response.data.page,
          backendTotalCount: response.data.totalCount,
          backendSize: response.data.size,
          calculatedTotalPages: totalPages,
          calculatedCurrentPage: currentPage,
          hasNextRecord: response.data.hasNextRecord
        });
        
        setPagination({
          currentPage: currentPage,
          totalPages: totalPages,
          totalElements: response.data.totalCount,
          size: response.data.size,
          first: response.data.page === 1,
          last: !response.data.hasNextRecord,
          numberOfElements: response.data.logisticsResponseList?.length || 0
        });
      } else {
        throw new Error(response.responseMessage || 'Failed to fetch logistics areas');
      }
    } catch (error) {
      console.error('Error fetching logistics areas:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch logistics areas');
      toast.error('Failed to load logistics areas');
    } finally {
      setLoading(false);
    }
  };

  // Load areas on component mount
  useEffect(() => {
    if (vendorData?.id && !vendorLoading) {
      fetchLogisticsAreas(0, 10);
    }
  }, [vendorData?.id, vendorLoading]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    console.log('🔍 handlePageChange called with:', {
      newPage,
      newPageType: typeof newPage,
      totalPages: pagination.totalPages,
      totalPagesType: typeof pagination.totalPages,
      currentPage: pagination.currentPage,
      currentPageType: typeof pagination.currentPage
    });
    
    // Ensure newPage is a valid number
    const validPage = Number(newPage);
    if (isNaN(validPage)) {
      console.error('❌ Invalid page number:', newPage);
      return;
    }
    
    if (validPage >= 0 && validPage < pagination.totalPages) {
      fetchLogisticsAreas(validPage, pagination.size);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    const validSize = Math.min(Math.max(newSize, 1), 100);
    fetchLogisticsAreas(0, validSize);
  };

  // Handle delete area
  const handleDeleteArea = async (logisticsId: number) => {
    try {
      const response = await deleteLogisticsArea(logisticsId);
      
      if (response.responseCode === 200) {
        toast.success('Area deleted successfully');
        // Refresh the current page
        await fetchLogisticsAreas(pagination.currentPage, pagination.size);
      } else {
        throw new Error(response.responseMessage || 'Failed to delete area');
      }
    } catch (error) {
      console.error('Error deleting area:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete area');
    } finally {
      // Close modal after operation
      setDeleteModal({ isOpen: false, logisticsId: null, areaName: '' });
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (logisticsId: number, areaName: string) => {
    setDeleteModal({
      isOpen: true,
      logisticsId,
      areaName
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteModal.logisticsId) {
      handleDeleteArea(deleteModal.logisticsId);
    }
  };

  // Handle delete modal close
  const handleDeleteModalClose = () => {
    setDeleteModal({ isOpen: false, logisticsId: null, areaName: '' });
  };

  if (vendorLoading || loading) {
    return (
      <VendorDashboardLayout>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[var(--greenHex)] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading logistics areas...</span>
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
              onClick={fetchLogisticsAreas}
              className="px-4 py-2 bg-[var(--greenHex)] text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </VendorDashboardLayout>
    );
  }

  return (
    <VendorDashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Logistics Setup</h1>
            <p className="text-sm text-gray-600 mt-1">
              Showing {pagination.numberOfElements} of {pagination.totalElements} areas
            </p>
          </div>
          <button
            onClick={() => router.push('/vendor/logistics-setup/add')}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--greenHex)] text-white rounded-full hover:bg-green-600 transition-all duration-200 font-medium"
          >
            <span className="text-xl">+</span>
            Add new area
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          {!areas || !Array.isArray(areas) || areas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery areas</h3>
              <p className="text-gray-500 mb-4">Add your first delivery area to get started</p>
              <button
                onClick={() => router.push('/vendor/logistics-setup/add')}
                className="px-4 py-2 bg-[var(--greenHex)] text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Add Area
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Area Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Delivery Fee</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(areas || []).map((area) => (
                  <tr key={area.logisticsId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{area.deliveryArea}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₦{area.deliveryFee.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => router.push(`/vendor/logistics-setup/${area.logisticsId}`)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit area"
                        >
                          <Edit size={20} color="currentColor" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(area.logisticsId, area.deliveryArea)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          title="Delete area"
                        >
                          <Trash size={20} color="currentColor" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {areas.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Show:</label>
                <select
                  value={pagination.size}
                  onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[var(--greenHex)] focus:border-[var(--greenHex)]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  console.log('🔍 First button clicked');
                  handlePageChange(0);
                }}
                disabled={pagination.first}
                className={`px-3 py-1 text-sm rounded-md ${
                  pagination.first
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                First
              </button>
              
              <button
                onClick={() => {
                  const prevPage = Number(pagination.currentPage) - 1;
                  console.log('🔍 Previous button clicked:', { currentPage: pagination.currentPage, prevPage });
                  handlePageChange(prevPage);
                }}
                disabled={pagination.first}
                className={`px-3 py-1 text-sm rounded-md ${
                  pagination.first
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>

              <span className="px-3 py-1 text-sm text-gray-700">
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </span>

              <button
                onClick={() => {
                  const nextPage = Number(pagination.currentPage) + 1;
                  console.log('🔍 Next button clicked:', { currentPage: pagination.currentPage, nextPage });
                  handlePageChange(nextPage);
                }}
                disabled={pagination.last}
                className={`px-3 py-1 text-sm rounded-md ${
                  pagination.last
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Next
              </button>

              <button
                onClick={() => {
                  const lastPage = Number(pagination.totalPages) - 1;
                  console.log('🔍 Last button clicked:', { totalPages: pagination.totalPages, lastPage });
                  handlePageChange(lastPage);
                }}
                disabled={pagination.last}
                className={`px-3 py-1 text-sm rounded-md ${
                  pagination.last
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Last
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteModalClose}
          onConfirm={handleDeleteConfirm}
          areaName={deleteModal.areaName}
        />
      </div>
    </VendorDashboardLayout>
  );
};

export default LogisticsSetup;
