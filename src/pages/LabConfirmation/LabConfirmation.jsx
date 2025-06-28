import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabConfirmation.css';

const LabConfirmation = () => {
  const navigate = useNavigate();
  const [labSchedule, setLabSchedule] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    emergencyContact: '',
    emergencyPhone: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get data from sessionStorage
    const schedule = sessionStorage.getItem('labSchedule');
    const tests = sessionStorage.getItem('selectedLabTests');

    if (schedule && tests) {
      setLabSchedule(JSON.parse(schedule));
      setSelectedTests(JSON.parse(tests));
    } else {
      // If missing data, redirect back
      navigate('/dat-lich-xet-nghiem');
    }
  }, [navigate]);

  const calculateTotal = () => {
    return selectedTests.reduce((total, test) => total + test.price, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getTotalDuration = () => {
    const totalMinutes = selectedTests.reduce((total, test) => {
      const minutes = parseInt(test.duration.split(' ')[0]);
      return total + minutes;
    }, 0);

    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}p` : `${hours}h`;
    }
    return `${totalMinutes} phút`;
  };

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
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
    }

    if (!formData.gender) {
      newErrors.gender = 'Vui lòng chọn giới tính';
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Vui lòng nhập người liên hệ khẩn cấp';
    }

    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = 'Vui lòng nhập SĐT người liên hệ khẩn cấp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Save booking data
      const bookingData = {
        schedule: labSchedule,
        tests: selectedTests,
        customer: formData,
        total: calculateTotal(),
        bookingId: 'LAB' + Date.now(),
        createdAt: new Date().toISOString(),
      };

      sessionStorage.setItem('labBookingData', JSON.stringify(bookingData));

      // Clear temporary data
      sessionStorage.removeItem('labSchedule');
      sessionStorage.removeItem('selectedLabTests');

      navigate('/xac-nhan-xet-nghiem');
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!labSchedule || !selectedTests.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lab-confirmation">
      <div className="lab-confirmation-header">
        <button
          className="back-button"
          onClick={() => navigate('/chon-xet-nghiem')}
        >
          ← Quay lại chọn xét nghiệm
        </button>
        <h1>Xác nhận đặt lịch xét nghiệm</h1>
        <p>Vui lòng điền đầy đủ thông tin để hoàn tất việc đặt lịch</p>
      </div>

      <div className="confirmation-container">
        <div className="confirmation-content">
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-section">
              <h3>📋 Thông tin cá nhân</h3>

              <div className="form-row">
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
                    placeholder="0xxx xxx xxx"
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth">Ngày sinh *</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={errors.dateOfBirth ? 'error' : ''}
                  />
                  {errors.dateOfBirth && (
                    <span className="error-message">{errors.dateOfBirth}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Giới tính *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={errors.gender ? 'error' : ''}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                  {errors.gender && (
                    <span className="error-message">{errors.gender}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Địa chỉ *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="Nhập địa chỉ đầy đủ"
                  rows="2"
                />
                {errors.address && (
                  <span className="error-message">{errors.address}</span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>🩺 Thông tin y tế</h3>

              <div className="form-group">
                <label htmlFor="medicalHistory">Tiền sử bệnh</label>
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  placeholder="Các bệnh đã từng mắc, phẫu thuật..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="allergies">Dị ứng</label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="Dị ứng thuốc, thực phẩm..."
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="currentMedications">Thuốc đang sử dụng</label>
                <textarea
                  id="currentMedications"
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleInputChange}
                  placeholder="Các thuốc đang sử dụng hàng ngày..."
                  rows="2"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>📞 Liên hệ khẩn cấp</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emergencyContact">Người liên hệ *</label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className={errors.emergencyContact ? 'error' : ''}
                    placeholder="Họ tên người thân"
                  />
                  {errors.emergencyContact && (
                    <span className="error-message">
                      {errors.emergencyContact}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="emergencyPhone">Số điện thoại *</label>
                  <input
                    type="tel"
                    id="emergencyPhone"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className={errors.emergencyPhone ? 'error' : ''}
                    placeholder="0xxx xxx xxx"
                  />
                  {errors.emergencyPhone && (
                    <span className="error-message">
                      {errors.emergencyPhone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>📝 Ghi chú</h3>

              <div className="form-group">
                <label htmlFor="notes">Ghi chú thêm</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Yêu cầu đặc biệt, ghi chú khác..."
                  rows="3"
                />
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Đang xử lý...'
                : 'Xác nhận đặt lịch & Thanh toán'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-card">
            <h3>📋 Tóm tắt đơn hàng</h3>

            {/* Schedule Info */}
            <div className="summary-section">
              <h4>📅 Lịch đã chọn</h4>
              <p>
                <strong>Ngày:</strong> {labSchedule.dateString}
              </p>
              <p>
                <strong>Ca:</strong> {labSchedule.sessionName} (
                {labSchedule.sessionTime})
              </p>
            </div>

            {/* Tests Info */}
            <div className="summary-section">
              <h4>🧪 Xét nghiệm ({selectedTests.length})</h4>
              <div className="tests-list">
                {selectedTests.map((test) => (
                  <div key={test.id} className="test-item">
                    <span className="test-name">{test.name}</span>
                    <span className="test-price">
                      {formatPrice(test.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="summary-totals">
              <div className="total-row">
                <span>Tổng thời gian:</span>
                <span className="total-duration">{getTotalDuration()}</span>
              </div>
              <div className="total-row total-price">
                <span>Tổng chi phí:</span>
                <span className="total-amount">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>

            <div className="payment-info">
              <h4>💳 Thanh toán</h4>
              <p>Thanh toán trực tiếp tại cơ sở y tế</p>
              <p className="note">* Vui lòng mang theo giấy tờ tùy thân</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabConfirmation;
