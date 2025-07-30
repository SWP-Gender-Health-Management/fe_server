import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import api from '@/api/api';
import { Modal, Button } from 'antd';
import { useAuth } from '@context/AuthContext';

const SessionManager = () => {
  const { onLogout, login, isLoggedIn } = useAuth();
  const timeoutRef = useRef(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Giảm thời gian để dễ dàng kiểm thử (ví dụ: 10 giây)
  // const SESSION_TIMEOUT = 1000 * 10;
  const SESSION_TIMEOUT = 1000 * 60 * 60; // 1 giờ = 3600000ms

  const resetTimer = () => {
    clearTimeout(timeoutRef.current);

    // Chỉ đặt lại timer nếu người dùng đã đăng nhập
    if (!Cookies.get('accessToken')) {
      console.log('Không đặt lại timer do chưa đăng nhập.');
      return;
    }

    // Thay đổi 1: Timer chỉ gọi expireSession để hiển thị Modal
    timeoutRef.current = setTimeout(() => {
      console.log('Hết thời gian chờ, hiển thị modal xác nhận.');
      expireSession();
    }, SESSION_TIMEOUT);

    console.log('⏱ Reset session timer:', SESSION_TIMEOUT);
  };

  const refreshAccessToken = async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      console.log('Không có refreshToken. Đăng xuất.');
      onLogout();
      return;
    }

    console.log('Đang gọi refresh token...');
    try {
      // Về câu hỏi "xóa access token": Việc này không cần thiết vì Cookies.set
      // sẽ tự động ghi đè lên giá trị cũ.
      const res = await api.post('refresh-token/create-access-token', {
        refreshToken,
      });

      const { accessToken, account_id, full_name, role } = res.data.result || {};

      if (!accessToken) throw new Error('Không có accessToken mới');

      // Cập nhật lại thông tin và cookie
      Cookies.set('accessToken', accessToken, { expires: 1 });
      Cookies.set('accountId', account_id);
      Cookies.set('fullname', full_name);
      Cookies.set('role', role);
      login(refreshToken, account_id, full_name, role); // Cập nhật lại context

      console.log('✅ Refresh token thành công');
      resetTimer(); // Đặt lại timer sau khi refresh thành công
    } catch (error) {
      console.error('❌ Refresh token thất bại:', error);
      onLogout(); // Nếu refresh thất bại, đăng xuất người dùng
    }
  };

  const expireSession = () => {
    setIsSessionExpired(true);
    console.log('⚠ Phiên làm việc sắp hết hạn, mở modal xác nhận');
  };
  
  // Thay đổi 2: Tạo hàm xử lý khi người dùng muốn tiếp tục
  const handleStayLoggedIn = () => {
    setIsSessionExpired(false);
    refreshAccessToken();
  };

  const handleLogout = () => {
    setIsSessionExpired(false);
    onLogout();
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    const events = ['click', 'keydown', 'mousemove', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeoutRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      console.log('🧹 Dọn dẹp session timer');
    };
  }, [isLoggedIn]);

  // Không cần render gì nếu chưa đăng nhập
  if (!isLoggedIn) return null;

  return (
    // Thay đổi 3: Cập nhật lại Modal
    <Modal
      open={isSessionExpired}
      title="Phiên làm việc sắp hết hạn"
      closable={false}
      centered
      maskClosable={false}
      footer={[
        <Button key="logout" onClick={handleLogout}>
          Đăng xuất
        </Button>,
        <Button key="stay" type="primary" onClick={handleStayLoggedIn}>
          Tiếp tục
        </Button>,
      ]}
    >
      <p>Phiên làm việc của bạn sắp hết hạn. Bạn có muốn tiếp tục không?</p>
    </Modal>
  );
};

export default SessionManager;