import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronDown } from 'react-icons/io5';

const Dropdown = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  error = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
          {label}
        </label>
      )}
      
      <motion.button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={`
          w-full px-4 py-2.5 text-left rounded-xl border transition-all
          flex items-center justify-between
          ${disabled 
            ? 'bg-gray-100 dark:bg-zinc-800 cursor-not-allowed opacity-60' 
            : 'bg-gray-50 dark:bg-zinc-800 hover:bg-white dark:hover:bg-zinc-700'
          }
          ${isOpen 
            ? 'border-blue-300 dark:border-blue-500 bg-white dark:bg-zinc-700 ring-2 ring-blue-100 dark:ring-blue-500/20' 
            : 'border-gray-200 dark:border-zinc-700'
          }
          ${error ? 'border-red-300 dark:border-red-500' : ''}
        `}
      >
        <span className={`text-sm ${
          selectedOption 
            ? 'text-gray-900 dark:text-white' 
            : 'text-gray-400 dark:text-zinc-500'
        }`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IoChevronDown className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="py-1">
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  className={`
                    w-full px-4 py-2.5 text-left text-sm transition-colors
                    ${value === option.value
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700'
                    }
                  `}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-red-500 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Dropdown;
