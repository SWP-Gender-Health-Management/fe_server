import React from 'react';
import { Button } from '@components/ui/button';
import './AboutUs.css';

const AboutUs = () => {
  const stats = [
    { number: '15+', label: 'Năm kinh nghiệm', icon: '🏥' },
    { number: '10,000+', label: 'Bệnh nhân đã điều trị', icon: '👥' },
    { number: '50+', label: 'Bác sĩ chuyên khoa', icon: '👨‍⚕️' },
    { number: '24/7', label: 'Hỗ trợ cấp cứu', icon: '🚨' },
  ];

  const facilities = [
    {
      id: 1,
      title: 'Phòng khám Nam khoa hiện đại',
      description:
        'Trang bị máy móc tiên tiến, không gian riêng tư đảm bảo sự thoải mái cho bệnh nhân',
      image:
        'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=600',
      features: [
        'Máy siêu âm 4D',
        'Thiết bị nội soi',
        'Phòng xét nghiệm tại chỗ',
      ],
    },
    {
      id: 2,
      title: 'Khoa Phụ sản và Sức khỏe Phụ nữ',
      description:
        'Chăm sóc toàn diện sức khỏe phụ nữ từ tuổi dậy thì đến mãn kinh',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
      features: [
        'Khám thai định kỳ',
        'Tầm soát ung thư',
        'Tư vấn kế hoạch hóa gia đình',
      ],
    },
    {
      id: 3,
      title: 'Phòng Lab và Xét nghiệm',
      description:
        'Hệ thống xét nghiệm hiện đại với kết quả nhanh chóng và chính xác',
      image:
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600',
      features: [
        'Xét nghiệm hormone',
        'Test HIV nhanh',
        'Sàng lọc bệnh lây truyền',
      ],
    },
    {
      id: 4,
      title: 'Khu vực Tư vấn riêng tư',
      description:
        'Không gian thoải mái để thảo luận các vấn đề nhạy cảm về sức khỏe sinh sản',
      image:
        'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600',
      features: [
        'Phòng tư vấn 1:1',
        'Tuyệt đối bảo mật',
        'Đội ngũ tư vấn viên kinh nghiệm',
      ],
    },
  ];

  const doctors = [
    {
      id: 1,
      name: 'TS.BS Nguyễn Văn Thành',
      title: 'Trưởng khoa Nam khoa',
      experience: '20 năm kinh nghiệm',
      specialization: 'Chuyên khoa Nam học, Vô sinh nam',
      image:
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300',
      achievements: [
        'Tiến sĩ Y khoa - Đại học Y Hà Nội',
        '500+ ca phẫu thuật thành công',
        'Chuyên gia hàng đầu về vô sinh nam',
      ],
    },
    {
      id: 2,
      name: 'TS.BS Trần Thị Minh Châu',
      title: 'Trưởng khoa Phụ sản',
      experience: '18 năm kinh nghiệm',
      specialization: 'Phụ khoa, Sản khoa, Nội tiết sinh sản',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300',
      achievements: [
        'Thạc sĩ Y khoa - ĐH Y dược TP.HCM',
        '3000+ ca sinh thường an toàn',
        'Chuyên gia tư vấn sức khỏe phụ nữ',
      ],
    },
    {
      id: 3,
      name: 'BS.CKI Lê Văn Hải',
      title: 'Bác sĩ chuyên khoa',
      experience: '12 năm kinh nghiệm',
      specialization: 'Điều trị bệnh lây truyền qua đường tình dục',
      image:
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300',
      achievements: [
        'Chuyên khoa I - Đại học Y Huế',
        'Chứng chỉ tư vấn HIV/AIDS',
        'Điều trị thành công 2000+ ca STD',
      ],
    },
  ];

  const certifications = [
    {
      title: 'Chứng nhận ISO 9001:2015',
      description: 'Hệ thống quản lý chất lượng quốc tế',
      year: '2022',
    },
    {
      title: 'Giấy phép hoạt động',
      description: 'Bộ Y tế cấp phép hoạt động khám chữa bệnh',
      year: '2023',
    },
    {
      title: 'Chứng nhận An toàn',
      description: 'Đạt chuẩn an toàn bệnh viện Việt Nam',
      year: '2023',
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">Về Gender Care</h1>
          <p className="hero-subtitle">
            Chăm sóc sức khỏe sinh sản với tình yêu thương và chuyên nghiệp
          </p>
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="about-container">
        {/* Mission Section */}
        <section className="mission-section">
          <div className="section-header">
            <h2 className="section-title">Sứ mệnh của chúng tôi</h2>
            <p className="section-subtitle">
              Mang đến dịch vụ chăm sóc sức khỏe sinh sản tốt nhất với công nghệ
              hiện đại
            </p>
          </div>

          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">💝</div>
              <h3>Tình yêu thương</h3>
              <p>
                Chăm sóc bệnh nhân như người thân trong gia đình với sự tận tâm
                và chu đáo
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🔬</div>
              <h3>Khoa học</h3>
              <p>
                Áp dụng những phương pháp điều trị hiện đại nhất dựa trên bằng
                chứng khoa học
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🤝</div>
              <h3>Tin cậy</h3>
              <p>
                Xây dựng mối quan hệ tin cậy lâu dài với bệnh nhân và cộng đồng
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Chuyên nghiệp</h3>
              <p>
                Đội ngũ y bác sĩ giàu kinh nghiệm với trình độ chuyên môn cao
              </p>
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="facilities-section">
          <div className="section-header">
            <h2 className="section-title">Cơ sở vật chất hiện đại</h2>
            <p className="section-subtitle">
              Trang bị đầy đủ thiết bị y tế tiên tiến để đảm bảo chất lượng điều
              trị tốt nhất
            </p>
          </div>

          <div className="facilities-grid">
            {facilities.map((facility) => (
              <div key={facility.id} className="facility-card">
                <div className="facility-image">
                  <img src={facility.image} alt={facility.title} />
                  <div className="facility-overlay">
                    <Button className="view-btn">Xem chi tiết</Button>
                  </div>
                </div>
                <div className="facility-content">
                  <h3 className="facility-title">{facility.title}</h3>
                  <p className="facility-description">{facility.description}</p>
                  <ul className="facility-features">
                    {facility.features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <span className="feature-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Doctors Section */}
        <section className="doctors-section">
          <div className="section-header">
            <h2 className="section-title">Đội ngũ bác sĩ giàu kinh nghiệm</h2>
            <p className="section-subtitle">
              Các chuyên gia hàng đầu trong lĩnh vực chăm sóc sức khỏe sinh sản
            </p>
          </div>

          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-image">
                  <img src={doctor.image} alt={doctor.name} />
                </div>
                <div className="doctor-content">
                  <h3 className="doctor-name">{doctor.name}</h3>
                  <p className="doctor-title">{doctor.title}</p>
                  <p className="doctor-experience">{doctor.experience}</p>
                  <p className="doctor-specialization">
                    {doctor.specialization}
                  </p>
                  <ul className="doctor-achievements">
                    {doctor.achievements.map((achievement, index) => (
                      <li key={index} className="achievement-item">
                        <span className="achievement-icon">🏆</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                  <Button className="contact-doctor-btn">Đặt lịch khám</Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section className="certifications-section">
          <div className="section-header">
            <h2 className="section-title">Chứng nhận và Giấy phép</h2>
            <p className="section-subtitle">
              Đảm bảo chất lượng dịch vụ theo tiêu chuẩn quốc gia và quốc tế
            </p>
          </div>

          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <div key={index} className="certification-card">
                <div className="cert-icon">📜</div>
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-description">{cert.description}</p>
                <span className="cert-year">{cert.year}</span>
              </div>
            ))}
          </div>
        </section>

        {/* History Section */}
        <section className="history-section">
          <div className="history-container">
            <div className="history-content">
              <h2 className="section-title">Lịch sử phát triển</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-year">2008</div>
                  <div className="timeline-content">
                    <h4>Thành lập phòng khám</h4>
                    <p>Bắt đầu với đội ngũ 5 bác sĩ và 10 nhân viên y tế</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-year">2012</div>
                  <div className="timeline-content">
                    <h4>Mở rộng quy mô</h4>
                    <p>
                      Xây dựng cơ sở 2 với diện tích 1000m² và trang bị hiện đại
                    </p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-year">2018</div>
                  <div className="timeline-content">
                    <h4>Chứng nhận ISO</h4>
                    <p>Đạt chứng nhận ISO 9001:2015 về quản lý chất lượng</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-year">2023</div>
                  <div className="timeline-content">
                    <h4>Kỷ nguyên số</h4>
                    <p>Ra mắt hệ thống chăm sóc sức khỏe trực tuyến</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="history-image">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600"
                alt="Hospital building"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Sẵn sàng chăm sóc sức khỏe của bạn?</h2>
            <p>Đặt lịch khám ngay hôm nay để được tư vấn từ các chuyên gia</p>
            <div className="cta-buttons">
              <Button className="primary-btn">Đặt lịch khám</Button>
              <Button className="secondary-btn">Tư vấn trực tuyến</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
