import React from 'react';
import './BookingSuccess.css';

const BookingSuccess = ({ doctor, slot, bookingData, onBackToHome }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatSlotTime = () => {
    const startTime = slot.time;
    const endTime =
      String(parseInt(startTime.split(':')[0]) + 1).padStart(2, '0') + ':00';
    return `${startTime} - ${endTime}`;
  };

  const getVideoCallLink = () => {
    // Mock video call link
    return `https://medicare-video.com/room/${bookingData.bookingId}`;
  };

  return (
    <div className="booking-success">
      <div className="success-container">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="success-checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
          <h1 className="success-title">Đặt lịch thành công!</h1>
          <p className="success-subtitle">
            Cảm ơn bạn đã tin tưởng dịch vụ tư vấn sức khỏe trực tuyến của chúng
            tôi
          </p>
        </div>

        {/* Booking Details */}
        <div className="booking-details">
          <h2>📋 Thông tin cuộc hẹn</h2>

          <div className="details-grid">
            <div className="detail-card doctor-card">
              <div className="card-header">
                <h3>👨‍⚕️ Thông tin bác sĩ</h3>
              </div>
              <div className="card-content">
                <div className="doctor-info">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="doctor-avatar"
                  />
                  <div className="doctor-details">
                    <h4>{doctor.name}</h4>
                    <p>🩺 {doctor.specialty}</p>
                    <p>
                      ⭐ {doctor.rating}/5 ({doctor.reviewCount} đánh giá)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-card appointment-card">
              <div className="card-header">
                <h3>📅 Thời gian hẹn</h3>
              </div>
              <div className="card-content">
                <div className="appointment-info">
                  <div className="info-item">
                    <span className="label">Ngày:</span>
                    <span className="value">{slot.dateString}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Giờ:</span>
                    <span className="value">{formatSlotTime()}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Mã đặt lịch:</span>
                    <span className="value booking-id">
                      {bookingData.bookingId}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-card patient-card">
              <div className="card-header">
                <h3>👤 Thông tin bệnh nhân</h3>
              </div>
              <div className="card-content">
                <div className="patient-info">
                  <div className="info-item">
                    <span className="label">Họ tên:</span>
                    <span className="value">{bookingData.fullName}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Điện thoại:</span>
                    <span className="value">{bookingData.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{bookingData.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-card payment-card">
              <div className="card-header">
                <h3>💰 Thông tin thanh toán</h3>
              </div>
              <div className="card-content">
                <div className="payment-info">
                  <div className="info-item">
                    <span className="label">Phí tư vấn:</span>
                    <span className="value">{formatPrice(doctor.price)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Phí dịch vụ:</span>
                    <span className="value">{formatPrice(25000)}</span>
                  </div>
                  <div className="total-amount">
                    <span className="label">Tổng thanh toán:</span>
                    <span className="value">
                      {formatPrice(bookingData.totalAmount)}
                    </span>
                  </div>
                  <div className="payment-status">
                    <span className="status-badge">✅ Đã thanh toán</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-section">
          <h2>🎯 Bước tiếp theo</h2>

          <div className="action-cards">
            <div className="action-card">
              <div className="action-icon">📧</div>
              <h3>Email xác nhận</h3>
              <p>
                Chúng tôi đã gửi email xác nhận đặt lịch đến địa chỉ{' '}
                <strong>{bookingData.email}</strong>
              </p>
            </div>

            <div className="action-card">
              <div className="action-icon">📱</div>
              <h3>SMS nhắc nhở</h3>
              <p>
                Bạn sẽ nhận được SMS nhắc nhở trước 1 giờ và 15 phút trước cuộc
                hẹn
              </p>
            </div>

            <div className="action-card">
              <div className="action-icon">🎥</div>
              <h3>Link tham gia</h3>
              <p>Link cuộc gọi video sẽ được gửi qua email trước 15 phút</p>
              <div className="video-link">
                <span>Link tạm thời:</span>
                <a
                  href={getVideoCallLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tham gia cuộc gọi
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button
            className="action-button primary"
            onClick={() => window.print()}
          >
            🖨️ In phiếu hẹn
          </button>

          <button
            className="action-button secondary"
            onClick={() => (window.location.href = '/tai-khoan')}
          >
            📋 Xem lịch sử đặt lịch
          </button>

          <button className="action-button tertiary" onClick={onBackToHome}>
            🏠 Về trang chủ
          </button>
        </div>

        {/* Important Notes */}
        <div className="important-notes">
          <h3>⚠️ Lưu ý quan trọng</h3>
          <ul>
            <li>
              Vui lòng chuẩn bị đầy đủ thông tin bệnh sử và các câu hỏi cần tư
              vấn
            </li>
            <li>
              Đảm bảo kết nối internet ổn định và thiết bị có camera, micro
            </li>
            <li>Có thể hủy hoặc thay đổi lịch hẹn miễn phí trước 2 giờ</li>
            <li>
              Nếu gặp vấn đề kỹ thuật, vui lòng liên hệ hotline:{' '}
              <strong>1900-XXX-XXX</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
