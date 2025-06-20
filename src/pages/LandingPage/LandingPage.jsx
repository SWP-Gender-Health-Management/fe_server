import React from 'react';
import { Carousel, Button, Input, Select, Form, Card, Row, Col } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import '@styles/reset.css'; // Reset CSS for consistent styling
import './LandingPage.css'; // Import CSS file

const { Option } = Select;

const LandingPage = () => {
  const carouselRef = React.useRef();

  return (
    <div className="landing-container">
      {/* Banner with arrows */}
      <div className="carousel-container">
        <Carousel ref={carouselRef} dots={false}>
          <div>
            <div className="carousel-slide">ẢNH BỆNH VIỆN SLIDE 1</div>
          </div>
          <div>
            <div className="carousel-slide">ẢNH BỆNH VIỆN SLIDE 2</div>
          </div>
          <div>
            <div className="carousel-slide">ẢNH BỆNH VIỆN SLIDE 3</div>
          </div>
        </Carousel>
        <Button
          className="carousel-arrow left-arrow"
          icon={<LeftOutlined />}
          onClick={() => carouselRef.current.prev()}
        />
        <Button
          className="carousel-arrow right-arrow"
          icon={<RightOutlined />}
          onClick={() => carouselRef.current.next()}
        />
      </div>

      {/* Consultation form */}
      <div className="consultation-section">
        <h2>ĐĂNG KÍ NHẬN TƯ VẤN</h2>
        <Form layout="vertical" className="consultation-form">
          <Form.Item label="Email của bạn">
            <Input placeholder="yourname@gmail.com" />
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input placeholder="Nhập SĐT" />
          </Form.Item>
          <Form.Item label="Chọn dịch vụ">
            <Select defaultValue="Dịch vụ 1">
              <Option value="1">Dịch vụ 1</Option>
              <Option value="2">Dịch vụ 2</Option>
              <Option value="3">Dịch vụ 3</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button className='submitButton' type="primary" block>
              Tiếp theo
            </Button>
          </Form.Item>
        </Form>
        <p className="disclaimer">*Thông tin của quý khách đảm bảo được bảo mật</p>
      </div>

      {/* News section */}
      <div className="news-section">
        <h2 className="section-title">Tin tức</h2>
        <div className="about-us-header">
          <h3>THÔNG TIN VỀ CHÚNG TÔI</h3>
        </div>
        <Row gutter={[16, 24]} justify="center">
          {[1, 2, 3].map((item) => (
            <Col key={item} xs={24} sm={12} md={8}>
              <Card className="news-card">
                <p className="news-date">Ngày 10 tháng 5 năm 2023</p>
                <p className="news-content">
                  It is a long established fact that a reader will be distracted
                </p>
                <div className="news-stats">
                  <span className="stat-item">⏰ 68</span>
                  <span className="stat-item">⏰ 86</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Contact section */}
      <div className="contact-section">
        <h2 className="section-title">Liên hệ</h2>
        <Row gutter={16} justify="center">
          <Col xs={24} sm={12} md={6}>
            <Card className="contact-card">
              <div className="contact-item">
                <PhoneOutlined className="contact-icon" />
                <div>
                  <h3>HOTLINE</h3>
                  <p>(237) 681-812-255</p>
                  <p>(237) 666-331-894</p>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="contact-card">
              <div className="contact-item">
                <EnvironmentOutlined className="contact-icon" />
                <div>
                  <h3>ĐỊA ĐIỂM</h3>
                  <p>Hà Nội</p>
                  <p>TP HCM</p>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="contact-card">
              <div className="contact-item">
                <MailOutlined className="contact-icon" />
                <div>
                  <h3>EMAIL</h3>
                  <p>fildineeesoe@gmail.com</p>
                  <p>abcxyz@gmail.com</p>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="contact-card">
              <div className="contact-item">
                <ClockCircleOutlined className="contact-icon" />
                <div>
                  <h3>GIỜ LÀM VIỆC</h3>
                  <p>T2-T6 08:00-17:00</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LandingPage;