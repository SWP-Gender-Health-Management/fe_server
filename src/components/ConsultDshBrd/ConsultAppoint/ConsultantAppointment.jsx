import React, { useState, useEffect } from 'react';
import './ConsultantAppointment.css';

const ConsultantAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [showModal, setShowModal] = useState(false);

  // Mock appointment data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: new Date(),
      time: '09:30',
      endTime: '10:30',
      customerName: 'Nguyễn Thị Lan',
      customerPhone: '0123456789',
      customerEmail: 'lan@email.com',
      issue:
        'Tư vấn về kế hoạch hóa gia đình và các phương pháp tránh thai an toàn',
      type: 'Online',
      status: 'confirmed',
      priority: 'high',
      notes: '',
    },
    {
      id: 2,
      date: new Date(),
      time: '14:00',
      endTime: '15:00',
      customerName: 'Trần Minh Hoa',
      customerPhone: '0987654321',
      customerEmail: 'hoa@email.com',
      issue: 'Sức khỏe sinh sản sau sinh và chăm sóc em bé',
      type: 'Offline',
      status: 'pending',
      priority: 'medium',
      notes: '',
    },
    {
      id: 3,
      date: new Date(Date.now() + 86400000), // tomorrow
      time: '10:00',
      endTime: '11:00',
      customerName: 'Lê Thị Mai',
      customerPhone: '0555555555',
      customerEmail: 'mai@email.com',
      issue: 'Tư vấn chu kỳ kinh nguyệt không đều',
      type: 'Online',
      status: 'confirmed',
      priority: 'low',
      notes: '',
    },
  ]);

  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

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
      (apt) => apt.date.toDateString() === date.toDateString()
    );
  };

  const getAppointmentForSlot = (date, timeSlot) => {
    const dayAppointments = getAppointmentsForDate(date);
    return dayAppointments.find((apt) => apt.time === timeSlot);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const updateAppointmentStatus = (appointmentId, status) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt))
    );
  };

  const addNotes = (appointmentId, notes) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, notes } : apt))
    );
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
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
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Tuần
            </button>
            <button
              className={`toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Tháng
            </button>
          </div>

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

      {/* Calendar Grid */}
      <div className="calendar-container">
        <div className="calendar-grid compact">
          {/* Time column */}
          <div className="time-column">
            <div className="time-header"></div>
            {timeSlots.map((time) => (
              <div key={time} className="time-slot">
                {time}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {weekDates.map((date, dayIndex) => (
            <div key={dayIndex} className="day-column">
              <div className="day-header">
                <span className="day-name">{daysOfWeek[dayIndex]}</span>
                <span className="day-date">{date.getDate()}</span>
                {date.toDateString() === new Date().toDateString() && (
                  <span className="today-indicator">●</span>
                )}
              </div>

              {timeSlots.map((timeSlot) => {
                const appointment = getAppointmentForSlot(date, timeSlot);
                return (
                  <div
                    key={`${dayIndex}-${timeSlot}`}
                    className={`time-cell ${appointment ? 'has-appointment' : ''}`}
                  >
                    {appointment && (
                      <div
                        className={`appointment-card ${appointment.status}`}
                        onClick={() => handleAppointmentClick(appointment)}
                        style={{
                          borderLeft: `4px solid ${getStatusColor(appointment.status)}`,
                        }}
                      >
                        <div className="appointment-time">
                          {appointment.time} - {appointment.endTime}
                        </div>
                        <div className="appointment-customer">
                          {appointment.customerName}
                        </div>
                        <div className="appointment-type">
                          <span
                            className={`type-badge ${appointment.type.toLowerCase()}`}
                          >
                            {appointment.type}
                          </span>
                          <span
                            className="priority-badge"
                            style={{
                              backgroundColor: getPriorityColor(
                                appointment.priority
                              ),
                            }}
                          >
                            {appointment.priority === 'high' && '🔴'}
                            {appointment.priority === 'medium' && '🟡'}
                            {appointment.priority === 'low' && '🟢'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="appointment-stats">
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div className="stat-content">
            <h3>{appointments.length}</h3>
            <p>Tổng cuộc hẹn</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-content">
            <h3>
              {appointments.filter((apt) => apt.status === 'confirmed').length}
            </h3>
            <p>Đã xác nhận</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div className="stat-content">
            <h3>
              {appointments.filter((apt) => apt.status === 'pending').length}
            </h3>
            <p>Chờ xác nhận</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🔄</span>
          <div className="stat-content">
            <h3>
              {appointments.filter((apt) => apt.status === 'completed').length}
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
                  <span>{selectedAppointment.customerName}</span>
                </div>

                <div className="info-row">
                  <label>Thời gian:</label>
                  <span>
                    {selectedAppointment.date.toLocaleDateString('vi-VN')} -
                    {selectedAppointment.time} đến {selectedAppointment.endTime}
                  </span>
                </div>

                <div className="info-row">
                  <label>Liên hệ:</label>
                  <div className="contact-info">
                    <span>📞 {selectedAppointment.customerPhone}</span>
                    <span>📧 {selectedAppointment.customerEmail}</span>
                  </div>
                </div>

                <div className="info-row">
                  <label>Loại:</label>
                  <span
                    className={`type-badge ${selectedAppointment.type.toLowerCase()}`}
                  >
                    {selectedAppointment.type}
                  </span>
                </div>

                <div className="info-row">
                  <label>Trạng thái:</label>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(
                        selectedAppointment.status
                      ),
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

                <div className="info-row">
                  <label>Vấn đề:</label>
                  <p className="issue-text">{selectedAppointment.issue}</p>
                </div>

                <div className="info-row">
                  <label>Ghi chú:</label>
                  <textarea
                    className="notes-textarea"
                    placeholder="Thêm ghi chú về cuộc hẹn..."
                    value={selectedAppointment.notes}
                    onChange={(e) =>
                      addNotes(selectedAppointment.id, e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="modal-actions">
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button
                      className="action-btn confirm"
                      onClick={() => {
                        updateAppointmentStatus(
                          selectedAppointment.id,
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
                          selectedAppointment.id,
                          'cancelled'
                        );
                        setShowModal(false);
                      }}
                    >
                      ❌ Hủy bỏ
                    </button>
                  </>
                )}

                {selectedAppointment.status === 'confirmed' && (
                  <button
                    className="action-btn complete"
                    onClick={() => {
                      updateAppointmentStatus(
                        selectedAppointment.id,
                        'completed'
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
