import React, { useState } from 'react';
import {
  Carousel,
  Button,
  Input,
  Select,
  Form,
  Card,
  Row,
  Col,
  message,
  Typography,
  Divider,
} from 'antd';
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  SafetyOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  TeamOutlined,
  StarOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import './LandingPage.css';

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

const LandingPage = () => {
  const carouselRef = React.useRef();
  const newsCarouselRef = React.useRef();
  const [consultationForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Health news data
  const healthNews = [
    {
      id: 1,
      title: 'Kinh nguyệt không đều: Nguyên nhân và cách khắc phục',
      summary:
        'Tìm hiểu về các nguyên nhân gây ra kinh nguyệt không đều và các phương pháp điều trị hiệu quả.',
      image:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
      date: '15/12/2024',
      views: 1250,
      likes: 89,
      category: 'Sức khỏe phụ nữ',
    },
    {
      id: 2,
      title: 'Nhiễm trùng đường tiết niệu: Triệu chứng và phòng ngừa',
      summary:
        'Hướng dẫn nhận biết sớm các triệu chứng nhiễm trùng đường tiết niệu và cách phòng ngừa hiệu quả.',
      image:
        'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=250&fit=crop',
      date: '12/12/2024',
      views: 980,
      likes: 67,
      category: 'Nhiễm trùng',
    },
    {
      id: 3,
      title: 'Bệnh lây truyền qua đường tình dục: Kiến thức cần biết',
      summary:
        'Thông tin quan trọng về các bệnh lây truyền qua đường tình dục và cách bảo vệ bản thân.',
      image:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
      date: '10/12/2024',
      views: 1450,
      likes: 124,
      category: 'Giáo dục tình dục',
    },
    {
      id: 4,
      title: 'Viêm nấm âm đạo: Nguyên nhân và điều trị',
      summary:
        'Tìm hiểu về viêm nấm âm đạo, các yếu tố nguy cơ và phương pháp điều trị an toàn.',
      image:
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop',
      date: '08/12/2024',
      views: 2100,
      likes: 156,
      category: 'Bệnh phụ khoa',
    },
    {
      id: 5,
      title: 'Sức khỏe sinh sản nam giới: Những điều cần chú ý',
      summary:
        'Hướng dẫn nam giới chăm sóc sức khỏe sinh sản và phòng ngừa các bệnh lý thường gặp.',
      image:
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=250&fit=crop',
      date: '05/12/2024',
      views: 1680,
      likes: 203,
      category: 'Sức khỏe nam giới',
    },
    {
      id: 6,
      title: 'Chuẩn bị mang thai: Checklist cho các cặp đôi',
      summary:
        'Danh sách kiểm tra sức khỏe và những chuẩn bị cần thiết khi lên kế hoạch mang thai.',
      image:
        'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=250&fit=crop',
      date: '03/12/2024',
      views: 3200,
      likes: 287,
      category: 'Mang thai',
    },
  ];

  const hospitalImages = [
    {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=600&fit=crop',
      title: 'Cơ sở y tế hiện đại',
      subtitle: 'Trang thiết bị y tế tiên tiến nhất',
    },
    {
      url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=600&fit=crop',
      title: 'Đội ngũ bác sĩ chuyên nghiệp',
      subtitle: 'Kinh nghiệm nhiều năm trong lĩnh vực sức khỏe sinh sản',
    },
    {
      url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=600&fit=crop',
      title: 'Môi trường chăm sóc tận tâm',
      subtitle: 'Luôn đặt sức khỏe bệnh nhân lên hàng đầu',
    },
  ];

  const onConsultationSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      message.success(
        'Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.'
      );
      consultationForm.resetFields();
    } catch (error) {
      message.error('Đã có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      {/* Hero Banner */}
      <div className="hero-section">
        <div className="carousel-container">
          <Carousel ref={carouselRef} dots={true} autoplay autoplaySpeed={5000}>
            {hospitalImages.map((image, index) => (
              <div key={index}>
                <div
                  className="carousel-slide"
                  style={{ backgroundImage: `url(${image.url})` }}
                >
                  <div className="slide-overlay">
                    <div className="slide-content">
                      <Title level={1} className="slide-title">
                        {image.title}
                      </Title>
                      <Paragraph className="slide-subtitle">
                        {image.subtitle}
                      </Paragraph>
                      <Button type="primary" size="large" className="hero-cta">
                        Đặt lịch tư vấn <ArrowRightOutlined />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
          <Button
            className="carousel-arrow left-arrow"
            icon={<LeftCircleOutlined />}
            onClick={() => carouselRef.current.prev()}
          />
          <Button
            className="carousel-arrow right-arrow"
            icon={<RightCircleOutlined />}
            onClick={() => carouselRef.current.next()}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <div className="feature-card">
                <HeartOutlined className="feature-icon" />
                <Title level={3}>Chăm sóc tận tâm</Title>
                <Paragraph>
                  Đội ngũ y bác sĩ giàu kinh nghiệm, luôn đồng hành cùng bạn
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="feature-card">
                <SafetyOutlined className="feature-icon" />
                <Title level={3}>An toàn tuyệt đối</Title>
                <Paragraph>
                  Quy trình điều trị chuẩn quốc tế, đảm bảo an toàn cho bệnh
                  nhân
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="feature-card">
                <MedicineBoxOutlined className="feature-icon" />
                <Title level={3}>Công nghệ hiện đại</Title>
                <Paragraph>
                  Trang thiết bị y tế tiên tiến, cập nhật công nghệ mới nhất
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Consultation Form */}
      <div className="consultation-section">
        <div className="container">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div className="consultation-content">
                <Title level={2} className="section-title">
                  <UserOutlined /> Đăng ký tư vấn miễn phí
                </Title>
                <Paragraph className="section-subtitle">
                  Hãy để lại thông tin để được tư vấn từ các chuyên gia hàng đầu
                  về sức khỏe sinh sản
                </Paragraph>
                <div className="benefits-list">
                  <div className="benefit-item">
                    <CheckCircleOutlined /> Tư vấn miễn phí từ bác sĩ chuyên
                    khoa
                  </div>
                  <div className="benefit-item">
                    <CheckCircleOutlined /> Bảo mật thông tin tuyệt đối
                  </div>
                  <div className="benefit-item">
                    <CheckCircleOutlined /> Hỗ trợ 24/7 qua hotline
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <Card className="consultation-card">
                <Form
                  form={consultationForm}
                  layout="vertical"
                  onFinish={onConsultationSubmit}
                  className="consultation-form"
                >
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[
                      { required: true, message: 'Vui lòng nhập họ tên!' },
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên của bạn" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại!',
                      },
                      {
                        pattern: /^[0-9]{10,11}$/,
                        message: 'Số điện thoại không hợp lệ!',
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                  >
                    <Input placeholder="yourname@gmail.com" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Dịch vụ quan tâm"
                    name="service"
                    rules={[
                      { required: true, message: 'Vui lòng chọn dịch vụ!' },
                    ]}
                  >
                    <Select
                      placeholder="Chọn dịch vụ bạn quan tâm"
                      size="large"
                    >
                      <Option value="reproductive-health">
                        Sức khỏe sinh sản
                      </Option>
                      <Option value="gynecology">Phụ khoa</Option>
                      <Option value="urology">Tiết niệu</Option>
                      <Option value="pregnancy">Thai nghén</Option>
                      <Option value="general">Tư vấn chung</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      className="submit-button"
                      block
                    >
                      Đặt lịch tư vấn ngay
                    </Button>
                  </Form.Item>
                </Form>
                <Text className="disclaimer">
                  <SafetyOutlined /> Thông tin của bạn được bảo mật tuyệt đối
                </Text>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Health News Section */}
      <div className="news-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              <CalendarOutlined /> Kiến thức sức khỏe
            </Title>
            <Paragraph className="section-subtitle">
              Khám phá những bí quyết chăm sóc sức khỏe sinh sản một cách khoa
              học và hiệu quả. Cùng các chuyên gia tìm hiểu cách bảo vệ bản thân
              và người thân yêu.
            </Paragraph>
          </div>

          <div className="news-carousel-container">
            <Carousel
              ref={newsCarouselRef}
              dots={false}
              slidesToShow={3}
              slidesToScroll={1}
              autoplay
              autoplaySpeed={4000}
              responsive={[
                { breakpoint: 1024, settings: { slidesToShow: 2 } },
                { breakpoint: 768, settings: { slidesToShow: 1 } },
              ]}
            >
              {healthNews.map((news) => (
                <div key={news.id} className="news-slide">
                  <Card
                    className="news-card"
                    cover={
                      <div className="news-image-wrapper">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="news-image"
                        />
                        <div className="news-category">{news.category}</div>
                      </div>
                    }
                    actions={[
                      <div className="news-stats">
                        <span>
                          <EyeOutlined /> {news.views}
                        </span>
                        <span>
                          <LikeOutlined /> {news.likes}
                        </span>
                        <span>
                          <MessageOutlined /> Đọc thêm
                        </span>
                      </div>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Title level={4} className="news-title">
                          {news.title}
                        </Title>
                      }
                      description={
                        <div>
                          <Paragraph className="news-summary">
                            {news.summary}
                          </Paragraph>
                          <Text className="news-date">{news.date}</Text>
                        </div>
                      }
                    />
                  </Card>
                </div>
              ))}
            </Carousel>

            <div className="news-navigation">
              <Button
                className="news-arrow left"
                icon={<LeftCircleOutlined />}
                onClick={() => newsCarouselRef.current.prev()}
              />
              <Button
                className="news-arrow right"
                icon={<RightCircleOutlined />}
                onClick={() => newsCarouselRef.current.next()}
              />
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="about-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              <TeamOutlined /> Về Gender Care
            </Title>
            <Paragraph className="section-subtitle">
              Đơn vị tiên phong trong lĩnh vực chăm sóc sức khỏe sinh sản với
              phương châm "Chăm sóc tận tâm - An toàn tuyệt đối"
            </Paragraph>
          </div>

          <Row gutter={[40, 40]} align="middle">
            <Col xs={24} lg={10}>
              <div className="about-image-container">
                <div className="about-main-image">
                  <img
                    src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=400&fit=crop"
                    alt="Về chúng tôi"
                  />
                </div>
                <div className="about-image-overlay">
                  <div className="overlay-content">
                    <Title level={3} className="overlay-title">
                      10+ Năm
                    </Title>
                    <Text className="overlay-text">
                      Kinh nghiệm chăm sóc sức khỏe
                    </Text>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={14}>
              <div className="about-content">
                <div className="about-description-card">
                  <Paragraph className="about-description">
                    <strong>Gender Care</strong> là đơn vị y tế chuyên khoa hàng
                    đầu với hơn 10 năm kinh nghiệm trong lĩnh vực chăm sóc sức
                    khỏe sinh sản. Chúng tôi cam kết mang đến dịch vụ y tế chất
                    lượng cao với công nghệ hiện đại và đội ngũ chuyên gia giàu
                    kinh nghiệm.
                  </Paragraph>

                  <div className="mission-values">
                    <div className="mission-item">
                      <HeartOutlined className="mission-icon" />
                      <div>
                        <Text strong>Sứ mệnh:</Text>
                        <Text>
                          {' '}
                          Bảo vệ và nâng cao sức khỏe sinh sản cho mọi người
                        </Text>
                      </div>
                    </div>
                    <div className="mission-item">
                      <SafetyOutlined className="mission-icon" />
                      <div>
                        <Text strong>Tầm nhìn:</Text>
                        <Text>
                          {' '}
                          Trở thành trung tâm y tế sinh sản uy tín nhất Việt Nam
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="stats-container">
                  <Row gutter={[20, 20]}>
                    <Col xs={12} sm={6}>
                      <div className="stat-card">
                        <div className="stat-number">10+</div>
                        <div className="stat-label">Năm kinh nghiệm</div>
                      </div>
                    </Col>
                    <Col xs={12} sm={6}>
                      <div className="stat-card">
                        <div className="stat-number">50K+</div>
                        <div className="stat-label">Bệnh nhân tin tưởng</div>
                      </div>
                    </Col>
                    <Col xs={12} sm={6}>
                      <div className="stat-card">
                        <div className="stat-number">100+</div>
                        <div className="stat-label">Bác sĩ chuyên khoa</div>
                      </div>
                    </Col>
                    <Col xs={12} sm={6}>
                      <div className="stat-card">
                        <div className="stat-number">98%</div>
                        <div className="stat-label">Hài lòng</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="certifications-modern">
                  <div className="cert-badge-container">
                    <div className="cert-badge">
                      <StarOutlined />
                      <span>Chuẩn quốc tế JCI</span>
                    </div>
                    <div className="cert-badge">
                      <SafetyCertificateOutlined />
                      <span>Top 10 Y tế uy tín 2024</span>
                    </div>
                    <div className="cert-badge">
                      <MedicineBoxOutlined />
                      <span>Bộ Y tế cấp phép</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
