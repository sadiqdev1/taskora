/**
 * Controlled input with label, error state, and optional helper text.
 * Uses concrete Tailwind classes throughout (no CSS vars inside brackets).
 */
export default function Input({
  label,
  id,
  error,
  helper,
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-800">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full rounded-lg border px-3 py-2.5 text-sm bg-white text-zinc-900
          placeholder:text-zinc-400
          outline-none transition-all duration-150
          focus:ring-2 focus:ring-offset-0
          ${error
            ? 'border-red-400 focus:ring-red-400'
            : 'border-zinc-200 hover:border-zinc-300 focus:ring-indigo-500 focus:border-indigo-500'
          }
          ${className}
        `}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : helper ? `${id}-helper` : undefined
        }
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
      {!error && helper && (
        <p id={`${id}-helper`} className="text-xs text-zinc-400">
          {helper}
        </p>
      )}
    </div>
  );
}
