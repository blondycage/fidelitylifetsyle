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
        <label className="block text-sm font-medium text-[var(--greyHex)] mb-2">
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
          className={`w-full px-4 py-3 pr-12 bg-[var(--inputHex)] border border-[var(--borderHex)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent placeholder-[var(--inputPlaceholderHex)] disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red-500' : ''} ${className}`}
        />

        <button
          type="button"
          onClick={handleTogglePassword}
          disabled={disabled}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--greyHex)] hover:text-[var(--blueHex)] transition-colors disabled:opacity-50"
        >
          {showPassword ? (
            <EyeSlash size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {showStrengthIndicator && hasPassword && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--greyHex)]">Password Strength:</span>
            <span className={`text-xs font-medium capitalize ${getPasswordStrengthColor(validation.strength)}`}>
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
          <p className="text-xs font-medium text-[var(--greyHex)] mb-2">Password Requirements:</p>
          <div className="space-y-1">
            <div className={`flex items-center text-xs ${value.length >= 6 ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-2">{value.length >= 6 ? '✓' : '✗'}</span>
              At least 6 characters long
            </div>
            <div className={`flex items-center text-xs ${/[a-z]/.test(value) ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-2">{/[a-z]/.test(value) ? '✓' : '✗'}</span>
              One lowercase letter
            </div>
            <div className={`flex items-center text-xs ${/[A-Z]/.test(value) ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-2">{/[A-Z]/.test(value) ? '✓' : '✗'}</span>
              One uppercase letter
            </div>
            <div className={`flex items-center text-xs ${/\d/.test(value) ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-2">{/\d/.test(value) ? '✓' : '✗'}</span>
              One number
            </div>
            <div className={`flex items-center text-xs ${/[^\w\s]/.test(value) ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-2">{/[^\w\s]/.test(value) ? '✓' : '✗'}</span>
              One special character (!@#$%^&*)
            </div>
            <div className={`flex items-center text-xs ${!/\s/.test(value) && value.length > 0 ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-2">{!/\s/.test(value) && value.length > 0 ? '✓' : '✗'}</span>
              No whitespace characters
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};