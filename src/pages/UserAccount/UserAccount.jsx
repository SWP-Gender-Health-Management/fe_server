import api from '@/api/api';
import {
  CalendarOutlined,
  HeartOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '@context/AuthContext.jsx';
import { Card, Form, Input, message, Select, Tabs, Typography } from 'antd';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import './UserAccount.css';
import ConsultAppointmentsTab from './components/ConsultantAppointmentTab/ConsultAppointmentsTab';
import LabAppointmentsTab from './components/LabAppointmentTab/LabAppointmentsTab';
import PersonalInfoTab from './components/PersonalInfoTab/PersonalInfoTab';
import ProfileHeader from './components/ProfileHeader/ProfileHeader';
import SettingsTab from './components/SettingTab/SettingsTab';
import axios from 'axios';

// Đã xoá các import modal riêng biệt
// import './components/styles.css';

const API_URL = 'http://localhost:3000';
const accountId = await Cookies.get('accountId');
const accessToken = await Cookies.get('accessToken');

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
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
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
        const accountRes = await api.post(
          '/account/view-account',
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

        // Kiểm tra nếu tài khoản đăng nhập bằng Google
        if (accountData.is_google_account === true) {
          setIsGoogleAccount(true);
        }

        calculateProfileCompletion(accountData);

        // Lấy lịch hẹn tư vấn
        try {
          const appointmentRes = await api.get(
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
          setConApps(conAppsData);
          setConAppsPagination((prev) => ({
            ...prev,
            total: conAppsData.length,
          }));
        } catch (error) {
          if (error.response?.status === 404) {
            setConApps([]); 
          } else {
            console.error('Lỗi khi tải dữ liệu:', error);
            message.error('Lỗi khi tải lịch hẹn');
          }
        }

        try {
          // Lấy lịch hẹn xét nghiệm
          const labAppRes = await api.get(
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
          console.log('labAppData: ', labAppData);
          setLabApps(labAppData);
          setLabAppsPagination((prev) => ({
            ...prev,
            total: labAppData.length,
          }));
        } catch (error) {
          if (error.response?.status === 404) {
            setLabApps([]); // Không có lịch hẹn thì đặt mảng rỗng
          } else {
            console.error('Lỗi khi tải dữ liệu:', error);
            message.error('Lỗi khi tải lịch hẹn');
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        message.error('Không thể tải thông tin. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [isLoggedIn, form]);

  const fetchLabApp = async () => {
    try {
      // Lấy lịch hẹn xét nghiệm
      const labAppRes = await api.get(
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
    } catch (error) {
      if (error.response?.status === 404) {
        setLabApps([]); // Không có lịch hẹn thì đặt mảng rỗng
      } else {
        console.error('Lỗi khi tải dữ liệu:', error);
        message.error('Lỗi khi tải lịch hẹn');
      }
    }
  };

  const fetchConApp = async () => {
    try {
      const appointmentRes = await api.get(
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
      await setConApps(conAppsData);
      await setConAppsPagination((prev) => ({
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
  };

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
      const response = await api.post(
        '/account/update-profile',
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
    const accessToken = Cookies.get('accessToken');
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.post(
        '/account/update-avatar', // Giả định endpoint
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
      case 'pending_cancelled':
        return 'red';
      case 'confirm_cancelled':
        return 'red';
      case 'completed':
        return 'blue';
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
      case 'pending_cancelled':
        return 'Đã hủy';
      case 'confirmed_cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Đã hoàn thành';
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
      const response = await api.post(
        '/account/change-password',
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
      const response = await api.post(
        '/account/send-verification',
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
      const response = await api.post(
        '/account/verify-email',
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
      const response = await api.post(
        '/account/delete-account',
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
  const showConAppDetail = async (record) => {
    let feedback = null;
    console.log('record?.feed_id: ', record?.feed_id || 'Không có');
    if (record?.feed_id) {
      try {
        await axios
          .get(`${API_URL}/feedback/get-by-id-feedback/${record.feed_id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            feedback = response.data.result || null;
            setSelectedConApp({
              ...record,
              feedback,
            });
          });
      } catch (error) {
        console.error('Get feedback error: ', error);
        setSelectedConApp(record);
        feedback = null;
      } finally {
        setConAppDetailVisible(true);
      }
    } else {
      setSelectedConApp(record);
      setConAppDetailVisible(true);
    }
  };

  // Hàm hiển thị chi tiết lịch hẹn xét nghiệm
  // const showLabAppDetail = (record) => {
  //   setSelectedLabApp(record);
  //   setLabAppDetailVisible(true);
  // };
  const showLabAppDetail = async (record) => {
    let feedback = null;
    console.log('record?.feed_id: ', record?.feed_id || 'Không có');
    if (record?.feed_id) {
      try {
        await axios
          .get(`${API_URL}/feedback/get-by-id-feedback/${record.feed_id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            feedback = response.data.result || null;
            setSelectedLabApp({
              ...record,
              feedback,
            });
          });
      } catch (error) {
        console.error('Get feedback error: ', error);
        setSelectedLabApp(record);
        feedback = null;
      } finally {
        setLabAppDetailVisible(true);
      }
    } else {
      setSelectedLabApp(record);
      setLabAppDetailVisible(true);
    }
  };

  // Thay thế phần render:
  return (
    <div className="account-container">
      {/* Profile Header */}
      <ProfileHeader
        editedInfo={editedInfo}
        avatarUrl={avatarUrl}
        profileCompletion={profileCompletion}
        conApps={conApps}
        labApps={labApps}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleAvatarUpload={handleAvatarUpload}
      />

      {/* Main Content */}
      <Card className="main-content">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="account-tabs"
          items={[
            {
              key: '1',
              label: (
                <span>
                  <UserOutlined />
                  Thông tin cá nhân
                </span>
              ),
              children: (
                <PersonalInfoTab
                  form={form}
                  editedInfo={editedInfo}
                  isEditing={isEditing}
                  loading={loading}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                />
              ),
            },
            {
              key: '2',
              label: (
                <span>
                  <CalendarOutlined />
                  Lịch hẹn tư vấn ({conApps.length})
                </span>
              ),
              children: (
                <ConsultAppointmentsTab
                  fetchConApp={fetchConApp}
                  conApps={conApps}
                  conAppsPagination={conAppsPagination}
                  handleConAppsPaginationChange={handleConAppsPaginationChange}
                  showConAppDetail={showConAppDetail}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  conAppDetailVisible={conAppDetailVisible}
                  setConAppDetailVisible={setConAppDetailVisible}
                  selectedConApp={selectedConApp}
                  dayjs={dayjs}
                />
              ),
            },
            {
              key: '3',
              label: (
                <span>
                  <HeartOutlined />
                  Lịch hẹn xét nghiệm ({labApps.length})
                </span>
              ),
              children: (
                <LabAppointmentsTab
                  fetchLabApp={fetchLabApp}
                  labApps={labApps}
                  labAppsPagination={labAppsPagination}
                  handleLabAppsPaginationChange={handleLabAppsPaginationChange}
                  showLabAppDetail={showLabAppDetail}
                  labAppDetailVisible={labAppDetailVisible}
                  setLabAppDetailVisible={setLabAppDetailVisible}
                  selectedLabApp={selectedLabApp}
                  dayjs={dayjs}
                  message={message}
                />
              ),
            },
            {
              key: '4',
              label: (
                <span>
                  <SettingOutlined />
                  Cài đặt
                </span>
              ),
              children: (
                <SettingsTab
                  isGoogleAccount={isGoogleAccount}
                  setPasswordModalVisible={setPasswordModalVisible}
                  openEmailVerification={setEmailVerifyModalVisible}
                  setDeleteAccountModalVisible={setDeleteAccountModalVisible}
                  passwordModalVisible={passwordModalVisible}
                  passwordForm={passwordForm}
                  handlePasswordChange={handlePasswordChange}
                  loading={loading}
                  emailVerifyModalVisible={emailVerifyModalVisible}
                  verifyForm={verifyForm}
                  verifyEmail={verifyEmail}
                  verificationStatus={verificationStatus}
                  sendVerificationEmail={sendVerificationEmail}
                  setVerificationStatus={setVerificationStatus}
                  verificationSent={verificationSent}
                  deleteAccountModalVisible={deleteAccountModalVisible}
                  deleteAccount={deleteAccount}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default UserAccount;
