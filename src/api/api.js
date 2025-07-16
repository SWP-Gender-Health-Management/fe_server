import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Có thể thay bằng biến môi trường nếu cần
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động gắn Authorization nếu có token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý lỗi jwt expired toàn cục
api.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors.authorization === 'jwt expired'
    ) {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      // Có thể gọi hàm logout toàn cục hoặc chuyển hướng về login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 