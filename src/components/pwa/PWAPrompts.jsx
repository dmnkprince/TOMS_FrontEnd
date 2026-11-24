// src/components/pwa/PWAPrompts.jsx
import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, WifiOff, X } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export default function PWAPrompts() {
  const {
    canInstall,
    promptInstall,
    needRefresh,
    applyUpdate,
    dismissUpdate,
    isOnline,
  } = usePWA();

  const [countdown, setCountdown] = useState(6);
  const [installDismissed, setInstallDismissed] = useState(false);

  useEffect(() => {
    if (!canInstall || installDismissed) return;

    setCountdown(6);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setInstallDismissed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [canInstall, installDismissed]);

  const handleInstall = async () => {
    setInstallDismissed(true);
    await promptInstall();
  };

  const handleDismissInstall = () => {
    setInstallDismissed(true);
  };

  return (
    <>
      {/* ── Offline Banner ── */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 bg-amber-500 py-2 px-4 text-sm font-semibold text-amber-950">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>You're offline — data will sync when connection is restored</span>
        </div>
      )}

      {/* ── Update Available Toast ── */}
      {needRefresh && (
        <div className="fixed bottom-24 left-4 right-4 z-[100] mx-auto max-w-sm rounded-xl border border-emerald-700 bg-[#052e16] p-4 shadow-2xl sm:left-auto sm:right-6 sm:w-80">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
              <RefreshCw className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Update available</p>
              <p className="mt-0.5 text-xs text-emerald-300/70">
                A new version of TOMS is ready to install.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={applyUpdate}
                  className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                >
                  Update now
                </button>
                <button
                  onClick={dismissUpdate}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-900/50 transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
            <button
              onClick={dismissUpdate}
              className="text-emerald-500 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Install Banner with 6-second Countdown ── */}
      {canInstall && !installDismissed && (
        <div className="fixed bottom-24 left-4 right-4 z-[99] mx-auto max-w-sm rounded-xl border border-emerald-700 bg-[#052e16] p-4 shadow-2xl sm:left-auto sm:right-6 sm:w-80 animate-in slide-in-from-bottom-2 duration-200 overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
              <Download className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">Install TOMS</p>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 shrink-0">
                  {countdown}s
                </span>
              </div>
              <p className="mt-0.5 text-xs text-emerald-300/70">
                Add to your home screen for quick offline access in the field.
              </p>

              {/* 6-second countdown progress bar */}
              <div className="w-full bg-emerald-950 rounded-full h-1 my-2.5 overflow-hidden border border-emerald-800/40">
                <div
                  className="bg-emerald-400 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 6) * 100}%` }}
                />
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 rounded-lg bg-emerald-600 py-1.5 px-3 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors shadow-xs"
                >
                  Install now ({countdown}s)
                </button>
                <button
                  onClick={handleDismissInstall}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-900/50 transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
            <button
              onClick={handleDismissInstall}
              className="text-emerald-500 hover:text-white transition-colors -mt-1 -mr-1 p-1"
              aria-label="Dismiss install prompt"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
