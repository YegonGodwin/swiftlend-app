// Email validation
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

// Phone number validation (Kenya format)
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Kenya phone number patterns
  const patterns = [
    /^254[17]\d{8}$/, // +254 7XX XXX XXX or +254 1XX XXX XXX
    /^0[17]\d{8}$/,   // 07XX XXX XXX or 01XX XXX XXX
    /^[17]\d{8}$/,    // 7XX XXX XXX or 1XX XXX XXX
  ];

  const isValid = patterns.some(pattern => pattern.test(cleaned));

  if (!isValid) {
    return {
      isValid: false,
      error: 'Please enter a valid Kenya phone number'
    };
  }

  return { isValid: true };
};

// Password validation
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
  } = options;

  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters long`
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter'
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter'
    };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number'
    };
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character'
    };
  }

  return { isValid: true };
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name || !name.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: `${fieldName} must be at least 2 characters long`
    };
  }

  if (name.trim().length > 50) {
    return {
      isValid: false,
      error: `${fieldName} must be less than 50 characters`
    };
  }

  // Only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name.trim())) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
    };
  }

  return { isValid: true };
};

// Loan amount validation
export const validateLoanAmount = (amount, loanType) => {
  if (!amount || isNaN(amount)) {
    return { isValid: false, error: 'Loan amount is required' };
  }

  const numericAmount = parseFloat(amount);

  if (numericAmount <= 0) {
    return { isValid: false, error: 'Loan amount must be greater than 0' };
  }

  // Loan type specific validation
  const limits = {
    personal: { min: 1000, max: 50000 },
    business: { min: 5000, max: 500000 },
    emergency: { min: 500, max: 20000 },
    education: { min: 2000, max: 100000 },
  };

  const limit = limits[loanType] || limits.personal;

  if (numericAmount < limit.min) {
    return {
      isValid: false,
      error: `Minimum loan amount for ${loanType} loan is Ksh ${limit.min.toLocaleString()}`
    };
  }

  if (numericAmount > limit.max) {
    return {
      isValid: false,
      error: `Maximum loan amount for ${loanType} loan is Ksh ${limit.max.toLocaleString()}`
    };
  }

  return { isValid: true };
};

// Income validation
export const validateIncome = (income) => {
  if (!income || isNaN(income)) {
    return { isValid: false, error: 'Monthly income is required' };
  }

  const numericIncome = parseFloat(income);

  if (numericIncome <= 0) {
    return { isValid: false, error: 'Monthly income must be greater than 0' };
  }

  if (numericIncome < 5000) {
    return {
      isValid: false,
      error: 'Minimum monthly income requirement is Ksh 5,000'
    };
  }

  if (numericIncome > 10000000) {
    return {
      isValid: false,
      error: 'Please enter a valid income amount'
    };
  }

  return { isValid: true };
};

// Age validation
export const validateAge = (dateOfBirth) => {
  if (!dateOfBirth) {
    return { isValid: false, error: 'Date of birth is required' };
  }

  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));

  if (age < 18) {
    return {
      isValid: false,
      error: 'You must be at least 18 years old to apply for a loan'
    };
  }

  if (age > 100) {
    return {
      isValid: false,
      error: 'Please enter a valid date of birth'
    };
  }

  return { isValid: true };
};

// ID number validation (Kenya National ID)
export const validateKenyanID = (idNumber) => {
  if (!idNumber) {
    return { isValid: false, error: 'National ID number is required' };
  }

  // Remove any spaces or special characters
  const cleaned = idNumber.replace(/\D/g, '');

  // Kenya National ID should be 8 digits
  if (cleaned.length !== 8) {
    return {
      isValid: false,
      error: 'National ID number should be 8 digits'
    };
  }

  return { isValid: true };
};

// PIN validation (4-6 digits)
export const validatePIN = (pin) => {
  if (!pin) {
    return { isValid: false, error: 'PIN is required' };
  }

  const cleaned = pin.replace(/\D/g, '');

  if (cleaned.length < 4 || cleaned.length > 6) {
    return {
      isValid: false,
      error: 'PIN must be 4-6 digits'
    };
  }

  // Check for common weak PINs
  const weakPINs = ['1234', '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999'];
  if (weakPINs.includes(cleaned)) {
    return {
      isValid: false,
      error: 'Please choose a more secure PIN'
    };
  }

  return { isValid: true };
};

// File validation
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'],
    required = true,
  } = options;

  if (!file) {
    if (required) {
      return { isValid: false, error: 'File is required' };
    }
    return { isValid: true };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    };
  }

  // Check file type
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Only ${allowedTypes.join(', ').toUpperCase()} files are allowed`
    };
  }

  return { isValid: true };
};

// General required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
};

// Numeric validation
export const validateNumeric = (value, fieldName, options = {}) => {
  const { min, max, allowDecimals = true } = options;

  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (!allowDecimals && !Number.isInteger(numValue)) {
    return { isValid: false, error: `${fieldName} must be a whole number` };
  }

  if (min !== undefined && numValue < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min}`
    };
  }

  if (max !== undefined && numValue > max) {
    return {
      isValid: false,
      error: `${fieldName} must not exceed ${max}`
    };
  }

  return { isValid: true };
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field];

    for (const rule of rules) {
      const result = rule(value);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  }

  return { isValid, errors };
};

// Credit card validation (basic Luhn algorithm)
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) {
    return { isValid: false, error: 'Card number is required' };
  }

  // Remove spaces and non-digits
  const cleaned = cardNumber.replace(/\D/g, '');

  if (cleaned.length < 13 || cleaned.length > 19) {
    return {
      isValid: false,
      error: 'Card number must be 13-19 digits'
    };
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, error: 'Invalid card number' };
  }

  return { isValid: true };
};

export default {
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  validateName,
  validateLoanAmount,
  validateIncome,
  validateAge,
  validateKenyanID,
  validatePIN,
  validateFile,
  validateRequired,
  validateNumeric,
  validateForm,
  validateCreditCard,
};
