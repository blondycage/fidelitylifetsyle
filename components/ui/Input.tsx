import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  error,
  label,
  required = false,
  disabled = false,
  name,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-lg font-bold text-[var(--greyHex)] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-4 text-lg bg-[var(--inputHex)] border border-[var(--borderHex)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blueHex)] focus:border-transparent placeholder-[var(--inputPlaceholderHex)] disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red-500' : ''} ${className}`}
      />
      {error && (
        <p className="mt-1 text-lg text-red-500">{error}</p>
      )}
    </div>
  );
};