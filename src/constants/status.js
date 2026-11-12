// src/constants/status.js
export const INCIDENT_STATUS = Object.freeze({
  RECORDED: 'recorded',
  PENDING_CORRECTION: 'pending_correction',
  AMENDED: 'amended',
  DISMISSED: 'dismissed',
});

export const CORRECTION_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

export const USER_STATUS = Object.freeze({
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  INACTIVE: 'inactive',
});

export const STATUS_BADGE_VARIANTS = Object.freeze({
  // Incidents
  [INCIDENT_STATUS.RECORDED]: 'success',
  [INCIDENT_STATUS.PENDING_CORRECTION]: 'warning',
  [INCIDENT_STATUS.AMENDED]: 'info',
  [INCIDENT_STATUS.DISMISSED]: 'danger',

  // Corrections
  [CORRECTION_STATUS.PENDING]: 'warning',
  [CORRECTION_STATUS.APPROVED]: 'success',
  [CORRECTION_STATUS.REJECTED]: 'danger',

  // Users
  [USER_STATUS.ACTIVE]: 'success',
  [USER_STATUS.SUSPENDED]: 'warning',
  [USER_STATUS.INACTIVE]: 'neutral',
});
