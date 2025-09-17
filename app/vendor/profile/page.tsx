'use client';
import React, { useState } from 'react';
import { ProfileCompletion } from '@/components/vendor/ProfileCompletion';
import { AccountSelection } from '@/components/vendor/AccountSelection';
import { BusinessVerification } from '@/components/vendor/BusinessVerification';

const VendorProfilePage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProfileCompletion onNext={nextStep} />;
      case 2:
        return <AccountSelection onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <BusinessVerification onPrev={prevStep} />;
      default:
        return <ProfileCompletion onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFB] via-[#E6F7FF] to-[#E8FFF1]">
      {renderStep()}
    </div>
  );
};

export default VendorProfilePage;