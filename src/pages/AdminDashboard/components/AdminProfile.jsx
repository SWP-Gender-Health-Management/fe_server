import React from 'react';

const AdminProfile = () => {
  const adminInfo = {
    name: sessionStorage.getItem('full_name') || 'Admin',
    email: sessionStorage.getItem('email') || 'admin@example.com',
    role: 'Admin',
    joinDate: '2024-01-01',
    avatar: null,
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
            {adminInfo.name.charAt(0).toUpperCase()}
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
              {adminInfo.name}
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
                {new Date(adminInfo.joinDate).toLocaleDateString('vi-VN')}
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
              <span style={{ color: '#1a202c' }}>Toàn quyền</span>
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
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#059669',
                }}
              >
                Hoạt động
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
