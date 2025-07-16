import api from './api';

export const getAllQuestions = (token) => api.get('/question/get-all-question', {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
export const createQuestion = (payload, token) => api.post('/question/create-question', payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
export const getUnrepliedQuestions = (token) => api.get('/question/get-unreplied-questions', {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
export const getQuestionsByConsultant = (accountId, token) => api.get(`/question/get-question-by-id/consultant/${accountId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
}); 