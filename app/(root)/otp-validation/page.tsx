'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { OTPInput } from '@/components/ui/OTPInput';
import { Button } from '@/components/ui/Button';
import { generateOTP, validateCustomerOTP, validateVendorOTP } from '@/services/authService';
import { ValidateOTPPayload, OTPPurpose } from '@/types/api';
import { ArrowRight } from 'iconsax-react';

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
      title="Authentication required"
      subtitle={`Enter the OTP code sent to ${maskEmail(email)}`}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <OTPInput
            length={6}
            onComplete={handleOTPComplete}
            onChange={setOtp}
            error={error}
          />

          {loading && (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-[var(--blueHex)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button
            onClick={() => otp && handleOTPComplete(otp)}
            disabled={!otp || otp.length !== 6}
            className="w-full bg-[var(--blueHex)] hover:bg-blue-600 text-white py-3 rounded-full font-medium disabled:opacity-50"
          >
            Verify
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>

        <div className="text-center">
          <Button
            onClick={handleResendOTP}
            disabled={resendCooldown > 0}
            loading={resendLoading}
            variant="secondary"
            className="text-[var(--blueHex)] bg-transparent hover:bg-blue-50"
          >
            {resendCooldown > 0
              ? `Resend code in ${formatTime(resendCooldown)}`
              : 'Resend code'
            }
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default OTPValidation;
