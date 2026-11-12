import { apiClient } from './apiClient';

export const requestCorrection = (incidentId, data) => apiClient.post(/incidents//corrections, data);
export const getCorrections = (incidentId) => apiClient.get(/incidents//corrections);
export const reviewCorrection = (correctionId, data) => apiClient.patch(/corrections//review, data);
