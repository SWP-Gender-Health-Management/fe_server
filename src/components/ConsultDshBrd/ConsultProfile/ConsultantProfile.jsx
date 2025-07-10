import React, { useState } from 'react';
import './ConsultantProfile.css';

const ConsultantProfile = ({ consultantData }) => {
  const [activeTab, setActiveTab] = useState('info');

  if (!consultantData) {
    return (
      <div className="consultant-profile">
        <div className="loading-state">
          <span>⏳</span>
          <p>Đang tải thông tin hồ sơ...</p>
        </div>
      </div>
    );
  }

  // Mock additional profile data
  const defaultStats = {
    consultationTypes: ['Online', 'Offline'],
  };

  // const recentActivities = [
  //   {
  //     id: 1,
  //     type: 'appointment',
  //     description: 'Hoàn thành tư vấn với khách hàng Nguyễn Thị Lan',
  //     time: new Date('2024-01-15T14:30:00'),
  //     icon: '🗓️',
  //   },
  //   {
  //     id: 2,
  //     type: 'article',
  //     description: 'Xuất bản bài viết "Kế hoạch hóa gia đình hiện đại"',
  //     time: new Date('2024-01-15T10:15:00'),
  //     icon: '📝',
  //   },
  //   {
  //     id: 3,
  //     type: 'question',
  //     description: 'Trả lời câu hỏi về chu kỳ kinh nguyệt',
  //     time: new Date('2024-01-14T16:45:00'),
  //     icon: '❓',
  //   },
  //   {
  //     id: 4,
  //     type: 'appointment',
  //     description: 'Xác nhận lịch hẹn với Trần Minh Hoa',
  //     time: new Date('2024-01-14T09:20:00'),
  //     icon: '✅',
  //   },
  // ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('vi-VN');
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} ngày trước`;
    } else if (diffInHours > 0) {
      return `${diffInHours} giờ trước`;
    } else {
      return 'Vừa xong';
    }
  };

  return (
    <div className="consultant-profile">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h2>👤 Hồ sơ cá nhân</h2>
          <p>Thông tin chi tiết về tài khoản và hoạt động của bạn</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-main">
          <div className="profile-avatar">
            <img src={consultantData.avatar} alt={consultantData.full_name} />
            <div className="status-indicator active"></div>
          </div>

          <div className="profile-info">
            <h3>{consultantData.full_name}</h3>
            {/* <p className="specialization">{consultantData.specialization}</p> */}
            <div className="rating">
              <span className="rating-value">
                {consultantData.averageFeedBackRating} ⭐ ({consultantData.totalFeedBack} đánh
                giá)
              </span>
            </div>
            <div className="contact-info">
              <span>📧 {consultantData.email}</span>
              <span>📞 {consultantData.phone}</span>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">
              {consultantData.totalAppointments}
            </span>
            <span className="stat-label">Cuộc hẹn</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {consultantData.publishedBlogs}
            </span>
            <span className="stat-label">Bài viết</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {consultantData.questionsAnswered}
            </span>
            <span className="stat-label">Câu trả lời</span>
          </div>
          {/* <div className="stat-item">
            <span className="stat-number">{consultantData.averageFeedBackRating}</span>
            <span className="stat-label">Đánh giá</span>
          </div> */}
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          📋 Thông tin chi tiết
        </button>
        <button
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          📊 Hoạt động gần đây
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Cài đặt
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'info' && (
          <div className="info-tab">
            <div className="info-sections">
              <div className="info-section">
                <h4>📋 Thông tin cơ bản</h4>
                <div className="info-grid">
                  <div className="info-row">
                    <label>Họ và tên:</label>
                    <span>{consultantData.full_name}</span>
                  </div>
                  <div className="info-row">
                    <label>Email:</label>
                    <span>{consultantData.email}</span>
                  </div>
                  <div className="info-row">
                    <label>Số điện thoại:</label>
                    <span>{consultantData.phone}</span>
                  </div>
                  <div className="info-row">
                    <label>Ngày tham gia:</label>
                    <span>{formatDate(consultantData.created_at)}</span>
                  </div>
                  {/* <div className="info-row">
                    <label>Lần đăng nhập cuối:</label>
                    <span>{formatDateTime(consultantData.lastLogin)}</span>
                  </div> */}
                </div>
              </div>

              <div className="info-section">
                <h4>🏥 Thông tin chuyên môn</h4>
                <div className="info-grid">
                  {/* <div className="info-row">
                    <label>Chuyên khoa:</label>
                    <span>{consultantData.specialization}</span>
                  </div> */}
                  {/* <div className="info-row">
                    <label>Lĩnh vực tư vấn:</label>
                    <div className="specializations">
                      {consultantData.specializations.map((spec, index) => (
                        <span key={index} className="spec-tag">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div> */}
                  {/* <div className="info-row">
                    <label>Giờ làm việc:</label>
                    <span>{consultantData.workingHours}</span>
                  </div> */}
                  <div className="info-row">
                    <label>Hình thức tư vấn:</label>
                    <div className="consultation-types">
                      {defaultStats.consultationTypes.map((type, index) => (
                        <span key={index} className="type-tag">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* <div className="info-row">
                    <label>Ngôn ngữ:</label>
                    <span>{consultantData.languages.join(', ')}</span>
                  </div> */}
                </div>
              </div>

              {/* <div className="info-section">
                <h4>🎓 Bằng cấp & Chứng chỉ</h4>
                <div className="certifications">
                  {consultantData.certifications.map((cert, index) => (
                    <div key={index} className="certification-item">
                      <span className="cert-icon">🏆</span>
                      <span className="cert-name">{cert}</span>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-tab">
            <div className="activity-stats">
              <div className="stat-card">
                <h4>Hiệu suất tư vấn</h4>
                <div className="performance-metrics">
                  <div className="metric">
                    <span className="metric-value">
                      {consultantData.completedAppointments}/
                      {consultantData.totalAppointments}
                    </span>
                    <span className="metric-label">Cuộc hẹn hoàn thành</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">
                      {(
                        (consultantData.completedAppointments /
                          consultantData.totalAppointments) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                    <span className="metric-label">Tỷ lệ hoàn thành</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <h4>Hoạt động nội dung</h4>
                <div className="content-metrics">
                  <div className="metric">
                    <span className="metric-value">
                      {consultantData.publishedBlogs}/
                      {consultantData.totalBlogs}
                    </span>
                    <span className="metric-label">Bài viết đã xuất bản</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">
                      {consultantData.questionsAnswered}
                    </span>
                    <span className="metric-label">Câu hỏi đã trả lời</span>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="recent-activities">
              <h4>🕒 Hoạt động gần đây</h4>
              <div className="activities-list">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <p>{activity.description}</p>
                      <span className="activity-time">
                        {getTimeAgo(activity.time)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="settings-note">
              <div className="note-icon">ℹ️</div>
              <div className="note-content">
                <h4>Thông báo quan trọng</h4>
                <p>
                  Thông tin cá nhân của bạn được quản lý bởi Administrator. Nếu
                  bạn cần thay đổi thông tin như tên, email, chuyên khoa hoặc
                  các thông tin khác, vui lòng liên hệ với quản trị viên hệ
                  thống.
                </p>
              </div>
            </div>

            <div className="settings-sections">
              <div className="settings-section">
                <h4>🔐 Bảo mật tài khoản</h4>
                <div className="security-info">
                  <div className="security-item">
                    <span className="security-label">
                      Trạng thái tài khoản:
                    </span>
                    <span className="status-active">✅ Đang hoạt động</span>
                  </div>
                  {/* <div className="security-item">
                    <span className="security-label">Lần đăng nhập cuối:</span>
                    <span>{formatDateTime(consultantData.lastLogin)}</span>
                  </div> */}
                  <div className="security-item">
                    <span className="security-label">Phiên đăng nhập:</span>
                    <span className="session-info">
                      Đang hoạt động từ thiết bị này
                    </span>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h4>📞 Hỗ trợ</h4>
                <div className="support-info">
                  <p>Nếu bạn gặp vấn đề kỹ thuật hoặc cần hỗ trợ:</p>
                  <div className="support-contacts">
                    <div className="support-item">
                      <span>📧 Email hỗ trợ:</span>
                      <a href="mailto:support@clinic.com">support@clinic.com</a>
                    </div>
                    <div className="support-item">
                      <span>📞 Hotline:</span>
                      <a href="tel:1900-1234">1900-1234</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantProfile;
