import React, { useState, useEffect } from 'react';

const DashboardOverview = ({ consultantData, onSectionChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [kpiData, setKpiData] = useState({
    todayAppointments: 3,
    unansweredQuestions: 5,
    pendingArticles: 1,
    averageRating: 4.8,
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      time: '09:30',
      customerName: 'Nguyễn Thị Lan',
      issue: 'Tư vấn về kế hoạch hóa gia đình',
      type: 'Online',
      priority: 'high',
    },
    {
      id: 2,
      time: '14:00',
      customerName: 'Trần Minh Hoa',
      issue: 'Sức khỏe sinh sản sau sinh',
      type: 'Offline',
      priority: 'medium',
    },
    {
      id: 3,
      time: '16:30',
      customerName: 'Lê Thị Mai',
      issue: 'Tư vấn chu kỳ kinh nguyệt',
      type: 'Online',
      priority: 'low',
    },
  ]);

  const [recentQuestions, setRecentQuestions] = useState([
    {
      id: 1,
      title: 'Chu kỳ kinh nguyệt không đều có ảnh hưởng gì không?',
      askedBy: 'Hoàng Thị Bích',
      timeAgo: '2 giờ trước',
      category: 'Sức khỏe sinh sản',
    },
    {
      id: 2,
      title: 'Sau sinh bao lâu thì có thể quan hệ tình dục an toàn?',
      askedBy: 'Phạm Văn Nam',
      timeAgo: '4 giờ trước',
      category: 'Sau sinh',
    },
    {
      id: 3,
      title: 'Các phương pháp tránh thai hiệu quả nhất hiện nay',
      askedBy: 'Nguyễn Thu Hằng',
      timeAgo: '6 giờ trước',
      category: 'Kế hoạch hóa gia đình',
    },
  ]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const kpiCards = [
    {
      title: 'Lịch hẹn hôm nay',
      value: kpiData.todayAppointments,
      icon: '🗓️',
      color: 'blue',
      description: 'Cuộc hẹn được lên lịch',
      trend: '+2 so với hôm qua',
      action: () => onSectionChange('appointments'),
    },
    {
      title: 'Câu hỏi mới',
      value: kpiData.unansweredQuestions,
      icon: '❓',
      color: 'orange',
      description: 'Chưa được trả lời',
      trend: '+3 câu hỏi mới',
      action: () => onSectionChange('questions'),
    },
    {
      title: 'Bài viết chờ duyệt',
      value: kpiData.pendingArticles,
      icon: '📝',
      color: 'purple',
      description: 'Đang chờ phê duyệt',
      trend: 'Stable',
      action: () => onSectionChange('articles'),
    },
    {
      title: 'Đánh giá trung bình',
      value: kpiData.averageRating,
      icon: '⭐',
      color: 'green',
      description: 'Từ khách hàng',
      trend: '+0.2 điểm',
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
                <div className="kpi-trend">{card.trend}</div>
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
            <h3>🗓️ Lịch hẹn sắp tới</h3>
            <button
              className="view-all-btn"
              onClick={() => onSectionChange('appointments')}
            >
              Xem tất cả →
            </button>
          </div>

          <div className="appointments-list compact-list">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="appointment-item compact">
                  <div className="appointment-time">
                    <span className="time">{appointment.time}</span>
                    <span className={`type ${appointment.type.toLowerCase()}`}>
                      {appointment.type}
                    </span>
                  </div>

                  <div className="appointment-info">
                    <h4>{appointment.customerName}</h4>
                    <p className="issue-brief">
                      {appointment.issue.length > 40
                        ? appointment.issue.substring(0, 40) + '...'
                        : appointment.issue}
                    </p>
                  </div>

                  <div className="appointment-actions">
                    <span
                      className="priority-badge compact"
                      style={{
                        backgroundColor: getPriorityColor(appointment.priority),
                      }}
                    >
                      {appointment.priority === 'high' && '🔴'}
                      {appointment.priority === 'medium' && '🟡'}
                      {appointment.priority === 'low' && '🟢'}
                    </span>
                    <button className="enter-room-btn compact">
                      Vào phòng
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span>📅</span>
                <p>Không có lịch hẹn nào trong hôm nay</p>
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
              recentQuestions.slice(0, 5).map((question, index) => (
                <div key={question.id} className="question-item list-item">
                  <div className="question-number">{index + 1}</div>

                  <div className="question-content-full">
                    <h4 className="question-title-list">
                      {question.title.length > 80
                        ? question.title.substring(0, 80) + '...'
                        : question.title}
                    </h4>

                    <div className="question-meta-list">
                      <div className="meta-row">
                        <span className="asked-by">👤 {question.askedBy}</span>
                        <span className="time-ago">🕒 {question.timeAgo}</span>
                      </div>
                      <span className="category-tag list">
                        📂 {question.category}
                      </span>
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
