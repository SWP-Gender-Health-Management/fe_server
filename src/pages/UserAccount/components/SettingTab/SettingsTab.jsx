import React from 'react';
import {
  Card,
  Button,
  Space,
  Alert,
  Modal,
  Form,
  Input,
  Typography,
  Result,
  Popconfirm,
} from 'antd';
import {
  SecurityScanOutlined,
  ExclamationCircleOutlined,
  MailOutlined,
} from '@ant-design/icons';

const SettingsTab = ({
  isGoogleAccount,
  setPasswordModalVisible,
  openEmailVerification,
  setDeleteAccountModalVisible,
  passwordModalVisible,
  passwordForm,
  handlePasswordChange,
  loading,
  emailVerifyModalVisible,
  verifyForm,
  verifyEmail,
  verificationStatus,
  sendVerificationEmail,
  setVerificationStatus,
  verificationSent,
  deleteAccountModalVisible,
  deleteAccount,
}) => {
  return (
    <div className="tab-content">
      <Card title="Bảo mật" className="settings-card">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            icon={<SecurityScanOutlined />}
            onClick={() => setPasswordModalVisible(true)}
            disabled={isGoogleAccount}
            title={
              isGoogleAccount
                ? 'Không khả dụng cho tài khoản đăng nhập bằng Google'
                : ''
            }
          >
            Đổi mật khẩu
          </Button>
          <Button
            icon={<SecurityScanOutlined />}
            onClick={openEmailVerification}
            disabled={isGoogleAccount}
            title={
              isGoogleAccount
                ? 'Không khả dụng cho tài khoản đăng nhập bằng Google'
                : ''
            }
          >
            Xác thực email
          </Button>
          <Button
            danger
            icon={<ExclamationCircleOutlined />}
            onClick={() => setDeleteAccountModalVisible(true)}
          >
            Xóa tài khoản
          </Button>

          {isGoogleAccount && (
            <Alert
              message="Tài khoản Google"
              description="Bạn đang sử dụng tài khoản Google để đăng nhập. Một số tính năng không khả dụng."
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </Space>
      </Card>

      {/* Password Change Modal */}
      <Modal
        title="Đổi mật khẩu"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Mật khẩu xác nhận không khớp')
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Đổi mật khẩu
              </Button>
              <Button
                onClick={() => {
                  setPasswordModalVisible(false);
                  passwordForm.resetFields();
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Email Verification Modal */}
      <Modal
        title="Xác thực email"
        open={emailVerifyModalVisible}
        onCancel={() => {
          openEmailVerification(false);
          verifyForm.resetFields();
          setVerificationStatus(null);
        }}
        footer={null}
        className="email-verification-modal"
        centered
      >
        {verificationStatus === 'success' ? (
          <Result
            status="success"
            title="Xác thực email thành công!"
            subTitle="Email của bạn đã được xác thực thành công. Bạn có thể tiếp tục sử dụng dịch vụ của chúng tôi."
            className="result-success"
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  openEmailVerification(false);
                  setVerificationStatus(null);
                }}
                size="large"
              >
                Đóng
              </Button>,
            ]}
          />
        ) : verificationStatus === 'error' ? (
          <Result
            status="error"
            title="Xác thực email thất bại"
            subTitle="Mã xác thực không đúng hoặc đã hết hạn. Vui lòng thử lại."
            className="result-error"
            extra={[
              <Button
                type="primary"
                key="retry"
                onClick={() => {
                  setVerificationStatus(null);
                  verifyForm.resetFields();
                }}
                size="large"
              >
                Thử lại
              </Button>,
              <Button key="resend" onClick={sendVerificationEmail}>
                Gửi lại mã
              </Button>,
            ]}
          />
        ) : (
          <div className="verify-email-container">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <MailOutlined className="verify-email-icon" />
              <Typography.Title level={3} className="verify-email-title">
                Nhập mã xác thực
              </Typography.Title>
              <Typography.Paragraph className="verify-email-subtitle">
                Chúng tôi đã gửi mã xác thực 6 số đến email của bạn. Vui lòng
                kiểm tra hộp thư đến và nhập mã xác thực bên dưới.
              </Typography.Paragraph>
            </div>
            <Form form={verifyForm} layout="vertical" onFinish={verifyEmail}>
              <Form.Item
                name="verificationCode"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã xác thực' },
                  { len: 6, message: 'Mã xác thực phải có 6 ký tự' },
                ]}
              >
                <Input
                  placeholder="Nhập mã xác thực 6 số"
                  maxLength={6}
                  className="verification-code-input"
                />
              </Form.Item>
              <div style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="verify-button"
                  block
                >
                  Xác thực
                </Button>
                <Button
                  type="link"
                  onClick={sendVerificationEmail}
                  loading={loading}
                  className="resend-link"
                >
                  Không nhận được mã? Gửi lại
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        title="Xóa tài khoản"
        open={deleteAccountModalVisible}
        onCancel={() => setDeleteAccountModalVisible(false)}
        footer={null}
      >
        <div style={{ marginBottom: 24 }}>
          <Typography.Title level={4} style={{ color: '#ff4d4f' }}>
            Bạn có chắc chắn muốn xóa tài khoản?
          </Typography.Title>
          <Typography.Text>
            Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa
            vĩnh viễn.
          </Typography.Text>
        </div>
        <Space>
          <Popconfirm
            title="Xác nhận xóa tài khoản"
            description="Bạn thực sự muốn xóa tài khoản của mình?"
            onConfirm={deleteAccount}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger type="primary" loading={loading}>
              Xóa tài khoản
            </Button>
          </Popconfirm>
          <Button onClick={() => setDeleteAccountModalVisible(false)}>
            Hủy
          </Button>
        </Space>
      </Modal>
    </div>
  );
};

export default SettingsTab;
