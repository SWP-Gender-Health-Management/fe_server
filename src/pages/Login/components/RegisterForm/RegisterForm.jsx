import { Form, Input, Button, Checkbox } from 'antd';
import { FontColorsOutlined, MailOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import React from 'react';

const RegisterForm = ({ form, onFinish, loading, GoogleLoginButton }) => (
  <Form
    form={form}
    layout="vertical"
    onFinish={onFinish}
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
        prefix={<FontColorsOutlined className="input-prefix-icon" />}
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
        loading={loading}
        className="submit-btn primary-btn"
        size="large"
      >
        Tạo tài khoản
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

export default RegisterForm; 