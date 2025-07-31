import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabSuccess.css';

const LabSuccess = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('labBookingData');
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      navigate('/dich-vu');
    }
  }, [navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleGoHome = () => {
    sessionStorage.removeItem('labBookingData');
    navigate('/');
  };

  const handleNewBooking = () => {
    sessionStorage.removeItem('labBookingData');
    navigate('/dich-vu');
  };

  if (!bookingData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lab-success">
      <div className="success-container">
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h1>Đặt lịch thành công!</h1>
          <p>Cảm ơn bạn đã sử dụng dịch vụ xét nghiệm của MediCare</p>
        </div>

        <div className="booking-details">
          <div className="detail-card">
            <h3>📋 Thông tin đặt lịch</h3>

            <div className="detail-section">
              <h4>🆔 Mã đặt lịch</h4>
              <p className="booking-id">{bookingData.bookingId}</p>
            </div>

            <div className="detail-section">
              <h4>👤 Thông tin khách hàng</h4>
              <p>
                <strong>Họ tên:</strong> {bookingData.customer.fullName}
              </p>
              <p>
                <strong>Điện thoại:</strong> {bookingData.customer.phone}
              </p>
              <p>
                <strong>Email:</strong> {bookingData.customer.email}
              </p>
            </div>

            <div className="detail-section">
              <h4>📅 Lịch xét nghiệm</h4>
              <p>
                <strong>Ngày:</strong> {bookingData.schedule.dateString}
              </p>
              <p>
                <strong>Ca:</strong> {bookingData.schedule.sessionName} (
                {bookingData.schedule.sessionTime})
              </p>
            </div>

            <div className="detail-section">
              <h4>🧪 Các xét nghiệm</h4>
              <div className="tests-list">
                {bookingData.tests.map((test) => (
                  <div key={test.id} className="test-item">
                    <span className="test-name">{test.name}</span>
                    <span className="test-price">
                      {formatPrice(test.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section total-section">
              <h4>💰 Tổng chi phí</h4>
              <p className="total-amount">{formatPrice(bookingData.total)}</p>
            </div>
          </div>

          <div className="instructions-card">
            <h3>📝 Hướng dẫn quan trọng</h3>

            <div className="instruction-item">
              <div className="instruction-icon">🕐</div>
              <div className="instruction-content">
                <h4>Thời gian</h4>
                <p>
                  Vui lòng có mặt trước 15 phút so với giờ hẹn để làm thủ tục
                </p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-icon">🆔</div>
              <div className="instruction-content">
                <h4>Giấy tờ cần thiết</h4>
                <p>
                  CMND/CCCD, thẻ BHYT (nếu có), phiếu khám từ bác sĩ (nếu có)
                </p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-icon">🍽️</div>
              <div className="instruction-content">
                <h4>Chuẩn bị trước xét nghiệm</h4>
                <p>
                  Nhịn ăn 8-12 tiếng đối với xét nghiệm đường huyết và mỡ máu
                </p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-icon">💳</div>
              <div className="instruction-content">
                <h4>Thanh toán</h4>
                <p>Thanh toán trực tiếp tại quầy lễ tân khi làm thủ tục</p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-icon">📞</div>
              <div className="instruction-content">
                <h4>Liên hệ hỗ trợ</h4>
                <p>Hotline: 1900-xxx-xxx (24/7) nếu cần thay đổi lịch hẹn</p>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="secondary-button" onClick={handleNewBooking}>
            📅 Đặt lịch mới
          </button>
          <button className="primary-button" onClick={handleGoHome}>
            🏠 Về trang chủ
          </button>
        </div>

        <div className="contact-info">
          <h4>📍 Địa chỉ phòng khám</h4>
          <p>123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</p>
          <p>📞 Hotline: 1900-xxx-xxx | 📧 Email: info@medicare.vn</p>
        </div>
      </div>
    </div>
  );
};

export default LabSuccess;