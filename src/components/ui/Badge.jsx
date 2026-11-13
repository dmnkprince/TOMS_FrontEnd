// src/components/ui/Badge.jsx
import React from 'react';

const variants = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
  danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
  error: 'bg-rose-50 text-rose-700 border-rose-200/80',
  info: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  navy: 'bg-[#052e16] text-emerald-300 border-emerald-800',
  darkGreen: 'bg-[#052e16] text-white border-emerald-800',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  default: 'bg-slate-100 text-slate-700 border-slate-200',
};

function Badge({ children, variant = 'default', className = '' }) {
  const style = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
