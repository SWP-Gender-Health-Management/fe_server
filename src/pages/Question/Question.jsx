import React, { useEffect, useState } from 'react';
import HospitalInfo from '@components/Info/HospitalInfo';
import './Question.css';
import axios from 'axios';
import {
  Modal,
  message,
  Input,
  Select,
  Button,
  Card,
  Tag,
  Empty,
  Spin,
} from 'antd';
import {
  CommentOutlined,
  QuestionCircleOutlined,
  PlusCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  UserOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  SendOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useAuth } from '@context/AuthContext';

const { TextArea } = Input;
const { Option } = Select;

const Question = () => {
  const [activeTab, setActiveTab] = useState('my-questions');
  const [myQuestions, setMyQuestions] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [newQuestion, setNewQuestion] = useState({
    content: '',
    category: '',
    title: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoggedIn, userInfo } = useAuth();

  const categories = [
    { value: 'general', label: '🩺 Tư vấn chung', color: '#667eea' },
    { value: 'nutrition', label: '🥗 Dinh dưỡng', color: '#f093fb' },
    { value: 'exercise', label: '🏃‍♀️ Vận động', color: '#4facfe' },
    { value: 'mental', label: '🧠 Sức khỏe tinh thần', color: '#43e97b' },
    { value: 'pregnancy', label: '🤱 Thai kỳ', color: '#fa709a' },
    { value: 'child', label: '👶 Trẻ em', color: '#ffecd2' },
    { value: 'elderly', label: '👴 Người cao tuổi', color: '#a8edea' },
    { value: 'emergency', label: '🚨 Cấp cứu', color: '#ff6b6b' },
  ];

  const fetchMyQuestions = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      const res = await axios.get(
        'http://localhost:3000/question/get-my-questions',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMyQuestions(res.data.questions || res.data || []);
    } catch (error) {
      console.error('Failed to fetch my questions:', error);
      message.error('Không thể tải danh sách câu hỏi của bạn.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchMyQuestions();
    } else {
      setIsLoginModalVisible(true);
    }
  }, [isLoggedIn]);

  const handleSubmitQuestion = async () => {
    if (!isLoggedIn) {
      setIsLoginModalVisible(true);
      return;
    }

    if (
      !newQuestion.title.trim() ||
      !newQuestion.content.trim() ||
      !newQuestion.category
    ) {
      message.warning('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setIsSubmitting(true);
    const accessToken = sessionStorage.getItem('accessToken');
    const customerId = userInfo.accountId;

    const payload = {
      customer_id: customerId,
      title: newQuestion.title,
      content: newQuestion.content,
      category: newQuestion.category,
      status: true,
    };

    try {
      const res = await axios.post(
        'http://localhost:3000/question/create-question',
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMyQuestions([res.data, ...myQuestions]);
      setNewQuestion({ content: '', category: '', title: '' });
      setActiveTab('my-questions');
      message.success(
        'Câu hỏi đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.'
      );
    } catch (error) {
      console.error('Failed to submit question:', error);
      message.error('Không thể gửi câu hỏi. Vui lòng thử lại.');
    }
    setIsSubmitting(false);
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setIsDetailModalVisible(true);
  };

  const getCategoryInfo = (category) => {
    return (
      categories.find((cat) => cat.value === category) || {
        label: '📋 Khác',
        color: '#6c757d',
      }
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="question-page">
        <Modal
          title="Yêu cầu đăng nhập"
          open={isLoginModalVisible}
          onOk={() => setIsLoginModalVisible(false)}
          onCancel={() => setIsLoginModalVisible(false)}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <p>Bạn cần đăng nhập để sử dụng tính năng hỏi đáp!</p>
        </Modal>
        <div className="question-right">
          <HospitalInfo />
        </div>
      </div>
    );
  }

  return (
    <div className="question-page">
      <div className="question-container">
        {/* Header */}
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
              <div className="stat-number">{myQuestions.length}</div>
              <div className="stat-label">Tổng câu hỏi</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {myQuestions.filter((q) => q.answer).length}
              </div>
              <div className="stat-label">Đã trả lời</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`nav-tab ${activeTab === 'my-questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-questions')}
          >
            <QuestionCircleOutlined />
            <span>Câu hỏi của tôi</span>
            <div className="tab-badge">{myQuestions.length}</div>
          </button>
          <button
            className={`nav-tab ${activeTab === 'ask-question' ? 'active' : ''}`}
            onClick={() => setActiveTab('ask-question')}
          >
            <PlusCircleOutlined />
            <span>Đặt câu hỏi mới</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* My Questions Tab */}
          {activeTab === 'my-questions' && (
            <div className="my-questions-section">
              <div className="section-header">
                <h2>Danh sách câu hỏi của bạn</h2>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchMyQuestions}
                  loading={loading}
                >
                  Làm mới
                </Button>
              </div>

              {loading ? (
                <div className="loading-container">
                  <Spin size="large" />
                  <p>Đang tải câu hỏi...</p>
                </div>
              ) : myQuestions.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="empty-description">
                      <h3>Chưa có câu hỏi nào</h3>
                      <p>
                        Hãy đặt câu hỏi đầu tiên để nhận tư vấn từ chuyên gia!
                      </p>
                    </div>
                  }
                >
                  <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => setActiveTab('ask-question')}
                  >
                    Đặt câu hỏi ngay
                  </Button>
                </Empty>
              ) : (
                <div className="questions-grid">
                  {myQuestions.map((question, index) => {
                    const categoryInfo = getCategoryInfo(question.category);
                    return (
                      <Card
                        key={question.id || index}
                        className="question-card"
                        hoverable
                        onClick={() => handleQuestionClick(question)}
                      >
                        <div className="card-header">
                          <Tag
                            color={categoryInfo.color}
                            className="category-tag"
                          >
                            {categoryInfo.label}
                          </Tag>
                          <div
                            className={`status-indicator ${question.answer ? 'answered' : 'pending'}`}
                          >
                            {question.answer ? (
                              <>
                                <CheckCircleOutlined />
                                <span>Đã trả lời</span>
                              </>
                            ) : (
                              <>
                                <ClockCircleOutlined />
                                <span>Chờ trả lời</span>
                              </>
                            )}
                          </div>
                        </div>

                        <h3 className="question-title">{question.title}</h3>
                        <p className="question-preview">
                          {question.content.length > 120
                            ? question.content.substring(0, 120) + '...'
                            : question.content}
                        </p>

                        <div className="card-footer">
                          <div className="question-date">
                            <CalendarOutlined />
                            <span>
                              {formatDate(question.created_at || new Date())}
                            </span>
                          </div>
                          {question.answer && (
                            <div className="answer-available">
                              <MessageOutlined />
                              <span>Có câu trả lời</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Ask Question Tab */}
          {activeTab === 'ask-question' && (
            <div className="ask-question-section">
              <div className="form-container">
                <div className="form-header">
                  <div className="header-icon-large">💬</div>
                  <h2>Đặt câu hỏi cho chuyên gia</h2>
                  <p>
                    Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy chia sẻ vấn đề
                    để nhận được lời tư vấn tốt nhất!
                  </p>
                </div>

                <div className="progress-indicator">
                  <div
                    className={`step ${newQuestion.category ? 'completed' : 'active'}`}
                  >
                    <div className="step-number">1</div>
                    <span>Chọn chủ đề</span>
                  </div>
                  <div
                    className={`step ${newQuestion.title ? 'completed' : newQuestion.category ? 'active' : ''}`}
                  >
                    <div className="step-number">2</div>
                    <span>Viết tiêu đề</span>
                  </div>
                  <div
                    className={`step ${newQuestion.content ? 'completed' : newQuestion.title ? 'active' : ''}`}
                  >
                    <div className="step-number">3</div>
                    <span>Mô tả chi tiết</span>
                  </div>
                </div>

                <div className="question-form">
                  {/* Step 1: Category Selection */}
                  <div className="form-step">
                    <div className="step-header">
                      <h3>🏷️ Bước 1: Chọn chủ đề phù hợp</h3>
                      <p>
                        Giúp chúng tôi hiểu rõ vấn đề của bạn thuộc lĩnh vực nào
                      </p>
                    </div>
                    <div className="category-grid">
                      {categories.map((cat) => (
                        <div
                          key={cat.value}
                          className={`category-card ${newQuestion.category === cat.value ? 'selected' : ''}`}
                          onClick={() =>
                            setNewQuestion({
                              ...newQuestion,
                              category: cat.value,
                            })
                          }
                        >
                          <div className="category-emoji-large">
                            {cat.label.split(' ')[0]}
                          </div>
                          <div className="category-name">
                            {cat.label.substring(cat.label.indexOf(' ') + 1)}
                          </div>
                          {newQuestion.category === cat.value && (
                            <div className="selected-check">✓</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Title */}
                  {newQuestion.category && (
                    <div className="form-step fade-in">
                      <div className="step-header">
                        <h3>📝 Bước 2: Viết tiêu đề câu hỏi</h3>
                        <p>Hãy tóm tắt vấn đề của bạn trong một câu ngắn gọn</p>
                      </div>
                      <div className="input-container">
                        <Input
                          placeholder="Ví dụ: Đau đầu kéo dài 3 ngày, có cần lo lắng không?"
                          value={newQuestion.title}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              title: e.target.value,
                            })
                          }
                          maxLength={100}
                          size="large"
                          className="form-input-enhanced"
                          prefix={
                            <MessageOutlined style={{ color: '#667eea' }} />
                          }
                        />
                        <div className="input-footer">
                          <span className="char-counter">
                            {newQuestion.title.length}/100 ký tự
                          </span>
                          {newQuestion.title.length >= 10 && (
                            <span className="validation-success">
                              ✓ Tiêu đề tốt!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Detailed Description */}
                  {newQuestion.title && (
                    <div className="form-step fade-in">
                      <div className="step-header">
                        <h3>📋 Bước 3: Mô tả chi tiết vấn đề</h3>
                        <p>
                          Càng chi tiết, bác sĩ càng có thể tư vấn chính xác cho
                          bạn
                        </p>
                      </div>

                      <div className="description-helper">
                        <h4>💡 Gợi ý những thông tin nên bao gồm:</h4>
                        <div className="helper-tags">
                          <div
                            className="helper-tag"
                            onClick={() => {
                              const current = newQuestion.content;
                              const addition = current
                                ? '\n• Triệu chứng: '
                                : '• Triệu chứng: ';
                              setNewQuestion({
                                ...newQuestion,
                                content: current + addition,
                              });
                            }}
                          >
                            🔸 Triệu chứng cụ thể
                          </div>
                          <div
                            className="helper-tag"
                            onClick={() => {
                              const current = newQuestion.content;
                              const addition = current
                                ? '\n• Thời gian: '
                                : '• Thời gian: ';
                              setNewQuestion({
                                ...newQuestion,
                                content: current + addition,
                              });
                            }}
                          >
                            ⏰ Thời gian xuất hiện
                          </div>
                          <div
                            className="helper-tag"
                            onClick={() => {
                              const current = newQuestion.content;
                              const addition = current
                                ? '\n• Mức độ: '
                                : '• Mức độ: ';
                              setNewQuestion({
                                ...newQuestion,
                                content: current + addition,
                              });
                            }}
                          >
                            📊 Mức độ nghiêm trọng
                          </div>
                          <div
                            className="helper-tag"
                            onClick={() => {
                              const current = newQuestion.content;
                              const addition = current
                                ? '\n• Thuốc đang dùng: '
                                : '• Thuốc đang dùng: ';
                              setNewQuestion({
                                ...newQuestion,
                                content: current + addition,
                              });
                            }}
                          >
                            💊 Thuốc đang sử dụng
                          </div>
                        </div>
                      </div>

                      <div className="textarea-container">
                        <TextArea
                          placeholder="Ví dụ: Tôi bị đau đầu từ 3 ngày nay, đau âm ỉ ở vùng thái dương, tăng nặng vào buổi chiều. Không có sốt, ăn uống bình thường. Trước đây chưa từng bị như vậy..."
                          value={newQuestion.content}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              content: e.target.value,
                            })
                          }
                          rows={6}
                          maxLength={1000}
                          className="form-textarea-enhanced"
                        />
                        <div className="textarea-footer">
                          <span className="char-counter">
                            {newQuestion.content.length}/1000 ký tự
                          </span>
                          {newQuestion.content.length >= 50 && (
                            <span className="validation-success">
                              ✓ Mô tả chi tiết tốt!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Section */}
                  {newQuestion.category &&
                    newQuestion.title &&
                    newQuestion.content && (
                      <div className="submit-section fade-in">
                        <div className="submit-preview">
                          <h4>🔍 Xem lại câu hỏi của bạn:</h4>
                          <div className="preview-card">
                            <div className="preview-category">
                              {
                                categories.find(
                                  (cat) => cat.value === newQuestion.category
                                )?.label
                              }
                            </div>
                            <div className="preview-title">
                              {newQuestion.title}
                            </div>
                            <div className="preview-content">
                              {newQuestion.content.length > 100
                                ? newQuestion.content.substring(0, 100) + '...'
                                : newQuestion.content}
                            </div>
                          </div>
                        </div>

                        <div className="form-actions">
                          <Button
                            type="primary"
                            size="large"
                            onClick={handleSubmitQuestion}
                            loading={isSubmitting}
                            icon={<SendOutlined />}
                            className="submit-button-enhanced"
                            disabled={
                              !newQuestion.category ||
                              !newQuestion.title.trim() ||
                              !newQuestion.content.trim()
                            }
                          >
                            {isSubmitting
                              ? 'Đang gửi câu hỏi...'
                              : '🚀 Gửi câu hỏi ngay'}
                          </Button>
                          <Button
                            size="large"
                            onClick={() =>
                              setNewQuestion({
                                content: '',
                                category: '',
                                title: '',
                              })
                            }
                            className="clear-button"
                            icon={<ReloadOutlined />}
                          >
                            Làm mới form
                          </Button>
                        </div>

                        <div className="confidence-note">
                          <div className="confidence-icon">🛡️</div>
                          <div className="confidence-text">
                            <strong>An tâm tuyệt đối:</strong> Thông tin của bạn
                            được bảo mật hoàn toàn. Chúng tôi cam kết phản hồi
                            trong vòng 2-4 giờ làm việc.
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Question Detail Modal */}
        <Modal
          title="Chi tiết câu hỏi"
          open={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={null}
          width={800}
          className="question-detail-modal"
        >
          {selectedQuestion && (
            <div className="question-detail">
              <div className="detail-header">
                <Tag
                  color={getCategoryInfo(selectedQuestion.category).color}
                  className="detail-category"
                >
                  {getCategoryInfo(selectedQuestion.category).label}
                </Tag>
                <div
                  className={`detail-status ${selectedQuestion.answer ? 'answered' : 'pending'}`}
                >
                  {selectedQuestion.answer ? (
                    <>
                      <CheckCircleOutlined />
                      <span>Đã trả lời</span>
                    </>
                  ) : (
                    <>
                      <ClockCircleOutlined />
                      <span>Chờ trả lời</span>
                    </>
                  )}
                </div>
              </div>

              <h2 className="detail-title">{selectedQuestion.title}</h2>

              <div className="detail-meta">
                <div className="meta-item">
                  <UserOutlined />
                  <span>Người hỏi: {userInfo.fullName || 'Bạn'}</span>
                </div>
                <div className="meta-item">
                  <CalendarOutlined />
                  <span>
                    {formatDate(selectedQuestion.created_at || new Date())}
                  </span>
                </div>
              </div>

              <div className="question-content">
                <h4>Câu hỏi:</h4>
                <div className="content-text">
                  {selectedQuestion.content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>

              {selectedQuestion.answer ? (
                <div className="answer-section">
                  <h4>Câu trả lời:</h4>
                  <div className="answer-content">
                    <div className="answer-header">
                      <div className="doctor-info">
                        <span className="doctor-name">
                          🩺 {selectedQuestion.doctorName || 'Bác sĩ tư vấn'}
                        </span>
                        <span className="answer-date">
                          {formatDate(
                            selectedQuestion.answer_date || new Date()
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="answer-text">
                      {selectedQuestion.answer
                        .split('\n')
                        .map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-answer">
                  <div className="no-answer-content">
                    <ClockCircleOutlined />
                    <h4>Đang chờ phản hồi</h4>
                    <p>
                      Câu hỏi của bạn đang được xem xét bởi chuyên gia. Chúng
                      tôi sẽ trả lời sớm nhất có thể!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>

      <div className="question-sidebar">
        <HospitalInfo />
      </div>
    </div>
  );
};

export default Question;
