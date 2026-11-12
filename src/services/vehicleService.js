import { apiClient } from './apiClient';

export const searchVehicle = (plate) => apiClient.get('/vehicles/search', { params: { plate } });
export const getVehicle = (id) => apiClient.get(/vehicles/);
