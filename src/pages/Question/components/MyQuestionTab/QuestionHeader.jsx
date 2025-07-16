import React from 'react';
import { CommentOutlined } from '@ant-design/icons';
import './QuestionHeader.css';

const QuestionHeader = ({ totalQuestions, answeredCount }) => {
  return (
    <div className="page-header">
      <div className="header-content">
        <div className="header-icon">
          <CommentOutlined />
        </div>
        <div className="header-text">
          <h1>Hỏi & Đáp Y Tế</h1>
          <p>Đặt câu hỏi và nhận tư vấn từ các chuyên gia y tế uy tín</p>
        </div>
      </div>
      <div className="header-stats">
        <div className="stat-card">
          <div className="stat-number">{totalQuestions}</div>
          <div className="stat-label">Tổng câu hỏi</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{answeredCount}</div>
          <div className="stat-label">Đã trả lời</div>
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;
