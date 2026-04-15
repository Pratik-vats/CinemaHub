import api from './api';

export const registerUser = (data) => api.post('/users/register', data);
export const loginUser = (data) => api.post('/users/login', data);
export const getUserProfile = (id) => api.get(`/users/${id}/profile`);
export const getUserRewards = (id) => api.get(`/rewards/${id}`);
