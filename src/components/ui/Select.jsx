// src/components/ui/Select.jsx
import React from 'react';

function Select({
  label,
  error,
  hint,
  id,
  options = [],
  className = '',
  required = false,
  placeholder = 'Select an option...',
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
        >
          {label} {required && <span className="text-amber-600">*</span>}
        </label>
      )}
      <select
        id={selectId}
        required={required}
        className={`w-full rounded-lg border bg-white text-slate-900 text-sm py-2 px-3 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 hover:border-slate-400'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="text-rose-600 text-xs mt-1 font-medium">{error}</p>}
      {hint && !error && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
    </div>
  );
}

export default Select;
