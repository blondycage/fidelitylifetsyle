'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from './Button';
import { Input } from './Input';
import { generateOTP, customerResetPassword } from '@/services/authService';
import { CloseCircle, Key } from 'iconsax-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
  userType: 'VENDOR' | 'CUSTOMER';
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userType
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;

      if (userType === 'CUSTOMER') {
        // Customer uses different endpoint with query params
        response = await customerResetPassword(email);
      } else {
        // Vendor uses OTP generation
        response = await generateOTP({
          recipient: email,
          purpose: 'VENDOR_FORGOT_PASSWORD',
          channel: 'EMAIL',
        });
      }

      if (response.responseCode === 200 || response.responseCode === 201) {
        toast.success('Reset code sent to your email!');
        onSuccess(email);
        onClose();
      } else {
        const errorMessage = response.responseMessage || 'Failed to send reset code';
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

  const handleClose = () => {
    setEmail('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-[var(--blueHex)] hover:text-blue-700 transition-all duration-200"
        >
          <CloseCircle size={24} color="currentColor" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[var(--blueHex)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Key size={32} color="white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--blueHex)] font-urbanist">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-[var(--greyHex)] font-urbanist">
            Enter your email address and we'll send you a code to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            type="email"
            name="email"
            placeholder="Enter your email address"
            label="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            error={error}
            required
          />

          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              Send Reset Code
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};