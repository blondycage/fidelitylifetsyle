'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { ForgotPasswordModal } from '@/components/ui/ForgotPasswordModal';
import { userLogin } from '@/services/authService';
import { UserLoginPayloadProps } from '@/types/api';
import { ArrowRight } from 'iconsax-react';

const Signin = () => {
  const router = useRouter();
  const [userType, setUserType] = useState<'CUSTOMER' | 'VENDOR'>('CUSTOMER');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear existing error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Real-time email validation
    if (name === 'username' && value.trim()) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(value)) {
        setErrors(prev => ({ ...prev, [name]: 'Please enter a valid email address' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.username)) {
      newErrors.username = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload: UserLoginPayloadProps = {
        username: formData.username,
        password: formData.password,
        userType: userType,
      };

      const response = await userLogin(payload);

      if (response.responseCode === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userEmail', response.data.email);
        localStorage.setItem('userType', userType);

        toast.success(`Welcome back! Signed in as ${userType.toLowerCase()}`);

        if (userType === 'VENDOR') {
          router.push('/vendor/dashboard');
        } else {
          router.push('/customer/dashboard');
        }
      } else {
        const errorMessage = response.responseMessage || 'Login failed';
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

  const handleForgotPasswordSuccess = (email: string) => {
    router.push(`/reset-password?email=${encodeURIComponent(email)}&userType=${userType}`);
  };

  return (
    <AuthLayout
      title="Log in"
      subtitle="Enter your details to log in."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Type Toggle */}
        <div className="flex bg-[var(--inputHex)] rounded-lg p-1">
          <button
            type="button"
            onClick={() => setUserType('CUSTOMER')}
            className={`flex-1 py-3 px-4 rounded-md text-lg font-medium transition-all duration-200 ${
              userType === 'CUSTOMER'
                ? 'bg-white text-[var(--blueHex)] shadow-sm'
                : 'text-[var(--greyHex)]'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setUserType('VENDOR')}
            className={`flex-1 py-3 px-4 rounded-md text-lg font-medium transition-all duration-200 ${
              userType === 'VENDOR'
                ? 'bg-white text-[var(--blueHex)] shadow-sm'
                : 'text-[var(--greyHex)]'
            }`}
          >
            Vendor
          </button>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <Input
          type="text"
          name="username"
          placeholder="Email"
          label="Email"
          value={formData.username}
          onChange={handleInputChange}
          error={errors.username}
          required
        />

        <div className="relative">
          <PasswordInput
            name="password"
            placeholder="Password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
            showStrengthIndicator={false}
          />
          <button
            type="button"
            onClick={() => setShowForgotPasswordModal(true)}
            className="absolute -bottom-6 right-0 text-sm text-[var(--greenHex)] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <div className="pt-4">
          <Button type="submit" loading={loading} className="w-full bg-[var(--greenHex)] hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)] text-white py-3 rounded-full font-medium flex items-center justify-center">
            Log in
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>

        <div className="text-center">
          <span className="text-sm text-[var(--greyHex)]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="text-[var(--greenHex)] hover:underline font-medium"
            >
              Create Account
            </button>
          </span>
        </div>

        {/* Commented out Google Sign-in for now */}
        {/*
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-[var(--greyHex)]">OR</span>
          </div>
        </div>

        <Button
          type="button"

          className="w-full border-2 border-[var(--blueHex)] bg-[var(--blueHex)] text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:border-blue-600 py-3 rounded-full font-medium flex items-center justify-center transition-all duration-200"

        >
          <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>
        */}
      </form>

      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSuccess={handleForgotPasswordSuccess}
        userType={userType}
      />
    </AuthLayout>
  );
};

export default Signin;
