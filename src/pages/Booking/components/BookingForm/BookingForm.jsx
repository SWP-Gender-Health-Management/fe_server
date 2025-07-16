import React, { useState, useEffect } from 'react';
import './BookingForm.css';

const BookingForm = ({ doctor, slot, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load user data from session if available
  useEffect(() => {
    const userData = {
      fullName: sessionStorage.getItem('full_name') || '',
      phone: sessionStorage.getItem('phone') || '',
      email: sessionStorage.getItem('email') || '',
    };

    setFormData((prev) => ({
      ...prev,
      ...userData,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng mô tả vấn đề cần tư vấn';
    } else if (formData.description.trim().length < 20) {
      newErrors.description =
        'Mô tả quá ngắn, vui lòng nhập tối thiểu 20 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    console.log('slot.pattern_id: ', slot.pattern_id);
    console.log('slot.customer_id: ', slot.customer_id);

    onSubmit({
      ...formData,
      bookingId: `BK${Date.now()}`,
      totalAmount: calculateTotal(),
      paymentStatus: 'completed',
      pattern_id: slot.pattern_id,
      customer_id: slot.customer_id,
    });
    setIsLoading(false);
  };

  const calculateTotal = () => {
    const serviceFee = 25000; // 25k service fee
    return doctor.price + serviceFee;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatTime = (rawStart) => {
    if (!rawStart) {
      console.log('Raw start is null/undefined:', rawStart);
      return '';
    }
    const timeStr = rawStart.length === 5 ? rawStart + ':00' : rawStart;
    return timeStr.slice(0, 5);
  };

  const formatSlotTime = () => {
    const startTime = formatTime(slot.start_at);
    const endTime = formatTime(slot.end_at);
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className="booking-form">
      <div className="form-header">
        <button className="back-button" onClick={onBack}>
          ← Quay lại chọn lịch
        </button>
        <h2>Thông tin đặt lịch tư vấn</h2>
      </div>

      <div className="form-content">
        <div className="form-main">
          {/* Selected Appointment Info */}
          <div className="appointment-summary">
            <h3>📅 Lịch hẹn đã chọn</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">👨‍⚕️ Bác sĩ:</span>
                <span className="value">{doctor.name}</span>
              </div>
              <div className="summary-item">
                <span className="label">🩺 Chuyên khoa:</span>
                <span className="value">{doctor.specialty}</span>
              </div>
              <div className="summary-item">
                <span className="label">📅 Ngày:</span>
                <span className="value">{slot.dateString}</span>
              </div>
              <div className="summary-item">
                <span className="label">🕐 Giờ:</span>
                <span className="value">{formatSlotTime()}</span>
              </div>
            </div>
          </div>

          {/* Patient Information Form */}
          <div className="patient-info">
            <h3>👤 Thông tin bệnh nhân</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">Họ và tên *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? 'error' : ''}
                    placeholder="Nhập họ và tên đầy đủ"
                  />
                  {errors.fullName && (
                    <span className="error-message">{errors.fullName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="Nhập số điện thoại"
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="Nhập địa chỉ email"
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô tả vấn đề cần tư vấn *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={errors.description ? 'error' : ''}
                  placeholder="Mô tả ngắn gọn về vấn đề sức khỏe cần tư vấn (tối thiểu 20 ký tự)..."
                  rows={4}
                />
                <div className="char-count">
                  {formData.description.length}/500 ký tự
                </div>
                {errors.description && (
                  <span className="error-message">{errors.description}</span>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Payment Summary Sidebar */}
        <div className="payment-sidebar">
          <div className="payment-summary">
            <h3>💰 Tổng thanh toán</h3>

            <div className="price-breakdown">
              <div className="price-item">
                <span>Phí tư vấn:</span>
                <span>{formatPrice(doctor.price)}</span>
              </div>
              <div className="price-item">
                <span>Phí dịch vụ:</span>
                <span>{formatPrice(25000)}</span>
              </div>
              <div className="price-divider"></div>
              <div className="price-item total">
                <span>Tổng cộng:</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
            </div>

            <div className="payment-note">
              <p>
                💡 <strong>Lưu ý:</strong>
              </p>
              <ul>
                <li>Thanh toán an toàn và bảo mật 100%</li>
                <li>Email xác nhận sẽ được gửi ngay</li>
                <li>Link tham gia cuộc gọi video sẽ được gửi trước 15 phút</li>
                <li>Có thể hủy miễn phí trước 2 giờ</li>
              </ul>
            </div>

            <button
              type="submit"
              className="payment-button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Đang xử lý...
                </>
              ) : (
                <>💳 Thanh toán & Xác nhận đặt lịch</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
