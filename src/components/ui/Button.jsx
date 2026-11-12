import React from 'react';

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
};

function Button({ children, variant = 'primary', className = '', disabled, ...props }) {
  return (
    <button
      disabled={disabled}
      className={
        "font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 " +
        (variants[variant] || variants.primary) + " " + className
      }
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
