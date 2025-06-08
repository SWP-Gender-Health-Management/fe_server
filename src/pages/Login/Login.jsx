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

const Login = ({ visible, onCancel }) => {
  const navigate = useNavigate();
  const handleLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:3000/account/login', {
        email: values.email, // hoặc values.email tuỳ theo name trong form
        password: values.password,
      });

      // Lưu token hoặc thông tin user
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Hiển thị tên người dùng nếu cần
      console.log('Đăng nhập thành công');
      navigate('/tai-khoan'); // Chuyển hướng đến trang tài khoản sau khi đăng nhập thành công
    } catch (error) {
      console.error('Lỗi đăng nhập:', error.response?.data || error.message);
    }
  };

  const handleRegister = (values) => {
    console.log('Register', values);
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
                <Form.Item
                  label={
                    <div style={{ color: 'black' }}>
                      Đăng nhập để nhận thêm các thông tin khác!
                    </div>
                  }
                />
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

            <TabPane tab="Đăng kí" key="2">
              <Form layout="vertical" onFinish={handleRegister}>
                <Form.Item
                  label={
                    <div style={{ color: 'black' }}>Đăng kí miễn phí !</div>
                  }
                />
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
                    prefix={<MailOutlined />}
                    placeholder="Email hoặc SĐT"
                  />
                </Form.Item>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Nhập tên tài khoản' }]}
                >
                  <Input
                    prefix={<FontColorsOutlined />}
                    placeholder="Tên tài khoản"
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
                <Form.Item
                  name="confirmPassword"
                  rules={[{ required: true, message: 'Xác nhận mật khẩu' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Xác nhận mật khẩu"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Đăng kí ngay!
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
