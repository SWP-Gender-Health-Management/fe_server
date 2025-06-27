import React, { useState, useEffect } from 'react';
import './DoctorSchedule.css';

const DoctorSchedule = ({ doctor, onSlotSelect, onBack }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [schedule, setSchedule] = useState({});

  // Mock data cho lịch khám (true = available, false = booked)
  const generateMockSchedule = () => {
    const schedule = {};
    const timeSlots = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ];

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(currentWeek);
      date.setDate(date.getDate() - date.getDay() + dayOffset);
      const dateKey = date.toISOString().split('T')[0];

      schedule[dateKey] = {};

      timeSlots.forEach((time) => {
        // Random availability (70% available)
        schedule[dateKey][time] = Math.random() > 0.3;
      });
    }

    return schedule;
  };

  useEffect(() => {
    setSchedule(generateMockSchedule());
  }, [currentWeek]);

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

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
    setSelectedSlot(null);
  };

  const handleSlotClick = (date, time) => {
    const dateKey = date.toISOString().split('T')[0];

    if (schedule[dateKey] && schedule[dateKey][time]) {
      const slot = {
        date: date,
        time: time,
        dateString: date.toLocaleDateString('vi-VN', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      };
      setSelectedSlot(slot);
    }
  };

  const confirmSlot = () => {
    if (selectedSlot) {
      onSlotSelect(selectedSlot);
    }
  };

  const getWeekRange = () => {
    const dates = getWeekDates();
    const start = formatDate(dates[0]);
    const end = formatDate(dates[6]);
    return `${start} - ${end}`;
  };

  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  return (
    <div className="doctor-schedule">
      <div className="schedule-header">
        <button className="back-button" onClick={onBack}>
          ← Quay lại danh sách bác sĩ
        </button>

        <div className="doctor-info-header">
          <div className="doctor-avatar-header">
            <img src={doctor.avatar} alt={doctor.name} />
            <div className="online-indicator"></div>
          </div>
          <div className="doctor-details">
            <h2>{doctor.name}</h2>
            <p className="specialty">🩺 {doctor.specialty}</p>
            <div className="rating-price">
              <span className="rating">⭐ {doctor.rating}/5</span>
              <span className="price">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(doctor.price)}
                /buổi
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="schedule-content">
        <div className="week-navigation">
          <button className="nav-button" onClick={() => navigateWeek(-1)}>
            ← Tuần trước
          </button>

          <h3 className="week-title">Tuần {getWeekRange()}</h3>

          <button className="nav-button" onClick={() => navigateWeek(1)}>
            Tuần sau →
          </button>
        </div>

        <div className="schedule-grid">
          <div className="time-column">
            <div className="time-header">Giờ</div>
            {timeSlots.map((time) => (
              <div key={time} className="time-slot">
                {time}
              </div>
            ))}
          </div>

          {getWeekDates().map((date, dayIndex) => {
            const dateKey = date.toISOString().split('T')[0];
            const isToday = date.toDateString() === new Date().toDateString();
            const isPast = date < new Date().setHours(0, 0, 0, 0);

            return (
              <div
                key={dayIndex}
                className={`day-column ${isPast ? 'past-day' : ''}`}
              >
                <div className={`day-header ${isToday ? 'today' : ''}`}>
                  <div className="day-name">{formatDayName(date)}</div>
                  <div className="day-date">{formatDate(date)}</div>
                </div>

                {timeSlots.map((time) => {
                  const isAvailable =
                    schedule[dateKey] && schedule[dateKey][time];
                  const isSelected =
                    selectedSlot &&
                    selectedSlot.date.toDateString() === date.toDateString() &&
                    selectedSlot.time === time;

                  return (
                    <div
                      key={time}
                      className={`schedule-slot ${
                        isPast ? 'past' : isAvailable ? 'available' : 'booked'
                      } ${isSelected ? 'selected' : ''}`}
                      onClick={() => !isPast && handleSlotClick(date, time)}
                      title={
                        isPast
                          ? 'Đã qua'
                          : isAvailable
                            ? 'Còn trống - Click để chọn'
                            : 'Đã được đặt'
                      }
                    >
                      {isPast ? '⏰' : isAvailable ? '✅' : '❌'}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="legend">
          <div className="legend-item">
            <span className="legend-icon available">✅</span>
            <span>Còn trống</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon booked">❌</span>
            <span>Đã được đặt</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon past">⏰</span>
            <span>Đã qua</span>
          </div>
        </div>

        {selectedSlot && (
          <div className="selected-slot-info">
            <div className="slot-details">
              <h4>Lịch đã chọn:</h4>
              <p>
                <strong>Bác sĩ:</strong> {doctor.name}
              </p>
              <p>
                <strong>Ngày:</strong> {selectedSlot.dateString}
              </p>
              <p>
                <strong>Giờ:</strong> {selectedSlot.time} -{' '}
                {String(parseInt(selectedSlot.time.split(':')[0]) + 1).padStart(
                  2,
                  '0'
                )}
                :00
              </p>
              <p>
                <strong>Phí tư vấn:</strong>{' '}
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(doctor.price)}
              </p>
            </div>

            <button className="confirm-button" onClick={confirmSlot}>
              Tiếp tục đặt lịch →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSchedule;
