import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabSchedule.css';

const LabSchedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Mock data cho lịch xét nghiệm - trong thực tế sẽ lấy từ API
  const [schedules, setSchedules] = useState({});

  useEffect(() => {
    // Mock data - trong thực tế sẽ fetch từ API
    const mockSchedules = {};
    const today = new Date();

    // Tạo lịch cho 14 ngày tới
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      // Randomly mark some slots as unavailable
      const morningAvailable = Math.random() > 0.3;
      const afternoonAvailable = Math.random() > 0.3;

      mockSchedules[dateStr] = {
        morning: morningAvailable,
        afternoon: afternoonAvailable,
      };
    }

    setSchedules(mockSchedules);
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(''); // Reset time slot khi chọn ngày mới
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTimeSlot) {
      // Lưu thông tin đã chọn vào sessionStorage hoặc context
      sessionStorage.setItem(
        'selectedSchedule',
        JSON.stringify({
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          formattedDate: formatDate(selectedDate),
        })
      );

      navigate('/chon-xet-nghiem');
    }
  };

  const availableDates = Object.keys(schedules).filter((date) => {
    const schedule = schedules[date];
    return schedule.morning || schedule.afternoon;
  });

  return (
    <div className="lab-schedule">
      <div className="header">
        <button className="back-button" onClick={() => navigate('/dich-vu')}>
          ← Quay lại
        </button>
        <h1>Chọn lịch xét nghiệm</h1>
        <p>Vui lòng chọn ngày và buổi phù hợp</p>
      </div>

      <div className="schedule-container">
        <div className="date-selection">
          <h3>Chọn ngày</h3>
          <div className="date-grid">
            {availableDates.map((date) => (
              <div
                key={date}
                className={`date-item ${selectedDate === date ? 'selected' : ''}`}
                onClick={() => handleDateSelect(date)}
              >
                <div className="date-number">{new Date(date).getDate()}</div>
                <div className="date-text">
                  {new Date(date).toLocaleDateString('vi-VN', {
                    weekday: 'short',
                    month: 'short',
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedDate && (
          <div className="time-selection">
            <h3>Chọn buổi</h3>
            <div className="time-slots">
              <div
                className={`time-slot ${!schedules[selectedDate]?.morning ? 'disabled' : ''} ${selectedTimeSlot === 'morning' ? 'selected' : ''}`}
                onClick={() =>
                  schedules[selectedDate]?.morning &&
                  handleTimeSlotSelect('morning')
                }
              >
                <div className="time-icon">🌅</div>
                <div className="time-info">
                  <div className="time-title">Buổi sáng</div>
                  <div className="time-range">7:00 - 11:00</div>
                  {!schedules[selectedDate]?.morning && (
                    <div className="unavailable">Hết chỗ</div>
                  )}
                </div>
              </div>

              <div
                className={`time-slot ${!schedules[selectedDate]?.afternoon ? 'disabled' : ''} ${selectedTimeSlot === 'afternoon' ? 'selected' : ''}`}
                onClick={() =>
                  schedules[selectedDate]?.afternoon &&
                  handleTimeSlotSelect('afternoon')
                }
              >
                <div className="time-icon">🌆</div>
                <div className="time-info">
                  <div className="time-title">Buổi chiều</div>
                  <div className="time-range">13:00 - 17:00</div>
                  {!schedules[selectedDate]?.afternoon && (
                    <div className="unavailable">Hết chỗ</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedDate && selectedTimeSlot && (
          <div className="selection-summary">
            <h3>Lịch đã chọn</h3>
            <div className="summary-info">
              <p>
                <strong>Ngày:</strong> {formatDate(selectedDate)}
              </p>
              <p>
                <strong>Buổi:</strong>{' '}
                {selectedTimeSlot === 'morning'
                  ? 'Sáng (7:00 - 11:00)'
                  : 'Chiều (13:00 - 17:00)'}
              </p>
            </div>
            <button className="continue-button" onClick={handleContinue}>
              Tiếp tục chọn xét nghiệm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabSchedule;
