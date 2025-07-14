import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Có thể thay bằng biến môi trường nếu cần
  headers: {
    'Content-Type': 'application/json',
  },
});

// Có thể thêm interceptor ở đây nếu muốn
// api.interceptors.request.use(...)
// api.interceptors.response.use(...)

export default api; 