import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  message,
  Typography,
  Select,
  Alert,
  Tag,
  Divider,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  CalendarOutlined,
  ExperimentOutlined,
  HeartOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './Services.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Services = () => {
  const navigate = useNavigate();
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState({});
  const [loading, setLoading] = useState(false);

  const services = [
    {
      id: 1,
      title: 'Theo dõi chu kỳ kinh nguyệt',
      description:
        'Ứng dụng thông minh giúp theo dõi chu kỳ kinh nguyệt, dự đoán ngày rụng trứng và các giai đoạn trong chu kỳ',
      icon: <HeartOutlined />,
      price: 'Miễn phí',
      features: [
        'Theo dõi chu kỳ hàng tháng',
        'Dự đoán ngày rụng trứng',
        'Nhắc nhở thông minh',
        'Báo cáo sức khỏe',
        'Lưu trữ dữ liệu an toàn',
      ],
      color: '#ff69b4',
      buttonText: 'Sử dụng ngay',
    },
    {
      id: 2,
      title: 'Đặt lịch xét nghiệm',
      description:
        'Đặt lịch xét nghiệm các chỉ số sức khỏe sinh sản với quy trình chuyên nghiệp và kết quả chính xác',
      icon: <ExperimentOutlined />,
      price: 'Từ 200.000đ',
      features: [
        'Xét nghiệm hormone',
        'Xét nghiệm tầm soát ung thư',
        'Xét nghiệm nhiễm trùng',
        'Xét nghiệm máu tổng quát',
        'Báo cáo kết quả nhanh',
      ],
      color: '#4ecdc4',
      buttonText: 'Đặt lịch ngay',
    },
    {
      id: 3,
      title: 'Tư vấn 1:1 với bác sĩ',
      description:
        'Tư vấn trực tiếp với bác sĩ chuyên khoa phụ sản, giải đáp mọi thắc mắc về sức khỏe sinh sản',
      icon: <UserOutlined />,
      price: 'Từ 300.000đ',
      features: [
        'Tư vấn trực tiếp với bác sĩ',
        'Thời gian linh hoạt',
        'Giải đáp mọi thắc mắc',
        'Hồ sơ sức khỏe cá nhân',
        'Theo dõi định kỳ',
      ],
      color: '#667eea',
      buttonText: 'Đặt lịch tư vấn',
    },
  ];

  // Giả lập dữ liệu lịch đã đặt (trong thực tế sẽ lấy từ API)
  useEffect(() => {
    // Khởi tạo dữ liệu lịch đã đặt
    const mockBookedSlots = {
      '2024-01-15': ['09:00', '10:00', '14:00'],
      '2024-01-16': ['09:00', '11:00', '15:00'],
      '2024-01-17': ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'],
    };
    setBookedSlots(mockBookedSlots);
  }, []);

  // Tạo danh sách khung giờ có thể đặt
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 17;
    const slotDuration = 60; // 60 phút mỗi slot

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  // Kiểm tra slot có khả dụng không
  const isSlotAvailable = (date, time) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    const bookedTimes = bookedSlots[dateStr] || [];
    return !bookedTimes.includes(time);
  };

  // Lấy số lượng slot còn trống trong ngày
  const getAvailableSlotsCount = (date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    const bookedTimes = bookedSlots[dateStr] || [];
    const totalSlots = generateTimeSlots().length;
    return totalSlots - bookedTimes.length;
  };

  // Xử lý khi chọn ngày
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const allSlots = generateTimeSlots();
      const dateStr = dayjs(date).format('YYYY-MM-DD');
      const bookedTimes = bookedSlots[dateStr] || [];
      const available = allSlots.filter((slot) => !bookedTimes.includes(slot));
      setAvailableSlots(available);
    } else {
      setAvailableSlots([]);
    }
  };

  // Kiểm tra ngày có thể đặt lịch không
  const disabledDate = (current) => {
    // Không cho phép đặt lịch trong quá khứ và chủ nhật
    const today = dayjs().startOf('day');
    const isWeekend = current && current.day() === 0; // Chủ nhật
    const isPast = current && current.isBefore(today);
    const isTooFar = current && current.isAfter(dayjs().add(30, 'day')); // Chỉ cho đặt trong 30 ngày

    return isPast || isWeekend || isTooFar;
  };

  const handleServiceClick = (service) => {
    if (service.id === 1) {
      // Redirect to menstrual cycle tracking page (we'll create this later)
      message.info(
        'Chức năng theo dõi chu kỳ kinh nguyệt đang được phát triển!'
      );
    } else if (service.id === 2) {
      setIsTestModalOpen(true);
    } else if (service.id === 3) {
      setIsConsultationModalOpen(true);
    }
  };

  const handleBookingSubmit = async (values, serviceType) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (serviceType === 'test') {
        // Cập nhật slot đã đặt
        const dateStr = dayjs(values.preferredDate).format('YYYY-MM-DD');
        const newBookedSlots = { ...bookedSlots };
        if (!newBookedSlots[dateStr]) {
          newBookedSlots[dateStr] = [];
        }
        newBookedSlots[dateStr].push(values.preferredTime);
        setBookedSlots(newBookedSlots);

        message.success(
          `Đặt lịch xét nghiệm thành công cho ngày ${dayjs(values.preferredDate).format('DD/MM/YYYY')} lúc ${values.preferredTime}! Chúng tôi sẽ liên hệ với bạn sớm nhất.`
        );
        setIsTestModalOpen(false);
        setSelectedDate(null);
        setAvailableSlots([]);
      } else {
        message.success(
          'Đặt lịch tư vấn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.'
        );
        setIsConsultationModalOpen(false);
      }

      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="services-container">
      {/* Header */}
      <div className="services-header">
        <Title level={2} className="services-title">
          Dịch vụ chăm sóc sức khỏe sinh sản
        </Title>
        <Paragraph className="services-subtitle">
          Chúng tôi cung cấp các dịch vụ chăm sóc sức khỏe toàn diện, từ theo
          dõi chu kỳ đến tư vấn chuyên khoa với đội ngũ y bác sĩ giàu kinh
          nghiệm.
        </Paragraph>
      </div>
      <div className="services-content">
        {/* Services Grid */}
        <Row gutter={[32, 32]} className="services-grid">
          {services.map((service) => (
            <Col xs={24} lg={8} key={service.id}>
              <Card
                className="service-card"
                cover={
                  <div
                    className="service-header"
                    style={{ backgroundColor: service.color }}
                  >
                    <div className="service-icon">
                      {React.cloneElement(service.icon, {
                        style: { fontSize: '3rem', color: 'white' },
                      })}
                    </div>
                    <div className="service-price">{service.price}</div>
                  </div>
                }
              >
                <div className="service-content">
                  <Title level={4} className="service-title">
                    {service.title}
                  </Title>

                  <Paragraph className="service-description">
                    {service.description}
                  </Paragraph>

                  <div className="service-features">
                    <Text strong className="features-title">
                      Bao gồm:
                    </Text>
                    <ul className="features-list">
                      {service.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    block
                    className="service-button"
                    style={{
                      backgroundColor: service.color,
                      borderColor: service.color,
                      marginTop: '20px',
                    }}
                    onClick={() => handleServiceClick(service)}
                  >
                    {service.buttonText}
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Test Booking Modal */}
        <Modal
          title="Đặt lịch xét nghiệm"
          open={isTestModalOpen}
          onCancel={() => {
            setIsTestModalOpen(false);
            setSelectedDate(null);
            setAvailableSlots([]);
            form.resetFields();
          }}
          footer={null}
          width={700}
        >
          <Alert
            message="Lưu ý quan trọng"
            description="Vui lòng chọn ngày và kiểm tra lịch trống trước khi đặt. Chúng tôi không làm việc vào Chủ nhật."
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => handleBookingSubmit(values, 'test')}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nhập họ và tên"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Vui lòng nhập email hợp lệ',
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Loại xét nghiệm"
              name="testType"
              rules={[
                { required: true, message: 'Vui lòng chọn loại xét nghiệm' },
              ]}
            >
              <Select placeholder="Chọn loại xét nghiệm">
                <Option value="hormone">Xét nghiệm hormone</Option>
                <Option value="cancer_screening">Tầm soát ung thư</Option>
                <Option value="infection">Xét nghiệm nhiễm trùng</Option>
                <Option value="blood_test">Xét nghiệm máu tổng quát</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>

            <Divider>Chọn lịch hẹn</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ngày mong muốn"
                  name="preferredDate"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Chọn ngày"
                    disabledDate={disabledDate}
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Giờ mong muốn"
                  name="preferredTime"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                >
                  <Select
                    placeholder="Chọn giờ"
                    disabled={!selectedDate}
                    notFoundContent={
                      selectedDate
                        ? 'Không có giờ trống'
                        : 'Vui lòng chọn ngày trước'
                    }
                  >
                    {availableSlots.map((slot) => (
                      <Option key={slot} value={slot}>
                        {slot}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {selectedDate && (
              <div style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={24}>
                    <div
                      style={{
                        background: '#f6f8fa',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #e1e8ed',
                      }}
                    >
                      <div style={{ marginBottom: 8 }}>
                        <strong>
                          Thông tin lịch ngày{' '}
                          {dayjs(selectedDate).format('DD/MM/YYYY')}:
                        </strong>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                          {availableSlots.length} slot trống
                        </Tag>
                        <Tag color="red" icon={<WarningOutlined />}>
                          {9 - availableSlots.length} slot đã đặt
                        </Tag>
                      </div>
                      {availableSlots.length <= 3 && (
                        <Alert
                          message="Lịch sắp hết chỗ!"
                          description="Chỉ còn ít slot trống, vui lòng đặt sớm để đảm bảo có chỗ."
                          type="warning"
                          showIcon
                          style={{ marginTop: 8 }}
                        />
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            <Form.Item label="Ghi chú" name="notes">
              <TextArea rows={3} placeholder="Ghi chú thêm (nếu có)..." />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Xác nhận đặt lịch
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Consultation Booking Modal */}
        <Modal
          title="Đặt lịch tư vấn 1:1"
          open={isConsultationModalOpen}
          onCancel={() => setIsConsultationModalOpen(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => handleBookingSubmit(values, 'consultation')}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nhập họ và tên"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Vui lòng nhập email hợp lệ',
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Lý do tư vấn"
              name="consultationReason"
              rules={[
                { required: true, message: 'Vui lòng chọn lý do tư vấn' },
              ]}
            >
              <Select placeholder="Chọn lý do tư vấn">
                <Option value="general_checkup">Khám tổng quát</Option>
                <Option value="menstrual_issues">Vấn đề về kinh nguyệt</Option>
                <Option value="reproductive_health">Sức khỏe sinh sản</Option>
                <Option value="contraception">Tư vấn tránh thai</Option>
                <Option value="pregnancy_planning">Kế hoạch mang thai</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ngày mong muốn"
                  name="preferredDate"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Chọn ngày"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Giờ mong muốn"
                  name="preferredTime"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                >
                  <TimePicker
                    style={{ width: '100%' }}
                    placeholder="Chọn giờ"
                    format="HH:mm"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Mô tả triệu chứng" name="symptoms">
              <TextArea
                rows={4}
                placeholder="Mô tả chi tiết tình trạng sức khỏe hoặc triệu chứng..."
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                Xác nhận đặt lịch
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Services;
