import React from "react";
import { Carousel, Button, Input, Select, Form, Card, Row, Col } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const contentStyle = {
  height: "300px",
  color: "#000",
  lineHeight: "300px",
  textAlign: "center",
  background: "#69c0ff",
  fontSize: 24,
  fontWeight: "bold",
};

const customArrowStyle = {
  fontSize: "24px",
  color: "#000",
};

const LandingPage = () => {
  const carouselRef = React.useRef();

  return (
    <div>
      {/* Banner with arrows */}
      <div style={{ position: "relative" }}>
        <Carousel ref={carouselRef} dots={false}>
          <div>
            <div style={contentStyle}>ẢNH BỆNH VIỆN SLIDE 1</div>
          </div>
          <div>
            <div style={contentStyle}>ẢNH BỆNH VIỆN SLIDE 2</div>
          </div>
        </Carousel>
        <Button
          style={{ ...customArrowStyle, position: "absolute", top: "50%", left: 10 }}
          icon={<LeftOutlined />}
          onClick={() => carouselRef.current.prev()}
        />
        <Button
          style={{ ...customArrowStyle, position: "absolute", top: "50%", right: 10 }}
          icon={<RightOutlined />}
          onClick={() => carouselRef.current.next()}
        />
      </div>

      {/* Tư vấn form */}
      <div style={{ background: "#1e40af", color: "white", padding: 20 }}>
        <h2 style={{ color: "white" }}>ĐĂNG KÍ NHẬN TƯ VẤN</h2>
        <Form layout="vertical" style={{ maxWidth: 400, margin: "auto" }}>
          <Form.Item label="Email của bạn">
            <Input placeholder="youname@gmail.com" />
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
            <Button type="primary" block>
              Tiếp theo
            </Button>
          </Form.Item>
        </Form>
        <p style={{ fontSize: 12 }}>*Thông tin của quý khách đảm bảo được bảo mật</p>
      </div>

      {/* Tin tức */}
      <div style={{ padding: 40, background: "#f9f9f9" }}>
        <h2 style={{ textAlign: "center" }}>Tin tức</h2>
        <Row gutter={16} justify="center">
          {[1, 2, 3, 4].map((item) => (
            <Col key={item} xs={24} sm={12} md={6}>
              <Card
                hoverable
                cover={<img alt="news" src="https://via.placeholder.com/200" />}
              >
                <p>Ngày 10 tháng 5 năm 2023</p>
                <p>It is a long established fact that a reader will be distracted</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Liên hệ */}
      <div style={{ padding: 40, background: "#e0f7fa" }}>
        <h2 style={{ textAlign: "center" }}>Liên hệ</h2>
        <Row gutter={16} justify="center">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <PhoneOutlined /> HOTLINE<br />
              (237) 681-812-255
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <EnvironmentOutlined /> ĐỊA ĐIỂM<br />
              Hà Nội, TP HCM
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <MailOutlined /> EMAIL<br />
              example@gmail.com
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <ClockCircleOutlined /> GIỜ LÀM VIỆC<br />
              T2-T6: 08:00–17:00
            </Card>
          </Col>
        </Row>
      </div>

      {/* Footer */}
      <div style={{ background: "#1e40af", color: "white", padding: 20, textAlign: "center" }}>
        <h3>MEDBROS</h3>
        <p>Better together</p>
        <p>© 2023 Medbros</p>
      </div>
    </div>
  );
};

export default LandingPage;
