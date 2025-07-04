// StaffTab.jsx
import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Space,
  Tag,
  Calendar,
  Row,
  Col,
  Card,
} from 'antd';
import moment from 'moment'; // Cần thư viện moment.js (thường đi kèm antd)

const StaffTab = ({ staffData }) => {
  const [isScheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [isViewScheduleModalVisible, setViewScheduleModalVisible] =
    useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [form] = Form.useForm();

  // Mở Modal xếp lịch
  const handleOpenScheduleModal = (staff) => {
    setSelectedStaff(staff);
    setScheduleModalVisible(true);
  };

  // Mở Modal xem lịch
  const handleOpenViewScheduleModal = (staff) => {
    setSelectedStaff(staff);
    setViewScheduleModalVisible(true);
  };

  // Xử lý submit form xếp lịch
  const handleScheduleSubmit = (values) => {
    console.log('Lịch đã xếp cho staff:', {
      staffId: selectedStaff.id,
      ...values,
    });
    message.success(`Đã xếp lịch cho ${selectedStaff.name}`);
    setScheduleModalVisible(false);
    form.resetFields();
  };

  // Hàm render nội dung cho từng ô ngày trong lịch
  const dateCellRenderForStaff = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const scheduleForDay = selectedStaff?.schedules?.find((s) =>
      moment(s.date).isSame(dateStr, 'day')
    );

    if (scheduleForDay) {
      const shiftText =
        scheduleForDay.shift === 'morning' ? 'Ca Sáng' : 'Ca Chiều';
      const shiftColor = scheduleForDay.shift === 'morning' ? 'cyan' : 'purple';
      return <Tag color={shiftColor}>{shiftText}</Tag>;
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
      const scheduleForDay = selectedStaff?.schedules?.find((s) =>
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
        dataSource={staffData}
        rowKey="id"
        pagination={{ pageSize: 8 }}
      />

      {/* Modal Xếp lịch cho Staff */}
      <Modal
        title={`Xếp lịch cho - ${selectedStaff?.name}`}
        open={isScheduleModalVisible}
        onCancel={() => setScheduleModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleScheduleSubmit}>
          <Form.Item
            name="date"
            label="Ngày làm việc"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
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
          <Form.Item
            name="shift"
            label="Ca làm việc"
            rules={[{ required: true, message: 'Vui lòng chọn ca' }]}
          >
            <Select placeholder="Chọn ca làm việc">
              <Select.Option value="morning">
                Ca sáng (07:00 - 12:00)
              </Select.Option>
              <Select.Option value="afternoon">
                Ca chiều (13:00 - 18:00)
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xem lịch của Staff */}
      <Modal
        title={`Lịch làm việc của - ${selectedStaff?.name}`}
        open={isViewScheduleModalVisible}
        onCancel={() => setViewScheduleModalVisible(false)}
        footer={null}
        width={1000}
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
                  ) : day.schedule ? (
                    <div className="work-shift">
                      <div className="shift-info">
                        <div className="shift-badge morning">Ca Sáng</div>
                        <div className="shift-time">07:00 - 12:00</div>
                        <div className="shift-status">
                          {day.schedule.shift === 'morning'
                            ? '✓ Đã xếp'
                            : '○ Chưa xếp'}
                        </div>
                      </div>

                      <div className="shift-divider"></div>

                      <div className="shift-info">
                        <div className="shift-badge afternoon">Ca Chiều</div>
                        <div className="shift-time">13:00 - 18:00</div>
                        <div className="shift-status">
                          {day.schedule.shift === 'afternoon'
                            ? '✓ Đã xếp'
                            : '○ Chưa xếp'}
                        </div>
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

export default StaffTab;
