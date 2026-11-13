// src/components/ui/Button.jsx
import React from 'react';
import Spinner from './Spinner';

const variants = {
  primary: 'bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm focus:ring-emerald-500',
  navy: 'bg-[#052e16] hover:bg-[#064e3b] text-white font-medium shadow-sm focus:ring-emerald-500',
  darkGreen: 'bg-[#052e16] hover:bg-[#064e3b] text-white font-medium shadow-sm focus:ring-emerald-500',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:ring-slate-300',
  outline: 'border border-emerald-600 hover:bg-emerald-50 text-emerald-800 focus:ring-emerald-300 font-semibold',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm focus:ring-rose-400',
  ghost: 'bg-transparent hover:bg-emerald-50 text-emerald-800 focus:ring-emerald-200',
};

const sizes = {
  sm: 'text-xs py-1.5 px-3 rounded-md gap-1.5',
  md: 'text-sm py-2 px-4 rounded-lg gap-2',
  lg: 'text-base py-2.5 px-5 rounded-lg gap-2.5',
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon = null,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Spinner size={size === 'sm' ? 14 : 16} className="text-current" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : 16} />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export default Button;
