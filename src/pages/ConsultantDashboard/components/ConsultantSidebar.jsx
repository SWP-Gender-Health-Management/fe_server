import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ConsultantSidebar = ({
  activeSection,
  onSectionChange,
  onLogout,
  consultantData,
  collapsed,
  onToggle
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      icon: '🏠',
      label: 'Tổng quan',
      description: 'Dashboard chính'
    },
    {
      id: 'appointments',
      icon: '🗓️',
      label: 'Quản lý Lịch hẹn',
      description: 'Xem và quản lý cuộc hẹn'
    },
    {
      id: 'blogs',
      icon: '📝',
      label: 'Quản lý Bài viết',
      description: 'Viết và quản lý blog'
    },
    {
      id: 'questions',
      icon: '❓',
      label: 'Hỏi & Đáp',
      description: 'Trả lời câu hỏi'
    },
    {
      id: 'profile',
      icon: '👤',
      label: 'Hồ sơ cá nhân',
      description: 'Thông tin cá nhân'
    },
  ];

  const handleMenuClick = (sectionId) => {
    onSectionChange(sectionId);

    // Auto collapse on mobile after selection
    if (window.innerWidth <= 768) {
      onToggle();
    }
  };

  return (
    <div className={`consultant-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="center-logo">
          <Link to='/'>
            <img
              src={collapsed ? "/src/assets/white.svg" : "/src/assets/Logo-full.svg"}
              alt="Logo"
              style={{ width: '45px', height: '45px', objectFit: 'contain' }}
            />
          </Link>
        </div>
      </div>

      {/* Consultant Info Card */}
      {!collapsed && consultantData && (
        <div className="consultant-card">
          <div className="consultant-avatar-section">
            <img
              src={consultantData.avatar}
              alt={consultantData.full_name}
              className="consultant-avatar-large"
            />
            <div className="status-indicator active"></div>
          </div>

          <div className="consultant-info-details">
            <h4>{consultantData.full_name}</h4>
            <div className="rating-section">
              <span className="rating">⭐ {consultantData.averageFeedBackRating}</span>
              <span className="appointments-count">
                {consultantData.totalAppointments} cuộc hẹn
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Current Time */}
      {!collapsed && (
        <div className="time-widget">
          <div className="time-display">
            <span className="time">
              {currentTime.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span className="date">
              {currentTime.toLocaleDateString('vi-VN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
                title={collapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && (
                  <>
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">
                        {item.description}
                      </span>
                    </div>
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="footer-info">
            <div className="workspace-status">
              <span className="status-dot online"></span>
              <span>Đang hoạt động</span>
            </div>
          </div>
        )}

        <button
          className="logout-btn"
          onClick={onLogout}
          title={collapsed ? 'Đăng xuất' : ''}
        >
          <span className="logout-icon">🚪</span>
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        className="collapse-toggle"
        onClick={onToggle}
        title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
      >
        {collapsed ? '▶' : '◀'}
      </button>
    </div>
  );
};

export default ConsultantSidebar;
