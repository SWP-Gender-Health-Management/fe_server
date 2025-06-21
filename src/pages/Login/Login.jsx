import React from 'react';
import axios from 'axios';
import { Modal, Tabs, Form, Input, Button, Checkbox } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  FontColorsOutlined,
} from '@ant-design/icons';
import doctor from '@/assets/doctor.jpg';
import { useAuth } from '../../context/AuthContext.jsx'; // Sử dụng .jsx
import './login.css';

const { TabPane } = Tabs;

const Login = ({ visible, onCancel }) => {
  const { login, setUserInfo } = useAuth();

  /* -------------------------------------------------- */
  /* XỬ LÝ ĐĂNG NHẬP                                    */
  /* -------------------------------------------------- */
  const handleLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:3000/account/login', {
        email: values.email,
        password: values.password,
      });
      console.log('Phản hồi từ API login:', response.data);

      const { accessToken } = response.data.result || {};

      if (!accessToken) {
        throw new Error('Thiếu accessToken trong phản hồi');
      }

      // Lưu accessToken và giá trị mặc định ban đầu
      login(accessToken, null, null, 'Người dùng');

      // Gọi API /view-account để lấy thông tin người dùng
      const viewResponse = await axios.post(
        'http://localhost:3000/account/view-account',
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Phản hồi từ API view-account:', viewResponse.data);

      const { account_id, fullname } = viewResponse.data.result || {};
      setUserInfo({ accountId: account_id || null, fullname: fullname || 'Người dùng' });

      Modal.success({ title: 'Thành công!', content: 'Đăng nhập thành công.' });

      onCancel(); // Tắt modal
    } catch (error) {
      console.error('Lỗi đăng nhập hoặc lấy thông tin:', error.response?.data || error.message);
      Modal.error({
        title: 'Đăng nhập thất bại',
        content: error.response?.data?.message || 'Có lỗi xảy ra',
      });
    }
  };

  /* -------------------------------------------------- */
  /* XỬ LÝ ĐĂNG KÝ                                      */
  /* -------------------------------------------------- */
  const handleRegister = async (values) => {
    try {
      await axios.post('http://localhost:3000/account/register', {
        email: values.email,
        fullname: values.fullname,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      Modal.success({
        title: 'Thành công!',
        content: 'Đăng ký thành công. Bạn có thể đăng nhập ngay.',
      });
    } catch (err) {
      console.error('Lỗi đăng ký:', err.response?.data || err.message);
      Modal.error({
        title: 'Đăng ký thất bại',
        content: err.response?.data?.message || 'Có lỗi xảy ra',
      });
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      className="custom-modal"
    >
      <div className="custom-modal-body">
        {/* --------- FORM ---------- */}
        <div className="form-container">
          <Tabs defaultActiveKey="1" centered>
            {/* ==== TAB ĐĂNG NHẬP ==== */}
            <TabPane tab="Đăng nhập" key="1">
              <Form layout="vertical" onFinish={handleLogin}>
                <Form.Item label="Đăng nhập để nhận thêm thông tin!" />

                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Nhập email hoặc SĐT' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Email hoặc SĐT"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Nhập mật khẩu' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu"
                  />
                </Form.Item>

                {/* Ghi nhớ tôi */}
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Ghi nhớ tôi</Checkbox>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Đăng nhập
                  </Button>
                </Form.Item>

                <Form.Item>
                  <div className="or-divider">
                    <span>Hoặc</span>
                  </div>
                </Form.Item>

                <Form.Item>
                  <Button
                    block
                    className="google-button"
                    icon={
                      <img
                        src="https://img.icons8.com/color/20/google-logo.png"
                        alt="Google"
                        className="google-icon"
                      />
                    }
                  >
                    Đăng nhập với Google
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            {/* ==== TAB ĐĂNG KÝ ==== */}
            <TabPane tab="Đăng ký" key="2">
              <Form layout="vertical" onFinish={handleRegister}>
                <Form.Item label="Đăng ký miễn phí!" />
                {/* ... các Form.Item như trước ... */}
              </Form>
            </TabPane>
          </Tabs>
        </div>

        {/* --------- ẢNH ---------- */}
        <div className="modal-image">
          <div className="extra-circle"></div>
          <img src={doctor} alt="doctor" />
        </div>
      </div>
    </Modal>
  );
};

export default Login;