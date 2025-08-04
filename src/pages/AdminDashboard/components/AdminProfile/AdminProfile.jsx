import React, { useState } from 'react';

const AdminProfile = ({ adminData }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [adminInfo, setAdminInfo] = useState({
    full_name: adminData.full_name,
    email: adminData.email,
    role: adminData.role,
    created_at: adminData.created_at,
    avatar: adminData.avatar ? adminData.avatar : `https://ui-avatars.com/api/?name=${adminData.full_name}&background=52c41a&color=fff&size=60`,
    is_banned: adminData.is_banned,
    description: adminData.description,
  });
  const [form, setForm] = useState({
    full_name: adminInfo.full_name,
    email: adminInfo.email,
    is_banned: adminInfo.is_banned,
    description: adminInfo.description,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleSave = () => {
    setAdminInfo((prev) => ({ ...prev, ...form }));
    sessionStorage.setItem('full_name', form.full_name);
    sessionStorage.setItem('email', form.email);
    setIsEdit(false);
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    // Simulate password change
    alert('Đổi mật khẩu thành công!');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangePassword(false);
  };

  return (
    <div style={{ padding: '32px', background: '#f7fafc', minHeight: '100vh' }}>
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Hồ sơ cá nhân
        </h1>
        <p style={{ fontSize: '16px', color: '#718096', marginBottom: '32px' }}>
          Thông tin tài khoản admin của bạn
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: '700',
            }}
          >
            <img src={adminInfo.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} />
          </div>
          <div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1a202c',
                margin: '0 0 4px 0',
              }}
            >
              {adminInfo.full_name}
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: '#718096',
                margin: '0 0 8px 0',
              }}
            >
              {adminInfo.email}
            </p>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                background: 'rgba(139, 92, 246, 0.1)',
                color: '#7c3aed',
              }}
            >
              {adminInfo.role}
            </span>
          </div>
        </div>

        <div
          style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e2e8f0',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '16px',
            }}
          >
            Thông tin tài khoản
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: '600', color: '#4a5568' }}>
                Ngày tham gia:
              </span>
              <span style={{ color: '#1a202c' }}>
                {new Date(adminInfo.created_at).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: '600', color: '#4a5568' }}>
                Quyền truy cập:
              </span>
              <span style={{ color: '#1a202c' }}>{adminInfo.role.charAt(0).toUpperCase() + adminInfo.role.toLowerCase().slice(1)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: '600', color: '#4a5568' }}>
                Trạng thái:
              </span>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: adminInfo.is_banned ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: adminInfo.is_banned ? '#ef4444' : '#059669', 
                }}
              >
                {adminInfo.is_banned ? 'Khóa' : 'Hoạt động'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', color: '#4a5568' }}>
                Giới thiệu: 
              </span>
              <span style={{ color: '#1a202c' }}>{adminInfo.description ? adminInfo.description : 'Không có giới thiệu'}</span>
            </div>
          </div>
        </div>

        {!isEdit && !isChangePassword ? (
          <>
            <div
              style={{
                marginTop: '24px',
                textAlign: 'center',
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
              }}
            >
              <button
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setIsEdit(true)}
              >
                Chỉnh sửa thông tin
              </button>
              <button
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setIsChangePassword(true)}
              >
                Đổi mật khẩu
              </button>
            </div>
          </>
        ) : isEdit ? (
          <form
            style={{ marginTop: 32 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600 }}>Họ và tên</label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  marginTop: 4,
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600 }}>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  marginTop: 4,
                }}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setIsEdit(false)}
                style={{
                  marginRight: 12,
                  padding: '8px 20px',
                  borderRadius: 6,
                  border: '1px solid #aaa',
                  background: '#f8fafc',
                  color: '#333',
                  fontWeight: 500,
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: 6,
                  fontWeight: 600,
                }}
              >
                Lưu
              </button>
            </div>
          </form>
        ) : (
          <form style={{ marginTop: 32 }} onSubmit={handleChangePasswordSubmit}>
            <h3 style={{ marginBottom: 20, textAlign: 'center' }}>
              Đổi mật khẩu
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600 }}>Mật khẩu hiện tại</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  name="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  style={{
                    width: '100%',
                    padding: 8,
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    marginTop: 4,
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  style={{
                    marginLeft: 8,
                    padding: 8,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    background: '#f8fafc',
                  }}
                >
                  {showPasswords.current ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600 }}>Mật khẩu mới</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  name="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  style={{
                    width: '100%',
                    padding: 8,
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    marginTop: 4,
                  }}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                  style={{
                    marginLeft: 8,
                    padding: 8,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    background: '#f8fafc',
                  }}
                >
                  {showPasswords.new ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600 }}>Xác nhận mật khẩu mới</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  name="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  style={{
                    width: '100%',
                    padding: 8,
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    marginTop: 4,
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  style={{
                    marginLeft: 8,
                    padding: 8,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    background: '#f8fafc',
                  }}
                >
                  {showPasswords.confirm ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setIsChangePassword(false)}
                style={{
                  marginRight: 12,
                  padding: '8px 20px',
                  borderRadius: 6,
                  border: '1px solid #aaa',
                  background: '#f8fafc',
                  color: '#333',
                  fontWeight: 500,
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: 6,
                  fontWeight: 600,
                }}
              >
                Đổi mật khẩu
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
