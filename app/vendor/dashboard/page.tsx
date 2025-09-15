'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ChangePasswordModal } from '@/components/ui/ChangePasswordModal';
import { FidelityLogo } from '@/components/ui/FidelityLogo';

const VendorDashboard = () => {
  const router = useRouter();
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

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

  const handleCompleteProfile = () => {
    // Navigate to profile completion flow
    console.log('Complete profile clicked');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    toast.success('Logged out successfully!');
    router.push('/signin');
  };

  const handleChangePasswordSuccess = () => {
    toast.success('Password changed successfully!');
  };

  if (!isOTPVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFB] via-[#E6F7FF] to-[#E8FFF1] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--blueHex)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFB] via-[#E6F7FF] to-[#E8FFF1]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FidelityLogo size="lg" />
              </div>
              <div className="ml-10">
                <nav className="flex space-x-8">
                  <a href="#" className="text-[var(--blueHex)] font-medium">Dashboard</a>
                  <a href="#" className="text-[var(--greyHex)] hover:text-[var(--blueHex)]">Business</a>
                  <a href="#" className="text-[var(--greyHex)] hover:text-[var(--blueHex)]">Analytics</a>
                  <a href="#" className="text-[var(--greyHex)] hover:text-[var(--blueHex)]">Settings</a>
                </nav>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowChangePasswordModal(true)}
                className="text-[var(--greyHex)] hover:text-[var(--blueHex)] font-medium"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="text-[var(--greyHex)] hover:text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-[var(--blueHex)] mb-2 font-[var(--fontPlayfair)]">
              Welcome to Your Dashboard!
            </h2>
            <p className="text-[var(--greyHex)] mb-4 font-[var(--fontOpen)]">
              Your account has been successfully verified. Complete your profile to start managing your business.
            </p>
          </div>

          {/* Profile Completion Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-[var(--greenHex)] rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold text-[var(--blueHex)] mb-2 font-[var(--fontPlayfair)]">
                OTP Verified
              </h3>
              <p className="text-[var(--greyHex)] mb-6 font-[var(--fontOpen)]">
                Set up your vendor profile to get started
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-[var(--greenHex)] rounded-full mr-3"></div>
                    <span className="text-sm text-[var(--greyHex)]">Business Verification</span>
                  </div>
                  <span className="text-xs bg-[var(--greenHex)] text-white px-2 py-1 rounded-full">Verified</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                    <span className="text-sm text-[var(--greyHex)]">Complete Profile</span>
                  </div>
                  <span className="text-xs bg-gray-300 text-gray-600 px-2 py-1 rounded-full">Pending</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                    <span className="text-sm text-[var(--greyHex)]">Business Details</span>
                  </div>
                  <span className="text-xs bg-gray-300 text-gray-600 px-2 py-1 rounded-full">Pending</span>
                </div>
              </div>

              <button
                onClick={handleCompleteProfile}
                className="mt-6 w-full bg-[var(--blueHex)] text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:ring-offset-2"
              >
                Complete Profile
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-lg font-semibold text-[var(--blueHex)] mb-2 font-[var(--fontPlayfair)]">
                Business Verification
              </h3>
              <p className="text-sm text-[var(--greyHex)] font-[var(--fontOpen)]">
                To start selling you need to verify your business with Fidelity Bank
              </p>
              <div className="mt-4">
                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-[var(--blueHex)]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs text-[var(--greyHex)]">Existing Fidelity Account</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-[var(--greenHex)]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs text-[var(--greyHex)]">New Fidelity Account</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-lg font-semibold text-[var(--blueHex)] mb-2 font-[var(--fontPlayfair)]">
                Profile Progress
              </h3>
              <div className="mt-4">
                <div className="text-3xl font-bold text-[var(--greenHex)] mb-2">30%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[var(--greenHex)] h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <p className="text-sm text-[var(--greyHex)] mt-2 font-[var(--fontOpen)]">Complete your profile to unlock all features</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-lg font-semibold text-[var(--blueHex)] mb-2 font-[var(--fontPlayfair)]">
                Get Started
              </h3>
              <p className="text-sm text-[var(--greyHex)] mb-4 font-[var(--fontOpen)]">
                Follow these steps to get your business online
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-[var(--greenHex)] rounded-full mr-2"></div>
                  <span className="text-[var(--greyHex)]">Account created</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-[var(--greenHex)] rounded-full mr-2"></div>
                  <span className="text-[var(--greyHex)]">Email verified</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-[var(--greyHex)]">Business verification</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-[var(--greyHex)]">Start selling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={handleChangePasswordSuccess}
      />
    </div>
  );
};

export default VendorDashboard;