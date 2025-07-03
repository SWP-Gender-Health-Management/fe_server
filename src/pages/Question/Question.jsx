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
import Cookies from 'js-cookie';

const { TextArea } = Input;
const { Option } = Select;

const Question = () => {
  const [activeTab, setActiveTab] = useState('my-questions');
  const [myQuestions, setMyQuestions] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const accessToken = Cookies.get('accessToken');
  const customerId = Cookies.get('accountId');
  // Form states
  const [newQuestion, setNewQuestion] = useState({
    content: '',
    customer_id: customerId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoggedIn, userInfo } = useAuth();

  const fetchMyQuestions = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/question/get-question-by-id/customer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Fetched questions:', res.data.result);
      setMyQuestions(res.data.result || []);
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

    if (!newQuestion.content.trim()) {
      message.warning('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customer_id: customerId,
      content: newQuestion.content,
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

      fetchMyQuestions(); // Refresh the question list
      setNewQuestion({ content: '' });
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
                {myQuestions.filter((q) => q.reply).length}
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
                    return (
                      <Card
                        key={question.ques_id || index}
                        className="question-card"
                        hoverable
                        onClick={() => handleQuestionClick(question)}
                      >
                        <div className="card-header">
                          <div
                            className={`status-indicator ${question.reply ? 'answered' : 'pending'}`}
                          >
                            {question.reply ? (
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
                          {question.reply && (
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
                  <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>
                    Đặt câu hỏi cho chuyên gia
                  </h2>
                  <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
                    Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy chia sẻ vấn đề
                    để nhận được lời tư vấn tốt nhất!
                  </p>
                </div>

                <div className="progress-indicator">
                  <div
                    className={`step ${newQuestion.content ? 'completed' : ''}`}
                  >
                    <div className="step-number">📋</div>
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>
                      Mô tả chi tiết
                    </span>
                  </div>
                </div>

                <div className="question-form">
                  {/* Detailed Description */}
                  {
                    <div className="form-step fade-in">
                      <div className="step-header">
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>
                          📋 Mô tả chi tiết vấn đề
                        </h3>
                        <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
                          Càng chi tiết, bác sĩ càng có thể tư vấn chính xác cho
                          bạn
                        </p>
                      </div>

                      <div className="description-helper">
                        <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          💡 Gợi ý những thông tin nên bao gồm:
                        </h4>
                        <div className="helper-tags">
                          <div
                            className="helper-tag"
                            style={{ fontSize: '14px', padding: '8px 12px' }}
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
                            style={{ fontSize: '14px', padding: '8px 12px' }}
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
                            style={{ fontSize: '14px', padding: '8px 12px' }}
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
                            style={{ fontSize: '14px', padding: '8px 12px' }}
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
                          rows={8}
                          maxLength={1000}
                          className="form-textarea-enhanced"
                          style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            padding: '16px',
                            borderRadius: '8px',
                          }}
                        />
                        <div className="textarea-footer">
                          <span
                            className="char-counter"
                            style={{ fontSize: '14px' }}
                          >
                            {newQuestion.content.length}/1000 ký tự
                          </span>
                          {newQuestion.content.length >= 50 && (
                            <span
                              className="validation-success"
                              style={{ fontSize: '14px' }}
                            >
                              ✓ Mô tả chi tiết tốt!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  }

                  {/* Submit Section */}
                  {newQuestion.content && (
                    <div className="submit-section fade-in">
                      <div className="submit-preview">
                        <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          🔍 Xem lại câu hỏi của bạn:
                        </h4>
                        <div className="preview-card">
                          <div
                            className="preview-content"
                            style={{ fontSize: '15px', lineHeight: '1.5' }}
                          >
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
                          style={{
                            fontSize: '16px',
                            height: '50px',
                            fontWeight: 'bold',
                          }}
                          disabled={!newQuestion.content.trim()}
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
                            })
                          }
                          className="clear-button"
                          style={{
                            fontSize: '16px',
                            height: '50px',
                          }}
                          icon={<ReloadOutlined />}
                        >
                          Làm mới form
                        </Button>
                      </div>

                      <div className="confidence-note">
                        <div className="confidence-icon">🛡️</div>
                        <div
                          className="confidence-text"
                          style={{ fontSize: '15px', lineHeight: '1.5' }}
                        >
                          <strong>An tâm tuyệt đối:</strong> Thông tin của bạn
                          được bảo mật hoàn toàn. Chúng tôi cam kết phản hồi
                          trong vòng 2-4 giờ làm việc.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Hospital Info moved here */}
              <div style={{ marginTop: '40px' }}>
                <HospitalInfo />
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
                <div
                  className={`detail-status ${selectedQuestion.reply ? 'answered' : 'pending'}`}
                >
                  {selectedQuestion.reply ? (
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

              {selectedQuestion.reply ? (
                <div className="answer-section">
                  <h4>Câu trả lời:</h4>
                  <div className="answer-content">
                    <div className="answer-header">
                      <div className="doctor-info">
                        <span className="doctor-name">
                          🩺{' '}
                          {'Tư vấn viên ' +
                            (selectedQuestion.reply.consultant.full_name || '')}
                        </span>
                        <span className="answer-date">
                          {formatDate(
                            selectedQuestion.reply.created_at || new Date()
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="answer-text">
                      {selectedQuestion.reply.content
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
    </div>
  );
};

export default Question;
