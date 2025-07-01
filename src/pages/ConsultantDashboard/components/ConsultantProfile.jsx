import React, { useState } from 'react';
import './ConsultantProfile.css';

const ConsultantProfile = () => {
  const [profile, setProfile] = useState({
    name: sessionStorage.getItem('full_name') || 'Tư vấn viên',
    email: 'consultant@healthcare.com',
    phone: '0123456789',
    dob: '1990-01-01',
    gender: 'Nam',
    specialization: 'Sức khỏe giới tính',
    experience: '5 năm',
    license: 'BS001234',
    bio: 'Tôi là một tư vấn viên chuyên nghiệp với nhiều năm kinh nghiệm trong lĩnh vực sức khỏe giới tính.',
    avatar: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Lưu thông tin profile
    console.log('Saving profile:', profile);
    setIsEditing(false);
    // Có thể gọi API để lưu thông tin
  };

  const handleCancel = () => {
    // Reset form hoặc fetch lại data
    setIsEditing(false);
  };

  return (
    <div className="consultant-profile">
      <div className="profile-header">
        <h1>Thông Tin Cá Nhân</h1>
        <div className="profile-actions">
          {!isEditing ? (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              <span>✏️</span> Chỉnh sửa
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn btn-success" onClick={handleSave}>
                <span>💾</span> Lưu
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                <span>❌</span> Hủy
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" />
              ) : (
                <span className="avatar-placeholder">👤</span>
              )}
            </div>
            {isEditing && (
              <button className="btn btn-outline">
                <span>📷</span> Đổi ảnh
              </button>
            )}
          </div>

          <div className="profile-info">
            <div className="info-row">
              <label>Họ và tên:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <span>{profile.name}</span>
              )}
            </div>

            <div className="info-row">
              <label>Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <span>{profile.email}</span>
              )}
            </div>

            <div className="info-row">
              <label>Số điện thoại:</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <span>{profile.phone}</span>
              )}
            </div>

            <div className="info-row">
              <label>Ngày sinh:</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={profile.dob}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <span>{new Date(profile.dob).toLocaleDateString('vi-VN')}</span>
              )}
            </div>

            <div className="info-row">
              <label>Giới tính:</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              ) : (
                <span>{profile.gender}</span>
              )}
            </div>

            <div className="info-row">
              <label>Chuyên môn:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="specialization"
                  value={profile.specialization}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <span>{profile.specialization}</span>
              )}
            </div>

            <div className="info-row">
              <label>Kinh nghiệm:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="experience"
                  value={profile.experience}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <span>{profile.experience}</span>
              )}
            </div>

            <div className="info-row">
              <label>Số chứng chỉ:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="license"
                  value={profile.license}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <span>{profile.license}</span>
              )}
            </div>

            <div className="info-row bio-row">
              <label>Giới thiệu:</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="4"
                />
              ) : (
                <p>{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantProfile;
