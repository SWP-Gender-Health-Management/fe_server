import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StaffDashboard.css';
import Cookies from 'js-cookie'; // Thêm import Cookies
import axios from 'axios';

// Import components
import StaffOverview from '@pages/StaffDashboard/components/StaffOverview/StaffOverview';
import TodayAppointments from '@pages/StaffDashboard/components/TodayAppointments/TodayAppointments';
import SearchAppointments from '@pages/StaffDashboard/components/SearchAppointments/SearchAppointments';
import StaffBlog from '@pages/StaffDashboard/components/StaffBlog/StaffBlog';
import StaffProfile from '@pages/StaffDashboard/components/StaffProfile/StaffProfile';

import StaffLaboratory from './components/StaffLab/StaffLaboratory';
import WorkspaceLoading from '../../components/ui/WorkspaceLoading';
import Sidebar from '../../components/Sidebar';


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
  SettingOutlined, // Thêm icon bánh răng
} from '@ant-design/icons';

const API_URL = 'http://localhost:3000';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);


  const accessToken = Cookies.get("accessToken");
  const accountId = Cookies.get("accountId");

  // Mock staff data
  const [staffData, setStaffData] = useState({});

  // Load staff data - simulate API call
  useEffect(() => {
    const loadStaffData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await fetchStaffData();
      await fetchBlogs();
      await fetchAppointmentsOfStaff();
      await fetchTodayAppointmentsOfStaff();
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

  const fetchAppointmentsOfStaff = async () => {
    try {
      const appointmentResponse = await axios.get(
        `${API_URL}/staff/get-laborarity-appointment-of-staff`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const appointments = appointmentResponse.data.result;
      if (appointments) {
        // console.log("appointments: ", appointments)
        const generated = await generateAppointment(appointments);
        // console.log("generated: ", generated)
        setAppointments(generated);
        setStaffData((prev) => {
          prev = {
            ...prev,
            totalAppointments: appointments.length,
            pendingAppointments: appointments.filter((appointment) => {
              return appointment.status == 'pending'
            }).length,
            confirmedAppointments: appointments.filter((appointment) => {
              return appointment.status == 'confirmed'
            }).length,
            inProgressAppointments: appointments.filter((appointment) => {
              return appointment.status == 'in_progress'
            }).length,
            completedAppointments: appointments.filter((appointment) => {
              return appointment.status == 'completed'
            }).length,
          }
          return prev;
        });
        return generated;
      }
      return [];
    } catch (error) {
      console.error('Error fetching appointment data:', error);
      return [];
    }
  }

  const fetchTodayAppointmentsOfStaff = async () => {
    try {
      const patternResponse = await axios.get(
        `${API_URL}/staff-pattern/get-pattern-by-date`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          params: {
            date: new Date(),
          },
        }
      );
      const patterns = patternResponse.data.result;
      console.log('patterns: ', patterns);

      if (!patterns || patterns.length === 0) {
        setTodayAppointments([]); // Clear state if no patterns
        return;
      }

      // Fetch appointments for all patterns concurrently
      const allAppointments = await Promise.all(
        patterns.map(async (pattern, index) => {
          const appointmentResponse = await axios.get(
            `${API_URL}/staff/get-laborarity-appointment-by-pattern`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              params: {
                date: pattern.date,
                slot_is: pattern.working_slot.slot_id,
              },
            }
          );
          const appointments = appointmentResponse.data.result;
          if (appointments) {
            console.log(`Today appointments ${index}: `, appointments);
            return await generateAppointment(appointments); // Return generated appointments
          }
        })
      );

      // Flatten and deduplicate appointments by app_id
      const flattenedAppointments = allAppointments.flat();
      const uniqueAppointments = Array.from(
        new Map(
          flattenedAppointments.map((app) => [app.app_id, app])
        ).values()
      );

      setTodayAppointments(uniqueAppointments); // Set deduplicated appointments
      return uniqueAppointments;
    } catch (error) {
      console.error('Error fetching today appointment data:', error);
      setTodayAppointments([]); // Clear state on error
      return [];
    }
  };

  const generateAppointment = async (appointments) => {
    if (!appointments || appointments.length === 0) {
      return [];
    }
    // Chờ tất cả các Promise trong map và trả về mảng kết quả
    const processedAppointments = await Promise.all(
      appointments.map(async (app) => {
        const tests = await Promise.all(
          app.laborarity.map(async (lab) => {
            const result = app.result.find((res) => res.name === lab.name);
            return {
              ...lab,
              result: result ? result.result : null,
              conclusion: result ? result.conclusion : null,
              status: app.status === 'pending'
                ? 'pending'
                : result
                  ? 'completed'
                  : 'in_progress',
            };
          })
        );
        return {
          ...app,
          tests,
        };
      })
    );
    return processedAppointments;
  };

  const fetchStaffData = async () => {
    try {
      const viewResponse = await axios.post(
        `${API_URL}/account/view-account`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const ratingResponse = await axios.get(
        `${API_URL}/feedback/get-staff-rating-feedback`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setStaffData((prev) => {
        if (viewResponse.data.result) {
          prev = {
            ...prev,
            ...viewResponse.data.result,
            department: getDepartment(viewResponse.data.result.role),
            position: getPosition(viewResponse.data.result.role)
          }
        }
        if (ratingResponse.data.result) {
          console.log("ratingResponse: ", ratingResponse.data.result)
          prev = { ...prev, ...ratingResponse.data.result }
        }
        return prev;
      });

    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  }

  const fetchBlogs = async function () {
    try {
      const response = await axios.get(
        `${API_URL}/blog/get-blog-by-account/${accountId}`,
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
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
        return <TodayAppointments todayAppointments={todayAppointments} fetchTodayAppointmentsOfStaff={fetchTodayAppointmentsOfStaff} />;
      case 'search-appointments':
        return <SearchAppointments inputAppointments={appointments} fetchInputAppointments={fetchAppointmentsOfStaff} />;
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
      <WorkspaceLoading
        className="staff-workspace"
        title="Đang tải Workspace"
        description="Đang chuẩn bị khu vực làm việc của bạn ....Vui lòng đợi trong giây lát"
      />
    );
  }

  return (
    <div className="staff-workspace">
      {/* Sidebar */}
      <Sidebar
        userData={staffData}
        sidebarCollapsed={sidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setSidebarCollapsed={setSidebarCollapsed}
        menuItems={menuItems}
        activeSection={activeSection}
        handleSectionChange={handleSectionChange}
        handleLogout={handleLogout}
      />

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
