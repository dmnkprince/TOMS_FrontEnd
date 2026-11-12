import { apiClient } from './apiClient';

export const generateReport = (params) => apiClient.get('/reports', { params });
export const exportReport = (params) => apiClient.get('/reports/export', { params, responseType: 'blob' });
