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
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import doctor from '@/assets/doctor.jpg';
import Logo from '@assets/Blue-full.svg?react';
import { useAuth } from '@context/AuthContext';
import ForgotPassword from '@pages/ForgotPassword/ForgotPassword';
import './login.css';
import { GoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';

const { TabPane } = Tabs;
const { confirm } = Modal;

const Login = ({ visible, onCancel }) => {
  const { login } = useAuth();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  /* -------------------------------------------------- */
  /* HELPER FUNCTIONS                                   */
  /* -------------------------------------------------- */
  
  // Hàm helper để xử lý lỗi validation chi tiết
  const formatErrorMessage = (errorData) => {
    if (!errorData) return 'Đã có lỗi xảy ra! Vui lòng thử lại.';
    
    // Nếu có errors object (validation errors)
    if (errorData.errors && typeof errorData.errors === 'object') {
      const errorMessages = [];
      
      // Lặp qua tất cả các field có lỗi
      for (const [field, fieldError] of Object.entries(errorData.errors)) {
        let fieldName = field;
        
        // Chuyển đổi tên field sang tiếng Việt
        const fieldTranslations = {
          'email': 'Email',
          'password': 'Mật khẩu',
          'fullname': 'Họ tên',
          'confirmPassword': 'Xác nhận mật khẩu'
        };
        
        if (fieldTranslations[field]) {
          fieldName = fieldTranslations[field];
        }
        
        if (fieldError.message) {
          errorMessages.push(`${fieldName}: ${fieldError.message}`);
        } else if (typeof fieldError === 'string') {
          errorMessages.push(`${fieldName}: ${fieldError}`);
        } else if (Array.isArray(fieldError)) {
          errorMessages.push(`${fieldName}: ${fieldError.join(', ')}`);
        }
      }
      
      if (errorMessages.length > 0) {
        return errorMessages.join('\n');
      }
    }
    
    // Fallback về message chính
    return errorData.message || 'Đã có lỗi xảy ra! Vui lòng thử lại.';
  };

  // Hàm hiển thị lỗi bằng Modal
  const showErrorModal = (title, content) => {
    Modal.error({
      title: title,
      content: content,
      okText: 'Đóng',
      centered: true,
      maskClosable: true,
      width: 450,
      okButtonProps: {
        size: 'large',
      },
    });
  };

  // Hàm hiển thị thành công bằng Modal
  const showSuccessModal = (title, content, onOk) => {
    Modal.success({
      title: title,
      content: content,
      okText: 'Đóng',
      centered: true,
      maskClosable: true,
      width: 450,
      okButtonProps: {
        size: 'large',
      },
      onOk: onOk,
    });
  };

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
      
      console.log('Login Response:', response.data);

      const { accessToken } = response.data.result || {};
      if (!accessToken) {
        throw new Error('Thiếu accessToken trong phản hồi từ server');
      }

      // Lưu accessToken vào Cookies
      Cookies.set('accessToken', accessToken, { expires: 1 });

      // Gọi API view-account để lấy thông tin người dùng
      const viewResponse = await axios.post(
        'http://localhost:3000/account/view-account',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('View Account Response:', viewResponse.data);

      if (!viewResponse.data.result) {
        throw new Error('Không lấy được thông tin người dùng từ server');
      }

      const { account_id, full_name, role } = viewResponse.data.result || {};
      if (!account_id) {
        throw new Error('Không lấy được ID tài khoản');
      }

      // Cập nhật thông tin vào AuthContext và Cookies
      login(accessToken, null, account_id, full_name || 'Người dùng', role);
      Cookies.set('accountId', account_id, { expires: 1 });
      Cookies.set('fullname', full_name || 'Người dùng', { expires: 1 });
      Cookies.set('role', role || '', { expires: 1 });

      // Tắt modal ngay lập tức
      onCancel();

      // Hiển thị thông báo thành công
      message.success({
        content: `Đăng nhập thành công! Chào mừng ${full_name || 'bạn'} đã quay trở lại!`,
        duration: 4,
      });

      // Hiển thị modal thành công (tùy chọn)
      setTimeout(() => {
        showSuccessModal(
          'Đăng nhập thành công! 🎉',
          `Chào mừng ${full_name || 'bạn'} đã quay trở lại hệ thống!`
        );
      }, 500);

    } catch (error) {
      console.error('Lỗi đăng nhập:', error.response?.data || error.message);
      
      // Xử lý lỗi chi tiết
      const errorMessage = formatErrorMessage(error.response?.data);
      
      // Hiển thị message lỗi ngắn NGAY LẬP TỨC
      message.error({
        content: errorMessage,
        duration: 6,
        style: {
          marginTop: '20px',
          fontSize: '14px',
        },
      });

      // Hiển thị modal lỗi chi tiết
      setTimeout(() => {
        showErrorModal(
          'Đăng nhập thất bại ❌',
          errorMessage
        );
      }, 300);
    } finally {
      setLoginLoading(false);
    }
  };

  /* -------------------------------------------------- */
  /* XỬ LÝ ĐĂNG NHẬP VỚI GOOGLE                        */
  /* -------------------------------------------------- */
  const handleGoogleLogin = async (credentialResponse) => {
    setLoginLoading(true);
    try {
      const idToken = credentialResponse.credential;
      const res = await axios.post('http://localhost:3000/account/google-verify', {
        idToken,
      });
      
      console.log('Google Login Response:', res.data);

      const { accessToken } = res.data.result || {};
      if (!accessToken) {
        throw new Error('Thiếu accessToken trong phản hồi từ server');
      }

      // Lưu accessToken vào Cookies
      Cookies.set('accessToken', accessToken, { expires: 1 });

      // Gọi API view-account để lấy thông tin người dùng
      const viewResponse = await axios.post(
        'http://localhost:3000/account/view-account',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('View Account Response:', viewResponse.data);

      if (!viewResponse.data.result) {
        throw new Error('Không lấy được thông tin người dùng từ server');
      }

      const { account_id, full_name, role } = viewResponse.data.result || {};
      if (!account_id) {
        throw new Error('Không lấy được ID tài khoản');
      }

      // Cập nhật thông tin vào AuthContext và Cookies
      login(accessToken, null, account_id, full_name || 'Người dùng', role);
      Cookies.set('accountId', account_id, { expires: 1 });
      Cookies.set('fullname', full_name || 'Người dùng', { expires: 1 });
      Cookies.set('role', role || '', { expires: 1 });

      // Tắt modal ngay lập tức
      onCancel();

      // Hiển thị thông báo thành công
      message.success({
        content: `Đăng nhập Google thành công! Chào mừng ${full_name || 'bạn'}!`,
        duration: 4,
      });

      // Hiển thị modal thành công (tùy chọn)
      setTimeout(() => {
        showSuccessModal(
          'Đăng nhập Google thành công! 🎉',
          `Chào mừng ${full_name || 'bạn'} đã đăng nhập bằng Google!`
        );
      }, 500);

    } catch (error) {
      console.error('Lỗi đăng nhập Google:', error.response?.data || error.message);
      
      // Xử lý lỗi chi tiết
      const errorMessage = formatErrorMessage(error.response?.data);
      
      // Hiển thị message lỗi ngắn NGAY LẬP TỨC
      message.error({
        content: errorMessage,
        duration: 6,
        style: {
          marginTop: '20px',
          fontSize: '14px',
        },
      });

      // Hiển thị modal lỗi chi tiết
      setTimeout(() => {
        showErrorModal(
          'Đăng nhập Google thất bại ❌',
          errorMessage
        );
      }, 300);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLoginError = () => {
    console.log('Google Login Error');
    
    // Hiển thị message lỗi ngắn NGAY LẬP TỨC
    message.error({
      content: 'Đăng nhập Google thất bại! Vui lòng thử lại.',
      duration: 5,
      style: {
        marginTop: '20px',
        fontSize: '14px',
      },
    });

    // Hiển thị modal lỗi chi tiết
    setTimeout(() => {
      showErrorModal(
        'Đăng nhập Google thất bại ❌',
        'Có lỗi xảy ra trong quá trình đăng nhập Google. Vui lòng thử lại!'
      );
    }, 300);
  };

  /* -------------------------------------------------- */
  /* XỬ LÝ ĐĂNG KÝ                                      */
  /* -------------------------------------------------- */
  const handleRegister = async (values) => {
    setRegisterLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/account/register', {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
      });

      console.log('Register Response:', response.data);

      // Hiển thị thông báo thành công NGAY LẬP TỨC
      message.success({
        content: 'Đăng ký thành công! Bạn có thể đăng nhập ngay.',
        duration: 4,
      });

      // Reset form và chuyển về tab đăng nhập
      registerForm.resetFields();
      setActiveTab('1');

      // Hiển thị modal thành công (tùy chọn)
      setTimeout(() => {
        showSuccessModal(
          'Đăng ký thành công! 🎉',
          'Tài khoản của bạn đã được tạo thành công. Bạn có thể đăng nhập ngay bây giờ!'
        );
      }, 500);

    } catch (err) {
      console.error('Lỗi đăng ký:', err.response?.data || err.message);
      
      // Xử lý lỗi chi tiết
      const errorMessage = formatErrorMessage(err.response?.data);
      
      // Hiển thị message lỗi ngắn NGAY LẬP TỨC
      message.error({
        content: errorMessage,
        duration: 6,
        style: {
          marginTop: '20px',
          fontSize: '14px',
        },
      });

      // Hiển thị modal lỗi chi tiết
      setTimeout(() => {
        showErrorModal(
          'Đăng ký thất bại ❌',
          errorMessage
        );
      }, 300);
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
                <Logo className="tab-brand-logo" />
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