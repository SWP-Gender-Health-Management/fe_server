import React, { useState } from 'react';
import ConsultationManagement from './ConsultationManagement';
import LabManagement from './LabManagement';
import MenstrualManagement from './MenstrualManagement';
import './ServiceManagement.css';

const ServiceManagement = () => {
  const [activeTab, setActiveTab] = useState('consultation');

  const tabs = [
    {
      id: 'consultation',
      name: 'Quản lý Lịch hẹn Tư vấn',
      icon: '💬',
      component: <ConsultationManagement />,
    },
    {
      id: 'lab',
      name: 'Quản lý Lịch hẹn Xét nghiệm',
      icon: '🧪',
      component: <LabManagement />,
    },
    {
      id: 'menstrual',
      name: 'Quản lý Chu kỳ Kinh nguyệt',
      icon: '📱',
      component: <MenstrualManagement />,
    },
  ];

  return (
    <div className="service-management">
      <div className="service-header">
        <h1>Quản lý các dịch vụ</h1>
        <p>Quản lý và theo dõi các hoạt động dịch vụ trong hệ thống</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default ServiceManagement;
