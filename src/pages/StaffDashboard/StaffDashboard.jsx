import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffDashboard.css';

// Import components
import StaffOverview from '@components/StaffDshBrd/StaffOverview/StaffOverview';
import TodayAppointments from '@components/StaffDshBrd/TodayAppointments/TodayAppointments';
import SearchAppointments from '@components/StaffDshBrd/SearchAppointments/SearchAppointments';
import StaffBlog from '@components/StaffDshBrd/StaffBlog/StaffBlog';
import StaffProfile from '@components/StaffDshBrd/StaffProfile/StaffProfile';

// Import icons
import {
  HomeOutlined,
  CalendarOutlined,
  SearchOutlined,
  EditOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  ClockCircleOutlined,
  MenuOutlined,
} from '@ant-design/icons';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Mock staff data
  const [staffData, setStaffData] = useState(null);

  // Load staff data - simulate API call
  useEffect(() => {
    const loadStaffData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStaffData({
        id: 'SF001',
        name: 'Nguyễn Thị Mai',
        email: 'mai.nguyen@healthcare.com',
        phone: '0901234567',
        position: 'Kỹ thuật viên Xét nghiệm',
        department: 'Phòng Xét nghiệm',
        avatar: 'https://via.placeholder.com/80x80',
        workingHours: '08:00 - 17:00',
        shift: 'Ca sáng',
        rating: 4.9,
        totalTests: 1247,
        accuracy: 99.2,
        joinDate: '2023-03-15',
        status: 'active',
      });
      setIsLoading(false);
    };

    loadStaffData();
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: <HomeOutlined />,
      description: 'Dashboard chính',
      badge: null,
    },
    {
      id: 'today-appointments',
      label: 'Lịch hẹn Hôm nay',
      icon: <CalendarOutlined />,
      description: 'Xét nghiệm trong ngày',
      badge: 12, // Số lịch hẹn pending
    },
    {
      id: 'search-appointments',
      label: 'Tìm kiếm Lịch hẹn',
      icon: <SearchOutlined />,
      description: 'Tra cứu lịch sử',
    },
    {
      id: 'blog-management',
      label: 'Quản lý Bài viết',
      icon: <EditOutlined />,
      description: 'Viết bài & chia sẻ',
      badge: 3, // Số bài draft
    },
    {
      id: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <UserOutlined />,
      description: 'Thông tin cá nhân',
    },
  ];

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // Close mobile menu when navigation item is clicked
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Handle logout logic
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <StaffOverview staffData={staffData} />;
      case 'today-appointments':
        return <TodayAppointments />;
      case 'search-appointments':
        return <SearchAppointments />;
      case 'blog-management':
        return <StaffBlog />;
      case 'profile':
        return <StaffProfile staffData={staffData} />;
      default:
        return <StaffOverview staffData={staffData} />;
    }
  };

  if (isLoading) {
    return (
      <div className="staff-workspace">
        <div className="workspace-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <h3>Đang tải workspace...</h3>
            <p>Chuẩn bị khu vực làm việc của bạn</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-workspace">
      {/* Sidebar */}
      <div
        className={`staff-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="center-logo">
            <img src="/src/assets/blue-logo.svg" alt="Logo" />
          </div>
          {!sidebarCollapsed && (
            <div className="header-text">
              <h2>Lab Workspace</h2>
              <p>Khu vực xét nghiệm</p>
            </div>
          )}
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* Staff Info Card */}
        {!sidebarCollapsed && (
          <div className="staff-info-card">
            <div className="staff-avatar-section">
              <img
                src={staffData.avatar}
                alt="Staff Avatar"
                className="staff-avatar-large"
              />
              <div className="status-indicator active"></div>
            </div>
            <div className="staff-info-details">
              <h4>{staffData.name}</h4>
              <p>{staffData.position}</p>
              <p>{staffData.department}</p>
              <div className="rating-section">
                <span>⭐ {staffData.rating}</span>
                <span className="rating">{staffData.totalTests} tests</span>
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
              {!sidebarCollapsed && item.badge && (
                <div className="nav-badge">{item.badge}</div>
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
            {!sidebarCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Content Header */}
        <div className="content-header">
          <div className="header-info">
            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              <MenuOutlined />
            </button>
            <div>
              <h1>
                {menuItems.find((item) => item.id === activeSection)?.label ||
                  'Dashboard'}
              </h1>
              <p>
                {
                  menuItems.find((item) => item.id === activeSection)
                    ?.description
                }
              </p>
            </div>
          </div>

          <div className="header-actions">
            <div className="notifications">
              <BellOutlined />
              <span className="notification-count">3</span>
            </div>
            <div className="current-time-header">{formatTime(currentTime)}</div>
          </div>
        </div>

        {/* Content Body */}
        <div className="content-body">{renderContent()}</div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default StaffDashboard;
