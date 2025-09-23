'use client';
import React, { useState } from 'react';
import { Button } from './Button';
import { PasswordInput } from './PasswordInput';
import { changeVendorPassword } from '@/services/authService';
import { validatePassword } from '@/utils/passwordValidation';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    password: '',
    confirmedPassword: '',
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

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!formData.password) {
      newErrors.password = 'New password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0] || 'Password does not meet requirements';
      }
    }

    if (formData.password !== formData.confirmedPassword) {
      newErrors.confirmedPassword = 'Passwords do not match';
    }

    if (formData.oldPassword === formData.password) {
      newErrors.password = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await changeVendorPassword({
        oldPassword: formData.oldPassword,
        password: formData.password,
        confirmedPassword: formData.confirmedPassword,
      });

      if (response.responseCode === 200 || response.responseCode === 201) {
        onSuccess();
        handleClose();
      } else {
        setErrors({ general: response.responseMessage || 'Failed to change password' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      oldPassword: '',
      password: '',
      confirmedPassword: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[var(--blueHex)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--blueHex)] font-roboto">
            Change Password
          </h2>
          <p className="mt-2 text-sm text-[var(--greyHex)] font-roboto">
            Update your account password for enhanced security.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <PasswordInput
            name="oldPassword"
            placeholder="Enter your current password"
            label="Current Password"
            value={formData.oldPassword}
            onChange={handleInputChange}
            error={errors.oldPassword}
            required
            showStrengthIndicator={false}
          />

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
            name="confirmedPassword"
            placeholder="Confirm your new password"
            label="Confirm New Password"
            value={formData.confirmedPassword}
            onChange={handleInputChange}
            error={errors.confirmedPassword}
            required
            showStrengthIndicator={false}
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
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};