'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FidelityLogo } from '@/components/ui/FidelityLogo';
import {
  Home,
  Shop,
  Box,
  MoneyRecive,
  Truck,
  Verify,
  Profile,
  Logout,
  SearchNormal1,
  Notification,
  ArrowLeft,
  CloseCircle,
  Building4,
  UserAdd,
  ArrowRight2
} from 'iconsax-react';
import { BusinessVerificationModal } from '@/components/vendor/BusinessVerificationModal';

const BusinessVerification = () => {
  const router = useRouter();
  const [activeMenuItem, setActiveMenuItem] = useState('Business Verification');
  const [showExistingAccountModal, setShowExistingAccountModal] = useState(false);
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [formData, setFormData] = useState({
    accountNumber: '',
    bvn: ''
  });
  const [newAccountFormData, setNewAccountFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    bvn: '',
    businessName: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [newAccountErrors, setNewAccountErrors] = useState<{[key: string]: string}>({});

  const menuItems = [
    { name: 'Dashboard', icon: Home, active: false },
    { name: 'Manage Store', icon: Shop, active: false },
    { name: 'Manage Orders', icon: Box, active: false },
    { name: 'Earnings', icon: MoneyRecive, active: false },
    { name: 'Logistics Setup', icon: Truck, active: false },
    { name: 'Business Verification', icon: Verify, active: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    router.push('/signin');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAccountFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateExistingAccountForm = () => {
    const newErrors: {[key: string]: string} = {};

   

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (formData.accountNumber.length < 10) {
      newErrors.accountNumber = 'Account number must be at least 10 digits';
    }

    if (!formData.bvn.trim()) {
      newErrors.bvn = 'BVN is required';
    } else if (formData.bvn.length !== 11) {
      newErrors.bvn = 'BVN must be exactly 11 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewAccountForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!newAccountFormData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!newAccountFormData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!newAccountFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newAccountFormData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!newAccountFormData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!newAccountFormData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!newAccountFormData.bvn.trim()) {
      newErrors.bvn = 'BVN is required';
    } else if (newAccountFormData.bvn.length !== 11) {
      newErrors.bvn = 'BVN must be exactly 11 digits';
    }

    setNewAccountErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateExistingAccountForm()) {
      console.log('Form submitted:', formData);
      setShowExistingAccountModal(false);
    }
  };

  const handleNewAccountSubmit = () => {
    if (validateNewAccountForm()) {
      console.log('New account form submitted:', newAccountFormData);
      setShowNewAccountModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <div className="lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 flex">
        <div className="flex flex-col flex-grow bg-white shadow-lg overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-white">
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
                    if (item.name === 'Dashboard') {
                      router.push('/vendor/dashboard');
                    }
                  }}
                  className={`w-full flex items-center px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                    activeMenuItem === item.name
                      ? 'bg-[var(--greenHex)] text-white shadow-md'
                      : 'text-[var(--greyHex)] hover:bg-blue-50 hover:text-[var(--greenHex)]'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-200 ${
                    activeMenuItem === item.name
                      ? 'bg-white/20'
                      : 'bg-transparent group-hover:bg-blue-100'
                  }`}>
                    <IconComponent
                      size={18}
                      color={activeMenuItem === item.name ? 'white' : 'currentColor'}
                      variant={activeMenuItem === item.name ? 'Bold' : 'Outline'}
                    />
                  </div>
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => router.push('/vendor/profile')}
              className="w-full flex items-center px-3 py-3 text-sm font-semibold text-[var(--greyHex)] rounded-xl hover:bg-blue-50 hover:text-[var(--greenHex)] transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg mr-3 bg-transparent group-hover:bg-blue-100 transition-all duration-200">
                <Profile size={18} color="currentColor" variant="Outline" />
              </div>
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-3 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg mr-3 bg-transparent group-hover:bg-red-100 transition-all duration-200">
                <Logout size={18} color="currentColor" variant="Outline" />
              </div>
              Log out
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
            <button className="lg:hidden p-2 rounded-md text-[var(--greenHex)] hover:text-blue-700 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" />
              </svg>
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blueHex)] focus:border-[var(--blueHex)] transition-colors"
                />
                <SearchNormal1 size={20} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Notifications and profile */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-[var(--greyHex)] hover:text-[var(--greenHex)] transition-colors rounded-lg hover:bg-blue-50">
                <Notification size={24} variant="Outline" />
              </button>
              <button className="p-2 text-[var(--greyHex)] hover:text-[var(--greenHex)] transition-colors rounded-lg hover:bg-blue-50">
                <Profile size={24} variant="Outline" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-urbanist">Business Verification</h1>
            <p className="mt-2 text-gray-600">Let's get your business ready for customers.</p>
          </div>

          {/* Verification Options */}
          <div className="flex justify-center">
            <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Existing Fidelity Account */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl transition-all duration-200">
              <div className="w-16 h-16 bg-[var(--greenHex)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Building4 size={32} color="white" variant="Bold" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 font-urbanist">Existing Fidelity Account</h2>
              <p className="text-[var(--greyHex)] mb-6">{isVerified ? 'Verification completed successfully!' : 'Connect Your Existing Fidelity Bank Account'}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => !isVerified && setShowExistingAccountModal(true)}
                  disabled={isVerified}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg ${
                    isVerified
                      ? 'bg-green-500 cursor-default'
                      : 'bg-[var(--greenHex)] hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)]'
                  }`}
                >
                  {isVerified ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <ArrowRight2 size={20} color="white" />
                  )}
                </button>
              </div>
            </div>

            {/* New Fidelity Account */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl transition-all duration-200">
              <div className="w-16 h-16 bg-[var(--greenHex)] rounded-full flex items-center justify-center mx-auto mb-6">
                <UserAdd size={32} color="white" variant="Bold" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 font-urbanist">New Fidelity Account</h2>
              <p className="text-[var(--greyHex)] mb-6">Create a New Fidelity Bank Account</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowNewAccountModal(true)}
                  className="w-12 h-12 bg-[var(--greenHex)] rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)]"
                >
                  <ArrowRight2 size={20} color="white" />
                </button>
              </div>
            </div>
            </div>
          </div>
        </main>
        </div>
      </div>

      {/* Mobile Responsive Layout */}
      <div className="lg:hidden">
        {/* Mobile view content */}
        <div className="min-h-screen bg-white">
          {/* Mobile Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="p-2 text-[var(--greenHex)] hover:text-blue-700 transition-colors rounded-lg hover:bg-blue-50"
              >
                <ArrowLeft size={24} color="currentColor" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Business Verification</h1>
              <div className="w-8"></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Let's get your business ready for customers.</p>
          </header>

          {/* Mobile Content */}
          <main className="p-4 space-y-6">
            {/* Existing Fidelity Account */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-[var(--greenHex)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Building4 size={24} color="white" variant="Bold" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 font-urbanist">Existing Fidelity Account</h2>
              <p className="text-sm text-[var(--greyHex)] mb-4">{isVerified ? 'Verification completed!' : 'Connect Your Existing Fidelity Bank Account'}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => !isVerified && setShowExistingAccountModal(true)}
                  disabled={isVerified}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                    isVerified
                      ? 'bg-green-500 cursor-default'
                      : 'bg-[var(--greenHex)] hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)]'
                  }`}
                >
                  {isVerified ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <ArrowRight2 size={16} color="white" />
                  )}
                </button>
              </div>
            </div>

            {/* New Fidelity Account */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-[var(--greenHex)] rounded-full flex items-center justify-center mx-auto mb-4">
                <UserAdd size={24} color="white" variant="Bold" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 font-urbanist">New Fidelity Account</h2>
              <p className="text-sm text-[var(--greyHex)] mb-4">Create a New Fidelity Bank Account</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowNewAccountModal(true)}
                  className="w-10 h-10 bg-[var(--greenHex)] rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)]"
                >
                  <ArrowRight2 size={16} color="white" />
                </button>
              </div>
            </div>

          </main>
        </div>
      </div>

      {/* Existing Account Modal */}
      {showExistingAccountModal && (
        <BusinessVerificationModal
          isOpen={showExistingAccountModal}
          onClose={() => setShowExistingAccountModal(false)}
          onComplete={() => {
            console.log('Verification completed');
            setIsVerified(true);
            setShowExistingAccountModal(false);
            // Redirect to dashboard after short delay
            setTimeout(() => {
              router.push('/vendor/dashboard');
            }, 1500);
          }}
        />
      )}

      {/* Existing Account Modal (Fallback) */}
      {false && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 font-urbanist">Business Verification</h3>
              <button
                onClick={() => setShowExistingAccountModal(false)}
                className="text-[var(--greenHex)] hover:text-blue-700 transition-colors"
              >
                <CloseCircle size={24} color="currentColor" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6 text-center">Continue with an existing fidelity account.</p>

              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent ${
                      errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.accountNumber && <p className="mt-1 text-xs text-red-600">{errors.accountNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BVN</label>
                  <input
                    type="text"
                    name="bvn"
                    value={formData.bvn}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent ${
                      errors.bvn ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.bvn && <p className="mt-1 text-xs text-red-600">{errors.bvn}</p>}
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full mt-6 bg-[var(--greenHex)] text-white py-3 px-6 rounded-full font-semibold hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Account Modal */}
      {showNewAccountModal && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 font-urbanist">Create New Account</h3>
              <button
                onClick={() => setShowNewAccountModal(false)}
                className="text-[var(--greenHex)] hover:text-blue-700 transition-colors"
              >
                <CloseCircle size={24} color="currentColor" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6 text-center">Create a new Fidelity account for your business.</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={newAccountFormData.firstName}
                      onChange={handleNewAccountInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent ${
                        newAccountErrors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John"
                    />
                    {newAccountErrors.firstName && <p className="mt-1 text-xs text-red-600">{newAccountErrors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={newAccountFormData.lastName}
                      onChange={handleNewAccountInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent ${
                        newAccountErrors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Doe"
                    />
                    {newAccountErrors.lastName && <p className="mt-1 text-xs text-red-600">{newAccountErrors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={newAccountFormData.email}
                    onChange={handleNewAccountInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent ${
                      newAccountErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {newAccountErrors.email && <p className="mt-1 text-xs text-red-600">{newAccountErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={newAccountFormData.phoneNumber}
                    onChange={handleNewAccountInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent ${
                      newAccountErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+234 800 000 0000"
                  />
                  {newAccountErrors.phoneNumber && <p className="mt-1 text-xs text-red-600">{newAccountErrors.phoneNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                  <input
                    type="text"
                    name="businessName"
                    value={newAccountFormData.businessName}
                    onChange={handleNewAccountInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent ${
                      newAccountErrors.businessName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your Business Name"
                  />
                  {newAccountErrors.businessName && <p className="mt-1 text-xs text-red-600">{newAccountErrors.businessName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BVN *</label>
                  <input
                    type="text"
                    name="bvn"
                    value={newAccountFormData.bvn}
                    onChange={handleNewAccountInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent ${
                      newAccountErrors.bvn ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Bank Verification Number"
                  />
                  {newAccountErrors.bvn && <p className="mt-1 text-xs text-red-600">{newAccountErrors.bvn}</p>}
                </div>
              </div>

              <button
                onClick={handleNewAccountSubmit}
                className="w-full mt-6 bg-[var(--greenHex)] text-white py-3 px-6 rounded-full font-semibold hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessVerification;