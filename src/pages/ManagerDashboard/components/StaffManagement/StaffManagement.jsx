import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Tabs,
  Tag,
  Space,
  message,
  Checkbox,
  Calendar,
} from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import './StaffManagement.css'; // Import file CSS của bạn
import StaffTab from './components/StaffTab';
import ConsultantTab from './components/ConsultantTab';

const { TabPane } = Tabs;

// ===================================================================
// DỮ LIỆU GIẢ (MOCK DATA) - Thay thế bằng API call trong thực tế
// ===================================================================
const initialStaffData = [
  {
    id: 'stf_001',
    name: 'Trần Văn Bình',
    email: 'binh.tran@hospital.com',
    status: 'active',
    role: 'staff',
    schedules: [
      { date: '2025-01-13', shift: 'morning' },
      { date: '2025-01-14', shift: 'afternoon' },
      { date: '2025-01-15', shift: 'morning' },
      { date: '2025-01-16', shift: 'afternoon' },
      { date: '2025-01-17', shift: 'morning' },
    ],
  },
  {
    id: 'stf_002',
    name: 'Nguyễn Thị Hương',
    email: 'huong.nguyen@hospital.com',
    status: 'active',
    role: 'staff',
    schedules: [
      { date: '2025-01-13', shift: 'afternoon' },
      { date: '2025-01-14', shift: 'morning' },
      { date: '2025-01-15', shift: 'afternoon' },
      { date: '2025-01-16', shift: 'morning' },
      { date: '2025-01-17', shift: 'afternoon' },
    ],
  },
  {
    id: 'stf_003',
    name: 'Lê Văn Minh',
    email: 'minh.le@hospital.com',
    status: 'active',
    role: 'staff',
    schedules: [
      { date: '2025-01-13', shift: 'morning' },
      { date: '2025-01-14', shift: 'morning' },
      { date: '2025-01-15', shift: 'afternoon' },
      { date: '2025-01-16', shift: 'afternoon' },
      { date: '2025-01-17', shift: 'morning' },
    ],
  },
  {
    id: 'stf_004',
    name: 'Phạm Thị Lan',
    email: 'lan.pham@hospital.com',
    status: 'active',
    role: 'staff',
    schedules: [
      { date: '2025-01-13', shift: 'afternoon' },
      { date: '2025-01-14', shift: 'afternoon' },
      { date: '2025-01-15', shift: 'morning' },
      { date: '2025-01-16', shift: 'morning' },
      { date: '2025-01-17', shift: 'afternoon' },
    ],
  },
  {
    id: 'stf_005',
    name: 'Hoàng Văn Dũng',
    email: 'dung.hoang@hospital.com',
    status: 'inactive',
    role: 'staff',
    schedules: [],
  },
];

const initialConsultantData = [
  {
    id: 'con_001',
    name: 'Nguyễn Thị Anh',
    email: 'anh.nguyen@hospital.com',
    status: 'active',
    role: 'consultant',
    schedules: [
      {
        date: '2025-01-13',
        slots: [
          '07:00 - 08:30',
          '10:00 - 11:30',
          '13:00 - 14:30',
          '16:00 - 17:30',
        ],
      },
      {
        date: '2025-01-14',
        slots: [
          '08:30 - 10:00',
          '11:30 - 13:00',
          '14:30 - 16:00',
          '17:30 - 18:00',
        ],
      },
      {
        date: '2025-01-15',
        slots: ['07:00 - 08:30', '10:00 - 11:30', '13:00 - 14:30'],
      },
      {
        date: '2025-01-16',
        slots: [
          '08:30 - 10:00',
          '11:30 - 13:00',
          '14:30 - 16:00',
          '16:00 - 17:30',
        ],
      },
      {
        date: '2025-01-17',
        slots: [
          '07:00 - 08:30',
          '10:00 - 11:30',
          '13:00 - 14:30',
          '17:30 - 18:00',
        ],
      },
    ],
  },
  {
    id: 'con_002',
    name: 'Trần Văn Cường',
    email: 'cuong.tran@hospital.com',
    status: 'active',
    role: 'consultant',
    schedules: [
      {
        date: '2025-01-13',
        slots: ['08:30 - 10:00', '11:30 - 13:00', '14:30 - 16:00'],
      },
      {
        date: '2025-01-14',
        slots: [
          '07:00 - 08:30',
          '10:00 - 11:30',
          '13:00 - 14:30',
          '16:00 - 17:30',
        ],
      },
      {
        date: '2025-01-15',
        slots: [
          '08:30 - 10:00',
          '11:30 - 13:00',
          '14:30 - 16:00',
          '17:30 - 18:00',
        ],
      },
      {
        date: '2025-01-16',
        slots: ['07:00 - 08:30', '10:00 - 11:30', '13:00 - 14:30'],
      },
      {
        date: '2025-01-17',
        slots: [
          '08:30 - 10:00',
          '11:30 - 13:00',
          '14:30 - 16:00',
          '16:00 - 17:30',
        ],
      },
    ],
  },
  {
    id: 'con_003',
    name: 'Lê Thị Mai',
    email: 'mai.le@hospital.com',
    status: 'active',
    role: 'consultant',
    schedules: [
      {
        date: '2025-01-13',
        slots: [
          '07:00 - 08:30',
          '10:00 - 11:30',
          '13:00 - 14:30',
          '16:00 - 17:30',
          '17:30 - 18:00',
        ],
      },
      {
        date: '2025-01-14',
        slots: ['08:30 - 10:00', '11:30 - 13:00', '14:30 - 16:00'],
      },
      {
        date: '2025-01-15',
        slots: [
          '07:00 - 08:30',
          '10:00 - 11:30',
          '13:00 - 14:30',
          '16:00 - 17:30',
        ],
      },
      {
        date: '2025-01-16',
        slots: [
          '08:30 - 10:00',
          '11:30 - 13:00',
          '14:30 - 16:00',
          '17:30 - 18:00',
        ],
      },
      {
        date: '2025-01-17',
        slots: ['07:00 - 08:30', '10:00 - 11:30', '13:00 - 14:30'],
      },
    ],
  },
  {
    id: 'con_004',
    name: 'Phạm Văn Hùng',
    email: 'hung.pham@hospital.com',
    status: 'active',
    role: 'consultant',
    schedules: [
      {
        date: '2025-01-13',
        slots: [
          '08:30 - 10:00',
          '11:30 - 13:00',
          '14:30 - 16:00',
          '16:00 - 17:30',
        ],
      },
      {
        date: '2025-01-14',
        slots: [
          '07:00 - 08:30',
          '10:00 - 11:30',
          '13:00 - 14:30',
          '17:30 - 18:00',
        ],
      },
      {
        date: '2025-01-15',
        slots: ['08:30 - 10:00', '11:30 - 13:00', '14:30 - 16:00'],
      },
      {
        date: '2025-01-16',
        slots: [
          '07:00 - 08:30',
          '10:00 - 11:30',
          '13:00 - 14:30',
          '16:00 - 17:30',
        ],
      },
      {
        date: '2025-01-17',
        slots: [
          '08:30 - 10:00',
          '11:30 - 13:00',
          '14:30 - 16:00',
          '17:30 - 18:00',
        ],
      },
    ],
  },
  {
    id: 'con_005',
    name: 'Hoàng Thị Nga',
    email: 'nga.hoang@hospital.com',
    status: 'inactive',
    role: 'consultant',
    schedules: [],
  },
];

// ===================================================================
// COMPONENT XẾP LỊCH CHO STAFF
// ===================================================================
const StaffScheduleModal = ({ visible, onCancel, staff, onFinish }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      title={`Xếp lịch cho Staff - ${staff?.name}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="date"
          label="Ngày làm việc"
          rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
        >
          <DatePicker style={{ width: '100%' }} />
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
  );
};

// ===================================================================
// COMPONENT XẾP LỊCH CHO CONSULTANT
// ===================================================================
const ConsultantScheduleModal = ({
  visible,
  onCancel,
  consultant,
  onFinish,
}) => {
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

  return (
    <Modal
      title={`Xếp lịch cho Consultant - ${consultant?.name}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="date"
          label="Ngày làm việc"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="slots" label="Chọn các slot thời gian làm việc">
          <Checkbox.Group options={timeSlots} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ===================================================================
// COMPONENT XEM LỊCH (DÙNG CHUNG)
// ===================================================================
const ViewScheduleModal = ({ visible, onCancel, employee }) => {
  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const scheduleForDay = employee?.schedules?.find((s) => s.date === dateStr);

    if (scheduleForDay) {
      if (employee.role === 'staff') {
        return (
          <div className="schedule-item">
            {scheduleForDay.shift === 'morning' ? 'Ca Sáng' : 'Ca Chiều'}
          </div>
        );
      }
      if (employee.role === 'consultant') {
        return (
          <ul className="schedule-list">
            {scheduleForDay.slots.map((slot) => (
              <li key={slot}>{slot}</li>
            ))}
          </ul>
        );
      }
    }
    // Chủ nhật nghỉ cho consultant
    if (employee.role === 'consultant' && value.day() === 0) {
      return <div className="day-off">Ngày nghỉ</div>;
    }
    return null;
  };

  return (
    <Modal
      title={`Lịch làm việc của - ${employee?.name}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
    >
      <Calendar dateCellRender={dateCellRender} />
    </Modal>
  );
};

// ===================================================================
// COMPONENT CHÍNH
// ===================================================================
const StaffManagement = () => {
  const [staffList] = useState(initialStaffData);
  const [consultantList] = useState(initialConsultantData);

  const [isStaffScheduleModal, setIsStaffScheduleModal] = useState(false);
  const [isConsultantScheduleModal, setIsConsultantScheduleModal] =
    useState(false);
  const [isViewScheduleModal, setIsViewScheduleModal] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // --- Hàm xử lý cho Staff ---
  const handleOpenStaffSchedule = (staff) => {
    setSelectedEmployee(staff);
    setIsStaffScheduleModal(true);
  };
  const handleStaffScheduleFinish = (values) => {
    console.log('Đã xếp lịch cho Staff:', {
      staffId: selectedEmployee.id,
      ...values,
    });
    message.success(`Đã xếp lịch cho ${selectedEmployee.name}`);
    setIsStaffScheduleModal(false);
  };

  // --- Hàm xử lý cho Consultant ---
  const handleOpenConsultantSchedule = (consultant) => {
    setSelectedEmployee(consultant);
    setIsConsultantScheduleModal(true);
  };
  const handleConsultantScheduleFinish = (values) => {
    console.log('Đã xếp lịch cho Consultant:', {
      consultantId: selectedEmployee.id,
      ...values,
    });
    message.success(`Đã xếp lịch cho ${selectedEmployee.name}`);
    setIsConsultantScheduleModal(false);
  };

  // --- Hàm xử lý chung cho Xem Lịch ---
  const handleOpenViewSchedule = (employee) => {
    setSelectedEmployee(employee);
    setIsViewScheduleModal(true);
  };

  // --- Cấu hình cột cho các bảng ---
  const sharedColumns = [
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
  ];

  const staffColumns = [
    ...sharedColumns,
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleOpenStaffSchedule(record)}>
            Xếp lịch
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => handleOpenViewSchedule(record)}
          >
            Xem lịch
          </Button>
        </Space>
      ),
    },
  ];

  const consultantColumns = [
    ...sharedColumns,
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => handleOpenConsultantSchedule(record)}
          >
            Xếp lịch
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => handleOpenViewSchedule(record)}
          >
            Xem lịch
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="staff-management">
      <div className="page-header">
        <h1>Quản lý nhân sự</h1>
        <p>Quản lý và sắp xếp lịch làm việc cho staff và consultant</p>
      </div>
      <Tabs
        defaultActiveKey="staff"
        size="large"
        style={{ background: '#fff', borderRadius: 12, padding: 16 }}
      >
        <TabPane tab="Danh sách Staff" key="staff">
          <StaffTab staffData={staffList} />
        </TabPane>
        <TabPane tab="Danh sách Consultant" key="consultant">
          <ConsultantTab consultantData={consultantList} />
        </TabPane>
      </Tabs>

      {/* Các Modal được gọi ở đây */}
      {selectedEmployee?.role === 'staff' && (
        <StaffScheduleModal
          visible={isStaffScheduleModal}
          onCancel={() => setIsStaffScheduleModal(false)}
          staff={selectedEmployee}
          onFinish={handleStaffScheduleFinish}
        />
      )}

      {selectedEmployee?.role === 'consultant' && (
        <ConsultantScheduleModal
          visible={isConsultantScheduleModal}
          onCancel={() => setIsConsultantScheduleModal(false)}
          consultant={selectedEmployee}
          onFinish={handleConsultantScheduleFinish}
        />
      )}

      <ViewScheduleModal
        visible={isViewScheduleModal}
        onCancel={() => setIsViewScheduleModal(false)}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default StaffManagement;
