import { apiClient } from './apiClient';

export const getProfile = () => apiClient.get('/users/me');
export const getUsers = () => apiClient.get('/users');
export const updateProfile = (data) => apiClient.put('/users/me', data);
