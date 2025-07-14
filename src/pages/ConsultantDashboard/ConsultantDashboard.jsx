import React from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import ConsultantProfile from '@pages/ConsultantDashboard/components/ConsultProfile/ConsultantProfile';
import ConsultantAppointment from '@pages/ConsultantDashboard/components/ConsultAppoint/ConsultantAppointment';
import ConsultantQuestion from '@pages/ConsultantDashboard/components/ConsultQuest/ConsultantQuestion';
import ConsultantBlog from '@pages/ConsultantDashboard/components/ConsultBlog/ConsultantBlog';
import './ConsultantDashboard.css';
import Cookies from 'js-cookie'; // Sử dụng js-cookie để quản lý cookies
const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const consultantName = Cookies.get('fullname') || 'Tư vấn viên';

  const menuItems = [
    {
      path: '/consultant/appointments',
      label: 'Consultant Appointment',
      icon: '📅',
    },
    { path: '/consultant/questions', label: 'Question Blog', icon: '❓' },
    { path: '/consultant/blogs', label: 'Blog', icon: '📝' },
    { path: '/consultant/profile', label: 'Profile', icon: '👤' },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleProfileClick = () => {
    navigate('/consultant/profile');
  };

  return (
    <div className="consultant-dashboard">
      <div className="consultant-sidebar">
        {/* Header với logo và tên trung tâm */}
        <div className="sidebar-header">
          <div className="center-logo">
            <img src="/src/assets/blue-logo.svg" alt="Logo" className="logo" />
          </div>
          <h2 className="center-name">Trung Tâm Sức Khỏe Giới Tính</h2>
        </div>

        {/* Menu items */}
        <nav className="sidebar-nav">
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

        {/* Account info ở dưới cùng */}
        <div className="sidebar-footer">
          <button className="account-info" onClick={handleProfileClick}>
            <div className="account-avatar">
              <span>👤</span>
            </div>
            <div className="account-details">
              <span className="account-name">{consultantName}</span>
              <span className="account-role">Tư vấn viên</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="consultant-main">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/consultant/profile" replace />}
          />
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
