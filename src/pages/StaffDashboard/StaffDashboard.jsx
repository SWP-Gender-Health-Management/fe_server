import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffDashboard.css';
import Cookies from 'js-cookie'; // Thêm import Cookies
import axios from 'axios';

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
  const [blogs, setBlogs] = useState([]);

  const accessToken = Cookies.get("accessToken");
  const accountId = Cookies.get("accountId");

  // Mock staff data
  const [staffData, setStaffData] = useState({});

  // Load staff data - simulate API call
  useEffect(() => {
    const loadStaffData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStaffData({
        account_id: 'SF001',
        full_name: 'Duy Đẹp Trai',
        email: 'mai.nguyen@healthcare.com',
        phone: '0901234567',
        position: "Kỹ thuật viên Xét nghiệm",
        department: 'Phòng Xét nghiệm',// Get from Role
        avatar: 'https://via.placeholder.com/80x80',
        averageFeedBackRating: 4.9,
        totalFeedBack: 15,
        totalAppointments: 1247,
        created_at: '2023-03-15',
      });
      await fetchStaffData()
      await fetchBlogs();

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

  const fetchStaffData = async () => {
    try {
      const accessToken = Cookies.get("accessToken")
      const viewResponse = await axios.post(
        'http://localhost:3000/account/view-account',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // const ratingResponse = await axios.get(
      //   'http://localhost:3000/feedback/get-staff-rating-feedback',
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );
      setStaffData((prev) => {
        if (viewResponse.data.result) {
          prev = {
            ...prev,
            ...viewResponse.data.result,
            department: getDepartment(viewResponse.data.result.role),
            position: getPosition(viewResponse.data.result.role)
          }
        }
        // if (ratingResponse.data.result) {
        //   prev = { ...prev, ...ratingResponse.data.result }
        // }
        return prev;
      });

    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  }

  const fetchBlogs = async function () {
    try {
      // console.log('useEffect has been called!:', accountId);
      // console.log('useEffect has been called!:', accessToken);
      const response = await axios.get(
        `http://localhost:3000/blog/get-blog-by-account/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      // console.log('Blog Response:', response.data.result);
      setBlogs(response.data.result || []);
      setStaffData((prev) => {
        if (response.data.result) {
          const totalBlogs = response.data.result.length;
          const publishedBlogs = response.data.result.filter((blog) => {
            return blog.status == 'true' || blog.status == true
          }).length;
          prev = { ...prev, totalBlogs, publishedBlogs, pendingBlogs: totalBlogs - publishedBlogs }
        }
        return prev;
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return;
    }
  };

  const menuItems = [
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: <HomeOutlined />,
      description: 'Dashboard chính',
    },
    {
      id: 'today-appointments',
      label: 'Lịch hẹn Hôm nay',
      icon: <CalendarOutlined />,
      description: 'Xét nghiệm trong ngày',

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
    Cookies.remove("accessToken");
    Cookies.remove("accountId");
    navigate('/');
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

  const getPosition = (role) => {
    switch (role) {
      case 0:
        return "Quản trị viên";
      case 1:
        return "Tư vấn viên";
      case 2:
        return "Kỹ thuật viên Xét nghiệm";
      case 4:
        return "Quản Lý";
      case 5:
        return "Tiếp tân";
      default:
        return "Khách hàng";
    }
  }

  const getDepartment = (role) => {
    console.log("role: ", role)
    switch (role) {
      case 0:
        return "Quản trị viên";
      case 1:
        return "Bộ phận tư vấn";
      case 2:
        return "Phòng xét nghiệm";
      case 4:
        return "Phòng QUản Lý";
      case 5:
        return "Tiếp tân";
      default:
        return "Khách hàng";
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <StaffOverview staffData={staffData} />;
      case 'today-appointments':
        return <TodayAppointments havePattern={true} />;
      case 'search-appointments':
        return <SearchAppointments />;
      case 'blog-management':
        return <StaffBlog blogs={blogs} fetchBlogs={fetchBlogs} />;
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
              <h4>{staffData.full_name}</h4>
              <p>{staffData.position}</p>
              <p>{staffData.department}</p>
              <div className="rating-section">
                <span>⭐ {staffData.averageFeedBackRating}</span>
                <span className="rating">{staffData.totalAppointments} tests</span>
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
