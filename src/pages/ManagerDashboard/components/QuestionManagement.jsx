import React, { useState, useEffect } from 'react';
import './QuestionManagement.css';

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

  const questionsPerPage = 10;

  // Mock data - trong thực tế sẽ fetch từ API
  useEffect(() => {
    const mockQuestions = [
      {
        id: 1,
        customer_name: 'Nguyễn Thị Lan',
        customer_email: 'lan.nguyen@email.com',
        content:
          'Tôi muốn hỏi về các dịch vụ khám phụ khoa tại bệnh viện. Chi phí và thời gian thực hiện như thế nào?',
        status: 'pending', // pending, answered, closed
        created_at: '2024-12-20 14:30',
        reply: null,
        replied_at: null,
        replied_by: null,
        priority: 'normal', // low, normal, high, urgent
        category: 'service',
      },
      {
        id: 2,
        customer_name: 'Trần Văn Minh',
        customer_email: 'minh.tran@email.com',
        content:
          'Có thể đặt lịch khám online không? Tôi ở xa và muốn biết trước khi đến.',
        status: 'answered',
        created_at: '2024-12-19 09:15',
        reply:
          'Chào anh/chị! Hiện tại chúng tôi có hỗ trợ đặt lịch khám online qua website. Anh/chị có thể truy cập mục "Đặt lịch khám" để chọn thời gian phù hợp.',
        replied_at: '2024-12-19 10:30',
        replied_by: 'Manager',
        priority: 'normal',
        category: 'booking',
      },
      {
        id: 3,
        customer_name: 'Lê Thị Hoa',
        customer_email: 'hoa.le@email.com',
        content:
          'Tôi cần tư vấn về các xét nghiệm tiền hôn nhân. Có những xét nghiệm nào cần thiết?',
        status: 'pending',
        created_at: '2024-12-18 16:45',
        reply: null,
        replied_at: null,
        replied_by: null,
        priority: 'high',
        category: 'consultation',
      },
      {
        id: 4,
        customer_name: 'Phạm Văn Đức',
        customer_email: 'duc.pham@email.com',
        content:
          'Bệnh viện có dịch vụ khám sức khỏe tổng quát không? Giá cả như thế nào?',
        status: 'answered',
        created_at: '2024-12-17 11:20',
        reply:
          'Chúng tôi có gói khám sức khỏe tổng quát với nhiều mức giá khác nhau. Anh/chị có thể tham khảo chi tiết tại mục "Dịch vụ" hoặc liên hệ trực tiếp.',
        replied_at: '2024-12-17 14:15',
        replied_by: 'Manager',
        priority: 'normal',
        category: 'service',
      },
      {
        id: 5,
        customer_name: 'Hoàng Thị Mai',
        customer_email: 'mai.hoang@email.com',
        content:
          'Tôi muốn hỏi về chế độ dinh dưỡng sau sinh. Có bác sĩ nào tư vấn được không?',
        status: 'pending',
        created_at: '2024-12-16 13:10',
        reply: null,
        replied_at: null,
        replied_by: null,
        priority: 'urgent',
        category: 'consultation',
      },
    ];

    // Generate more mock questions
    const additionalQuestions = Array.from({ length: 15 }, (_, index) => ({
      id: index + 6,
      customer_name: `Khách hàng ${index + 6}`,
      customer_email: `customer${index + 6}@example.com`,
      content: `Câu hỏi số ${index + 6} về dịch vụ y tế. Tôi muốn biết thêm thông tin chi tiết.`,
      status: ['pending', 'answered', 'closed'][Math.floor(Math.random() * 3)],
      created_at: new Date(
        2024,
        11,
        Math.floor(Math.random() * 20) + 1,
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60)
      ).toLocaleString('vi-VN'),
      reply:
        Math.random() > 0.5 ? 'Đây là câu trả lời mẫu cho câu hỏi này.' : null,
      replied_at:
        Math.random() > 0.5 ? new Date().toLocaleString('vi-VN') : null,
      replied_by: Math.random() > 0.5 ? 'Manager' : null,
      priority: ['low', 'normal', 'high', 'urgent'][
        Math.floor(Math.random() * 4)
      ],
      category: ['service', 'booking', 'consultation', 'general'][
        Math.floor(Math.random() * 4)
      ],
    }));

    const allQuestions = [...mockQuestions, ...additionalQuestions];
    setQuestions(allQuestions);
    setFilteredQuestions(allQuestions);
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = questions;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
    setCurrentPage(1);
  }, [statusFilter, searchTerm, questions]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const paginatedQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Chờ trả lời', class: 'pending', icon: '⏳' },
      answered: { label: 'Đã trả lời', class: 'answered', icon: '✅' },
      closed: { label: 'Đã đóng', class: 'closed', icon: '🔒' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { label: 'Thấp', class: 'low', icon: '🔽' },
      normal: { label: 'Bình thường', class: 'normal', icon: '➖' },
      high: { label: 'Cao', class: 'high', icon: '🔼' },
      urgent: { label: 'Khẩn cấp', class: 'urgent', icon: '🚨' },
    };
    const config = priorityConfig[priority] || priorityConfig.normal;
    return (
      <span className={`priority-badge ${config.class}`}>
        <span className="priority-icon">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      service: '🏥',
      booking: '📅',
      consultation: '💬',
      general: '❓',
    };
    return categoryIcons[category] || '❓';
  };

  const handleReply = (question) => {
    setSelectedQuestion(question);
    setReplyContent('');
    setReplyModal(true);
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedQuestions = questions.map((q) =>
        q.id === selectedQuestion.id
          ? {
              ...q,
              status: 'answered',
              reply: replyContent,
              replied_at: new Date().toLocaleString('vi-VN'),
              replied_by: 'Manager',
            }
          : q
      );

      setQuestions(updatedQuestions);
      setReplyModal(false);
      setSelectedQuestion(null);
      setReplyContent('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (questionId, newStatus) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, status: newStatus } : q
    );
    setQuestions(updatedQuestions);
  };

  const getStats = () => {
    const total = questions.length;
    const pending = questions.filter((q) => q.status === 'pending').length;
    const answered = questions.filter((q) => q.status === 'answered').length;
    const urgent = questions.filter((q) => q.priority === 'urgent').length;

    return { total, pending, answered, urgent };
  };

  const stats = getStats();

  return (
    <div className="question-management">
      <div className="question-header">
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
      <div className="stats-grid">
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
      </div>

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
      </div>

      {/* Questions Table */}
      <div className="questions-table-container">
        <table className="questions-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Câu hỏi</th>
              <th>Danh mục</th>
              <th>Độ ưu tiên</th>
              <th>Trạng thái</th>
              <th>Thời gian</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedQuestions.map((question) => (
              <tr key={question.id} className="question-row">
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
                    <p className="question-text">
                      {question.content.length > 100
                        ? `${question.content.substring(0, 100)}...`
                        : question.content}
                    </p>
                    {question.reply && (
                      <div className="reply-preview">
                        <strong>Trả lời:</strong>{' '}
                        {question.reply.substring(0, 50)}...
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span className="category-badge">
                    <span className="category-icon">
                      {getCategoryIcon(question.category)}
                    </span>
                    {question.category}
                  </span>
                </td>
                <td>{getPriorityBadge(question.priority)}</td>
                <td>{getStatusBadge(question.status)}</td>
                <td>
                  <div className="time-info">
                    <div className="created-time">{question.created_at}</div>
                    {question.replied_at && (
                      <div className="replied-time">
                        Trả lời: {question.replied_at}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="actions-dropdown">
                    <button className="actions-btn">⋮</button>
                    <div className="dropdown-menu">
                      <button onClick={() => handleReply(question)}>
                        💬{' '}
                        {question.status === 'pending'
                          ? 'Trả lời'
                          : 'Sửa trả lời'}
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(question.id, 'closed')
                        }
                      >
                        🔒 Đóng câu hỏi
                      </button>
                      {question.status === 'closed' && (
                        <button
                          onClick={() =>
                            handleStatusChange(question.id, 'pending')
                          }
                        >
                          🔓 Mở lại
                        </button>
                      )}
                    </div>
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
          <span className="info-icon">📊</span>
          Hiển thị {startIndex + 1}-
          {Math.min(startIndex + questionsPerPage, filteredQuestions.length)}
          trong tổng số {filteredQuestions.length} câu hỏi
        </div>
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            <span className="nav-icon">←</span>
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
                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
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
            className="page-btn"
          >
            Sau
            <span className="nav-icon">→</span>
          </button>
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div className="modal-overlay" onClick={() => setReplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <span className="modal-icon">💬</span>
                Trả lời câu hỏi
              </h2>
              <button
                className="modal-close"
                onClick={() => setReplyModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="question-detail">
                <div className="question-info">
                  <div className="customer-name">
                    <span className="info-icon">👤</span>
                    {selectedQuestion?.customer_name}
                  </div>
                  <div className="question-time">
                    <span className="info-icon">🕒</span>
                    {selectedQuestion?.created_at}
                  </div>
                </div>
                <div className="question-content-detail">
                  <strong>Câu hỏi:</strong>
                  <p>{selectedQuestion?.content}</p>
                </div>
                {selectedQuestion?.reply && (
                  <div className="current-reply">
                    <strong>Trả lời hiện tại:</strong>
                    <p>{selectedQuestion.reply}</p>
                  </div>
                )}
              </div>
              <div className="reply-form">
                <label htmlFor="replyContent">
                  <span className="label-icon">✏️</span>
                  Nội dung trả lời:
                </label>
                <textarea
                  id="replyContent"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Nhập nội dung trả lời..."
                  rows="6"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setReplyModal(false)}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                className="btn-submit"
                onClick={handleSubmitReply}
                disabled={loading || !replyContent.trim()}
              >
                {loading ? 'Đang gửi...' : 'Gửi trả lời'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;
