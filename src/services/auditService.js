import { apiClient } from './apiClient';

export const getAuditLogs = (params) => apiClient.get('/audit-logs', { params });
