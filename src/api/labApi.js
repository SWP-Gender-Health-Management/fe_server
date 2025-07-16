import api from './api';

// Lấy slot xét nghiệm (laboratory)
export const getLabSlots = (params) =>
  api.get('/working-slot/lab-working-slot', { params: { ...params } });

// Lấy slot xét nghiệm theo ngày (yyyy/mm/dd) - endpoint mới, truyền date vào body (POST)
export const getLabSlotsByDate = (date) =>
  api.post('/working-slot/lab-working-slots', { date });

// Lấy danh sách các phòng xét nghiệm
export const getAllLaboratories = (token) =>
  api.get('/laborarity/get-all-laboratories', {
    headers: { Authorization: `Bearer ${token}` },
  });

// Tạo lịch hẹn xét nghiệm
export const createLabAppointment = (data, token) =>
  api.post('/customer/create-laborarity-appointment', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Tạo giao dịch xét nghiệm
export const createLabTransaction = (data, token) =>
  api.post('/transaction/create-laborarity-transaction', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Tạo payment url
export const createPaymentUrl = (data, token) =>
  api.post('/transaction/create_payment_url', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Nếu cần lấy toàn bộ slot (không chỉ laboratory)
export const getAllSlots = () => api.get('/working-slots/get-all-slot');
