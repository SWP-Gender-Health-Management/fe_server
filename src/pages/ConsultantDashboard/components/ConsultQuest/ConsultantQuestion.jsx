import React, { useEffect, useState } from 'react';
import QuestionModal from '../QuestionModal/QuestionModal';
import './ConsultantQuestion.css';
import api from '@/api/api';
import Cookies from 'js-cookie'; // Sử dụng js-cookie để quản lý cookies

const ConsultantQuestion = () => {
  const [filter, setFilter] = useState('Unreply');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data cho questions
  const [questionsUnreplied, setQuestionsUnreplied] = useState([]);
  const [questionsReplied, setQuestionsReplied] = useState([]);


  useEffect(() => {
    async function fetchQuestions() {
      const accountId = await Cookies.get('accountId');
      const accessToken = await Cookies.getm('accessToken');
      // console.log('useEffect has been called!:', accountId);
      console.log('useEffect has been called!:', accessToken);

      const responseUnreply = await api.get(
        `/question/get-unreplied-questions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Response:', responseUnreply.data);
      setQuestionsUnreplied(responseUnreply.data.result || []);
      const responseReplied = await api.get(
        `/question/get-question-by-id/consultant/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Response:', responseReplied.data);
      setQuestionsReplied(responseReplied.data.result || []);

    }
    fetchQuestions();
  }, []);

  // Filter questions based on status
  const filteredQuestions = (filter === 'Unreply') ? questionsUnreplied : questionsReplied;

  // Handle question click
  const handleQuestionClick = (question) => {
  console.log('Selected Question:', question);
  if (!question || !question.ques_id) {
    console.error('Question data is invalid:', question);
    return;
  }
  setSelectedQuestion(question);
  setShowModal(true);
};

  // Handle reply submission
  const handleReplySubmit = (questionId, reply) => {
    // Find the question in questionsUnreplied
    const questionToUpdate = questionsUnreplied.find(q => q.ques_id === questionId);
    if (questionToUpdate) {
      const updatedQuestion = {
        ...questionToUpdate,
        reply: reply,
        // Optionally update other fields if needed
      };
      setQuestionsUnreplied(prev => prev.filter(q => q.ques_id !== questionId));
      setQuestionsReplied(prev => [updatedQuestion, ...prev]);
    }
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
              {questionsUnreplied.length}
            </span>
            <span className="stat-label">Chưa trả lời</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {questionsReplied.length}
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
              ({filterOption === 'Unreply' ? questionsUnreplied.length : questionsReplied.length})
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
              key={question.ques_id}
              className={`question-card ${question.reply ? 'replied' : 'unreplied'}`}
              onClick={() => handleQuestionClick(question)}
            >
              <div className="question-info">
                <div className="question-header-info">
                  <div className="customer-info">
                    <span className="customer-name">
                      {question.customer.full_name}
                    </span>
                    <span className="question-date">
                      {formatDate(question.created_at)}
                    </span>
                  </div>
                  <div className={`status-badge status-${question.reply ? 'replied' : 'unreplied'}`}>
                    {question.reply ? 'Đã trả lời' : 'Chưa trả lời'}
                  </div>
                </div>
                <div className="question-content">
                  <p>{question.content}</p>
                </div>
                {question.reply && (
                  <div className="reply-preview">
                    <strong>Trả lời:</strong>
                    <p>{question.reply.content}</p>
                    <div className="reply-info">
                      <span>Bởi {question.reply.consultant.full_name}</span>
                      <span>{formatDate(question.reply.created_at)}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="question-actions">
                <button className="btn btn-primary">
                  {question.reply ? '👁️ Xem chi tiết' : '👁️ Xem & Trả lời'}
                </button>
              </div>
            </div>
          ))
        )}
        {showModal && (
          <QuestionModal
            question={selectedQuestion}
            onClose={() => setShowModal(false)}
            onReply={handleReplySubmit}
          />
        )}
      </div>
    </div>
  );
};

export default ConsultantQuestion;