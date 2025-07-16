import api from './api';

export const getOverallKpis = (token, day) => api.get('/manager/get-overall-kpis', {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  params: { day },
}); 