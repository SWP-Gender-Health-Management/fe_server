import React, { useState, useEffect } from 'react';
import './ConsultantQuestion.css';
import axios from 'axios';
import Cookies from 'js-cookie'; // Thêm import Cookies

const ConsultantQuestion = ({questions = [], fetchQuestions}) => {
  // const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [filterTab, setFilterTab] = useState('unanswered'); // 'unanswered' or 'answered'
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);
  const accountId = Cookies.get('accountId') || 'default_account_id'; // Lấy accountId từ cookie hoặc giá trị mặc định
  const accessToken = Cookies.get('accessToken'); // Lấy accessToken từ cookie

  // const fetchQuestions = async () => {
  //   // Simulate fetching questions from an API
  //   try {
  //     const responseUnreplied = await axios.get(
  //       'http://localhost:3000/question/get-unreplied-questions',
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`
  //         }
  //       });
  //     const responseReplied = await axios.get(
  //       `http://localhost:3000/question/get-question-by-id/consultant/${accountId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`
  //         }
  //       });
  //     const unrepliedQuestions = responseUnreplied.data.result || [];
  //     const repliedQuestions = responseReplied.data.result || [];
  //     setQuestions([...unrepliedQuestions, ...repliedQuestions]);
  //   } catch (error) {
  //     console.error('Error fetching questions:', error);
  //   }
  // }

  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const dobDate = new Date(dob);
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  // Filter questions based on tab and search
  const filteredQuestions = questions
    .filter((question) => {
      const matchesTab =
        filterTab === 'all' ||
        (filterTab === 'unanswered' && !question.reply) ||
        (filterTab === 'answered' && question.reply);

      const matchesSearch =
        question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.customer.full_name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
    })

  const stats = {
    total: questions.length,
    unanswered: questions.filter((q) => !q.reply).length,
    answered: questions.filter((q) => q.reply).length,
  };

  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) {
      alert('Vui lòng nhập câu trả lời');
      return;
    }

    if (!selectedQuestion) return;

    setIsAnswering(true);

    const payload = {
      ques_id: selectedQuestion.ques_id,
      content: answerText,
      consultant_id: accountId,
    };

    try {
      const response = await axios.post(
        'http://localhost:3000/reply/create-reply',
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            contentType: 'application/json',
          }
        }
      );
    } catch (error) {
      console.error('Error answering question:', error);
    } finally {
      setIsAnswering(false);
      setAnswerText('');
      fetchQuestions(); // Refresh questions after answering
      setSelectedQuestion(null); // Clear selected question after answering
    }
  }

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
                  key={question.ques_id}
                  className={`question-item ${selectedQuestion?.ques_id === question.ques_id ? 'selected' : ''} row`}
                  onClick={() => setSelectedQuestion(question)}
                >

                  <h4 className="question-title col-md-8">{question.content.substring(0, 50)}...</h4>

                  <div className="question-meta col-md-2">
                    <span className="asked-by">👤 {question.askedBy}</span>
                    <span className="asked-time">
                      ⏰ {formatTimeAgo(question.created_at)}
                    </span>
                  </div>

                  {question.reply && (
                    <div className="answered-indicator col-md-2">✅ Đã trả lời</div>
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

                <div className="user-info">
                  <div className="user-details">
                    <span>👤 {selectedQuestion.askedBy}</span>
                    <span>🎂 {calculateAge(selectedQuestion.customer.dob)} tuổi</span>
                    <span>
                      ⚥{' '}
                      {selectedQuestion.customer.gender === 'female' ? 'Nữ' : 'Nam'}
                    </span>
                  </div>
                  <div className="question-time">
                    ⏰ {selectedQuestion.created_at.toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>

              <div className="question-content-detail">
                <h4>Nội dung câu hỏi:</h4>
                <div className="content-text">{selectedQuestion.content}</div>
              </div>

              {/* Existing Answer */}
              {selectedQuestion.reply && (
                <div className="existing-answer">
                  <h4>Câu trả lời của bạn:</h4>
                  <div className="answer-content">
                    {selectedQuestion.reply.content}
                  </div>
                  <div className="answer-time">
                    Trả lời lúc:{' '}
                    {selectedQuestion.reply.created_at?.toLocaleString('vi-VN')}
                  </div>
                </div>
              )}

              {/* Answer Editor */}
              {!selectedQuestion.reply && (
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
