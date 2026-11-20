// src/components/auth/SessionTimeoutModal.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, ShieldAlert, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

// 30 minutes total inactivity limit
const INACTIVITY_LIMIT_MS = 30 * 60 * 1000;
// Warning appears 2 minutes before logout (at 28 minutes)
const WARNING_BEFORE_MS = 2 * 60 * 1000;
const WARNING_THRESHOLD_MS = INACTIVITY_LIMIT_MS - WARNING_BEFORE_MS; // 28 mins

const STORAGE_LAST_ACTIVE_KEY = 'toms_last_active_time';

export default function SessionTimeoutModal() {
  const { isAuthenticated, logout } = useAuth();
  const addToast = useToast();

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(120);

  const lastActiveRef = useRef(Date.now());
  const countdownIntervalRef = useRef(null);
  const checkIntervalRef = useRef(null);

  // Update last active timestamp
  const recordActivity = useCallback(() => {
    const now = Date.now();
    // Throttle writes: only update if at least 1 second passed
    if (now - lastActiveRef.current > 1000) {
      lastActiveRef.current = now;
      try {
        localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, String(now));
      } catch {}
    }
  }, []);

  // Handle actual logout execution
  const executeLogout = useCallback(
    (reason = 'inactivity') => {
      setIsWarningOpen(false);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);

      try {
        localStorage.removeItem(STORAGE_LAST_ACTIVE_KEY);
      } catch {}

      logout();

      if (reason === 'inactivity' && addToast) {
        addToast('Your session ended due to 30 minutes of inactivity.', 'warning', 6000);
      }
    },
    [logout, addToast]
  );

  // Extend session: reset timer and close warning
  const extendSession = useCallback(() => {
    const now = Date.now();
    lastActiveRef.current = now;
    try {
      localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, String(now));
    } catch {}

    setIsWarningOpen(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  // Check inactivity state
  const evaluateInactivity = useCallback(() => {
    if (!isAuthenticated) return;

    // Check against memory or localStorage (shared across tabs / after sleep)
    let lastTime = lastActiveRef.current;
    try {
      const stored = localStorage.getItem(STORAGE_LAST_ACTIVE_KEY);
      if (stored) {
        const parsed = Number(stored);
        if (!isNaN(parsed) && parsed > lastTime) {
          lastTime = parsed;
          lastActiveRef.current = parsed;
        }
      }
    } catch {}

    const elapsed = Date.now() - lastTime;

    // 1. Time exceeded 30 minutes -> Auto logout immediately
    if (elapsed >= INACTIVITY_LIMIT_MS) {
      executeLogout('inactivity');
      return;
    }

    // 2. Time between 28m and 30m -> Trigger or update warning countdown
    if (elapsed >= WARNING_THRESHOLD_MS) {
      const remainingSeconds = Math.max(1, Math.round((INACTIVITY_LIMIT_MS - elapsed) / 1000));
      setSecondsRemaining(remainingSeconds);
      setIsWarningOpen(true);

      // Start tick down if not already running
      if (!countdownIntervalRef.current) {
        countdownIntervalRef.current = setInterval(() => {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
              executeLogout('inactivity');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      // User became active in another tab or interacted
      if (isWarningOpen) {
        setIsWarningOpen(false);
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
      }
    }
  }, [isAuthenticated, executeLogout, isWarningOpen]);

  // Main listener setup when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setIsWarningOpen(false);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      return;
    }

    // Initialize timestamp
    const now = Date.now();
    lastActiveRef.current = now;
    try {
      localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, String(now));
    } catch {}

    // User interaction events to track
    const events = ['mousedown', 'touchstart', 'keydown', 'scroll', 'click'];
    const handleUserActivity = () => {
      recordActivity();
      // If warning modal is not open, normal activity keeps extending
      if (!isWarningOpen) {
        lastActiveRef.current = Date.now();
      }
    };

    events.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    // Check periodically every 10 seconds
    checkIntervalRef.current = setInterval(evaluateInactivity, 10000);

    // Handle screen unlock / wake from sleep / switching back to app
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        evaluateInactivity();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isAuthenticated, evaluateInactivity, recordActivity, isWarningOpen]);

  if (!isWarningOpen || !isAuthenticated) return null;

  // Format seconds to MM:SS
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-center space-y-5 animate-in zoom-in-95 duration-150">
        {/* Warning Icon Badge */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
          <Clock size={28} className="animate-pulse" />
        </div>

        {/* Title and Explanation */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Session Timeout Warning
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            You have been inactive for nearly 30 minutes. To protect security, your session will automatically terminate in:
          </p>
        </div>

        {/* Countdown Badge */}
        <div className="py-3 px-6 bg-amber-50/70 border border-amber-300 rounded-xl inline-block">
          <span className="font-mono text-3xl font-black text-amber-950 tracking-widest">
            {timeFormatted}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={extendSession}
            className="w-full py-3 px-5 rounded-xl font-bold text-sm bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <CheckCircle2 size={18} />
            Stay Logged In
          </button>

          <button
            type="button"
            onClick={() => executeLogout('manual')}
            className="w-full py-3 px-5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Log Out Now
          </button>
        </div>
      </div>
    </div>
  );
}
