import React, { useState } from 'react';

const ManagerProfile = () => {
  const [profile, setProfile] = useState({
    fullName: sessionStorage.getItem('full_name') || 'Manager',
    email: sessionStorage.getItem('email') || 'manager@example.com',
    phone: '0123456789',
    department: 'Quản lý dịch vụ',
    joinDate: '2023-01-15',
    employeeId: 'MNG001',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSave = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
    alert('Cập nhật thông tin thành công!');
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      style={{
        padding: '32px',
        background: 'white',
        minHeight: '600px',
      }}
    >
      <div
        style={{
          marginBottom: '32px',
          paddingBottom: '20px',
          borderBottom: '2px solid #e5e7eb',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Hồ sơ cá nhân
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '0',
          }}
        >
          Quản lý thông tin cá nhân và cài đặt tài khoản
        </p>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.1)',
          maxWidth: '600px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: 'white',
              fontWeight: '700',
            }}
          >
            {profile.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a202c',
                margin: '0 0 4px 0',
              }}
            >
              {profile.fullName}
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 4px 0',
              }}
            >
              {profile.department}
            </p>
            <span
              style={{
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: '20px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#059669',
                fontWeight: '600',
              }}
            >
              Manager
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Họ và tên
            </label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={editedProfile.fullName}
                onChange={handleChange}
                style={{
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            ) : (
              <span
                style={{
                  fontSize: '14px',
                  color: '#1a202c',
                  fontWeight: '500',
                }}
              >
                {profile.fullName}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editedProfile.email}
                onChange={handleChange}
                style={{
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            ) : (
              <span
                style={{
                  fontSize: '14px',
                  color: '#1a202c',
                  fontWeight: '500',
                }}
              >
                {profile.email}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Số điện thoại
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editedProfile.phone}
                onChange={handleChange}
                style={{
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            ) : (
              <span
                style={{
                  fontSize: '14px',
                  color: '#1a202c',
                  fontWeight: '500',
                }}
              >
                {profile.phone}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Phòng ban
            </label>
            <span
              style={{
                fontSize: '14px',
                color: '#1a202c',
                fontWeight: '500',
              }}
            >
              {profile.department}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Mã nhân viên
            </label>
            <span
              style={{
                fontSize: '14px',
                color: '#1a202c',
                fontWeight: '500',
              }}
            >
              {profile.employeeId}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Ngày vào làm
            </label>
            <span
              style={{
                fontSize: '14px',
                color: '#1a202c',
                fontWeight: '500',
              }}
            >
              {new Date(profile.joinDate).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '20px',
          }}
        >
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                style={{
                  background:
                    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Lưu thay đổi
              </button>
              <button
                onClick={handleCancel}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Hủy
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Chỉnh sửa thông tin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;
