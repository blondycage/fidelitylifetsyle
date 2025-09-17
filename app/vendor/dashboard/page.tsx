'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ChangePasswordModal } from '@/components/ui/ChangePasswordModal';
import { FidelityLogo } from '@/components/ui/FidelityLogo';
import { ProfileCompletion } from '@/components/vendor/ProfileCompletion';
import { AccountSelection } from '@/components/vendor/AccountSelection';
import { BusinessVerificationModal } from '@/components/vendor/BusinessVerificationModal';

const VendorDashboard = () => {
  const router = useRouter();
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [profileStep, setProfileStep] = useState(0);
  const [showBusinessVerificationModal, setShowBusinessVerificationModal] = useState(false);

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
    setProfileStep(1);
  };

  const handleNextStep = () => {
    if (profileStep === 1) {
      setProfileStep(2);
    } else if (profileStep === 2) {
      setProfileStep(0);
      toast.success('Profile completed successfully!');
    }
  };


  const handlePrevStep = () => {
    if (profileStep > 1) {
      setProfileStep(profileStep - 1);
    }
  };

  const handleProfileComplete = () => {
    setProfileStep(0);
    toast.success('Profile completed successfully!');
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
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
             
              </div>
              <div className="hidden lg:block ml-6 xl:ml-10">
                <nav className="flex space-x-4 xl:space-x-8">
                  <a href="#" className="text-[var(--blueHex)] font-medium text-sm xl:text-base">Dashboard</a>
                  <a href="#" className="text-[var(--greyHex)] hover:text-[var(--blueHex)] text-sm xl:text-base">Business</a>
                  <a href="#" className="text-[var(--greyHex)] hover:text-[var(--blueHex)] text-sm xl:text-base">Analytics</a>
                  <a href="#" className="text-[var(--greyHex)] hover:text-[var(--blueHex)] text-sm xl:text-base">Settings</a>
                </nav>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setShowChangePasswordModal(true)}
                className="text-[var(--greyHex)] hover:text-[var(--blueHex)] font-medium text-xs sm:text-sm hidden sm:block"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="text-[var(--greyHex)] hover:text-red-600 font-medium text-xs sm:text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          {profileStep === 0 && (
            <>
              {/* Welcome Section */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--blueHex)] mb-2 font-[var(--fontPlayfair)]">
                  Welcome to Your Dashboard!
                </h2>
                <p className="text-sm sm:text-base text-[var(--greyHex)] mb-4 font-[var(--fontOpen)]">
                  Your account has been successfully verified. Complete your profile to start managing your business.
                </p>
              </div>
            </>
          )}

          {/* Profile Completion Steps */}
          {profileStep === 1 && (
            <div className="mb-6 sm:mb-8">
              <ProfileCompletion onNext={handleNextStep} />
            </div>
          )}

          {profileStep === 2 && (
            <div className="mb-6 sm:mb-8">
              <AccountSelection
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                onExistingAccount={() => setShowBusinessVerificationModal(true)}
              />
            </div>
          )}

          {profileStep === 0 && (
            <>
              {/* Profile Completion Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[var(--greenHex)] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--blueHex)] mb-2 font-[var(--fontPlayfair)]">
                OTP Verified
              </h3>
              <p className="text-sm sm:text-base text-[var(--greyHex)] mb-4 sm:mb-6 font-[var(--fontOpen)]">
                Set up your vendor profile to get started
              </p>

              

              <button
                onClick={handleCompleteProfile}
                className="mt-4 sm:mt-6 w-full bg-[var(--blueHex)] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:ring-offset-2 text-sm sm:text-base"
              >
                Complete Profile
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--blueHex)] mb-2 font-[var(--fontPlayfair)]">
                Business Verification
              </h3>
              <p className="text-xs sm:text-sm text-[var(--greyHex)] font-[var(--fontOpen)] mb-3 sm:mb-0">
                To start selling you need to verify your business with Fidelity Bank
              </p>
              <div className="mt-3 sm:mt-4">
                <div className="flex justify-center space-x-3 sm:space-x-4">
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--blueHex)]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs text-[var(--greyHex)]">Existing Account</span>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--greenHex)]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs text-[var(--greyHex)]">New Account</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--blueHex)] mb-2 font-[var(--fontPlayfair)]">
                Profile Progress
              </h3>
              <div className="mt-3 sm:mt-4">
                <div className="text-2xl sm:text-3xl font-bold text-[var(--greenHex)] mb-2">30%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[var(--greenHex)] h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <p className="text-xs sm:text-sm text-[var(--greyHex)] mt-2 font-[var(--fontOpen)]">Complete your profile to unlock all features</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--blueHex)] mb-2 font-[var(--fontPlayfair)]">
                Get Started
              </h3>
              <p className="text-xs sm:text-sm text-[var(--greyHex)] mb-3 sm:mb-4 font-[var(--fontOpen)]">
                Follow these steps to get your business online
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-[var(--greenHex)] rounded-full mr-2"></div>
                  <span className="text-[var(--greyHex)]">Account created</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-[var(--greenHex)] rounded-full mr-2"></div>
                  <span className="text-[var(--greyHex)]">Email verified</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-[var(--greyHex)]">Business verification</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-[var(--greyHex)]">Start selling</span>
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </main>

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={handleChangePasswordSuccess}
      />

      <BusinessVerificationModal
        isOpen={showBusinessVerificationModal}
        onClose={() => setShowBusinessVerificationModal(false)}
        onComplete={handleProfileComplete}
      />
    </div>
  );
};

export default VendorDashboard;