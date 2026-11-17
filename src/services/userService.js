import { apiClient } from './apiClient';

/**
 * Fetch paginated list of users (profiles).
 * The backend endpoint expects query params for pagination/filters.
 */
export const getUsers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `/users?${query}` : '/users';
  try {
    const resp = await apiClient.get(endpoint);
    console.log('🟢 getUsers response →', resp.data);
    return resp.data; // return only the data payload
  } catch (err) {
    console.error('🔴 getUsers error →', err.response?.data || err.message);
    throw err;
  }
};

/**
 * Register a new staff user.
 * Calls the POST /auth/register-staff endpoint.
 */
export const createUser = async (userData) => {
  return apiClient.post('/auth/register-staff', userData);
};

/**
 * Delete a user by id.
 * Calls the DELETE /users/:id endpoint.
 */
export const deleteUser = async (userId) => {
  return apiClient.delete(`/users/${userId}`);
};

export const updateUser = async (userId, updateData) => {
  return apiClient.put(`/users/${userId}`, updateData);
};
