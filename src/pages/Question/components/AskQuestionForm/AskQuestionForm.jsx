import React from 'react';
import { Button } from 'antd';
import { SendOutlined, ReloadOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import HospitalInfo from '@components/Info/HospitalInfo';
import './AskQuestionForm.css';

const { TextArea } = Input;

const AskQuestionForm = ({
  newQuestion,
  setNewQuestion,
  isSubmitting,
  onSubmit,
  onClear,
}) => {
  return (
    <div className="ask-question-section">
      <div className="form-container">
        <div className="form-header">
          <div className="header-icon-large">💬</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>
            Đặt câu hỏi cho chuyên gia
          </h2>
          <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
            Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy chia sẻ vấn đề để nhận
            được lời tư vấn tốt nhất!
          </p>
        </div>

        <div className="question-form">
          <div className="form-step fade-in">
            <div className="step-header">
              <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>
                📋 Mô tả chi tiết vấn đề
              </h3>
              <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
                Càng chi tiết, bác sĩ càng có thể tư vấn chính xác cho bạn
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
                    const addition = current ? '\n• Mức độ: ' : '• Mức độ: ';
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
                maxLength={1000}
                className="form-textarea-enhanced"
                autoSize={{ minRows: 6, maxRows: 16 }}
                style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  padding: '16px',
                  borderRadius: '8px',
                }}
              />
              <div className="textarea-footer">
                <span className="char-counter" style={{ fontSize: '14px' }}>
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
                    style={{
                      fontSize: '15px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      padding: '12px 0',
                    }}
                  >
                    {newQuestion.content}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <Button
                  type="primary"
                  size="large"
                  onClick={onSubmit}
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
                  {isSubmitting ? 'Đang gửi câu hỏi...' : '🚀 Gửi câu hỏi ngay'}
                </Button>
                <Button
                  size="large"
                  onClick={onClear}
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
                  <strong>An tâm tuyệt đối:</strong> Thông tin của bạn được bảo
                  mật hoàn toàn. Chúng tôi cam kết phản hồi trong vòng 2-4 giờ
                  làm việc.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hospital Info */}
      <div style={{ marginTop: '40px' }}>
        <HospitalInfo />
      </div>
    </div>
  );
};

export default AskQuestionForm;
