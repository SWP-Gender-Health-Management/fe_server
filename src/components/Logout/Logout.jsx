import React from 'react';
import { Modal, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = ({ open, onCancel, onLogout }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    try {
      // Gọi API logout để xóa refreshToken trên server (giả định endpoint)
      if (accessToken) {
        await axios.post(
          'http://localhost:3000/account/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      // Xóa toàn bộ sessionStorage, bao gồm refreshToken và accessToken
      sessionStorage.clear();
      onLogout(); // Thông báo cho parent component
      navigate('/');
      message.success('Đăng xuất thành công!');
    } catch (error) {
      console.error('Logout failed:', error);
      message.error('Đăng xuất thất bại. Vui lòng thử lại.');
      // Dù lỗi, vẫn xóa local data để đảm bảo an toàn
      sessionStorage.clear();
      onLogout();
    } finally {
      onCancel(); // Đóng modal sau khi hoàn thành (thành công hoặc thất bại)
    }
  };

  return (
    <Modal
      title="Xác nhận đăng xuất"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="no" onClick={onCancel}>
          No
        </Button>,
        <Button
          key="yes"
          type="primary"
          onClick={handleLogout}
          style={{
            background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
            border: 'none',
          }}
        >
          Yes
        </Button>,
      ]}
      centered
    >
      <p>Bạn có muốn đăng xuất không?</p>
    </Modal>
  );
};

export default Logout;
