'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CloseCircle, ArrowLeft, ArrowRight } from 'iconsax-react';

interface FidelityAccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface FormData {
  // Personal Information
  corporateName: string;
  gender: string;
  nationality: string;
  bvnId: string;
  emailAddress: string;
  phoneNumber: string;
  phoneNumberCountryCode: string;

  // Business Information
  companyName: string;
  accountType: string;
  tiers: string;
  rcnumber: string;
  dateOfIncorporation: string;
  sectorCode: string;
  subSectorCode: string;

  // Address & Location
  addressLine1: string;
  stateOfResidence: string;
  state: string;
  cityOfResidence: string;
  currencyCode: string;

  // Additional Details
  schmCode: string;
  primarySolId: string;
  tax: string;
  idIssueDate: string;
}

const initialFormData: FormData = {
  corporateName: '',
  gender: '',
  nationality: '',
  bvnId: '',
  emailAddress: '',
  phoneNumber: '',
  phoneNumberCountryCode: '+234',
  companyName: '',
  accountType: '',
  tiers: '',
  rcnumber: '',
  dateOfIncorporation: '',
  sectorCode: '',
  subSectorCode: '',
  addressLine1: '',
  stateOfResidence: '',
  state: '',
  cityOfResidence: '',
  currencyCode: 'NGN',
  schmCode: '',
  primarySolId: '',
  tax: '',
  idIssueDate: ''
};

export const FidelityAccountForm: React.FC<FidelityAccountFormProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4;

  const stepTitles = [
    'Personal Information',
    'Business Information',
    'Address & Location',
    'Additional Details'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.corporateName.trim()) newErrors.corporateName = 'Name is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
        if (!formData.bvnId.trim()) {
          newErrors.bvnId = 'BVN is required';
        } else if (formData.bvnId.length !== 11) {
          newErrors.bvnId = 'BVN must be 11 digits';
        }
        if (!formData.emailAddress.trim()) {
          newErrors.emailAddress = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
          newErrors.emailAddress = 'Email is invalid';
        }
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        break;

      case 2: // Business Information
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!formData.accountType) newErrors.accountType = 'Account type is required';
        if (!formData.tiers) newErrors.tiers = 'Tier is required';
        if (!formData.rcnumber.trim()) newErrors.rcnumber = 'RC number is required';
        if (!formData.dateOfIncorporation) newErrors.dateOfIncorporation = 'Date of incorporation is required';
        break;

      case 3: // Address & Location
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
        if (!formData.stateOfResidence) newErrors.stateOfResidence = 'State of residence is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.cityOfResidence.trim()) newErrors.cityOfResidence = 'City is required';
        break;

      case 4: // Additional Details
        if (!formData.schmCode.trim()) newErrors.schmCode = 'Scheme code is required';
        if (!formData.primarySolId.trim()) newErrors.primarySolId = 'Primary SOL ID is required';
        if (!formData.idIssueDate) newErrors.idIssueDate = 'ID issue date is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to create Fidelity account
      console.log('Creating Fidelity account with data:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Fidelity account created successfully!');
      onComplete();
      onClose();
    } catch (error) {
      console.error('Account creation error:', error);
      toast.error('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
        <input
          type="text"
          value={formData.corporateName}
          onChange={(e) => handleInputChange('corporateName', e.target.value)}
          className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
            errors.corporateName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your full name"
        />
        {errors.corporateName && <p className="mt-1 text-xs text-red-600">{errors.corporateName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
        <select
          value={formData.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
            errors.gender ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
        {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
        <input
          type="text"
          value={formData.nationality}
          onChange={(e) => handleInputChange('nationality', e.target.value)}
          className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
            errors.nationality ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Nigerian"
        />
        {errors.nationality && <p className="mt-1 text-xs text-red-600">{errors.nationality}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">BVN *</label>
        <input
          type="text"
          value={formData.bvnId}
          onChange={(e) => handleInputChange('bvnId', e.target.value)}
          className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
            errors.bvnId ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="11-digit BVN"
          maxLength={11}
        />
        {errors.bvnId && <p className="mt-1 text-xs text-red-600">{errors.bvnId}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
        <input
          type="email"
          value={formData.emailAddress}
          onChange={(e) => handleInputChange('emailAddress', e.target.value)}
          className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
            errors.emailAddress ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="your@email.com"
        />
        {errors.emailAddress && <p className="mt-1 text-xs text-red-600">{errors.emailAddress}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country Code</label>
          <select
            value={formData.phoneNumberCountryCode}
            onChange={(e) => handleInputChange('phoneNumberCountryCode', e.target.value)}
            className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--greenHex)]"
          >
            <option value="+234">+234 (NG)</option>
            <option value="+1">+1 (US)</option>
            <option value="+44">+44 (UK)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="8012345678"
          />
          {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
            errors.companyName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Your company name"
        />
        {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Type *</label>
          <select
            value={formData.accountType}
            onChange={(e) => handleInputChange('accountType', e.target.value)}
            className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
              errors.accountType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select account type</option>
            <option value="CURRENT">Current Account</option>
            <option value="SAVINGS">Savings Account</option>
            <option value="BUSINESS">Business Account</option>
          </select>
          {errors.accountType && <p className="mt-1 text-xs text-red-600">{errors.accountType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tier *</label>
          <select
            value={formData.tiers}
            onChange={(e) => handleInputChange('tiers', e.target.value)}
            className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
              errors.tiers ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select tier</option>
            <option value="TIER1">Tier 1</option>
            <option value="TIER2">Tier 2</option>
            <option value="TIER3">Tier 3</option>
          </select>
          {errors.tiers && <p className="mt-1 text-xs text-red-600">{errors.tiers}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">RC Number *</label>
        <input
          type="text"
          value={formData.rcnumber}
          onChange={(e) => handleInputChange('rcnumber', e.target.value)}
          className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
            errors.rcnumber ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Company registration number"
        />
        {errors.rcnumber && <p className="mt-1 text-xs text-red-600">{errors.rcnumber}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Incorporation *</label>
        <input
          type="date"
          value={formData.dateOfIncorporation}
          onChange={(e) => handleInputChange('dateOfIncorporation', e.target.value)}
          className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
            errors.dateOfIncorporation ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.dateOfIncorporation && <p className="mt-1 text-xs text-red-600">{errors.dateOfIncorporation}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sector Code</label>
          <input
            type="text"
            value={formData.sectorCode}
            onChange={(e) => handleInputChange('sectorCode', e.target.value)}
            className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--greenHex)]"
            placeholder="Business sector code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Sector Code</label>
          <input
            type="text"
            value={formData.subSectorCode}
            onChange={(e) => handleInputChange('subSectorCode', e.target.value)}
            className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--greenHex)]"
            placeholder="Business sub-sector code"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
        <input
          type="text"
          value={formData.addressLine1}
          onChange={(e) => handleInputChange('addressLine1', e.target.value)}
          className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
            errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Street address"
        />
        {errors.addressLine1 && <p className="mt-1 text-xs text-red-600">{errors.addressLine1}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State of Residence *</label>
          <select
            value={formData.stateOfResidence}
            onChange={(e) => handleInputChange('stateOfResidence', e.target.value)}
            className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
              errors.stateOfResidence ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select state</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
            <option value="Kano">Kano</option>
            <option value="Rivers">Rivers</option>
            <option value="Ogun">Ogun</option>
          </select>
          {errors.stateOfResidence && <p className="mt-1 text-xs text-red-600">{errors.stateOfResidence}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <select
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select state</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
            <option value="Kano">Kano</option>
            <option value="Rivers">Rivers</option>
            <option value="Ogun">Ogun</option>
          </select>
          {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">City of Residence *</label>
        <input
          type="text"
          value={formData.cityOfResidence}
          onChange={(e) => handleInputChange('cityOfResidence', e.target.value)}
          className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
            errors.cityOfResidence ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="City name"
        />
        {errors.cityOfResidence && <p className="mt-1 text-xs text-red-600">{errors.cityOfResidence}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Currency Code</label>
        <select
          value={formData.currencyCode}
          onChange={(e) => handleInputChange('currencyCode', e.target.value)}
          className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--greenHex)]"
        >
          <option value="NGN">NGN - Nigerian Naira</option>
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
        </select>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Scheme Code *</label>
        <input
          type="text"
          value={formData.schmCode}
          onChange={(e) => handleInputChange('schmCode', e.target.value)}
          className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
            errors.schmCode ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Scheme code"
        />
        {errors.schmCode && <p className="mt-1 text-xs text-red-600">{errors.schmCode}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Primary SOL ID *</label>
        <input
          type="text"
          value={formData.primarySolId}
          onChange={(e) => handleInputChange('primarySolId', e.target.value)}
          className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
            errors.primarySolId ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Primary SOL ID"
        />
        {errors.primarySolId && <p className="mt-1 text-xs text-red-600">{errors.primarySolId}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
        <input
          type="text"
          value={formData.tax}
          onChange={(e) => handleInputChange('tax', e.target.value)}
          className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--greenHex)]"
          placeholder="Tax identification number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ID Issue Date *</label>
        <input
          type="date"
          value={formData.idIssueDate}
          onChange={(e) => handleInputChange('idIssueDate', e.target.value)}
          className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[var(--greenHex)] focus:border-transparent ${
            errors.idIssueDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.idIssueDate && <p className="mt-1 text-xs text-red-600">{errors.idIssueDate}</p>}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Name:</span> {formData.corporateName}</p>
          <p><span className="font-medium">Company:</span> {formData.companyName}</p>
          <p><span className="font-medium">Email:</span> {formData.emailAddress}</p>
          <p><span className="font-medium">Account Type:</span> {formData.accountType}</p>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto border border-gray-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-black font-urbanist">
                Create New Fidelity Account
              </h2>
              <p className="text-[var(--greyHex)] mt-1 text-xs sm:text-sm font-urbanist">
                Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--greenHex)] hover:text-green-700 ml-2 sm:ml-4 p-1 transition-all duration-200"
            >
              <CloseCircle size={24} color="currentColor" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[var(--greenHex)] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {stepTitles.map((title, index) => (
                <span key={index} className={`${index + 1 <= currentStep ? 'text-[var(--greenHex)]' : ''}`}>
                  {index + 1}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          {Object.keys(errors).length > 0 && Object.values(errors).some(error => error && !['corporateName', 'gender', 'nationality', 'bvnId', 'emailAddress', 'phoneNumber', 'companyName', 'accountType', 'tiers', 'rcnumber', 'dateOfIncorporation', 'addressLine1', 'stateOfResidence', 'state', 'cityOfResidence', 'schmCode', 'primarySolId', 'idIssueDate'].includes(Object.keys(errors).find(key => errors[key] === error))) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">Please fix the errors below before proceeding.</p>
            </div>
          )}

          {renderStepContent()}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white p-4 sm:p-6 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={isLoading}
              className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-[var(--greenHex)] text-white hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)] shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : currentStep === totalSteps ? (
                'Create Account'
              ) : (
                <>
                  Next
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};