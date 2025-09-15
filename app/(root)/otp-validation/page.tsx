'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { OTPInput } from '@/components/ui/OTPInput';
import { Button } from '@/components/ui/Button';
import { generateOTP, validateCustomerOTP, validateVendorOTP } from '@/services/authService';
import { ValidateOTPPayload, OTPPurpose } from '@/types/api';

const OTPValidation = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<'CUSTOMER' | 'VENDOR'>('CUSTOMER');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('registrationEmail');
      const storedUserType = localStorage.getItem('userType') as 'CUSTOMER' | 'VENDOR';

      if (!storedEmail || !storedUserType) {
        router.push('/signup');
        return;
      }

      setEmail(storedEmail);
      setUserType(storedUserType);
    }
  }, [router]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOTPComplete = async (otpValue: string) => {
    setOtp(otpValue);
    setError('');
    setLoading(true);

    try {
      const purpose: OTPPurpose = userType === 'CUSTOMER' ? 'CUSTOMER_ONBOARDING' : 'VENDOR_ONBOARDING';

      const payload: ValidateOTPPayload = {
        recipient: email,
        purpose: purpose,
        channel: 'EMAIL',
        otp: otpValue,
      };

      // Use the appropriate validation endpoint based on user type
      const response = userType === 'CUSTOMER'
        ? await validateCustomerOTP(payload)
        : await validateVendorOTP(payload);

      if (response.responseCode === 200) {
        localStorage.removeItem('registrationEmail');

        toast.success('Email verified successfully! Welcome to Fidelity Lifestyle Banking.');

        if (userType === 'VENDOR') {
          router.push('/vendor/dashboard');
        } else {
          router.push('/customer/dashboard');
        }
      } else {
        const errorMessage = response.responseMessage || 'Invalid OTP. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'An error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      const purpose: OTPPurpose = userType === 'CUSTOMER' ? 'CUSTOMER_ONBOARDING' : 'VENDOR_ONBOARDING';

      const response = await generateOTP({
        recipient: email,
        purpose: purpose,
        channel: 'EMAIL',
      });

      if (response.responseCode === 200) {
        setResendCooldown(300); // 5 minutes = 300 seconds
        toast.success('New verification code sent to your email!');
      } else {
        const errorMessage = 'Failed to resend OTP. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'An error occurred while resending OTP.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;

    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Enter the 6-digit code sent to your email"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-[var(--greenHex)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-[var(--greyHex)] mb-6">
            We sent a 6-digit verification code to <br />
            <span className="font-medium text-[var(--blueHex)]">{maskEmail(email)}</span>
          </p>
        </div>

        <div className="space-y-4">
          <OTPInput
            length={6}
            onComplete={handleOTPComplete}
            error={error}
          />

          {loading && (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-[var(--blueHex)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-[var(--greyHex)]">
            Didn't receive the code?
          </p>

          <Button
            onClick={handleResendOTP}
            disabled={resendCooldown > 0}
            loading={resendLoading}
            variant="secondary"
          >
            {resendCooldown > 0
              ? `Resend in ${formatTime(resendCooldown)}`
              : 'Resend Code'
            }
          </Button>
        </div>

        <div className="flex justify-center space-x-4 text-sm">
          <button
            onClick={() => router.push('/signup')}
            className="text-[var(--greyHex)] hover:text-[var(--blueHex)] transition-colors"
          >
            ← Back to Sign Up
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('registrationEmail');
              localStorage.removeItem('userType');
              router.push('/signin');
            }}
            className="text-[var(--greyHex)] hover:text-[var(--blueHex)] transition-colors"
          >
            Sign In Instead
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default OTPValidation;
