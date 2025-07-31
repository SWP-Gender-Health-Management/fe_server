import React from 'react';
import { QuestionCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import './TabNavigation.css';

const TabNavigation = ({ activeTab, setActiveTab, totalQuestions }) => {
  return (
    <div className="tab-navigation">
      <button
        className={`nav-tab ${activeTab === 'my-questions' ? 'active' : ''}`}
        onClick={() => setActiveTab('my-questions')}
      >
        <QuestionCircleOutlined />
        <span>Câu hỏi của tôi</span>
        <div className="tab-badge">{totalQuestions}</div>
      </button>
      <button
        className={`nav-tab ${activeTab === 'ask-question' ? 'active' : ''}`}
        onClick={() => setActiveTab('ask-question')}
      >
        <PlusCircleOutlined />
        <span>Đặt câu hỏi mới</span>
      </button>
    </div>
  );
};

export default TabNavigation;
