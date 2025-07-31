import React from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  message,
} from 'antd';
import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './CycleUpdateModal.css';

const CycleUpdateModal = ({
  visible,
  onCancel,
  lastPeriodStart,
  setLastPeriodStart,
  lastPeriodEnd,
  setLastPeriodEnd,
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
      const calculatedPeriodLength = Math.min(
        7,
        Math.max(3, Math.floor(cycleLength / 5))
      );
      form.setFieldsValue({ periodLength: calculatedPeriodLength });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Update state with form values
      setLastPeriodStart(values.lastPeriodStart.format('YYYY-MM-DD'));
      setLastPeriodEnd(values.lastPeriodEnd.format('YYYY-MM-DD'));
      setCycleLength(values.cycleLength);
      // setPeriodLength(values.periodLength);

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

  // const disabledDate = (current) => {
  //   const threeMonthsAgo = moment().subtract(3, 'months');
  //   return (
  //     current && (current > moment().endOf('day') || current < threeMonthsAgo)
  //   );
  // };

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
          // type="primary"
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
            lastPeriodStart: lastPeriodStart ? dayjs(lastPeriodStart) : null,
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

                  const today = dayjs();
                  const threeMonthsAgo = dayjs().subtract(3, 'months');

                  if (value.isAfter(today)) {
                    return Promise.reject(
                      new Error(
                        'Ngày bắt đầu không thể là ngày trong tương lai!'
                      )
                    );
                  }

                  if (value.isBefore(threeMonthsAgo)) {
                    return Promise.reject(
                      new Error('Ngày bắt đầu không thể quá 3 tháng trước!')
                    );
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
              selected={dayjs()}
              suffixIcon={<CalendarOutlined />}
              // disabledDate={disabledDate}
            />
          </Form.Item>

          <Form.Item
            label="Ngày kết thúc kỳ kinh gần tháng này"
            name="lastPeriodEnd"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn ngày kết thúc kỳ kinh!',
              },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve();
                  }

                  const today = dayjs();
                  const threeMonthsAgo = dayjs().subtract(3, 'months');

                  if (value.isAfter(today)) {
                    return Promise.reject(
                      new Error(
                        'Ngày kết thúc không thể là ngày trong tương lai!'
                      )
                    );
                  }

                  if (value.isBefore(threeMonthsAgo)) {
                    return Promise.reject(
                      new Error('Ngày kết thúc không thể quá 3 tháng trước!')
                    );
                  }

                  const startDate = dayjs(lastPeriodStart);
                  if (value.isBefore(startDate)) {
                    return Promise.reject(
                      new Error('Ngày kết thúc phải sau ngày bắt đầu!')
                    );
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
              selected={dayjs()}
              suffixIcon={<CalendarOutlined />}
              // disabledDate={disabledDate}
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
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Ví dụ: 28"
              min={21}
              max={35}
              defaultValue={cycleLength || 28}
            />
          </Form.Item>
        </Form>

        <div className="tips-section">
          <h4>💡 Lưu ý:</h4>
          <ul>
            <li>Độ dài chu kỳ thường từ 21-35 ngày</li>
            <li>Kỳ kinh thường kéo dài 1-7 ngày</li>
            <li>Cập nhật thông tin chính xác để có dự đoán tốt hơn</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default CycleUpdateModal;
