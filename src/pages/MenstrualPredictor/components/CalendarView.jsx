import { Card, Tooltip } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import './CalendarView.css';

const CalendarView = ({
  month,
  year,
  setMonth,
  setYear,
  periodDays,
  ovulationDays,
}) => {
  const today = new Date();

  const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

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

  const getDayClass = (day) => {
    if (!day) return '';
    let classes = 'calendar-day normal';

    if (periodDays.includes(day)) classes += ' period';
    if (ovulationDays.includes(day)) classes += ' ovulation';

    // Highlight today
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    if (isToday) classes += ' today';

    return classes;
  };

  return (
    <Card
      className="calendar-card"
      title={
        <div
          style={{
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          <CalendarOutlined style={{ marginRight: '8px' }} />
          Lịch Kinh Nguyệt
        </div>
      }
    >
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
            <Tooltip
              key={idx}
              title={
                day && periodDays.includes(day)
                  ? 'Ngày hành kinh'
                  : day && ovulationDays.includes(day)
                    ? 'Ngày rụng trứng'
                    : day
                      ? `${day}/${month + 1}/${year}`
                      : ''
              }
            >
              <div className={getDayClass(day)}>{day || ''}</div>
            </Tooltip>
          ))}
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color period"></div>
            <span>Kỳ hành kinh</span>
          </div>
          <div className="legend-item">
            <div className="legend-color ovulation"></div>
            <span>Ngày rụng trứng</span>
          </div>
          <div className="legend-item">
            <div className="legend-color today"></div>
            <span>Hôm nay</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CalendarView;
