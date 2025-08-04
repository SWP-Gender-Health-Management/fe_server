import React, { useEffect, useState } from 'react';
import {
  List,
  Pagination,
  Empty,
  Spin,
  Button,
  Input,
  Select,
  Modal,
} from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
  UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import './QuestionList.css';

const { Option } = Select;

// QuestionFilters Component (merged)
const QuestionFilters = ({
  searchText,
  setSearchText,
  statusFilter,
  onStatusChange,
  onSearch,
}) => {
  return (
    <div className="ques-filter-bar">
      <Input.Search
        placeholder="Tìm kiếm nội dung câu hỏi..."
        className="ques-search-input"
        allowClear
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          // Không tự động fetch khi typing để tránh spam API
        }}
        onSearch={(value) => {
          console.log('Search triggered with value:', value);
          onSearch(value);
        }}
      />
      <Select
        value={statusFilter}
        onChange={onStatusChange}
        style={{ width: 180 }}
        placeholder="Lọc theo trạng thái"
      >
        <Option value="all">Tất cả trạng thái</Option>
        <Option value="answered">Đã trả lời</Option>
        <Option value="pending">Chưa trả lời</Option>
      </Select>
    </div>
  );
};

// QuestionDetailModal Component (merged)
const QuestionDetailModal = ({
  visible,
  onCancel,
  selectedQuestion,
  userInfo,
  formatDate,
}) => {
  if (!selectedQuestion) return null;
  useEffect(() => {
    console.log("selectedQuestion.reply: " , selectedQuestion.reply);
    
  }, [])
  return (
    <Modal
      title="Chi tiết câu hỏi"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="question-detail-modal"
    >
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
            <span>Người hỏi: {userInfo?.fullName || 'Bạn'}</span>
          </div>
          <div className="meta-item">
            <CalendarOutlined />
            <span>{formatDate(selectedQuestion.created_at || new Date())}</span>
          </div>
        </div>

        <div className="question-content">
          <h4>Câu hỏi:</h4>
          <div className="content-text">
            {selectedQuestion?.content.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
            {/* {selectedQuestion?.content} */}
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
                      (selectedQuestion.reply.consultant?.full_name || '')}
                  </span>
                  <span className="answer-date">
                    {formatDate(
                      selectedQuestion.reply.created_at || new Date()
                    )}
                  </span>
                </div>
              </div>
              <div className="answer-text">
                {selectedQuestion?.reply?.content
                  .split('\n')
                  .map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                {/* {selectedQuestion?.reply?.content} */}
              </div>
            </div>
          </div>
        ) : (
          <div className="no-answer">
            <div className="no-answer-content">
              <ClockCircleOutlined />
              <h4>Đang chờ phản hồi</h4>
              <p>
                Câu hỏi của bạn đang được xem xét bởi chuyên gia. Chúng tôi sẽ
                trả lời sớm nhất có thể!
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

// Main QuestionList Component
const QuestionList = ({
  loading,
  questions,
  searchText,
  setSearchText,
  statusFilter,
  currentPage,
  pageSize,
  totalQuestions,
  onRefresh,
  onSearch,
  onStatusChange,
  onPageChange,
  formatDate,
  setActiveTab,
  userInfo,
}) => {
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setIsDetailModalVisible(true);
  };

  console.log('Kiểm tra dữ liệu câu hỏi:', questions);

  return (
    <div className="my-questions-section">
      {/* Section Header */}
      <div className="section-header-1">
        <h2>Danh sách câu hỏi của bạn</h2>
        <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
          Làm mới
        </Button>
      </div>

      {/* Filters */}
      <QuestionFilters
        searchText={searchText}
        setSearchText={setSearchText}
        statusFilter={statusFilter}
        onStatusChange={onStatusChange}
        onSearch={onSearch}
      />

      {/* Question List Content */}
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
          <p>Đang tải câu hỏi...</p>
        </div>
      ) : questions.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="empty-description">
              <h3>Không tìm thấy câu hỏi phù hợp</h3>
              <p>Hãy thử thay đổi bộ lọc hoặc đặt câu hỏi mới!</p>
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
        <>
          <List
            itemLayout="vertical"
            dataSource={questions}
            renderItem={(question) => (
              <List.Item
                key={question.ques_id}
                className="question-list-item"
                onClick={() => handleQuestionClick(question)}
                style={{
                  cursor: 'pointer',
                  background: '#fff',
                  marginBottom: 12,
                  borderRadius: 8,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    className={`question-status-indicator ${question.reply ? 'answered' : 'pending'}`}
                    style={{ minWidth: 110 }}
                  >
                    {question.reply ? (
                      <>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />{' '}
                        <span>Đã trả lời</span>
                      </>
                    ) : (
                      <>
                        <ClockCircleOutlined style={{ color: '#faad14' }} />{' '}
                        <span>Chờ trả lời</span>
                      </>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      className="question-preview"
                      style={{ fontWeight: 500, fontSize: 16 }}
                    >
                      {question.content.length > 100
                        ? question.content.substring(0, 100) + '...'
                        : question.content}
                    </div>
                    <div
                      style={{
                        color: '#888',
                        fontSize: 13,
                        marginTop: 4,
                      }}
                    >
                      <CalendarOutlined />{' '}
                      {formatDate(question.created_at || new Date())}
                    </div>
                  </div>
                  {question.reply && (
                    <div
                      className="answer-available"
                      style={{ color: '#1890ff', fontWeight: 500 }}
                    >
                      <MessageOutlined /> <span>Có câu trả lời</span>
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Pagination
              className="question-pagination"
              current={currentPage}
              pageSize={pageSize}
              total={totalQuestions}
              onChange={onPageChange}
              showSizeChanger={false}
              showQuickJumper
              showLessItems={false}
            />
          </div>
        </>
      )}

      {/* Question Detail Modal */}
      <QuestionDetailModal
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        selectedQuestion={selectedQuestion}
        userInfo={userInfo}
        formatDate={formatDate}
      />
    </div>
  );
};

export default QuestionList;
