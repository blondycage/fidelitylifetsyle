'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ForgotPasswordModal } from '@/components/ui/ForgotPasswordModal';
import { userLogin } from '@/services/authService';
import { UserLoginPayloadProps } from '@/types/api';

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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
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
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Type Toggle */}
        <div className="flex bg-[var(--inputHex)] rounded-lg p-1">
          <button
            type="button"
            onClick={() => setUserType('CUSTOMER')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
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
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
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
          placeholder="Enter your username"
          label="Username"
          value={formData.username}
          onChange={handleInputChange}
          error={errors.username}
          required
        />

        <Input
          type="password"
          name="password"
          placeholder="Enter your password"
          label="Password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-[var(--blueHex)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--blueHex)] focus:ring-2"
            />
            <span className="ml-2 text-sm text-[var(--greyHex)]">Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => setShowForgotPasswordModal(true)}
            className="text-sm text-[var(--blueHex)] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" loading={loading}>
          Sign In
        </Button>

        <div className="text-center">
          <span className="text-sm text-[var(--greyHex)]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="text-[var(--blueHex)] hover:underline font-medium"
            >
              Sign up
            </button>
          </span>
        </div>

        <div className="flex justify-center space-x-4 text-xs">
          <button
            type="button"
            onClick={() => router.push('/signup/customer')}
            className="text-[var(--greyHex)] hover:text-[var(--blueHex)] transition-colors"
          >
            Join as Customer
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => router.push('/signup/vendor')}
            className="text-[var(--greyHex)] hover:text-[var(--greenHex)] transition-colors"
          >
            Join as Vendor
          </button>
        </div>
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
