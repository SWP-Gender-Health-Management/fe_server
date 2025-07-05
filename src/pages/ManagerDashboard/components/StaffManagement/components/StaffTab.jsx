import React, { useState } from 'react';
import { Modal, Button, Radio, DatePicker, Tag, Avatar } from 'antd';
import { SearchOutlined, CalendarOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const StaffTab = () => {
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [viewScheduleModalVisible, setViewScheduleModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShift, setSelectedShift] = useState('morning');
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Enhanced mock data for staff
  const staffMembers = [
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      position: 'Senior Nurse',
      department: 'Women Health',
      email: 'sarah.johnson@gendercare.com',
      phone: '(+84) 912-345-678'
    },
    { 
      id: 2, 
      name: 'Mike Brown', 
      status: 'blocked',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      position: 'Receptionist',
      department: 'Front Office',
      email: 'mike.brown@gendercare.com',
      phone: '(+84) 923-456-789'
    },
    { 
      id: 3, 
      name: 'Emily Davis', 
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      position: 'Lab Technician',
      department: 'Laboratory',
      email: 'emily.davis@gendercare.com',
      phone: '(+84) 934-567-890'
    },
    { 
      id: 4, 
      name: 'Robert Wilson', 
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      position: 'Administrative Assistant',
      department: 'Administration',
      email: 'robert.wilson@gendercare.com',
      phone: '(+84) 945-678-901'
    },
    { 
      id: 5, 
      name: 'Linda Martinez', 
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      position: 'Pharmacy Assistant',
      department: 'Pharmacy',
      email: 'linda.martinez@gendercare.com',
      phone: '(+84) 956-789-012'
    }
  ];

  const shifts = [
    { id: 'morning', time: 'Ca sáng (7h - 12h)' },
    { id: 'afternoon', time: 'Ca chiều (13h - 18h)' }
  ];

  // Mock weekly schedule data
  const weeklySchedule = {
    monday: 'morning',
    tuesday: 'afternoon',
    wednesday: 'morning',
    thursday: 'afternoon',
    friday: 'morning',
    saturday: 'afternoon',
    sunday: null // Sunday is always off
  };

  const handleSchedule = (staff) => {
    setSelectedStaff(staff);
    setScheduleModalVisible(true);
  };

  const handleViewSchedule = (staff) => {
    setSelectedStaff(staff);
    setViewScheduleModalVisible(true);
  };

  const handleScheduleSubmit = () => {
    // Handle schedule submission
    console.log('Schedule submitted:', {
      staff: selectedStaff,
      date: selectedDate,
      shift: selectedShift
    });
    setScheduleModalVisible(false);
    setSelectedDate(null);
    setSelectedShift('morning');
  };

  const filteredStaff = staffMembers.filter(staff => {
    const nameMatch = staff.name.toLowerCase().includes(searchName.toLowerCase());
    const statusMatch = statusFilter === 'all' || staff.status === statusFilter;
    return nameMatch && statusMatch;
  });

  const renderWeeklySchedule = () => {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
    const scheduleKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return (
      <div className="weekly-schedule">
        <div className="schedule-header">
          <h3>Lịch làm việc của {selectedStaff?.name}</h3>
          <p>Vị trí: {selectedStaff?.position} - Bộ phận: {selectedStaff?.department}</p>
        </div>
        
        <table className="schedule-table">
          <thead>
            <tr className="schedule-header-row">
              <th className="time-column">Ca làm việc</th>
              {days.map((day, index) => (
                <th key={day} className={`day-column ${scheduleKeys[index] === 'sunday' ? 'sunday-column' : ''}`}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id} className="schedule-row">
                <td className="time-slot-label">{shift.time}</td>
                {scheduleKeys.map((day) => (
                  <td 
                    key={`${day}-${shift.id}`} 
                    className={`schedule-cell ${day === 'sunday' ? 'day-off' : ''}`}
                  >
                    {day === 'sunday' ? (
                      <span className="day-off-icon">Nghỉ</span>
                    ) : (
                      weeklySchedule[day] === shift.id ? (
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
    <div className="staff-tab">
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

      <div className="staff-list">
        <table className="management-table">
          <thead>
            <tr>
              <th className="avatar-column"></th>
              <th>Tên nhân viên</th>
              <th>Vị trí</th>
              <th>Bộ phận</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map(staff => (
              <tr key={staff.id} className={staff.status === 'blocked' ? 'blocked-row' : ''}>
                <td className="avatar-column">
                  <Avatar src={staff.avatar} />
                </td>
                <td className="name-column">{staff.name}</td>
                <td>{staff.position}</td>
                <td>{staff.department}</td>
                <td>{staff.email}</td>
                <td>{staff.phone}</td>
                <td>
                  <Tag color={staff.status === 'active' ? 'green' : 'red'}>
                    {staff.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                  </Tag>
                </td>
                <td className="action-column">
                  <Button
                    icon={<CalendarOutlined />}
                    onClick={() => handleSchedule(staff)}
                    type="primary"
                    size="small"
                    className="action-button"
                  >
                    Xếp lịch
                  </Button>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewSchedule(staff)}
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
        title={`Xếp lịch làm việc - ${selectedStaff?.name}`}
        open={scheduleModalVisible}
        onOk={handleScheduleSubmit}
        onCancel={() => setScheduleModalVisible(false)}
        width={500}
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
          <div className="shift-selection">
            <label>Chọn ca làm việc:</label>
            <Radio.Group
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="shift-radio-group"
            >
              {shifts.map(shift => (
                <Radio.Button key={shift.id} value={shift.id} className="shift-radio-button">
                  {shift.time}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        </div>
      </Modal>

      {/* View Schedule Modal */}
      <Modal
        title={`Lịch làm việc - ${selectedStaff?.name}`}
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

export default StaffTab; 