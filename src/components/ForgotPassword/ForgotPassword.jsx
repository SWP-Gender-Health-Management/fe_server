import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Steps } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  SafetyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import './ForgotPassword.css';

const { Step } = Steps;

const ForgotPassword = ({ visible, onCancel, onBackToLogin }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [emailForm] = Form.useForm();
  const [passcodeForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Bước 1: Gửi email để nhận passcode
  const handleSendPasscode = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/account/send-reset-password', {
        email: values.email,
      });

      setUserEmail(values.email);
      message.success('Passcode đã được gửi đến email của bạn!');
      setCurrentStep(1);
    } catch (error) {
      console.error('Lỗi gửi passcode:', error.response?.data || error.message);
      message.error(
        error.response?.data?.message ||
          'Không thể gửi passcode. Vui lòng thử lại!'
      );
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác thực passcode
  const handleVerifyPasscode = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/account/verify-reset-password', {
        email: userEmail,
        passcode: values.passcode,
      });

      message.success('Passcode chính xác!');
      setCurrentStep(2);
    } catch (error) {
      console.error(
        'Lỗi xác thực passcode:',
        error.response?.data || error.message
      );
      message.error(
        error.response?.data?.message || 'Passcode không chính xác!'
      );
    } finally {
      setLoading(false);
    }
  };

  // Bước 3: Đặt lại mật khẩu mới
  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/account/reset-password', {
        email: userEmail,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      message.success(
        'Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập với mật khẩu mới.'
      );
      handleClose();
      onBackToLogin();
    } catch (error) {
      console.error(
        'Lỗi đặt lại mật khẩu:',
        error.response?.data || error.message
      );
      message.error(
        error.response?.data?.message ||
          'Không thể đặt lại mật khẩu. Vui lòng thử lại!'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    emailForm.resetFields();
    passcodeForm.resetFields();
    passwordForm.resetFields();
    setUserEmail('');
    onCancel();
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form
            form={emailForm}
            layout="vertical"
            onFinish={handleSendPasscode}
            className="forgot-password-form"
            size="large"
          >
            <div className="step-header">
              <h3>Nhập địa chỉ email</h3>
              <p>Chúng tôi sẽ gửi passcode đến email của bạn</p>
            </div>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="input-prefix-icon" />}
                placeholder="Nhập địa chỉ email của bạn"
                className="modern-input"
              />
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
                Gửi passcode
              </Button>
            </Form.Item>
          </Form>
        );

      case 1:
        return (
          <Form
            form={passcodeForm}
            layout="vertical"
            onFinish={handleVerifyPasscode}
            className="forgot-password-form"
            size="large"
          >
            <div className="step-header">
              <h3>Nhập mã xác thực</h3>
              <p>
                Chúng tôi đã gửi passcode đến <strong>{userEmail}</strong>
              </p>
            </div>

            <Form.Item
              name="passcode"
              rules={[
                { required: true, message: 'Vui lòng nhập passcode!' },
                { len: 6, message: 'Passcode phải có 6 ký tự!' },
              ]}
            >
              <Input
                prefix={<SafetyOutlined className="input-prefix-icon" />}
                placeholder="Nhập mã 6 ký tự"
                className="modern-input passcode-input"
                maxLength={6}
              />
            </Form.Item>

            <div className="form-actions">
              <Button
                type="default"
                onClick={handleBack}
                className="back-btn"
                icon={<ArrowLeftOutlined />}
              >
                Quay lại
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="submit-btn primary-btn"
                size="large"
              >
                Xác thực
              </Button>
            </div>

            <div className="resend-section">
              <span>Không nhận được mã? </span>
              <Button
                type="link"
                onClick={() => handleSendPasscode({ email: userEmail })}
                disabled={loading}
              >
                Gửi lại
              </Button>
            </div>
          </Form>
        );

      case 2:
        return (
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleResetPassword}
            className="forgot-password-form"
            size="large"
          >
            <div className="step-header">
              <h3>Đặt mật khẩu mới</h3>
              <p>Vui lòng nhập mật khẩu mới cho tài khoản của bạn</p>
            </div>

            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-prefix-icon" />}
                placeholder="Mật khẩu mới"
                className="modern-input"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
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
                placeholder="Xác nhận mật khẩu mới"
                className="modern-input"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <div className="form-actions">
              <Button
                type="default"
                onClick={handleBack}
                className="back-btn"
                icon={<ArrowLeftOutlined />}
              >
                Quay lại
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="submit-btn primary-btn"
                size="large"
              >
                Đặt lại mật khẩu
              </Button>
            </div>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={500}
      centered
      className="forgot-password-modal"
      maskClosable={false}
      destroyOnClose
    >
      <div className="forgot-password-container">
        <div className="modal-header">
          <h2>Quên mật khẩu</h2>
          <Steps current={currentStep} size="small" className="progress-steps">
            <Step title="Email" />
            <Step title="Xác thực" />
            <Step title="Mật khẩu mới" />
          </Steps>
        </div>

        <div className="step-content">{renderStepContent()}</div>

        <div className="back-to-login">
          <Button type="link" onClick={onBackToLogin}>
            ← Quay lại đăng nhập
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ForgotPassword;
