import { apiClient } from './apiClient';

export const requestCorrection = (incidentId, data) => apiClient.post(`/incidents/${incidentId}/corrections`, data);
export const getCorrections = (incidentId) => apiClient.get(`/incidents/${incidentId}/corrections`);
export const reviewCorrection = (correctionId, data) => apiClient.patch(`/corrections/${correctionId}/review`, data);
