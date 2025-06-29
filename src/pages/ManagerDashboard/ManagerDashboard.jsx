import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ServiceManagement from './components/ServiceManagement';
import ManagerProfile from './components/ManagerProfile';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const managerName = sessionStorage.getItem('full_name') || 'Manager';
  const managerEmail = sessionStorage.getItem('email') || 'manager@example.com';

  const menuItems = [
    {
      path: '/manager/dashboard',
      name: 'Bảng điều khiển',
      icon: '📊',
    },
    {
      path: '/manager/services',
      name: 'Quản lý dịch vụ',
      icon: '🏥',
    },
    {
      path: '/manager/profile',
      name: 'Hồ sơ cá nhân',
      icon: '👤',
    },
  ];

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
          <Route path="/services" element={<ServiceManagement />} />
          <Route path="/profile" element={<ManagerProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default ManagerDashboard;
