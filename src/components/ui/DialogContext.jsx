// src/components/ui/DialogContext.jsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import ConfirmModal from './ConfirmModal';
import PromptModal from './PromptModal';

const DialogContext = createContext(null);

export function DialogProvider({ children }) {
  const [confirmState, setConfirmState] = useState(null);
  const [promptState, setPromptState] = useState(null);

  const confirmResolver = useRef(null);
  const promptResolver = useRef(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      confirmResolver.current = resolve;
      setConfirmState({
        title: options.title || 'Confirm Action',
        subtitle: options.subtitle || null,
        message: options.message || null,
        children: options.children || null,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        variant: options.variant || 'danger',
        icon: options.icon || null,
      });
    });
  }, []);

  const closeConfirm = (confirmed) => {
    if (confirmResolver.current) {
      confirmResolver.current(Boolean(confirmed));
      confirmResolver.current = null;
    }
    setConfirmState(null);
  };

  const prompt = useCallback((options = {}) => {
    return new Promise((resolve) => {
      promptResolver.current = resolve;
      setPromptState({
        title: options.title || 'Please Provide Details',
        subtitle: options.subtitle || null,
        label: options.label || 'Input',
        placeholder: options.placeholder || 'Type here...',
        defaultValue: options.defaultValue || '',
        multiline: options.multiline !== false,
        required: options.required !== false,
        confirmText: options.confirmText || 'Submit',
        cancelText: options.cancelText || 'Cancel',
        variant: options.variant || 'primary',
        icon: options.icon || null,
      });
    });
  }, []);

  const closePrompt = (result) => {
    if (promptResolver.current) {
      promptResolver.current(result);
      promptResolver.current = null;
    }
    setPromptState(null);
  };

  return (
    <DialogContext.Provider value={{ confirm, prompt }}>
      {children}

      {/* Global Confirmation Dialog */}
      {confirmState && (
        <ConfirmModal
          isOpen={Boolean(confirmState)}
          onClose={() => closeConfirm(false)}
          onConfirm={() => closeConfirm(true)}
          title={confirmState.title}
          subtitle={confirmState.subtitle}
          message={confirmState.message}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          variant={confirmState.variant}
          icon={confirmState.icon}
        >
          {confirmState.children}
        </ConfirmModal>
      )}

      {/* Global Prompt Dialog */}
      {promptState && (
        <PromptModal
          isOpen={Boolean(promptState)}
          onClose={() => closePrompt(null)}
          onSubmit={(val) => closePrompt(val)}
          title={promptState.title}
          subtitle={promptState.subtitle}
          label={promptState.label}
          placeholder={promptState.placeholder}
          defaultValue={promptState.defaultValue}
          multiline={promptState.multiline}
          required={promptState.required}
          confirmText={promptState.confirmText}
          cancelText={promptState.cancelText}
          variant={promptState.variant}
          icon={promptState.icon}
        />
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    // Provide safe fallbacks if accessed outside provider
    return {
      confirm: async (opts) => window.confirm(opts?.message || opts?.title || 'Are you sure?'),
      prompt: async (opts) => window.prompt(opts?.label || opts?.title || 'Enter value:', opts?.defaultValue || ''),
    };
  }
  return context;
}
