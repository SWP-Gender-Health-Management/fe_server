import { useState, useEffect } from 'react';
import axios from 'axios';
import './MenstrualPredictorPage.css';

const MenstrualTracker = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [lastPeriodStart, setLastPeriodStart] = useState('2024-01-05');

  const [nextStartDate, setNextStartDate] = useState(null);
  const [ovulationDate, setOvulationDate] = useState(null);
  const [fertileRange, setFertileRange] = useState({ start: null, end: null });

  const accountId = localStorage.getItem('account_id');
  const token = localStorage.getItem('token');

  const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

  const calculatePeriodDays = () => {
    const periodDaysMap = {};
    const start = new Date(lastPeriodStart);
    const end = new Date(year + 1, 11, 31);
    let current = new Date(start);

    while (current <= end) {
      const monthKey = `${current.getFullYear()}-${current.getMonth()}`;
      for (let i = 0; i < periodLength; i++) {
        const day = new Date(current);
        day.setDate(current.getDate() + i);
        if (day.getMonth() === current.getMonth()) {
          if (!periodDaysMap[monthKey]) periodDaysMap[monthKey] = [];
          periodDaysMap[monthKey].push(day.getDate());
        }
      }
      current.setDate(current.getDate() + cycleLength);
    }
    return periodDaysMap;
  };

  const periodDaysMap = calculatePeriodDays();
  const key = `${year}-${month}`;
  const periodDays = periodDaysMap[key] || [];

  const numDays = daysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);

  const days = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: numDays }, (_, i) => i + 1)
  );

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleUpdate = async () => {
    try {
      // 1. Track kỳ kinh mới
      await axios.post(
        '/customer/track-period',
        {
          account_id: accountId,
          period: periodLength,
          start_date: lastPeriodStart,
          end_date: lastPeriodStart, // bạn có thể sửa logic nếu có ngày kết thúc thật
          note: 'Tự động nhập từ frontend',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2. Gọi dự đoán kỳ kinh kế tiếp
      const res = await axios.get(
        `/customer/predict-period?account_id=${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data.data;
      setNextStartDate(new Date(data.next_start_date));
      const ovulation = new Date(data.next_start_date);
      ovulation.setDate(ovulation.getDate() - 14);
      setOvulationDate(ovulation);

      const fertileStart = new Date(ovulation);
      fertileStart.setDate(fertileStart.getDate() - 2);
      const fertileEnd = new Date(ovulation);
      fertileEnd.setDate(fertileEnd.getDate() + 2);
      setFertileRange({ start: fertileStart, end: fertileEnd });
    } catch (err) {
      console.error('Error tracking or predicting period:', err);
    }
  };

  useEffect(() => {
    if (accountId && token) {
      handleUpdate();
    }
  }, [lastPeriodStart, cycleLength, periodLength]);

  return (
    <div className="menstrual-tracker-wrapper">
      <div className="menstrual-calendar">
        <div className="menstrual-nav">
          <button onClick={prevMonth} className="menstrual-button">
            ◀
          </button>
          <h2 className="menstrual-header">
            Tháng {month + 1} {year}
          </h2>
          <button onClick={nextMonth} className="menstrual-button">
            ▶
          </button>
        </div>

        <div className="calendar-grid">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
            <div key={d} className="calendar-day calendar-header">
              {d}
            </div>
          ))}
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`calendar-day ${periodDays.includes(day) ? 'period' : day ? 'normal' : ''}`}
            >
              {day || ''}
            </div>
          ))}
        </div>

        <div className="info-box">
          <label>
            Kì kinh gần nhất:
            <input
              type="date"
              value={lastPeriodStart}
              onChange={(e) => setLastPeriodStart(e.target.value)}
            />
          </label>
          <label>
            Chu kì (ngày):
            <input
              type="number"
              value={cycleLength}
              onChange={(e) => setCycleLength(parseInt(e.target.value))}
              min={20}
              max={40}
            />
          </label>
          <label>
            Số ngày hành kinh:
            <input
              type="number"
              value={periodLength}
              onChange={(e) => setPeriodLength(parseInt(e.target.value))}
              min={1}
              max={10}
            />
          </label>

          <p>
            <strong>Kì kinh gần nhất:</strong>{' '}
            {new Date(lastPeriodStart).toLocaleDateString()}
          </p>
          {nextStartDate && (
            <p>
              <strong>Kì kinh tiếp theo (API):</strong>{' '}
              {nextStartDate.toLocaleDateString()}
            </p>
          )}
          {ovulationDate && (
            <p>
              <strong>Ngày rụng trứng:</strong>{' '}
              {ovulationDate.toLocaleDateString()}
            </p>
          )}
          {fertileRange.start && (
            <p>
              <strong>Thời kì dễ thụ thai:</strong>{' '}
              {fertileRange.start.toLocaleDateString()} -{' '}
              {fertileRange.end.toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="highlight-box">
          Độ dài chu kì trung bình: {cycleLength} ngày
          <br />
          Độ dài kì kinh trung bình: {periodLength} ngày
        </div>
      </div>
    </div>
  );
};

export default MenstrualTracker;
