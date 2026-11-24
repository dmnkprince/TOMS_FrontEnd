// src/components/ui/PromptModal.jsx
import React, { useState, useEffect } from 'react';
import { Edit3, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function PromptModal({
  isOpen,
  onClose,
  onSubmit,
  title = 'Provide Input',
  subtitle,
  label = 'Details',
  placeholder = 'Type here...',
  defaultValue = '',
  multiline = true,
  required = true,
  confirmText = 'Submit',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false,
  icon: CustomIcon,
}) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue || '');
      setError(null);
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (required && !value.trim()) {
      setError(`Please provide a valid ${label.toLowerCase()}.`);
      return;
    }
    setError(null);
    if (onSubmit) {
      onSubmit(value.trim());
    }
  };

  const IconComponent = CustomIcon || Edit3;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={loading}
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            size="md"
            icon={IconComponent}
            loading={loading}
            onClick={handleSubmit}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3 py-1">
        {label && (
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}

        {multiline ? (
          <textarea
            rows={4}
            value={value}
            disabled={loading}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition resize-none leading-relaxed"
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={value}
            disabled={loading}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
            autoFocus
          />
        )}

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </Modal>
  );
}
