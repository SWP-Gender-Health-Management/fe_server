import React, { useState } from 'react';
import './QuestionModal.css';

const QuestionModal = ({ question, onClose, onReply }) => {
  const [reply, setReply] = useState((question.reply) ? question.reply.content : '');

  // Kiểm tra nếu question không hợp lệ
  if (!question) {
    return <div>Không có dữ liệu câu hỏi</div>; // Fallback UI
  }

  const handleReplySubmit = () => {
    if (!reply.trim()) {
      alert('Vui lòng nhập câu trả lời.');
      return;
    }
    onReply(question.ques_id, reply);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('vi-VN') +
      ' ' +
      date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    );
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="question-modal-backdrop" onClick={handleBackdropClick}>
      <div className="question-modal">
        <div className="modal-header">
          <h2>Chi Tiết Câu Hỏi</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="question-details">
            {/* Customer Profile Section */}
            <div className="detail-section">
              <h3>Thông Tin Khách Hàng</h3>
              <div className="customer-profile">
                <div className="customer-avatar">
                  <span>👤</span>
                </div>
                <div className="customer-info">
                  <div className="detail-row">
                    <label>Tên:</label>
                    <span>{question.customer.full_name}</span>
                  </div>
                  <div className="detail-row">
                    <label>Ngày sinh:</label>
                    <span>
                      {new Date(question.customer.dob).toLocaleDateString(
                        'vi-VN'
                      )}{' '}
                      ({calculateAge(question.customer.dob)} tuổi)
                    </span>
                  </div>
                  <div className="detail-row">
                    <label>Số điện thoại:</label>
                    <span>{question.customer.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Content Section */}
            <div className="detail-section">
              <h3>Nội Dung Câu Hỏi</h3>
              <div className="question-meta">
                <span className="question-date">
                  <strong>Ngày gửi:</strong> {formatDate(question.created_at)}
                </span>
                <span className={`status-badge status-${question.reply ? 'replied' : 'unreplied'}`}>
                  {question.reply ? 'Đã trả lời' : 'Chưa trả lời'}
                </span>
              </div>
              <div className="question-content-box">{question.content}</div>
            </div>

            {/* Reply Section */}
            <div className="detail-section">
              <h3>
                {question.reply ? 'Câu Trả Lời' : 'Trả Lời Câu Hỏi'}
              </h3>
              {!question.reply ? (
                <div className="reply-form">
                  <textarea
                    className="reply-textarea"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Nhập câu trả lời chi tiết cho khách hàng..."
                    rows="6"
                  />
                  <div className="reply-tips">
                    <strong>💡 Lưu ý khi trả lời:</strong>
                    <ul>
                      <li>Cung cấp thông tin chính xác và hữu ích</li>
                      <li>Sử dụng ngôn ngữ dễ hiểu, thân thiện</li>
                      <li>
                        Khuyến khích khách hàng tìm kiếm tư vấn trực tiếp nếu
                        cần
                      </li>
                      <li>Tránh đưa ra chẩn đoán y khoa cụ thể</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="existing-reply">
                  <div className="reply-content-box">{question.reply.content}</div>
                  <div className="reply-meta">
                    <span>
                      <strong>Trả lời bởi:</strong> {question.reply.consultant.full_name}
                    </span>
                    <span>
                      <strong>Thời gian:</strong>{' '}
                      {formatDate(question.reply.created_at)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          {!question.reply ? (
            <>
              <button className="btn btn-primary" onClick={handleReplySubmit}>
                <span>📤</span> Gửi trả lời
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
            </>
          ) : (
            <button className="btn btn-secondary" onClick={onClose}>
              Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
