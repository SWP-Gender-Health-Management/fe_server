import api from './api';

export const login = (data) => api.post('/account/login', data);
export const register = (data) => api.post('/account/register', data);
export const viewAccount = (token) => api.post('/account/view-account', {}, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
export const updateProfile = (data, token) => api.post('/account/update-profile', data, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
export const updateAvatar = (formData, token) => api.post('/account/update-avatar', formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
});
export const changePassword = (data, token) => api.post('/account/change-password', data, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
export const sendVerification = (token) => api.post('/account/send-verification', {}, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
export const deleteAccount = (accountId, token) => api.post('/account/delete-account', { account_id: accountId }, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
export const googleVerify = (idToken) => api.post('/account/google-verify', { idToken });
export const createAccessToken = (refreshToken) => api.post('/refresh-token/create-access-token', { refreshToken });
export const sendResetPassword = (email) => api.post('/account/send-reset-password', { email });
export const verifyResetPassword = (email, passcode) => api.post('/account/verify-reset-password', { email, passcode });
export const resetPassword = (email, newPassword) => api.post('/account/reset-password', { email, newPassword }); 