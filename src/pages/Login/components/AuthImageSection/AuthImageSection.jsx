import React from 'react';

const AuthImageSection = ({ doctor }) => (
  <div className="auth-image-section">
    <div className="image-overlay">
      <div className="floating-element element-1"></div>
      <div className="floating-element element-2"></div>
      <div className="floating-element element-3"></div>
    </div>
    <img
      src={doctor}
      alt="Healthcare Professional"
      className="auth-image"
    />
    <div className="image-content">
      <h3 className="image-title">Chăm sóc sức khỏe toàn diện</h3>
      <p className="image-description">
        Dịch vụ y tế chuyên nghiệp, tin cậy cho sức khỏe của bạn.
      </p>
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Hỗ trợ</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">500+</span>
          <span className="stat-label">Bác sĩ</span>
        </div>
      </div>
    </div>
  </div>
);

export default AuthImageSection; 