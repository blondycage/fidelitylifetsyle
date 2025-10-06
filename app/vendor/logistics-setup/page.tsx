'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash } from 'iconsax-react';
import { VendorDashboardLayout } from '@/components/vendor/VendorDashboardLayout';

interface LogisticsArea {
  id: string;
  areaName: string;
  deliveryFee: number;
  status: 'Active' | 'Inactive';
}

const LogisticsSetup = () => {
  const router = useRouter();

  // Get areas from localStorage or use default mock data
  const getInitialAreas = (): LogisticsArea[] => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('logisticsAreas');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [
      { id: '1', areaName: 'Ikeja, LA', deliveryFee: 20, status: 'Active' },
      { id: '2', areaName: 'Lekki, LA', deliveryFee: 25, status: 'Active' },
      { id: '3', areaName: 'Victoria Island, LA', deliveryFee: 30, status: 'Active' },
      { id: '4', areaName: 'Surulere, LA', deliveryFee: 20, status: 'Active' },
      { id: '5', areaName: 'Yaba, LA', deliveryFee: 15, status: 'Active' },
    ];
  };

  const [areas, setAreas] = useState<LogisticsArea[]>(getInitialAreas());

  // Save to localStorage whenever areas change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('logisticsAreas', JSON.stringify(areas));
    }
  }, [areas]);

  return (
    <VendorDashboardLayout>
      <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Logistics Setup</h1>
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
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Area Name</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Delivery Fee</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{area.areaName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">${area.deliveryFee}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    {area.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => router.push(`/vendor/logistics-setup/${area.id}`)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit size={20} color="currentColor" />
                    </button>
                    <button
                      onClick={() => router.push(`/vendor/logistics-setup/${area.id}?action=delete`)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash size={20} color="currentColor" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </VendorDashboardLayout>
  );
};

export default LogisticsSetup;
