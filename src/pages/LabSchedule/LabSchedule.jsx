import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabSchedule.css';

const LabSchedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [availability, setAvailability] = useState({});

  // Generate dates for current week (7 days starting from today)
  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  // Generate mock availability for sessions
  const generateAvailability = () => {
    const slots = {};
    const dates = generateWeekDates();

    dates.forEach((date) => {
      const dateKey = date.toISOString().split('T')[0];
      slots[dateKey] = {
        morning: {
          available: Math.random() > 0.2, // 80% availability
          slots: 15, // Available slots
        },
        afternoon: {
          available: Math.random() > 0.2,
          slots: 12,
        },
      };
    });

    return slots;
  };

  useEffect(() => {
    setAvailability(generateAvailability());
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSession(null);
  };

  const handleSessionSelect = (session) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    if (availability[dateKey] && availability[dateKey][session].available) {
      setSelectedSession(session);
    }
  };

  const handleContinue = () => {
    if (selectedDate && selectedSession) {
      // Save to sessionStorage
      const sessionTime =
        selectedSession === 'morning' ? '07:00 - 11:00' : '13:00 - 17:00';
      const sessionName = selectedSession === 'morning' ? 'Sáng' : 'Chiều';

      sessionStorage.setItem(
        'labSchedule',
        JSON.stringify({
          date: selectedDate.toISOString(),
          session: selectedSession,
          sessionTime: sessionTime,
          sessionName: sessionName,
          dateString: selectedDate.toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
        })
      );

      navigate('/chon-xet-nghiem');
    }
  };

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

  const dates = generateWeekDates();
  const selectedDateKey = selectedDate
    ? selectedDate.toISOString().split('T')[0]
    : null;

  return (
    <div className="lab-schedule">
      <div className="lab-schedule-header">
        <button className="back-button" onClick={() => navigate('/dich-vu')}>
          ← Quay lại dịch vụ
        </button>
        <h1>Đặt lịch xét nghiệm</h1>
        <p>Chọn ngày và ca làm việc trong tuần này</p>
      </div>

      <div className="schedule-container">
        {/* Date Selection - Week View */}
        <div className="date-selection">
          <h3>Chọn ngày xét nghiệm (Tuần này)</h3>
          <div className="week-dates">
            {dates.map((date, index) => {
              const isSelected =
                selectedDate &&
                date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  className={`date-card ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => handleDateSelect(date)}
                >
                  <div className="day-name">{formatDayName(date)}</div>
                  <div className="day-date">{formatDate(date)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session Selection */}
        {selectedDate && (
          <div className="session-selection">
            <h3>Chọn ca làm việc</h3>
            <div className="sessions">
              {/* Morning Session */}
              <div
                className={`session-card ${
                  availability[selectedDateKey]?.morning.available
                    ? 'available'
                    : 'unavailable'
                } ${selectedSession === 'morning' ? 'selected' : ''}`}
                onClick={() => handleSessionSelect('morning')}
              >
                <div className="session-icon">🌅</div>
                <div className="session-info">
                  <h4>Ca sáng</h4>
                  <p className="session-time">07:00 - 11:00</p>
                  {availability[selectedDateKey]?.morning.available ? (
                    <p className="availability">
                      Còn {availability[selectedDateKey].morning.slots} slot
                    </p>
                  ) : (
                    <p className="unavailable-text">Đã đầy</p>
                  )}
                </div>
              </div>

              {/* Afternoon Session */}
              <div
                className={`session-card ${
                  availability[selectedDateKey]?.afternoon.available
                    ? 'available'
                    : 'unavailable'
                } ${selectedSession === 'afternoon' ? 'selected' : ''}`}
                onClick={() => handleSessionSelect('afternoon')}
              >
                <div className="session-icon">🌇</div>
                <div className="session-info">
                  <h4>Ca chiều</h4>
                  <p className="session-time">13:00 - 17:00</p>
                  {availability[selectedDateKey]?.afternoon.available ? (
                    <p className="availability">
                      Còn {availability[selectedDateKey].afternoon.slots} slot
                    </p>
                  ) : (
                    <p className="unavailable-text">Đã đầy</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selection Summary */}
        {selectedDate && selectedSession && (
          <div className="selection-summary">
            <div className="summary-card">
              <h4>📋 Thông tin đã chọn</h4>
              <p>
                <strong>Ngày:</strong>{' '}
                {selectedDate.toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
              <p>
                <strong>Ca:</strong>{' '}
                {selectedSession === 'morning'
                  ? 'Sáng (07:00 - 11:00)'
                  : 'Chiều (13:00 - 17:00)'}
              </p>
            </div>

            <button className="continue-button" onClick={handleContinue}>
              Tiếp tục chọn xét nghiệm →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabSchedule;
