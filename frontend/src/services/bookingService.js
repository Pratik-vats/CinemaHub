import api from './api';

export const createBooking = (data) => api.post('/bookings', data);
export const getUserBookings = (userId) => api.get(`/bookings/user/${userId}`);
export const cancelBooking = (bookingId) => api.post(`/bookings/${bookingId}/cancel`);
