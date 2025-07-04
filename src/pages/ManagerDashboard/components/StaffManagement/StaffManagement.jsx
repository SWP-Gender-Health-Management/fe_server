import React, { useState, useEffect } from 'react';
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
  Card,
  Row,
  Col,
  Typography,
  Input,
} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import './StaffManagement.css'; // Import file CSS của bạn
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;

// ===================================================================
// DỮ LIỆU GIẢ (MOCK DATA) - Thay thế bằng API call trong thực tế
// ===================================================================

// Tạo ngày cho tuần hiện tại
const getCurrentWeekDates = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date.toISOString().split('T')[0]);
  }
  return weekDates;
};

const currentWeekDates = getCurrentWeekDates();

const initialStaffData = [
  {
    id: 'stf_001',
    name: 'Trần Văn Bình',
    email: 'binh.tran@hospital.com',
    status: 'active',
    role: 'staff',
    department: 'Phòng khám',
    avatar:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    schedules: [
      { date: currentWeekDates[1], shift: 'morning' }, // Thứ 3
      { date: currentWeekDates[2], shift: 'afternoon' }, // Thứ 4
      { date: currentWeekDates[3], shift: 'morning' }, // Thứ 5
      { date: currentWeekDates[4], shift: 'afternoon' }, // Thứ 6
      { date: currentWeekDates[5], shift: 'morning' }, // Thứ 7
    ],
  },
  {
    id: 'stf_002',
    name: 'Nguyễn Thị Hương',
    email: 'huong.nguyen@hospital.com',
    status: 'active',
    role: 'staff',
    department: 'Phòng xét nghiệm',
    avatar:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face',
    schedules: [
      { date: currentWeekDates[1], shift: 'afternoon' }, // Thứ 3
      { date: currentWeekDates[2], shift: 'morning' }, // Thứ 4
      { date: currentWeekDates[3], shift: 'afternoon' }, // Thứ 5
      { date: currentWeekDates[4], shift: 'morning' }, // Thứ 6
      { date: currentWeekDates[5], shift: 'afternoon' }, // Thứ 7
    ],
  },
  {
    id: 'stf_003',
    name: 'Lê Văn Minh',
    email: 'minh.le@hospital.com',
    status: 'active',
    role: 'staff',
    department: 'Phòng tiếp tân',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    schedules: [
      { date: currentWeekDates[1], shift: 'morning' }, // Thứ 3
      { date: currentWeekDates[2], shift: 'morning' }, // Thứ 4
      { date: currentWeekDates[3], shift: 'afternoon' }, // Thứ 5
      { date: currentWeekDates[4], shift: 'afternoon' }, // Thứ 6
      { date: currentWeekDates[5], shift: 'morning' }, // Thứ 7
    ],
  },
  {
    id: 'stf_004',
    name: 'Phạm Thị Lan',
    email: 'lan.pham@hospital.com',
    status: 'active',
    role: 'staff',
    department: 'Phòng khám',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    schedules: [
      { date: currentWeekDates[1], shift: 'afternoon' }, // Thứ 3
      { date: currentWeekDates[2], shift: 'afternoon' }, // Thứ 4
      { date: currentWeekDates[3], shift: 'morning' }, // Thứ 5
      { date: currentWeekDates[4], shift: 'morning' }, // Thứ 6
      { date: currentWeekDates[5], shift: 'afternoon' }, // Thứ 7
    ],
  },
  {
    id: 'stf_005',
    name: 'Hoàng Văn Dũng',
    email: 'dung.hoang@hospital.com',
    status: 'inactive',
    role: 'staff',
    department: 'Phòng xét nghiệm',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
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
    department: 'Tư vấn sức khỏe',
    avatar:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    schedules: [
      {
        date: currentWeekDates[1], // Thứ 3
        slots: [
          '07:00 - 08:30',
          '10:00 - 11:30',
          '13:00 - 14:30',
          '16:00 - 17:30',
        ],
      },
      {
        date: currentWeekDates[2], // Thứ 4
        slots: [
          '08:30 - 10:00',
          '11:30 - 13:00',
          '14:30 - 16:00',
          '17:30 - 18:00',
        ],
      },
      {
        date: currentWeekDates[3], // Thứ 5
        slots: ['07:00 - 08:30', '10:00 - 11:30', '13:00 - 14:30'],
      },
      {
        date: currentWeekDates[4], // Thứ 6
        slots: [
          '08:30 - 10:00',
          '11:30 - 13:00',
          '14:30 - 16:00',
          '16:00 - 17:30',
        ],
      },
      {
        date: currentWeekDates[5], // Thứ 7
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
    department: 'Tư vấn dinh dưỡng',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    schedules: [
      {
        date: currentWeekDates[1], // Thứ 3
        slots: ['08:30 - 10:00', '11:30 - 13:00', '14:30 - 16:00'],
      },
      {
        date: currentWeekDates[2], // Thứ 4
        slots: [
          '07:00 - 08:30',
          '10:00 - 11:30',
          '13:00 - 14:30',
          '16:00 - 17:30',
        ],
      },
      {
        date: currentWeekDates[3], // Thứ 5
        slots: [
          '08:30 - 10:00',
          '11:30 - 13:00',
          '14:30 - 16:00',
          '17:30 - 18:00',
        ],
      },
      {
        date: currentWeekDates[4], // Thứ 6
        slots: ['07:00 - 08:30', '10:00 - 11:30', '13:00 - 14:30'],
      },
      {
        date: currentWeekDates[5], // Thứ 7
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
    department: 'Tư vấn tâm lý',
    avatar:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face',
    schedules: [
      {
        date: currentWeekDates[1], // Thứ 3
        slots: [
          '07:00 - 08:30',
          '10:00 - 11:30',
          '13:00 - 14:30',
          '16:00 - 17:30',
          '17:30 - 18:00',
        ],
      },
      {
        date: currentWeekDates[2], // Thứ 4
        slots: ['08:30 - 10:00', '11:30 - 13:00', '14:30 - 16:00'],
      },
      {
        date: currentWeekDates[3], // Thứ 5
        slots: [
          '07:00 - 08:30',
          '10:00 - 11:30',
          '13:00 - 14:30',
          '16:00 - 17:30',
        ],
      },
      {
        date: currentWeekDates[4], // Thứ 6
        slots: [
          '08:30 - 10:00',
          '11:30 - 13:00',
          '14:30 - 16:00',
          '17:30 - 18:00',
        ],
      },
      {
        date: currentWeekDates[5], // Thứ 7
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
    department: 'Tư vấn sức khỏe',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    schedules: [
      {
        date: currentWeekDates[1], // Thứ 3
        slots: [
          '08:30 - 10:00',
          '11:30 - 13:00',
          '14:30 - 16:00',
          '16:00 - 17:30',
        ],
      },
      {
        date: currentWeekDates[2], // Thứ 4
        slots: [
          '07:00 - 08:30',
          '10:00 - 11:30',
          '13:00 - 14:30',
          '17:30 - 18:00',
        ],
      },
      {
        date: currentWeekDates[3], // Thứ 5
        slots: ['08:30 - 10:00', '11:30 - 13:00', '14:30 - 16:00'],
      },
      {
        date: currentWeekDates[4], // Thứ 6
        slots: [
          '07:00 - 08:30',
          '10:00 - 11:30',
          '13:00 - 14:30',
          '16:00 - 17:30',
        ],
      },
      {
        date: currentWeekDates[5], // Thứ 7
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
    department: 'Tư vấn dinh dưỡng',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
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
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Tạo dữ liệu lịch làm việc theo tuần
  const generateWeeklySchedule = () => {
    const schedule = {};
    const timeSlots =
      employee?.role === 'staff'
        ? ['Ca Sáng (07:00-12:00)', 'Ca Chiều (13:00-18:00)']
        : [
            '07:00 - 08:30',
            '08:30 - 10:00',
            '10:00 - 11:30',
            '11:30 - 13:00',
            '13:00 - 14:30',
            '14:30 - 16:00',
            '16:00 - 17:30',
            '17:30 - 18:00',
          ];

    console.log('Employee role:', employee?.role);
    console.log('Time slots:', timeSlots);
    console.log('Employee schedules:', employee?.schedules);

    // Tạo lịch cho tuần hiện tại
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(currentWeek);
      date.setDate(date.getDate() - date.getDay() + dayOffset);
      const dateKey = date.toISOString().split('T')[0];

      schedule[dateKey] = {};
      timeSlots.forEach((time) => {
        // Kiểm tra xem có lịch đã được xếp chưa
        const existingSchedule = employee?.schedules?.find(
          (s) => s.date === dateKey
        );

        console.log(
          `Checking date ${dateKey} for time ${time}:`,
          existingSchedule
        );

        if (existingSchedule) {
          if (employee.role === 'staff') {
            const isMorning = time.includes('Sáng');
            const isScheduled =
              existingSchedule.shift === (isMorning ? 'morning' : 'afternoon');
            schedule[dateKey][time] = isScheduled;
            console.log(
              `Staff ${dateKey} ${time}: ${isScheduled} (shift: ${existingSchedule.shift})`
            );
          } else {
            const isScheduled = existingSchedule.slots?.includes(time) || false;
            schedule[dateKey][time] = isScheduled;
            console.log(
              `Consultant ${dateKey} ${time}: ${isScheduled} (slots: ${existingSchedule.slots})`
            );
          }
        } else {
          schedule[dateKey][time] = false;
          console.log(`No schedule for ${dateKey} ${time}: false`);
        }
      });
    }

    console.log('Final schedule:', schedule);
    return schedule;
  };

  const [weeklySchedule, setWeeklySchedule] = useState({});

  useEffect(() => {
    const schedule = generateWeeklySchedule();
    console.log('Generated schedule:', schedule);
    console.log('Employee data:', employee);
    setWeeklySchedule(schedule);
  }, [currentWeek, employee]);

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const formatDayName = (date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const getWeekRange = () => {
    const dates = getWeekDates();
    const start = formatDate(dates[0]);
    const end = formatDate(dates[6]);
    return `${start} - ${end}`;
  };

  const timeSlots =
    employee?.role === 'staff'
      ? ['Ca Sáng (07:00-12:00)', 'Ca Chiều (13:00-18:00)']
      : [
          '07:00 - 08:30',
          '08:30 - 10:00',
          '10:00 - 11:30',
          '11:30 - 13:00',
          '13:00 - 14:30',
          '14:30 - 16:00',
          '16:00 - 17:30',
          '17:30 - 18:00',
        ];

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDay = (date) => {
    const today = new Date();
    return date < today;
  };

  return (
    <Modal
      title={`Lịch làm việc của ${employee?.name} - ${employee?.role === 'staff' ? 'Nhân viên' : 'Tư vấn viên'}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1400}
      className="schedule-modal"
    >
      <div className="weekly-schedule-container">
        {/* Header thông tin nhân viên */}
        <div className="employee-info-header">
          <div className="employee-avatar">
            <img
              src={employee?.avatar || '/default-avatar.png'}
              alt={employee?.name}
            />
            <div className="status-indicator online"></div>
          </div>
          <div className="employee-details">
            <h3>{employee?.name}</h3>
            <p className="role">
              {employee?.role === 'staff' ? 'Nhân viên' : 'Tư vấn viên'}
            </p>
            <p className="department">{employee?.department}</p>
          </div>
        </div>

        {/* Navigation tuần */}
        <div className="week-navigation">
          <div className="week-info">
            <h4>Lịch làm việc tuần</h4>
            <p>{getWeekRange()}</p>
          </div>
        </div>

        {/* Lịch làm việc theo grid */}
        <div className="schedule-grid">
          {/* Header cột thời gian */}
          <div className="time-column">
            <div className="time-header">Thời gian</div>
            {timeSlots.map((slot, index) => (
              <div key={index} className="time-slot">
                {slot}
              </div>
            ))}
          </div>

          {/* Các cột ngày trong tuần */}
          {getWeekDates().map((date, dayIndex) => {
            const dateKey = date.toISOString().split('T')[0];
            const isWeekend = date.getDay() === 0; // Chủ nhật
            const isTodayDate = isToday(date);
            const isPast = isPastDay(date);

            return (
              <div key={dayIndex} className="day-column">
                <div
                  className={`day-header ${isTodayDate ? 'today' : ''} ${isPast ? 'past-day' : ''}`}
                >
                  <div className="day-name">{formatDayName(date)}</div>
                  <div className="day-date">{formatDate(date)}</div>
                  {isWeekend && <div className="weekend-label">Nghỉ</div>}
                </div>

                {timeSlots.map((slot, slotIndex) => {
                  const isScheduled = weeklySchedule[dateKey]?.[slot];
                  const isDisabled = isPast || isWeekend;

                  return (
                    <div
                      key={slotIndex}
                      className={`schedule-slot ${
                        isDisabled
                          ? 'disabled'
                          : isScheduled
                            ? 'scheduled'
                            : 'available'
                      }`}
                    >
                      {isScheduled ? (
                        <div className="slot-content">
                          <span className="slot-status">✓</span>
                          <span className="slot-text">Đã xếp</span>
                        </div>
                      ) : isDisabled ? (
                        <div className="slot-content">
                          <span className="slot-status">-</span>
                          <span className="slot-text">Không làm</span>
                        </div>
                      ) : (
                        <div className="slot-content">
                          <span className="slot-status">○</span>
                          <span className="slot-text">Trống</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Chú thích */}
        <div className="schedule-legend">
          <div className="legend-item">
            <span className="legend-icon available">○</span>
            <span>Chưa xếp lịch</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon scheduled">✓</span>
            <span>Đã xếp lịch</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon disabled">-</span>
            <span>Không làm việc</span>
          </div>
        </div>

        {/* Thống kê */}
        <div className="schedule-stats">
          <div className="stat-item">
            <span className="stat-number">
              {Object.values(weeklySchedule).flat().filter(Boolean).length}
            </span>
            <span className="stat-label">Slot đã xếp</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {
                Object.values(weeklySchedule)
                  .flat()
                  .filter((slot) => slot === false).length
              }
            </span>
            <span className="stat-label">Slot trống</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {employee?.role === 'staff' ? '2 ca/ngày' : '8 slot/ngày'}
            </span>
            <span className="stat-label">Định mức</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ===================================================================
// COMPONENT CHÍNH
// ===================================================================
const StaffManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState('staff');
  const [staffList, setStaffList] = useState([]);
  const [consultantList, setConsultantList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [filteredConsultant, setFilteredConsultant] = useState([]);

  // Filter states
  const [staffSearch, setStaffSearch] = useState('');
  const [staffStatus, setStaffStatus] = useState('all');
  const [consultantSearch, setConsultantSearch] = useState('');
  const [consultantStatus, setConsultantStatus] = useState('all');

  // Modal states
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [viewScheduleModalVisible, setViewScheduleModalVisible] =
    useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [scheduleForm] = Form.useForm();

  // Mock data
  useEffect(() => {
    const mockStaff = [
      {
        id: 'ST001',
        name: 'Nguyễn Thị Lan',
        email: 'lan.nguyen@hospital.com',
        phone: '0901234567',
        status: 'active',
        role: 'staff',
        avatar: 'NL',
        schedules: [
          { date: '2024-12-23', shift: 'morning' },
          { date: '2024-12-24', shift: 'afternoon' },
          { date: '2024-12-25', shift: 'morning' },
        ],
      },
      {
        id: 'ST002',
        name: 'Trần Văn Minh',
        email: 'minh.tran@hospital.com',
        phone: '0912345678',
        status: 'active',
        role: 'staff',
        avatar: 'TM',
        schedules: [
          { date: '2024-12-23', shift: 'afternoon' },
          { date: '2024-12-24', shift: 'morning' },
          { date: '2024-12-26', shift: 'afternoon' },
        ],
      },
      {
        id: 'ST003',
        name: 'Lê Thị Hương',
        email: 'huong.le@hospital.com',
        phone: '0923456789',
        status: 'inactive',
        role: 'staff',
        avatar: 'LH',
        schedules: [],
      },
    ];

    const mockConsultant = [
      {
        id: 'CN001',
        name: 'BS. Phạm Văn Cường',
        email: 'cuong.pham@hospital.com',
        phone: '0934567890',
        status: 'active',
        role: 'consultant',
        avatar: 'PC',
        schedules: [
          {
            date: '2024-12-23',
            slots: [
              '07:00 - 08:30',
              '10:00 - 11:30',
              '13:00 - 14:30',
              '16:00 - 17:30',
            ],
          },
          {
            date: '2024-12-24',
            slots: ['08:30 - 10:00', '11:30 - 13:00', '14:30 - 16:00'],
          },
        ],
      },
      {
        id: 'CN002',
        name: 'BS. Hoàng Thị Mai',
        email: 'mai.hoang@hospital.com',
        phone: '0945678901',
        status: 'active',
        role: 'consultant',
        avatar: 'HM',
        schedules: [
          {
            date: '2024-12-23',
            slots: [
              '08:30 - 10:00',
              '11:30 - 13:00',
              '14:30 - 16:00',
              '17:30 - 19:00',
            ],
          },
        ],
      },
      {
        id: 'CN003',
        name: 'BS. Nguyễn Văn Dũng',
        email: 'dung.nguyen@hospital.com',
        phone: '0956789012',
        status: 'inactive',
        role: 'consultant',
        avatar: 'ND',
        schedules: [],
      },
    ];

    setStaffList(mockStaff);
    setConsultantList(mockConsultant);
    setFilteredStaff(mockStaff);
    setFilteredConsultant(mockConsultant);
  }, []);

  // Filter functions
  useEffect(() => {
    let filtered = staffList;
    if (staffSearch) {
      filtered = filtered.filter((staff) =>
        staff.name.toLowerCase().includes(staffSearch.toLowerCase())
      );
    }
    if (staffStatus !== 'all') {
      filtered = filtered.filter((staff) => staff.status === staffStatus);
    }
    setFilteredStaff(filtered);
  }, [staffSearch, staffStatus, staffList]);

  useEffect(() => {
    let filtered = consultantList;
    if (consultantSearch) {
      filtered = filtered.filter((consultant) =>
        consultant.name.toLowerCase().includes(consultantSearch.toLowerCase())
      );
    }
    if (consultantStatus !== 'all') {
      filtered = filtered.filter(
        (consultant) => consultant.status === consultantStatus
      );
    }
    setFilteredConsultant(filtered);
  }, [consultantSearch, consultantStatus, consultantList]);

  // Staff columns
  const staffColumns = [
    {
      title: 'Nhân viên',
      key: 'employee',
      render: (_, record) => (
        <div className="employee-info">
          <div className="employee-avatar">{record.avatar}</div>
          <div className="employee-details">
            <div className="employee-name">{record.name}</div>
            <div className="employee-email">{record.email}</div>
            <div className="employee-phone">{record.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.status === 'active' ? 'green' : 'red'}>
          {record.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<ScheduleOutlined />}
            onClick={() => handleOpenSchedule(record)}
            size="small"
          >
            Xếp lịch
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleOpenViewSchedule(record)}
            size="small"
          >
            Xem lịch
          </Button>
        </Space>
      ),
    },
  ];

  // Consultant columns
  const consultantColumns = [
    {
      title: 'Tư vấn viên',
      key: 'employee',
      render: (_, record) => (
        <div className="employee-info">
          <div className="employee-avatar consultant">{record.avatar}</div>
          <div className="employee-details">
            <div className="employee-name">{record.name}</div>
            <div className="employee-email">{record.email}</div>
            <div className="employee-phone">{record.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.status === 'active' ? 'green' : 'red'}>
          {record.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<ScheduleOutlined />}
            onClick={() => handleOpenSchedule(record)}
            size="small"
          >
            Xếp lịch
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleOpenViewSchedule(record)}
            size="small"
          >
            Xem lịch
          </Button>
        </Space>
      ),
    },
  ];

  // Modal handlers
  const handleOpenSchedule = (employee) => {
    setSelectedEmployee(employee);
    setScheduleModalVisible(true);
    scheduleForm.resetFields();
  };

  const handleOpenViewSchedule = (employee) => {
    setSelectedEmployee(employee);
    setViewScheduleModalVisible(true);
  };

  const handleScheduleSubmit = (values) => {
    console.log('Schedule submitted:', {
      employee: selectedEmployee,
      ...values,
    });
    message.success(`Đã xếp lịch thành công cho ${selectedEmployee.name}`);
    setScheduleModalVisible(false);
    scheduleForm.resetFields();
  };

  // Get current week schedule
  const getCurrentWeekSchedule = (employee) => {
    const today = dayjs();
    const startOfWeek = today.startOf('week').add(1, 'day'); // Monday
    const weekSchedule = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = startOfWeek.add(i, 'days');
      const dateStr = currentDate.format('YYYY-MM-DD');
      const scheduleForDay = employee?.schedules?.find(
        (s) => s.date === dateStr
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
    <div className="staff-management-container">
      <div className="page-header">
        <Title level={2}>
          <UserOutlined /> Quản lý nhân sự
        </Title>
        <Text type="secondary">
          Quản lý và sắp xếp lịch làm việc cho Staff và Consultant
        </Text>
      </div>

      <Card className="management-card">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="management-tabs"
        >
          {/* Staff Tab */}
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Danh sách Staff
              </span>
            }
            key="staff"
          >
            <div className="tab-content">
              {/* Staff Filters */}
              <div className="filter-section">
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={12} md={8}>
                    <div className="filter-item">
                      <Text strong>Nhân viên:</Text>
                      <Input
                        placeholder="Tìm kiếm theo tên..."
                        prefix={<SearchOutlined />}
                        value={staffSearch}
                        onChange={(e) => setStaffSearch(e.target.value)}
                        allowClear
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <div className="filter-item">
                      <Text strong>Trạng thái:</Text>
                      <Select
                        value={staffStatus}
                        onChange={setStaffStatus}
                        placeholder="Chọn trạng thái"
                        style={{ width: '100%' }}
                      >
                        <Option value="all">Tất cả</Option>
                        <Option value="active">Hoạt động</Option>
                        <Option value="inactive">Bị khóa</Option>
                      </Select>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Staff Table */}
              <Table
                columns={staffColumns}
                dataSource={filteredStaff}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} nhân viên`,
                }}
                className="staff-table"
              />
            </div>
          </TabPane>

          {/* Consultant Tab */}
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Danh sách Consultant
              </span>
            }
            key="consultant"
          >
            <div className="tab-content">
              {/* Consultant Filters */}
              <div className="filter-section">
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={12} md={8}>
                    <div className="filter-item">
                      <Text strong>Tư vấn viên:</Text>
                      <Input
                        placeholder="Tìm kiếm theo tên..."
                        prefix={<SearchOutlined />}
                        value={consultantSearch}
                        onChange={(e) => setConsultantSearch(e.target.value)}
                        allowClear
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <div className="filter-item">
                      <Text strong>Trạng thái:</Text>
                      <Select
                        value={consultantStatus}
                        onChange={setConsultantStatus}
                        placeholder="Chọn trạng thái"
                        style={{ width: '100%' }}
                      >
                        <Option value="all">Tất cả</Option>
                        <Option value="active">Hoạt động</Option>
                        <Option value="inactive">Bị khóa</Option>
                      </Select>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Consultant Table */}
              <Table
                columns={consultantColumns}
                dataSource={filteredConsultant}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} tư vấn viên`,
                }}
                className="consultant-table"
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Schedule Modal */}
      <Modal
        title={
          <span>
            <ScheduleOutlined /> Xếp lịch cho {selectedEmployee?.name}
          </span>
        }
        open={scheduleModalVisible}
        onCancel={() => setScheduleModalVisible(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={scheduleForm}
          layout="vertical"
          onFinish={handleScheduleSubmit}
        >
          <Form.Item
            name="date"
            label="Ngày làm việc"
            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Chọn ngày làm việc"
              disabledDate={(current) => current && current.day() === 0}
            />
          </Form.Item>

          {selectedEmployee?.role === 'staff' ? (
            <Form.Item
              name="shift"
              label="Ca làm việc"
              rules={[{ required: true, message: 'Vui lòng chọn ca!' }]}
            >
              <Select placeholder="Chọn ca làm việc">
                <Option value="morning">
                  <ClockCircleOutlined /> Ca sáng (07:00 - 12:00)
                </Option>
                <Option value="afternoon">
                  <ClockCircleOutlined /> Ca chiều (13:00 - 18:00)
                </Option>
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              name="slots"
              label="Slot thời gian làm việc"
              rules={[
                { required: true, message: 'Vui lòng chọn ít nhất 1 slot!' },
              ]}
            >
              <Checkbox.Group className="slot-checkbox-group">
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Checkbox value="07:00 - 08:30">07:00 - 08:30</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="08:30 - 10:00">08:30 - 10:00</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="10:00 - 11:30">10:00 - 11:30</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="11:30 - 13:00">11:30 - 13:00</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="13:00 - 14:30">13:00 - 14:30</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="14:30 - 16:00">14:30 - 16:00</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="16:00 - 17:30">16:00 - 17:30</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="17:30 - 19:00">17:30 - 19:00</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          )}

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setScheduleModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Xác nhận
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Schedule Modal */}
      <Modal
        title={
          <span>
            <CalendarOutlined /> Lịch làm việc của {selectedEmployee?.name}
          </span>
        }
        open={viewScheduleModalVisible}
        onCancel={() => setViewScheduleModalVisible(false)}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <div className="schedule-view">
          <div className="week-schedule">
            <Title level={4}>Lịch làm việc tuần hiện tại</Title>
            <Row gutter={[16, 16]}>
              {getCurrentWeekSchedule(selectedEmployee).map((day, index) => (
                <Col xs={24} sm={12} md={6} lg={3} key={index}>
                  <Card
                    className={`day-card ${day.isSunday ? 'sunday' : ''}`}
                    size="small"
                  >
                    <div className="day-header">
                      <Text strong>{day.date.format('dddd')}</Text>
                      <Text type="secondary">{day.date.format('DD/MM')}</Text>
                    </div>

                    <div className="day-content">
                      {day.isSunday ? (
                        <div className="day-off">
                          <Text type="danger">🏖️ Ngày nghỉ</Text>
                        </div>
                      ) : selectedEmployee?.role === 'staff' ? (
                        <div className="staff-schedule">
                          {day.schedule ? (
                            <Tag
                              color={
                                day.schedule.shift === 'morning'
                                  ? 'blue'
                                  : 'purple'
                              }
                            >
                              {day.schedule.shift === 'morning'
                                ? 'Ca Sáng'
                                : 'Ca Chiều'}
                            </Tag>
                          ) : (
                            <Text type="secondary">Chưa xếp lịch</Text>
                          )}
                        </div>
                      ) : (
                        <div className="consultant-schedule">
                          {day.schedule && day.schedule.slots.length > 0 ? (
                            <div>
                              <Text strong>
                                {day.schedule.slots.length} slot
                              </Text>
                              {day.schedule.slots
                                .slice(0, 2)
                                .map((slot, idx) => (
                                  <div key={idx} className="slot-item">
                                    <Text type="secondary">{slot}</Text>
                                  </div>
                                ))}
                              {day.schedule.slots.length > 2 && (
                                <Text type="secondary">
                                  +{day.schedule.slots.length - 2} slot khác
                                </Text>
                              )}
                            </div>
                          ) : (
                            <Text type="secondary">Chưa xếp lịch</Text>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StaffManagement;
