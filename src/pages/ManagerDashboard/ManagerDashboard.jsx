import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import ServiceManagement from './components/ServiceManagement/ServiceManagement';
import BlogManagement from './components/BlogManagement/BlogManagement';
import QuestionManagement from './components/QuestionManagement/QuestionManagement';
import ManagerProfile from './components/ManagerProfile/ManagerProfile';
import StaffManagement from './components/StaffManagement/StaffManagement';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const managerName = sessionStorage.getItem('full_name') || 'Manager';
  const managerEmail = sessionStorage.getItem('email') || 'manager@example.com';

  // Loading effect when component mounts
  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Hide loading screen after progress completes
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, []);

  const menuItems = [
    {
      path: '/manager/dashboard',
      name: 'Bảng điều khiển',
      icon: '📊',
    },
    {
      path: '/manager/staff',
      name: 'Quản lý nhân viên',
      icon: '👥',
    },
    {
      path: '/manager/services',
      name: 'Quản lý dịch vụ',
      icon: '🏥',
    },
    {
      path: '/manager/blogs',
      name: 'Quản lý bài viết',
      icon: '📝',
    },
    {
      path: '/manager/questions',
      name: 'Quản lý câu hỏi',
      icon: '💬',
    },
    {
      path: '/manager/profile',
      name: 'Hồ sơ cá nhân',
      icon: '👤',
    },
  ];

  // Loading Screen Component
  if (isLoading) {
    return (
      <div className="manager-loading-screen">
        <div className="loading-container">
          {/* Logo and Title */}
          <div className="loading-header">
            <div className="loading-logo">
              <span className="loading-icon">🏥</span>
              <div className="loading-pulse"></div>
            </div>
            <h1 className="loading-title">HealthManager</h1>
            <p className="loading-subtitle">
              Đang tải bảng điều khiển quản lý...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="loading-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="progress-text">{Math.round(loadingProgress)}%</div>
          </div>

          {/* Loading Animation */}
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>

          {/* Feature Loading Text */}
          <div className="loading-features">
            <div className="feature-item">
              <span className="feature-icon">🏥</span>
              <span>Tải dữ liệu dịch vụ</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📝</span>
              <span>Đồng bộ bài viết</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <span>Cập nhật câu hỏi</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-dashboard">
      {/* Sidebar */}
      <div className={`manager-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            {!sidebarCollapsed && (
              <span className="logo-text">HealthManager</span>
            )}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <span className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="nav-text">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Manager Info */}
        <div className="sidebar-footer">
          <div className="manager-info">
            <div className="manager-avatar">
              {managerName.charAt(0).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div className="manager-details">
                <div className="manager-name">{managerName}</div>
                <div className="manager-email">{managerEmail}</div>
                <div className="manager-role">Manager</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="manager-content">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/manager/dashboard" replace />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/staff" element={<StaffManagement />} />
          <Route path="/services" element={<ServiceManagement />} />
          <Route path="/blogs" element={<BlogManagement />} />
          <Route path="/questions" element={<QuestionManagement />} />
          <Route path="/profile" element={<ManagerProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default ManagerDashboard;
