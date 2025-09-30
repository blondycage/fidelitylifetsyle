'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { forgotVendorPassword, customerResetPasswordFinal, generateOTP, customerResetPassword } from '@/services/authService';
import { validatePassword } from '@/utils/passwordValidation';
import { InputHTMLAttributes } from "react"
import { Suspense } from "react";

// Create a separate component that uses useSearchParams
const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'CUSTOMER' | 'VENDOR'>('VENDOR');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
  }
  
  useEffect(() => {
    const email = searchParams.get('email');
    const type = searchParams.get('userType');
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
    if (type === 'CUSTOMER' || type === 'VENDOR') {
      setUserType(type);
    }
  }, [searchParams]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.otp.trim()) newErrors.otp = 'OTP is required';
    if (formData.otp.length !== 6) newErrors.otp = 'OTP must be 6 digits';

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
      let response;

      if (userType === 'CUSTOMER') {
        // Customer reset password flow
        response = await customerResetPasswordFinal(
          formData.email,
          formData.otp,
          formData.password
        );
      } else {
        // Vendor reset password flow
        response = await forgotVendorPassword({
          email: formData.email,
          password: formData.password,
          otp: formData.otp,
        });
      }

      if (response.responseCode === 200 || response.responseCode === 201) {
        toast.success('Password reset successfully! You can now sign in with your new password.');
        router.push('/signin');
      } else {
        const errorMessage = response.responseMessage || 'Password reset failed';
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

  const handleResendOTP = async () => {
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required for resending OTP' });
      return;
    }

    setResendLoading(true);
    setErrors(prev => ({ ...prev, otp: '' }));

    try {
      let response;

      if (userType === 'CUSTOMER') {
        response = await customerResetPassword(formData.email);
      } else {
        response = await generateOTP({
          recipient: formData.email,
          purpose: 'VENDOR_FORGOT_PASSWORD',
          channel: 'EMAIL',
        });
      }

      if (response.responseCode === 200) {
        setResendCooldown(300); // 5 minutes = 300 seconds
        toast.success('New verification code sent to your email!');
      } else {
        const errorMessage = 'Failed to resend OTP. Please try again.';
        setErrors({ otp: errorMessage });
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'An error occurred while resending OTP.';
      setErrors({ otp: errorMessage });
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter the code sent to your email and create a new password"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <Input
          type="email"
          name="email"
          placeholder="Enter your email address"
          label="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          disabled={!!searchParams.get('email')}
          required
        />

        <div>
          <Input
            type="text"
            name="otp"
            placeholder="Enter 6-digit code"
            label="Verification Code"
            value={formData.otp}
            onChange={handleInputChange}
            error={errors.otp}
            required
          />
          <div className="mt-2 text-center">
            <Button
              type="button"
              onClick={handleResendOTP}
              disabled={resendCooldown > 0}
              loading={resendLoading}
              variant="secondary"
              className="text-[var(--greenHex)] -[var(--greenHex)] hover:bg-green-50 text-sm"
            >
              {resendCooldown > 0
                ? `Resend code in ${formatTime(resendCooldown)}`
                : 'Resend verification code'
              }
            </Button>
          </div>
        </div>

        <PasswordInput
          name="password"
          placeholder="Create a new password"
          label="New Password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
          showStrengthIndicator={true}
        />

        <PasswordInput
          name="confirmPassword"
          placeholder="Confirm your new password"
          label="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          required
          showStrengthIndicator={false}
        />

        <Button type="submit" loading={loading} variant="secondary">
          Reset Password
        </Button>

        <div className="text-center">
          <span className="text-sm text-[var(--greyHex)]">
            Remember your password?{' '}
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

// Main component with Suspense boundary
const ResetPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPassword;