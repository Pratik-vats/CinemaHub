import api from './api';

export const getShows = (movieId, date) =>
  api.get('/shows', { params: { movieId, date } });

export const getShow = (id) => api.get(`/shows/${id}`);
