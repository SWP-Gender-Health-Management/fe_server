import React, { useState } from 'react';
import './AppointmentModal.css';

const AppointmentModal = ({
  appointment,
  onClose,
  onAccept,
  onReject,
  onDone,
}) => {
  const [report, setReport] = useState(appointment.report || '');

  const handleAccept = () => {
    onAccept(appointment.id);
  };

  const handleReject = () => {
    if (window.confirm('Bạn có chắc chắn muốn từ chối cuộc hẹn này?')) {
      onReject(appointment.id);
    }
  };

  const handleDone = () => {
    if (!report.trim()) {
      alert('Vui lòng nhập báo cáo tư vấn trước khi hoàn thành.');
      return;
    }
    onDone(appointment.id, report);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
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

  return (
    <div className="appointment-modal-backdrop" onClick={handleBackdropClick}>
      <div className="appointment-modal">
        <div className="modal-header">
          <h2>Chi Tiết Cuộc Hẹn</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="appointment-modal-content">
          <div className="appointment-details">
            <div className="detail-section">
              <h3>Thông Tin Cuộc Hẹn</h3>
              <div className="detail-row">
                <label>Appointment ID:</label>
                <span>{appointment.id}</span>
              </div>
              <div className="detail-row">
                <label>Ngày:</label>
                <span>
                  {new Date(appointment.date).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="detail-row">
                <label>Giờ:</label>
                <span>{getSlotTime(appointment.slot)}</span>
              </div>
              <div className="detail-row">
                <label>Trạng thái:</label>
                <span className={`status-badge status-${appointment.status}`}>
                  {getStatusText(appointment.status)}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Thông Tin Khách Hàng</h3>
              <div className="detail-row">
                <label>Tên:</label>
                <span>{appointment.customerName}</span>
              </div>
              <div className="detail-row">
                <label>Ngày sinh:</label>
                <span>
                  {new Date(appointment.customerDOB).toLocaleDateString(
                    'vi-VN'
                  )}
                </span>
              </div>
              <div className="detail-row">
                <label>Số điện thoại:</label>
                <span>{appointment.customerPhone}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Mô Tả Vấn Đề</h3>
              <div className="description-box">{appointment.description}</div>
            </div>

            {(appointment.status === 'accepted' ||
              appointment.status === 'done') && (
              <div className="detail-section">
                <h3>Báo Cáo Tư Vấn</h3>
                {appointment.status === 'accepted' ? (
                  <textarea
                    className="report-textarea"
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    placeholder="Nhập báo cáo tư vấn..."
                    rows="5"
                  />
                ) : (
                  <div className="report-box">{appointment.report}</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          {appointment.status === 'unaccepted' && (
            <>
              <button className="btn btn-success" onClick={handleAccept}>
                <span>✓</span> Chấp nhận
              </button>
              <button className="btn btn-danger" onClick={handleReject}>
                <span>✕</span> Từ chối
              </button>
            </>
          )}

          {appointment.status === 'accepted' && (
            <button className="btn btn-primary" onClick={handleDone}>
              <span>✓</span> Hoàn thành
            </button>
          )}

          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
