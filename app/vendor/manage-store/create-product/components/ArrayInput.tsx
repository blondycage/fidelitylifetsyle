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
    <div className="w-full max-w-full sm:max-w-[450px]">
      <div className="flex items-center gap-2 mb-2">
        <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
          {label}
        </label>
        {required && (
          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
        )}
      </div>
      
      {/* Input field */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addItem}
          disabled={!inputValue.trim() || value.includes(inputValue.trim())}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-[#6CC049] text-white rounded-full flex items-center justify-center text-[12px] font-bold hover:bg-[#5AA83A] transition-colors disabled:bg-[#BDBDBD] disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      {/* Help text */}
      {helpText && (
        <p className="mt-1 text-[12px] text-[#9E9E9E] font-urbanist">
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
                className="inline-flex items-center gap-2 bg-[#F5F5F5] border border-[#E0E0E0] rounded-[20px] px-3 py-1.5 text-[12px] sm:text-[14px] font-urbanist text-[#212121]"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="w-4 h-4 bg-[#FF383C] text-white rounded-full flex items-center justify-center text-[10px] font-bold hover:bg-[#E02E32] transition-colors"
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