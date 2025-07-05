import React, { useState } from 'react';
import ConsultantTab from './components/ConsultantTab';
import StaffTab from './components/StaffTab';
import './StaffManagement.css';

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState('consultant');

  return (
    <div className="staff-management">
      <div className="staff-management-header">
        <h1>Quản lý nhân sự</h1>
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'consultant' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultant')}
          >
            Quản lý Consultant
          </button>
          <button
            className={`tab-button ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            Quản lý Staff
          </button>
        </div>
      </div>
      
      <div className="staff-management-content">
        {activeTab === 'consultant' ? (
          <ConsultantTab />
        ) : (
          <StaffTab />
        )}
      </div>
    </div>
  );
};

export default StaffManagement; 