'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  Notification,
  SearchNormal1
} from 'iconsax-react';

interface VendorDashboardLayoutProps {
  children: React.ReactNode;
}

export const VendorDashboardLayout: React.FC<VendorDashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/vendor/dashboard' },
    { name: 'Manage Store', icon: Shop, path: '/vendor/manage-store' },
    { name: 'Manage Orders', icon: Box, path: '/vendor/manage-orders' },
    { name: 'Earnings', icon: MoneyRecive, path: '/vendor/earnings' },
    { name: 'Logistics Setup', icon: Truck, path: '/vendor/logistics-setup' },
    { name: 'Business Verification', icon: Verify, path: '/vendor/business-verification' },
  ];

  const isActive = (path: string) => {
    if (path === '/vendor/dashboard') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

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
                const active = isActive(item.path);
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-blue-50 text-[var(--greenHex)]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl mr-4 transition-all duration-200 ${
                      active
                        ? 'bg-[var(--greenHex)] shadow-lg'
                        : 'bg-gray-100'
                    }`}>
                      <IconComponent
                        size={20}
                        color={active ? 'white' : '#6B7280'}
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
                className="lg:hidden p-2 rounded-md text-[var(--greenHex)] hover:text-green-700 transition-all duration-200">
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
                  <div className="absolute left-3 top-2.5">
                    <SearchNormal1 size={20} color="#9CA3AF" />
                  </div>
                </div>
              </div>

              {/* Notifications and profile */}
              <div className="flex items-center space-x-4">
                <button className="p-2 text-[var(--greenHex)] hover:text-green-700 transition-all duration-200 rounded-lg hover:bg-green-50">
                  <Notification size={24} color="currentColor" variant="Outline" />
                </button>
                <button
                  onClick={() => router.push('/vendor/profile')}
                  className="p-2 text-[var(--greenHex)] hover:text-green-700 transition-all duration-200 rounded-lg hover:bg-green-50"
                >
                  <Profile size={24} color="currentColor" variant="Outline" />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="min-h-screen bg-white">
          {/* Mobile Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 text-[var(--greenHex)] hover:text-green-700 transition-all duration-200"
              >
                <HambergerMenu size={24} color="currentColor" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Vendor Dashboard</h1>
              <button
                onClick={() => router.push('/vendor/profile')}
                className="p-2 text-gray-500"
              >
                <Profile size={24} color="currentColor" />
              </button>
            </div>
          </header>

          {/* Mobile Content */}
          <main>
            {children}
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
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setIsMobileSidebarOpen(false);
                        router.push(item.path);
                      }}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        active
                          ? 'bg-blue-50 text-[var(--greenHex)]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-xl mr-4 transition-all duration-200 ${
                        active
                          ? 'bg-[var(--greenHex)] shadow-lg'
                          : 'bg-gray-100'
                      }`}>
                        <IconComponent
                          size={20}
                          color={active ? 'white' : '#6B7280'}
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
