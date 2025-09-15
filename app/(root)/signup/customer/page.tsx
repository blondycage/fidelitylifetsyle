'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { registerCustomer, generateOTP } from '@/services/authService';
import { CustomerPayload } from '@/types/api';
import { validatePassword } from '@/utils/passwordValidation';

const CustomerSignup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number is invalid';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload: CustomerPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      };

      const response = await registerCustomer(payload);

      if (response.responseCode === 200 || response.responseCode === 201) {
        toast.success('Account created successfully! Please check your email for verification.');

        localStorage.setItem('registrationEmail', formData.email);
        localStorage.setItem('userType', 'CUSTOMER');
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

  return (
    <AuthLayout
      title="Join as Customer"
      subtitle="Create your account to explore lifestyle experiences"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

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

        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 text-[var(--blueHex)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--blueHex)] focus:ring-2"
            required
          />
          <label htmlFor="terms" className="ml-2 text-sm text-[var(--greyHex)]">
            I agree to the{' '}
            <button type="button" className="text-[var(--blueHex)] hover:underline">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="text-[var(--blueHex)] hover:underline">
              Privacy Policy
            </button>
          </label>
        </div>

        <Button type="submit" loading={loading}>
          Create Customer Account
        </Button>

        <div className="text-center">
          <span className="text-sm text-[var(--greyHex)]">
            Want to sell your services?{' '}
            <button
              type="button"
              onClick={() => router.push('/signup/vendor')}
              className="text-[var(--blueHex)] hover:underline font-medium"
            >
              Join as Vendor
            </button>
          </span>
        </div>

        <div className="text-center">
          <span className="text-sm text-[var(--greyHex)]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/signin')}
              className="text-[var(--blueHex)] hover:underline font-medium"
            >
              Sign in
            </button>
          </span>
        </div>
      </form>
    </AuthLayout>
  );
};

export default CustomerSignup;