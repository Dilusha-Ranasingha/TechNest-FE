import api from './index';

export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register/user', userData);
  return response.data;
};

export const registerAdmin = async (adminData) => {
  const response = await api.post('/api/auth/register/admin', adminData);
  return response.data;
};

export const requestPasswordReset = async (email) => {
  const response = await api.post('/api/auth/password/reset', { email });
  return response.data;
};

export const confirmPasswordReset = async (resetData) => {
  const response = await api.post('/api/auth/password/reset/confirm', resetData);
  return response.data;
};