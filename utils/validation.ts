// Validation utilities

/**
 * Validates phone number to ensure it's exactly 11 digits
 * @param phoneNumber - The phone number string to validate
 * @returns Object with isValid boolean and error message
 */
export const validatePhoneNumber = (phoneNumber: string): { isValid: boolean; error: string } => {
  if (!phoneNumber) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove all non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');

  if (cleanNumber.length !== 11) {
    return { 
      isValid: false, 
      error: `Phone number must be exactly 11 digits. You entered ${cleanNumber.length} digits.` 
    };
  }

  // Check if it starts with valid Nigerian phone number prefixes
  const validPrefixes = ['080', '081', '082', '083', '084', '085', '086', '087', '088', '089', '090', '091', '092', '093', '094', '095', '096', '097', '098', '099', '070', '071', '072', '073', '074', '075', '076', '077', '078', '079'];
  const prefix = cleanNumber.substring(0, 3);
  
  if (!validPrefixes.includes(prefix)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid Nigerian phone number' 
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Formats phone number input to show only digits and limit to 11 characters
 * @param value - The input value
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const cleanNumber = value.replace(/\D/g, '');
  
  // Limit to 11 digits
  return cleanNumber.substring(0, 11);
};

/**
 * Validates email format
 * @param email - The email string to validate
 * @returns Object with isValid boolean and error message
 */
export const validateEmail = (email: string): { isValid: boolean; error: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, error: '' };
};