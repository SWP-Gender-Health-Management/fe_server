import api from './api';

// Tạo giao dịch xét nghiệm
export const createConAppTransaction = (data, token) =>
  api.post('/transaction/create-consult-transaction', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Tạo payment url
export const createPaymentUrl = (data, token) =>
  api.post('/transaction/create_payment_url', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Nếu cần lấy toàn bộ slot (không chỉ laboratory)
export const getAllSlots = () => api.get('/working-slots/get-all-slot');