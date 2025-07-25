import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './DoctorSchedule.css';

const API_BASE = 'http://localhost:3000';
const DoctorSchedule = ({ doctor, onSlotSelect, onBack }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [filtersPatterns, setFiltersPatterns] = useState([]);

  const accountId = Cookies.get('accountId');
  const token = Cookies.get('accessToken');

  // Chỉ lấy tuần hiện tại
  // const currentWeek = new Date();

  // Mock data cho lịch khám (true = available, false = booked)
  // const generateMockSchedule = () => {
  //   const schedule = {};
  //   const timeSlots = [
  //     '08:00',
  //     '09:00',
  //     '10:00',
  //     '11:00',
  //     '14:00',
  //     '15:00',
  //     '16:00',
  //     '17:00',
  //   ];

  //   // Chỉ tạo lịch cho tuần hiện tại
  //   for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
  //     const date = new Date(currentWeek);
  //     date.setDate(date.getDate() - date.getDay() + dayOffset);
  //     const dateKey = date.toISOString().split('T')[0];

  //     schedule[dateKey] = {};

  //     timeSlots.forEach((time) => {
  //       // Random availability (70% available)
  //       schedule[dateKey][time] = Math.random() > 0.3;
  //     });
  //   }

  //   return schedule;
  // };

  // 1. State tuần

  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - now.getDay()); // CN là 0
    // start.setHours(0, 0, 0, 0); // Giờ local
    return start;
  });

  // 2. Hàm chuyển tuần
  const changeWeek = (offset) => {
    setWeekStart((prev) => {
      const newStart = new Date(prev);
      newStart.setDate(newStart.getDate() + offset * 7);
      return newStart;
    });
  };

  // 3. Lấy ngày trong tuần
  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    console.log('dates: ', dates);

    return dates;
  };

  const formatTime = (rawStart) => {
    if (!rawStart) {
      console.log('Raw start is null/undefined:', rawStart);
      return '';
    }
    const timeStr = rawStart.length === 5 ? rawStart + ':00' : rawStart;
    return timeStr.slice(0, 5);
  };

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/working-slot/get-slot-by-type/1`
        );
        console.log('Slot Response:', response.data.result);
        // setTimeSlots(response.data.result || []);
        const workingSlots = response.data.result
        const slotTimes = Array.from(
          new Set(
            workingSlots.map((workingSlot) => {
              const rawStart = workingSlot.start_at;
              // return formatTime(rawStart);
              return rawStart;
            })
          )
        ).sort();
        setTimeSlots(slotTimes);
      } catch (error) {
        console.error("Error fetching Slot:", error);
        return;
      }
    }
    const fetchSchedule = async () => {
      // const token = Cookies.get('accessToken');
      try {
        console.log(doctor);
        console.log('weekStart: ', weekStart.toLocaleDateString('vi-VN'));

        const response = await axios.get(
          `${API_BASE}/consultant-pattern/get-all-consultant-patterns-by-week`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              consultant_id: doctor.account_id,
              weekStartDate: weekStart.toISOString().split('T')[0],
            },
          }
        );

        let data = response.data.result;
        if (!data) {
          setSchedule({});
          return;
        }

        if (!Array.isArray(data)) {
          data = [data];
        }

        // Lọc slot theo tuần đang chọn
        const weekDates = getWeekDates().map(
          (d) => d.toISOString().split('T')[0]
        );
        const filteredData = data.filter((pattern) =>
          weekDates.includes(pattern.date.split('T')[0])
        );

        const newSchedule = {};

        for (const pattern of filteredData) {
          const dateKey = pattern.date.split('T')[0];

          const start = pattern.working_slot.start_at;
          // console.log('rawStart: ', rawStart);
          // const start = formatTime(pattern.working_slot.start_at);

          console.log('Pattern:', pattern);
          const isBooked = pattern.is_booked;
          if (dateKey && start) {
            if (!newSchedule[dateKey]) {
              newSchedule[dateKey] = {};
            }
            if (isBooked === true) {
              newSchedule[dateKey][start] = false;
            } else {
              if (newSchedule[dateKey][start] !== false) {
                newSchedule[dateKey][start] = true;
              }
              // newSchedule[dateKey][start] = true;
            }
          }
        }
        setFiltersPatterns(filteredData);
        setSchedule(newSchedule);
        // console.log('Processed schedule:', newSchedule);

        // Sau khi có filteredData

        // console.log('Final timeSlots:', slotTimes);
        fetchTimeSlots();
      } catch (err) {
        console.error('Lỗi khi lấy lịch bác sĩ:', err);
      }
    };

    fetchSchedule();
  }, [doctor.account_id, weekStart]);

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };
  // Đã xóa navigation giữa các tuần - chỉ hiển thị tuần hiện tại

  const handleSlotClick = (date, time) => {
    const dateKey = date.toISOString().split('T')[0];
    const selectedPattern = filtersPatterns.find(
      (pattern) =>
        new Date(pattern.date).toLocaleDateString('en-CA') === dateKey &&
        pattern.working_slot.start_at === time
    );
    if (schedule[dateKey] && schedule[dateKey][time]) {
      const slot = {
        date: date,
        start_at: selectedPattern.working_slot.start_at,
        end_at: selectedPattern.working_slot.end_at,
        dateString: date.toLocaleDateString('vi-VN', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        customer_id: accountId,
        pattern_id: selectedPattern.pattern_id,
      };
      setSelectedSlot(slot);
    }
  };

  const confirmSlot = () => {
    if (selectedSlot) {
      onSlotSelect(selectedSlot);
    }
  };

  return (
    <div className="doctor-schedule">
      <div className="schedule-header">
        <button className="back-button" onClick={onBack}>
          ← Quay lại danh sách bác sĩ
        </button>

        <div className="doctor-info-header">
          <div className="doctor-avatar-header">
            <img src={doctor.avatar} alt={doctor.full_name} />
            <div className="online-indicator"></div>
          </div>
          <div className="doctor-details">
            <h2>{doctor.full_name}</h2>
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
          <button className="nav-button" onClick={() => changeWeek(-1)}>
            ← Tuần trước
          </button>
          <h3 className="week-title">
            Lịch tuần này ({formatDate(getWeekDates()[0])} -{' '}
            {formatDate(getWeekDates()[6])})
          </h3>
          <button className="nav-button" onClick={() => changeWeek(1)}>
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
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
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
                    schedule[dateKey] && schedule[dateKey][time] === true;
                  const isBooked =
                    schedule[dateKey] && schedule[dateKey][time] === false;
                  const isSelected =
                    selectedSlot &&
                    selectedSlot.date.toDateString() === date.toDateString() &&
                    selectedSlot.start_at === time;

                  console.log(
                    `Date: ${dateKey}, Time: ${time}, Available: ${isAvailable}, Booked: ${isBooked}`
                  );

                  return (
                    <div
                      key={time}
                      className={`schedule-slot ${isPast
                        ? 'past'
                        : isAvailable
                          ? 'available'
                          : isBooked
                            ? 'booked'
                            : 'no-slot'
                        } ${isSelected ? 'selected' : ''}`}
                      onClick={() =>
                        !isPast && isAvailable && handleSlotClick(date, time)
                      }
                      title={
                        isPast
                          ? 'Đã qua'
                          : isAvailable
                            ? 'Còn trống - Click để chọn'
                            : isBooked
                              ? 'Đã được đặt'
                              : ''
                      }
                    >
                      {isPast
                        ? '⏰'
                        : isAvailable
                          ? '✅'
                          : isBooked
                            ? '❌'
                            : ''}
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
                <strong>Bác sĩ:</strong> {doctor.full_name}
              </p>
              <p>
                <strong>Ngày:</strong> {selectedSlot.dateString}
              </p>
              <p>
                <strong>Giờ:</strong>{' '}
                {selectedSlot.start_at && selectedSlot.end_at
                  ? `${formatTime(selectedSlot.start_at)} - ${formatTime(selectedSlot.end_at)}`
                  : ''}
              </p>
              <p>
                <strong>Phí tư vấn: {formatPrice(doctor.price)}</strong>{' '}
                {/* {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(doctor.price)} */}
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
