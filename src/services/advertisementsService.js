import api from './api';

export const createAdvertisement = async (token, payload) => {
  try {
    const response = await api.post('/advertisements', payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create advertisement');
  }
};

export const fetchAllAdvertisements = async (token) => {
  try {
    const response = await api.get('/advertisements');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch advertisements');
  }
};

export const fetchUserAdvertisements = async (token) => {
  try {
    const response = await api.get('/advertisements/my-ads');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user advertisements');
  }
};

export const updateAdvertisement = async (token, adId, payload) => {
  try {
    const response = await api.put(`/advertisements/${adId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update advertisement');
  }
};

export const deleteAdvertisement = async (token, adId) => {
  try {
    await api.delete(`/advertisements/${adId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete advertisement');
  }
};