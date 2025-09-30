import { BVNVerificationResponse } from '@/types/api';

// Mapping function to populate form data from BVN response
export const mapBVNToFormData = (bvnResponse: BVNVerificationResponse) => {
  const bvnData = bvnResponse.nibBvnResponse;

  return {
    // Personal Information mapped from BVN
    corporateName: `${bvnData.firstName} ${bvnData.middleName ? bvnData.middleName + ' ' : ''}${bvnData.lastName}`.trim(),
    gender: bvnData.gender?.toLowerCase() === 'male' ? 'MALE' :
            bvnData.gender?.toLowerCase() === 'female' ? 'FEMALE' : '',
    nationality: bvnData.nationality || 'Nigeria',
    bvnId: bvnData.bvn,
    emailAddress: bvnData.email || '',
    phoneNumber: bvnData.phoneNumber1 || bvnData.phoneNumber2 || '',
    phoneNumberCountryCode: '+234', // Default to Nigeria

    // Address information from BVN
    addressLine1: bvnData.residentialAddress || '',
    stateOfResidence: bvnData.stateOfResidence || '',
    state: bvnData.stateOfOrigin || bvnData.stateOfResidence || '',
    cityOfResidence: bvnData.lgaOfResidence || '',

    // Other details that can be inferred
    currencyCode: 'NGN', // Default to Nigerian Naira

    // Business fields - these will still need to be filled manually
    companyName: '',
    accountType: '',
    tiers: '',
    rcnumber: '',
    dateOfIncorporation: '',
    sectorCode: '',
    subSectorCode: '',
    schmCode: '',
    primarySolId: '',
    tax: '',
    idIssueDate: '',
  };
};

// Helper function to get what fields were populated from BVN
export const getBVNPopulatedFields = (bvnResponse: BVNVerificationResponse): string[] => {
  const bvnData = bvnResponse.nibBvnResponse;
  const populatedFields: string[] = [];

  if (bvnData.firstName && bvnData.lastName) populatedFields.push('Full Name');
  if (bvnData.gender) populatedFields.push('Gender');
  if (bvnData.nationality) populatedFields.push('Nationality');
  if (bvnData.bvn) populatedFields.push('BVN');
  if (bvnData.email) populatedFields.push('Email');
  if (bvnData.phoneNumber1 || bvnData.phoneNumber2) populatedFields.push('Phone Number');
  if (bvnData.residentialAddress) populatedFields.push('Address');
  if (bvnData.stateOfResidence) populatedFields.push('State of Residence');
  if (bvnData.lgaOfResidence) populatedFields.push('City/LGA');

  return populatedFields;
};

// Helper function to format date from BVN format to form format
export const formatBVNDate = (bvnDate: string): string => {
  try {
    // BVN date format: "04-Jun-1987"
    const date = new Date(bvnDate);
    if (isNaN(date.getTime())) {
      return '';
    }
    // Return in YYYY-MM-DD format for HTML date inputs
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};