import React, { useState } from 'react';
import QuestionModal from './QuestionModal';
import './ConsultantQuestion.css';

const ConsultantQuestion = () => {
  const [filter, setFilter] = useState('Unreply');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data cho questions
  const [questions, setQuestions] = useState([
    {
      id: 'Q001',
      customerName: 'Nguyễn Thị A',
      customerDOB: '1995-05-15',
      customerPhone: '0123456789',
      content:
        'Tôi muốn tìm hiểu về các phương pháp tránh thai an toàn và hiệu quả. Có thể tư vấn cho tôi được không?',
      createdAt: '2024-01-15T10:30:00Z',
      status: 'unreplied', // unreplied, replied
      reply: null,
      consultantName: null,
      repliedAt: null,
    },
    {
      id: 'Q002',
      customerName: 'Trần Văn B',
      customerDOB: '1990-12-20',
      customerPhone: '0987654321',
      content:
        'Gần đây tôi có một số vấn đề về sức khỏe sinh sản. Các triệu chứng bao gồm đau bụng dưới và khó chịu. Tôi nên làm gì?',
      createdAt: '2024-01-14T14:20:00Z',
      status: 'unreplied',
      reply: null,
      consultantName: null,
      repliedAt: null,
    },
    {
      id: 'Q003',
      customerName: 'Lê Thị C',
      customerDOB: '1988-03-10',
      customerPhone: '0456789123',
      content:
        'Tôi đang có kế hoạch sinh con. Có những lưu ý gì về việc chuẩn bị trước khi mang thai?',
      createdAt: '2024-01-13T09:15:00Z',
      status: 'replied',
      reply:
        'Việc chuẩn bị trước khi mang thai rất quan trọng. Bạn nên bổ sung acid folic, kiểm tra sức khỏe tổng quát, và tham khảo ý kiến bác sĩ về chế độ dinh dưỡng phù hợp.',
      consultantName: 'Tư vấn viên',
      repliedAt: '2024-01-13T15:30:00Z',
    },
    {
      id: 'Q004',
      customerName: 'Phạm Văn D',
      customerDOB: '1992-08-25',
      customerPhone: '0321654987',
      content:
        'Tôi muốn tìm hiểu về các bệnh lây nhiễm qua đường tình dục và cách phòng ngừa.',
      createdAt: '2024-01-12T16:45:00Z',
      status: 'replied',
      reply:
        'Các bệnh lây nhiễm qua đường tình dục có thể phòng ngừa bằng cách sử dụng bao cao su, có quan hệ một vợ một chồng, và thực hiện kiểm tra sức khỏe định kỳ. Bạn có thể đến trung tâm để được tư vấn chi tiết hơn.',
      consultantName: 'Tư vấn viên',
      repliedAt: '2024-01-12T18:20:00Z',
    },
  ]);

  // Filter questions based on status
  const filteredQuestions = questions.filter((question) => {
    if (filter === 'Unreply') {
      return question.status === 'unreplied';
    } else if (filter === 'Replied') {
      return question.status === 'replied';
    }
    return true;
  });

  // Handle question click
  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setShowModal(true);
  };

  // Handle reply submission
  const handleReplySubmit = (questionId, reply) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              status: 'replied',
              reply: reply,
              consultantName:
                sessionStorage.getItem('full_name') || 'Tư vấn viên',
              repliedAt: new Date().toISOString(),
            }
          : q
      )
    );
    setShowModal(false);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('vi-VN') +
      ' ' +
      date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <div className="consultant-question">
      <div className="question-header">
        <h1>Câu Hỏi Từ Khách Hàng</h1>
        <div className="question-stats">
          <div className="stat-item">
            <span className="stat-number">
              {questions.filter((q) => q.status === 'unreplied').length}
            </span>
            <span className="stat-label">Chưa trả lời</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {questions.filter((q) => q.status === 'replied').length}
            </span>
            <span className="stat-label">Đã trả lời</span>
          </div>
        </div>
      </div>

      <div className="question-filters">
        {['Unreply', 'Replied'].map((filterOption) => (
          <button
            key={filterOption}
            className={`filter-btn ${filter === filterOption ? 'active' : ''}`}
            onClick={() => setFilter(filterOption)}
          >
            {filterOption === 'Unreply' ? 'Chưa trả lời' : 'Đã trả lời'}
            <span className="filter-count">
              (
              {
                questions.filter((q) =>
                  filterOption === 'Unreply'
                    ? q.status === 'unreplied'
                    : q.status === 'replied'
                ).length
              }
              )
            </span>
          </button>
        ))}
      </div>

      <div className="questions-list">
        {filteredQuestions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">❓</div>
            <h3>Không có câu hỏi nào</h3>
            <p>
              {filter === 'Unreply'
                ? 'Hiện tại chưa có câu hỏi nào cần trả lời.'
                : 'Bạn chưa trả lời câu hỏi nào.'}
            </p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div
              key={question.id}
              className={`question-card ${question.status}`}
              onClick={() => handleQuestionClick(question)}
            >
              <div className="question-info">
                <div className="question-header-info">
                  <div className="customer-info">
                    <span className="customer-name">
                      {question.customerName}
                    </span>
                    <span className="question-date">
                      {formatDate(question.createdAt)}
                    </span>
                  </div>
                  <div className={`status-badge status-${question.status}`}>
                    {question.status === 'unreplied'
                      ? 'Chưa trả lời'
                      : 'Đã trả lời'}
                  </div>
                </div>
                <div className="question-content">
                  <p>{question.content}</p>
                </div>
                {question.status === 'replied' && (
                  <div className="reply-preview">
                    <strong>Trả lời:</strong>
                    <p>{question.reply}</p>
                    <div className="reply-info">
                      <span>Bởi {question.consultantName}</span>
                      <span>{formatDate(question.repliedAt)}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="question-actions">
                <button className="btn btn-primary">
                  {question.status === 'unreplied'
                    ? '👁️ Xem & Trả lời'
                    : '👁️ Xem chi tiết'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <QuestionModal
          question={selectedQuestion}
          onClose={() => setShowModal(false)}
          onReply={handleReplySubmit}
        />
      )}
    </div>
  );
};

export default ConsultantQuestion;
