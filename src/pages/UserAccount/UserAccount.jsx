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
  const [appointmentsPagination, setAppointmentsPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [healthRecordsPagination, setHealthRecordsPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentDetailVisible, setAppointmentDetailVisible] =
    useState(false);
  const [selectedHealthRecord, setSelectedHealthRecord] = useState(null);
  const [healthRecordDetailVisible, setHealthRecordDetailVisible] =
    useState(false);

  // Mock data cho lịch hẹn tư vấn
  const mockAppointments = [
    {
      id: 'app-001',
      consultant_pattern: {
        id: 'cp-001',
        title: 'Tư vấn sức khỏe phụ nữ',
        description:
          'Tư vấn về các vấn đề sức khỏe phụ nữ, chu kỳ kinh nguyệt, kế hoạch hóa gia đình',
        working_slot: {
          date: '2023-07-15',
          time_slot: '09:00 - 10:00',
        },
        consultant: {
          id: 'cons-001',
          full_name: 'Bác sĩ Nguyễn Thị Hương',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          specialty: 'Sản phụ khoa',
        },
      },
      location: 'Phòng khám số 3, Tầng 2',
      status: 'confirmed',
      created_at: '2023-07-10',
    },
    {
      id: 'app-002',
      consultant_pattern: {
        id: 'cp-002',
        title: 'Tư vấn dinh dưỡng',
        description:
          'Tư vấn về chế độ ăn uống, dinh dưỡng cho phụ nữ mang thai và sau sinh',
        working_slot: {
          date: '2023-07-20',
          time_slot: '14:00 - 15:00',
        },
        consultant: {
          id: 'cons-002',
          full_name: 'Bác sĩ Trần Văn Nam',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          specialty: 'Dinh dưỡng',
        },
      },
      location: 'Online',
      status: 'pending',
      created_at: '2023-07-12',
    },
    {
      id: 'app-003',
      consultant_pattern: {
        id: 'cp-003',
        title: 'Tư vấn tâm lý',
        description: 'Tư vấn về các vấn đề tâm lý, stress, lo âu trong thai kỳ',
        working_slot: {
          date: '2023-07-25',
          time_slot: '10:00 - 11:00',
        },
        consultant: {
          id: 'cons-003',
          full_name: 'Bác sĩ Lê Thị Hà',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
          specialty: 'Tâm lý học',
        },
      },
      location: 'Phòng tư vấn số 5, Tầng 3',
      status: 'cancelled',
      created_at: '2023-07-14',
    },
    {
      id: 'app-004',
      consultant_pattern: {
        id: 'cp-004',
        title: 'Tư vấn sức khỏe sinh sản',
        description:
          'Tư vấn về các vấn đề sức khỏe sinh sản, vô sinh, hiếm muộn',
        working_slot: {
          date: '2023-08-05',
          time_slot: '15:00 - 16:00',
        },
        consultant: {
          id: 'cons-004',
          full_name: 'Bác sĩ Phạm Văn Hoàng',
          avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
          specialty: 'Sản phụ khoa',
        },
      },
      location: 'Phòng khám số 2, Tầng 1',
      status: 'confirmed',
      created_at: '2023-07-20',
    },
    {
      id: 'app-005',
      consultant_pattern: {
        id: 'cp-005',
        title: 'Tư vấn sau sinh',
        description:
          'Tư vấn về chăm sóc sau sinh, cho con bú, phục hồi sức khỏe',
        working_slot: {
          date: '2023-08-10',
          time_slot: '09:30 - 10:30',
        },
        consultant: {
          id: 'cons-001',
          full_name: 'Bác sĩ Nguyễn Thị Hương',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          specialty: 'Sản phụ khoa',
        },
      },
      location: 'Online',
      status: 'pending',
      created_at: '2023-07-25',
    },
    {
      id: 'app-006',
      consultant_pattern: {
        id: 'cp-006',
        title: 'Tư vấn kế hoạch hóa gia đình',
        description:
          'Tư vấn về các biện pháp tránh thai, kế hoạch hóa gia đình',
        working_slot: {
          date: '2023-08-15',
          time_slot: '13:30 - 14:30',
        },
        consultant: {
          id: 'cons-005',
          full_name: 'Bác sĩ Vũ Thị Lan',
          avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
          specialty: 'Sản phụ khoa',
        },
      },
      location: 'Phòng tư vấn số 1, Tầng 2',
      status: 'confirmed',
      created_at: '2023-07-30',
    },
  ];

  // Mock data cho lịch hẹn xét nghiệm
  const mockHealthRecords = [
    {
      id: 'hr-001',
      date: '2023-07-10',
      type: 'Xét nghiệm máu tổng quát',
      result: 'Bình thường',
      is_normal: true,
      notes: 'Các chỉ số trong giới hạn bình thường',
      tests: ['Công thức máu', 'Sinh hóa máu', 'Đường huyết', 'Chức năng gan'],
      indicators: [
        'Hồng cầu, Bạch cầu, Tiểu cầu',
        'AST, ALT, GGT',
        'HbA1c',
        'GOT, GPT',
      ],
      test_results: [
        'Bình thường',
        'Bình thường',
        'Bình thường',
        'Bình thường',
      ],
      test_is_normal: [true, true, true, true],
      test_values: [
        { value: '4.5', unit: 'x10^6/µL', min: '4.0', max: '5.5', percent: 50 },
        { value: '25', unit: 'U/L', min: '10', max: '40', percent: 50 },
        { value: '5.2', unit: '%', min: '4.0', max: '6.0', percent: 60 },
        { value: '30', unit: 'U/L', min: '10', max: '50', percent: 50 },
      ],
    },
    {
      id: 'hr-002',
      date: '2023-07-20',
      type: 'Xét nghiệm nước tiểu',
      result: 'Có bất thường',
      is_normal: false,
      notes: 'Phát hiện protein trong nước tiểu, cần theo dõi thêm',
      tests: ['Protein niệu', 'Đường niệu', 'pH nước tiểu'],
      indicators: ['Protein', 'Glucose', 'pH'],
      test_results: ['Cao', 'Bình thường', 'Bình thường'],
      test_is_normal: [false, true, true],
      test_values: [
        { value: '150', unit: 'mg/dL', min: '0', max: '20', percent: 95 },
        {
          value: 'Âm tính',
          unit: '',
          min: 'Âm tính',
          max: 'Âm tính',
          percent: 50,
        },
        { value: '6.0', unit: '', min: '4.5', max: '8.0', percent: 40 },
      ],
    },
    {
      id: 'hr-003',
      date: '2023-08-05',
      type: 'Xét nghiệm nội tiết',
      result: 'Bình thường',
      is_normal: true,
      notes: 'Các hormone trong giới hạn bình thường',
      tests: ['Hormone tuyến giáp', 'Estrogen', 'Progesterone', 'Testosterone'],
      indicators: ['TSH, T3, T4', 'Estradiol', 'Progesterone', 'Testosterone'],
      test_results: [
        'Bình thường',
        'Bình thường',
        'Bình thường',
        'Bình thường',
      ],
      test_is_normal: [true, true, true, true],
      test_values: [
        { value: '2.5', unit: 'mIU/L', min: '0.4', max: '4.0', percent: 70 },
        { value: '150', unit: 'pg/mL', min: '30', max: '400', percent: 40 },
        { value: '10', unit: 'ng/mL', min: '2', max: '25', percent: 35 },
        { value: '0.5', unit: 'ng/mL', min: '0.1', max: '0.8', percent: 50 },
      ],
    },
    {
      id: 'hr-004',
      date: '2023-08-15',
      type: 'Siêu âm vú',
      result: null,
      is_normal: null,
      notes: 'Đang chờ kết quả',
      tests: ['Siêu âm vú trái', 'Siêu âm vú phải'],
      indicators: ['Cấu trúc mô', 'Cấu trúc mô'],
      test_results: [null, null],
      test_is_normal: [null, null],
      test_values: null,
    },
    {
      id: 'hr-005',
      date: '2023-08-20',
      type: 'Xét nghiệm vitamin và khoáng chất',
      result: 'Có bất thường',
      is_normal: false,
      notes: 'Thiếu vitamin D, cần bổ sung',
      tests: ['Vitamin D', 'Vitamin B12', 'Sắt', 'Canxi', 'Kẽm'],
      indicators: ['25-OH-D', 'B12', 'Ferritin', 'Ca2+', 'Zn'],
      test_results: [
        'Thấp',
        'Bình thường',
        'Bình thường',
        'Bình thường',
        'Thấp',
      ],
      test_is_normal: [false, true, true, true, false],
      test_values: [
        { value: '15', unit: 'ng/mL', min: '30', max: '100', percent: 15 },
        { value: '500', unit: 'pg/mL', min: '200', max: '900', percent: 50 },
        { value: '100', unit: 'ng/mL', min: '20', max: '250', percent: 40 },
        { value: '9.5', unit: 'mg/dL', min: '8.5', max: '10.5', percent: 50 },
        { value: '60', unit: 'µg/dL', min: '70', max: '120', percent: 20 },
      ],
    },
  ];

  // Thêm thông tin kết quả tư vấn vào mock data
  const mockAppointmentsWithResults = mockAppointments.map((appointment) => {
    // Chỉ thêm kết quả cho các lịch hẹn đã xác nhận
    if (appointment.status === 'confirmed') {
      return {
        ...appointment,
        result: {
          summary: `Tóm tắt buổi tư vấn ${appointment.consultant_pattern.title} ngày ${dayjs(appointment.consultant_pattern.working_slot.date).format('DD/MM/YYYY')}`,
          diagnosis:
            'Chẩn đoán: ' +
            (appointment.id === 'app-001'
              ? 'Rối loạn nội tiết tố'
              : appointment.id === 'app-004'
                ? 'Thiếu hụt vitamin D'
                : 'Sức khỏe bình thường'),
          recommendations: [
            'Chế độ ăn uống cân bằng dinh dưỡng',
            'Tập thể dục đều đặn 30 phút mỗi ngày',
            'Uống đủ nước, ít nhất 2 lít mỗi ngày',
            appointment.id === 'app-001'
              ? 'Bổ sung vitamin E'
              : appointment.id === 'app-004'
                ? 'Bổ sung vitamin D3'
                : 'Giữ tinh thần thoải mái',
          ],
          next_steps:
            appointment.id === 'app-001'
              ? 'Tái khám sau 2 tuần'
              : appointment.id === 'app-004'
                ? 'Xét nghiệm lại sau 1 tháng'
                : 'Tái khám nếu có triệu chứng bất thường',
          notes:
            appointment.id === 'app-001'
              ? 'Cần theo dõi thêm về nồng độ hormone'
              : appointment.id === 'app-004'
                ? 'Cần bổ sung vitamin D3 liều cao trong 2 tuần đầu'
                : 'Không có ghi chú đặc biệt',
        },
      };
    }
    return appointment;
  });

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

        // Sử dụng mock data với kết quả thay vì gọi API
        setAppointments(mockAppointmentsWithResults);
        setAppointmentsPagination((prev) => ({
          ...prev,
          total: mockAppointmentsWithResults.length,
        }));

        setHealthRecords(mockHealthRecords);
        setHealthRecordsPagination((prev) => ({
          ...prev,
          total: mockHealthRecords.length,
        }));

        // Giữ lại code gọi API nhưng comment lại để sau này có thể dễ dàng khôi phục
        /*
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
          const appointmentsData = appointmentRes.data.result || [];
          setAppointments(appointmentsData);
          setAppointmentsPagination(prev => ({
            ...prev,
            total: appointmentsData.length
          }));
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
        const healthRecordsData = healthRes.data.result || [];
        setHealthRecords(healthRecordsData);
        setHealthRecordsPagination(prev => ({
          ...prev,
          total: healthRecordsData.length
        }));
        */
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

  // Hàm xử lý phân trang cho lịch hẹn tư vấn
  const handleAppointmentsPaginationChange = (page, pageSize) => {
    setAppointmentsPagination({
      ...appointmentsPagination,
      current: page,
      pageSize: pageSize,
    });
  };

  // Hàm xử lý phân trang cho lịch hẹn xét nghiệm
  const handleHealthRecordsPaginationChange = (page, pageSize) => {
    setHealthRecordsPagination({
      ...healthRecordsPagination,
      current: page,
      pageSize: pageSize,
    });
  };

  // Hàm hiển thị chi tiết lịch hẹn
  const showAppointmentDetail = (record) => {
    setSelectedAppointment(record);
    setAppointmentDetailVisible(true);
  };

  // Hàm hiển thị chi tiết lịch hẹn xét nghiệm
  const showHealthRecordDetail = (record) => {
    setSelectedHealthRecord(record);
    setHealthRecordDetailVisible(true);
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

  // Columns cho bảng lịch hẹn tư vấn
  const appointmentColumns = [
    {
      title: 'Ngày hẹn',
      dataIndex: 'date',
      key: 'date',
      render: (_, record) => (
        <div className="appointment-date">
          <CalendarOutlined className="date-icon" />
          <div>
            <div className="date">
              {dayjs(record.consultant_pattern?.working_slot?.date).format(
                'DD/MM/YYYY'
              )}
            </div>
            <div className="time">
              {record.consultant_pattern?.working_slot?.time_slot || 'Không rõ'}
            </div>
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
            src={record.consultant_pattern?.consultant?.avatar}
          />
          <span className="consultant-name">
            {record.consultant_pattern?.consultant?.full_name ||
              'Chưa xác định'}
          </span>
        </div>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
      render: (_, record) => (
        <Tooltip title={record.consultant_pattern?.description || ''}>
          <span>{record.consultant_pattern?.title || 'Tư vấn'}</span>
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
            onClick={() => showAppointmentDetail(record)}
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
  const healthRecordColumns = [
    {
      title: 'Ngày xét nghiệm',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <div className="health-record-date">
          <CalendarOutlined className="date-icon" />
          <span>{dayjs(text).format('DD/MM/YYYY')}</span>
        </div>
      ),
    },
    {
      title: 'Loại xét nghiệm',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => (
        <div>
          <FileTextOutlined />
          <span style={{ marginLeft: 8 }}>{text}</span>
          {record.tests && record.tests.length > 0 && (
            <Dropdown
              overlay={
                <Menu>
                  {record.tests.map((test, index) => (
                    <Menu.Item key={index}>
                      <div className="test-dropdown-item">
                        <span>{test}</span>
                        {record.test_results && record.test_results[index] && (
                          <Tag
                            color={
                              record.test_is_normal &&
                              record.test_is_normal[index]
                                ? 'success'
                                : 'error'
                            }
                            style={{ marginLeft: 8 }}
                          >
                            {record.test_results[index]}
                          </Tag>
                        )}
                      </div>
                    </Menu.Item>
                  ))}
                </Menu>
              }
              trigger={['click']}
            >
              <Badge
                count={record.tests.length}
                style={{
                  backgroundColor: '#1890ff',
                  marginLeft: 8,
                  cursor: 'pointer',
                }}
              />
            </Dropdown>
          )}
        </div>
      ),
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      render: (text, record) => {
        if (!text) return <Tag color="processing">Đang xử lý</Tag>;

        const resultColor = record.is_normal ? 'success' : 'error';
        const resultIcon = record.is_normal ? (
          <CheckCircleOutlined />
        ) : (
          <ExclamationCircleOutlined />
        );

        return (
          <Tag color={resultColor} icon={resultIcon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text || 'Không có ghi chú'}>
          <span>{text || 'Không có ghi chú'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          disabled={!record.result}
          onClick={() => showHealthRecordDetail(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const appointmentsTab = (
    <div className="tab-content">
      <div className="appointments-table-container">
        <Table
          dataSource={appointments}
          columns={appointmentColumns}
          rowKey={(record) => record.id || Math.random().toString()}
          pagination={{
            current: appointmentsPagination.current,
            pageSize: appointmentsPagination.pageSize,
            total: appointmentsPagination.total,
            onChange: handleAppointmentsPaginationChange,
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

  const healthRecordsTab = (
    <div className="tab-content">
      <div className="health-records-table-container">
        <Table
          dataSource={healthRecords}
          columns={healthRecordColumns}
          rowKey={(record) => record.id || Math.random().toString()}
          pagination={{
            current: healthRecordsPagination.current,
            pageSize: healthRecordsPagination.pageSize,
            total: healthRecordsPagination.total,
            onChange: handleHealthRecordsPaginationChange,
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
          // expandable={{
          //   expandedRowRender: (record) => (
          //     <div className="health-record-details">
          //       <Title level={5}>Chi tiết xét nghiệm</Title>
          //       <Row gutter={[16, 16]}>
          //         {record.tests &&
          //           record.tests.map((test, index) => (
          //             <Col xs={24} sm={12} md={8} key={index}>
          //               <Card size="small" title={test}>
          //                 <p>
          //                   <strong>Chỉ số:</strong>{' '}
          //                   {record.indicators?.[index] || 'Chưa có'}
          //                 </p>
          //                 <p>
          //                   <strong>Kết quả:</strong>{' '}
          //                   {record.test_results?.[index] || 'Đang xử lý'}
          //                 </p>
          //                 <p>
          //                   <strong>Trạng thái:</strong>{' '}
          //                   <Tag
          //                     color={
          //                       record.test_is_normal?.[index]
          //                         ? 'success'
          //                         : 'error'
          //                     }
          //                   >
          //                     {record.test_is_normal?.[index]
          //                       ? 'Bình thường'
          //                       : 'Bất thường'}
          //                   </Tag>
          //                 </p>
          //               </Card>
          //             </Col>
          //           ))}
          //       </Row>
          //     </div>
          //   ),
          //   rowExpandable: (record) => record.tests && record.tests.length > 0,
          // }}
        />
      </div>
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

      {/* Modal Chi tiết kết quả tư vấn */}
      <Modal
        title={
          <div className="appointment-detail-title">
            <div>Chi tiết kết quả tư vấn</div>
            {selectedAppointment && (
              <Tag color={getStatusColor(selectedAppointment.status)}>
                {getStatusText(selectedAppointment.status)}
              </Tag>
            )}
          </div>
        }
        open={appointmentDetailVisible}
        onCancel={() => setAppointmentDetailVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setAppointmentDetailVisible(false)}
          >
            Đóng
          </Button>,
        ]}
        width={700}
        className="appointment-detail-modal"
      >
        {selectedAppointment && (
          <div className="appointment-detail-content">
            <Descriptions title="Thông tin buổi tư vấn" bordered column={2}>
              <Descriptions.Item label="Chuyên gia" span={2}>
                <div className="consultant-info">
                  <Avatar
                    size={64}
                    src={
                      selectedAppointment.consultant_pattern?.consultant?.avatar
                    }
                    icon={<UserOutlined />}
                  />
                  <div className="consultant-details">
                    <div className="consultant-name">
                      {
                        selectedAppointment.consultant_pattern?.consultant
                          ?.full_name
                      }
                    </div>
                    <div className="consultant-specialty">
                      {
                        selectedAppointment.consultant_pattern?.consultant
                          ?.specialty
                      }
                    </div>
                  </div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Dịch vụ">
                {selectedAppointment.consultant_pattern?.title}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {dayjs(
                  selectedAppointment.consultant_pattern?.working_slot?.date
                ).format('DD/MM/YYYY')}{' '}
                {
                  selectedAppointment.consultant_pattern?.working_slot
                    ?.time_slot
                }
              </Descriptions.Item>
              <Descriptions.Item label="Địa điểm">
                {selectedAppointment.location}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedAppointment.status)}>
                  {getStatusText(selectedAppointment.status)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {selectedAppointment.result ? (
              <div className="appointment-result">
                <Title level={4}>Kết quả tư vấn</Title>
                <Paragraph>{selectedAppointment.result.summary}</Paragraph>
                <Paragraph strong>
                  {selectedAppointment.result.diagnosis}
                </Paragraph>

                <Title level={5}>Khuyến nghị</Title>
                <ul className="recommendation-list">
                  {selectedAppointment.result.recommendations.map(
                    (rec, index) => (
                      <li key={index}>{rec}</li>
                    )
                  )}
                </ul>

                <Row gutter={16}>
                  <Col span={12}>
                    <Card
                      size="small"
                      title="Bước tiếp theo"
                      className="next-steps-card"
                    >
                      <Paragraph>
                        {selectedAppointment.result.next_steps}
                      </Paragraph>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" title="Ghi chú" className="notes-card">
                      <Paragraph>{selectedAppointment.result.notes}</Paragraph>
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
          <div className="health-record-detail-title">
            <div>Chi tiết kết quả xét nghiệm</div>
            {selectedHealthRecord && (
              <Tag
                color={selectedHealthRecord.is_normal ? 'success' : 'error'}
                icon={
                  selectedHealthRecord.is_normal ? (
                    <CheckCircleOutlined />
                  ) : (
                    <ExclamationCircleOutlined />
                  )
                }
              >
                {selectedHealthRecord.is_normal
                  ? 'Bình thường'
                  : 'Có bất thường'}
              </Tag>
            )}
          </div>
        }
        open={healthRecordDetailVisible}
        onCancel={() => setHealthRecordDetailVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setHealthRecordDetailVisible(false)}
          >
            Đóng
          </Button>,
        ]}
        width={800}
        className="health-record-detail-modal"
      >
        {selectedHealthRecord && (
          <div className="health-record-detail-content">
            <Descriptions title="Thông tin xét nghiệm" bordered column={2}>
              <Descriptions.Item label="Loại xét nghiệm" span={2}>
                {selectedHealthRecord.type}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày xét nghiệm">
                {dayjs(selectedHealthRecord.date).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Kết quả tổng quát">
                <Tag
                  color={selectedHealthRecord.is_normal ? 'success' : 'error'}
                  icon={
                    selectedHealthRecord.is_normal ? (
                      <CheckCircleOutlined />
                    ) : (
                      <ExclamationCircleOutlined />
                    )
                  }
                >
                  {selectedHealthRecord.result || 'Đang xử lý'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {selectedHealthRecord.notes || 'Không có ghi chú'}
              </Descriptions.Item>
            </Descriptions>

            <div className="test-results-section">
              <Title level={4}>Chi tiết các xét nghiệm</Title>

              <Row gutter={[16, 16]}>
                {selectedHealthRecord.tests &&
                  selectedHealthRecord.tests.map((test, index) => (
                    <Col xs={24} sm={12} md={8} key={index}>
                      <Card
                        className="test-result-card"
                        title={
                          <div className="test-card-title">
                            <span>{test}</span>
                            {selectedHealthRecord.test_results &&
                              selectedHealthRecord.test_results[index] && (
                                <Tag
                                  color={
                                    selectedHealthRecord.test_is_normal &&
                                    selectedHealthRecord.test_is_normal[index]
                                      ? 'success'
                                      : 'error'
                                  }
                                >
                                  {selectedHealthRecord.test_results[index]}
                                </Tag>
                              )}
                          </div>
                        }
                      >
                        <div className="test-indicator">
                          <div className="indicator-label">
                            <span>Chỉ số:</span>
                            <span>
                              {selectedHealthRecord.indicators?.[index] ||
                                'Chưa có'}
                            </span>
                          </div>

                          {selectedHealthRecord.test_results &&
                          selectedHealthRecord.test_results[index] ? (
                            <div className="indicator-result">
                              <div className="result-label">
                                <span>Kết quả:</span>
                                <span>
                                  {selectedHealthRecord.test_results[index]}
                                </span>
                              </div>

                              <div className="result-status">
                                <span>Trạng thái:</span>
                                <Tag
                                  color={
                                    selectedHealthRecord.test_is_normal?.[index]
                                      ? 'success'
                                      : 'error'
                                  }
                                >
                                  {selectedHealthRecord.test_is_normal?.[index]
                                    ? 'Bình thường'
                                    : 'Bất thường'}
                                </Tag>
                              </div>

                              {selectedHealthRecord.test_values &&
                                selectedHealthRecord.test_values[index] && (
                                  <div className="result-progress">
                                    <Progress
                                      percent={
                                        selectedHealthRecord.test_values[index]
                                          .percent
                                      }
                                      status={
                                        selectedHealthRecord.test_is_normal?.[
                                          index
                                        ]
                                          ? 'success'
                                          : 'exception'
                                      }
                                      strokeWidth={8}
                                      format={() =>
                                        `${selectedHealthRecord.test_values[index].value} ${selectedHealthRecord.test_values[index].unit}`
                                      }
                                    />
                                    <div className="range-labels">
                                      <span>
                                        Min:{' '}
                                        {
                                          selectedHealthRecord.test_values[
                                            index
                                          ].min
                                        }
                                      </span>
                                      <span>
                                        Max:{' '}
                                        {
                                          selectedHealthRecord.test_values[
                                            index
                                          ].max
                                        }
                                      </span>
                                    </div>
                                  </div>
                                )}
                            </div>
                          ) : (
                            <div className="processing-status">
                              <Spin size="small" />
                              <span>Đang xử lý kết quả</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    </Col>
                  ))}
              </Row>

              {(!selectedHealthRecord.tests ||
                selectedHealthRecord.tests.length === 0) && (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Không có chi tiết xét nghiệm"
                />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserAccount;
