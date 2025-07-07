import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  Typography,
  Button,
  Input,
  message,
  Avatar,
  Row,
  Col,
  Tabs,
  Form,
  Select,
  DatePicker,
  Upload,
  Progress,
  Statistic,
  Badge,
  List,
  Tag,
  Switch,
  Divider,
  Space,
  Modal,
  Popconfirm,
  Result,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  SettingOutlined,
  BellOutlined,
  SecurityScanOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useAuth } from '@context/AuthContext.jsx';
import dayjs from 'dayjs';
import Cookies from 'js-cookie'; // nhớ import nếu chưa có
import './UserAccount.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const UserAccount = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const { isLoggedIn } = useAuth();
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(''); // State để lưu URL avatar
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [emailVerifyModalVisible, setEmailVerifyModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] =
    useState(false);
  const [passwordForm] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // null, 'success', 'error'

  useEffect(() => {
    const fetchAccountData = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      const accessToken = Cookies.get('accessToken');
      const accountId = Cookies.get('accountId');

      if (!accessToken || !accountId) {
        setLoading(false);
        message.error('Vui lòng đăng nhập lại.');
        return;
      }

      try {
        // Lấy thông tin tài khoản
        const accountRes = await axios.post(
          'http://localhost:3000/account/view-account',
          { account_id: accountId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const accountData = accountRes.data.result || {};
        if (accountData.dob) {
          accountData.dob = dayjs(accountData.dob);
        }
        setEditedInfo(accountData);
        form.setFieldsValue(accountData);
        if (accountData.avatar) {
          setAvatarUrl(accountData.avatar);
        }
        calculateProfileCompletion(accountData);

        // Lấy lịch hẹn
        try {
          const appointmentRes = await axios.get(
            `http://localhost:3000/consult-appointment/get-consult-appointment-by-id/customer/${accountId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setAppointments(appointmentRes.data.result || []);
        } catch (error) {
          if (error.response?.status === 404) {
            setAppointments([]); // Không có lịch hẹn thì đặt mảng rỗng
          } else {
            console.error('Lỗi khi tải dữ liệu:', error);
            message.error('Lỗi khi tải lịch hẹn');
          }
        }

        // Lấy hồ sơ sức khỏe
        const healthRes = await axios.get(
          `http://localhost:3000/health-record/list?account_id=${accountId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setHealthRecords(healthRes.data.result || []);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        message.error('Không thể tải thông tin. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [isLoggedIn, form]);

  const calculateProfileCompletion = (data) => {
    const fields = ['full_name', 'email', 'phone', 'dob', 'gender', 'address'];
    const completed = fields.filter((field) => {
      const value = data[field];
      if (value == null) return false;
      if (typeof value === 'string') return value.trim() !== '';
      return true; // chấp nhận cả object như Date hoặc enum
    }).length;
    const percentage = Math.round((completed / fields.length) * 100);
    setProfileCompletion(percentage);
  };

  const handleSave = async (values) => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      message.error('Vui lòng đăng nhập để lưu thông tin.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/account/update-profile',
        { ...values },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const updatedData = response.data.result || values;
      setEditedInfo(updatedData);
      calculateProfileCompletion(updatedData);
      setIsEditing(false);
      message.success('Cập nhật thông tin thành công!');
    } catch (err) {
      console.error('Lỗi khi cập nhật thông tin:', err);
      message.error('Không thể cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue(editedInfo);
    setIsEditing(false);
  };

  const handleAvatarUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    const accessToken = Cookies.getm('accessToken');
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post(
        'http://localhost:3000/account/update-avatar', // Giả định endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setAvatarUrl(response.data.avatarUrl); // Cập nhật URL avatar từ server
        message.success('Cập nhật ảnh đại diện thành công!');
        onSuccess();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
      message.error('Lỗi khi tải ảnh lên!');
      onError(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  // Password change handler
  const handlePasswordChange = async (values) => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      message.error('Vui lòng đăng nhập để thay đổi mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/account/change-password',
        {
          current_password: values.currentPassword,
          new_password: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        message.success('Đổi mật khẩu thành công!');
        setPasswordModalVisible(false);
        passwordForm.resetFields();
      } else {
        message.error(response.data.message || 'Đổi mật khẩu thất bại.');
      }
    } catch (err) {
      console.error('Lỗi khi đổi mật khẩu:', err);
      message.error(
        err.response?.data?.message || 'Mật khẩu hiện tại không đúng.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Send verification email
  const sendVerificationEmail = async () => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      message.error('Vui lòng đăng nhập để xác thực email.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/account/send-verification',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        message.success('Mã xác thực đã được gửi đến email của bạn!');
        setVerificationSent(true);
      } else {
        message.error(response.data.message || 'Không thể gửi mã xác thực.');
      }
    } catch (err) {
      console.error('Lỗi khi gửi mã xác thực:', err);
      message.error('Không thể gửi mã xác thực. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Verify email with code
  const verifyEmail = async (values) => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      message.error('Vui lòng đăng nhập để xác thực email.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/account/verify-email',
        {
          verification_code: values.verificationCode,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setVerificationStatus('success');
      } else {
        setVerificationStatus('error');
      }
    } catch (err) {
      console.error('Lỗi khi xác thực email:', err);
      setVerificationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const deleteAccount = async () => {
    const accessToken = Cookies.get('accessToken');
    const accountId = Cookies.get('accountId');

    if (!accessToken || !accountId) {
      message.error('Vui lòng đăng nhập để thực hiện thao tác này.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/account/delete-account',
        { account_id: accountId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        message.success('Tài khoản đã được xóa thành công.');
        // Clear cookies and redirect to home page
        Cookies.remove('accessToken');
        Cookies.remove('accountId');
        Cookies.remove('role');
        window.location.href = '/';
      } else {
        message.error(response.data.message || 'Không thể xóa tài khoản.');
      }
    } catch (err) {
      console.error('Lỗi khi xóa tài khoản:', err);
      message.error('Không thể xóa tài khoản. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Open email verification modal and send verification code
  const openEmailVerification = () => {
    setEmailVerifyModalVisible(true);
    sendVerificationEmail();
  };

  if (loading) {
    return (
      <div className="account-container">
        <div className="loading-container">
          <Title level={4}>Đang tải thông tin tài khoản...</Title>
        </div>
      </div>
    );
  }

  const personalInfoTab = (
    <div className="tab-content">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={editedInfo}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Họ và tên"
              name="full_name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập họ và tên"
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Nhập email"
                disabled={true}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Nhập số điện thoại"
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Ngày sinh" name="dob">
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Chọn ngày sinh"
                disabled={!isEditing}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="Giới tính" name="gender">
              <Select placeholder="Chọn giới tính" disabled={!isEditing}>
                <Option value="Female">Nữ</Option>
                <Option value="Male">Nam</Option>
                <Option value="Other">Khác</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Tình trạng hôn nhân" name="marital_status">
              <Select placeholder="Chọn tình trạng" disabled={!isEditing}>
                <Option value="single">Độc thân</Option>
                <Option value="married">Đã kết hôn</Option>
                <Option value="divorced">Đã ly hôn</Option>
                <Option value="widowed">Góa phụ</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24}>
            <Form.Item label="Địa chỉ" name="address">
              <TextArea
                rows={3}
                placeholder="Nhập địa chỉ chi tiết"
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24}>
            <Form.Item label="Ghi chú sức khỏe" name="health_notes">
              <TextArea
                rows={4}
                placeholder="Ghi chú về tình trạng sức khỏe, dị ứng, thuốc đang sử dụng..."
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
        </Row>

        {isEditing && (
          <div className="form-actions">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Lưu thay đổi
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </Space>
          </div>
        )}
      </Form>
    </div>
  );

  const appointmentsTab = (
    <div className="tab-content">
      <List
        dataSource={appointments}
        renderItem={(item) => (
          <List.Item className="appointment-item">
            <Card className="appointment-card">
              <Row gutter={16} align="middle">
                <Col xs={24} sm={6}>
                  <div className="appointment-date">
                    <CalendarOutlined className="date-icon" />
                    <div>
                      <div className="date">
                        {dayjs(
                          item.consultant_pattern?.working_slot?.date
                        ).format('DD/MM/YYYY')}
                      </div>
                      <div className="time">
                        {item.consultant_pattern?.working_slot?.time_slot ||
                          'Không rõ'}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="appointment-info">
                    <Title level={5}>
                      {item.consultant_pattern?.title || 'Tư vấn'}
                    </Title>
                    <Text type="secondary">
                      {item.consultant_pattern?.consultant?.full_name ||
                        'Chuyên gia chưa rõ'}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div className="appointment-location">
                    <EnvironmentOutlined />
                    <Text>{item.location || 'Online'}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={4}>
                  <Tag color={getStatusColor(item.status)}>
                    {getStatusText(item.status)}
                  </Tag>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );

  const healthRecordsTab = (
    <div className="tab-content">
      <List
        dataSource={healthRecords}
        renderItem={(item) => (
          <List.Item className="health-record-item">
            <Card className="health-record-card">
              <Row gutter={16}>
                <Col xs={24} sm={4}>
                  <div className="record-date">
                    <CalendarOutlined />
                    <Text strong>{dayjs(item.date).format('DD/MM/YYYY')}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div className="record-type">
                    <FileTextOutlined />
                    <Text>{item.type}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div className="record-result">
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <Text strong>{item.result}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="record-notes">
                    <Text type="secondary">{item.notes}</Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );

  const settingsTab = (
    <div className="tab-content">
      {/* <Card title="Thông báo" className="settings-card">
        <Row gutter={16}>
          <Col span={18}>
            <Text>Nhận thông báo về lịch hẹn</Text>
          </Col>
          <Col span={6}>
            <Switch defaultChecked />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={18}>
            <Text>Nhận email nhắc nhở</Text>
          </Col>
          <Col span={6}>
            <Switch defaultChecked />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={18}>
            <Text>Nhận tin tức sức khỏe</Text>
          </Col>
          <Col span={6}>
            <Switch />
          </Col>
        </Row>
      </Card> */}

      <Card title="Bảo mật" className="settings-card">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            icon={<SecurityScanOutlined />}
            onClick={() => setPasswordModalVisible(true)}
          >
            Đổi mật khẩu
          </Button>
          <Button
            icon={<SecurityScanOutlined />}
            onClick={openEmailVerification}
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
        </Space>
      </Card>
    </div>
  );

  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined />
          Thông tin cá nhân
        </span>
      ),
      children: personalInfoTab,
    },
    {
      key: '2',
      label: (
        <span>
          <CalendarOutlined />
          Lịch hẹn tư vấn ({appointments.length})
        </span>
      ),
      children: appointmentsTab,
    },
    {
      key: '3',
      label: (
        <span>
          <HeartOutlined />
          Lịch hẹn xét nghiệm ({healthRecords.length})
        </span>
      ),
      children: healthRecordsTab,
    },
    {
      key: '4',
      label: (
        <span>
          <SettingOutlined />
          Cài đặt
        </span>
      ),
      children: settingsTab,
    },
  ];

  return (
    <div className="account-container">
      {/* Profile Header */}
      <Card className="profile-header">
        <Row gutter={24} align="middle">
          <Col xs={24} sm={6} md={4}>
            <div className="avatar-section">
              <Badge
                count={
                  <Upload
                    name="avatar"
                    showUploadList={false}
                    customRequest={handleAvatarUpload}
                    accept="image/*"
                  >
                    <Button
                      size="small"
                      icon={<CameraOutlined />}
                      shape="circle"
                      className="avatar-edit-btn"
                    />
                  </Upload>
                }
                offset={[-10, 35]}
              >
                <Avatar
                  size={80}
                  src={avatarUrl || undefined} // Hiển thị avatar từ URL
                  icon={!avatarUrl && <UserOutlined />} // Icon mặc định nếu không có avatar
                  className="user-avatar"
                />
              </Badge>
            </div>
          </Col>
          <Col xs={24} sm={12} md={14}>
            <div className="profile-info">
              <Title level={3} className="user-name">
                {editedInfo.full_name || 'Chưa cập nhật tên'}
              </Title>
              <Text type="secondary" className="user-email">
                {editedInfo.email || 'Chưa cập nhật email'}
              </Text>
              <div className="profile-completion">
                <Text>Hoàn thiện hồ sơ: </Text>
                <Progress
                  percent={profileCompletion}
                  size="small"
                  style={{ width: 200, marginLeft: 8 }}
                />
              </div>
            </div>
          </Col>
          <Col xs={24} sm={6} md={6}>
            <div className="profile-stats">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Lịch hẹn"
                    value={appointments.length}
                    prefix={<CalendarOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Hồ sơ"
                    value={healthRecords.length}
                    prefix={<FileTextOutlined />}
                  />
                </Col>
              </Row>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(!isEditing)}
                className="edit-profile-btn"
              >
                {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa hồ sơ'}
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <Card className="main-content">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="account-tabs"
        />
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
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu hiện tại',
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu mới',
              },
              {
                min: 8,
                message: 'Mật khẩu phải có ít nhất 8 ký tự',
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              {
                required: true,
                message: 'Vui lòng xác nhận mật khẩu mới',
              },
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
          setEmailVerifyModalVisible(false);
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
                  setEmailVerifyModalVisible(false);
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
              <Title level={3} className="verify-email-title">
                Nhập mã xác thực
              </Title>
              <Paragraph className="verify-email-subtitle">
                Chúng tôi đã gửi mã xác thực 6 số đến email của bạn. Vui lòng
                kiểm tra hộp thư đến và nhập mã xác thực bên dưới.
              </Paragraph>
            </div>

            <Form form={verifyForm} layout="vertical" onFinish={verifyEmail}>
              <Form.Item
                name="verificationCode"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mã xác thực',
                  },
                  {
                    len: 6,
                    message: 'Mã xác thực phải có 6 ký tự',
                  },
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
          <Title level={4} style={{ color: '#ff4d4f' }}>
            Bạn có chắc chắn muốn xóa tài khoản?
          </Title>
          <Text>
            Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa
            vĩnh viễn.
          </Text>
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

export default UserAccount;
