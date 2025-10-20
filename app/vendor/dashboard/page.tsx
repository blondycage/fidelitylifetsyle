'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useVendor } from '@/contexts/VendorContext';
import { fetchVendorProducts } from '@/services/productService';
import {
  ShoppingCart,
  CloseCircle,
  TickCircle,
  Warning2
} from 'iconsax-react';

const VendorDashboard = () => {
  const router = useRouter();
  const { vendorData, loading: vendorLoading } = useVendor();
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Empty orders data for live deployment (no order endpoints available)
  const orders: any[] = [];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');

      if (!token || userType !== 'VENDOR') {
        router.push('/signin');
        return;
      }

      setIsOTPVerified(true);
    }
  }, [router]);

  // Fetch product count when vendor data is available
  useEffect(() => {
    const fetchProductCount = async () => {
      if (!vendorData?.id || !vendorData?.businessType) {
        setLoadingProducts(false);
        return;
      }

      try {
        setLoadingProducts(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetchVendorProducts(vendorData.id, token, vendorData.businessType);
        
        if (response.responseCode === 200) {
          setProductCount(response.data.length);
        } else {
          console.error('Failed to fetch products:', response.responseMessage);
          setProductCount(0);
        }
      } catch (error) {
        console.error('Error fetching product count:', error);
        setProductCount(0);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (isOTPVerified && vendorData?.id) {
      fetchProductCount();
    }
  }, [isOTPVerified, vendorData?.id, vendorData?.businessType]);

  const handleAcceptOrder = (orderId: string) => {
    toast.success('Order accepted successfully!');
  };

  const handleRejectOrder = (orderId: string) => {
    toast.error('Order rejected');
  };

  if (!isOTPVerified || vendorLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--blueHex)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      pageTitle="Dashboard"
      pageDescription="Manage your business operations and view analytics"
    >
      {/* Business Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-urbanist">
            {vendorData?.businessProfile?.name || 'Business Name'}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Verified
            </span>
            {vendorData?.businessType && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {vendorData.businessType.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-cyan-100">
              <svg className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">₦0</p>
                <span className="ml-2 text-sm text-gray-400">No orders yet</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                {vendorData?.businessType ? 
                  `${vendorData.businessType.replace('_', ' ')} Products` : 
                  'Total Products'
                }
              </p>
              {loadingProducts ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-[var(--greenHex)] rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{productCount}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 font-urbanist">Orders</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingCart size={64} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 text-center max-w-md">
                You haven't received any orders yet. Once customers start placing orders, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-transparent">
                  {orders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black  font-bold">{order.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-bold">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-bold">{order.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-white bg-red-400 hover:bg-gradient-to-r hover:from-red-400 hover:to-red-600 transition-all duration-200"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-white bg-green-500 hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)] transition-all duration-200"
                        >
                          Accept
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;