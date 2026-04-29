const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  disabled,
  icon,
  required,
  className = '',
  ...props
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const baseClasses = 'w-full px-3 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs';
  
  const stateClasses = error
    ? 'border-red-200 dark:border-red-500/20 focus:border-red-300 focus:ring-red-400/40'
    : success
    ? 'border-green-200 dark:border-green-500/20 focus:border-green-300 focus:ring-green-400/40'
    : 'border-gray-200 dark:border-zinc-700 focus:border-blue-300 focus:ring-blue-400/40 bg-gray-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-700';

  const textClasses = 'text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${baseClasses} ${stateClasses} ${textClasses} ${icon ? 'pl-10' : ''}`}
          {...props}
        />
        {success && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
