// src/components/ui/Button.jsx
import React from 'react';
import Spinner from './Spinner';

const variants = {
  primary: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm focus:ring-amber-400',
  navy: 'bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm focus:ring-slate-500',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:ring-slate-300',
  outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-300',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm focus:ring-rose-400',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-200',
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
