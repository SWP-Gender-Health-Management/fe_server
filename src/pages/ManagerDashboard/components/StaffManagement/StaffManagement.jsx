import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Card,
  Tabs,
  Rate,
  Tag,
  Space,
  message,
} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  StarOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import './StaffManagement.css';

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [staffModalVisible, setStaffModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [scheduleForm] = Form.useForm();
  const [staffForm] = Form.useForm();

  // Mock data
  const [staffData, setStaffData] = useState([
    {
      id: 1,
      name: 'Nguyễn Thị Anh',
      role: 'consultant',
      email: 'anh.nguyen@hospital.com',
      phone: '0123456789',
      status: 'active',
      rating: 4.8,
      totalAppointments: 156,
      specializations: ['Sản phụ khoa', 'Tư vấn sức khỏe'],
      schedule: [
        { day: 'Thứ 2', time: '08:00-17:00' },
        { day: 'Thứ 3', time: '08:00-17:00' },
        { day: 'Thứ 4', time: '08:00-17:00' },
        { day: 'Thứ 5', time: '08:00-17:00' },
        { day: 'Thứ 6', time: '08:00-17:00' },
      ],
    },
    {
      id: 2,
      name: 'Trần Văn Bình',
      role: 'staff',
      email: 'binh.tran@hospital.com',
      phone: '0123456790',
      status: 'active',
      rating: 4.5,
      totalAppointments: 89,
      specializations: ['Xét nghiệm', 'Chăm sóc bệnh nhân'],
      schedule: [
        { day: 'Thứ 2', time: '07:00-16:00' },
        { day: 'Thứ 3', time: '07:00-16:00' },
        { day: 'Thứ 4', time: '07:00-16:00' },
        { day: 'Thứ 5', time: '07:00-16:00' },
        { day: 'Thứ 6', time: '07:00-16:00' },
      ],
    },
    {
      id: 3,
      name: 'Lê Thị Cẩm',
      role: 'consultant',
      email: 'cam.le@hospital.com',
      phone: '0123456791',
      status: 'inactive',
      rating: 4.9,
      totalAppointments: 203,
      specializations: ['Tâm lý học', 'Tư vấn gia đình'],
      schedule: [
        { day: 'Thứ 2', time: '09:00-18:00' },
        { day: 'Thứ 3', time: '09:00-18:00' },
        { day: 'Thứ 4', time: '09:00-18:00' },
        { day: 'Thứ 5', time: '09:00-18:00' },
        { day: 'Thứ 6', time: '09:00-18:00' },
      ],
    },
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      staffId: 1,
      staffName: 'Nguyễn Thị Anh',
      patientName: 'Phạm Thị Dung',
      date: '2024-12-20',
      time: '09:00',
      type: 'consultation',
      status: 'confirmed',
      notes: 'Tư vấn về chu kỳ kinh nguyệt',
    },
    {
      id: 2,
      staffId: 2,
      staffName: 'Trần Văn Bình',
      patientName: 'Nguyễn Văn Nam',
      date: '2024-12-20',
      time: '10:30',
      type: 'lab_test',
      status: 'completed',
      notes: 'Xét nghiệm máu',
    },
    {
      id: 3,
      staffId: 1,
      staffName: 'Nguyễn Thị Anh',
      patientName: 'Lê Thị Hoa',
      date: '2024-12-21',
      time: '14:00',
      type: 'consultation',
      status: 'pending',
      notes: 'Tư vấn sức khỏe sinh sản',
    },
  ]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      staffId: 1,
      staffName: 'Nguyễn Thị Anh',
      patientName: 'Phạm Thị Dung',
      rating: 5,
      comment: 'Bác sĩ rất tận tâm và chuyên nghiệp. Tư vấn rất hữu ích.',
      date: '2024-12-19',
    },
    {
      id: 2,
      staffId: 2,
      staffName: 'Trần Văn Bình',
      patientName: 'Nguyễn Văn Nam',
      rating: 4,
      comment: 'Nhân viên phục vụ tốt, thủ tục nhanh chóng.',
      date: '2024-12-18',
    },
    {
      id: 3,
      staffId: 1,
      staffName: 'Nguyễn Thị Anh',
      patientName: 'Lê Thị Hoa',
      rating: 5,
      comment: 'Rất hài lòng với dịch vụ tư vấn.',
      date: '2024-12-17',
    },
  ]);

  const [pendingSchedules, setPendingSchedules] = useState([]);

  const staffColumns = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="staff-info">
          <div className="staff-avatar">{text.charAt(0).toUpperCase()}</div>
          <div className="staff-details">
            <div className="staff-name">{text}</div>
            <div className="staff-role">
              {record.role === 'consultant' ? 'Tư vấn viên' : 'Nhân viên'}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record) => (
        <div className="contact-info">
          <div>{record.email}</div>
          <div>{record.phone}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Đang làm việc' : 'Nghỉ việc'}
        </Tag>
      ),
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      render: (_, record) => (
        <div className="rating-info">
          <Rate disabled defaultValue={record.rating} />
          <span className="rating-text">{record.rating}/5</span>
        </div>
      ),
    },
    {
      title: 'Lịch hẹn',
      dataIndex: 'totalAppointments',
      key: 'totalAppointments',
      render: (count) => (
        <div className="appointment-count">
          <CalendarOutlined /> {count}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleViewSchedule(record)}
          >
            Xem lịch
          </Button>
          <Button size="small" onClick={() => handleScheduleStaff(record)}>
            Sắp lịch
          </Button>
        </Space>
      ),
    },
  ];

  const appointmentColumns = [
    {
      title: 'Nhân viên',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Giờ',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'consultation' ? 'blue' : 'green'}>
          {type === 'consultation' ? 'Tư vấn' : 'Xét nghiệm'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          confirmed: 'green',
          pending: 'orange',
          completed: 'blue',
          cancelled: 'red',
        };
        const labels = {
          confirmed: 'Đã xác nhận',
          pending: 'Chờ xác nhận',
          completed: 'Hoàn thành',
          cancelled: 'Đã hủy',
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
    },
  ];

  const reviewColumns = [
    {
      title: 'Nhân viên',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      render: (_, record) => (
        <div className="review-rating">
          <Rate disabled defaultValue={record.rating} />
          <span className="rating-text">{record.rating}/5</span>
        </div>
      ),
    },
    {
      title: 'Nhận xét',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const handleViewSchedule = (staff) => {
    setSelectedStaff(staff);
    setStaffModalVisible(true);
  };

  const handleScheduleStaff = (staff) => {
    setSelectedStaff(staff);
    setScheduleModalVisible(true);
  };

  const handleScheduleSubmit = (values) => {
    const newSchedule = {
      id: Date.now(),
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      ...values,
      status: 'pending',
    };

    setPendingSchedules([...pendingSchedules, newSchedule]);
    setScheduleModalVisible(false);
    scheduleForm.resetFields();
    message.success('Lịch làm việc đã được thêm vào danh sách chờ');
  };

  const handleSaveAllSchedules = () => {
    // Here you would typically save to backend
    message.success(`Đã lưu ${pendingSchedules.length} lịch làm việc`);
    setPendingSchedules([]);
  };

  const handleAddStaff = (values) => {
    const newStaff = {
      id: Date.now(),
      ...values,
      status: 'active',
      rating: 0,
      totalAppointments: 0,
      specializations: values.specializations || [],
      schedule: [],
    };

    setStaffData([...staffData, newStaff]);
    setStaffModalVisible(false);
    staffForm.resetFields();
    message.success('Đã thêm nhân viên mới');
  };

  return (
    <div className="staff-management">
      <div className="page-header">
        <h1>Quản lý nhân viên</h1>
        <p>Quản lý consultant và staff, sắp xếp lịch làm việc</p>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Danh sách nhân viên" key="1">
          <div className="tab-header">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setStaffModalVisible(true)}
            >
              Thêm nhân viên
            </Button>
          </div>

          <Table
            columns={staffColumns}
            dataSource={staffData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Lịch hẹn" key="2">
          <Table
            columns={appointmentColumns}
            dataSource={appointments}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Đánh giá" key="3">
          <Table
            columns={reviewColumns}
            dataSource={reviews}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Lịch làm việc chờ lưu" key="4">
          <div className="pending-schedules">
            {pendingSchedules.length > 0 ? (
              <>
                <div className="pending-header">
                  <h3>Lịch làm việc chờ lưu ({pendingSchedules.length})</h3>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSaveAllSchedules}
                  >
                    Lưu tất cả
                  </Button>
                </div>

                <div className="schedule-cards">
                  {pendingSchedules.map((schedule) => (
                    <Card key={schedule.id} className="schedule-card">
                      <div className="schedule-info">
                        <div className="staff-name">{schedule.staffName}</div>
                        <div className="schedule-details">
                          <div>Ngày: {schedule.date}</div>
                          <div>
                            Giờ: {schedule.startTime} - {schedule.endTime}
                          </div>
                          <div>Ghi chú: {schedule.notes}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <CalendarOutlined />
                <p>Chưa có lịch làm việc chờ lưu</p>
              </div>
            )}
          </div>
        </TabPane>
      </Tabs>

      {/* Staff Schedule Modal */}
      <Modal
        title={`Lịch làm việc - ${selectedStaff?.name}`}
        open={staffModalVisible}
        onCancel={() => setStaffModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedStaff && (
          <div className="staff-schedule">
            <div className="schedule-overview">
              <h4>Lịch làm việc hiện tại:</h4>
              <div className="schedule-list">
                {selectedStaff.schedule.map((item, index) => (
                  <div key={index} className="schedule-item">
                    <span className="day">{item.day}</span>
                    <span className="time">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="staff-stats">
              <div className="stat-item">
                <div className="stat-value">
                  {selectedStaff.totalAppointments}
                </div>
                <div className="stat-label">Tổng lịch hẹn</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{selectedStaff.rating}</div>
                <div className="stat-label">Đánh giá trung bình</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Schedule Staff Modal */}
      <Modal
        title={`Sắp lịch làm việc - ${selectedStaff?.name}`}
        open={scheduleModalVisible}
        onCancel={() => setScheduleModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={scheduleForm}
          layout="vertical"
          onFinish={handleScheduleSubmit}
        >
          <Form.Item
            name="date"
            label="Ngày làm việc"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="Thời gian làm việc"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <TimePicker.RangePicker style={{ width: '100%' }} format="HH:mm" />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Thêm vào danh sách chờ
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Staff Modal */}
      <Modal
        title="Thêm nhân viên mới"
        open={staffModalVisible}
        onCancel={() => setStaffModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={staffForm} layout="vertical" onFinish={handleAddStaff}>
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              <Option value="consultant">Tư vấn viên</Option>
              <Option value="staff">Nhân viên</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="specializations" label="Chuyên môn">
            <Select mode="tags" placeholder="Chọn hoặc nhập chuyên môn">
              <Option value="Sản phụ khoa">Sản phụ khoa</Option>
              <Option value="Tư vấn sức khỏe">Tư vấn sức khỏe</Option>
              <Option value="Xét nghiệm">Xét nghiệm</Option>
              <Option value="Chăm sóc bệnh nhân">Chăm sóc bệnh nhân</Option>
              <Option value="Tâm lý học">Tâm lý học</Option>
              <Option value="Tư vấn gia đình">Tư vấn gia đình</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Thêm nhân viên
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement;
