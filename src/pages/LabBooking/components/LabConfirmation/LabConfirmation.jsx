import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabConfirmation.css';

const LabConfirmation = () => {
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState(null);

  useEffect(() => {
    const storedBooking = sessionStorage.getItem('labBooking');
    if (storedBooking) {
      setBookingInfo(JSON.parse(storedBooking));
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

  const handleBackToHome = () => {
    // Clear session data
    sessionStorage.removeItem('selectedSchedule');
    sessionStorage.removeItem('selectedTests');
    sessionStorage.removeItem('totalPrice');
    sessionStorage.removeItem('labBooking');
    navigate('/');
  };

  if (!bookingInfo) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="lab-confirmation">
      <div className="confirmation-container">
        <div className="success-icon">✅</div>
        <h1>Đặt lịch thành công!</h1>
        <p>
          Cảm ơn bạn đã đặt lịch xét nghiệm. Thông tin chi tiết đã được gửi đến
          email của bạn.
        </p>

        <div className="booking-details">
          <h3>Thông tin đặt lịch</h3>
          <div className="detail-row">
            <span>Mã đặt lịch:</span>
            <span>{bookingInfo.bookingId}</span>
          </div>
          <div className="detail-row">
            <span>Ngày hẹn:</span>
            <span>{bookingInfo.schedule.formattedDate}</span>
          </div>
          <div className="detail-row">
            <span>Thời gian:</span>
            <span>
              {bookingInfo.schedule.timeSlot === 'morning'
                ? 'Buổi sáng (7:00-11:00)'
                : 'Buổi chiều (13:00-17:00)'}
            </span>
          </div>
          <div className="detail-row">
            <span>Họ tên:</span>
            <span>{bookingInfo.personalInfo.fullName}</span>
          </div>
          <div className="detail-row">
            <span>Số điện thoại:</span>
            <span>{bookingInfo.personalInfo.phone}</span>
          </div>
          <div className="detail-row">
            <span>Tổng chi phí:</span>
            <span className="total-amount">
              {formatPrice(bookingInfo.totalPrice)}
            </span>
          </div>
        </div>

        <div className="actions">
          <button className="home-button" onClick={handleBackToHome}>
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabConfirmation;
