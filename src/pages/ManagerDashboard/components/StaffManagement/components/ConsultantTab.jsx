import React, { useEffect, useState } from 'react';
import { Modal, Button, Checkbox, DatePicker, Tag, Avatar } from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import './ConsultantTab.css';
import moment from 'moment/moment';



const API_URL = 'http://localhost:3000';


const ConsultantTab = () => {
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [viewScheduleModalVisible, setViewScheduleModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [consultants, setConsultants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [consultantsPerPage] = useState(10);
  const [timeSlots, setTimeSlots] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  const accountId = Cookies.get('accountId');
  const accessToken = Cookies.get('accessToken');


  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/working-slot/get-slot-by-type/1`
        );
        console.log('Slot Response:', response.data.result);
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
        console.log("Slot Times:", slotTimes);
        setTimeSlots(slotTimes);
      } catch (error) {
        console.error('Error fetching Slot:', error);
        return;
      }
    };
    fetchTimeSlots();
  }, []);

  useEffect(() => {

    fetchConsultant();

  }, [currentPage]);

  useEffect(() => {
    if (selectedConsultant) {
      fetchWeeklySchedule();
    }
  }, [selectedConsultant]);

  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -5 : 1); // -5 because we want to start from Monday
    return new Date(startOfWeek.setDate(diff)).toISOString().split('T')[0];
  };

  const fetchWeeklySchedule = async () => {
    try {
      await axios.get(`${API_URL}/manager/get-consultant-pattern-by-week`, {
        params: {
          consultant_id: selectedConsultant?.account_id || '',
          start_date: getStartOfWeek(new Date()),
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        console.log("Weekly schedule response:", response.data.result);
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
      });
    } catch (error) {
      console.error("Error fetching weekly schedule:", error);
    }
  }

  const fetchConsultant = async () => {
    try {
      await axios.get(
        `${API_URL}/manager/get-consultants`,
        {
          params: {
            full_name: searchName,
            ...(statusFilter !== 'all' && { is_banned: statusFilter }),
            page: currentPage,
            limit: consultantsPerPage,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      ).then((response) => {
        console.log('Consultant Response:', response.data.result);
        setConsultants(response.data.result.consultants);
        setTotalPages(response.data.result.totalPage);
      });
    } catch (error) {
      console.error("Fetching manager consultant error: ", error);
    }
  }

  // Mock weekly schedule data - mảng chứa các slot ID cho mỗi ngày


  const handleSchedule = (consultant) => {
    setSelectedConsultant(consultant);
    setScheduleModalVisible(true);
  };

  const handleViewSchedule = (consultant) => {
    setSelectedConsultant(consultant);
    setViewScheduleModalVisible(true);
  };

  const handleScheduleSubmit = async () => {
    // Handle schedule submission


    try {
      await axios.post(`${API_URL}/manager/create-consultant-pattern`, {
        consultant_id: selectedConsultant?.account_id || '',
        date: new Date(selectedDate).toISOString().split('T')[0],
        working_slot_ids: selectedSlots,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        console.log("Schedule set response:", response.data.result);
        console.log('Schedule submitted:', {
          consultant: selectedConsultant,
          date: selectedDate,
          slots: selectedSlots,
        });
      });
    } catch (error) {
      console.error("Error setting consultant pattern:", error);
    } finally {
      setScheduleModalVisible(false);
      setSelectedDate(null);
      setSelectedSlots([]);
      setSelectedConsultant(null);
    }

  };

  // const filteredConsultants = consultants.filter((consultant) => {
  //   const nameMatch = consultant.full_name
  //     .toLowerCase()
  //     .includes(searchName.toLowerCase());
  //   const statusMatch =
  //     statusFilter === 'all' || consultant.is_banned === statusFilter;
  //   return nameMatch && statusMatch;
  // });

  const renderWeeklySchedule = () => {
    const days = [
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
      'Chủ Nhật',
    ];
    const scheduleKeys = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];



    return (
      <div className="weekly-schedule">
        <div className="schedule-header">
          <h3>Lịch làm việc của {selectedConsultant?.full_name}</h3>
          {/* <p>Chuyên khoa: {selectedConsultant?.specialty}</p> */}
        </div>

        <table className="schedule-table">
          <thead>
            <tr className="schedule-header-row">
              <th className="time-column">Thời gian</th>
              {days.map((day, index) => (
                <th
                  key={day}
                  className={`day-column ${scheduleKeys[index] === 'sunday' ? 'sunday-column' : ''}`}
                >
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
                    ) : weeklySchedule[day].includes(slot.id) ? (
                      <div className="scheduled-slot">
                        <CheckOutlined className="scheduled-icon" />
                        <span>Làm việc</span>
                      </div>
                    ) : (
                      <div className="not-scheduled-slot">
                        <CloseOutlined className="not-scheduled-icon" />
                        <span>Nghỉ</span>
                      </div>
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
          <option value="false">Hoạt động</option>
          <option value="true">Bị khóa</option>
        </select>

        <button
          className="btn-search"
          onClick={async () => {
            await setCurrentPage(1);
            await fetchConsultant();
          }}
        >
          Tìm kiếm
        </button>
      </div>

      <div className="consultant-list">
        <table className="management-table">
          <thead>
            <tr>
              {/* <th className="avatar-column"></th> */}
              <th>Tên bác sĩ</th>
              {/* <th>Chuyên khoa</th> */}
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {consultants.map((consultant) => (
              <tr
                key={consultant.id}
                className={consultant.is_banned === true ? 'blocked-row' : ''}
              >
                {/* <td className="avatar-column">
                  <Avatar src={consultant.avatar} />
                </td> */}
                <td className="name-column">{consultant.full_name}</td>
                {/* <td>{consultant.specialty}</td> */}
                <td>{consultant.email}</td>
                <td>{consultant.phone}</td>
                <td>
                  <Tag color={consultant.is_banned === false ? 'green' : 'red'}>
                    {consultant.is_banned === false ? 'Hoạt động' : 'Bị khóa'}
                  </Tag>
                </td>
                <td className="action-column">
                  <Button
                    icon={<CalendarOutlined />}
                    onClick={() => handleSchedule(consultant)}
                    type="primary"
                    size="small"
                    className="consltant-tab-action-button"
                  >
                    Xếp lịch
                  </Button>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewSchedule(consultant)}
                    size="small"
                    className="consltant-tab-action-button"
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
        title={`Xếp lịch làm việc - ${selectedConsultant?.full_name}`}
        open={scheduleModalVisible}
        onOk={handleScheduleSubmit}
        onCancel={() => {
          setScheduleModalVisible(false);
          setSelectedConsultant(null);
          setSelectedDate(null);
          setSelectedSlots([]);
        }}
        width={600}
      >
        <div className="schedule-form">
          <div className="date-picker">
            <label>Chọn ngày:</label>
            <DatePicker
              onChange={(date) => setSelectedDate(date)}
              disabledDate={(current) => {
                return current && (current.day() === 0 || current.isBefore(moment())); // Disable Sundays and past days
              }}
              placeholder="Chọn ngày làm việc"
              className="date-picker-field"
              required
            />
          </div>
          <div className="time-slots-grid">
            <label>Chọn các slot thời gian:</label>
            <div className="time-slots-container">
              {timeSlots.map((slot) => (
                <Checkbox
                  key={slot.slot_id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSlots([...selectedSlots, slot.slot_id]);
                    } else {
                      setSelectedSlots(
                        selectedSlots.filter((id) => id !== slot.slot_id)
                      );
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
      {selectedConsultant && (
        <Modal
          title={`Lịch làm việc - ${selectedConsultant?.full_name}`}
          open={viewScheduleModalVisible}
          onCancel={() => setViewScheduleModalVisible(false)}
          footer={null}
          width={1200}
          className="schedule-modal"
        >
          {renderWeeklySchedule()}
        </Modal>
      )}
    </div>
  );
};

export default ConsultantTab;
