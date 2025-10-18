'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { CloseCircle, Key } from 'iconsax-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'VENDOR' | 'CUSTOMER';
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  userType
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleRedirectToReset = () => {
    setLoading(true);
    // Redirect to reset password page
    router.push(`/reset-password?userType=${userType}`);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay bg-black/50 flex items-center justify-center p-4">
      <div className="modal-content bg-white rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
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
          <p className="mt-2 text-lg text-[var(--greyHex)] font-urbanist">
            We'll help you reset your password. You'll be redirected to a secure page where you can enter your email and receive a verification code.
          </p>
        </div>

        <div className="space-y-4">
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
              type="button"
              onClick={handleRedirectToReset}
              loading={loading}
              className="flex-1"
            >
              Continue to Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};