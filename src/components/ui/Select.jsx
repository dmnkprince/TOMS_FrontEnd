import React from 'react';

function Select({ label, error, id, options = [], className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <select
        id={id}
        className={
          "w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 " +
          (error ? "border-red-500" : "border-gray-300") + " " + className
        }
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default Select;
