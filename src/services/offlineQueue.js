// src/services/offlineQueue.js
// IndexedDB-backed queue for incidents that failed to sync while offline.
// Falls back to localStorage if IndexedDB isn't available.

const DB_NAME = 'toms_offline';
const DB_VERSION = 1;
const STORE_NAME = 'incident_queue';

// ── IndexedDB helpers ──────────────────────────────────────────────────────

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'queueId' });
        store.createIndex('createdAt', 'createdAt');
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function idbAll() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return lsGetAll();
  }
}

async function idbAdd(item) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).add(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    lsAdd(item);
  }
}

async function idbDelete(queueId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).delete(queueId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    lsDelete(queueId);
  }
}

// ── localStorage fallback ──────────────────────────────────────────────────

const LS_KEY = 'toms_offline_queue';

function lsGetAll() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch {
    return [];
  }
}

function lsAdd(item) {
  const all = lsGetAll();
  all.push(item);
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

function lsDelete(queueId) {
  const all = lsGetAll().filter((i) => i.queueId !== queueId);
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Add a failed incident to the offline queue.
 * @param {object} payload - The API payload that failed to send
 * @param {object} localIncident - The local representation of the incident
 */
export async function enqueue(payload, localIncident) {
  const item = {
    queueId: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    payload,
    localIncident,
    createdAt: new Date().toISOString(),
    attempts: 0,
  };
  await idbAdd(item);
  console.log('[OfflineQueue] Enqueued incident:', item.queueId);
  return item.queueId;
}

/**
 * Get all queued incidents.
 */
export async function getQueue() {
  return idbAll();
}

/**
 * Get count of pending items.
 */
export async function getPendingCount() {
  const all = await idbAll();
  return all.length;
}

/**
 * Remove a successfully synced item from the queue.
 */
export async function dequeue(queueId) {
  await idbDelete(queueId);
}

/**
 * Attempt to sync all queued incidents.
 * Returns { synced: number, failed: number }
 */
export async function syncQueue(apiClient) {
  const queue = await idbAll();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  console.log(`[OfflineQueue] Syncing ${queue.length} queued incident(s)...`);

  let synced = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      await apiClient.post('/incidents', item.payload);
      await idbDelete(item.queueId);
      synced++;
      console.log('[OfflineQueue] Synced:', item.queueId);
    } catch (err) {
      failed++;
      console.warn('[OfflineQueue] Sync failed for:', item.queueId, err.message);
    }
  }

  return { synced, failed };
}
