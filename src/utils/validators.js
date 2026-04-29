import { PASSWORD_MIN_LENGTH } from './constants';

export const validators = {
  email: (value) => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return null;
  },

  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  },

  minAmount: (min) => (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < min) {
      return `Amount must be at least $${min}`;
    }
    return null;
  },

  maxAmount: (max) => (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue > max) {
      return `Amount cannot exceed $${max}`;
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (!value || value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return null;
  },

  passwordMatch: (password) => (value) => {
    if (value !== password) {
      return 'Passwords do not match';
    }
    return null;
  },
};
