import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import api from '@/api/api';
import { Modal, Button } from 'antd';
import { useAuth } from '@context/AuthContext';

const SessionManager = ({ onCancel, onLoginClick }) => {
  const { onLogout, login, isLoggedIn } = useAuth();
  const timeoutRef = useRef(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [hasRejectedSessionLogin, setHasRejectedSessionLogin] = useState(false);

  const SESSION_TIMEOUT = 1000 * 60 * 60; // 1 giờ = 3600000ms

  const resetTimer = () => {
    clearTimeout(timeoutRef.current);

    const accessToken = Cookies.get('accessToken');
    if (hasRejectedSessionLogin || !accessToken) {
      console.log('Không đặt lại timer do chưa đăng nhập hoặc đã từ chối');
      return;
    }

    timeoutRef.current = setTimeout(() => {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        console.log('Đang gọi refresh token...');
        refreshAccessToken(refreshToken);
      } else {
        console.log('Không có refreshToken. Hết phiên.');
        expireSession();
      }
    }, SESSION_TIMEOUT);

    console.log('⏱ Reset session timer:', SESSION_TIMEOUT);
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const res = await api.post('refresh-token/create-access-token', {
        refreshToken,
      });

      const { accessToken, account_id, full_name, role } = res.data.result || {};
      if (!accessToken) throw new Error('Không có accessToken mới');

      Cookies.set('accessToken', accessToken, { expires: 1 });
      Cookies.set('accountId', account_id);
      Cookies.set('fullname', full_name);
      Cookies.set('role', role);
      login(refreshToken, account_id, full_name, role);

      console.log('✅ Refresh token thành công');
      resetTimer(); // Reset sau khi refresh
    } catch (error) {
      console.error('❌ Refresh token thất bại:', error);
      expireSession();
    }
  };

  const expireSession = () => {
    if (!hasRejectedSessionLogin) {
      setIsSessionExpired(true);
      console.log('⚠ Phiên làm việc hết hạn, mở modal đăng nhập');
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return; // Không setup nếu chưa đăng nhập

    const events = ['click', 'keydown', 'mousemove', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Khởi động ban đầu

    return () => {
      clearTimeout(timeoutRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      console.log('🧹 Dọn dẹp session timer');
    };
  }, [hasRejectedSessionLogin, isLoggedIn]);

  if (!isLoggedIn || hasRejectedSessionLogin) return null;

  return (
    <Modal
      open={isSessionExpired}
      closable={false}
      centered
      maskClosable={false}
      footer={[
        <Button
          key="no"
          onClick={() => {
            setIsSessionExpired(false);
            setHasRejectedSessionLogin(true);
            onLogout();
            if (onCancel) onCancel();
          }}
        >
          Không
        </Button>,
        <Button
          key="login"
          type="primary"
          onClick={() => {
            setIsSessionExpired(false);
            setHasRejectedSessionLogin(false);
            if (onLoginClick) onLoginClick();
          }}
        >
          Đăng nhập
        </Button>,
      ]}
    >
      <p>Phiên làm việc của bạn đã hết. Vui lòng đăng nhập lại để tiếp tục.</p>
    </Modal>
  );
};

export default SessionManager;