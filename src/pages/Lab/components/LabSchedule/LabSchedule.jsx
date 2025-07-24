import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabSchedule.css';
import { getLabSlotsByDate } from '@/api/labApi';

const LabSchedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [selectedSession, setSelectedSession] = useState(null);
  const [slots, setSlots] = useState({});
  const [month, setMonth] = useState(new Date().getMonth());
  const [year] = useState(new Date().getFullYear());

  // Helper: lấy số ngày trong tháng
  const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  // Helper: lấy thứ của ngày đầu tháng (0=CN, 1=T2,...)
  const firstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

  // Tạo mảng ngày cho tháng hiện tại
  const generateMonthDates = () => {
    const days = [];
    const totalDays = daysInMonth(month, year);
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  useEffect(() => {
    const fetchSlots = async () => {
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate());
      const dateStr = `${yyyy}-${mm}-${dd}`;
      try {
        const res = await getLabSlotsByDate(dateStr);
        // Lấy đúng data mới
        const result = res.data.data || {};
        setSlots({
          morning: result.morning || { isFull: true, slot: null },
          afternoon: result.afternoon || { isFull: true, slot: null },
        });
      } catch (error) {
        // setSlots({
        //   morning: { isFull: false, slot: { slot_id: 'mock-morning', start_at: '07:00:00', end_at: '12:00:00' } },
        //   afternoon: { isFull: false, slot: { slot_id: 'mock-afternoon', start_at: '13:00:00', end_at: '18:00:00' } }
        // });
      }
    };
    fetchSlots();
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSession(null);
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
  };

  const handleContinue = () => {
    const session = selectedSession || 'morning';
    const slotInfo = getSlotInfo(session);
    const sessionTime = slotInfo.slot
      ? `${slotInfo.slot.start_at} - ${slotInfo.slot.end_at}`
      : session === 'morning'
        ? '07:00 - 11:00'
        : '13:00 - 17:00';
    const sessionName = session === 'morning' ? 'Sáng' : 'Chiều';
    sessionStorage.setItem(
      'labSchedule',
      JSON.stringify({
        date: selectedDate.toISOString(),
        session: session,
        sessionTime: sessionTime,
        sessionName: sessionName,
        slotId: slotInfo.slot ? slotInfo.slot.slot_id : null,
        dateString: selectedDate.toLocaleDateString('vi-VN', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      })
    );
    navigate('/chon-xet-nghiem');
  };

  // Helper: lấy slot info cho từng ca
  const getSlotInfo = (session) => {
    if (!slots) return { isFull: true, slot: null };
    if (session === 'morning')
      return slots.morning || { isFull: true, slot: null };
    if (session === 'afternoon')
      return slots.afternoon || { isFull: true, slot: null };
    return { isFull: true, slot: null };
  };

  return (
    <div className="lab-schedule">
      <div className="lab-schedule-header">
        <button className="back-button" onClick={() => navigate('/dich-vu')}>
          ← Quay lại dịch vụ
        </button>
        <h1>Đặt lịch xét nghiệm</h1>
        <p>Chọn ngày và ca làm việc trong tháng</p>
        <div className="month-switcher">
          <button
            onClick={() => setMonth((prev) => (prev === 0 ? 11 : prev - 1))}
          >
            ◀ Tháng trước
          </button>
          <span style={{ margin: '0 12px', fontWeight: 600 }}>
            {`Tháng ${month + 1} / ${year}`}
          </span>
          <button
            onClick={() => setMonth((prev) => (prev === 11 ? 0 : prev + 1))}
          >
            Tháng sau ▶
          </button>
        </div>
      </div>

      <div className="schedule-container">
        {/* Date Selection - Month View */}
        <div className="date-selection">
          <h3>Chọn ngày xét nghiệm (Tháng này)</h3>
          <div className="month-grid">
            {/* Hiển thị các thứ trong tuần */}
            <div className="weekdays-row">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
                <div key={d} className="weekday-cell">
                  {d}
                </div>
              ))}
            </div>
            {/* Hiển thị các ngày trong tháng */}
            {(() => {
              const days = generateMonthDates();
              const firstDay = firstDayOfMonth(month, year);
              const blanks = firstDay === 0 ? 6 : firstDay - 1; // Đưa CN về cuối tuần
              const cells = [];
              for (let i = 0; i < blanks; i++) {
                cells.push(
                  <div key={`blank-${i}`} className="date-cell blank"></div>
                );
              }
              days.forEach((date) => {
                const isSelected =
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString();
                const isToday =
                  date.toDateString() === new Date().toDateString();
                cells.push(
                  <div
                    key={date.toISOString()}
                    className={`date-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDateSelect(date)}
                  >
                    <div className="day-number">{date.getDate()}</div>
                  </div>
                );
              });
              return <div className="month-days-grid">{cells}</div>;
            })()}
          </div>
        </div>

        {/* Session Selection */}
        {selectedDate && (
          <div className="session-selection">
            <h3>Chọn ca làm việc</h3>
            <div className="sessions">
              {/* Morning Session */}
              {['morning', 'afternoon'].map((session) => {
                const slotInfo = getSlotInfo(session);
                const isAvailable = !slotInfo.isFull;
                return (
                  <div
                    key={session}
                    className={`session-card ${isAvailable ? 'available' : 'unavailable'} ${selectedSession === session ? 'selected' : ''}`}
                    onClick={() => isAvailable && handleSessionSelect(session)}
                  >
                    <div className="session-icon">
                      {session === 'morning' ? '🌅' : '🌇'}
                    </div>
                    <div className="session-info">
                      <h4>{session === 'morning' ? 'Ca sáng' : 'Ca chiều'}</h4>
                      <p className="session-time">
                        {slotInfo.slot
                          ? `${slotInfo.slot.start_at} - ${slotInfo.slot.end_at}`
                          : session === 'morning'
                            ? '07:00 - 11:00'
                            : '13:00 - 17:00'}
                      </p>
                      {!isAvailable && (
                        <p className="unavailable-text">Đã đầy</p>
                      )}
                    </div>
                  </div>
                );
              })}
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
