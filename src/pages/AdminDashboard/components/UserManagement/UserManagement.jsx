import React, { useState } from 'react';
import './UserManagement.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000';
const accessToken = Cookies.get('accessToken');
const accountId = Cookies.get('accountId');

const UserManagement = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
    password: '@swp391fpt',
    confirmPassword: '@swp391fpt',
    is_banned: 'false',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const roles = [
    {
      value: 'ADMIN',
      label: 'Admin',
      description: 'Quyền quản trị toàn hệ thống',
    },
    {
      value: 'MANAGER',
      label: 'Manager',
      description: 'Quản lý dịch vụ và nhân viên',
    },
    {
      value: 'STAFF',
      label: 'Staff',
      description: 'Nhân viên hỗ trợ khách hàng',
    },
    {
      value: 'CONSULTANT',
      label: 'Consultant',
      description: 'Chuyên viên tư vấn',
    },
    {
      value: 'CUSTOMER',
      label: 'Customer',
      description: 'Khách hàng sử dụng dịch vụ',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generatePassword = () => {
    const defaultPassword = '@swp391fpt';
    setFormData((prev) => ({
      ...prev,
      password: defaultPassword,
      confirmPassword: defaultPassword,
    }));
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      return 'Vui lòng nhập họ tên';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Vui lòng nhập email hợp lệ';
    }
    // if (!formData.phone.trim() || !/^[0-9]{10,11}$/.test(formData.phone)) {
    //   return 'Vui lòng nhập số điện thoại hợp lệ';
    // }
    if (!formData.password.trim() || formData.password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Mật khẩu xác nhận không khớp';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("REques form of create-account: ", formData)
      await axios.post(`${API_URL}/admin/create-account`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      ).then((response) => {
        console.log('create-account response: ', response.data);
      });


      setMessage({
        type: 'success',
        text: `Đã tạo thành công tài khoản ${formData.role} cho ${formData.full_name}`,
      });

      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        role: 'CUSTOMER',
        password: '@swp391fpt',
        confirmPassword: '@swp391fpt',
        is_banned: 'false',
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi tạo tài khoản' });
      console.error('create-account error', error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>Thêm người dùng mới</h1>
        <p>Tạo tài khoản cho admin, manager, staff, consultant hoặc CUSTOMER</p>
      </div>

      <div className="user-form-container">
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-section">
            <h2>Thông tin cá nhân</h2>

            <div className="form-group">
              <label htmlFor="full_name">Họ và tên *</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên đầy đủ"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@domain.com"
                  required
                />
              </div>

              {/* <div className="form-group">
                <label htmlFor="phone">Số điện thoại *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="0123456789"
                  required
                />
              </div> */}
            </div>
          </div>

          <div className="form-section">
            <h2>Thông tin tài khoản</h2>

            <div className="form-group">
              <label htmlFor="role">Vai trò *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Mật khẩu *</label>
                <div className="password-input">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    className="generate-password-btn"
                    onClick={generatePassword}
                  >
                    Mật khẩu mặc định
                  </button>
                </div>
                <small className="password-note">
                  Mật khẩu mặc định: @swp391fpt
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>
            </div>
            {/* <div className="form-group">
              <label htmlFor="is_banned">Trạng thái tài khoản</label>
              <select
                id="is_banned"
                name="is_banned"
                value={formData.is_banned}
                onChange={handleInputChange}
              >
                <option value="false">Hoạt động</option>
                <option value="true">Tạm khóa</option>
              </select>
            </div> */}
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setFormData({
                  full_name: '',
                  email: '',
                  phone: '',
                  role: 'CUSTOMER',
                  password: '@swp391fpt',
                  confirmPassword: '@swp391fpt',
                  is_banned: 'false',
                });
                setMessage({ type: '', text: '' });
              }}
            >
              Làm mới
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>

        <div className="role-info">
          <h3>Thông tin vai trò</h3>
          <div className="role-cards">
            {roles.map((role) => (
              <div key={role.value} className="role-card">
                <h4>{role.label}</h4>
                <p>{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
