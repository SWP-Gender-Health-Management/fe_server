import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Tabs, Form, Input, Button, Checkbox, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  FontColorsOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
} from '@ant-design/icons';
import doctor from '@/assets/doctor.jpg';
import { useAuth } from '../../context/AuthContext.jsx';
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword.jsx';
import './login.css';
import { GoogleLogin } from '@react-oauth/google';

const { TabPane } = Tabs;

const Login = ({ visible, onCancel }) => {
  const { login, setUserInfo } = useAuth();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  /* -------------------------------------------------- */
  /* XỬ LÝ ĐĂNG NHẬP                                    */
  /* -------------------------------------------------- */
  const handleLogin = async (values) => {
    setLoginLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/account/login', {
        email: values.email,
        password: values.password,
      });
      console.log('Response:', response.data);

      if (response.data && response.data.token) {
        localStorage.setItem('app_token', response.data.token);
        login(response.data.token);
        setUserInfo(response.data.user);
      }

      message.success('Đăng nhập thành công!');
      onCancel();
    } catch (error) {
      console.error('Lỗi đăng nhập:', error.response?.data || error.message);
      message.error(error.response?.data?.message || 'Đăng nhập thất bại!');
    } finally {
      setLoginLoading(false);
    }
  };

  /* -------------------------------------------------- */
  /* XỬ LÝ ĐĂNG NHẬP VỚI GOOGLE                            */
  /* -------------------------------------------------- */
  const handleGoogleLogin = async (credentialResponse) => {
    console.log('Đăng nhập Google thành công:', credentialResponse);
    const idToken = credentialResponse.credential;

    try {
      const res = await axios.post(
        'http://localhost:3000/account/google-verify',
        {
          idToken: idToken,
        }
      );

      console.log('Backend response:', res.data);
      localStorage.setItem('app_token', res.data.token);
      message.success('Đăng nhập Google thành công!');
      onCancel();
    } catch (error) {
      console.error('Lỗi xác thực với backend:', error);
      message.error('Đăng nhập Google thất bại!');
    }
  };

  const handleLoginError = () => {
    console.log('Đăng nhập thất bại');
    message.error('Đăng nhập Google thất bại!');
  };

  /* -------------------------------------------------- */
  /* XỬ LÝ ĐĂNG KÝ                                       */
  /* -------------------------------------------------- */
  const handleRegister = async (values) => {
    setRegisterLoading(true);
    try {
      await axios.post('http://localhost:3000/account/register', {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
      });

      message.success('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
      registerForm.resetFields();
      setActiveTab('1');
    } catch (err) {
      console.error('Lỗi đăng ký:', err.response?.data || err.message);
      message.error(err.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={visible && !showForgotPassword}
        onCancel={onCancel}
        footer={null}
        width={950}
        centered
        className="modern-auth-modal"
        maskClosable={false}
        destroyOnClose
      >
        <div className="auth-modal-container">
          {/* Form Section */}
          <div className="auth-form-section">
            <div className="auth-header">
              <div className="brand-logo">
                <div className="logo-icon">
                  <MailOutlined />
                </div>
                <h1 className="brand-title">MediCare</h1>
              </div>
              <p className="auth-subtitle">
                {activeTab === '1'
                  ? 'Chào mừng bạn trở lại! Đăng nhập để tiếp tục.'
                  : 'Tạo tài khoản mới để bắt đầu hành trình sức khỏe.'}
              </p>
            </div>

            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              centered
              className="auth-tabs"
              size="large"
            >
              {/* Login Tab */}
              <TabPane tab="Đăng nhập" key="1">
                <Form
                  form={loginForm}
                  layout="vertical"
                  onFinish={handleLogin}
                  className="auth-form"
                  size="large"
                >
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="input-prefix-icon" />}
                      placeholder="Địa chỉ email"
                      className="modern-input"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="input-prefix-icon" />}
                      placeholder="Mật khẩu"
                      className="modern-input"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  <div className="form-extras">
                    <Form.Item
                      name="remember"
                      valuePropName="checked"
                      className="remember-me"
                    >
                      <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    </Form.Item>
                    <Button
                      type="link"
                      className="forgot-link"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Quên mật khẩu?
                    </Button>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loginLoading}
                      className="submit-btn primary-btn"
                      size="large"
                    >
                      Đăng nhập
                    </Button>
                  </Form.Item>

                  <div className="divider-section">
                    <div className="divider-line"></div>
                    <span className="divider-text">Hoặc</span>
                    <div className="divider-line"></div>
                  </div>

                  <div className="google-login-container">
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={handleLoginError}
                      theme="outline"
                      size="large"
                      text="signin_with"
                      shape="rectangular"
                      width="100%"
                    />
                  </div>
                </Form>
              </TabPane>

              {/* Register Tab */}
              <TabPane tab="Đăng ký" key="2">
                <Form
                  form={registerForm}
                  layout="vertical"
                  onFinish={handleRegister}
                  className="auth-form"
                  size="large"
                >
                  <Form.Item
                    name="fullname"
                    rules={[
                      { required: true, message: 'Vui lòng nhập họ tên!' },
                      { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
                    ]}
                  >
                    <Input
                      prefix={
                        <FontColorsOutlined className="input-prefix-icon" />
                      }
                      placeholder="Họ và tên"
                      className="modern-input"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="input-prefix-icon" />}
                      placeholder="Địa chỉ email"
                      className="modern-input"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu!' },
                      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="input-prefix-icon" />}
                      placeholder="Mật khẩu"
                      className="modern-input"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng xác nhận mật khẩu!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error('Mật khẩu xác nhận không khớp!')
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="input-prefix-icon" />}
                      placeholder="Xác nhận mật khẩu"
                      className="modern-input"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, value) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error('Vui lòng đồng ý với điều khoản!')
                              ),
                      },
                    ]}
                  >
                    <Checkbox className="agreement-checkbox">
                      Tôi đồng ý với{' '}
                      <Button type="link" className="terms-link">
                        Điều khoản sử dụng
                      </Button>{' '}
                      và{' '}
                      <Button type="link" className="terms-link">
                        Chính sách bảo mật
                      </Button>
                    </Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={registerLoading}
                      className="submit-btn primary-btn"
                      size="large"
                    >
                      Tạo tài khoản
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </div>

          {/* Image Section */}
          <div className="auth-image-section">
            <div className="image-overlay">
              <div className="floating-element element-1"></div>
              <div className="floating-element element-2"></div>
              <div className="floating-element element-3"></div>
            </div>
            <img
              src={doctor}
              alt="Healthcare Professional"
              className="auth-image"
            />
            <div className="image-content">
              <h3 className="image-title">Chăm sóc sức khỏe toàn diện</h3>
              <p className="image-description">
                Dịch vụ y tế chuyên nghiệp, tin cậy cho sức khỏe của bạn.
              </p>
              <div className="stats-container">
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Hỗ trợ</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Bác sĩ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Forgot Password Modal */}
      <ForgotPassword
        visible={showForgotPassword}
        onCancel={() => {
          setShowForgotPassword(false);
        }}
        onBackToLogin={() => {
          setShowForgotPassword(false);
        }}
      />
    </>
  );
};

export default Login;
