// Loan Types Configuration
export const LOAN_TYPES = {
  PERSONAL: {
    id: 'personal',
    label: 'Personal Loan',
    icon: 'person',
    description: 'For personal expenses and emergencies',
    minAmount: 1000,
    maxAmount: 50000,
    interestRate: 0.12,
    maxDuration: 36,
    processingFee: 0.02,
  },
  BUSINESS: {
    id: 'business',
    label: 'Business Loan',
    icon: 'briefcase',
    description: 'Grow your business with flexible funding',
    minAmount: 5000,
    maxAmount: 500000,
    interestRate: 0.10,
    maxDuration: 60,
    processingFee: 0.015,
  },
  EMERGENCY: {
    id: 'emergency',
    label: 'Emergency Loan',
    icon: 'flash',
    description: 'Quick cash for urgent situations',
    minAmount: 500,
    maxAmount: 20000,
    interestRate: 0.15,
    maxDuration: 24,
    processingFee: 0.025,
  },
  EDUCATION: {
    id: 'education',
    label: 'Education Loan',
    icon: 'school',
    description: 'Invest in your future with education funding',
    minAmount: 2000,
    maxAmount: 100000,
    interestRate: 0.08,
    maxDuration: 84,
    processingFee: 0.01,
  },
};

// Loan Duration Options (in months)
export const LOAN_DURATIONS = [3, 6, 12, 18, 24, 36, 48, 60];

// Credit Score Ranges
export const CREDIT_SCORE_RANGES = {
  POOR: { min: 300, max: 579, label: 'Poor', color: '#FF5252' },
  FAIR: { min: 580, max: 669, label: 'Fair', color: '#FFC107' },
  GOOD: { min: 670, max: 739, label: 'Good', color: '#4CAF50' },
  VERY_GOOD: { min: 740, max: 799, label: 'Very Good', color: '#2196F3' },
  EXCELLENT: { min: 800, max: 850, label: 'Excellent', color: '#00D9B5' },
};

// Application Status
export const APPLICATION_STATUS = {
  PENDING: { id: 'pending', label: 'Under Review', color: '#FFC107', icon: 'time' },
  APPROVED: { id: 'approved', label: 'Approved', color: '#00D9B5', icon: 'checkmark-circle' },
  REJECTED: { id: 'rejected', label: 'Rejected', color: '#FF5252', icon: 'close-circle' },
  DISBURSED: { id: 'disbursed', label: 'Disbursed', color: '#4CAF50', icon: 'wallet' },
  COMPLETED: { id: 'completed', label: 'Completed', color: '#9C27B0', icon: 'trophy' },
};

// Transaction Types
export const TRANSACTION_TYPES = {
  DISBURSEMENT: { id: 'disbursement', label: 'Loan Disbursement', icon: 'arrow-down', color: '#00D9B5' },
  PAYMENT: { id: 'payment', label: 'Payment', icon: 'arrow-up', color: '#FF6B6B' },
  FEE: { id: 'fee', label: 'Processing Fee', icon: 'receipt', color: '#FFC107' },
  INTEREST: { id: 'interest', label: 'Interest', icon: 'trending-up', color: '#FF8E53' },
  PENALTY: { id: 'penalty', label: 'Late Fee', icon: 'warning', color: '#FF5252' },
};

// Quick Actions
export const QUICK_ACTIONS = [
  {
    id: 'calculator',
    title: 'Loan Calculator',
    icon: 'calculator',
    screen: 'LoanCalculator',
    gradient: ['#4158D0', '#C850C0'],
  },
  {
    id: 'apply',
    title: 'Apply Now',
    icon: 'document-text',
    screen: 'Apply',
    gradient: ['#00D9B5', '#00A88E'],
  },
  {
    id: 'payments',
    title: 'Repayments',
    icon: 'calendar',
    screen: 'Payment',
    gradient: ['#FF6B6B', '#FF8E53'],
  },
  {
    id: 'support',
    title: 'Support',
    icon: 'headset',
    screen: 'Support',
    gradient: ['#4A90E2', '#357ABD'],
  },
];

// Financial Tips
export const FINANCIAL_TIPS = [
  {
    id: 1,
    title: 'Build Your Emergency Fund',
    description: 'Aim to save 3-6 months of expenses for unexpected situations',
    icon: 'shield-checkmark',
    color: '#00D9B5',
    category: 'savings',
  },
  {
    id: 2,
    title: 'Pay Bills On Time',
    description: 'Timely payments improve your credit score and reduce late fees',
    icon: 'time',
    color: '#4CAF50',
    category: 'credit',
  },
  {
    id: 3,
    title: 'Keep Credit Utilization Low',
    description: 'Use less than 30% of your available credit for better scores',
    icon: 'card',
    color: '#2196F3',
    category: 'credit',
  },
  {
    id: 4,
    title: 'Diversify Your Income',
    description: 'Multiple income streams provide financial security',
    icon: 'trending-up',
    color: '#FF9800',
    category: 'income',
  },
  {
    id: 5,
    title: 'Track Your Expenses',
    description: 'Monitor spending to identify areas for improvement',
    icon: 'analytics',
    color: '#9C27B0',
    category: 'budgeting',
  },
];

// Onboarding Slides
export const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Your Path to\nFinancial Freedom',
    description: 'Quick loans, transparent terms, and smart money management',
    icon: 'wallet',
    animation: 'wallet',
  },
  {
    id: '2',
    title: 'Quick & Easy\nLoan Application',
    description: 'Get approved in minutes with our streamlined process',
    icon: 'flash',
    animation: 'speed',
  },
  {
    id: '3',
    title: 'Transparent\nTerms Always',
    description: 'No hidden fees, clear terms, and competitive interest rates',
    icon: 'shield-checkmark',
    animation: 'trust',
  },
  {
    id: '4',
    title: 'AI-Powered\nFinancial Insights',
    description: 'Get personalized recommendations to improve your financial health',
    icon: 'analytics',
    animation: 'insights',
  },
];

// Currency Configuration
export const CURRENCY = {
  code: 'KES',
  symbol: 'Ksh',
  name: 'Kenyan Shilling',
  decimals: 2,
};

// App Configuration
export const APP_CONFIG = {
  name: 'SwiftLend',
  version: '2.0.0',
  supportEmail: 'support@swiftlend.com',
  supportPhone: '+254-700-000-000',
  website: 'https://swiftlend.com',
  privacyPolicy: 'https://swiftlend.com/privacy',
  termsOfService: 'https://swiftlend.com/terms',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  refreshTokenThreshold: 5 * 60 * 1000, // 5 minutes
};

// Feature Flags
export const FEATURES = {
  BIOMETRIC_AUTH: true,
  DARK_THEME: true,
  PUSH_NOTIFICATIONS: true,
  DOCUMENT_SCANNER: true,
  AI_ASSISTANT: true,
  GAMIFICATION: true,
  REFERRAL_PROGRAM: true,
  INVESTMENT_TRACKER: true,
  EXPENSE_TRACKING: true,
  CHAT_SUPPORT: true,
};

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.swiftlend.com/v1',
  AUTH: '/auth',
  LOANS: '/loans',
  APPLICATIONS: '/applications',
  PAYMENTS: '/payments',
  CREDIT_SCORE: '/credit-score',
  DOCUMENTS: '/documents',
  NOTIFICATIONS: '/notifications',
  SUPPORT: '/support',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Please check your internet connection and try again',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SESSION_EXPIRED: 'Your session has expired. Please log in again',
  LOAN_LIMIT_EXCEEDED: 'The requested amount exceeds your loan limit',
  INCOMPLETE_PROFILE: 'Please complete your profile to continue',
  DOCUMENT_UPLOAD_FAILED: 'Failed to upload document. Please try again',
  BIOMETRIC_UNAVAILABLE: 'Biometric authentication is not available on this device',
  CAMERA_PERMISSION_DENIED: 'Camera permission is required to scan documents',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  APPLICATION_SUBMITTED: 'Your loan application has been submitted successfully',
  PAYMENT_SUCCESSFUL: 'Payment processed successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  DOCUMENT_UPLOADED: 'Document uploaded successfully',
  BIOMETRIC_ENABLED: 'Biometric authentication enabled successfully',
};

export default {
  LOAN_TYPES,
  LOAN_DURATIONS,
  CREDIT_SCORE_RANGES,
  APPLICATION_STATUS,
  TRANSACTION_TYPES,
  QUICK_ACTIONS,
  FINANCIAL_TIPS,
  ONBOARDING_SLIDES,
  CURRENCY,
  APP_CONFIG,
  FEATURES,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
