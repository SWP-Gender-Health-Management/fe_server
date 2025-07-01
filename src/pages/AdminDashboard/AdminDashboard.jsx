import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AccountManagement from './components/AccountManagement';
import AdminProfile from './components/AdminProfile';
import UserManagement from './components/UserManagement';
import Reports from './components/Reports';
import BulkEmail from './components/BulkEmail';
import RecentActivities from './components/RecentActivities';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const adminName = sessionStorage.getItem('full_name') || 'Admin';
  const adminEmail = sessionStorage.getItem('email') || 'admin@example.com';

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
