// src/components/ui/Input.jsx
import React from 'react';

function Input({
  label,
  error,
  hint,
  id,
  className = '',
  icon: Icon = null,
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
        >
          {label} {required && <span className="text-amber-600">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon size={16} />
          </div>
        )}
        <input
          id={inputId}
          required={required}
          className={`w-full rounded-lg border bg-white text-slate-900 text-sm py-2 px-3 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 ${
            Icon ? 'pl-9' : ''
          } ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-300 hover:border-slate-400'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-rose-600 text-xs mt-1 font-medium">{error}</p>}
      {hint && !error && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
    </div>
  );
}

export default Input;
