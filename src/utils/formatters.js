// Currency formatting utilities
export const formatCurrency = (amount, options = {}) => {
  const {
    currency = 'KES',
    symbol = 'Ksh',
    decimals = 2,
    showSymbol = true,
  } = options;

  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? `${symbol} 0` : '0';
  }

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = numericAmount.toLocaleString('en-KE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return showSymbol ? `${symbol} ${formatted}` : formatted;
};

// Parse currency string to number
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;

  const cleanString = currencyString
    .toString()
    .replace(/[^0-9.-]/g, '')
    .replace(/,/g, '');

  return parseFloat(cleanString) || 0;
};

// Number formatting
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }

  return number.toLocaleString('en-KE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  const percentage = typeof value === 'number' && value <= 1 ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
};

// Date formatting utilities
export const formatDate = (date, format = 'short') => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    medium: { month: 'short', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
    datetime: {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
  };

  return dateObj.toLocaleDateString('en-US', options[format] || options.short);
};

// Relative time formatting (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(dateObj, 'short');
};

// Phone number formatting
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';

  const cleaned = phoneNumber.toString().replace(/\D/g, '');

  // Kenya phone number format: +254 XXX XXX XXX
  if (cleaned.length === 12 && cleaned.startsWith('254')) {
    return `+254 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }

  // Local format: 0XXX XXX XXX
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  return phoneNumber;
};

// Name formatting
export const formatName = (firstName, lastName, options = {}) => {
  const { format = 'full', capitalize = true } = options;

  if (!firstName && !lastName) return '';

  const first = firstName ? firstName.trim() : '';
  const last = lastName ? lastName.trim() : '';

  let formatted = '';

  switch (format) {
    case 'first':
      formatted = first;
      break;
    case 'last':
      formatted = last;
      break;
    case 'initials':
      formatted = `${first.charAt(0)}${last.charAt(0)}`;
      break;
    case 'firstInitial':
      formatted = `${first} ${last.charAt(0)}.`;
      break;
    default: // full
      formatted = `${first} ${last}`.trim();
  }

  if (capitalize && formatted) {
    return formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  return formatted;
};

// Credit score formatting and categorization
export const getCreditScoreCategory = (score) => {
  if (score >= 800) return { text: 'Excellent', color: '#00D9B5', range: '800-850' };
  if (score >= 740) return { text: 'Very Good', color: '#2196F3', range: '740-799' };
  if (score >= 670) return { text: 'Good', color: '#4CAF50', range: '670-739' };
  if (score >= 580) return { text: 'Fair', color: '#FFC107', range: '580-669' };
  return { text: 'Poor', color: '#FF5252', range: '300-579' };
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Text truncation
export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (!text || text.length <= maxLength) return text || '';

  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Convert camelCase to Title Case
export const camelToTitle = (str) => {
  if (!str) return '';

  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
};

// Generate random ID
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

// Format duration in months to human readable
export const formatDuration = (months) => {
  if (!months || months <= 0) return '';

  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  }

  const yearText = years === 1 ? '1 year' : `${years} years`;
  const monthText = remainingMonths === 1 ? '1 month' : `${remainingMonths} months`;

  return `${yearText}, ${monthText}`;
};

// Format loan status
export const formatLoanStatus = (status) => {
  const statusMap = {
    pending: { text: 'Under Review', color: '#FFC107', icon: 'time' },
    approved: { text: 'Approved', color: '#00D9B5', icon: 'checkmark-circle' },
    rejected: { text: 'Rejected', color: '#FF5252', icon: 'close-circle' },
    disbursed: { text: 'Active', color: '#4CAF50', icon: 'wallet' },
    completed: { text: 'Completed', color: '#9C27B0', icon: 'trophy' },
    overdue: { text: 'Overdue', color: '#FF5722', icon: 'warning' },
  };

  return statusMap[status?.toLowerCase()] || {
    text: 'Unknown',
    color: '#8F92A1',
    icon: 'help-circle'
  };
};

export default {
  formatCurrency,
  parseCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatRelativeTime,
  formatPhoneNumber,
  formatName,
  getCreditScoreCategory,
  formatFileSize,
  truncateText,
  capitalize,
  camelToTitle,
  generateId,
  formatDuration,
  formatLoanStatus,
};
