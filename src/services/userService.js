import { apiClient } from './apiClient';

/**
 * Fetch paginated list of users (profiles).
 * Supports both /users and fallback to /profiles for deployed Render backends.
 */
export const getUsers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `/users?${query}` : '/users';
  try {
    const resp = await apiClient.get(endpoint);
    return resp.data;
  } catch (err) {
    if (err.response?.status === 404) {
      // Fallback to /profiles which is live on deployed Render backend
      const fallback = query ? `/profiles?${query}` : '/profiles';
      const resp = await apiClient.get(fallback);
      return resp.data;
    }
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
  try {
    return await apiClient.delete(`/users/${userId}`);
  } catch (err) {
    if (err.response?.status === 404) {
      return await apiClient.delete(`/auth/users/${userId}`);
    }
    throw err;
  }
};

export const updateUser = async (userId, updateData) => {
  try {
    return await apiClient.put(`/users/${userId}`, updateData);
  } catch (err) {
    if (err.response?.status === 404) {
      if (updateData.role) {
        try {
          await apiClient.patch(`/profiles/${userId}/role`, { role: updateData.role });
        } catch (roleErr) {
          console.warn('Role update fallback warning:', roleErr.message);
        }
      }
      return await apiClient.patch(`/profiles/${userId}`, updateData);
    }
    throw err;
  }
};
