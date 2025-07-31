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
import WorkspaceLoading from '../../components/ui/WorkspaceLoading';
import Logo from '@assets/Logo-full.svg?react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  const adminName = sessionStorage.getItem('full_name') || 'Admin';
  const adminEmail = sessionStorage.getItem('email') || 'admin@example.com';

  // Loading effect when component mounts
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Menu items for admin
  const menuItems = [
    {
      id: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      description: 'Main dashboard'
    },
    {
      id: 'accounts',
      icon: <TeamOutlined />,
      label: 'Account Management',
      description: 'Manage system accounts'
    },
    {
      id: 'users',
      icon: <UserAddOutlined />,
      label: 'Add Users',
      description: 'Create new accounts'
    },
    {
      id: 'reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
      description: 'View statistics reports'
    },
    {
      id: 'bulk-email',
      icon: <MailOutlined />,
      label: 'Bulk Email',
      description: 'Send emails to multiple users'
    },
    // {
    //   id: 'activities',
    //   icon: <ThunderboltOutlined />,
    //   label: 'Recent Activities',
    //   description: 'Track activities'
    // },
    {
      id: 'profile',
      icon: <UserOutlined />,
      label: 'Personal Profile',
      description: 'Personal information'
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
      <WorkspaceLoading 
        className="admin-workspace"
        title="Loading Admin Dashboard"
        description="Preparing system administration tools... Please wait"
      />
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
