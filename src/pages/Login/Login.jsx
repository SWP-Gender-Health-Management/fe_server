import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Tabs, Form, Input, Button, Checkbox } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  FontColorsOutlined,
} from '@ant-design/icons';
import doctor from '@/assets/doctor.jpg';
import './login.css';

const { TabPane } = Tabs;

const Login = ({ visible, onCancel, onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:3000/account/login', {
        email: values.email,
        password: values.password,
      });

      console.log('Phản hồi từ API:', response.data);

      const { accessToken, refreshToken, fullname } = response.data.result;

      if (!accessToken || !refreshToken) {
        throw new Error('Thiếu token trong phản hồi');
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('fullname', fullname || 'Người dùng');

      Modal.success({ title: 'Thành công!', content: 'Đăng nhập thành công.' });

      onCancel(); // Tắt modal
      onLoginSuccess(); // Cập nhật trạng thái login
      navigate('/tai-khoan'); // Điều hướng
    } catch (error) {
      console.error('Lỗi đăng nhập:', error.response?.data || error.message);
      Modal.error({
        title: 'Đăng nhập thất bại',
        content: error.response?.data?.message || 'Có lỗi xảy ra',
      });
    }
  };

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
    } catch (error) {
      console.error('Lỗi đăng ký:', error.response?.data || error.message);

      Modal.error({
        title: 'Đăng ký thất bại',
        content: error.response?.data?.message || 'Có lỗi xảy ra',
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
        {/* Form bên trái */}
        <div className="form-container">
          <Tabs defaultActiveKey="1" centered>
            <TabPane tab="Đăng nhập" key="1">
              <Form layout="vertical" onFinish={handleLogin}>
                <Form.Item label="Đăng nhập để nhận thêm các thông tin khác!" />
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Nhập email hoặc số điện thoại',
                    },
                  ]}
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
                <Form.Item>
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
            <TabPane tab="Đăng ký" key="2">
              <Form layout="vertical" onFinish={handleRegister}>
                <Form.Item label="Đăng ký miễn phí!" />
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="fullname"
                  rules={[{ required: true, message: 'Nhập họ và tên' }]}
                >
                  <Input
                    prefix={<FontColorsOutlined />}
                    placeholder="Họ và tên"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Nhập mật khẩu' },
                    { min: 6, message: 'Tối thiểu 6 ký tự' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu"
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Xác nhận mật khẩu' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Mật khẩu không khớp!')
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Xác nhận mật khẩu"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Đăng ký ngay!
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
          </Tabs>
        </div>

        {/* Ảnh bác sĩ bên phải */}
        <div className="modal-image">
          <div className="extra-circle"></div>
          <img src={doctor} alt="doctor" />
        </div>
      </div>
    </Modal>
  );
};

export default Login;
