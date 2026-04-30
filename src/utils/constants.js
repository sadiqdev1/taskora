// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// User Roles
export const USER_ROLES = {
  USER: 'user',
  CREATOR: 'creator',
  ADMIN: 'admin',
};

// Task Types
export const TASK_TYPES = {
  POST: 'post',
  FOLLOW: 'follow',
  COMMENT: 'comment',
  SHARE: 'share',
  DOWNLOAD: 'download',
  VISIT: 'visit',
};

// Task Status
export const TASK_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
};

// Submission Status
export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Campaign Status
export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  EARNING: 'earning',
  WITHDRAWAL: 'withdrawal',
  DEPOSIT: 'deposit',
  REFUND: 'refund',
  BONUS: 'bonus',
};

// Transaction Status
export const TRANSACTION_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'failed',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  TASK_UPDATE: 'task_update',
  PAYMENT: 'payment',
  SYSTEM: 'system',
  CAMPAIGN: 'campaign',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'taskora_auth_token',
  THEME: 'taskora_theme',
  USER: 'taskora_user',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_PAGE = 1;

// Validation
export const PASSWORD_MIN_LENGTH = 8;
export const MIN_WITHDRAWAL_AMOUNT = 10;
export const MAX_WITHDRAWAL_AMOUNT = 10000;
