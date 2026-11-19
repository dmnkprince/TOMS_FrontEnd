// src/components/pwa/NotificationToggle.jsx
import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import {
  subscribeToPush,
  unsubscribeFromPush,
  isPushSubscribed,
  getNotificationPermission,
} from '../../services/pushService';

export default function NotificationToggle({ className = '' }) {
  const [subscribed, setSubscribed] = useState(false);
  const [permission, setPermission] = useState('default');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const supported =
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window;

  useEffect(() => {
    if (!supported) {
      setLoading(false);
      return;
    }
    setPermission(getNotificationPermission());
    isPushSubscribed().then((v) => {
      setSubscribed(v);
      setLoading(false);
    });
  }, []);

  const handleToggle = async () => {
    setWorking(true);
    try {
      if (subscribed) {
        const ok = await unsubscribeFromPush();
        if (ok) setSubscribed(false);
      } else {
        const sub = await subscribeToPush();
        if (sub) {
          setSubscribed(true);
          setPermission('granted');
        } else {
          setPermission(getNotificationPermission());
        }
      }
    } finally {
      setWorking(false);
    }
  };

  if (!supported) return null;

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-sm text-emerald-400/60 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking notifications…</span>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className={`flex items-center gap-2 rounded-lg border border-red-800/40 bg-red-900/20 px-3 py-2 text-xs text-red-400 ${className}`}>
        <BellOff className="h-4 w-4 shrink-0" />
        <span>Notifications blocked in browser settings. Enable them to receive alerts.</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={working}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors ${
        subscribed
          ? 'border-emerald-700 bg-emerald-900/30 hover:bg-emerald-900/50'
          : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50'
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        {subscribed ? (
          <Bell className="h-5 w-5 text-emerald-400" />
        ) : (
          <BellOff className="h-5 w-5 text-slate-400" />
        )}
        <div className="text-left">
          <p className="text-sm font-semibold text-white">
            {subscribed ? 'Notifications ON' : 'Notifications OFF'}
          </p>
          <p className="text-xs text-slate-400">
            {subscribed
              ? 'You will receive BOLO alerts and password approvals'
              : 'Tap to enable push alerts for this device'}
          </p>
        </div>
      </div>

      {/* Toggle pill */}
      <div
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          subscribed ? 'bg-emerald-500' : 'bg-slate-600'
        }`}
      >
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            subscribed ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        >
          {working && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500 m-[1px]" />
          )}
        </div>
      </div>
    </button>
  );
}
