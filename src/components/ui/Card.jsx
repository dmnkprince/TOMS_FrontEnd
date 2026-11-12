import React from 'react';

function Card({ title, children, footer, className = '' }) {
  return (
    <div className={"bg-white rounded-lg shadow p-5 " + className}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
      {footer && <div className="mt-4 pt-3 border-t text-sm text-gray-500">{footer}</div>}
    </div>
  );
}

export default Card;
