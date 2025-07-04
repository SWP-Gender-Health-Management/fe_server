import React, { useState } from 'react';
import {
  Card,
  Avatar,
  Button,
  Form,
  Input,
  message,
  Tabs,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Modal,
  Alert,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  TeamOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ManagerProfile = () => {
  const [profile, setProfile] = useState({
    fullName: sessionStorage.getItem('full_name') || 'Manager',
    email: sessionStorage.getItem('email') || 'manager@example.com',
    phone: '0123456789',
    department: 'Quản lý dịch vụ',
    joinDate: '2023-01-15',
    employeeId: 'MNG001',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    position: 'Quản lý cấp cao',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
    profileForm.setFieldsValue(profile);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await profileForm.validateFields();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfile({ ...values });
      setIsEditing(false);
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
    profileForm.setFieldsValue(profile);
  };

  const handleChangePassword = async (values) => {
    try {
      setPasswordLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      message.success('Đổi mật khẩu thành công!');
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error('Đổi mật khẩu thất bại!');
    } finally {
      setPasswordLoading(false);
    }
  };

  const ProfileInfo = () => (
    <Card
      className="profile-card"
      style={{
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Avatar
          size={120}
          style={{
            backgroundColor: '#10b981',
            fontSize: '48px',
            marginBottom: '16px',
          }}
          icon={<UserOutlined />}
        >
          {profile.fullName.charAt(0).toUpperCase()}
        </Avatar>
        <Title level={3} style={{ margin: '16px 0 8px 0', color: '#1a202c' }}>
          {profile.fullName}
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          {profile.position} • {profile.department}
        </Text>
        <br />
        <Text
          style={{
            fontSize: '12px',
            padding: '4px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#059669',
            fontWeight: '600',
            marginTop: '8px',
            display: 'inline-block',
          }}
        >
          Manager
        </Text>
      </div>

      <Form
        form={profileForm}
        initialValues={profile}
        layout="vertical"
        disabled={!isEditing}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="fullName"
              label={
                <Space>
                  <UserOutlined style={{ color: '#10b981' }} />
                  <Text strong>Họ và tên</Text>
                </Space>
              }
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input
                placeholder="Nhập họ và tên"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label={
                <Space>
                  <MailOutlined style={{ color: '#10b981' }} />
                  <Text strong>Email</Text>
                </Space>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input placeholder="Nhập email" style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label={
                <Space>
                  <PhoneOutlined style={{ color: '#10b981' }} />
                  <Text strong>Số điện thoại</Text>
                </Space>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
              ]}
            >
              <Input
                placeholder="Nhập số điện thoại"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="address"
              label={
                <Space>
                  <IdcardOutlined style={{ color: '#10b981' }} />
                  <Text strong>Địa chỉ</Text>
                </Space>
              }
            >
              <Input
                placeholder="Nhập địa chỉ"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <Space>
                  <TeamOutlined style={{ color: '#10b981' }} />
                  <Text strong>Phòng ban</Text>
                </Space>
              }
            >
              <Input
                value={profile.department}
                disabled
                style={{ borderRadius: '8px', backgroundColor: '#f9fafb' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <Space>
                  <CalendarOutlined style={{ color: '#10b981' }} />
                  <Text strong>Ngày vào làm</Text>
                </Space>
              }
            >
              <Input
                value={new Date(profile.joinDate).toLocaleDateString('vi-VN')}
                disabled
                style={{ borderRadius: '8px', backgroundColor: '#f9fafb' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider />

      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        {isEditing ? (
          <>
            <Button onClick={handleCancel} icon={<CloseOutlined />}>
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              loading={loading}
              icon={<SaveOutlined />}
              style={{
                backgroundColor: '#10b981',
                borderColor: '#10b981',
              }}
            >
              Lưu thay đổi
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setIsPasswordModalVisible(true)}
              icon={<LockOutlined />}
              style={{ marginRight: '8px' }}
            >
              Đổi mật khẩu
            </Button>
            <Button
              type="primary"
              onClick={handleEdit}
              icon={<EditOutlined />}
              style={{
                backgroundColor: '#10b981',
                borderColor: '#10b981',
              }}
            >
              Chỉnh sửa thông tin
            </Button>
          </>
        )}
      </Space>
    </Card>
  );

  const SecuritySettings = () => (
    <Card
      style={{
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
      }}
    >
      <Title level={4} style={{ color: '#1a202c', marginBottom: '24px' }}>
        <LockOutlined style={{ color: '#10b981', marginRight: '8px' }} />
        Cài đặt bảo mật
      </Title>

      <Alert
        message="Bảo mật tài khoản"
        description="Để đảm bảo an toàn, hãy sử dụng mật khẩu mạnh và thay đổi thường xuyên."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card
          size="small"
          style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical" size="small">
                <Text strong>Mật khẩu</Text>
                <Text type="secondary">Cập nhật lần cuối: 30 ngày trước</Text>
              </Space>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={() => setIsPasswordModalVisible(true)}
                style={{
                  backgroundColor: '#10b981',
                  borderColor: '#10b981',
                }}
              >
                Đổi mật khẩu
              </Button>
            </Col>
          </Row>
        </Card>

        <Card
          size="small"
          style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical" size="small">
                <Text strong>Đăng nhập gần đây</Text>
                <Text type="secondary">Hôm nay lúc 09:30 AM</Text>
              </Space>
            </Col>
            <Col>
              <Text type="success">✓ An toàn</Text>
            </Col>
          </Row>
        </Card>
      </Space>
    </Card>
  );

  return (
    <div
      style={{
        padding: '24px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ marginBottom: '8px', color: '#1a202c' }}>
          <UserOutlined style={{ color: '#10b981', marginRight: '12px' }} />
          Hồ sơ cá nhân
        </Title>
        <Text
          type="secondary"
          style={{ fontSize: '16px', marginBottom: '32px', display: 'block' }}
        >
          Quản lý thông tin cá nhân và cài đặt bảo mật tài khoản
        </Text>

        <Tabs
          defaultActiveKey="1"
          size="large"
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '16px',
          }}
        >
          <TabPane
            tab={
              <Space>
                <UserOutlined />
                Thông tin cá nhân
              </Space>
            }
            key="1"
          >
            <ProfileInfo />
          </TabPane>
          <TabPane
            tab={
              <Space>
                <LockOutlined />
                Bảo mật
              </Space>
            }
            key="2"
          >
            <SecuritySettings />
          </TabPane>
        </Tabs>

        {/* Change Password Modal */}
        <Modal
          title={
            <Space>
              <LockOutlined style={{ color: '#10b981' }} />
              Đổi mật khẩu
            </Space>
          }
          open={isPasswordModalVisible}
          onCancel={() => {
            setIsPasswordModalVisible(false);
            passwordForm.resetFields();
          }}
          footer={null}
          width={500}
        >
          <Alert
            message="Yêu cầu mật khẩu mạnh"
            description="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
            type="info"
            showIcon
            style={{ marginBottom: '24px' }}
          />

          <Form
            form={passwordForm}
            onFinish={handleChangePassword}
            layout="vertical"
          >
            <Form.Item
              name="currentPassword"
              label="Mật khẩu hiện tại"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
              ]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu hiện tại"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
              ]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu mới"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
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
                placeholder="Xác nhận mật khẩu mới"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => {
                    setIsPasswordModalVisible(false);
                    passwordForm.resetFields();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={passwordLoading}
                  style={{
                    backgroundColor: '#10b981',
                    borderColor: '#10b981',
                  }}
                >
                  Đổi mật khẩu
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManagerProfile;
