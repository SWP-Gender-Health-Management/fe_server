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

const ManagerDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
          <Route path="/profile" element={<ManagerProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default ManagerDashboard;
