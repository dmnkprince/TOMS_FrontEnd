// src/services/pushService.js
import { apiClient } from './apiClient';

/**
 * Fetch the VAPID public key from the backend.
 */
async function getVapidPublicKey() {
  const res = await apiClient.get('/push/vapid-public-key');
  return res.data?.data?.publicKey || res.data?.publicKey;
}

/**
 * Convert a base64 URL string to a Uint8Array (required by PushManager).
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

/**
 * Request notification permission and subscribe to push.
 * Returns the PushSubscription or null if denied/failed.
 */
export async function subscribeToPush() {
  try {
    // 1. Ask for notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[Push] Permission denied');
      return null;
    }

    // 2. Get active service worker registration
    const registration = await navigator.serviceWorker.ready;

    // 3. Fetch VAPID key from backend
    const vapidPublicKey = await getVapidPublicKey();
    if (!vapidPublicKey) throw new Error('No VAPID public key received');

    // 4. Subscribe via PushManager
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // 5. Send subscription to backend
    await apiClient.post('/push/subscribe', subscription.toJSON());
    console.log('[Push] Subscribed successfully');
    return subscription;
  } catch (err) {
    console.error('[Push] Subscribe error:', err);
    return null;
  }
}

/**
 * Unsubscribe from push notifications.
 */
export async function unsubscribeFromPush() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return true;

    // Notify backend
    await apiClient.delete('/push/unsubscribe', {
      data: { endpoint: subscription.endpoint },
    });

    // Unsubscribe from browser
    await subscription.unsubscribe();
    console.log('[Push] Unsubscribed');
    return true;
  } catch (err) {
    console.error('[Push] Unsubscribe error:', err);
    return false;
  }
}

/**
 * Check if the user is currently subscribed to push.
 */
export async function isPushSubscribed() {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch {
    return false;
  }
}

/**
 * Get current notification permission state.
 */
export function getNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission; // 'default' | 'granted' | 'denied'
}
