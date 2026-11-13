// src/services/passwordService.js
import { apiClient } from './apiClient';

const STORAGE_KEY = 'toms_password_requests';

// Default initial sample request to demonstrate the admin workflow
const initialRequests = [
  {
    id: 'req-001',
    officer_name: 'Officer David Okafor',
    badge_number: 'AGT-101',
    email: 'officer.david@toms.gov',
    requested_password: 'Password2026!',
    reason: 'Periodic mandatory credentials change',
    status: 'pending',
    requested_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    approved_by: null,
    approved_at: null,
  },
  {
    id: 'req-002',
    officer_name: 'Officer Aisha Bello',
    badge_number: 'AGT-102',
    email: 'officer.aisha@toms.gov',
    requested_password: 'SecurePass2026!',
    reason: 'Password reset request after device re-assignment',
    status: 'pending',
    requested_at: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
    approved_by: null,
    approved_at: null,
  },
];

function getStoredRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRequests));
      return initialRequests;
    }
    return JSON.parse(raw);
  } catch (e) {
    return initialRequests;
  }
}

function saveStoredRequests(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save password requests to localStorage', e);
  }
}

export async function requestPasswordChange({ email, officerName, badgeNumber, newPassword, reason }) {
  const requests = getStoredRequests();

  const newRequest = {
    id: 'req-' + Date.now(),
    officer_name: officerName || email.split('@')[0],
    badge_number: badgeNumber || 'N/A',
    email: email.toLowerCase().trim(),
    requested_password: newPassword,
    reason: reason || 'Credentials update request',
    status: 'pending',
    requested_at: new Date().toISOString(),
    approved_by: null,
    approved_at: null,
  };

  requests.unshift(newRequest);
  saveStoredRequests(requests);

  // Attempt backend API call if endpoint is available
  try {
    await apiClient.post('/auth/password-change-request', newRequest);
  } catch (err) {
    // Graceful fallback to client persistence
  }

  return {
    success: true,
    message: 'Password change request submitted for Administrator approval.',
    request: newRequest,
  };
}

export async function getPasswordRequests() {
  // Attempt backend API call first
  try {
    const res = await apiClient.get('/auth/password-requests');
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (err) {
    // Fallback to local store
  }
  return getStoredRequests();
}

export async function approvePasswordRequest(requestId, adminUser) {
  // CRITICAL SECURITY RULE: Only an administrator can approve password changes
  if (!adminUser || adminUser.role !== 'admin') {
    throw new Error('Access Denied: Only an Administrator can approve change of password.');
  }

  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) {
    throw new Error('Password change request not found.');
  }

  requests[index].status = 'approved';
  requests[index].approved_by = adminUser.full_name || 'System Administrator';
  requests[index].approved_at = new Date().toISOString();

  saveStoredRequests(requests);

  // Attempt backend update
  try {
    await apiClient.post(`/auth/password-requests/${requestId}/approve`, {
      approved_by: adminUser.id,
    });
  } catch (err) {
    // Fallback
  }

  return {
    success: true,
    message: `Password change request for ${requests[index].email} approved by Administrator.`,
    request: requests[index],
  };
}

export async function rejectPasswordRequest(requestId, adminUser, reason = '') {
  // CRITICAL SECURITY RULE: Only an administrator can reject password changes
  if (!adminUser || adminUser.role !== 'admin') {
    throw new Error('Access Denied: Only an Administrator can reject password changes.');
  }

  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) {
    throw new Error('Password change request not found.');
  }

  requests[index].status = 'rejected';
  requests[index].rejection_reason = reason || 'Declined by Administrator';
  requests[index].reviewed_by = adminUser.full_name || 'System Administrator';
  requests[index].reviewed_at = new Date().toISOString();

  saveStoredRequests(requests);

  // Attempt backend update
  try {
    await apiClient.post(`/auth/password-requests/${requestId}/reject`, {
      reviewed_by: adminUser.id,
      reason,
    });
  } catch (err) {
    // Fallback
  }

  return {
    success: true,
    message: `Password change request for ${requests[index].email} has been rejected.`,
    request: requests[index],
  };
}
