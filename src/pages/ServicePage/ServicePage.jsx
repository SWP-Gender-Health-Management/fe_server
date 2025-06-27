import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ServicePage.css';

const ServicePage = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: 'Tư vấn trực tuyến với bác sĩ',
      description:
        'Đặt lịch tư vấn sức khỏe trực tuyến với các bác sĩ chuyên khoa hàng đầu',
      icon: '👨‍⚕️',
      features: [
        'Tư vấn video call 1-1',
        'Đội ngũ bác sĩ chuyên nghiệp',
        'Lịch hẹn linh hoạt',
        'Hỗ trợ 24/7',
      ],
      price: 'Từ 400.000đ',
      route: '/dat-lich-tu-van',
      popular: true,
    },
    {
      id: 2,
      title: 'Theo dõi chu kỳ kinh nguyệt',
      description:
        'Công cụ thông minh giúp theo dõi và dự đoán chu kỳ kinh nguyệt',
      icon: '🌸',
      features: [
        'Dự đoán chu kỳ chính xác',
        'Nhắc nhở thông minh',
        'Theo dõi triệu chứng',
        'Báo cáo chi tiết',
      ],
      price: 'Miễn phí',
      route: '/dich-vu/chu-ky-kinh-nguyet',
      popular: false,
    },
  ];

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <div className="service-page">
      <div className="service-container">
        <div className="service-header">
          <h1>Dịch Vụ Sức Khỏe MediCare</h1>
          <p>Lựa chọn dịch vụ chăm sóc sức khỏe phù hợp với nhu cầu của bạn</p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-card ${service.popular ? 'popular' : ''}`}
            >
              {service.popular && (
                <div className="popular-badge">⭐ Phổ biến</div>
              )}

              <div className="service-icon">{service.icon}</div>

              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>

                <div className="service-features">
                  <h4>Tính năng nổi bật:</h4>
                  <ul>
                    {service.features.map((feature, index) => (
                      <li key={index}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="service-footer">
                  <div className="service-price">
                    <span className="price-label">Giá từ:</span>
                    <span className="price-value">{service.price}</span>
                  </div>

                  <button
                    className="service-button"
                    onClick={() => handleNavigate(service.route)}
                  >
                    {service.id === 1 ? '📅 Đặt lịch ngay' : '🌸 Sử dụng ngay'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="service-benefits">
          <h2>Tại sao chọn MediCare?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🏥</div>
              <h3>Chất lượng hàng đầu</h3>
              <p>
                Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm từ các bệnh viện lớn
              </p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💻</div>
              <h3>Công nghệ hiện đại</h3>
              <p>Nền tảng tư vấn trực tuyến an toàn, bảo mật và dễ sử dụng</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">⏰</div>
              <h3>Tiện lợi 24/7</h3>
              <p>
                Đặt lịch linh hoạt, tư vấn mọi lúc mọi nơi phù hợp với lịch
                trình
              </p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💰</div>
              <h3>Chi phí hợp lý</h3>
              <p>
                Giá cả minh bạch, nhiều gói dịch vụ phù hợp với mọi túi tiền
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
