import React from 'react';

function Input({ label, error, id, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <input
        id={id}
        className={
          "w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 " +
          (error ? "border-red-500" : "border-gray-300") + " " + className
        }
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default Input;
