import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Avatar,
  Button,
  Descriptions,
  Tag,
  Space,
  Statistic,
  Progress,
  Timeline,
  Badge,
  Divider,
  Typography,
  List,
  Rate,
  Tooltip,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  message,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CalendarOutlined,
  TrophyOutlined,
  StarOutlined,
  ExperimentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  SafetyOutlined,
  BookOutlined,
  UploadOutlined,
  CameraOutlined,
  IdcardOutlined,
  BankOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './StaffProfile.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const StaffProfile = () => {
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [form] = Form.useForm();

  // Mock profile data
  const mockProfileData = {
    // Thông tin cơ bản
    id: 'ST001',
    employeeCode: 'EMP2023001',
    fullName: 'Nguyễn Thị Mai',
    avatar: 'https://via.placeholder.com/150',
    position: 'Kỹ thuật viên xét nghiệm',
    department: 'Phòng xét nghiệm',
    level: 'Trung cấp',
    status: 'active',

    // Thông tin liên hệ
    email: 'mai.nguyen@hospital.com',
    phone: '0901234567',
    address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
    emergencyContact: {
      name: 'Nguyễn Văn Hùng',
      relationship: 'Chồng',
      phone: '0907654321',
    },

    // Thông tin công việc
    hireDate: '2023-03-15',
    contractType: 'Toàn thời gian',
    workingHours: '8:00 - 17:00',
    salary: 'Theo quy định',
    workLocation: 'Tầng 2, Tòa nhà A',

    // Chuyên môn
    specializations: ['Huyết học', 'Sinh hóa', 'Vi sinh'],
    certifications: [
      {
        name: 'Chứng chỉ kỹ thuật viên xét nghiệm',
        issuer: 'Bộ Y tế',
        issueDate: '2023-01-15',
        expiryDate: '2026-01-15',
        status: 'active',
      },
      {
        name: 'Chứng chỉ an toàn sinh học',
        issuer: 'Viện Pasteur',
        issueDate: '2023-06-20',
        expiryDate: '2025-06-20',
        status: 'active',
      },
    ],

    // Thống kê công việc
    workStats: {
      totalTests: 1247,
      completedTests: 1189,
      accuracyRate: 99.2,
      avgTimePerTest: 25, // minutes
      totalWorkingDays: 310,
      overtimeHours: 45,
      leaveDays: 12,
    },

    // Đánh giá và thành tích
    rating: 4.9,
    achievements: [
      {
        title: 'Nhân viên xuất sắc tháng 12/2023',
        date: '2023-12-01',
        description: 'Hoàn thành xuất sắc 98% công việc được giao',
      },
      {
        title: 'Chứng nhận đào tạo nâng cao',
        date: '2023-10-15',
        description: 'Hoàn thành khóa đào tạo nâng cao về xét nghiệm huyết học',
      },
    ],

    // Lịch sử làm việc
    workHistory: [
      {
        date: '2024-01-16',
        activity: 'Hoàn thành 15 xét nghiệm máu',
        status: 'completed',
        time: '08:30',
      },
      {
        date: '2024-01-16',
        activity: 'Tham gia họp phòng ban',
        status: 'completed',
        time: '14:00',
      },
      {
        date: '2024-01-15',
        activity: 'Đào tạo quy trình mới',
        status: 'completed',
        time: '16:00',
      },
    ],

    // Thông tin bổ sung
    skills: [
      { name: 'Xét nghiệm máu', level: 95 },
      { name: 'Xét nghiệm nước tiểu', level: 90 },
      { name: 'Vi sinh', level: 85 },
      { name: 'Sinh hóa', level: 92 },
      { name: 'An toàn sinh học', level: 98 },
    ],

    languages: [
      { name: 'Tiếng Việt', level: 'Bản ngữ' },
      { name: 'Tiếng Anh', level: 'Trung cấp' },
    ],
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProfileData(mockProfileData);
      setLoading(false);
    }, 800);
  };

  const handleEditProfile = () => {
    form.setFieldsValue({
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address,
      emergencyContactName: profileData.emergencyContact.name,
      emergencyContactPhone: profileData.emergencyContact.phone,
      emergencyContactRelationship: profileData.emergencyContact.relationship,
    });
    setEditModalVisible(true);
  };

  const handleUpdateProfile = async (values) => {
    setUpdating(true);

    // Simulate API call
    setTimeout(() => {
      const updatedProfile = {
        ...profileData,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        emergencyContact: {
          name: values.emergencyContactName,
          phone: values.emergencyContactPhone,
          relationship: values.emergencyContactRelationship,
        },
      };

      setProfileData(updatedProfile);
      setEditModalVisible(false);
      setUpdating(false);
      form.resetFields();

      message.success('Cập nhật thông tin cá nhân thành công!');
    }, 1500);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      inactive: 'red',
      pending: 'orange',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      active: 'Đang làm việc',
      inactive: 'Nghỉ việc',
      pending: 'Chờ xử lý',
    };
    return texts[status] || status;
  };

  if (loading || !profileData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div className="loading-spinner">Đang tải thông tin...</div>
      </div>
    );
  }

  const uploadProps = {
    name: 'avatar',
    action: '/api/upload',
    beforeUpload: () => false,
    accept: 'image/*',
    maxCount: 1,
    showUploadList: false,
  };

  return (
    <div className="staff-profile">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h2>Hồ sơ cá nhân</h2>
          <p>Thông tin chi tiết về nhân viên và hiệu suất công việc</p>
        </div>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={handleEditProfile}
          size="large"
        >
          Chỉnh sửa thông tin
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Basic Info */}
        <Col xs={24} lg={8}>
          {/* Profile Card */}
          <Card className="profile-card">
            <div className="profile-header">
              <div className="avatar-section">
                <Badge
                  count={
                    <Tooltip title="Thay đổi ảnh đại diện">
                      <Upload {...uploadProps}>
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<CameraOutlined />}
                          size="small"
                          className="avatar-upload-btn"
                        />
                      </Upload>
                    </Tooltip>
                  }
                  offset={[-10, 10]}
                >
                  <Avatar
                    size={120}
                    src={profileData.avatar}
                    icon={<UserOutlined />}
                    className="profile-avatar"
                  />
                </Badge>
              </div>

              <div className="profile-info">
                <Title level={3} style={{ marginBottom: 8 }}>
                  {profileData.fullName}
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  {profileData.position}
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Tag
                    color={getStatusColor(profileData.status)}
                    icon={<CheckCircleOutlined />}
                  >
                    {getStatusText(profileData.status)}
                  </Tag>
                  <Tag color="blue">{profileData.level}</Tag>
                </div>

                <div className="rating-section" style={{ marginTop: 16 }}>
                  <Space>
                    <Rate
                      disabled
                      defaultValue={profileData.rating}
                      allowHalf
                    />
                    <Text strong>{profileData.rating}</Text>
                  </Space>
                </div>
              </div>
            </div>

            <Divider />

            {/* Contact Info */}
            <div className="contact-info">
              <Title level={5}>Thông tin liên hệ</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Space>
                    <IdcardOutlined />
                    <Text strong>Mã NV:</Text>
                    <Text>{profileData.employeeCode}</Text>
                  </Space>
                </div>
                <div>
                  <Space>
                    <MailOutlined />
                    <Text strong>Email:</Text>
                    <Text copyable>{profileData.email}</Text>
                  </Space>
                </div>
                <div>
                  <Space>
                    <PhoneOutlined />
                    <Text strong>Điện thoại:</Text>
                    <Text copyable>{profileData.phone}</Text>
                  </Space>
                </div>
                <div>
                  <Space>
                    <HomeOutlined />
                    <Text strong>Địa chỉ:</Text>
                  </Space>
                  <Text>{profileData.address}</Text>
                </div>
              </Space>
            </div>

            <Divider />

            {/* Emergency Contact */}
            <div className="emergency-contact">
              <Title level={5}>Liên hệ khẩn cấp</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>{profileData.emergencyContact.name}</Text>
                <Text>({profileData.emergencyContact.relationship})</Text>
                <Text copyable>{profileData.emergencyContact.phone}</Text>
              </Space>
            </div>
          </Card>

          {/* Skills Card */}
          <Card title="Kỹ năng chuyên môn" style={{ marginTop: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {profileData.skills.map((skill, index) => (
                <div key={index}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <Text>{skill.name}</Text>
                    <Text strong>{skill.level}%</Text>
                  </div>
                  <Progress
                    percent={skill.level}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    showInfo={false}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Right Column - Work Info */}
        <Col xs={24} lg={16}>
          {/* Work Statistics */}
          <Card title="Thống kê công việc" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8} lg={6}>
                <Statistic
                  title="Tổng số xét nghiệm"
                  value={profileData.workStats.totalTests}
                  prefix={<ExperimentOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col xs={12} sm={8} lg={6}>
                <Statistic
                  title="Đã hoàn thành"
                  value={profileData.workStats.completedTests}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12} sm={8} lg={6}>
                <Statistic
                  title="Độ chính xác"
                  value={profileData.workStats.accuracyRate}
                  precision={1}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              <Col xs={12} sm={8} lg={6}>
                <Statistic
                  title="Thời gian TB"
                  value={profileData.workStats.avgTimePerTest}
                  suffix="phút"
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Ngày làm việc"
                  value={profileData.workStats.totalWorkingDays}
                  prefix={<CalendarOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Giờ làm thêm"
                  value={profileData.workStats.overtimeHours}
                  suffix="h"
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Ngày nghỉ"
                  value={profileData.workStats.leaveDays}
                  prefix={<CalendarOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: '#52c41a',
                    }}
                  >
                    {(
                      (profileData.workStats.completedTests /
                        profileData.workStats.totalTests) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div style={{ color: '#999' }}>Tỷ lệ hoàn thành</div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Work Details */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="Thông tin công việc">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Phòng ban">
                    <Tag color="blue" icon={<BankOutlined />}>
                      {profileData.department}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày vào làm">
                    {dayjs(profileData.hireDate).format('DD/MM/YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại hợp đồng">
                    {profileData.contractType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giờ làm việc">
                    {profileData.workingHours}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa điểm làm việc">
                    {profileData.workLocation}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Chuyên môn">
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Lĩnh vực chuyên môn:</Text>
                  <div style={{ marginTop: 8 }}>
                    {profileData.specializations.map((spec, index) => (
                      <Tag
                        key={index}
                        color="purple"
                        style={{ marginBottom: 4 }}
                      >
                        {spec}
                      </Tag>
                    ))}
                  </div>
                </div>

                <div>
                  <Text strong>Ngôn ngữ:</Text>
                  <div style={{ marginTop: 8 }}>
                    {profileData.languages.map((lang, index) => (
                      <div key={index} style={{ marginBottom: 4 }}>
                        <Text>{lang.name}: </Text>
                        <Tag color="green">{lang.level}</Tag>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Certifications */}
          <Card title="Chứng chỉ và bằng cấp" style={{ marginTop: 24 }}>
            <List
              dataSource={profileData.certifications}
              renderItem={(cert, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<SafetyOutlined />}
                        style={{ backgroundColor: '#52c41a' }}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{cert.name}</Text>
                        <Tag color={cert.status === 'active' ? 'green' : 'red'}>
                          {cert.status === 'active'
                            ? 'Còn hiệu lực'
                            : 'Hết hiệu lực'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <Text>Cấp bởi: {cert.issuer}</Text>
                        <br />
                        <Text type="secondary">
                          Cấp ngày: {dayjs(cert.issueDate).format('DD/MM/YYYY')}{' '}
                          - Hết hạn:{' '}
                          {dayjs(cert.expiryDate).format('DD/MM/YYYY')}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Achievements */}
          <Card title="Thành tích và khen thưởng" style={{ marginTop: 24 }}>
            <Timeline
              items={profileData.achievements.map((achievement, index) => ({
                dot: <TrophyOutlined style={{ color: '#faad14' }} />,
                children: (
                  <div key={index}>
                    <Text strong>{achievement.title}</Text>
                    <br />
                    <Text type="secondary">
                      {dayjs(achievement.date).format('DD/MM/YYYY')}
                    </Text>
                    <br />
                    <Text>{achievement.description}</Text>
                  </div>
                ),
              }))}
            />
          </Card>

          {/* Recent Work History */}
          <Card title="Hoạt động gần đây" style={{ marginTop: 24 }}>
            <Timeline
              items={profileData.workHistory.map((activity, index) => ({
                dot:
                  activity.status === 'completed' ? (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  ) : (
                    <ClockCircleOutlined style={{ color: '#1890ff' }} />
                  ),
                children: (
                  <div key={index}>
                    <Text strong>{activity.activity}</Text>
                    <br />
                    <Text type="secondary">
                      {dayjs(activity.date).format('DD/MM/YYYY')} -{' '}
                      {activity.time}
                    </Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            Chỉnh sửa thông tin cá nhân
          </Space>
        }
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={updating}
        width={700}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Thông tin liên hệ khẩn cấp</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="emergencyContactName"
                label="Tên người liên hệ"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="emergencyContactPhone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="emergencyContactRelationship"
                label="Mối quan hệ"
                rules={[
                  { required: true, message: 'Vui lòng chọn mối quan hệ!' },
                ]}
              >
                <Select>
                  <Option value="Vợ/Chồng">Vợ/Chồng</Option>
                  <Option value="Con">Con</Option>
                  <Option value="Cha/Mẹ">Cha/Mẹ</Option>
                  <Option value="Anh/Chị/Em">Anh/Chị/Em</Option>
                  <Option value="Bạn">Bạn</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffProfile;
