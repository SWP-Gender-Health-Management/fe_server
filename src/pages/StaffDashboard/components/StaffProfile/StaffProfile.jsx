import React, { useState } from 'react';
import './StaffProfile.css';

const StaffProfile = ({ staffData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: staffData?.name || '',
    email: staffData?.email || '',
    phone: staffData?.phone || '',
    position: staffData?.position || '',
    dateOfBirth: '1990-01-01',
    gender: 'Nam',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    qualification: 'Cử nhân Y khoa',
    experience: '5 năm',
    specialization: 'Xét nghiệm máu',
    licenseNumber: 'LIC123456789',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Updated profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: staffData?.name || '',
      email: staffData?.email || '',
      phone: staffData?.phone || '',
      position: staffData?.position || '',
      dateOfBirth: '1990-01-01',
      gender: 'Nam',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      qualification: 'Cử nhân Y khoa',
      experience: '5 năm',
      specialization: 'Xét nghiệm máu',
      licenseNumber: 'LIC123456789',
    });
    setIsEditing(false);
  };

  return (
    <div className="staff-profile">
      <div className="staff-page-header">
        <h1 className="staff-page-title">Profile</h1>
        <p className="staff-page-subtitle">Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="staff-profile-container">
        <div className="staff-profile-card staff-card">
          {/* Profile Header */}
          <div className="staff-profile-header">
            <div className="staff-profile-avatar">
              <img
                src={staffData?.avatar || 'https://via.placeholder.com/150x150'}
                alt="Staff Avatar"
              />
              <button className="staff-avatar-edit-btn">📷</button>
            </div>
            <div className="staff-profile-info">
              <h2>{formData.name}</h2>
              <p>{formData.position}</p>
              <p>ID: {staffData?.id}</p>
            </div>
            <div className="staff-profile-actions">
              {!isEditing ? (
                <button
                  className="staff-btn staff-btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Chỉnh sửa
                </button>
              ) : (
                <div className="staff-profile-action-buttons">
                  <button
                    className="staff-btn staff-btn-success"
                    onClick={handleSubmit}
                  >
                    💾 Lưu
                  </button>
                  <button
                    className="staff-btn staff-btn-secondary"
                    onClick={handleCancel}
                  >
                    ❌ Hủy
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="staff-profile-content">
            <form onSubmit={handleSubmit}>
              <div className="staff-profile-sections">
                {/* Personal Information */}
                <div className="staff-profile-section">
                  <h3>Thông tin cá nhân</h3>
                  <div className="staff-form-grid">
                    <div className="staff-form-group">
                      <label>Họ và tên</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div className="staff-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div className="staff-form-group">
                      <label>Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div className="staff-form-group">
                      <label>Ngày sinh</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="staff-form-group">
                      <label>Giới tính</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div className="staff-form-group staff-form-group-full">
                      <label>Địa chỉ</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="staff-profile-section">
                  <h3>Thông tin nghề nghiệp</h3>
                  <div className="staff-form-grid">
                    <div className="staff-form-group">
                      <label>Chức vụ</label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="staff-form-group">
                      <label>Bằng cấp</label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="staff-form-group">
                      <label>Kinh nghiệm</label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="staff-form-group">
                      <label>Chuyên môn</label>
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="staff-form-group staff-form-group-full">
                      <label>Số giấy phép hành nghề</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
