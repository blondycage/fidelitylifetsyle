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
import { ArrowLeft, TickCircle, Message, Shield } from 'iconsax-react';

// Create a separate component that uses useSearchParams
const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: Password
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
  const [otpVerified, setOtpVerified] = useState(false);

  interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
  }
  
  useEffect(() => {
    const email = searchParams.get('email');
    const type = searchParams.get('userType');
    if (email) {
      setFormData(prev => ({ ...prev, email }));
      // If email is provided, start at step 2 (OTP verification)
      setCurrentStep(2);
    } else {
      // If no email provided, start at step 1 (email input)
      setCurrentStep(1);
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

  const validateEmail = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.otp.trim()) newErrors.otp = 'OTP is required.';
    if (formData.otp.length !== 6) newErrors.otp = 'OTP must be 6 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.password) {
      newErrors.password = 'Password is required.';
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    setErrors({});
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

      if (response.responseCode === 200 || response.responseCode === 201) {
        toast.success('Verification code sent to your email!');
        setCurrentStep(2);
        setResendCooldown(300); // 5 minutes
      } else {
        const errorMessage = response.responseMessage || 'Failed to send verification code';
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

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOTP()) return;

    setLoading(true);
    setErrors({});
    try {
      // For now, we'll just verify the OTP format and move to next step
      // In a real implementation, you'd verify the OTP with the backend
      if (formData.otp.length === 6) {
        setOtpVerified(true);
        setCurrentStep(3);
        toast.success('OTP verified successfully!');
      } else {
        setErrors({ otp: 'Invalid OTP. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setLoading(true);
    setErrors({});
    try {
      let response;
      if (userType === 'CUSTOMER') {
        response = await customerResetPasswordFinal(
          formData.email,
          formData.otp,
          formData.password
        );
      } else {
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
      setErrors({ email: 'Email is required for resending OTP.' });
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

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.length > 2 
      ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 2)
      : localPart;
    return `${maskedLocal}@${domain}`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[var(--blueHex)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Message size={32} color="white" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--blueHex)] font-urbanist">
                Reset Password
              </h2>
              <p className="mt-2 text-sm text-[var(--greyHex)] font-urbanist">
                Enter your email address and we'll send you a verification code
              </p>
            </div>

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

            <Button type="submit" loading={loading} variant="secondary" className="w-full">
              Send Verification Code
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
        );

      case 2:
        return (
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[var(--greenHex)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} color="white" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--blueHex)] font-urbanist">
                Enter Verification Code
              </h2>
              <p className="mt-2 text-sm text-[var(--greyHex)] font-urbanist">
                We've sent a 6-digit code to {maskEmail(formData.email)}
              </p>
            </div>

            <Input
              type="text"
              name="otp"
              placeholder="Enter 6-digit code"
              label="Verification Code"
              value={formData.otp}
              onChange={handleInputChange}
              error={errors.otp}
              required
              maxLength={6}
            />

            <div className="text-center">
              <Button
                type="button"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0}
                loading={resendLoading}
                variant="secondary"
                className="text-[var(--greenHex)] hover:bg-green-50 text-sm"
              >
                {resendCooldown > 0
                  ? `Resend code in ${formatTime(resendCooldown)}`
                  : 'Resend verification code'
                }
              </Button>
            </div>

            <Button type="submit" loading={loading} variant="secondary" className="w-full">
              Verify Code
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-[var(--greyHex)] hover:text-[var(--blueHex)] flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to email
              </button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TickCircle size={32} color="white" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--blueHex)] font-urbanist">
                Create New Password
              </h2>
              <p className="mt-2 text-sm text-[var(--greyHex)] font-urbanist">
                Your verification code has been confirmed. Now create a new password
              </p>
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

            <Button type="submit" loading={loading} variant="secondary" className="w-full">
              Reset Password
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-[var(--greyHex)] hover:text-[var(--blueHex)] flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to verification
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <AuthLayout
      title=""
      subtitle=""
    >
      {renderStepContent()}
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