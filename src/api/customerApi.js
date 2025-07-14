import api from './api';

export const getPeriod = (accountId, token) => api.get('/customer/get-period', {
  params: { account_id: accountId },
  headers: { Authorization: `Bearer ${token}` },
});
export const trackPeriod = (data, token) => api.post('/customer/track-period', data, {
  headers: { Authorization: `Bearer ${token}` },
});
export const predictPeriod = (accountId, token) => api.get('/customer/predict-period', {
  params: { account_id: accountId },
  headers: { Authorization: `Bearer ${token}` },
});
export const getLabAppointments = (token) => api.get('/customer/get-laborarity-appointments', {
  headers: { Authorization: `Bearer ${token}` },
}); 