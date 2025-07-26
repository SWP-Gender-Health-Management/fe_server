import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, Link } from 'react-router-dom';
import { 
  DashboardOutlined,
  TeamOutlined,
  UserAddOutlined,
  BarChartOutlined,
  MailOutlined,
  ThunderboltOutlined,
  UserOutlined
} from '@ant-design/icons';
import Dashboard from './components/DashBoard/Dashboard';
import AccountManagement from './components/AccountManagement/AccountManagement';
import AdminProfile from './components/AdminProfile/AdminProfile';
import UserManagement from './components/UserManagement/UserManagement';
import Reports from './components/Report/Reports';
import BulkEmail from './components/BulkEmail/BulkEmail';
import RecentActivities from './components/RecentActivities/RecentActivities';
import Sidebar from '../../components/Sidebar';
import Logo from '@assets/Logo-full.svg?react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('dashboard');

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

  // Menu items for admin
  const menuItems = [
    {
      id: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Bảng điều khiển',
      description: 'Dashboard chính'
    },
    {
      id: 'accounts',
      icon: <TeamOutlined />,
      label: 'Quản lý tài khoản',
      description: 'Quản lý tài khoản hệ thống'
    },
    {
      id: 'users',
      icon: <UserAddOutlined />,
      label: 'Thêm người dùng',
      description: 'Tạo tài khoản mới'
    },
    {
      id: 'reports',
      icon: <BarChartOutlined />,
      label: 'Báo cáo',
      description: 'Xem báo cáo thống kê'
    },
    {
      id: 'bulk-email',
      icon: <MailOutlined />,
      label: 'Gửi email hàng loạt',
      description: 'Gửi email cho nhiều người'
    },
    {
      id: 'activities',
      icon: <ThunderboltOutlined />,
      label: 'Hoạt động gần đây',
      description: 'Theo dõi hoạt động'
    },
    {
      id: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
      description: 'Thông tin cá nhân'
    },
  ];

  // Admin data for sidebar
  const adminData = {
    full_name: adminName,
    email: adminEmail,
    position: 'Administrator',
    department: 'System Management',
    avatar: `https://ui-avatars.com/api/?name=${adminName}&background=667eea&color=fff&size=60`,
    averageFeedBackRating: '5.0',
    totalAppointments: '∞'
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked');
  };

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
            <h1 className="loading-title">GenderCare</h1>
            {/* <Logo className="loading-logo-img" /> */}
            <p className="loading-subtitle">
              Đang tải bảng điều khiển quản trị...
            </p>
          </div>

          {/* Progress Bar */}
          {/* <div className="loading-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="progress-text">{Math.round(loadingProgress)}%</div>
          </div> */}

          {/* Loading Animation */}
          {/* <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div> */}

          {/* Feature Loading Text */}
          {/* <div className="loading-features">
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
          </div> */}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <Sidebar
        userData={adminData}
        sidebarCollapsed={sidebarCollapsed}
        mobileMenuOpen={false}
        setSidebarCollapsed={setSidebarCollapsed}
        menuItems={menuItems}
        activeSection={activeSection}
        handleSectionChange={handleSectionChange}
        handleLogout={handleLogout}
        basePath="/admin"
      />

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
