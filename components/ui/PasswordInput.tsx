import React, { useState } from 'react';
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthBgColor } from '@/utils/passwordValidation';
import { Eye, EyeSlash } from 'iconsax-react';

interface PasswordInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  showStrengthIndicator?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  value = '',
  onChange,
  className = '',
  error,
  label,
  required = false,
  disabled = false,
  name,
  showStrengthIndicator = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const validation = validatePassword(value);
  const hasPassword = value.length > 0;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-lg font-bold text-[var(--greyHex)] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-4 pr-12 text-lg bg-[var(--inputHex)] border border-[var(--borderHex)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent placeholder-[var(--inputPlaceholderHex)] disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red-500' : ''} ${className}`}
        />

        <button
          type="button"
          onClick={handleTogglePassword}
          disabled={disabled}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {showStrengthIndicator && hasPassword && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg text-[var(--greyHex)]">Password Strength:</span>
            <span className={`text-lg font-medium capitalize ${getPasswordStrengthColor(validation.strength)}`}>
              {validation.strength}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthBgColor(validation.strength)}`}
              style={{ width: `${(validation.score / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Password Requirements */}
      {(isFocused || (hasPassword && !validation.isValid)) && showStrengthIndicator && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-lg font-medium text-[var(--greyHex)] mb-2">Password Requirements:</p>
          <div className="space-y-1">
            <div className={`flex items-center text-lg ${value.length >= 6 ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-2">{value.length >= 6 ? '✓' : '✗'}</span>
              At least 6 characters long
            </div>
            <div className={`flex items-center text-lg ${/[a-z]/.test(value) ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-2">{/[a-z]/.test(value) ? '✓' : '✗'}</span>
              One lowercase letter
            </div>
            <div className={`flex items-center text-lg ${/[A-Z]/.test(value) ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-2">{/[A-Z]/.test(value) ? '✓' : '✗'}</span>
              One uppercase letter
            </div>
            <div className={`flex items-center text-lg ${/\d/.test(value) ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-2">{/\d/.test(value) ? '✓' : '✗'}</span>
              One number
            </div>
            <div className={`flex items-center text-lg ${/[^\w\s]/.test(value) ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-2">{/[^\w\s]/.test(value) ? '✓' : '✗'}</span>
              One special character (!@#$%^&*)
            </div>
            <div className={`flex items-center text-lg ${!/\s/.test(value) && value.length > 0 ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-2">{!/\s/.test(value) && value.length > 0 ? '✓' : '✗'}</span>
              No whitespace characters
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-lg text-red-500">{error}</p>
      )}
    </div>
  );
};