import React, { useState } from 'react';
import { Modal, Button, Checkbox, DatePicker, Tag, Avatar } from 'antd';
import { SearchOutlined, CalendarOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const ConsultantTab = () => {
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [viewScheduleModalVisible, setViewScheduleModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState(null);

  // Enhanced mock data for consultants
  const consultants = [
    { 
      id: 1, 
      name: 'Dr. John Doe', 
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      specialty: 'Gynecology',
      email: 'john.doe@gendercare.com',
      phone: '(+84) 912-345-678'
    },
    { 
      id: 2, 
      name: 'Dr. Jane Smith', 
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      specialty: 'Obstetrics',
      email: 'jane.smith@gendercare.com',
      phone: '(+84) 923-456-789'
    },
    { 
      id: 3, 
      name: 'Dr. Michael Chen', 
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      specialty: 'Reproductive Medicine',
      email: 'michael.chen@gendercare.com',
      phone: '(+84) 934-567-890'
    },
    { 
      id: 4, 
      name: 'Dr. Sarah Johnson', 
      status: 'blocked',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      specialty: 'Women Health',
      email: 'sarah.johnson@gendercare.com',
      phone: '(+84) 945-678-901'
    },
    { 
      id: 5, 
      name: 'Dr. David Williams', 
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
      specialty: 'Gynecologic Oncology',
      email: 'david.williams@gendercare.com',
      phone: '(+84) 956-789-012'
    }
  ];

  const timeSlots = [
    { id: 1, time: '07:00 - 08:30' },
    { id: 2, time: '08:30 - 10:00' },
    { id: 3, time: '10:00 - 11:30' },
    { id: 4, time: '11:30 - 13:00' },
    { id: 5, time: '13:00 - 14:30' },
    { id: 6, time: '14:30 - 16:00' },
    { id: 7, time: '16:00 - 17:30' },
    { id: 8, time: '17:30 - 19:00' },
  ];

  // Mock weekly schedule data - mảng chứa các slot ID cho mỗi ngày
  const weeklySchedule = {
    monday: [1, 3, 5],
    tuesday: [2, 4, 6],
    wednesday: [1, 4, 7],
    thursday: [2, 5, 8],
    friday: [3, 6],
    saturday: [1, 2],
    sunday: [] // Sunday is always empty (day off)
  };

  const handleSchedule = (consultant) => {
    setSelectedConsultant(consultant);
    setScheduleModalVisible(true);
  };

  const handleViewSchedule = (consultant) => {
    setSelectedConsultant(consultant);
    setViewScheduleModalVisible(true);
  };

  const handleScheduleSubmit = () => {
    // Handle schedule submission
    console.log('Schedule submitted:', {
      consultant: selectedConsultant,
      date: selectedDate,
      slots: selectedSlots
    });
    setScheduleModalVisible(false);
    setSelectedDate(null);
    setSelectedSlots([]);
  };

  const filteredConsultants = consultants.filter(consultant => {
    const nameMatch = consultant.name.toLowerCase().includes(searchName.toLowerCase());
    const statusMatch = statusFilter === 'all' || consultant.status === statusFilter;
    return nameMatch && statusMatch;
  });

  const renderWeeklySchedule = () => {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
    const scheduleKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return (
      <div className="weekly-schedule">
        <div className="schedule-header">
          <h3>Lịch làm việc của {selectedConsultant?.name}</h3>
          <p>Chuyên khoa: {selectedConsultant?.specialty}</p>
        </div>
        
        <table className="schedule-table">
          <thead>
            <tr className="schedule-header-row">
              <th className="time-column">Thời gian</th>
              {days.map((day, index) => (
                <th key={day} className={`day-column ${scheduleKeys[index] === 'sunday' ? 'sunday-column' : ''}`}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot.id} className="schedule-row">
                <td className="time-slot-label">{slot.time}</td>
                {scheduleKeys.map((day) => (
                  <td 
                    key={`${day}-${slot.id}`} 
                    className={`schedule-cell ${day === 'sunday' ? 'day-off' : ''}`}
                  >
                    {day === 'sunday' ? (
                      <span className="day-off-icon">Nghỉ</span>
                    ) : (
                      weeklySchedule[day].includes(slot.id) ? (
                        <div className="scheduled-slot">
                          <CheckOutlined className="scheduled-icon" />
                          <span>Làm việc</span>
                        </div>
                      ) : (
                        <div className="not-scheduled-slot">
                          <CloseOutlined className="not-scheduled-icon" />
                          <span>Nghỉ</span>
                        </div>
                      )
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="consultant-tab">
      <div className="filters">
        <div className="search-box">
          <SearchOutlined />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="blocked">Bị khóa</option>
        </select>
      </div>

      <div className="consultant-list">
        <table className="management-table">
          <thead>
            <tr>
              <th className="avatar-column"></th>
              <th>Tên bác sĩ</th>
              <th>Chuyên khoa</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredConsultants.map(consultant => (
              <tr key={consultant.id} className={consultant.status === 'blocked' ? 'blocked-row' : ''}>
                <td className="avatar-column">
                  <Avatar src={consultant.avatar} />
                </td>
                <td className="name-column">{consultant.name}</td>
                <td>{consultant.specialty}</td>
                <td>{consultant.email}</td>
                <td>{consultant.phone}</td>
                <td>
                  <Tag color={consultant.status === 'active' ? 'green' : 'red'}>
                    {consultant.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                  </Tag>
                </td>
                <td className="action-column">
                  <Button
                    icon={<CalendarOutlined />}
                    onClick={() => handleSchedule(consultant)}
                    type="primary"
                    size="small"
                    className="action-button"
                  >
                    Xếp lịch
                  </Button>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewSchedule(consultant)}
                    size="small"
                    className="action-button"
                  >
                    Xem lịch
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Modal */}
      <Modal
        title={`Xếp lịch làm việc - ${selectedConsultant?.name}`}
        open={scheduleModalVisible}
        onOk={handleScheduleSubmit}
        onCancel={() => setScheduleModalVisible(false)}
        width={600}
      >
        <div className="schedule-form">
          <div className="date-picker">
            <label>Chọn ngày:</label>
            <DatePicker
              onChange={(date) => setSelectedDate(date)}
              disabledDate={(current) => {
                return current && current.day() === 0; // Disable Sundays
              }}
              placeholder="Chọn ngày làm việc"
              className="date-picker-field"
            />
          </div>
          <div className="time-slots-grid">
            <label>Chọn các slot thời gian:</label>
            <div className="time-slots-container">
              {timeSlots.map(slot => (
                <Checkbox
                  key={slot.id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSlots([...selectedSlots, slot.id]);
                    } else {
                      setSelectedSlots(selectedSlots.filter(id => id !== slot.id));
                    }
                  }}
                >
                  {slot.time}
                </Checkbox>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* View Schedule Modal */}
      <Modal
        title={`Lịch làm việc - ${selectedConsultant?.name}`}
        open={viewScheduleModalVisible}
        onCancel={() => setViewScheduleModalVisible(false)}
        footer={null}
        width={1200}
        className="schedule-modal"
      >
        {renderWeeklySchedule()}
      </Modal>
    </div>
  );
};

export default ConsultantTab; 