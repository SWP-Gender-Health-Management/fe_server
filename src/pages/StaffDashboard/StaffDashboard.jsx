import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './StaffDashboard.css';

// Import components
import StaffLaboratory from './components/StaffLaboratory';
import StaffBlog from './components/StaffBlog';
import StaffProfile from './components/StaffProfile';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mock staff data
  const staffData = {
    id: 'SF001',
    name: 'Nguyễn Văn A',
    email: 'staff.a@healthcare.com',
    phone: '0901234567',
    position: 'Laboratory Staff',
    avatar: 'https://via.placeholder.com/100x100',
  };

  const menuItems = [
    {
      id: 'laboratory',
      label: 'Laboratory',
      icon: '🔬',
      path: '/staff/laboratory',
    },
    { id: 'blog', label: 'Blog', icon: '📝', path: '/staff/blog' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/staff/profile' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleProfileClick = () => {
    navigate('/staff/profile');
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('laboratory')) return 'laboratory';
    if (path.includes('blog')) return 'blog';
    if (path.includes('profile')) return 'profile';
    return 'profile'; // Default
  };

  return (
    <div className="staff-dashboard">
      {/* Sidebar */}
      <div className="staff-sidebar">
        {/* Logo and Center Name */}
        <div className="staff-sidebar-header">
          <div className="staff-center-logo">
            <img src="/src/assets/blue-logo.svg" alt="Healthcare Logo" />
          </div>
          <h2 className="staff-center-name">Sexual Health Center</h2>
        </div>

        {/* Navigation Menu */}
        <nav className="staff-nav-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`staff-nav-item ${getActiveTab() === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="staff-nav-icon">{item.icon}</span>
              <span className="staff-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Staff Account Info */}
        <div className="staff-account-info" onClick={handleProfileClick}>
          <div className="staff-avatar">
            <img src={staffData.avatar} alt="Staff Avatar" />
          </div>
          <div className="staff-info">
            <div className="staff-name">{staffData.name}</div>
            <div className="staff-position">{staffData.position}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="staff-main-content">
        <Routes>
          <Route path="/" element={<StaffProfile staffData={staffData} />} />
          <Route path="/laboratory" element={<StaffLaboratory />} />
          <Route path="/blog" element={<StaffBlog />} />
          <Route
            path="/profile"
            element={<StaffProfile staffData={staffData} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default StaffDashboard;
