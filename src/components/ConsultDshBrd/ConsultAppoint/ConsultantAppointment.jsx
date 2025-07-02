import React, { useState} from 'react';
import AppointmentModal from '@components/ConsultDshBrd/Appointment/AppointmentModal' ;
import './ConsultantAppointment.css';

const ConsultantAppointment = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [filter, setFilter] = useState('All');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data cho appointments và schedule
  const [appointments, setAppointments] = useState([
    {
      id: 'APT001',
      date: '2024-01-15',
      slot: 2,
      customerName: 'Nguyễn Văn A',
      customerPhone: '0123456789',
      customerDOB: '1990-01-01',
      description: 'Tư vấn về vấn đề sức khỏe sinh sản',
      status: 'unaccepted', // unaccepted, accepted, done
      report: '',
    },
    {
      id: 'APT002',
      date: '2024-01-16',
      slot: 3,
      customerName: 'Trần Thị B',
      customerPhone: '0987654321',
      customerDOB: '1995-05-10',
      description: 'Tư vấn về kế hoạch hóa gia đình',
      status: 'accepted',
      report: '',
    },
    {
      id: 'APT003',
      date: '2024-01-17',
      slot: 5,
      customerName: 'Lê Văn C',
      customerPhone: '0456789123',
      customerDOB: '1988-12-25',
      description: 'Tư vấn về sức khỏe tình dục',
      status: 'done',
      report: 'Đã tư vấn chi tiết về vấn đề và đưa ra khuyến nghị phù hợp.',
    },
  ]);

  // Mock data cho schedule - những slot mà consultant có thể làm việc
  const [schedule, setSchedule] = useState([
    { date: '2024-01-15', slots: [1, 2, 3, 4, 5] },
    { date: '2024-01-16', slots: [2, 3, 4, 6, 7] },
    { date: '2024-01-17', slots: [1, 3, 5, 7, 8] },
    { date: '2024-01-18', slots: [2, 4, 6, 8] },
    { date: '2024-01-19', slots: [1, 2, 3, 5, 6] },
  ]);

  const daysOfWeek = [
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
    'Chủ Nhật',
  ];
  const slots = Array.from({ length: 8 }, (_, i) => i + 1);

  // Tính toán tuần hiện tại
  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Bắt đầu từ thứ 2
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  // Format date string
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Get appointment for specific date and slot
  const getAppointment = (date, slot) => {
    const dateStr = formatDate(date);
    return appointments.find(
      (apt) => apt.date === dateStr && apt.slot === slot
    );
  };

  // Check if consultant has schedule for date and slot
  const hasSchedule = (date, slot) => {
    const dateStr = formatDate(date);
    const daySchedule = schedule.find((s) => s.date === dateStr);
    return daySchedule && daySchedule.slots.includes(slot);
  };

  // Get cell status and style
  const getCellStatus = (date, slot) => {
    if (!hasSchedule(date, slot)) {
      return { status: 'no-schedule', className: 'cell-no-schedule' };
    }

    const appointment = getAppointment(date, slot);
    if (!appointment) {
      return { status: 'available', className: 'cell-available' };
    }

    switch (appointment.status) {
      case 'unaccepted':
        return {
          status: 'unaccepted',
          className: 'cell-unaccepted',
          appointment,
        };
      case 'accepted':
        return { status: 'accepted', className: 'cell-accepted', appointment };
      case 'done':
        return { status: 'done', className: 'cell-done', appointment };
      default:
        return { status: 'available', className: 'cell-available' };
    }
  };

  // Filter appointments based on current filter
  const shouldShowCell = (cellStatus) => {
    switch (filter) {
      case 'All':
        return true;
      case 'Accepted':
        return cellStatus.status === 'accepted';
      case 'Unaccept':
        return cellStatus.status === 'unaccepted';
      case 'Done':
        return cellStatus.status === 'done';
      default:
        return true;
    }
  };

  // Handle cell click
  const handleCellClick = (date, slot) => {
    const cellStatus = getCellStatus(date, slot);
    if (cellStatus.appointment) {
      setSelectedAppointment(cellStatus.appointment);
      setShowModal(true);
    }
  };

  // Handle appointment actions
  const handleAcceptAppointment = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'accepted' } : apt
      )
    );
    setShowModal(false);
  };

  const handleRejectAppointment = (appointmentId) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
    setShowModal(false);
  };

  const handleDoneAppointment = (appointmentId, report) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'done', report } : apt
      )
    );
    setShowModal(false);
  };

  // Navigate weeks
  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
  };

  return (
    <div className="consultant-appointment">
      <div className="appointment-header">
        <h1>Lịch Tư Vấn</h1>

        <div className="week-navigation">
          <button
            className="btn btn-secondary"
            onClick={() => navigateWeek(-1)}
          >
            ← Tuần trước
          </button>
          <span className="current-week">
            {weekDates[0].toLocaleDateString('vi-VN')} -{' '}
            {weekDates[6].toLocaleDateString('vi-VN')}
          </span>
          <button className="btn btn-secondary" onClick={() => navigateWeek(1)}>
            Tuần sau →
          </button>
        </div>
      </div>

      <div className="appointment-filters">
        {['All', 'Accepted', 'Unaccept', 'Done'].map((filterOption) => (
          <button
            key={filterOption}
            className={`filter-btn ${filter === filterOption ? 'active' : ''}`}
            onClick={() => setFilter(filterOption)}
          >
            {filterOption}
          </button>
        ))}
      </div>

      <div className="schedule-table-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="week-header">
                Tuần {weekDates[0].toLocaleDateString('vi-VN')} -{' '}
                {weekDates[6].toLocaleDateString('vi-VN')}
              </th>
              {daysOfWeek.map((day, index) => (
                <th key={day} className="day-header">
                  <div className="day-name">{day}</div>
                  <div className="day-date">
                    {weekDates[index].getDate()}/
                    {weekDates[index].getMonth() + 1}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot}>
                <td className="slot-header">Slot {slot}</td>
                {weekDates.map((date) => {
                  const cellStatus = getCellStatus(date, slot);
                  const showCell = shouldShowCell(cellStatus);

                  return (
                    <td
                      key={`${formatDate(date)}-${slot}`}
                      className={`schedule-cell ${cellStatus.className} ${!showCell ? 'hidden' : ''}`}
                      onClick={() => handleCellClick(date, slot)}
                    >
                      {cellStatus.appointment && showCell && (
                        <div className="appointment-info">
                          <div className="appointment-id">
                            {cellStatus.appointment.id}
                          </div>
                          <div className="customer-name">
                            {cellStatus.appointment.customerName}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color cell-no-schedule"></div>
          <span>Không có ca làm</span>
        </div>
        <div className="legend-item">
          <div className="legend-color cell-available"></div>
          <span>Ca làm trống</span>
        </div>
        <div className="legend-item">
          <div className="legend-color cell-unaccepted"></div>
          <span>Chờ xác nhận</span>
        </div>
        <div className="legend-item">
          <div className="legend-color cell-accepted"></div>
          <span>Đã xác nhận</span>
        </div>
        <div className="legend-item">
          <div className="legend-color cell-done"></div>
          <span>Đã hoàn thành</span>
        </div>
      </div>

      {showModal && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setShowModal(false)}
          onAccept={handleAcceptAppointment}
          onReject={handleRejectAppointment}
          onDone={handleDoneAppointment}
        />
      )}
    </div>
  );
};

export default ConsultantAppointment;
