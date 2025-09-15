export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
  score: number;
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let score = 0;

  // Check length (6 to 2147483647 characters)
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  } else if (password.length > 2147483647) {
    errors.push('Password is too long');
  } else {
    score += 1;
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Check for digit
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Check for special character (non-word, non-whitespace)
  if (!/[^\w\s]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  } else {
    score += 1;
  }

  // Check for whitespace (not allowed)
  if (/\s/.test(password)) {
    errors.push('Password must not contain whitespace characters');
  }

  // Full regex pattern validation
  const fullPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S+$/;
  const passesFullPattern = fullPattern.test(password) && password.length >= 6 && password.length <= 2147483647;

  // Determine strength based on score and additional criteria
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (passesFullPattern && score >= 5) {
    if (password.length >= 12) {
      strength = 'strong';
    } else if (password.length >= 8) {
      strength = 'medium';
    }
  }

  return {
    isValid: passesFullPattern && errors.length === 0,
    errors,
    strength,
    score
  };
};

export const getPasswordStrengthColor = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'weak':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'strong':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

export const getPasswordStrengthBgColor = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
};