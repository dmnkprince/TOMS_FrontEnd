import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: React.createElement(CheckCircle, { className: 'text-green-500', size: 18 }),
  error:   React.createElement(XCircle,     { className: 'text-red-500',   size: 18 }),
  info:    React.createElement(Info,        { className: 'text-blue-500',  size: 18 }),
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id}
            className="flex items-center gap-2 bg-white border rounded-lg shadow-lg px-4 py-3 text-sm max-w-xs">
            {ICONS[t.type]}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
