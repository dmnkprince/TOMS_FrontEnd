// src/utils/formatters.js

/**
 * Formats a currency amount into standard localized display, e.g. ₦5,000.00 or $5,000.00
 */
export function formatCurrency(amount, currency = 'NGN') {
  if (amount === null || amount === undefined || isNaN(amount)) return '₦0.00';
  const num = Number(amount);
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(num);
}

/**
 * Formats an ISO date string into readable Date & Time
 */
export function formatDateTime(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Formats an ISO date into Date only (e.g. 19 Mar 2026)
 */
export function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Normalizes plate number display (e.g. ABC 123 XY)
 */
export function formatPlateNumber(plate) {
  if (!plate) return '';
  return plate.trim().toUpperCase();
}
