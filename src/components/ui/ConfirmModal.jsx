// src/components/ui/ConfirmModal.jsx
import React from 'react';
import { AlertTriangle, AlertCircle, HelpCircle, Trash2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-rose-100 text-rose-600 border border-rose-200',
    confirmButtonVariant: 'danger',
    defaultConfirmText: 'Delete Permanently',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100 text-amber-600 border border-amber-200',
    confirmButtonVariant: 'warning',
    defaultConfirmText: 'Proceed',
  },
  primary: {
    icon: HelpCircle,
    iconBg: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    confirmButtonVariant: 'primary',
    defaultConfirmText: 'Confirm',
  },
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  subtitle,
  message,
  children,
  confirmText,
  cancelText = 'Cancel',
  variant = 'danger',
  icon: CustomIcon,
  loading = false,
}) {
  const config = variantConfig[variant] || variantConfig.danger;
  const IconComponent = CustomIcon || config.icon;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

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
            variant={config.confirmButtonVariant}
            size="md"
            icon={IconComponent}
            loading={loading}
            onClick={handleConfirm}
          >
            {confirmText || config.defaultConfirmText}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3.5 py-1">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg}`}>
          <IconComponent size={20} />
        </div>
        <div className="space-y-2 text-xs text-slate-700 flex-1 leading-relaxed">
          {message && <div className="text-sm font-medium text-slate-800">{message}</div>}
          {children}
        </div>
      </div>
    </Modal>
  );
}
