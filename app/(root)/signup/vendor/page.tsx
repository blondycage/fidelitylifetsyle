'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { registerVendor, generateOTP } from '@/services/authService';
import { VendorPayload } from '@/types/api';
import { validatePassword } from '@/utils/passwordValidation';
import { ArrowRight } from 'iconsax-react';

const VendorSignup = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    username: '',
    businessType: '',
    businessName: '',
    businessAddress: '',
    businessDescription: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number is invalid';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';

    // Enhanced password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0] || 'Password does not meet requirements';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessType) newErrors.businessType = 'Business type is required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
    if (!formData.businessDescription.trim()) newErrors.businessDescription = 'Business description is required';
    if (formData.businessDescription.length < 20) newErrors.businessDescription = 'Description must be at least 20 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setLoading(true);
    try {
      const payload: VendorPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        username: formData.username,
        businessType: formData.businessType,
        businessProfileDTO: {
          name: formData.businessName,
          address: formData.businessAddress,
          description: formData.businessDescription,
        },
      };

      const response = await registerVendor(payload);

      if (response.responseCode === 200 || response.responseCode === 201) {
        toast.success('Vendor account created successfully! Please check your email for verification.');

        localStorage.setItem('registrationEmail', formData.email);
        localStorage.setItem('userType', 'VENDOR');
        router.push('/otp-validation');
      } else {
        const errorMessage = response.responseMessage || 'Registration failed';
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'An error occurred. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    { value: 'HOTEL', label: 'Hotel & Accommodation' },
    { value: 'RESTAURANT', label: 'Restaurant & Dining' },
    { value: 'CLUB', label: 'Club & Nightlife' },
    { value: 'EVENTS', label: 'Event Management' },
    { value: 'EXPERIENCES', label: 'Experience Provider' },
    { value: 'TOUR_GUIDE', label: 'Tour Guide & Travel' },
    { value: 'FASHION', label: 'Fashion & Retail' },
    { value: 'SUPERMARKET', label: 'Supermarket & Grocery' },
    { value: 'PHARMACY', label: 'Pharmacy & Health' },
    { value: 'INFLUENCER', label: 'Content & Influencer' },
    { value: 'OTHERS', label: 'Other Services' },
  ];

  return (
    <AuthLayout
      title={step === 1 ? "Vendor account" : "Business Details"}
      subtitle={step === 1 ? "Select a category to get started." : "Tell us about your business"}
    >
      <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="space-y-4 p-4 sm:p-6 mt-2 sm:mt-5">
        {/* Progress indicator */}
        <div className="flex justify-center space-x-2 mb-4">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-[var(--blueHex)]' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-[var(--blueHex)]' : 'bg-gray-300'}`} />
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                name="firstName"
                placeholder="First name"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last name"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
              />
            </div>

            <Input
              type="email"
              name="email"
              placeholder="Enter your email address"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />

            <Input
              type="tel"
              name="phoneNumber"
              placeholder="Enter your phone number"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
              required
            />

            <Input
              type="text"
              name="username"
              placeholder="Choose a unique username"
              label="Username"
              value={formData.username}
              onChange={handleInputChange}
              error={errors.username}
              required
            />

            <PasswordInput
              name="password"
              placeholder="Create a strong password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
              showStrengthIndicator={true}
            />

            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm your password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              required
              showStrengthIndicator={false}
            />
          </>
        )}

        {/* Step 2: Business Information */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--inputHex)] border border-[var(--borderHex)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
                required
              >
                <option value="">Select your business type</option>
                {businessTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.businessType && (
                <p className="mt-1 text-sm text-red-500">{errors.businessType}</p>
              )}
            </div>

            <Input
              type="text"
              name="businessName"
              placeholder="Enter your business name"
              label="Business Name"
              value={formData.businessName}
              onChange={handleInputChange}
              error={errors.businessName}
              required
            />

            <Input
              type="text"
              name="businessAddress"
              placeholder="Enter your business address"
              label="Business Address"
              value={formData.businessAddress}
              onChange={handleInputChange}
              error={errors.businessAddress}
              required
            />

            <div>
              <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                Business Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="businessDescription"
                placeholder="Describe your business, services, and what makes you unique..."
                value={formData.businessDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-[var(--inputHex)] border border-[var(--borderHex)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent placeholder-[var(--inputPlaceholderHex)] resize-none"
                required
              />
              <div className="flex justify-between text-xs text-[var(--greyHex)] mt-1">
                <span>{errors.businessDescription && <span className="text-red-500">{errors.businessDescription}</span>}</span>
                <span>{formData.businessDescription.length}/500</span>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="business-terms"
                className="w-4 h-4 text-[var(--blueHex)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--blueHex)] focus:ring-2"
                required
              />
              <label htmlFor="business-terms" className="ml-2 text-sm text-[var(--greyHex)]">
                I certify that the business information provided is accurate and I agree to the{' '}
                <button type="button" className="text-[var(--blueHex)] hover:underline">
                  Vendor Terms
                </button>
              </label>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex space-x-4">
          {step === 2 && (
            <Button
              type="button"
              onClick={handleBack}
              variant="secondary"
              className="flex-1"
            >
              ← Back
            </Button>
          )}

          <Button
            type="submit"
            loading={loading}
            className="flex-1 bg-[var(--greenHex)] hover:bg-green-600 text-white py-3 rounded-full font-medium flex items-center justify-center"
          >
            {step === 1 ? 'Next Step ' : 'Create account'}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>

        <div className="text-center">
          <span className="text-sm text-[var(--greyHex)]">
            Looking for experiences?{' '}
            <button
              type="button"
              onClick={() => router.push('/signup/customer')}
              className="text-[var(--blueHex)] hover:underline font-medium"
            >
              Join as Customer
            </button>
          </span>
        </div>

        <div className="text-center">
          <span className="text-sm text-[var(--greyHex)]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/signin')}
              className="text-[var(--greenHex)] hover:underline font-medium"
            >
              Login
            </button>
          </span>
        </div>
      </form>
    </AuthLayout>
  );
};

export default VendorSignup;