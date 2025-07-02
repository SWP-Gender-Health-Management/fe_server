import React from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import ConsultantProfile from '@components/ConsultDshBrd/ConsultProfile/ConsultantProfile';
import ConsultantAppointment from '@components/ConsultDshBrd/ConsultAppoint/ConsultantAppointment';
import ConsultantQuestion from '@components/ConsultDshBrd/ConsultQuest/ConsultantQuestion';
import ConsultantBlog from '@components/ConsultDshBrd/ConsultBlog/ConsultantBlog';
import './ConsultantDashboard.css';

// New Dashboard Overview Component
const DashboardOverview = () => {
  const navigate = useNavigate();
  const consultantName = sessionStorage.getItem('full_name') || 'Tư vấn viên';

  // Mock stats data
  const stats = [
    {
      title: 'Lịch hẹn hôm nay',
      value: '8',
      icon: '📅',
      color: 'blue',
      description: '3 chờ xác nhận, 5 đã xác nhận',
    },
    {
      title: 'Câu hỏi chưa trả lời',
      value: '12',
      icon: '❓',
      color: 'orange',
      description: 'Cần trả lời trong 24h',
    },
    {
      title: 'Blog đã đăng',
      value: '24',
      icon: '📝',
      color: 'green',
      description: '18 đã duyệt, 6 chờ duyệt',
    },
    {
      title: 'Đánh giá trung bình',
      value: '4.8',
      icon: '⭐',
      color: 'purple',
      description: 'Từ 156 lượt đánh giá',
    },
  ];

  const quickActions = [
    {
      title: 'Xem lịch hẹn',
      description: 'Quản lý lịch tư vấn hôm nay',
      icon: '📅',
      action: () => navigate('/consultant/appointments'),
      color: 'blue',
    },
    {
      title: 'Trả lời câu hỏi',
      description: 'Xem câu hỏi cần trả lời',
      icon: '💬',
      action: () => navigate('/consultant/questions'),
      color: 'orange',
    },
    {
      title: 'Viết blog mới',
      description: 'Chia sẻ kiến thức chuyên môn',
      icon: '✏️',
      action: () => navigate('/consultant/blogs'),
      color: 'green',
    },
    {
      title: 'Cập nhật hồ sơ',
      description: 'Chỉnh sửa thông tin cá nhân',
      icon: '👤',
      action: () => navigate('/consultant/profile'),
      color: 'purple',
    },
  ];

  const recentActivities = [
    {
      type: 'appointment',
      message: 'Lịch hẹn với Nguyễn Thị A lúc 14:00',
      time: '2 giờ trước',
      status: 'completed',
    },
    {
      type: 'question',
      message: 'Trả lời câu hỏi về chu kỳ kinh nguyệt',
      time: '3 giờ trước',
      status: 'completed',
    },
    {
      type: 'blog',
      message: 'Blog "Chăm sóc sức khỏe phụ nữ" được duyệt',
      time: '5 giờ trước',
      status: 'approved',
    },
    {
      type: 'appointment',
      message: 'Nhận lịch hẹn mới từ Trần Văn B',
      time: '1 ngày trước',
      status: 'pending',
    },
  ];

  return (
    <div className="dashboard-overview">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Chào mừng, {consultantName}! 👋</h1>
          <p>
            Hôm nay là ngày tuyệt vời để giúp đỡ bệnh nhân. Hãy xem tổng quan
            hoạt động của bạn.
          </p>
        </div>
        <div className="current-time">
          <div className="time">
            {new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          <div className="date">
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
              <div className="stat-description">{stat.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Thao tác nhanh</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`quick-action-card ${action.color}`}
              onClick={action.action}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities-section">
        <h2>Hoạt động gần đây</h2>
        <div className="activities-list">
          {recentActivities.map((activity, index) => (
            <div key={index} className={`activity-item ${activity.status}`}>
              <div className="activity-icon">
                {activity.type === 'appointment' && '📅'}
                {activity.type === 'question' && '❓'}
                {activity.type === 'blog' && '📝'}
              </div>
              <div className="activity-content">
                <div className="activity-message">{activity.message}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
              <div className={`activity-status ${activity.status}`}>
                {activity.status === 'completed' && '✅'}
                {activity.status === 'approved' && '✅'}
                {activity.status === 'pending' && '⏳'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const consultantName = sessionStorage.getItem('full_name') || 'Tư vấn viên';

  const menuItems = [
    {
      path: '/consultant/dashboard',
      label: 'Tổng quan',
      icon: '🏠',
    },
    {
      path: '/consultant/appointments',
      label: 'Lịch hẹn',
      icon: '📅',
    },
    {
      path: '/consultant/questions',
      label: 'Hỏi đáp',
      icon: '❓',
    },
    {
      path: '/consultant/blogs',
      label: 'Blog',
      icon: '📝',
    },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div className="consultant-dashboard">
      {/* Enhanced horizontal menu */}
      <div className="consultant-submenu">
        <div className="submenu-content">
          {/* Logo section */}
          <div className="submenu-brand">
            <div className="brand-icon">👩‍⚕️</div>
            <div className="brand-text">
              <span className="brand-title">Tư vấn viên</span>
              <span className="brand-subtitle">Dashboard</span>
            </div>
          </div>

          {/* Navigation menu */}
          <nav className="horizontal-nav">
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User info with avatar */}
          <div className="submenu-user">
            <div className="user-avatar">
              <img
                src="/src/assets/doctor.jpg"
                alt="Avatar"
                onError={(e) => (e.target.style.display = 'none')}
              />
              <span className="user-avatar-fallback">👤</span>
            </div>
            <div className="user-info">
              <span className="user-name">{consultantName}</span>
              <span className="user-role">Chuyên gia tư vấn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="consultant-main">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/consultant/dashboard" replace />}
          />
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/profile" element={<ConsultantProfile />} />
          <Route path="/appointments" element={<ConsultantAppointment />} />
          <Route path="/questions" element={<ConsultantQuestion />} />
          <Route path="/blogs" element={<ConsultantBlog />} />
        </Routes>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
