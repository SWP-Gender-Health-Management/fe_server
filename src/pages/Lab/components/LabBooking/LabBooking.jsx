import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabBooking.css';
import Cookies from 'js-cookie';
import { viewAccount } from '@/api/accountApi';

const LabBooking = () => {
  const navigate = useNavigate();
  const [scheduleInfo, setScheduleInfo] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    address: '',
    identityCard: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Lấy thông tin từ sessionStorage
    const storedSchedule = sessionStorage.getItem('selectedSchedule');
    const storedTests = sessionStorage.getItem('selectedTests');
    const storedPrice = sessionStorage.getItem('totalPrice');

    if (!storedSchedule || !storedTests) {
      // Nếu thiếu thông tin, quay về trang đầu
      navigate('/xet-nghiem');
      return;
    }

    setScheduleInfo(JSON.parse(storedSchedule));
    setSelectedTests(JSON.parse(storedTests));
    setTotalPrice(parseInt(storedPrice) || 0);

    // Lấy accountId từ Cookies
    const accountId = Cookies.get('accountId');
    const token = Cookies.get('accessToken');
    if (accountId && token) {
      viewAccount(token).then(res => {
        console.log('[LabBooking] viewAccount response:', res.data);
        const user = res.data.result;
        setFormData((prev) => ({
          ...prev,
          fullName: user.full_name || '',
          email: user.email || '',
          phone: user.phone || '',
          birthDate: user.dob ? user.dob.split('T')[0] : '',
          gender: user.gender || '',
          address: user.address || '',
          identityCard: user.identity_card || '',
        }));
      });
    }
  }, [navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error khi user sửa
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.birthDate) newErrors.birthDate = 'Vui lòng chọn ngày sinh';
    if (!formData.gender) newErrors.gender = 'Vui lòng chọn giới tính';
    if (!formData.identityCard.trim())
      newErrors.identityCard = 'Vui lòng nhập CCCD/CMND';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Phone validation
    if (
      formData.phone &&
      !/^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, ''))
    ) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // Age validation (must be >= 16)
    if (formData.birthDate) {
      const today = new Date();
      const birthDate = new Date(formData.birthDate);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16) {
        newErrors.birthDate = 'Phải từ 16 tuổi trở lên';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Lưu thông tin booking
    const bookingData = {
      schedule: scheduleInfo,
      tests: selectedTests,
      totalPrice,
      personalInfo: formData,
      bookingId: 'LAB' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Lưu vào sessionStorage (trong thực tế sẽ gửi API)
    sessionStorage.setItem('labBooking', JSON.stringify(bookingData));

    // Chuyển đến trang thanh toán
    navigate('/thanh-toan', {
      state: {
        bookingData,
        returnUrl: '/xac-nhan-xet-nghiem',
      },
    });
  };

  const handleBack = () => {
    navigate('/chon-xet-nghiem');
  };

  if (!scheduleInfo || !selectedTests.length) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="lab-booking">
      <div className="header">
        <button className="back-button" onClick={handleBack}>
          ← Quay lại
        </button>
        <h1>Thông tin đặt lịch xét nghiệm</h1>
        <p>Vui lòng điền đầy đủ thông tin để hoàn tất đặt lịch</p>
      </div>

      <div className="booking-container">
        <div className="booking-form">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Thông tin cá nhân</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && (
                    <span className="error-text">{errors.fullName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && (
                    <span className="error-text">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Ngày sinh *</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className={errors.birthDate ? 'error' : ''}
                  />
                  {errors.birthDate && (
                    <span className="error-text">{errors.birthDate}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Giới tính *</label>
                  <select
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
                    <span className="error-text">{errors.gender}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>CCCD/CMND *</label>
                  <input
                    type="text"
                    name="identityCard"
                    value={formData.identityCard}
                    onChange={handleInputChange}
                    className={errors.identityCard ? 'error' : ''}
                  />
                  {errors.identityCard && (
                    <span className="error-text">{errors.identityCard}</span>
                  )}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Liên hệ khẩn cấp</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tên người liên hệ</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Thông tin y tế</h3>
              <div className="form-group full-width">
                <label>Tiền sử bệnh lý</label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Mô tả các bệnh lý đã từng mắc (nếu có)"
                />
              </div>

              <div className="form-group full-width">
                <label>Thuốc đang sử dụng</label>
                <textarea
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Liệt kê các loại thuốc đang sử dụng (nếu có)"
                />
              </div>

              <div className="form-group full-width">
                <label>Dị ứng</label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Mô tả các loại dị ứng (nếu có)"
                />
              </div>

              <div className="form-group full-width">
                <label>Ghi chú thêm</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Các thông tin khác cần lưu ý"
                />
              </div>
            </div>

            <button type="submit" className="submit-button">
              Tiến hành thanh toán
            </button>
          </form>
        </div>

        <div className="booking-summary">
          <div className="summary-card">
            <h3>Thông tin đặt lịch</h3>

            <div className="summary-section">
              <h4>Lịch hẹn</h4>
              <p>
                <strong>Ngày:</strong> {scheduleInfo.formattedDate}
              </p>
              <p>
                <strong>Thời gian:</strong>{' '}
                {scheduleInfo.timeSlot === 'morning'
                  ? 'Buổi sáng (7:00-11:00)'
                  : 'Buổi chiều (13:00-17:00)'}
              </p>
            </div>

            <div className="summary-section">
              <h4>Xét nghiệm đã chọn ({selectedTests.length})</h4>
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

            <div className="summary-section">
              <div className="total-section">
                <div className="total-row">
                  <span>Tổng cộng:</span>
                  <span className="total-price">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="summary-section">
              <h4>Lưu ý quan trọng</h4>
              <ul className="notes-list">
                <li>Vui lòng đến trước giờ hẹn 15 phút</li>
                <li>Mang theo CCCD/CMND gốc</li>
                <li>Nhịn ăn 8-12 tiếng trước khi xét nghiệm máu (nếu có)</li>
                <li>Uống đủ nước trước khi đến</li>
                <li>Liên hệ hotline nếu cần thay đổi lịch hẹn</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabBooking;
