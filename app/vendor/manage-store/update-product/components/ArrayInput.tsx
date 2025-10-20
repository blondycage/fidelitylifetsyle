'use client';
import React, { useState } from 'react';

interface ArrayInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  helpText?: string;
  required?: boolean;
}

const ArrayInput: React.FC<ArrayInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  helpText,
  required = false
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  const addItem = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue('');
    }
  };

  const removeItem = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input field */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addItem}
          disabled={!inputValue.trim() || value.includes(inputValue.trim())}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-[#6CC049] text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-[#5AA83A] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      {/* Help text */}
      {helpText && (
        <p className="mt-1 text-xs text-gray-500">
          {helpText}
        </p>
      )}

      {/* Display added items */}
      {value.length > 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {value.map((item, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-sm"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArrayInput;
