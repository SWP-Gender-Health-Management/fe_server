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
  Pagination,
  Table,
  Tooltip,
  Empty,
  Descriptions,
  Timeline,
  Dropdown,
  Menu,
  Spin,
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
  PrinterOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useAuth } from '@context/AuthContext.jsx';
import dayjs from 'dayjs';
import Cookies from 'js-cookie'; // nhớ import nếu chưa có
import './UserAccount.css';

const API_URL = 'http://localhost:3000';

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
  const [conApps, setConApps] = useState([]);
  const [labApps, setLabApps] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(''); // State để lưu URL avatar
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [emailVerifyModalVisible, setEmailVerifyModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] =
    useState(false);
  const [passwordForm] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // null, 'success', 'error'
  const [conAppsPagination, setConAppsPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [labAppsPagination, setLabAppsPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [selectedConApp, setSelectedConApp] = useState(null);
  const [conAppDetailVisible, setConAppDetailVisible] = useState(false);
  const [selectedLabApp, setSelectedLabApp] = useState(null);
  const [labAppDetailVisible, setLabAppDetailVisible] = useState(false);

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
          `${API_URL}/account/view-account`,
          {
            /*account_id: accountId 
            account_id: sẽ được lấy từ access token khi decode chứ ko phải là truyền vô
            */
          },
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

        // Lấy lịch hẹn tư vấn
        try {
          const appointmentRes = await axios.get(
            `${API_URL}/consult-appointment/customer/get-con-apps-by-id`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            },
            {}
          );
          const conAppsData = appointmentRes.data.result.conApp || [];
          // const totalPages = appointmentRes.data.pages || 1;
          setConApps(conAppsData);
          setConAppsPagination((prev) => ({
            ...prev,
            total: conAppsData.length,
          }));
        } catch (error) {
          if (error.response?.status === 404) {
            setConApps([]); // Không có lịch hẹn thì đặt mảng rỗng
          } else {
            console.error('Lỗi khi tải dữ liệu:', error);
            message.error('Lỗi khi tải lịch hẹn');
          }
        }

        // Lấy lịch hẹn xét nghiệm
        const labAppRes = await axios.get(
          `${API_URL}/customer/get-laborarity-appointments`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
          {}
        );
        const labAppData = labAppRes.data.result.labApp || [];
        console.log(labAppData);
        setLabApps(labAppData);
        setLabAppsPagination((prev) => ({
          ...prev,
          total: labAppData.length,
        }));
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        message.error('Không thể tải thông tin. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [isLoggedIn, form]);

  // Tính toán tỷ lệ hoàn thành hồ sơ
  const calculateProfileCompletion = (data) => {
    const fields = [
      'full_name',
      'email',
      'phone',
      'dob',
      'gender',
      'address',
      'description',
    ];
    const completed = fields.filter((field) => {
      const value = data[field];
      if (value == null) return false;
      if (typeof value === 'string') return value.trim() !== '';
      return true; // chấp nhận cả object như Date hoặc enum
    }).length;
    const percentage = Math.round((completed / fields.length) * 100);
    setProfileCompletion(percentage);
  };

  // Xử lý lưu thông tin
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

  // Xử lý hủy thay đổi
  const handleCancel = () => {
    form.setFieldsValue(editedInfo);
    setIsEditing(false);
  };

  // Xử lý upload ảnh đại diện
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

  // Hàm lấy màu sắc cho trạng thái lịch hẹn
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

  // Hàm lấy văn bản cho trạng thái lịch hẹn
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

  // Hàm xử lý phân trang cho lịch hẹn tư vấn
  const handleConAppsPaginationChange = (page, pageSize) => {
    setConAppsPagination({
      ...conAppsPagination,
      current: page,
      pageSize: pageSize,
    });
  };

  // Hàm xử lý phân trang cho lịch hẹn xét nghiệm
  const handleLabAppsPaginationChange = (page, pageSize) => {
    setLabAppsPagination({
      ...labAppsPagination,
      current: page,
      pageSize: pageSize,
    });
  };

  // Hàm hiển thị chi tiết lịch hẹn
  const showConAppDetail = (record) => {
    setSelectedConApp(record);
    setConAppDetailVisible(true);
  };

  // Hàm hiển thị chi tiết lịch hẹn xét nghiệm
  const showLabAppDetail = (record) => {
    setSelectedLabApp(record);
    setLabAppDetailVisible(true);
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="account-container">
        <div className="loading-container">
          <Title level={4}>Đang tải thông tin tài khoản...</Title>
        </div>
      </div>
    );
  }

  // Hiển thị thông tin cá nhân
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
                { required: false, message: 'Vui lòng nhập số điện thoại' },
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
            <Form.Item label="Ghi chú sức khỏe" name="description">
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

  // Columns cho bảng lịch hẹn tư vấn
  const conAppColumns = [
    {
      title: 'Ngày hẹn',
      dataIndex: 'date',
      key: 'date',
      render: (_, record) => (
        <div className="appointment-date">
          <CalendarOutlined className="date-icon" />
          <div>
            <div className="date">
              {dayjs(record.date).format('DD/MM/YYYY')}
            </div>
            <div className="time">{record.time || 'Không rõ'}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Chuyên gia',
      dataIndex: 'consultant',
      key: 'consultant',
      render: (_, record) => (
        <div className="appointment-consultant">
          <Avatar
            size="small"
            icon={<UserOutlined />}
            src={record.consultant_avatar}
          />
          <span className="consultant-name">
            {record.consultant || 'Chưa xác định'}
          </span>
        </div>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
      render: (_, record) => (
        <Tooltip title={record.description || ''}>
          <span>{record.description || 'Tư vấn'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      render: (_, record) => (
        <div className="appointment-location">
          <EnvironmentOutlined />
          <span>{record.location || 'Online'}</span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>
          {getStatusText(record.status)}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => showConAppDetail(record)}
            disabled={record.status !== 'confirmed'}
          >
            Chi tiết
          </Button>
          {record.status === 'pending' && (
            <Button type="link" size="small" danger>
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Columns cho bảng lịch hẹn xét nghiệm
  const labAppColumns = [
    {
      title: 'Ngày hẹn',
      dataIndex: 'date',
      key: 'date',
      render: (_, record) => (
        <div className="appointment-date">
          <CalendarOutlined className="date-icon" />
          <div>
            <div className="date">
              {dayjs(record.date).format('DD/MM/YYYY')}
            </div>
            <div className="time">{record.time || 'Không rõ'}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Loại xét nghiệm',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <div>
          <FileTextOutlined />
          <span style={{ marginLeft: 8 }}>{text || 'Xét nghiệm'}</span>
          {record.result && record.result.length > 0 && (
            <Badge
              count={record.result.length}
              style={{ backgroundColor: '#1890ff', marginLeft: 8 }}
              title={`${record.result.length} xét nghiệm`}
            />
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let text = 'Chưa xác định';

        switch (status) {
          case 'pending':
            color = 'warning';
            text = 'Đang chờ';
            break;
          case 'processing':
            color = 'processing';
            text = 'Đang xử lý';
            break;
          case 'completed':
            color = 'success';
            text = 'Hoàn thành';
            break;
          case 'cancelled':
            color = 'error';
            text = 'Đã hủy';
            break;
          default:
            color = 'default';
            text = 'Chưa xác định';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          disabled={record.status !== 'completed'}
          onClick={() => showLabAppDetail(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  // Hiển thị bảng lịch hẹn tư vấn
  const conAppsTab = (
    <div className="tab-content">
      <div className="appointments-table-container">
        <Table
          dataSource={conApps}
          columns={conAppColumns}
          rowKey={(record) => record.id || Math.random().toString()}
          pagination={{
            current: conAppsPagination.current,
            pageSize: conAppsPagination.pageSize,
            total: conAppsPagination.total,
            onChange: handleConAppsPaginationChange,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showTotal: (total) => `Tổng ${total} lịch hẹn`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Bạn chưa có lịch hẹn tư vấn nào"
              />
            ),
          }}
        />
      </div>
    </div>
  );

  // Hiển thị bảng lịch hẹn xét nghiệm
  const labAppTab = (
    <div className="tab-content">
      <div className="lab-apps-table-container">
        <Table
          dataSource={labApps}
          columns={labAppColumns}
          rowKey={(record) => record.id || Math.random().toString()}
          pagination={{
            current: labAppsPagination.current,
            pageSize: labAppsPagination.pageSize,
            total: labAppsPagination.total,
            onChange: handleLabAppsPaginationChange,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showTotal: (total) => `Tổng ${total} lịch hẹn xét nghiệm`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Bạn chưa có lịch hẹn xét nghiệm nào"
              />
            ),
          }}
        />
      </div>
    </div>
  );

  // Hiển thị tab cài đặt
  const settingsTab = (
    <div className="tab-content">
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

  // Hiển thị tab
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
          Lịch hẹn tư vấn ({conApps.length})
        </span>
      ),
      children: conAppsTab,
    },
    {
      key: '3',
      label: (
        <span>
          <HeartOutlined />
          Lịch hẹn xét nghiệm ({labApps.length})
        </span>
      ),
      children: labAppTab,
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
                    value={conApps.length}
                    prefix={<CalendarOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Hồ sơ"
                    value={labApps.length}
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

      {/* Modal Chi tiết kết quả tư vấn */}
      <Modal
        title={
          <div className="appointment-detail-title">
            <div>Chi tiết kết quả tư vấn</div>
            {selectedConApp && (
              <Tag color={getStatusColor(selectedConApp.status)}>
                {getStatusText(selectedConApp.status)}
              </Tag>
            )}
          </div>
        }
        open={conAppDetailVisible}
        onCancel={() => setConAppDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setConAppDetailVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
        className="appointment-detail-modal"
      >
        {selectedConApp && (
          <div className="appointment-detail-content">
            <Descriptions title="Thông tin buổi tư vấn" bordered column={2}>
              <Descriptions.Item label="Chuyên gia" span={2}>
                <div className="consultant-info">
                  <Avatar
                    size={64}
                    src={selectedConApp.consultant_pattern?.consultant?.avatar}
                    icon={<UserOutlined />}
                  />
                  <div className="consultant-details">
                    <div className="consultant-name">
                      {selectedConApp.consultant_pattern?.consultant?.full_name}
                    </div>
                    <div className="consultant-specialty">
                      {selectedConApp.consultant_pattern?.consultant?.specialty}
                    </div>
                  </div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Dịch vụ">
                {selectedConApp.consultant_pattern?.title}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {dayjs(
                  selectedConApp.consultant_pattern?.working_slot?.date
                ).format('DD/MM/YYYY')}{' '}
                {selectedConApp.consultant_pattern?.working_slot?.time_slot}
              </Descriptions.Item>
              <Descriptions.Item label="Địa điểm">
                {selectedConApp.location}
              </Descriptions.Item>
            </Descriptions>

            {selectedConApp.result ? (
              <div className="appointment-result">
                <Title level={4}>Kết quả tư vấn</Title>
                <Paragraph>{selectedConApp.result.summary}</Paragraph>
                <Paragraph strong>{selectedConApp.result.diagnosis}</Paragraph>

                <Title level={5}>Khuyến nghị</Title>
                <ul className="recommendation-list">
                  {selectedConApp.result.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>

                <Row gutter={16}>
                  <Col span={12}>
                    <Card
                      size="small"
                      title="Bước tiếp theo"
                      className="next-steps-card"
                    >
                      <Paragraph>{selectedConApp.result.next_steps}</Paragraph>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" title="Ghi chú" className="notes-card">
                      <Paragraph>{selectedConApp.result.notes}</Paragraph>
                    </Card>
                  </Col>
                </Row>
              </div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có kết quả tư vấn"
              />
            )}
          </div>
        )}
      </Modal>

      {/* Modal Chi tiết kết quả xét nghiệm */}
      <Modal
        title={
          <div className="lab-app-detail-title">
            <div>Chi tiết kết quả xét nghiệm</div>
            {selectedLabApp && (
              <Tag
                color={
                  selectedLabApp.status === 'completed'
                    ? 'success'
                    : 'processing'
                }
                icon={
                  selectedLabApp.status === 'completed' ? (
                    <CheckCircleOutlined />
                  ) : (
                    <ClockCircleOutlined />
                  )
                }
              >
                {selectedLabApp.status === 'completed'
                  ? 'Hoàn thành'
                  : 'Đang xử lý'}
              </Tag>
            )}
          </div>
        }
        open={labAppDetailVisible}
        onCancel={() => setLabAppDetailVisible(false)}
        footer={[
          <Space key="actions">
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              In kết quả
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() =>
                message.success('Tính năng đang phát triển. Sẽ sớm có mặt!')
              }
            >
              Tải PDF
            </Button>
            <Button onClick={() => setLabAppDetailVisible(false)}>Đóng</Button>
          </Space>,
        ]}
        width={800}
        className="lab-app-detail-modal"
      >
        {selectedLabApp && (
          <div className="lab-app-detail-content">
            <Descriptions title="Thông tin xét nghiệm" bordered column={2}>
              <Descriptions.Item label="Ngày xét nghiệm" span={1}>
                <CalendarOutlined style={{ marginRight: 8 }} />
                {dayjs(selectedLabApp.date).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian" span={1}>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                {selectedLabApp.time || 'Không có thông tin'}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                <FileTextOutlined style={{ marginRight: 8 }} />
                {selectedLabApp.description || 'Không có mô tả'}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="test-results-section">
              <Title level={4}>Chi tiết các xét nghiệm</Title>

              {selectedLabApp.result && selectedLabApp.result.length > 0 ? (
                <Table
                  dataSource={selectedLabApp.result.map((test) => ({
                    key: test.result_id,
                    name: test.name,
                    result: test.result,
                    unit: test.unit,
                    normal_range: test.normal_range,
                    conclusion: test.conclusion,
                    created_at: test.created_at,
                    updated_at: test.updated_at,
                  }))}
                  columns={[
                    {
                      title: 'Tên xét nghiệm',
                      dataIndex: 'name',
                      key: 'name',
                      width: '25%',
                    },
                    {
                      title: 'Kết quả',
                      dataIndex: 'result',
                      key: 'result',
                      width: '15%',
                      render: (text, record) => (
                        <span>
                          {text} {record.unit}
                        </span>
                      ),
                    },
                    {
                      title: 'Khoảng tham chiếu',
                      dataIndex: 'normal_range',
                      key: 'normal_range',
                      width: '20%',
                    },
                    {
                      title: 'Kết luận',
                      dataIndex: 'conclusion',
                      key: 'conclusion',
                      width: '40%',
                      render: (text) => (
                        <div style={{ whiteSpace: 'pre-line' }}>{text}</div>
                      ),
                    },
                  ]}
                  pagination={false}
                  bordered
                  size="middle"
                  className="test-results-table"
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Không có chi tiết xét nghiệm"
                />
              )}
            </div>

            <Divider />

            <div className="lab-results-footer">
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Card
                    size="small"
                    title="Lưu ý quan trọng"
                    className="note-card"
                  >
                    <ul>
                      <li>
                        Kết quả xét nghiệm chỉ có giá trị tham khảo và cần được
                        bác sĩ đánh giá.
                      </li>
                      <li>
                        Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với bác sĩ
                        hoặc nhân viên y tế.
                      </li>
                      <li>
                        Đề nghị tái khám định kỳ theo chỉ định của bác sĩ.
                      </li>
                    </ul>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" title="Hỗ trợ" className="support-card">
                    <p>
                      Nếu bạn cần giải thích thêm về kết quả xét nghiệm, vui
                      lòng:
                    </p>
                    <Space>
                      <Button type="primary">Đặt lịch tư vấn</Button>
                      <Button>Gọi hỗ trợ</Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserAccount;
