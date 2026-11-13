// src/components/ui/Card.jsx
import React from 'react';

function Card({
  title,
  subtitle,
  action,
  children,
  footer,
  className = '',
  bodyClassName = 'p-5 sm:p-6',
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
      {footer && (
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 rounded-b-xl text-xs text-slate-600">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
