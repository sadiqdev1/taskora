const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  required,
  disabled,
  className = '',
  ...props
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const baseClasses = 'w-full px-3 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs';
  
  const stateClasses = error
    ? 'border-red-200 dark:border-red-500/20 focus:border-red-300 focus:ring-red-400/40'
    : 'border-gray-200 dark:border-zinc-700 focus:border-blue-300 focus:ring-blue-400/40 bg-gray-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-700';

  const textClasses = 'text-gray-900 dark:text-white';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className={`${baseClasses} ${stateClasses} ${textClasses}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
