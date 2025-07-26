import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { 
  DashboardOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import Dashboard from './components/Dashboard/Dashboard';
import ServiceManagement from './components/ServiceManagement/ServiceManagement';
import BlogManagement from './components/BlogManagement/BlogManagement';
import QuestionManagement from './components/QuestionManagement/QuestionManagement';
import ManagerProfile from './components/ManagerProfile/ManagerProfile';
import StaffManagement from './components/StaffManagement/StaffManagement';
import Sidebar from '../../components/Sidebar';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('dashboard');

  const managerName = sessionStorage.getItem('full_name') || 'Manager';
  const managerEmail = sessionStorage.getItem('email') || 'manager@example.com';

  // Manager data for sidebar
  const managerData = {
    full_name: managerName,
    email: managerEmail,
    position: 'Manager',
    department: 'Management',
    avatar: `https://ui-avatars.com/api/?name=${managerName}&background=52c41a&color=fff&size=60`,
    averageFeedBackRating: '4.8',
    totalAppointments: '∞'
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked');
  };

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

  // Menu items for manager
  const menuItems = [
    {
      id: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Bảng điều khiển',
      description: 'Dashboard chính'
    },
    {
      id: 'staff',
      icon: <TeamOutlined />,
      label: 'Quản lý nhân viên',
      description: 'Quản lý nhân viên hệ thống'
    },
    {
      id: 'services',
      icon: <MedicineBoxOutlined />,
      label: 'Quản lý dịch vụ',
      description: 'Quản lý các dịch vụ y tế'
    },
    {
      id: 'blogs',
      icon: <EditOutlined />,
      label: 'Quản lý bài viết',
      description: 'Quản lý nội dung blog'
    },
    {
      id: 'questions',
      icon: <QuestionCircleOutlined />,
      label: 'Quản lý câu hỏi',
      description: 'Quản lý câu hỏi người dùng'
    },
    {
      id: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
      description: 'Thông tin cá nhân'
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
          </div> */}
        </div>
      </div>
    );
  }

  return (
    <div className="manager-dashboard">
      {/* Sidebar */}
      <Sidebar
        userData={managerData}
        sidebarCollapsed={sidebarCollapsed}
        mobileMenuOpen={false}
        setSidebarCollapsed={setSidebarCollapsed}
        menuItems={menuItems}
        activeSection={activeSection}
        handleSectionChange={handleSectionChange}
        handleLogout={handleLogout}
        basePath="/manager"
      />

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
