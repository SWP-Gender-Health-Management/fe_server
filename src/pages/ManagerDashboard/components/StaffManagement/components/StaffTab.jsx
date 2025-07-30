import React, { useEffect, useState } from 'react';
import { Modal, Button, Radio, DatePicker, Tag, Avatar } from 'antd';
import { SearchOutlined, CalendarOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';


const API_URL = 'http://localhost:3000';

const StaffTab = () => {


  const accountId = Cookies.get('accountId');
  const accessToken = Cookies.get('accessToken');

  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [viewScheduleModalVisible, setViewScheduleModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShift, setSelectedShift] = useState('morning');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [staffPerPage, setStaffPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [shifts, setShifts] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: ''
  });
  const [staffMembers, setStaffMembers] = useState([{
    account_id: 1,
    full_name: 'Sarah Johnson',
    status: 'active',
    // avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    // position: 'Senior Nurse',
    // department: 'Women Health',
    email: 'sarah.johnson@gendercare.com',
    phone: '(+84) 912-345-678'
  }]);


  // Mock weekly schedule data

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/working-slot/get-slot-by-type/0`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // setTimeSlots(response.data.result || []);
        const workingSlots = response.data.result;
        const slotTimes = Array.from(
          new Set(
            workingSlots.map((workingSlot) => {
              return {
                id: workingSlot.name.split('-')[0].trim(),
                time: `${workingSlot.start_at.slice(0, 5)} - ${workingSlot.end_at.slice(0, 5)}`,
                slot_id: workingSlot.slot_id,
              }
            })
          )
        ).sort();
        console.log("staff slot Times:", slotTimes);
        setShifts(slotTimes);
      } catch (error) {
        console.error('Error fetching Slot:', error);
        return;
      }
    };
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [currentPage]);

  useEffect(() => {
    if (selectedStaff) {
      fetchWeeklySchedule();
    }
  }, [selectedStaff]);

  const handleSchedule = (staff) => {
    setSelectedStaff(staff);
    setScheduleModalVisible(true);
  };

  const handleViewSchedule = (staff) => {
    setSelectedStaff(staff);
    setViewScheduleModalVisible(true);
  };

  const handleScheduleSubmit = async () => {
    // Handle schedule submission
    console.log('Schedule submitted:', {
      staff: selectedStaff,
      date: selectedDate,
      shift: selectedShift
    });
    try {
      await axios.post(`${API_URL}/manager/create-staff-pattern`, {
        staff_id: selectedStaff?.account_id,
        date: new Date(selectedDate).toISOString().split('T')[0],
        working_slot_id: selectedShift,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        console.log("Schedule submitted successfully:", response.data.result);
      
      });
    } catch (error) {
      console.error("Error submitting schedule:", error);
    } finally {
      setScheduleModalVisible(false);
      setSelectedDate(null);
      setSelectedShift('');
      setSelectedStaff(null);
    }
  };

  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -5 : 1); // -5 because we want to start from Monday
    return new Date(startOfWeek.setDate(diff)).toISOString().split('T')[0];
  };

  const fetchWeeklySchedule = async () => {
    try {
      const response = await axios.get(`${API_URL}/manager/get-staff-pattern-by-week`, {
        params: {
          staff_id: selectedStaff?.account_id,
          start_date: getStartOfWeek(new Date()),
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log("Weekly staff schedule response:", response.data.result);
      const schedule = response.data.result;
      setWeeklySchedule({
        monday: schedule.monday,
        tuesday: schedule.tuesday,
        wednesday: schedule.wednesday,
        thursday: schedule.thursday,
        friday: schedule.friday,
        saturday: schedule.saturday,
        sunday: schedule.sunday,
      })
    } catch (error) {
      console.error("Error fetching weekly schedule:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${API_URL}/manager/get-staffs`, {
        params: {
          full_name: searchName,
          ...(statusFilter !== 'all' && { is_banned: statusFilter === 'true' }),
          page: currentPage,
          limit: staffPerPage,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log("Staff response:", response.data.result);
      setStaffMembers(response.data.result?.staffs || []);
      setTotalPages(response.data.result?.totalPage);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const filteredStaff = staffMembers.filter(staff => {
    const nameMatch = staff.full_name.toLowerCase().includes(searchName.toLowerCase());
    const statusMatch = statusFilter === 'all' || staff.is_banned === statusFilter === 'true';
    return nameMatch && statusMatch;
  });

  const renderWeeklySchedule = () => {

    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
    const scheduleKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return (
      <div className="weekly-schedule">
        <div className="schedule-header">
          <h3>Lịch làm việc của {selectedStaff?.full_name}</h3>
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
                      weeklySchedule[day] && weeklySchedule[day].includes(shift.id) ? (
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
          <option value="false">Hoạt động</option>
          <option value="true">Bị khóa</option>
        </select>
      </div>

      <div className="staff-list">
        <table className="management-table">
          <thead>
            <tr>

              <th>Tên nhân viên</th>
              {/* <th>Vị trí</th>
              <th>Bộ phận</th> */}
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map(staff => (
              <tr key={staff.id} className={staff.is_banned === true ? 'blocked-row' : ''}>

                <td className="name-column">{staff.full_name}</td>
                {/* <td>{staff.position}</td>
                <td>{staff.department}</td> */}
                <td>{staff.email}</td>
                <td>{staff.phone}</td>
                <td>
                  <Tag color={staff.is_banned === false ? 'green' : 'red'}>
                    {staff.is_banned === false ? 'Hoạt động' : 'Bị khóa'}
                  </Tag>
                </td>
                <td className="staff-tab-action-column">
                  <Button
                    icon={<CalendarOutlined />}
                    onClick={() => handleSchedule(staff)}
                    type="primary"
                    size="small"
                    className="staff-tab-action-button"
                  >
                    Xếp lịch
                  </Button>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewSchedule(staff)}
                    size="small"
                    className="staff-tab-action-button"
                  >
                    Xem lịch
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            Trang {currentPage} của {totalPages}
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              Đầu
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? 'active' : ''}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Cuối
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <Modal
        title={`Xếp lịch làm việc - ${selectedStaff?.full_name}`}
        open={scheduleModalVisible}
        onOk={handleScheduleSubmit}
        onCancel={() => {
          setScheduleModalVisible(false);
          setSelectedDate(null);
          setSelectedShift('');
          setSelectedStaff(null);
        }}
        width={500}
      >
        <div className="schedule-form">
          <div className="date-picker">
            <label>Chọn ngày:</label>
            <DatePicker
              onChange={(date) => setSelectedDate(date)}
              disabledDate={(current) => {
                return current && current.day() === 0 || current < new Date(); // Disable Sundays and past days
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
                <Radio.Button key={shift.slot_id} value={shift.slot_id} className="shift-radio-button">
                  {shift.time}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        </div>
      </Modal>

      {/* View Schedule Modal */}
      <Modal
        title={`Lịch làm việc - ${selectedStaff?.full_name}`}
        open={viewScheduleModalVisible}
        onCancel={() => {
          setViewScheduleModalVisible(false);
          setSelectedStaff(null);
        }}
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