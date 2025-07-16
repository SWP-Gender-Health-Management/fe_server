import { Form, Input, Button, Checkbox } from 'antd';
import { MailOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import React from 'react';

const LoginForm = ({ form, onFinish, loading, onForgotPassword, GoogleLoginButton }) => (
  <Form
    form={form}
    layout="vertical"
    onFinish={onFinish}
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
        onClick={onForgotPassword}
      >
        Quên mật khẩu?
      </Button>
    </div>
    <Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        block
        loading={loading}
        className="submit-btn primary-btn"
        size="large"
      >
        Đăng nhập
      </Button>
    </Form.Item>
    {/* DividerSection sẽ được dùng ở ngoài nếu cần */}
    <div className="divider-section">
      <div className="divider-line"></div>
      <span className="divider-text">Hoặc</span>
      <div className="divider-line"></div>
    </div>
    <div className="google-login-container">
      {GoogleLoginButton}
    </div>
  </Form>
);

export default LoginForm; 