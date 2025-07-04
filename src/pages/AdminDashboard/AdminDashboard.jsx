import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Dashboard from './components/DashBoard/Dashboard';
import AccountManagement from './components/AccountManagement/AccountManagement';
import AdminProfile from './components/AdminProfile/AdminProfile';
import UserManagement from './components/UserManagement/UserManagement';
import Reports from './components/Report/Reports';
import BulkEmail from './components/BulkEmail/BulkEmail';
import RecentActivities from './components/RecentActivities/RecentActivities';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const adminName = sessionStorage.getItem('full_name') || 'Admin';
  const adminEmail = sessionStorage.getItem('email') || 'admin@example.com';

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
      path: '/admin/dashboard',
      name: 'Bảng điều khiển',
      icon: '📊',
    },
    {
      path: '/admin/accounts',
      name: 'Quản lý tài khoản',
      icon: '👥',
    },
    {
      path: '/admin/users',
      name: 'Thêm người dùng',
      icon: '➕',
    },
    {
      path: '/admin/reports',
      name: 'Báo cáo',
      icon: '📈',
    },
    {
      path: '/admin/bulk-email',
      name: 'Gửi email hàng loạt',
      icon: '📧',
    },
    {
      path: '/admin/activities',
      name: 'Hoạt động gần đây',
      icon: '⚡',
    },
    {
      path: '/admin/profile',
      name: 'Hồ sơ cá nhân',
      icon: '👤',
    },
  ];

  // Loading Screen Component
  if (isLoading) {
    return (
      <div className="admin-loading-screen">
        <div className="loading-container">
          {/* Logo and Title */}
          <div className="loading-header">
            <div className="loading-logo">
              <span className="loading-icon">🏥</span>
              <div className="loading-pulse"></div>
            </div>
            <h1 className="loading-title">HealthAdmin</h1>
            <p className="loading-subtitle">
              Đang tải bảng điều khiển quản trị...
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
              <span className="feature-icon">🔒</span>
              <span>Kiểm tra bảo mật</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Tải dữ liệu dashboard</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span>Đồng bộ tài khoản</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            {!sidebarCollapsed && (
              <span className="logo-text">HealthAdmin</span>
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

        {/* Admin Info */}
        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              {adminName.charAt(0).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div className="admin-details">
                <div className="admin-name">{adminName}</div>
                <div className="admin-email">{adminEmail}</div>
                <div className="admin-role">Admin</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<AccountManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/bulk-email" element={<BulkEmail />} />
          <Route path="/activities" element={<RecentActivities />} />
          <Route path="/profile" element={<AdminProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
