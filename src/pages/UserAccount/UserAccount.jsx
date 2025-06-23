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
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '@context/AuthContext.jsx';
import dayjs from 'dayjs';
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

  // Mock data for demonstration
  const mockAppointments = [
    {
      id: 1,
      type: 'Tư vấn 1:1',
      doctor: 'BS. Nguyễn Thị Hạnh',
      date: '2024-01-20',
      time: '09:00',
      status: 'confirmed',
      location: 'Phòng khám A1',
    },
    {
      id: 2,
      type: 'Xét nghiệm',
      doctor: 'BS. Trần Văn Nam',
      date: '2024-01-25',
      time: '14:00',
      status: 'pending',
      location: 'Phòng xét nghiệm B2',
    },
  ];

  const mockHealthRecords = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'Khám tổng quát',
      result: 'Bình thường',
      notes: 'Sức khỏe tốt, tiếp tục theo dõi định kỳ',
    },
    {
      id: 2,
      date: '2024-01-10',
      type: 'Xét nghiệm hormone',
      result: 'Trong giới hạn bình thường',
      notes: 'Các chỉ số hormone ổn định',
    },
  ];

  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        setLoading(false);
        message.error('Vui lòng đăng nhập để xem thông tin tài khoản.');
        return;
      }

      try {
        const response = await axios.post(
          'http://localhost:3000/account/view-account',
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const accountData = response.data.result || {};
        setEditedInfo(accountData);
        form.setFieldsValue(accountData);

        // Cập nhật avatar nếu có từ server
        if (accountData.avatar) {
          setAvatarUrl(accountData.avatar); // Giả định avatar là URL
        }

        calculateProfileCompletion(accountData);
        setAppointments(mockAppointments);
        setHealthRecords(mockHealthRecords);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin tài khoản:', err);
        message.error('Không thể tải thông tin tài khoản. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) fetchAccountInfo();
  }, [isLoggedIn, form]);

  const calculateProfileCompletion = (data) => {
    const fields = ['full_name', 'email', 'phone', 'dob', 'gender', 'address'];
    const completed = fields.filter(
      (field) => data[field] && data[field].trim() !== ''
    ).length;
    const percentage = Math.round((completed / fields.length) * 100);
    setProfileCompletion(percentage);
  };

  const handleSave = async (values) => {
    const accessToken = sessionStorage.getItem('accessToken');
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
    const accessToken = sessionStorage.getItem('accessToken');
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
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
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
                        {dayjs(item.date).format('DD/MM/YYYY')}
                      </div>
                      <div className="time">{item.time}</div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="appointment-info">
                    <Title level={5}>{item.type}</Title>
                    <Text type="secondary">{item.doctor}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div className="appointment-location">
                    <EnvironmentOutlined />
                    <Text>{item.location}</Text>
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
      <Card title="Thông báo" className="settings-card">
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
      </Card>

      <Card title="Bảo mật" className="settings-card">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button icon={<SecurityScanOutlined />}>Đổi mật khẩu</Button>
          <Button icon={<SecurityScanOutlined />}>Xác thực hai bước</Button>
          <Button danger icon={<ExclamationCircleOutlined />}>
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
          Lịch hẹn ({appointments.length})
        </span>
      ),
      children: appointmentsTab,
    },
    {
      key: '3',
      label: (
        <span>
          <HeartOutlined />
          Hồ sơ sức khỏe ({healthRecords.length})
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
    </div>
  );
};

export default UserAccount;