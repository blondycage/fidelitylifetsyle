'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FidelityLogo } from '@/components/ui/FidelityLogo';

const BusinessVerification = () => {
  const router = useRouter();
  const [activeMenuItem, setActiveMenuItem] = useState('Business Verification');
  const [showExistingAccountModal, setShowExistingAccountModal] = useState(false);
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
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
    { name: 'Dashboard', icon: '🏠', active: false },
    { name: 'Manage Store', icon: '🏪', active: false },
    { name: 'Manage Orders', icon: '📦', active: false },
    { name: 'Earnings', icon: '💰', active: false },
    { name: 'Logistics Setup', icon: '🚚', active: false },
    { name: 'Business Verification', icon: '✅', active: true },
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

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
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenuItem(item.name);
                  if (item.name === 'Dashboard') {
                    router.push('/vendor/dashboard');
                  }
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeMenuItem === item.name
                    ? 'bg-[var(--blueHex)] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => router.push('/vendor/profile')}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="mr-3">👤</span>
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <span className="mr-3">🚪</span>
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
            <button className="lg:hidden p-2 rounded-md text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
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
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-roboto">Business Verification</h1>
            <p className="mt-2 text-gray-600">Let's get your business ready for customers.</p>
          </div>

          {/* Verification Options */}
          <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Existing Fidelity Account */}
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[var(--blueHex)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 font-roboto">Existing Fidelity Account</h2>
              <p className="text-gray-600 mb-6">Lorem ipsum</p>
              <button
                onClick={() => setShowExistingAccountModal(true)}
                className="w-full bg-[var(--blueHex)] text-white py-3 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* New Fidelity Account */}
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 font-roboto">New Fidelity Account</h2>
              <p className="text-gray-600 mb-6">Lorem ipsum</p>
              <button
                onClick={() => setShowNewAccountModal(true)}
                className="w-full bg-[var(--blueHex)] text-white py-3 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
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
                className="p-2 text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Business Verification</h1>
              <div className="w-8"></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Let's get your business ready for customers.</p>
          </header>

          {/* Mobile Content */}
          <main className="p-4 space-y-6">
            {/* Existing Fidelity Account */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[var(--blueHex)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 font-roboto">Existing Fidelity Account</h2>
              <p className="text-sm text-gray-600 mb-4">Lorem ipsum</p>
              <button
                onClick={() => setShowExistingAccountModal(true)}
                className="w-full bg-[var(--blueHex)] text-white py-3 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* New Fidelity Account */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 font-roboto">New Fidelity Account</h2>
              <p className="text-sm text-gray-600 mb-4">Lorem ipsum</p>
              <button
                onClick={() => setShowNewAccountModal(true)}
                className="w-full bg-[var(--blueHex)] text-white py-3 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
              <div className="flex justify-around">
                <button className="flex flex-col items-center py-2 text-gray-400">
                  <span className="text-lg">🏠</span>
                  <span className="text-xs">Products</span>
                </button>
                <button className="flex flex-col items-center py-2 text-gray-400">
                  <span className="text-lg">📦</span>
                  <span className="text-xs">Orders</span>
                </button>
                <button className="flex flex-col items-center py-2 text-gray-400">
                  <span className="text-lg">💰</span>
                  <span className="text-xs">Earnings</span>
                </button>
                <button className="flex flex-col items-center py-2 text-[var(--blueHex)]">
                  <span className="text-lg">👤</span>
                  <span className="text-xs">Profile</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Existing Account Modal */}
      {showExistingAccountModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 font-roboto">Business Verification</h3>
              <button
                onClick={() => setShowExistingAccountModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6 text-center">Continue with an existing fidelity account.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent bg-gray-100 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

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
                className="w-full mt-6 bg-[var(--blueHex)] text-white py-3 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Account Modal */}
      {showNewAccountModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 font-roboto">Create New Account</h3>
              <button
                onClick={() => setShowNewAccountModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                className="w-full mt-6 bg-[var(--blueHex)] text-white py-3 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors"
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