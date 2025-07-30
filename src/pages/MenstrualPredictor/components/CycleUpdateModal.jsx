import React from 'react';
import { Modal, Form, Input, DatePicker, Button, message } from 'antd';
import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import './CycleUpdateModal.css';

const CycleUpdateModal = ({
  visible,
  onCancel,
  lastPeriodStart,
  setLastPeriodStart,
  cycleLength,
  setCycleLength,
  periodLength,
  setPeriodLength,
  onUpdate,
}) => {
  const [form] = Form.useForm();

  // Tự động tính periodLength khi lastPeriodStart thay đổi
  const handleFormValuesChange = (changedValues, allValues) => {
    const { lastPeriodStart } = allValues;
    
    if (lastPeriodStart) {
      // Tính periodLength dựa trên cycleLength (thường là 5-7 ngày)
      const calculatedPeriodLength = Math.min(7, Math.max(3, Math.floor(cycleLength / 5)));
      form.setFieldsValue({ periodLength: calculatedPeriodLength });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Update state with form values
      setLastPeriodStart(values.lastPeriodStart.format('YYYY-MM-DD'));
      setCycleLength(values.cycleLength);
      setPeriodLength(values.periodLength);

      // Call parent update function
      await onUpdate();

      message.success('Cập nhật thông tin chu kỳ thành công!');
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const disabledDate = (current) => {
    const threeMonthsAgo = moment().subtract(3, 'months');
    return (
      current && (current > moment().endOf('day') || current < threeMonthsAgo)
    );
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <EditOutlined className="modal-icon" />
          <span>Cập Nhật Thông Tin Chu Kỳ</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          className="submit-button"
        >
          Cập Nhật
        </Button>,
      ]}
      width={500}
      centered
      className="cycle-update-modal"
    >
      <div className="modal-content">
        <div className="info-section">
          <CalendarOutlined className="info-icon" />
          <div className="info-text">
            <h4>Cập nhật thông tin chu kỳ kinh nguyệt</h4>
            <p>Nhập thông tin chính xác để có dự đoán tốt hơn</p>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          className="update-form"
          initialValues={{
            lastPeriodStart: lastPeriodStart ? moment(lastPeriodStart) : null,
            cycleLength: cycleLength || 28,
            periodLength: periodLength || 5,
          }}
          onValuesChange={handleFormValuesChange}
        >
          <Form.Item
            label="Ngày bắt đầu kỳ kinh gần nhất"
            name="lastPeriodStart"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn ngày bắt đầu kỳ kinh!',
              },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve();
                  }
                  
                  const today = moment();
                  const threeMonthsAgo = moment().subtract(3, 'months');
                  
                  if (value.isAfter(today, 'day')) {
                    return Promise.reject(new Error('Ngày bắt đầu không thể là ngày trong tương lai!'));
                  }
                  
                  if (value.isBefore(threeMonthsAgo, 'day')) {
                    return Promise.reject(new Error('Ngày bắt đầu không thể quá 3 tháng trước!'));
                  }
                  
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Chọn ngày"
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
            />
          </Form.Item>

          <Form.Item
            label="Độ dài chu kỳ (ngày)"
            name="cycleLength"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập độ dài chu kỳ!',
              },
              {
                type: 'number',
                min: 21,
                max: 35,
                message: 'Độ dài chu kỳ phải từ 21-35 ngày!',
              },
            ]}
          >
            <Input type="number" placeholder="Ví dụ: 28" min={21} max={35} />
          </Form.Item>

          <Form.Item
            label="Độ dài kỳ kinh (ngày)"
            name="periodLength"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập độ dài kỳ kinh!',
              },
              {
                type: 'number',
                min: 3,
                max: 7,
                message: 'Độ dài kỳ kinh phải từ 3-7 ngày!',
              },
            ]}
          >
            <Input type="number" placeholder="Ví dụ: 5" min={3} max={7} />
          </Form.Item>
        </Form>

        <div className="tips-section">
          <h4>💡 Lưu ý:</h4>
          <ul>
            <li>Độ dài chu kỳ thường từ 21-35 ngày</li>
            <li>Kỳ kinh thường kéo dài 3-7 ngày</li>
            <li>Cập nhật thông tin chính xác để có dự đoán tốt hơn</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default CycleUpdateModal;
