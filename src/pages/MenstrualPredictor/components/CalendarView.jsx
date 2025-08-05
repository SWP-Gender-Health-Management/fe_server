import React, { useState } from 'react';
import { Card, Tooltip, Button } from 'antd';
import {
  CalendarOutlined,
  HeartOutlined,
  FireOutlined,
  StarOutlined,
  LeftOutlined,
  RightOutlined,
  EditOutlined,
} from '@ant-design/icons';
import './CalendarView.css';

const CalendarView = ({
  month,
  year,
  setMonth,
  setYear,
  periodDays,
  ovulationDays,
  onDayClick,
  onUpdateClick,
}) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const today = new Date();

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

  const numDays = daysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);

  // Tạo mảng ngày với padding để đảm bảo luôn có 7 cột
  const totalCells = Math.ceil((firstDay + numDays) / 7) * 7;
  const days = [];

  // Thêm các ô trống cho ngày đầu tháng
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Thêm các ngày trong tháng
  for (let i = 1; i <= numDays; i++) {
    days.push(i);
  }

  // Thêm các ô trống để hoàn thành grid 7 cột
  while (days.length < totalCells) {
    days.push(null);
  }

  // Debug: Kiểm tra số lượng ngày và cột
  console.log('Calendar Debug:', {
    month,
    year,
    firstDay,
    numDays,
    totalCells,
    daysLength: days.length,
    dayNamesLength: dayNames.length,
    dayNames: dayNames.slice(0, 7)
  });

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
    if (!day) return 'calendar-day-menstrual empty';

    let classes = 'calendar-day-menstrual';

    // Check if it's today
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    // Check for special days
    const isPeriod = periodDays.includes(day);
    const isOvulation = ovulationDays.includes(day);

    if (isPeriod) classes += ' period-day-menstrual';
    else if (isOvulation) classes += ' ovulation-day-menstrual';
    else classes += ' normal-day-menstrual';

    if (isToday) classes += ' today-menstrual';
    if (selectedDay === day) classes += ' selected-menstrual';

    return classes;
  };

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDay(selectedDay === day ? null : day);
      if (onDayClick) {
        onDayClick(day);
      }
    }
  };

  const getTooltipContent = (day) => {
    if (!day) return '';

    const date = `${day}/${month + 1}/${year}`;
    const isPeriod = periodDays.includes(day);
    const isOvulation = ovulationDays.includes(day);
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    if (isPeriod) {
      return (
        <div className="tooltip-content-menstrual">
          <div className="tooltip-title-menstrual period-tooltip">
            <HeartOutlined /> Ngày hành kinh
          </div>
          <div className="tooltip-date-menstrual">{date}</div>
        </div>
      );
    }

    if (isOvulation) {
      return (
        <div className="tooltip-content-menstrual">
          <div className="tooltip-title-menstrual ovulation-tooltip">
            <FireOutlined /> Ngày rụng trứng
          </div>
          <div className="tooltip-date-menstrual">{date}</div>
        </div>
      );
    }

    if (isToday) {
      return (
        <div className="tooltip-content-menstrual">
          <div className="tooltip-title-menstrual today-tooltip">
            <StarOutlined /> Hôm nay
          </div>
          <div className="tooltip-date-menstrual">{date}</div>
        </div>
      );
    }

    return date;
  };

  return (
    <div className="calendar-container-menstrual">
      <Card className="calendar-card-menstrual">
        {/* Header */}
        <div className="calendar-header-menstrual">
          <div className="calendar-title-menstrual">
            <CalendarOutlined className="calendar-icon-menstrual" />
            <span>Lịch Kinh Nguyệt</span>
          </div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={onUpdateClick}
            className="calendar-update-button-menstrual"
          >
            Cập Nhật
          </Button>
        </div>

        {/* Navigation */}
        <div className="calendar-nav-menstrual">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={prevMonth}
            className="nav-button-menstrual"
          />
          <div className="month-year-menstrual">
            <span className="month-name">{monthNames[month]}</span>
            <span className="year-number">{year}</span>
          </div>
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={nextMonth}
            className="nav-button-menstrual"
          />
        </div>

        {/* Calendar Grid - Cấu trúc table tương tự DoctorSchedule */}
        <div className="calendar-grid-menstrual">
          {/* Day headers - Đảm bảo chỉ hiển thị 7 ngày */}
          {dayNames.slice(0, 7).map((dayName) => (
            <div key={dayName} className="day-header-menstrual">
              <div className="day-name-menstrual">{dayName}</div>
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, idx) => (
            <Tooltip
              key={idx}
              title={getTooltipContent(day)}
              placement="top"
              overlayClassName="calendar-tooltip-menstrual"
            >
              <div
                className={getDayClass(day)}
                onClick={() => handleDayClick(day)}
              >
                {day || ''}
              </div>
            </Tooltip>
          ))}
        </div>

        {/* Legend */}
        <div className="calendar-legend-menstrual">
          <div className="legend-item-menstrual">
            <div className="legend-dot-menstrual period-dot-menstrual"></div>
            <span>Kỳ hành kinh</span>
          </div>
          <div className="legend-item-menstrual">
            <div className="legend-dot-menstrual ovulation-dot-menstrual"></div>
            <span>Ngày rụng trứng</span>
          </div>
          <div className="legend-item-menstrual">
            <div className="legend-dot-menstrual today-dot-menstrual "></div>
            <span>Hôm nay</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CalendarView;
