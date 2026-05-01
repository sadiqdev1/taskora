// Exchange rate (1 USD = 1650 NGN)
const USD_TO_NGN_RATE = 1650;

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return currency === 'NGN' ? '₦0' : '$0.00';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (currency === 'NGN') {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

// Format dual currency (USD / NGN)
export const formatDualCurrency = (amountUSD) => {
  if (amountUSD === null || amountUSD === undefined) return { usd: '$0.00', ngn: '₦0', display: '$0.00 / ₦0' };
  
  const numAmount = typeof amountUSD === 'string' ? parseFloat(amountUSD) : amountUSD;
  const amountNGN = numAmount * USD_TO_NGN_RATE;
  
  return {
    usd: formatCurrency(numAmount, 'USD'),
    ngn: formatCurrency(amountNGN, 'NGN'),
    display: `${formatCurrency(numAmount, 'USD')} / ${formatCurrency(amountNGN, 'NGN')}`
  };
};

// Format date
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  return formatDate(date);
};

// Format number with commas
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Format percentage
export const formatPercentage = (value, decimals = 0) => {
  return `${value.toFixed(decimals)}%`;
};
