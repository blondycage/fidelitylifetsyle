'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Input } from './Input';
import { Button } from './Button';
import { verifyBVN } from '@/services/authService';
import { BVNVerificationPayload, BVNVerificationResponse } from '@/types/api';
import { Shield, TickCircle } from 'iconsax-react';

interface BVNVerificationFormProps {
  onSuccess: (bvnData: BVNVerificationResponse) => void;
  onSkip?: () => void;
  embedded?: boolean; // New prop to handle embedded mode
}

export const BVNVerificationForm: React.FC<BVNVerificationFormProps> = ({
  onSuccess,
  onSkip,
  embedded = false
}) => {
  const [formData, setFormData] = useState({
    bvn_id: '',
    account_nr: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow numbers and limit length
    if (name === 'bvn_id' && value.length > 11) return;
    if (name === 'account_nr' && value.length > 10) return;

    const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
    setFormData(prev => ({ ...prev, [name]: numericValue }));

    // Clear existing error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bvn_id.trim()) {
      newErrors.bvn_id = 'BVN is required';
    } else if (formData.bvn_id.length !== 11) {
      newErrors.bvn_id = 'BVN must be exactly 11 digits';
    }

    if (!formData.account_nr.trim()) {
      newErrors.account_nr = 'Account number is required';
    } else if (formData.account_nr.length !== 10) {
      newErrors.account_nr = 'Account number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload: BVNVerificationPayload = {
        bvn_id: formData.bvn_id,
        account_nr: formData.account_nr
      };

      const response = await verifyBVN(payload);

      if (response.responseCode === 200 && response.data?.nibBvnResponse?.responseCode === "00") {
        toast.success('BVN verification successful! Your details have been retrieved.');
        onSuccess(response.data);
      } else {
        const errorMessage = response.responseMessage || 'BVN verification failed. Please check your details and try again.';
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'An error occurred during BVN verification. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className={embedded ? "space-y-6" : "max-w-lg w-full space-y-6 relative z-10 auth-form p-4 sm:p-6 lg:p-8 my-4 sm:my-6"}>
      <div className="text-center">
        <div className="w-16 h-16 bg-[var(--greenHex)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield size={32} color="white" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--blueHex)] font-urbanist">
          BVN Verification
        </h2>
        <p className="mt-2 text-lg text-[var(--greyHex)] font-urbanist">
          Verify your BVN to automatically populate your account details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-lg">
            {errors.general}
          </div>
        )}

        <Input
          type="text"
          name="bvn_id"
          placeholder="Enter your 11-digit BVN"
          label="Bank Verification Number (BVN)"
          value={formData.bvn_id}
          onChange={handleInputChange}
          error={errors.bvn_id}
          required
          maxLength={11}
        />

        <Input
          type="text"
          name="account_nr"
          placeholder="Enter your 10-digit account number"
          label="Fidelity Account Number"
          value={formData.account_nr}
          onChange={handleInputChange}
          error={errors.account_nr}
          required
          maxLength={10}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <TickCircle size={20} color="var(--blueHex)" className="mt-0.5 flex-shrink-0" />
            <div className="text-sm text-[var(--blueHex)]">
              <p className="font-medium mb-1">Secure BVN Verification</p>
              <p>Your BVN will be used only to verify your identity and pre-fill your account details. This information is encrypted and secure.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            loading={loading}
            variant="secondary"
            className="w-full"
          >
            Verify BVN & Continue
          </Button>

          {onSkip && (
            <Button
              type="button"
              onClick={onSkip}
              variant="primary"
              className="w-full bg-transparent border-2 border-[var(--blueHex)] text-[var(--blueHex)] hover:bg-[var(--blueHex)] hover:text-white"
            >
              Skip BVN Verification
            </Button>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-[var(--greyHex)]">
            Don't have your BVN handy? You can find it by dialing *565*0# on your registered phone number.
          </p>
        </div>
      </form>
    </div>
  );

  return formContent;
};