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

const VendorSignup = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: 'Vendor', // Default value for vendor signup
    lastName: 'User', // Default value for vendor signup
    email: 'vendor@example.com', // This will be updated based on business email
    phoneNumber: '',
    password: 'TempPassword123!', // Will be set later
    confirmPassword: 'TempPassword123!', // Will be set later
    username: '', // Will be generated from business name
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number is invalid';
    if (!formData.businessType) newErrors.businessType = 'Business type is required';
    if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
    if (!formData.businessDescription.trim()) newErrors.businessDescription = 'Business description is required';
    if (formData.businessDescription.length < 20) newErrors.businessDescription = 'Description must be at least 20 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Generate username and email from business name
      const generatedUsername = formData.businessName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      const generatedEmail = `${generatedUsername}@business.example.com`;

      const payload: VendorPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: generatedEmail,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        username: generatedUsername,
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

        localStorage.setItem('registrationEmail', generatedEmail);
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
      title="Vendor account"
      subtitle="Enter your business details."
    >
      <form onSubmit={handleSubmit} className="space-y-6">

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <>
            <Input
              type="text"
              name="businessName"
              placeholder="Business name"
              label="Business name"
              value={formData.businessName}
              onChange={handleInputChange}
              error={errors.businessName}
              required
            />

            <Input
              type="tel"
              name="phoneNumber"
              placeholder="Phone number"
              label="Phone number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
              required
            />

            <div>
              <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--inputHex)] border border-[var(--borderHex)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent"
                required
              >
                <option value="">Category</option>
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
              name="businessAddress"
              placeholder="Address"
              label="Address"
              value={formData.businessAddress}
              onChange={handleInputChange}
              error={errors.businessAddress}
              required
            />

            <div>
              <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="businessDescription"
                placeholder="Describe your business..."
                value={formData.businessDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-[var(--inputHex)] border border-[var(--borderHex)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent placeholder-[var(--inputPlaceholderHex)] resize-none"
                required
              />
              {errors.businessDescription && (
                <p className="mt-1 text-sm text-red-500">{errors.businessDescription}</p>
              )}
            </div>
          </>
        )}


        {/* Create Account Button */}
        <div className="pt-4">
          <Button
            type="submit"
            loading={loading}
            className="w-full bg-[var(--greenHex)] hover:bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
          >
            Create account
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
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