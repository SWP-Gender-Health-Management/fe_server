import React, { useState, useEffect } from 'react';

const DashboardOverview = ({ consultantData, onSectionChange, recentQuestions, upcomingAppointments }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [kpiData, setKpiData] = useState({
    todayAppointments: consultantData.todayAppointments || 0,
    unansweredQuestions: consultantData.unansweredQuestions || 0,
    pendingBlogs: consultantData.pendingBlogs || 0,
    averageFeedBackRating: consultantData.averageFeedBackRating || 0,
  });



  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    console.log("upcomingAppointments: ", upcomingAppointments)
    return () => clearInterval(timer);
  }, []);

  const kpiCards = [
    {
      title: 'Lịch hẹn hôm nay',
      value: kpiData.todayAppointments,
      icon: '🗓️',
      color: 'blue',
      description: 'Cuộc hẹn được lên lịch',
      action: () => onSectionChange('appointments'),
    },
    {
      title: 'Câu hỏi mới',
      value: kpiData.unansweredQuestions,
      icon: '❓',
      color: 'orange',
      description: 'Chưa được trả lời',
      action: () => onSectionChange('questions'),
    },
    {
      title: 'Bài viết chờ duyệt',
      value: kpiData.pendingBlogs,
      icon: '📝',
      color: 'purple',
              description: 'Pending approval',
      action: () => onSectionChange('blogs'),
    },
    {
      title: 'Đánh giá trung bình',
      value: kpiData.averageFeedBackRating,
      icon: '⭐',
      color: 'green',
      description: 'Từ khách hàng',
      action: () => onSectionChange('profile'),
    },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ff4757';
      case 'medium':
        return '#ffa502';
      case 'low':
        return '#2ed573';
      default:
        return '#70a1ff';
    }
  };

  function getTimeAgo(date) {
    // Chuyển đổi date thành đối tượng Date nếu là chuỗi
    const inputDate = typeof date === 'string' ? new Date(date) : date;

    // Kiểm tra tính hợp lệ của date
    if (!(inputDate instanceof Date) || isNaN(inputDate)) {
      return 'Ngày không hợp lệ';
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now - inputDate) / 1000); // Chênh lệch thời gian tính bằng giây

    // Định nghĩa các khoảng thời gian
    const intervals = [
      { label: 'năm', seconds: 31536000 },
      { label: 'tháng', seconds: 2592000 },
      { label: 'ngày', seconds: 86400 },
      { label: 'giờ', seconds: 3600 },
      { label: 'phút', seconds: 60 },
      { label: 'giây', seconds: 1 }
    ];

    // Tìm khoảng thời gian phù hợp
    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? '' : ''} trước`;
      }
    }

    return 'vừa xong';
  }

  return (
    <div className="dashboard-overview">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>
            {getGreeting()}, {consultantData?.name?.split(' ').slice(-1)[0]}! 👋
          </h1>
          <p>
            Chào mừng bạn quay trở lại workspace. Hôm nay bạn có{' '}
            {kpiData.todayAppointments} cuộc hẹn và{' '}
            {kpiData.unansweredQuestions} câu hỏi cần trả lời.
          </p>

          <div className="current-time">
            <span className="time">
              {currentTime.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
            <span className="date">
              {currentTime.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="welcome-actions">
          <button
            className="action-btn primary"
            onClick={() => onSectionChange('appointments')}
          >
            📅 Xem lịch hôm nay
          </button>
          <button
            className="action-btn secondary"
            onClick={() => onSectionChange('questions')}
          >
            ❓ Trả lời câu hỏi
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-section">
        <h2>Thống kê nhanh</h2>
        <div className="kpi-grid">
          {kpiCards.map((card, index) => (
            <div
              key={index}
              className={`kpi-card ${card.color}`}
              onClick={card.action}
            >
              <div className="kpi-header">
                <div className="kpi-icon">{card.icon}</div>
              </div>

              <div className="kpi-content">
                <h3>{card.value}</h3>
                <p className="kpi-title">{card.title}</p>
                <span className="kpi-description">{card.description}</span>
              </div>

              <div className="kpi-footer">
                <span>Nhấp để xem chi tiết →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Upcoming Appointments */}
        <div className="content-card appointments-card compact">
          <div className="card-header">
            <h3>🗓️ Lịch hẹn tuần này</h3>
            <button
              className="view-all-btn"
              onClick={() => onSectionChange('appointments')}
            >
              Xem tất cả →
            </button>
          </div>

          <div className="appointments-list compact-list">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.app_id} className="appointment-item compact">
                  <div className="appointment-time">
                    <span className="time">{appointment.consultant_pattern.date}</span>
                    <span className={`type online`}>
                      Online
                    </span>
                  </div>

                  <div className="appointment-info">
                    <h4>{appointment.customer.full_name}</h4>
                    <p className="issue-brief">
                      {appointment.description.length > 40
                        ? appointment.description.substring(0, 40) + '...'
                        : appointment.description}
                    </p>
                  </div>


                </div>
              ))
            ) : (
              <div className="empty-state">
                <span>📅</span>
                <p>Không có lịch hẹn nào trong tuần này</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Questions */}
        <div className="content-card questions-card compact">
          <div className="card-header">
            <h3>❓ Câu hỏi gần đây</h3>
            <button
              className="view-all-btn"
              onClick={() => onSectionChange('questions')}
            >
              Xem tất cả →
            </button>
          </div>

          <div className="questions-list compact-list list-style">
            {recentQuestions.length > 0 ? (
              recentQuestions.map((question, index) => (
                <div key={question.ques_id} className="question-item list-item">
                  <div className="question-number">{index + 1}</div>

                  <div className="question-content-full">
                    <h4 className="question-title-list">
                      {question.content.length > 80
                        ? question.content.substring(0, 80) + '...'
                        : question.content}
                    </h4>
                    <div className="question-meta-list">
                      <div className="meta-row">
                        <span className="asked-by">👤 {question.customer.full_name}</span>
                        <span className="time-ago">🕒 {getTimeAgo(question.created_at)}</span>
                      </div>
                    </div>

                    <div className="question-actions-list">
                      <button
                        className="answer-btn list"
                        onClick={() => onSectionChange('questions')}
                      >
                        💬 Trả lời ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span>❓</span>
                <p>Không có câu hỏi mới nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
