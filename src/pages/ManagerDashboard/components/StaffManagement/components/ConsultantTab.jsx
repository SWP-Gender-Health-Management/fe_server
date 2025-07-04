// ConsultantTab.jsx
import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Checkbox,
  message,
  Space,
  Calendar,
  Tag,
  Row,
  Col,
  Card,
} from 'antd';
import moment from 'moment';

const ConsultantTab = ({ consultantData }) => {
  const [isScheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [isViewScheduleModalVisible, setViewScheduleModalVisible] =
    useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [form] = Form.useForm();

  const timeSlots = [
    '07:00 - 08:30',
    '08:30 - 10:00',
    '10:00 - 11:30',
    '11:30 - 13:00',
    '13:00 - 14:30',
    '14:30 - 16:00',
    '16:00 - 17:30',
    '17:30 - 18:00',
  ];

  // Mở Modal xếp lịch
  const handleOpenScheduleModal = (consultant) => {
    setSelectedConsultant(consultant);
    setScheduleModalVisible(true);
  };

  // Mở Modal xem lịch
  const handleOpenViewScheduleModal = (consultant) => {
    setSelectedConsultant(consultant);
    setViewScheduleModalVisible(true);
  };

  // Xử lý submit form xếp lịch
  const handleScheduleSubmit = (values) => {
    console.log('Các slot đã xếp cho consultant:', {
      consultantId: selectedConsultant.id,
      ...values,
    });
    message.success(`Đã xếp lịch cho ${selectedConsultant.name}`);
    setScheduleModalVisible(false);
    form.resetFields();
  };

  // Hàm render nội dung cho từng ô ngày trong lịch
  const dateCellRenderForConsultant = (value) => {
    // Chủ nhật là ngày nghỉ
    if (value.day() === 0) {
      // 0 là Chủ Nhật trong moment.js
      return <Tag color="red">Ngày nghỉ</Tag>;
    }

    const dateStr = value.format('YYYY-MM-DD');
    const scheduleForDay = selectedConsultant?.schedules?.find((s) =>
      moment(s.date).isSame(dateStr, 'day')
    );

    if (scheduleForDay && scheduleForDay.slots.length > 0) {
      return (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {scheduleForDay.slots.map((slot) => (
            <li key={slot}>
              <Tag color="blue">{slot}</Tag>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: 'Thông tin nhân sự',
      key: 'info',
      render: (_, record) => (
        <div className="staff-info">
          <div className="staff-avatar">
            {record.name.charAt(0).toUpperCase()}
          </div>
          <div className="staff-details">
            <div className="staff-name">{record.name}</div>
            <div className="staff-role">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleOpenScheduleModal(record)}>
            Xếp lịch
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => handleOpenViewScheduleModal(record)}
          >
            Xem lịch
          </Button>
        </Space>
      ),
    },
  ];

  // Tạo dữ liệu lịch làm việc 1 tuần hiện tại
  const getCurrentWeekSchedule = () => {
    const today = moment();
    const startOfWeek = today.clone().startOf('week').add(1, 'day'); // Thứ 2
    const weekSchedule = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = startOfWeek.clone().add(i, 'days');
      const dateStr = currentDate.format('YYYY-MM-DD');
      const scheduleForDay = selectedConsultant?.schedules?.find((s) =>
        moment(s.date).isSame(dateStr, 'day')
      );

      weekSchedule.push({
        date: currentDate,
        dayName: currentDate.format('dddd'),
        isSunday: currentDate.day() === 0,
        schedule: scheduleForDay,
      });
    }

    return weekSchedule;
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={consultantData}
        rowKey="id"
        pagination={{ pageSize: 8 }}
      />

      {/* Modal Xếp lịch cho Consultant */}
      <Modal
        title={`Xếp lịch cho - ${selectedConsultant?.name}`}
        open={isScheduleModalVisible}
        onCancel={() => setScheduleModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleScheduleSubmit}>
          <Form.Item
            name="date"
            label="Ngày làm việc"
            rules={[{ required: true }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Chọn ngày làm việc"
              disabledDate={(current) => {
                // Không cho phép chọn chủ nhật
                return current && current.day() === 0;
              }}
            />
          </Form.Item>
          <Form.Item name="slots" label="Chọn các slot thời gian làm việc">
            <Checkbox.Group
              options={timeSlots}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xem lịch của Consultant */}
      <Modal
        title={`Lịch làm việc của - ${selectedConsultant?.name}`}
        open={isViewScheduleModalVisible}
        onCancel={() => setViewScheduleModalVisible(false)}
        footer={null}
        width={1200}
      >
        <div className="weekly-schedule">
          <div className="schedule-header">
            <h3>Lịch làm việc tuần hiện tại</h3>
            <p>Thứ 2 - Chủ nhật</p>
          </div>

          <div className="schedule-grid">
            {getCurrentWeekSchedule().map((day, index) => (
              <div
                key={index}
                className={`schedule-day ${day.isSunday ? 'sunday' : ''}`}
              >
                <div className="day-header">
                  <div className="day-name">{day.date.format('dddd')}</div>
                  <div className="day-date">
                    {day.date.format('DD/MM/YYYY')}
                  </div>
                </div>

                <div className="day-content">
                  {day.isSunday ? (
                    <div className="day-off">
                      <div className="off-icon">🏖️</div>
                      <div className="off-text">Ngày nghỉ</div>
                    </div>
                  ) : day.schedule && day.schedule.slots.length > 0 ? (
                    <div className="work-slots">
                      <div className="slots-count">
                        {day.schedule.slots.length}/8 slot làm việc
                      </div>
                      <div className="slots-list">
                        {[
                          { time: '07:00 - 08:30', label: 'Slot 1' },
                          { time: '08:30 - 10:00', label: 'Slot 2' },
                          { time: '10:00 - 11:30', label: 'Slot 3' },
                          { time: '11:30 - 13:00', label: 'Slot 4' },
                          { time: '13:00 - 14:30', label: 'Slot 5' },
                          { time: '14:30 - 16:00', label: 'Slot 6' },
                          { time: '16:00 - 17:30', label: 'Slot 7' },
                          { time: '17:30 - 18:00', label: 'Slot 8' },
                        ].map((slot, idx) => {
                          const isScheduled = day.schedule.slots.includes(
                            slot.time
                          );
                          return (
                            <div
                              key={idx}
                              className={`slot-item ${isScheduled ? 'scheduled' : 'not-scheduled'}`}
                            >
                              <div className="slot-label">{slot.label}</div>
                              <div className="slot-time">{slot.time}</div>
                              <div className="slot-status">
                                {isScheduled ? '✓' : '○'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="no-schedule">
                      <div className="no-schedule-icon">📅</div>
                      <div className="no-schedule-text">Chưa xếp lịch</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConsultantTab;
