import { useState } from 'react';
import {
  Card,
  Button,
  DatePicker,
  Input,
  InputNumber,
  Form,
  message,
  Steps,
  Radio,
  Alert,
  Divider,
} from 'antd';
import {
  HeartOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import './SetupMenstrualForm.css';

const { TextArea } = Input;
const { Step } = Steps;

const API_URL = 'http://localhost:3000';

const SetupSuccessPage = ({ onSetupComplete, onEditInfo }) => {
  return (
    <div className="setup-complete">
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          }}
        >
          <CheckCircleOutlined
            style={{
              fontSize: '40px',
              color: '#ffffff',
            }}
          />
        </div>

        <h2
          style={{
            color: '#262626',
            fontSize: '24px',
            marginBottom: '16px',
            fontWeight: '600',
          }}
        >
          Thiết lập thành công! 🎉
        </h2>

        <p
          style={{
            color: '#666',
            fontSize: '16px',
            marginBottom: '8px',
            lineHeight: '1.6',
          }}
        >
          Bạn đã thiết lập thành công theo dõi chu kỳ kinh nguyệt.
        </p>

        <p
          style={{
            color: '#888',
            fontSize: '14px',
            marginBottom: '32px',
            lineHeight: '1.5',
          }}
        >
          Hệ thống sẽ bắt đầu theo dõi và dự đoán chu kỳ của bạn dựa trên thông
          tin đã cung cấp.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button
            type="primary"
            size="large"
            onClick={onSetupComplete}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              height: 'auto',
              fontSize: '16px',
              fontWeight: '500',
            }}
            icon={<CalendarOutlined />}
          >
            Xem Dự Đoán Chu Kỳ
          </Button>

          <Button
            type="default"
            size="large"
            onClick={onEditInfo}
            style={{
              borderRadius: '8px',
              padding: '12px 24px',
              height: 'auto',
              fontSize: '16px',
            }}
          >
            Chỉnh Sửa Thông Tin
          </Button>
        </div>

        <div
          style={{
            marginTop: '32px',
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
          }}
        >
          <h4
            style={{ color: '#495057', marginBottom: '8px', fontSize: '14px' }}
          >
            💡 Lưu ý quan trọng:
          </h4>
          <ul
            style={{
              textAlign: 'left',
              color: '#6c757d',
              fontSize: '13px',
              margin: '0',
              paddingLeft: '20px',
            }}
          >
            <li>
              Dữ liệu của bạn được bảo mật và chỉ dùng cho mục đích theo dõi sức
              khỏe
            </li>
            <li>
              Để có kết quả chính xác nhất, hãy cập nhật thông tin định kỳ
            </li>
            <li>Bạn có thể chỉnh sửa thông tin bất kỳ lúc nào</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const SetupMenstrualForm = ({ onSetupComplete }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const token = Cookies.get('accessToken');

      if (!token) {
        message.error('Vui lòng đăng nhập để sử dụng tính năng này!');
        setLoading(false);
        return;
      }

      let payload;

      payload = {
        start_date: values.startDate.toISOString(),
        end_date: values.endDate.toISOString(),
        period: values.cycleLength.toString() || '5',
        note: values.description || 'Đăng ký theo dõi chu kỳ lần đầu',
      };

      const response = await axios.post(
        `${API_URL}/customer/track-period`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      message.success('Thiết lập theo dõi chu kỳ kinh nguyệt thành công! 🎉');

      setCurrentStep(1);
    } catch (error) {
      console.error('Error during setup:', error);

      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      } else if (error.response?.status === 400) {
        message.error('Thông tin không hợp lệ. Vui lòng kiểm tra lại!');
      } else if (!error.response) {
        message.error(
          'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!'
        );
      } else {
        message.error(
          `Lỗi: ${error.response?.data?.message || 'Không thể thiết lập theo dõi chu kỳ'}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormFailed = (errorInfo) => {
    message.error('Vui lòng kiểm tra và điền đầy đủ thông tin!');
  };

  const disabledDate = (current) => {
    const threeMonthsAgo = dayjs().subtract(3, 'month');
    return (
      current && (current > dayjs().endOf('day') || current < threeMonthsAgo)
    );
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: 'Nhập thông tin',
      content: 'Cung cấp thông tin chu kỳ',
    },
    {
      title: 'Hoàn thành',
      content: 'Xác nhận và bắt đầu theo dõi',
    },
  ];

  return (
    <div className="setup-form-container">
      <Card
        className="setup-form-card"
        title={
          <div className="setup-form-title">
            <HeartOutlined style={{ color: '#ff69b4', marginRight: '8px' }} />
            Thiết Lập Theo Dõi Chu Kỳ Kinh Nguyệt
          </div>
        }
      >
        <Steps current={currentStep} className="setup-steps">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <Divider />

        {currentStep === 0 && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onFinishFailed={handleFormFailed}
            className="setup-form"
            initialValues={{
              cycleLength: 28,
            }}
          >
            <Alert
              message="Nhập thông tin kỳ kinh gần nhất"
              description="Vui lòng nhập ngày bắt đầu và kết thúc của kỳ kinh gần nhất để hệ thống có thể dự đoán chính xác nhất."
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <Form.Item
              name="startDate"
              label="Ngày bắt đầu kỳ kinh gần nhất"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn ngày bắt đầu kỳ kinh!',
                },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Chọn ngày bắt đầu"
                disabledDate={disabledDate}
                format="DD/MM/YYYY"
                suffixIcon={<CalendarOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Ngày kết thúc kỳ kinh gần nhất"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn ngày kết thúc kỳ kinh!',
                },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Chọn ngày kết thúc"
                disabledDate={disabledDate}
                format="DD/MM/YYYY"
                suffixIcon={<CalendarOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="cycleLength"
              label="Độ dài chu kỳ (ngày)"
              extra="Thời gian từ ngày đầu kỳ kinh này đến ngày đầu kỳ kinh tiếp theo"
              initialValue={28}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập độ dài chu kỳ!',
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số ngày (21-35)"
              // min={21}
              // max={35}
              />
            </Form.Item>

            <Form.Item name="description" label="Ghi chú (tùy chọn)">
              <TextArea
                placeholder="Nhập ghi chú về chu kỳ của bạn..."
                rows={3}
                maxLength={500}
                showCount
              />
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                onClick={() => {
                  form.submit();
                }}
              >
                Bắt Đầu Theo Dõi
              </Button>
            </div>
          </Form>
        )}

        {currentStep === 1 && (
          <SetupSuccessPage
            onSetupComplete={onSetupComplete}
            onEditInfo={() => {
              setCurrentStep(1);
              form.resetFields();
            }}
          />
        )}

        <div className="setup-form-note">
          <p>
            <strong>Lưu ý quan trọng:</strong>
          </p>
          <ul>
            <li>
              Thông tin này sẽ giúp hệ thống dự đoán chu kỳ tiếp theo của bạn
            </li>
            <li>Bạn có thể cập nhật và điều chỉnh thông tin bất kỳ lúc nào</li>
            <li>
              Dữ liệu của bạn được bảo mật và chỉ dùng cho mục đích theo dõi sức
              khỏe
            </li>
            <li>
              Để có kết quả chính xác nhất, hãy cập nhật thông tin định kỳ
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default SetupMenstrualForm;
