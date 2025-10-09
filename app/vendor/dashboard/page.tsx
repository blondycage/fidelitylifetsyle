'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  ShoppingCart,
  CloseCircle,
  TickCircle,
  Warning2
} from 'iconsax-react';

const VendorDashboard = () => {
  const router = useRouter();
  const [isOTPVerified, setIsOTPVerified] = useState(false);

  // Sample orders data
  const orders = [
    { id: '#123456', customer: 'John Doe', product: 'Presidential suite', amount: '$400', status: 'Pending' },
    { id: '#123456', customer: 'John Doe', product: 'Presidential suite', amount: '$400', status: 'Pending' },
    { id: '#123456', customer: 'John Doe', product: 'Presidential suite', amount: '$400', status: 'Pending' },
    { id: '#123456', customer: 'John Doe', product: 'Presidential suite', amount: '$400', status: 'Pending' },
    { id: '#123456', customer: 'John Doe', product: 'Presidential suite', amount: '$400', status: 'Pending' },
    { id: '#123456', customer: 'John Doe', product: 'Presidential suite', amount: '$400', status: 'Pending' },
  ];

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

  const handleAcceptOrder = (orderId: string) => {
    toast.success('Order accepted successfully!');
  };

  const handleRejectOrder = (orderId: string) => {
    toast.error('Order rejected');
  };

  if (!isOTPVerified) {
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-urbanist">Lagos Continental Hotel</h1>
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Verified
            </span>
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
                <p className="text-2xl font-bold text-gray-900">$12,000</p>
                <span className="ml-2 text-sm text-green-600">+44%</span>
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
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">200</p>
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
              <p className="text-2xl font-bold text-gray-900">$50</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 font-urbanist">Orders</h2>
        </div>
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
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;