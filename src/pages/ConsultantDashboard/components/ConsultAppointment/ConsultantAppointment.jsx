import React, { useEffect, useState } from 'react';
import AppointmentModal from '../Appointment/AppointmentModal';
import './ConsultantAppointment.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const API_URL = 'http://localhost:3000';

const ConsultantAppointment = ({ appointments, fetchWeekAppointment, consultantData, fetchConsultAppointmentStat }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  // const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [reportText, setReportText] = useState('');


  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/working-slot/get-slot-by-type/1`
        );
        console.log('Slot Response:', response.data.result);
        setTimeSlots(response.data.result || []);
      } catch (error) {
        console.error("Error fetching Slot:", error);
        return;
      }
    }
    fetchTimeSlots();

  }, []);

  useEffect(() => {
    fetchWeekAppointment(selectedDate, false);
  }, [selectedDate]);

  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // const fetchWeekAppointment = async (selectedDate) => {
  //   try {
  //     const startWeekDay = getWeekStartDay(selectedDate || new Date());
  //     const endWeekDay = new Date(startWeekDay);
  //     endWeekDay.setDate(startWeekDay.getDate() + 6);

  //     // Chuẩn hóa ngày để chỉ so sánh ngày, tháng, năm
  //     const startWeekDayNormalized = new Date(startWeekDay.getFullYear(), startWeekDay.getMonth(), startWeekDay.getDate());
  //     const endWeekDayNormalized = new Date(endWeekDay.getFullYear(), endWeekDay.getMonth(), endWeekDay.getDate());

  //     console.log("Week Start:", startWeekDayNormalized, "Week End:", endWeekDayNormalized);
  //     console.log("Appointments:", appointments);

  //     const filtered = appointments.filter((app) => {
  //       const appDate = new Date(app?.consultant_pattern?.date);
  //       const isValidDate = !isNaN(appDate);
  //       if (!isValidDate) return false;

  //       // Chuẩn hóa ngày của appDate
  //       const appDateNormalized = new Date(appDate.getFullYear(), appDate.getMonth(), appDate.getDate());
  //       console.log("Checking app:", app, "Date:", appDateNormalized);

  //       return startWeekDayNormalized <= appDateNormalized && appDateNormalized <= endWeekDayNormalized;
  //     });

  //     console.log("Filtered Appointments:", filtered);
  //     setFilteredAppointments(filtered);
  //   } catch (error) {
  //     console.error("Error in fetchWeekAppointment:", error);
  //     setFilteredAppointments([]);
  //   }
  // };

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };



  const getAppointmentsForDate = (date) => {
    return appointments.filter(
      (apt) => new Date(apt.consultant_pattern.date).toDateString() === date.toDateString()
    );
  };

  const getAppointmentForSlot = (date, timeSlot) => {
    const dayAppointments = getAppointmentsForDate(date);
    return dayAppointments.find((apt) => apt.consultant_pattern.working_slot.name === timeSlot.name);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const updateAppointmentStatus = async (appointment, status, reportText) => {
    if (status == 'completed') {
      if (!reportText.trim()) {
        alert('Vui lòng nhập báo cáo');
        return;
      }

      const reportForm = {
        app_id: appointment.app_id,
        name: appointment.customer ? `Báo cáo tư vấn cho ${appointment.customer.full_name}` : 'Báo cáo tư vấn',
        description: reportText
      }

      try {
        const accessToken = Cookies.get("accessToken");
        const response = await axios.post(
          `${API_URL}/consult-report/create-consult-report`,
          reportForm,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
          }
        );
        console.log('Createed report:', response.data.result);
      } catch (error) {
        console.error("Error update appointment status:", error);
        return;
      } finally {
        setReportText('');
      }
    }
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await axios.put(
        `${API_URL}/consult-appointment/update-consult-appointment/${appointment.app_id}`,
        {
          status
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Update Response:', response.data.result);
    } catch (error) {
      console.error("Error update appointment status:", error);
      return;
    } finally {
      fetchWeekAppointment(selectedDate, false);
      fetchConsultAppointmentStat();
      setSelectedAppointment(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'completed':
        return '#6366f1';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };


  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const weekDates = getWeekDates(selectedDate);

  return (
    <div className="consultant-appointment">
      <div className="appointment-header">
        <div className="header-content">
          <h2>🗓️ Quản lý Lịch hẹn</h2>
          <p>Xem và quản lý tất cả các cuộc hẹn tư vấn của bạn</p>
        </div>

        <div className="header-actions">

          <div className="date-navigation">
            <button
              className="nav-btn"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 7);
                setSelectedDate(newDate);
              }}
            >
              ◀
            </button>
            <span className="current-date">{formatDate(selectedDate)}</span>
            <button
              className="nav-btn"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 7);
                setSelectedDate(newDate);
              }}
            >
              ▶
            </button>
          </div>

          <button
            className="today-btn"
            onClick={() => setSelectedDate(new Date())}
          >
            Hôm nay
          </button>
        </div>
      </div>

      {/* New Calendar Grid */}
      <div className="calendar-container">
        <div className="calendar-grid">
          {/* Header Row */}
          <div className="calendar-header-row">
            {/* Time Header */}
            <div className="time-header-cell">Thời gian</div>

            {/* Days Header Container */}
            <div className="days-header-container">
              {weekDates.map((date, dayIndex) => {
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const isWeekend = dayIndex === 0 || dayIndex === 6;
                return (
                  <div
                    key={`header-${dayIndex}`}
                    // className={`day-header-cell ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''}`}
                    className={`day-header-cell  ${isWeekend ? 'weekend' : ''}`}
                  >
                    <div className="day-name">{daysOfWeek[dayIndex]}</div>
                    <div className="day-date">
                      {date.getDate()} / {date.getMonth() + 1}
                    </div>
                    {/* <div className="day-month">Th{date.getMonth() + 1}</div> */}
                    {isToday && <div className="today-indicator">●</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar Body */}
          <div className="calendar-body">
            {timeSlots.map((timeSlot) => (
              <div key={`slot-${timeSlot.slot_id}`} className="time-slot-row">
                {/* Time Slot Cell */}
                <div className="time-slot-cell">
                  <div className="time-slot-name">
                    {timeSlot.name.split('-')[0]}
                  </div>
                  <div className="time-slot-time">
                    {timeSlot.start_at.slice(0, 5)} -{' '}
                    {timeSlot.end_at.slice(0, 5)}
                  </div>
                </div>

                {/* Days Container */}
                <div className="days-container">
                  {weekDates.map((date, dayIndex) => {
                    const appointment = getAppointmentForSlot(date, timeSlot);
                    const isToday =
                      date.toDateString() === new Date().toDateString();
                    const isPast = date < new Date().setHours(0, 0, 0, 0);
                    const isWeekend = dayIndex === 0 || dayIndex === 6;

                    return (
                      <div
                        key={`cell-${dayIndex}-${timeSlot.slot_id}`}
                        // className={`day-cell ${appointment ? 'has-appointment' : 'empty'} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${isWeekend ? 'weekend' : ''}`}
                        className={`day-cell ${appointment ? 'has-appointment' : 'empty'} ${isPast ? 'past' : ''} ${isWeekend ? 'weekend' : ''}`}
                      >
                        {appointment ? (
                          <div
                            className={`appointment-card ${appointment.status}`}
                            onClick={() => handleAppointmentClick(appointment)}
                          >
                            <div className="appointment-time">
                              {appointment.consultant_pattern.working_slot.start_at.slice(
                                0,
                                5
                              )}
                            </div>
                            <div className="appointment-customer">
                              {appointment.customer.full_name}
                            </div>
                            <div className="appointment-type">Tư vấn</div>
                          </div>
                        ) : (
                          <div className="empty-slot">{/* Empty slot */}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="appointment-stats">
        <div className="stat-card-consultant">
          <span className="stat-icon">📊</span>
          <div className="stat-content">
            <h3>{consultantData.totalAppointments || 0}</h3>
            <p>Tổng cuộc hẹn</p>
          </div>
        </div>

        <div className="stat-card-consultant">
          <span className="stat-icon">✅</span>
          <div className="stat-content">
            <h3>
              {consultantData.confirmedAppointments || 0}
            </h3>
            <p>Đã xác nhận</p>
          </div>
        </div>

        <div className="stat-card-consultant">
          <span className="stat-icon">⏳</span>
          <div className="stat-content">
            <h3>
              {consultantData.pendingAppointments || 0}
            </h3>
            <p>Chờ xác nhận</p>
          </div>
        </div>

        <div className="stat-card-consultant">
          <span className="stat-icon">🔄</span>
          <div className="stat-content">
            <h3>
              {consultantData.completedAppointments || 0}
            </h3>
            <p>Đã hoàn thành</p>
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {showModal && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="appointment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Chi tiết cuộc hẹn</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="appointment-info">
                <div className="info-row">
                  <label>Khách hàng:</label>
                  <span>{selectedAppointment.customer.full_name}</span>
                </div>

                <div className="info-row">
                  <label>Thời gian:</label>
                  <span>
                    {new Date(
                      selectedAppointment.consultant_pattern.date
                    ).toLocaleDateString('vi-VN')}{' '}
                    -
                    {
                      selectedAppointment.consultant_pattern.working_slot
                        .start_at
                    }{' '}
                    đến{' '}
                    {selectedAppointment.consultant_pattern.working_slot.end_at}</span>
                </div>

                <div className="info-row">
                  <label>Liên hệ:</label>
                  <div className="contact-info">
                    <span>📞 {selectedAppointment.customer.phone}</span>
                    <span>📧 {selectedAppointment.customer.email}</span>
                  </div>
                </div>



                <div className="info-row">
                  <label>Trạng thái:</label>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(
                        selectedAppointment.status
                      ),
                      color: "white"
                    }}
                  >
                    {selectedAppointment.status === 'confirmed' &&
                      'Đã xác nhận'}
                    {selectedAppointment.status === 'pending' && 'Chờ xác nhận'}
                    {selectedAppointment.status === 'completed' &&
                      'Đã hoàn thành'}
                    {selectedAppointment.status === 'cancelled' && 'Đã hủy'}
                  </span>
                </div>

                {selectedAppointment.status === 'confirmed' && (
                  <div className="info-row">
                    <label>Link Meeting:</label>
                    <Link to={selectedAppointment.gg_meet} target="_blank">
                      <Button >
                        Meeting
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="info-row">
                  <label>Vấn đề:</label>
                  <p className="issue-text">{selectedAppointment.description}</p>
                </div>

                {selectedAppointment.status === 'confirmed' && (
                  <div className="info-row">
                    <label>Report:</label>
                    <br />
                    <textarea
                      placeholder="Nhập báo cáo chi tiết và chuyên nghiệp..."
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      className="report-textarea"
                      rows="10"
                    />
                  </div>
                )}
                {selectedAppointment.status === 'completed' &&
                  selectedAppointment.report && (
                    <div className="info-row">
                      <label>Report:</label>
                      <br />
                      <p className="issue-text">
                        {selectedAppointment.report.description}
                      </p>
                    </div>
                  )}


              </div>

              <div className="modal-actions">
                {/* {selectedAppointment.status === 'pending' && (
                  <>
                    <button
                      className="action-btn confirm"
                      onClick={() => {
                        updateAppointmentStatus(
                          selectedAppointment,
                          'confirmed'
                        );
                        setShowModal(false);
                      }}
                    >
                      ✅ Xác nhận
                    </button>
                    <button
                      className="action-btn cancel"
                      onClick={() => {
                        updateAppointmentStatus(
                          selectedAppointment,
                          'cancelled'
                        );
                        setShowModal(false);
                      }}
                    >
                      ❌ Hủy bỏ
                    </button>
                  </>
                )} */}

                {selectedAppointment.status === 'confirmed' && (
                  <button
                    className="action-btn complete"
                    onClick={() => {
                      updateAppointmentStatus(
                        selectedAppointment,
                        'completed',
                        reportText
                      );
                      setShowModal(false);
                    }}
                  >
                    ✅ Hoàn thành
                  </button>
                )}

                <button
                  className="action-btn secondary"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantAppointment;
