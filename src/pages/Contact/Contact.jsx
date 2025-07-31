import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import './Contact.css';



const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
    appointment: '',
  });

  const [loading, setLoading] = useState(false);

  const locations = [
    {
      id: 1,
      name: 'Cơ sở chính - Quận 1',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      phone: '(028) 3829 1234',
      hours: '7:00 - 19:00 (Thứ 2 - Thứ 7)',
      emergency: '24/7',
      image:
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
      services: ['Nam khoa', 'Phụ khoa', 'Tư vấn tình dục', 'Xét nghiệm'],
      specialFeatures: [
        'Phòng cấp cứu 24/7',
        'Bãi đỗ xe miễn phí',
        'WiFi toàn bộ khu vực',
      ],
    },
    {
      id: 2,
      name: 'Chi nhánh - Quận 3',
      address: '456 Võ Văn Tần, Quận 3, TP.HCM',
      phone: '(028) 3932 5678',
      hours: '8:00 - 18:00 (Thứ 2 - Chủ nhật)',
      emergency: 'Cuối tuần',
      image:
        'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600',
      services: ['Khám tổng quát', 'Tư vấn trực tuyến', 'Xét nghiệm nhanh'],
      specialFeatures: [
        'Hệ thống đặt lịch online',
        'Phòng chờ VIP',
        'Dịch vụ tại nhà',
      ],
    },
    {
      id: 3,
      name: 'Trung tâm - Quận 7',
      address: '789 Nguyễn Thị Thập, Quận 7, TP.HCM',
      phone: '(028) 5412 9876',
      hours: '6:30 - 20:00 (Hàng ngày)',
      emergency: 'Khẩn cấp 24/7',
      image:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600',
      services: ['Phẫu thuật', 'Điều trị chuyên sâu', 'Hỗ trợ sinh sản'],
      specialFeatures: [
        'Phòng mổ hiện đại',
        'Khoa hồi sức',
        'Phòng khám riêng tư',
      ],
    },
  ];

  const contactMethods = [
    {
      type: 'Hotline 24/7',
      value: '1900 1717',
      icon: '📞',
      description: 'Tư vấn và hỗ trợ 24/7',
      color: '#ff6b6b',
    },
    {
      type: 'Email hỗ trợ',
      value: 'support@gendercare.vn',
      icon: '✉️',
      description: 'Gửi câu hỏi qua email',
      color: '#4ecdc4',
    },
    {
      type: 'Zalo/WhatsApp',
      value: '0908 123 456',
      icon: '💬',
      description: 'Nhắn tin trực tiếp',
      color: '#45b7d1',
    },
    {
      type: 'Telegram',
      value: '@gendercare_vn',
      icon: '📱',
      description: 'Kênh tư vấn Telegram',
      color: '#96ceb4',
    },
  ];

  const emergencyContacts = [
    {
      title: 'Cấp cứu Nam khoa',
      phone: '0911 234 567',
      description: 'Các trường hợp khẩn cấp về nam khoa',
      available: '24/7',
    },
    {
      title: 'Cấp cứu Phụ khoa',
      phone: '0922 345 678',
      description: 'Cấp cứu sản phụ khoa, thai nghén',
      available: '24/7',
    },
    {
      title: 'Tư vấn HIV/AIDS',
      phone: '0933 456 789',
      description: 'Hỗ trợ tư vấn về HIV/AIDS',
      available: '7:00 - 22:00',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    setTimeout(() => {
      setLoading(false);
      navigate('/hoi-dap');
    }, 1000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1 className="hero-title">Liên hệ với chúng tôi</h1>
          <p className="hero-subtitle">
            Chúng tôi sẵn sàng hỗ trợ bạn 24/7 về mọi vấn đề sức khỏe sinh sản
          </p>
          <div className="hero-contact-row">
            <div className="hero-contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <strong>Hotline 24/7</strong>
                <p>1900 1717</p>
              </div>
            </div>
            <div className="hero-contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>support@gendercare.vn</p>
              </div>
            </div>
            <div className="hero-contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <strong>Địa chỉ chính</strong>
                <p>123 Nguyễn Huệ, Q.1, TP.HCM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="contact-container">
        {/* Contact Methods */}
        <section className="contact-methods-section">
          <div className="section-header">
            <h2 className="section-titles">Phương thức liên hệ</h2>
            <p className="section-subtitle">
              Chọn cách thức liên hệ phù hợp nhất với bạn
            </p>
          </div>

          <div className="contact-methods-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className="contact-method-card">
                <div
                  className="method-icon"
                  style={{ backgroundColor: method.color }}
                >
                  {method.icon}
                </div>
                <h3 className="method-type">{method.type}</h3>
                <p className="method-value">{method.value}</p>
                <p className="method-description">{method.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="emergency-section">
          <div className="section-header">
            <h2 className="section-titles">Liên hệ khẩn cấp</h2>
            <p className="section-subtitle">
              Các đường dây nóng cho trường hợp cần hỗ trợ gấp
            </p>
          </div>

          <div className="emergency-grid">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="emergency-card">
                <div className="emergency-header">
                  <h3 className="emergency-title">{contact.title}</h3>
                  <span className="emergency-available">
                    {contact.available}
                  </span>
                </div>
                <p className="emergency-phone">{contact.phone}</p>
                <p className="emergency-description">{contact.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form & Locations */}
        <section className="form-locations-section">
          <div className="form-locations-grid">
            {/* Contact Form */}
            <div className="contact-form-container">
              <h3 className="form-title">Gửi tin nhắn cho chúng tôi</h3>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Họ và tên *</label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại *</label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Nhập email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="service">Dịch vụ quan tâm</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Chọn dịch vụ</option>
                      <option value="nam-khoa">Nam khoa</option>
                      <option value="phu-khoa">Phụ khoa</option>
                      <option value="benh-tinh-duc">Bệnh tình dục</option>
                      <option value="tu-van">Tư vấn sức khỏe</option>
                      <option value="xet-nghiem">Xét nghiệm</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="appointment">Thời gian mong muốn khám</label>
                  <Input
                    id="appointment"
                    name="appointment"
                    type="datetime-local"
                    value={formData.appointment}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Tin nhắn *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                    rows="4"
                    required
                    className="form-textarea"
                  />
                </div>

                <Button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </Button>
              </form>
            </div>

            {/* Quick Contact */}
            <div className="quick-contact">
              <h3 className="quick-contact-title">Liên hệ nhanh</h3>
              <div className="quick-contact-list">
                <div className="quick-contact-item">
                  <div className="quick-icon">🕐</div>
                  <div>
                    <strong>Giờ làm việc</strong>
                    <p>T2-T7: 7:00 - 19:00</p>
                    <p>CN: 8:00 - 17:00</p>
                  </div>
                </div>
                <div className="quick-contact-item">
                  <div className="quick-icon">🚗</div>
                  <div>
                    <strong>Đưa đón miễn phí</strong>
                    <p>Trong bán kính 10km</p>
                    <p>Đặt trước 2 tiếng</p>
                  </div>
                </div>
                <div className="quick-contact-item">
                  <div className="quick-icon">💳</div>
                  <div>
                    <strong>Thanh toán</strong>
                    <p>Tiền mặt, Thẻ, Chuyển khoản</p>
                    <p>Bảo hiểm y tế</p>
                  </div>
                </div>
                <div className="quick-contact-item">
                  <div className="quick-icon">🌐</div>
                  <div>
                    <strong>Ngôn ngữ hỗ trợ</strong>
                    <p>Tiếng Việt, English</p>
                    <p>中文, 한국어</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Locations */}
        <section className="locations-section">
          <div className="section-header">
            <h2 className="section-titles">Địa điểm khám</h2>
            <p className="section-subtitle">
              Hệ thống cơ sở hiện đại phục vụ bạn tại nhiều địa điểm
            </p>
          </div>

          <div className="locations-grid">
            {locations.map((location) => (
              <div key={location.id} className="location-card">
                <div className="location-image">
                  <img src={location.image} alt={location.name} />
                  <div className="location-overlay">
                  </div>
                </div>

                <div className="location-content">
                  <h3 className="location-name">{location.name}</h3>
                  <div className="location-info">
                    <div className="info-item">
                      <span className="info-icon">📍</span>
                      <p>{location.address}</p>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">📞</span>
                      <p>{location.phone}</p>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">🕒</span>
                      <p>{location.hours}</p>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">🚨</span>
                      <p>Cấp cứu: {location.emergency}</p>
                    </div>
                  </div>

                  <div className="location-services">
                    <h4>Dịch vụ:</h4>
                    <div className="services-tags">
                      {location.services.map((service, index) => (
                        <span key={index} className="service-tag">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="location-features">
                    <h4>Tiện ích:</h4>
                    <ul className="features-list">
                      {location.specialFeatures.map((feature, index) => (
                        <li key={index} className="feature-item">
                          <span className="feature-check">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="location-actions">
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
