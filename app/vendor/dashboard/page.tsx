'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FidelityLogo } from '@/components/ui/FidelityLogo';
import {
  Home,
  Shop,
  Box,
  MoneyRecive,
  Truck,
  Verify,
  Profile,
  LogoutCurve,
  HambergerMenu,
  CloseCircle,
  Notification
} from 'iconsax-react';

const VendorDashboard = () => {
  const router = useRouter();
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    toast.success('Logged out successfully!');
    router.push('/signin');
  };

  const handleAcceptOrder = (orderId: string) => {
    toast.success('Order accepted successfully!');
  };

  const handleRejectOrder = (orderId: string) => {
    toast.error('Order rejected');
  };

  const menuItems = [
    { name: 'Dashboard', icon: Home, active: true },
    { name: 'Manage Store', icon: Shop, active: false },
    { name: 'Manage Orders', icon: Box, active: false },
    { name: 'Earnings', icon: MoneyRecive, active: false },
    { name: 'Logistics Setup', icon: Truck, active: false },
    { name: 'Business Verification', icon: Verify, active: false },
  ];

  if (!isOTPVerified) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--blueHex)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <div className="lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 flex">
        <div className="flex flex-col flex-grow bg-white shadow-lg overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-start h-16 px-4 bg-white">
            <FidelityLogo showText={false} size="md" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveMenuItem(item.name);
                    if (item.name === 'Business Verification') {
                      router.push('/vendor/business-verification');
                    }
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeMenuItem === item.name
                      ? 'bg-blue-50 text-[var(--greenHex)]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl mr-4 transition-all duration-200 ${
                    activeMenuItem === item.name
                      ? 'bg-[var(--greenHex)] shadow-lg'
                      : 'bg-gray-100'
                  }`}>
                    <IconComponent
                      size={20}
                      color={activeMenuItem === item.name ? 'white' : '#6B7280'}
                    />
                  </div>
                  <span className="font-semibold">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => router.push('/vendor/profile')}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl mr-4 bg-gray-100">
                <Profile size={20} color="#6B7280" />
              </div>
              <span className="font-semibold">Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl mr-4 bg-red-100">
                <LogoutCurve size={20} color="#DC2626" />
              </div>
              <span className="font-semibold">Log out</span>
            </button>
          </div>
        </div>
      </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-[var(--greenHex)] hover:text-green-700 transition-colors">
              <HambergerMenu size={24} color="currentColor" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Notifications and profile */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-[var(--greenHex)] hover:text-green-700 transition-colors rounded-lg hover:bg-green-50">
                <Notification size={24} color="currentColor" variant="Outline" />
              </button>
              <button className="p-2 text-[var(--greenHex)] hover:text-green-700 transition-colors rounded-lg hover:bg-green-50">
                <Profile size={24} color="currentColor" variant="Outline" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
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
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-white bg-red-400 hover:bg-red-500 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-white bg-green-500 hover:bg-green-600 transition-colors"
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
        </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile view content */}
        <div className="min-h-screen bg-white">
          {/* Mobile Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 text-[var(--greenHex)] hover:text-green-700 transition-colors"
              >
                <HambergerMenu size={24} color="currentColor" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
              <button className="p-2 text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </header>

          {/* Mobile Content */}
          <main className="p-4">
            {/* Business Header */}
            <div className="mb-6">
              <div className="flex flex-col space-y-2">
                <h1 className="text-xl font-bold text-gray-900 font-urbanist">Lagos Continental Hotel</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                  ✓ Verified
                </span>
              </div>
            </div>

            {/* Mobile Stats Cards */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-cyan-100">
                    <svg className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Total Earnings</p>
                    <div className="flex items-center">
                      <p className="text-lg font-bold text-gray-900">$12,000</p>
                      <span className="ml-2 text-xs text-green-600">+44%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Total Products</p>
                    <p className="text-lg font-bold text-gray-900">200</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-orange-100">
                    <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Pending Orders</p>
                    <p className="text-lg font-bold text-gray-900">$50</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Orders List */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-900 font-urbanist">Recent Orders</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {orders.slice(0, 3).map((order, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{order.customer}</h3>
                        <p className="text-xs text-gray-500">{order.product}</p>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{order.amount}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className="flex-1 px-3 py-2 border border-transparent text-xs font-medium rounded-full text-white bg-red-400 hover:bg-red-500 transition-colors text-center"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAcceptOrder(order.id)}
                        className="flex-1 px-3 py-2 border border-transparent text-xs font-medium rounded-full text-white bg-green-500 hover:bg-green-600 transition-colors text-center"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <CloseCircle size={24} color="white" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-center px-4 mb-8">
                <FidelityLogo showText={false} size="md" />
              </div>
              <nav className="px-4 space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveMenuItem(item.name);
                        setIsMobileSidebarOpen(false);
                        if (item.name === 'Business Verification') {
                          router.push('/vendor/business-verification');
                        }
                      }}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        activeMenuItem === item.name
                          ? 'bg-blue-50 text-[var(--greenHex)]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-xl mr-4 transition-all duration-200 ${
                        activeMenuItem === item.name
                          ? 'bg-[var(--greenHex)] shadow-lg'
                          : 'bg-gray-100'
                      }`}>
                        <IconComponent
                          size={20}
                          color={activeMenuItem === item.name ? 'white' : '#6B7280'}
                        />
                      </div>
                      <span className="font-semibold">{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 space-y-2">
              <button
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                  router.push('/vendor/profile');
                }}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl mr-4 bg-gray-100">
                  <Profile size={20} color="#6B7280" />
                </div>
                <span className="font-semibold">Profile</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl mr-4 bg-red-100">
                  <LogoutCurve size={20} color="#DC2626" />
                </div>
                <span className="font-semibold">Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;