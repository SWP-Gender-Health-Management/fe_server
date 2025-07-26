import React from 'react';
import { Link } from 'react-router-dom';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';

const Sidebar = ({
  userData,
  sidebarCollapsed,
  mobileMenuOpen,
  setSidebarCollapsed,
  menuItems,
  activeSection,
  handleSectionChange,
  handleLogout
}) => {
  // formatTime, formatDate có thể truyền vào props hoặc định nghĩa lại nếu cần
  const formatTime = (date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date) => date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
  const currentTime = new Date();

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}
      onMouseEnter={() => setSidebarCollapsed(false)}
      onMouseLeave={() => setSidebarCollapsed(true)}
    >
      {/* Header */}
      <div className="sidebar-header">
        <div className="center-logo">
          <Link to={`/`} >
            <img
              src={sidebarCollapsed ? "/src/assets/white-logo.svg" : "/src/assets/Logo-full.svg"}
              alt="Logo"
            />
          </Link>
        </div>
      </div>

      {/* Info Card */}
      {!sidebarCollapsed && (
        <div className="sidebar-info-card">
          <div className="sidebar-avatar-section">
            <img
              src={userData.avatar}
              alt="User Avatar"
              className="sidebar-avatar-large"
            />
          </div>
          <div className="sidebar-info-details">
            <h4>{userData.full_name}</h4>
            <p>{userData.position}</p>
            <p>{userData.department}</p>
            <div className="rating-section">
              <span>⭐ {userData.averageFeedBackRating}</span>
              <span className="rating">{userData.totalAppointments} tests</span>
            </div>
          </div>
        </div>
      )}

      {/* Current Time & Date */}
      {!sidebarCollapsed && (
        <div className="time-widget">
          <div className="current-time">{formatTime(currentTime)}</div>
          <div className="current-date">{formatDate(currentTime)}</div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => handleSectionChange(item.id)}
            title={sidebarCollapsed ? item.label : ''}
          >
            <div className="nav-icon">{item.icon}</div>
            {!sidebarCollapsed && (
              <div className="nav-content">
                <div className="nav-label">{item.label}</div>
                <div className="nav-description">{item.description}</div>
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={handleLogout}
          title={sidebarCollapsed ? 'Đăng xuất' : ''}
        >
          <LogoutOutlined />
          {sidebarCollapsed ? <SettingOutlined style={{ marginLeft: 8 }} /> : <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 