import React, { useState } from 'react';
import './ConsultantProfile.css';
import { Statistic } from 'antd';
import { BookOutlined, CheckCircleOutlined, ExperimentOutlined, MessageOutlined, QuestionCircleOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';

const ConsultantProfile = ({ consultantData }) => {
  const [activeTab, setActiveTab] = useState('info');
  const avatar = `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`;

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // const formatDateTime = (date) => {
  //   return new Date(date).toLocaleString('vi-VN');
  // };

  // const getTimeAgo = (date) => {
  //   const now = new Date();
  //   const diffInMs = now - new Date(date);
  //   const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  //   const diffInDays = Math.floor(diffInHours / 24);

  //   if (diffInDays > 0) {
  //     return `${diffInDays} ngày trước`;
  //   } else if (diffInHours > 0) {
  //     return `${diffInHours} giờ trước`;
  //   } else {
  //     return 'Vừa xong';
  //   }
  // };

  const getDepartment = (role) => {
    console.log("role: ", role)
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "CONSULTANT":
        return "Bộ phận tư vấn";
      case "STAFF":
        return "Phòng xét nghiệm";
      case "MANAGER":
        return "Phòng QUản Lý";
      case "RECEPTIONIST":
        return "Tiếp tân";
      default:
        return "Khách hàng";
    }
  }

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
            <img src={avatar} alt={consultantData.full_name} />
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

                </div>
              </div>

              <div className="info-section">
                <h4>🏥 Thông tin chuyên môn</h4>
                <div className="info-grid">
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
                  <div className="info-row">
                    <label>Phòng Ban: </label>
                    <span> {getDepartment(consultantData.role)} </span>
                  </div>
                </div>
              </div>

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
                    {/* <span className="metric-value">
                      {consultantData.completedAppointments}/
                      {consultantData.totalAppointments}
                    </span>
                    <span className="metric-label">Cuộc hẹn hoàn thành</span> */}
                    <Statistic
                      title="Tổng số cuộc hẹn"
                      value={consultantData.totalAppointments}
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </div>
                  <div className="metric">
                    {/* <span className="metric-value">
                      {(
                        (consultantData.completedAppointments /
                          consultantData.totalAppointments) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                    <span className="metric-label">Tỷ lệ hoàn thành</span> */}
                    <Statistic
                      title="Đã hoàn thành"
                      value={consultantData.completedAppointments}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </div>
                  <div className="metric">
                    {/* <span className="metric-value">
                      {(
                        (consultantData.completedAppointments /
                          consultantData.totalAppointments) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                    <span className="metric-label">Tỷ lệ hoàn thành</span> */}
                    <Statistic
                      title="Tỷ lệ hoàn thành"
                      value={(
                        (consultantData.completedAppointments /
                          consultantData.totalAppointments) *
                        100
                      ).toFixed(1)}
                      precision={1}
                      suffix="%"
                      prefix={<TrophyOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <h4>Hoạt động nội dung</h4>
                <div className="content-metrics">
                  <div className="metric">
                    {/* <span className="metric-value">
                      {consultantData.publishedBlogs}/
                      {consultantData.totalBlogs}
                    </span>
                    <span className="metric-label">Bài viết đã xuất bản</span> */}
                    <Statistic
                      title="Bài Viết Xuất Bản"
                      value={`${consultantData.publishedBlogs}/
                      ${consultantData.totalBlogs}`}
                      prefix={<BookOutlined />}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </div>
                  <div className="metric">
                    {/* <span className="metric-value">
                      {consultantData.questionsAnswered}
                    </span>
                    <span className="metric-label">Câu hỏi đã trả lời</span> */}
                    <Statistic
                      title="Câu hỏi đã trả lời"
                      value={consultantData.questionsAnswered}
                      prefix={<QuestionCircleOutlined />}
                      valueStyle={{ color: '#722ed1' }}
                    />
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
                    {consultantData.is_banned ? (
                      <span className="status-active" style={{color: "red"}} >Bị Ban</span>
                    ) : (
                      <span className="status-active">✅ Đang hoạt động</span>
                    )}

                  </div>
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
    </div >
  );
};

export default ConsultantProfile;
