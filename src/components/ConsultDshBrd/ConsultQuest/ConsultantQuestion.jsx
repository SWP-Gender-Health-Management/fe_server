import React, { useState, useEffect } from 'react';
import './ConsultantQuestion.css';

const ConsultantQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [filterTab, setFilterTab] = useState('unanswered'); // 'unanswered' or 'answered'
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  // Mock questions data
  useEffect(() => {
    const mockQuestions = [
      {
        id: 1,
        title: 'Chu kỳ kinh nguyệt không đều có ảnh hưởng gì không?',
        content:
          'Em 25 tuổi, chu kỳ kinh nguyệt của em thường không đều, có khi 28 ngày, có khi 35 ngày. Em muốn hỏi điều này có ảnh hưởng đến khả năng sinh sản không và em nên làm gì để cải thiện?',
        askedBy: 'Hoàng Thị Bích',
        askedAt: new Date('2024-01-15T10:30:00'),
        category: 'Sức khỏe sinh sản',
        status: 'unanswered',
        priority: 'medium',
        tags: ['kinh nguyệt', 'chu kỳ', 'sinh sản'],
        userAge: 25,
        userGender: 'female',
        answer: null,
        answeredAt: null,
        views: 45,
      },
      {
        id: 2,
        title: 'Sau sinh bao lâu thì có thể quan hệ tình dục an toàn?',
        content:
          'Chào bác sĩ, vợ tôi vừa sinh con được 4 tuần. Chúng tôi muốn hỏi sau sinh bao lâu thì có thể quan hệ tình dục trở lại một cách an toàn? Có những lưu ý gì đặc biệt không ạ?',
        askedBy: 'Phạm Văn Nam',
        askedAt: new Date('2024-01-14T14:20:00'),
        category: 'Sau sinh',
        status: 'unanswered',
        priority: 'high',
        tags: ['sau sinh', 'quan hệ', 'an toàn'],
        userAge: 30,
        userGender: 'male',
        answer: null,
        answeredAt: null,
        views: 32,
      },
      {
        id: 3,
        title: 'Các phương pháp tránh thai hiệu quả nhất hiện nay',
        content:
          'Em và chồng đang tìm hiểu về các phương pháp tránh thai an toàn và hiệu quả. Em muốn hỏi về ưu nhược điểm của từng phương pháp và phương pháp nào phù hợp nhất cho cặp vợ chồng trẻ?',
        askedBy: 'Nguyễn Thu Hằng',
        askedAt: new Date('2024-01-13T09:15:00'),
        category: 'Kế hoạch hóa gia đình',
        status: 'answered',
        priority: 'medium',
        tags: ['tránh thai', 'kế hoạch', 'gia đình'],
        userAge: 28,
        userGender: 'female',
        answer:
          'Hiện tại có nhiều phương pháp tránh thai hiệu quả như thuốc tránh thai, que cấy, vòng tránh thai, bao cao su... Mỗi phương pháp đều có ưu nhược điểm riêng. Tôi khuyên bạn nên đến cơ sở y tế để được tư vấn cụ thể dựa trên tình trạng sức khỏe và nhu cầu của bạn.',
        answeredAt: new Date('2024-01-13T16:30:00'),
        views: 78,
      },
      {
        id: 4,
        title: 'Triệu chứng mang thai sớm nào cần chú ý?',
        content:
          'Em đang có một số triệu chứng như buồn nôn, mệt mỏi, ngực căng tức. Em nghi ngờ mình có thai nhưng chưa chắc chắn. Em muốn hỏi về các dấu hiệu mang thai sớm và khi nào nên đi khám?',
        askedBy: 'Lê Thị Minh',
        askedAt: new Date('2024-01-12T11:45:00'),
        category: 'Thai kỳ',
        status: 'answered',
        priority: 'high',
        tags: ['mang thai', 'triệu chứng', 'thai kỳ'],
        userAge: 26,
        userGender: 'female',
        answer:
          'Các triệu chứng bạn mô tả có thể là dấu hiệu của thai kỳ sớm. Tôi khuyên bạn nên làm test thai tại nhà hoặc xét nghiệm máu để xác định chính xác. Nếu có thai, hãy đến khám sản khoa trong 2 tuần đầu để được theo dõi và tư vấn.',
        answeredAt: new Date('2024-01-12T17:20:00'),
        views: 95,
      },
    ];
    setQuestions(mockQuestions);
  }, []);

  // Filter questions based on tab and search
  const filteredQuestions = questions
    .filter((question) => {
      const matchesTab =
        filterTab === 'all' ||
        (filterTab === 'unanswered' && question.status === 'unanswered') ||
        (filterTab === 'answered' && question.status === 'answered');

      const matchesSearch =
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.askedBy.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      // Priority: high -> medium -> low, then by date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.askedAt) - new Date(a.askedAt);
    });

  const stats = {
    total: questions.length,
    unanswered: questions.filter((q) => q.status === 'unanswered').length,
    answered: questions.filter((q) => q.status === 'answered').length,
    totalViews: questions.reduce((sum, q) => sum + q.views, 0),
  };

  const handleAnswerSubmit = () => {
    if (!answerText.trim()) {
      alert('Vui lòng nhập câu trả lời');
      return;
    }

    if (!selectedQuestion) return;

    setIsAnswering(true);

    // Simulate API call
    setTimeout(() => {
      setQuestions(
        questions.map((q) =>
          q.id === selectedQuestion.id
            ? {
                ...q,
                status: 'answered',
                answer: answerText,
                answeredAt: new Date(),
              }
            : q
        )
      );

      setAnswerText('');
      setIsAnswering(false);

      // Update selected question
      setSelectedQuestion({
        ...selectedQuestion,
        status: 'answered',
        answer: answerText,
        answeredAt: new Date(),
      });
    }, 1000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return 'Không xác định';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} ngày trước`;
    } else if (diffInHours > 0) {
      return `${diffInHours} giờ trước`;
    } else {
      return 'Vừa xong';
    }
  };

  return (
    <div className="consultant-question">
      {/* Header */}
      <div className="question-header">
        <div className="header-content">
          <h2>❓ Hỏi & Đáp</h2>
          <p>Trả lời các câu hỏi từ người dùng một cách chuyên nghiệp</p>
        </div>

        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.unanswered}</span>
            <span className="stat-label">Chưa trả lời</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.answered}</span>
            <span className="stat-label">Đã trả lời</span>
          </div>
        </div>
      </div>

      <div className="question-content">
        {/* Left Panel - Questions List */}
        <div className="questions-panel">
          <div className="panel-header">
            <div className="tabs">
              <button
                className={`tab ${filterTab === 'unanswered' ? 'active' : ''}`}
                onClick={() => setFilterTab('unanswered')}
              >
                Chưa trả lời ({stats.unanswered})
              </button>
              <button
                className={`tab ${filterTab === 'answered' ? 'active' : ''}`}
                onClick={() => setFilterTab('answered')}
              >
                Đã trả lời ({stats.answered})
              </button>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="questions-list">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className={`question-item ${selectedQuestion?.id === question.id ? 'selected' : ''}`}
                  onClick={() => setSelectedQuestion(question)}
                >
                  <div className="question-item-header">
                    <div
                      className="priority-badge"
                      style={{
                        backgroundColor: getPriorityColor(question.priority),
                      }}
                    >
                      {getPriorityText(question.priority)}
                    </div>
                    <span className="category">{question.category}</span>
                  </div>

                  <h4 className="question-title">{question.title}</h4>

                  <div className="question-meta">
                    <span className="asked-by">👤 {question.askedBy}</span>
                    <span className="asked-time">
                      ⏰ {formatTimeAgo(question.askedAt)}
                    </span>
                    <span className="views">👀 {question.views}</span>
                  </div>

                  {question.status === 'answered' && (
                    <div className="answered-indicator">✅ Đã trả lời</div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span>🤔</span>
                <p>Không có câu hỏi nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Question Detail & Answer */}
        <div className="detail-panel">
          {selectedQuestion ? (
            <div className="question-detail">
              <div className="detail-header">
                <div className="question-info">
                  <div
                    className="priority-badge"
                    style={{
                      backgroundColor: getPriorityColor(
                        selectedQuestion.priority
                      ),
                    }}
                  >
                    {getPriorityText(selectedQuestion.priority)}
                  </div>
                  <span className="category">{selectedQuestion.category}</span>
                </div>

                <h3 className="detail-title">{selectedQuestion.title}</h3>

                <div className="user-info">
                  <div className="user-details">
                    <span>👤 {selectedQuestion.askedBy}</span>
                    <span>🎂 {selectedQuestion.userAge} tuổi</span>
                    <span>
                      ⚥{' '}
                      {selectedQuestion.userGender === 'female' ? 'Nữ' : 'Nam'}
                    </span>
                  </div>
                  <div className="question-time">
                    ⏰ {selectedQuestion.askedAt.toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>

              <div className="question-content-detail">
                <h4>Nội dung câu hỏi:</h4>
                <div className="content-text">{selectedQuestion.content}</div>

                {selectedQuestion.tags && selectedQuestion.tags.length > 0 && (
                  <div className="question-tags">
                    {selectedQuestion.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Existing Answer */}
              {selectedQuestion.status === 'answered' &&
                selectedQuestion.answer && (
                  <div className="existing-answer">
                    <h4>Câu trả lời của bạn:</h4>
                    <div className="answer-content">
                      {selectedQuestion.answer}
                    </div>
                    <div className="answer-time">
                      Trả lời lúc:{' '}
                      {selectedQuestion.answeredAt?.toLocaleString('vi-VN')}
                    </div>
                  </div>
                )}

              {/* Answer Editor */}
              {selectedQuestion.status === 'unanswered' && (
                <div className="answer-editor">
                  <h4>Viết câu trả lời:</h4>
                  <textarea
                    placeholder="Nhập câu trả lời chi tiết và chuyên nghiệp..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    className="answer-textarea"
                    rows="8"
                  />

                  <div className="answer-tools">
                    <div className="character-count">
                      {answerText.length} ký tự
                    </div>

                    <div className="answer-actions">
                      <button
                        className="clear-btn"
                        onClick={() => setAnswerText('')}
                        disabled={!answerText.trim()}
                      >
                        Xóa
                      </button>
                      <button
                        className="submit-btn"
                        onClick={handleAnswerSubmit}
                        disabled={!answerText.trim() || isAnswering}
                      >
                        {isAnswering ? '⏳ Đang gửi...' : '📤 Gửi câu trả lời'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <span>💭</span>
              <h3>Chọn một câu hỏi để xem chi tiết</h3>
              <p>Nhấp vào câu hỏi bên trái để xem nội dung và trả lời</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultantQuestion;
