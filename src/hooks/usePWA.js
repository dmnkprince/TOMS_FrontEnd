// src/hooks/usePWA.js
import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { syncOfflineIncidents } from '../services/incidentService';

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle SW update lifecycle
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('[PWA] Service Worker registered:', r);
    },
    onRegisterError(error) {
      console.error('[PWA] Service Worker registration error:', error);
    },
  });

  // Listen for the browser's install prompt event
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Detect if already installed (standalone mode)
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsInstalled(isStandalone);
  }, []);

  // Track online/offline status + auto-sync on reconnect
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync any queued incidents when coming back online
      syncOfflineIncidents()
        .then(({ synced, failed }) => {
          if (synced > 0) {
            console.log(`[PWA] Auto-synced ${synced} offline incident(s).`);
          }
          if (failed > 0) {
            console.warn(`[PWA] ${failed} incident(s) failed to sync.`);
          }
        })
        .catch(() => {});
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const promptInstall = async () => {
    if (!installPrompt) return false;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
    return outcome === 'accepted';
  };

  const dismissUpdate = () => setNeedRefresh(false);

  const applyUpdate = () => updateServiceWorker(true);

  return {
    // Install
    canInstall: !!installPrompt && !isInstalled,
    isInstalled,
    promptInstall,
    // Update
    needRefresh,
    applyUpdate,
    dismissUpdate,
    // Connectivity
    isOnline,
  };
}
