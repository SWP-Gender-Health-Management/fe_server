import React, { useState, useEffect } from 'react';
import './QuestionManagement.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button } from 'antd';



const API_URL = 'http://localhost:3000';

const QuestionManagement = () => {



  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [replyModal, setReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(10);


  // Mock data - trong thực tế sẽ fetch từ API
  useEffect(() => {
    fetchQuestions();
  }, [currentPage]);

  // Pagination
  const startIndex = (currentPage - 1) * questionsPerPage;
  const paginatedQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  const fetchQuestions = async () => {
    const accessToken = Cookies.get('accessToken');
    const accountId = Cookies.get('accountId');
    try {
      let status;
      let is_replied;
      switch (statusFilter) {
        case 'all':
          status = null;
          is_replied = null;
          break;
        case 'pending':
          status = 'true';
          is_replied = 'false';
          break;
        case 'answered':
          status = 'true';
          is_replied = 'true';
          break;
        case 'closed':
          status = 'false';
          is_replied = null;
          break;
        default:
          status = null;
          is_replied = null;
          break;
      }
      console.log('status', status);
      console.log('is_replied', is_replied);
      const response = await axios.get(`${API_URL}/manager/get-questions`, {
        params: {
          page: currentPage,
          limit: questionsPerPage,
          ...(status !== null && { status: status }),
          ...(is_replied !== null && { is_replied: is_replied }),
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setQuestions(response.data.result.questions);
      setTotalPages(response.data.result.totalPage);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const getStatusBadge = (status, is_replied) => {
    if (status === 'false') {
      return (
        <span className={`status-badge closed`}>
          <span className="status-icon">🔒</span>
          Đã đóng
        </span>
      );
    }
    const statusConfig = {
      false: { label: 'Chờ trả lời', class: 'pending', icon: '⏳' },
      true: { label: 'Đã trả lời', class: 'answered', icon: '✅' },
    };
    const config = statusConfig[is_replied] || statusConfig.false;
    return (
      <span className={`status-badge ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
        {config.label}
      </span>
    );
  };


  const handleStatusChange = async (questionId, newStatus) => {
    try {
      await axios.put(`${API_URL}/manager/set-question-status`, {
        ques_id: questionId,
        status: newStatus,
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question status:', error);
    }
  };

  const getStats = () => {
    const total = questions.length;
    const pending = questions.filter((q) => q.status === 'pending').length;
    const answered = questions.filter((q) => q.status === 'answered').length;

    return { total, pending, answered };
  };

  const stats = getStats();

  return (
    <div className="manager-question-management">
      <div className="manager-question-management-header">
        <h1>
          <span className="header-icon">💬</span>
          Quản lý câu hỏi
        </h1>
        <p>
          <span className="desc-icon">📝</span>
          Quản lý và trả lời các câu hỏi từ khách hàng
        </p>
      </div>

      {/* Stats Cards */}
      {/* <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Tổng câu hỏi</div>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Chờ trả lời</div>
          </div>
        </div>
        <div className="stat-card answered">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.answered}</div>
            <div className="stat-label">Đã trả lời</div>
          </div>
        </div>
        <div className="stat-card urgent">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <div className="stat-number">{stats.urgent}</div>
            <div className="stat-label">Khẩn cấp</div>
          </div>
        </div>
      </div> */}

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách hàng, email hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ trả lời</option>
            <option value="answered">Đã trả lời</option>
            <option value="closed">Đã đóng</option>
          </select>
        </div>

        <Button
          onClick={() => {
            if (currentPage !== 1) {
              setCurrentPage(1);
            } else {
              fetchAppointments();
            }
          }}
          type="primary"
          className="filter-button"
        >
          <span className="filter-button">Tìm kiếm</span>
        </Button>
      </div>

      {/* Questions Table */}
      <div className="questions-table-container">
        <table className="manager-question-management-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Câu hỏi</th>
              {/* <th>Danh mục</th> */}
              {/* <th>Độ ưu tiên</th> */}
              <th>Trạng thái</th>
              <th>Thời gian</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.ques_id} className="question-row" onClick={() => setSelectedQuestion(question)} style={{ cursor: 'pointer' }}>
                <td>
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {question.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="customer-details">
                      <div className="customer-name">
                        {question.customer_name}
                      </div>
                      <div className="customer-email">
                        {question.customer_email}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="question-content">
                    <p className="manager-question-management-question-text">
                      {question.content.length > 100
                        ? `${question.content.substring(0, 100)}...`
                        : question.content}
                    </p>
                  </div>
                </td>
                <td>{getStatusBadge(question.status, question.is_replied)}</td>
                <td>
                  <div className="time-info">
                    <div className="created-time">{question.created_at}</div>
                    {question.reply.created_at && (
                      <div className="replied-time">
                        Trả lời: {question.reply.created_at}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="btn-status">
                    <button
                      className='manager-question-management-btn-status'
                      onClick={() =>
                        handleStatusChange(question.ques_id, question.status.toString() === 'true' ? 'false' : 'true')
                      }
                    >
                      {question.status.toString() === 'true' ? '🔒 Đóng câu hỏi' : '🔓 Mở lại'}
                    </button>
                    <button
                      className='manager-question-management-btn-view'
                      onClick={() => setSelectedQuestion(question)}
                    >
                      <span className="view-icon">👁</span>
                      Xem chi tiết
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          Trang {currentPage} của {totalPages}
        </div>
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            Đầu
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={currentPage === pageNum ? 'active' : ''}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Cuối
          </button>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedQuestion && (
        <div className="manager-question-management-modal-overlay" onClick={() => setSelectedQuestion(null)}>
          <div className="manager-question-management-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="manager-question-management-modal-header">
              <h2>
                <span className="manager-question-management-modal-icon">💬</span>
                Chi tiết câu hỏi
              </h2>
              <button
                className="manager-question-management-modal-close"
                onClick={() => setSelectedQuestion(null)}
              >
                ×
              </button>
            </div>
            <div className="manager-question-management-modal-body">
              <div className="manager-question-management-question-detail">
                <div className="manager-question-management-question-info">
                  <div className="manager-question-management-info-icon">👤</div>
                  <div className="manager-question-management-customer-name">
                    {selectedQuestion?.customer_name}
                  </div>
                  <div className="manager-question-management-question-time">
                    <span className="manager-question-management-info-icon">🕒</span>
                    {selectedQuestion?.created_at}
                  </div>
                </div>
                <div className="manager-question-management-question-content-detail">
                  <strong>Câu hỏi:</strong>
                  <p>{selectedQuestion?.content}</p>
                </div>
                {selectedQuestion?.reply.content && (
                  <div className="manager-question-management-current-reply">
                    <strong>Trả lời hiện tại:</strong>
                    <p>{selectedQuestion.reply.content}</p>
                  </div>
                )}
              </div>

            </div>
            <div className="manager-question-management-modal-footer">
              <button
                className="manager-question-management-btn-cancel"
                onClick={() => setSelectedQuestion(null)}
                disabled={loading}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;
