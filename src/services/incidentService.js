import { apiClient } from './apiClient';

export const getIncidents = (params) => apiClient.get('/incidents', { params });
export const getIncident = (id) => apiClient.get(/incidents/);
export const createIncident = (data) => apiClient.post('/incidents', data);
export const updateIncident = (id, data) => apiClient.put(/incidents/, data);
export const deleteIncident = (id) => apiClient.delete(/incidents/);
