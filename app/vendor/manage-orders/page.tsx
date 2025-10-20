'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ArrowDown } from 'iconsax-react';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  items: number;
  amount: number;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Delivered';
  date: string;
}

const ManageOrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  // Initialize empty data for live deployment (no order endpoints available)
  useEffect(() => {
    setOrders([]);
  }, []);

  const handleAccept = (orderId: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'Accepted' as const }
          : order
      )
    );
    toast.success('Order accepted successfully');
  };

  const handleReject = (orderId: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'Rejected' as const }
          : order
      )
    );
    toast.success('Order rejected');
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/vendor/manage-orders/${orderId}`);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    delivered: orders.filter(o => o.status === 'Delivered').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-100 text-orange-600';
      case 'Accepted':
        return 'bg-green-100 text-green-600';
      case 'Rejected':
        return 'bg-red-100 text-red-600';
      case 'Delivered':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <DashboardLayout 
      pageTitle="Manage Orders"
      pageDescription="View and update customer orders/bookings"
    >
      <div className="bg-[#FBFFF9] min-h-screen">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-black">Manage Orders</h1>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-white border border-[#BDBDBD] rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:border-[#6CC049]"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <img src="/images/arrow-down-icon.svg" alt="Arrow Down" className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[#757575] text-base">View and update customer orders/bookings</p>
          </div>

        {/* Statistics Cards */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Total Orders Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2F2DB] shadow-sm flex-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-[#4B5563] text-sm font-normal font-urbanist">Total Orders</p>
                <p className="!text-3xl font-black text-[#212121] font-urbanist">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-[#CCD3E1] rounded-2xl flex items-center justify-center">
                <img src="/images/shopping-cart-overview.svg" alt="Shopping Cart" className="w-10 h-10" />
              </div>
            </div>
          </div>

          {/* Pending Orders Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2F2DB] shadow-sm flex-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-[#4B5563] text-sm font-normal font-urbanist">Pending Orders</p>
                <p className="!text-3xl font-black text-[#FFBB38] font-urbanist">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-[#FFF5D9] rounded-2xl flex items-center justify-center">
                <img src="/images/clock-overview.svg" alt="Clock" className="w-10 h-10" />
              </div>
            </div>
          </div>

          {/* Delivered Today Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2F2DB] shadow-sm flex-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-[#4B5563] text-sm font-normal font-urbanist">Delivered Today</p>
                <p className="!text-3xl font-black text-[#6CC049] font-urbanist">{stats.delivered}</p>
              </div>
              <div className="w-12 h-12 bg-[#6CC049] rounded-2xl flex items-center justify-center">
                <img src="/images/check-overview.svg" alt="Check" className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#FAFAFA] rounded-lg overflow-hidden">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-gray-400 mb-6">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                You haven't received any orders yet. Once customers start placing orders, they'll appear here for you to manage.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Orders will appear here when customers make purchases</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAFAFA]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEEEE]">
                  {currentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="text-sm font-bold text-[#212121] hover:text-[#6CC049] transition-colors"
                        >
                          {order.orderId}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#212121]">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#212121]">
                        {order.items}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#212121]">
                        ₦{order.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.status === 'Pending' && (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleReject(order.id)}
                              className="px-6 py-2 bg-red-100 text-red-500 border border-red-200 rounded-full text-sm font-semibold hover:bg-red-200 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleAccept(order.id)}
                              className="px-6 py-2 bg-[#6CC049] text-white rounded-full text-sm font-semibold hover:bg-[#5AA83A] transition-colors"
                            >
                              Accept
                            </button>
                          </div>
                        )}
                        {order.status !== 'Pending' && (
                          <span className="text-sm text-gray-500">No actions available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination - Only show if there are orders */}
        {orders.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-[#212121]">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-[#6CC049] text-[#6CC049] rounded-lg text-sm font-medium hover:bg-[#6CC049] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[#84CA67] text-white'
                        : 'border border-[#6CC049] text-[#6CC049] hover:bg-[#6CC049] hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-[#6CC049] text-[#6CC049] rounded-lg text-sm font-medium hover:bg-[#6CC049] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageOrdersPage;