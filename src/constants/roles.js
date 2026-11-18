// src/constants/roles.js
export const ROLES = Object.freeze({
  AGENT: 'agent',
  SUPERVISOR: 'supervisor',
  ADMIN: 'admin',
  FIELD_AGENT: 'field_agent',
});

export const ROLE_LABELS = Object.freeze({
  [ROLES.AGENT]: 'Traffic Agent',
  [ROLES.SUPERVISOR]: 'Enforcement Supervisor',
  [ROLES.ADMIN]: 'System Administrator',
  [ROLES.FIELD_AGENT]: 'Field Agent',
});

export const ALL_ROLES = Object.values(ROLES);
