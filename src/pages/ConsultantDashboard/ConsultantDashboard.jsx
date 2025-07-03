import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsultantSidebar from './components/ConsultantSidebar';
import DashboardOverview from './components/DashboardOverview';
import ConsultantAppointment from '@components/ConsultDshBrd/ConsultAppoint/ConsultantAppointment';
import ConsultantBlog from '@components/ConsultDshBrd/ConsultBlog/ConsultantBlog';
import ConsultantQuestion from '@components/ConsultDshBrd/ConsultQuest/ConsultantQuestion';
import ConsultantProfile from '@components/ConsultDshBrd/ConsultProfile/ConsultantProfile';
import './ConsultantDashboard.css';

const ConsultantDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [consultantData, setConsultantData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  
  // Mock consultant data - would come from API
  useEffect(() => {
    const loadConsultantData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setConsultantData({
        id: 'CNS001',
        name: 'Dr. Nguyễn Thị Mai',
        avatar: '/api/placeholder/80/80',
        specialization: 'Sức khỏe sinh sản',
        rating: 4.8,
        totalAppointments: 245,
        totalArticles: 18,
        joinDate: '2023-01-15',
        email: 'dr.mai@clinic.com',
        phone: '0123456789',
        status: 'active',
      });
      setIsLoading(false);
    };

    loadConsultantData();
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      // Clear authentication data
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      navigate('/login');
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardOverview
            consultantData={consultantData}
            onSectionChange={handleSectionChange}
          />
        );
      case 'appointments':
        return <ConsultantAppointment />;
      case 'articles':
        return <ConsultantBlog />;
      case 'questions':
        return <ConsultantQuestion />;
      case 'profile':
        return <ConsultantProfile consultantData={consultantData} />;
      default:
        return (
          <DashboardOverview
            consultantData={consultantData}
            onSectionChange={handleSectionChange}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="consultant-workspace">
        <div className="workspace-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <h3>Đang tải workspace...</h3>
            <p>Chuẩn bị không gian làm việc của bạn</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="consultant-workspace">
      {/* Sidebar Navigation */}
      <ConsultantSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
        consultantData={consultantData}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main Content Area */}
      <div
        className={`workspace-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      >
        {/* Content Container */}
        <div className="content-container">{renderContent()}</div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
};

export default ConsultantDashboard;
