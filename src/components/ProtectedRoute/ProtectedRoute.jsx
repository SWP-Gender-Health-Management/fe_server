import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = Cookies.get('role');

  // Kiểm tra nếu người dùng không đăng nhập hoặc vai trò không được phép
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // Chuyển hướng đến trang không được phép
  }

  return children; // Render nội dung route nếu hợp lệ
};

export default ProtectedRoute