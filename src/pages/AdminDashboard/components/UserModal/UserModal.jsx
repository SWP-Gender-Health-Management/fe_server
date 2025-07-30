import React, { useState, useEffect } from 'react';
import './UserModal.css';

const UserModal = ({ mode, user, onClose, onSave, onEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'active',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    id: '',
    password: '',
    gg_meet_link: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && mode !== 'create') {
      setFormData({
        name: user.full_name || '',
        email: user.email || '',
        role: user.role || 'CUSTOMER',
        status: (user.is_banned ? 'banned' : 'active'),
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dob || '',
        gender: user.gender || '',
        id: user.account_id,
        description: user.description || '',
        gg_meet_link: user.staff_profile?.gg_meet || '',
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        email: '',
        role: 'CUSTOMER',
        status: 'active',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        password: '',
        gg_meet_link: '',
        description: '',
      });
    }
  }, [user, mode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.phone && !/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave(formData);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return 'Thêm người dùng mới';
      case 'edit':
        return 'Chỉnh sửa người dùng';
      case 'view':
        return 'Chi tiết người dùng';
      default:
        return 'Thông tin người dùng';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getModalTitle()}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3>Thông tin cơ bản</h3>

              <div className="form-group">
                <label htmlFor="name">
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  className={errors.name ? 'error' : ''}
                  placeholder="Nhập họ và tên"
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  className={errors.email ? 'error' : ''}
                  placeholder="Nhập địa chỉ email"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="role">Vai trò</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                    <option value="CONSULTANT">Consultant</option>
                    <option value="STAFF">Staff</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Trạng thái</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="banned">Bị khóa</option>
                  </select>
                </div>

                {user.role === 'CONSULTANT' && (
                  <div className="form-group">
                    <label htmlFor="gg_meet_link">Link Google Meet</label>
                    <input
                      id="gg_meet_link"
                      name="gg_meet_link"
                      value={formData.gg_meet_link}
                      onChange={handleChange}
                      readOnly={isReadOnly}
                      className={errors.gg_meet_link ? 'error' : ''}
                      placeholder="Nhập link Google Meet"
                    />
                  </div>
                )}
              </div>

              {mode === 'create' && (
                <div className="form-group">
                  <label htmlFor="password">
                    Mật khẩu <span className="required">*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password || ''}
                      onChange={handleChange}
                      className={errors.password ? 'error' : ''}
                      placeholder="Nhập mật khẩu"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      style={{ marginLeft: 8 }}
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? 'Ẩn' : 'Hiện'}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h3>Thông tin liên hệ</h3>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  className={errors.phone ? 'error' : ''}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="address">Địa chỉ</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  placeholder="Nhập địa chỉ"
                  rows="3"
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="form-section">
              <h3>Thông tin cá nhân</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Ngày sinh</label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Giới tính</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Info for View Mode */}
            {mode === 'view' && user && (
              <div className="form-section">
                <h3>Thông tin hệ thống</h3>

                <div className="info-grid">
                  <div className="info-item">
                    <label>ID người dùng:</label>
                    <span>{user.account_id}</span>
                  </div>

                  <div className="info-item">
                    <label>Ngày tham gia:</label>
                    <span>
                      {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <div className="info-item">
                    <label>Trạng thái tài khoản:</label>
                    <span className={`status-indicator ${user.is_banned ? 'banned' : 'active'}`}>
                      {user.is_banned ? 'Bị khóa' : 'Hoạt động'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              {mode === 'view' ? 'Đóng' : 'Hủy'}
            </button>

            {mode === 'view' && (
              <button type="button" className="save-btn" onClick={onEdit}>
                Chỉnh sửa
              </button>
            )}

            {mode !== 'view' && (
              <button type="submit" className="save-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Đang lưu...
                  </>
                ) : mode === 'create' ? (
                  'Tạo mới'
                ) : (
                  'Cập nhật'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
