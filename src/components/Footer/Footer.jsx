import React from 'react';
import { Row, Col, Typography, Space, Divider, Button } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  MedicineBoxOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import './Footer.css';
import Logo from '@assets/Logo-full.svg?react';

const { Title, Text, Paragraph } = Typography;

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="modern-footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          <Row gutter={[48, 48]}>
            {/* Company Info */}
            <Col xs={24} md={12} lg={8}>
              <div className="footer-section">
                <div className="footer-logo-section">
                  <Logo className="footer-logo" />
                </div>
                <Paragraph className="footer-description">
                  Chăm sóc sức khỏe sinh sản toàn diện với đội ngũ chuyên gia
                  hàng đầu và công nghệ y tế hiện đại nhất. Chúng tôi cam kết
                  mang đến dịch vụ y tế chất lượng cao và an toàn tuyệt đối.
                </Paragraph>

                <div className="social-section">
                  <Title level={5} className="section-title">
                    Kết nối với chúng tôi
                  </Title>
                  <Space size="middle" className="social-icons">
                    <div className="social-icon facebook">
                      <FacebookOutlined />
                    </div>
                    <div className="social-icon twitter">
                      <TwitterOutlined />
                    </div>
                    <div className="social-icon instagram">
                      <InstagramOutlined />
                    </div>
                    <div className="social-icon youtube">
                      <YoutubeOutlined />
                    </div>
                  </Space>
                </div>
              </div>
            </Col>

            {/* Services & Solutions */}
            <Col xs={24} md={12} lg={8}>
              <div className="footer-section">
                <Title level={4} className="section-title">
                  <MedicineBoxOutlined className="section-icon" />
                  Dịch vụ & Giải pháp
                </Title>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <ul className="footer-links compact">
                      <li>
                        <a href="/customer">Theo dõi chu kỳ</a>
                      </li>
                      <li>
                        <a href="/dich-vu/phu-khoa">Phụ khoa</a>
                      </li>
                      <li>
                        <a href="/dich-vu/tiet-nieu">Nam khoa</a>
                      </li>
                      <li>
                        <a href="/dich-vu/tu-van">Tư vấn</a>
                      </li>
                    </ul>
                  </Col>
                  <Col span={12}>
                    <ul className="footer-links compact">
                      <li>
                        <a href="/dich-vu/xet-nghiem">Xét nghiệm</a>
                      </li>
                      <li>
                        <a href="/dich-vu/sieu-am">Siêu âm 4D</a>
                      </li>
                      <li>
                        <a href="/dich-vu/kham-tong-quat">Khám tổng quát</a>
                      </li>
                      <li>
                        <a href="/dich-vu/cap-cuu">Cấp cứu 24/7</a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* Support & Information */}
            <Col xs={24} md={24} lg={8}>
              <div className="footer-section">
                <Title level={4} className="section-title">
                  <CustomerServiceOutlined className="section-icon" />
                  <span className="section-title-text">Hỗ trợ & Thông tin</span>
                </Title>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <ul className="footer-links compact">
                      <li>
                        <a href="/ve-chung-toi">Về chúng tôi</a>
                      </li>
                      <li>
                        <a href="/bac-si">Đội ngũ bác sĩ</a>
                      </li>
                      <li>
                        <a href="/tin-tuc">Tin tức y khoa</a>
                      </li>
                      <li>
                        <a href="/dat-lich">Đặt lịch khám</a>
                      </li>
                    </ul>
                  </Col>
                  <Col span={12}>
                    <ul className="footer-links compact">
                      <li>
                        <a href="/ho-tro">Hỗ trợ 24/7</a>
                      </li>
                      <li>
                        <a href="/chinh-sach">Chính sách</a>
                      </li>
                      <li>
                        <a href="/dieu-khoan">Điều khoản</a>
                      </li>
                      <li>
                        <a href="/faq">Câu hỏi thường gặp</a>
                      </li>
                    </ul>
                  </Col>
                </Row>

                {/* Quick Contact Card */}
                <div className="quick-contact-card">
                  <div className="quick-contact-item">
                    <PhoneOutlined className="quick-contact-icon" />
                    <div>
                      <Text strong className="quick-contact-label">
                        Hotline 24/7
                      </Text>
                      <Text className="quick-contact-value">
                        (024) 3926 1234
                      </Text>
                    </div>
                  </div>
                  <div className="quick-contact-item">
                    <MailOutlined className="quick-contact-icon" />
                    <div>
                      <Text strong className="quick-contact-label">
                        Email hỗ trợ
                      </Text>
                      <Text className="quick-contact-value">
                        support@gendercare.vn
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Certifications & Awards */}
      <div className="footer-certifications">
        <div className="footer-container">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} lg={12}>
              <div className="certifications-content">
                <Title level={5} className="cert-title">
                  Chứng nhận & Giải thưởng
                </Title>
                <div className="cert-badges">
                  <div className="cert-badge">
                    <SafetyCertificateOutlined />
                    <span>ISO 9001:2015</span>
                  </div>
                  <div className="cert-badge">
                    <HeartOutlined />
                    <span>Top Healthcare 2024</span>
                  </div>
                  <div className="cert-badge">
                    <MedicineBoxOutlined />
                    <span>Bộ Y Tế cấp phép</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="emergency-contact">
                <div className="emergency-info">
                  <PhoneOutlined className="emergency-icon" />
                  <div>
                    <Text strong className="emergency-title">
                      Hotline cấp cứu 24/7
                    </Text>
                    <Text className="emergency-number">1900 1234</Text>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-container">
          <Row justify="space-between" align="middle" className="bottom-row">
            <Col xs={24} md={12}>
              <Text className="copyright">
                © 2025 Gender Care - SWP391 Group 5. All rights reserved.
              </Text>
            </Col>
            <Col xs={24} md={12} className="footer-right">
              <Space size="large" className="footer-links-bottom">
                <a href="/privacy">Chính sách riêng tư</a>
                <a href="/terms">Điều khoản sử dụng</a>
                <a href="/sitemap">Sơ đồ trang web</a>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <Button
        className="scroll-to-top"
        type="primary"
        shape="circle"
        icon={<ArrowUpOutlined />}
        onClick={scrollToTop}
        size="large"
      />
    </footer>
  );
};

export default Footer;