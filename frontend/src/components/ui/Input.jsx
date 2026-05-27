// Input.jsx
const Input = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  helperText = '',
  disabled = false,
  required = false,
  className = '',
  ...rest
}) => {
  const inputBase =
    'w-full bg-gray-900 text-gray-100 placeholder-gray-600 border text-sm px-3 py-2.5 transition-colors duration-150 focus:outline-none focus:ring-1';

  const inputState = error
    ? 'border-red-500 focus:border-red-400 focus:ring-red-500'
    : 'border-gray-700 hover:border-gray-600 focus:border-amber-500 focus:ring-amber-500';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-widest text-gray-400"
        >
          {label}
          {required && <span className="text-amber-500 ml-1">*</span>}
        </label>
      )}

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`${inputBase} ${inputState} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...rest}
      />

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;