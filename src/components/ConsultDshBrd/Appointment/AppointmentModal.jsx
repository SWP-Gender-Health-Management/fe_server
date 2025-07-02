import React, { useState, useEffect } from 'react';
import './AppointmentModal.css';

const AppointmentModal = ({
  appointment,
  onClose,
  onAccept,
  onReject,
  onDone,
}) => {
  const [report, setReport] = useState(appointment.report || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [reportTemplate, setReportTemplate] = useState('');

  // Report templates for different categories
  const reportTemplates = {
    reproductive_health: `Đánh giá sức khỏe sinh sản:
- Triệu chứng chính: 
- Tình trạng sức khỏe hiện tại: 
- Lịch sử bệnh án: 
- Khuyến nghị: 
- Theo dõi: `,

    family_planning: `Tư vấn kế hoạch hóa gia đình:
- Nhu cầu và mong muốn: 
- Phương pháp được khuyến nghị: 
- Lợi ích và rủi ro: 
- Hướng dẫn sử dụng: 
- Lịch tái khám: `,

    sexual_health: `Tư vấn sức khỏe tình dục:
- Vấn đề được thảo luận: 
- Tình trạng hiện tại: 
- Tư vấn và hướng dẫn: 
- Biện pháp phòng tránh: 
- Theo dõi và tái khám: `,

    mens_health: `Tư vấn nam khoa:
- Triệu chứng và vấn đề: 
- Khám lâm sàng: 
- Chẩn đoán sơ bộ: 
- Phương pháp điều trị: 
- Lịch tái khám: `,

    pregnancy: `Tư vấn thai kỳ:
- Tuần thai hiện tại: 
- Tình trạng sức khỏe mẹ: 
- Kết quả xét nghiệm: 
- Tư vấn chăm sóc: 
- Lịch khám tiếp theo: `,

    fertility: `Tư vấn hiếm muộn:
- Thời gian cố gắng thụ thai: 
- Yếu tố ảnh hưởng: 
- Xét nghiệm cần thiết: 
- Phương pháp hỗ trợ: 
- Kế hoạch theo dõi: `,

    gynecology: `Tư vấn phụ khoa:
- Triệu chứng chính: 
- Khám lâm sàng: 
- Chẩn đoán: 
- Phương pháp điều trị: 
- Hướng dẫn chăm sóc: `,

    contraception: `Tư vấn tránh thai:
- Phương pháp hiện tại: 
- Phương pháp được tư vấn: 
- Hiệu quả và tác dụng phụ: 
- Hướng dẫn sử dụng: 
- Theo dõi: `,
  };

  useEffect(() => {
    if (appointment.category && reportTemplates[appointment.category]) {
      setReportTemplate(reportTemplates[appointment.category]);
    }
  }, [appointment.category]);

  const handleAccept = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onAccept(appointment.id);
    setIsLoading(false);
  };

  const handleReject = async () => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn từ chối cuộc hẹn này?\nLý do từ chối sẽ được gửi tới khách hàng.'
      )
    ) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      onReject(appointment.id);
      setIsLoading(false);
    }
  };

  const handleDone = async () => {
    if (!report.trim()) {
      alert('Vui lòng nhập báo cáo tư vấn trước khi hoàn thành.');
      return;
    }

    if (report.trim().length < 50) {
      alert(
        'Báo cáo quá ngắn. Vui lòng mô tả chi tiết hơn (ít nhất 50 ký tự).'
      );
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onDone(appointment.id, report);
    setIsLoading(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'unaccepted':
        return 'Chờ xác nhận';
      case 'accepted':
        return 'Đã xác nhận';
      case 'done':
        return 'Đã hoàn thành';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unaccepted':
        return '#ffc107';
      case 'accepted':
        return '#007bff';
      case 'done':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴 Cao';
      case 'medium':
        return '🟡 Trung bình';
      case 'low':
        return '🟢 Thấp';
      default:
        return '🟡 Trung bình';
    }
  };

  const getCategoryText = (category) => {
    const categories = {
      reproductive_health: '🌸 Sức khỏe sinh sản',
      family_planning: '👨‍👩‍👧‍👦 Kế hoạch hóa gia đình',
      sexual_health: '💕 Sức khỏe tình dục',
      mens_health: '👨 Nam khoa',
      pregnancy: '🤱 Thai kỳ',
      fertility: '🌱 Hiếm muộn',
      gynecology: '🌺 Phụ khoa',
      contraception: '💊 Tránh thai',
    };
    return categories[category] || '🏥 Tư vấn chung';
  };

  const getSlotTime = (slot) => {
    const times = {
      1: '08:00 - 09:00',
      2: '09:00 - 10:00',
      3: '10:00 - 11:00',
      4: '11:00 - 12:00',
      5: '14:00 - 15:00',
      6: '15:00 - 16:00',
      7: '16:00 - 17:00',
      8: '17:00 - 18:00',
    };
    return times[slot] || `Slot ${slot}`;
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN');
  };

  const useTemplate = () => {
    setReport(reportTemplate);
  };

  const clearReport = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ báo cáo?')) {
      setReport('');
    }
  };

  const wordCount = report
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = report.length;

  return (
    <div className="appointment-modal-backdrop" onClick={handleBackdropClick}>
      <div className="appointment-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <h2>📋 Chi Tiết Cuộc Hẹn</h2>
            <div className="appointment-meta">
              <span className="appointment-id-badge">{appointment.id}</span>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(appointment.status) }}
              >
                {getStatusText(appointment.status)}
              </span>
              <span className="priority-badge">
                {getPriorityText(appointment.priority)}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} disabled={isLoading}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          <div className="appointment-details">
            {/* Basic Information */}
            <div className="detail-section">
              <h3>📅 Thông Tin Cuộc Hẹn</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>📆 Ngày hẹn:</label>
                  <span>
                    {new Date(appointment.date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="detail-item">
                  <label>🕐 Giờ hẹn:</label>
                  <span>{getSlotTime(appointment.slot)}</span>
                </div>
                <div className="detail-item">
                  <label>🏷️ Loại tư vấn:</label>
                  <span>{getCategoryText(appointment.category)}</span>
                </div>
                <div className="detail-item">
                  <label>📝 Đăng ký lúc:</label>
                  <span>{formatDateTime(appointment.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="detail-section">
              <h3>👤 Thông Tin Khách Hàng</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>👤 Họ tên:</label>
                  <span>{appointment.customerName}</span>
                </div>
                <div className="detail-item">
                  <label>📞 Điện thoại:</label>
                  <span>
                    <a href={`tel:${appointment.customerPhone}`}>
                      {appointment.customerPhone}
                    </a>
                  </span>
                </div>
                <div className="detail-item">
                  <label>🎂 Ngày sinh:</label>
                  <span>
                    {new Date(appointment.customerDOB).toLocaleDateString(
                      'vi-VN'
                    )}{' '}
                    (
                    {new Date().getFullYear() -
                      new Date(appointment.customerDOB).getFullYear()}{' '}
                    tuổi)
                  </span>
                </div>
                {appointment.customerEmail && (
                  <div className="detail-item">
                    <label>📧 Email:</label>
                    <span>
                      <a href={`mailto:${appointment.customerEmail}`}>
                        {appointment.customerEmail}
                      </a>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Problem Description */}
            <div className="detail-section">
              <h3>💬 Mô Tả Vấn Đề</h3>
              <div className="description-box">{appointment.description}</div>
            </div>

            {/* Report Section */}
            {(appointment.status === 'accepted' ||
              appointment.status === 'done') && (
              <div className="detail-section report-section">
                <div className="report-header">
                  <h3>📄 Báo Cáo Tư Vấn</h3>
                  {appointment.status === 'accepted' && (
                    <div className="report-tools">
                      <button
                        type="button"
                        className="btn btn-template"
                        onClick={useTemplate}
                        disabled={isLoading}
                      >
                        📋 Dùng mẫu
                      </button>
                      <button
                        type="button"
                        className="btn btn-clear"
                        onClick={clearReport}
                        disabled={isLoading || !report.trim()}
                      >
                        🗑️ Xóa
                      </button>
                      <button
                        type="button"
                        className="btn btn-preview"
                        onClick={() => setShowReportPreview(!showReportPreview)}
                        disabled={isLoading || !report.trim()}
                      >
                        👁️ {showReportPreview ? 'Ẩn' : 'Xem trước'}
                      </button>
                    </div>
                  )}
                </div>

                {appointment.status === 'accepted' ? (
                  <div className="report-editor">
                    <div className="editor-header">
                      <div className="editor-stats">
                        <span className="char-count">📝 {charCount} ký tự</span>
                        <span className="word-count">📊 {wordCount} từ</span>
                        <span
                          className={`min-requirement ${charCount >= 50 ? 'met' : 'not-met'}`}
                        >
                          {charCount >= 50 ? '✅' : '⚠️'} Tối thiểu 50 ký tự
                        </span>
                      </div>
                    </div>

                    <textarea
                      className="report-textarea"
                      value={report}
                      onChange={(e) => setReport(e.target.value)}
                      placeholder="Nhập báo cáo tư vấn chi tiết...

Gợi ý nội dung:
• Triệu chứng và vấn đề chính
• Kết quả khám lâm sàng (nếu có)
• Chẩn đoán và đánh giá
• Tư vấn và hướng dẫn điều trị
• Khuyến nghị theo dõi và tái khám"
                      rows="8"
                      disabled={isLoading}
                    />

                    {showReportPreview && report.trim() && (
                      <div className="report-preview">
                        <h4>👁️ Xem trước báo cáo:</h4>
                        <div className="preview-content">
                          {report.split('\n').map((line, index) => (
                            <p key={index}>{line || '\u00A0'}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="report-display">
                    <div className="report-info">
                      <span className="report-stats">
                        📝 {appointment.report?.length || 0} ký tự • 📊{' '}
                        {appointment.report
                          ?.trim()
                          .split(/\s+/)
                          .filter((word) => word.length > 0).length || 0}{' '}
                        từ
                      </span>
                    </div>
                    <div className="report-content">
                      {appointment.report
                        ?.split('\n')
                        .map((line, index) => (
                          <p key={index}>{line || '\u00A0'}</p>
                        )) || 'Chưa có báo cáo.'}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          {appointment.status === 'unaccepted' && (
            <>
              <button
                className="btn btn-success"
                onClick={handleAccept}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>⏳ Đang xử lý...</span>
                ) : (
                  <span>✅ Chấp nhận</span>
                )}
              </button>
              <button
                className="btn btn-danger"
                onClick={handleReject}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>⏳ Đang xử lý...</span>
                ) : (
                  <span>❌ Từ chối</span>
                )}
              </button>
            </>
          )}

          {appointment.status === 'accepted' && (
            <button
              className="btn btn-primary"
              onClick={handleDone}
              disabled={isLoading || !report.trim() || charCount < 50}
            >
              {isLoading ? (
                <span>⏳ Đang hoàn thành...</span>
              ) : (
                <span>🏁 Hoàn thành tư vấn</span>
              )}
            </button>
          )}

          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {appointment.status === 'done' ? '🔒 Đóng' : '↩️ Quay lại'}
          </button>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="modal-loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Đang xử lý...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;
