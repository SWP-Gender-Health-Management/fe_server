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
import WorkspaceLoading from '../../components/ui/WorkspaceLoading';
import './ManagerDashboard.css';
import axios from 'axios';
import Cookies from 'js-cookie';


const API_URL = 'http://localhost:3000';

const ManagerDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  const managerName = sessionStorage.getItem('full_name') || 'Manager';
  const managerEmail = sessionStorage.getItem('email') || 'manager@example.com';

  const [managerData, setManagerData] = useState({
    full_name: managerName,
    email: managerEmail,
    position: 'Manager',
    department: 'Management',
    avatar: `https://ui-avatars.com/api/?name=${managerName}&background=52c41a&color=fff&size=60`,
    averageFeedBackRating: '4.8',
    totalAppointments: '∞'
  });

  useEffect(() => {
    fetchManagerData();
  }, []);

  const fetchManagerData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const accountId = Cookies.get('accountId');
      await axios.post(`${API_URL}/account/view-account`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then((response) => {
          const data = response.data.result;
          console.log("fetchManagerData data response: ", data);
          setManagerData({
            ...managerData,
            full_name: data.full_name,
            email: data.email,
            is_banned: data.is_banned,
            created_at: data.created_at,
            role: data.role,
            description: data.description,
            avatar: data.avatar ? data.avatar : `https://ui-avatars.com/api/?name=${data.full_name}&background=52c41a&color=fff&size=60`,
          });
        });
    } catch (error) {
      console.error("fetchManagerData error: ", error);
    }
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
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Menu items for manager
  const menuItems = [
    {
      id: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      description: 'Main dashboard'
    },
    {
      id: 'staff',
      icon: <TeamOutlined />,
      label: 'Staff Management',
      description: 'Manage system staff'
    },
    {
      id: 'services',
      icon: <MedicineBoxOutlined />,
      label: 'Service Management',
      description: 'Manage medical services'
    },
    {
      id: 'blogs',
      icon: <EditOutlined />,
      label: 'Blog Management',
      description: 'Manage blog content'
    },
    {
      id: 'questions',
      icon: <QuestionCircleOutlined />,
      label: 'Question Management',
      description: 'Manage user questions'
    },
    {
      id: 'profile',
      icon: <UserOutlined />,
      label: 'Personal Profile',
      description: 'Personal information'
    },
  ];

  // Loading Screen Component
  if (isLoading) {
    return (
      <WorkspaceLoading
        className="manager-workspace"
        title="Loading Management Dashboard"
        description="Preparing business management tools... Please wait"
      />
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
      <div className={`manager-content${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
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
          <Route path="/profile" element={<ManagerProfile managerData={managerData} />} />
        </Routes>
      </div>
    </div>
  );
};

export default ManagerDashboard;
