import { useState, useEffect } from 'react';

/**
 * useDebounce – delays updating a value until after a specified delay.
 * Useful for search inputs to avoid excessive API calls.
 * 
 * @param {any} value The value to debounce
 * @param {number} delay Delay in milliseconds
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}