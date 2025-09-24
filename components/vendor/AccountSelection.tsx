'use client';
import React, { useState } from 'react';

interface AccountSelectionProps {
  onNext: () => void;
  onPrev: () => void;
  onExistingAccount: () => void;
}

export const AccountSelection: React.FC<AccountSelectionProps> = ({ onNext, onPrev, onExistingAccount }) => {
  const [selectedAccount, setSelectedAccount] = useState<'existing' | 'new' | null>(null);

  const handleAccountSelect = (accountType: 'existing' | 'new') => {
    setSelectedAccount(accountType);
  };

  const handleNext = () => {
    if (selectedAccount === 'existing') {
      onExistingAccount();
    } else if (selectedAccount === 'new') {
      onNext();
    }
  };

  const handlePrev = () => {
    onPrev();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 pt-8">
          <h1 className="text-2xl font-bold text-[var(--blueHex)] font-urbanist">
            Complete your profile
          </h1>
          <p className="text-[var(--greyHex)] mt-2 font-urbanist">
            Let's get you started, ready to streamline
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--greenHex)] rounded-full"></div>
            <div className="text-sm text-[var(--greenHex)]">Profile info</div>
            <div className="w-8 h-px bg-[var(--blueHex)]"></div>
            <div className="w-2 h-2 bg-[var(--blueHex)] rounded-full"></div>
            <div className="text-sm text-[var(--blueHex)]">Business Verification</div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="text-sm text-[var(--greyHex)]">Confirmation</div>
          </div>
        </div>

        {/* Selection Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mx-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Existing Fidelity Account */}
            <div
              onClick={() => handleAccountSelect('existing')}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedAccount === 'existing'
                  ? 'border-[var(--blueHex)] bg-blue-50'
                  : 'border-[var(--borderHex)] hover:border-[var(--blueHex)]'
              }`}
            >
              <div className="flex items-center justify-center mb-4">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                  selectedAccount === 'existing'
                    ? 'border-[var(--blueHex)] bg-[var(--blueHex)]'
                    : 'border-[var(--borderHex)]'
                }`}>
                  {selectedAccount === 'existing' && (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-[var(--blueHex)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--blueHex)] mb-2 font-urbanist">
                  Existing Fidelity Account
                </h3>
                <p className="text-sm text-[var(--greyHex)] font-urbanist">
                  Connect your existing Fidelity Bank account
                </p>
              </div>
            </div>

            {/* New Fidelity Account */}
            <div
              onClick={() => handleAccountSelect('new')}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedAccount === 'new'
                  ? 'border-[var(--blueHex)] bg-blue-50'
                  : 'border-[var(--borderHex)] hover:border-[var(--blueHex)]'
              }`}
            >
              <div className="flex items-center justify-center mb-4">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                  selectedAccount === 'new'
                    ? 'border-[var(--blueHex)] bg-[var(--blueHex)]'
                    : 'border-[var(--borderHex)]'
                }`}>
                  {selectedAccount === 'new' && (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-[var(--greenHex)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--blueHex)] mb-2 font-urbanist">
                  New Fidelity Account
                </h3>
                <p className="text-sm text-[var(--greyHex)] font-urbanist">
                  Create a new Fidelity Bank account
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              className="px-6 py-2 text-[var(--greyHex)] border border-[var(--borderHex)] rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedAccount}
              className={`px-8 py-2 rounded-lg font-medium transition-colors ${
                selectedAccount
                  ? 'bg-[var(--blueHex)] text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};