import React, { useState } from 'react';
import { Modal } from 'antd';
import Login from '../Login/Login';

const LoginRequiredModal = ({ visible, onCancel, message }) => {
  const [showLogin, setShowLogin] = useState(false);

  const handleOk = () => {
    setShowLogin(true);
  };

  return (
    <>
      <Modal
        title="Yêu cầu đăng nhập"
        open={visible && !showLogin}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Đồng ý"
        cancelText="Hủy"
        centered
      >
        <p>{message || 'Bạn cần đăng nhập để sử dụng tính năng này!'}</p>
      </Modal>
      <Login visible={showLogin} onCancel={() => setShowLogin(false)} />
    </>
  );
};

export default LoginRequiredModal; 