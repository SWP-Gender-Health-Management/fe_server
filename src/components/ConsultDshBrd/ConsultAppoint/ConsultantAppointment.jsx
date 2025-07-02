import React, { useState, useEffect } from 'react';
import AppointmentModal from '@components/ConsultDshBrd/Appointment/AppointmentModal';
import './ConsultantAppointment.css';

const ConsultantAppointment = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [filter, setFilter] = useState('All');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('week'); // week, today
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Time slots configuration
  const timeSlots = [
    { id: 1, time: '08:00 - 09:00', period: 'morning' },
    { id: 2, time: '09:00 - 10:00', period: 'morning' },
    { id: 3, time: '10:00 - 11:00', period: 'morning' },
    { id: 4, time: '11:00 - 12:00', period: 'morning' },
    { id: 5, time: '14:00 - 15:00', period: 'afternoon' },
    { id: 6, time: '15:00 - 16:00', period: 'afternoon' },
    { id: 7, time: '16:00 - 17:00', period: 'afternoon' },
    { id: 8, time: '17:00 - 18:00', period: 'afternoon' },
  ];

  const daysOfWeek = [
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
    'Chủ Nhật',
  ];
  const weekDates = getWeekDates(currentWeek);

  // Enhanced mock data with more realistic scenarios
  const [appointments, setAppointments] = useState([
    // Monday
    {
      id: 'APT001',
      date: '2024-01-15',
      slot: 1,
      customerName: 'Nguyễn Thị Mai',
      customerPhone: '0123456789',
      customerDOB: '1990-01-01',
      customerEmail: 'mai.nguyen@email.com',
      description:
        'Tư vấn về vấn đề sức khỏe sinh sản, chu kỳ kinh nguyệt không đều',
      status: 'unaccepted',
      report: '',
      priority: 'high',
      category: 'reproductive_health',
      createdAt: '2024-01-14T10:30:00',
    },
    {
      id: 'APT002',
      date: '2024-01-15',
      slot: 3,
      customerName: 'Trần Văn Hùng',
      customerPhone: '0987654321',
      customerDOB: '1985-05-10',
      customerEmail: 'hung.tran@email.com',
      description:
        'Tư vấn về kế hoạch hóa gia đình, phương pháp tránh thai phù hợp',
      status: 'accepted',
      report: '',
      priority: 'medium',
      category: 'family_planning',
      createdAt: '2024-01-13T14:20:00',
    },
    {
      id: 'APT003',
      date: '2024-01-15',
      slot: 5,
      customerName: 'Lê Thị Lan',
      customerPhone: '0456789123',
      customerDOB: '1988-12-25',
      customerEmail: 'lan.le@email.com',
      description: 'Tư vấn về sức khỏe tình dục, vấn đề về ham muốn',
      status: 'done',
      report:
        'Đã tư vấn chi tiết về vấn đề và đưa ra khuyến nghị phù hợp. Khách hàng cần theo dõi thêm và tái khám sau 2 tuần.',
      priority: 'medium',
      category: 'sexual_health',
      createdAt: '2024-01-12T09:15:00',
    },
    // Tuesday
    {
      id: 'APT004',
      date: '2024-01-16',
      slot: 2,
      customerName: 'Phạm Minh Đức',
      customerPhone: '0789123456',
      customerDOB: '1992-03-15',
      customerEmail: 'duc.pham@email.com',
      description: 'Tư vấn về vấn đề nam khoa, rối loạn cương dương',
      status: 'accepted',
      report: '',
      priority: 'high',
      category: 'mens_health',
      createdAt: '2024-01-15T08:45:00',
    },
    {
      id: 'APT005',
      date: '2024-01-16',
      slot: 4,
      customerName: 'Hoàng Thị Nga',
      customerPhone: '0321654987',
      customerDOB: '1995-11-20',
      customerEmail: 'nga.hoang@email.com',
      description: 'Tư vấn về thai kỳ và chăm sóc bà bầu',
      status: 'unaccepted',
      report: '',
      priority: 'high',
      category: 'pregnancy',
      createdAt: '2024-01-15T16:30:00',
    },
    {
      id: 'APT006',
      date: '2024-01-16',
      slot: 6,
      customerName: 'Võ Thanh Tùng',
      customerPhone: '0654321789',
      customerDOB: '1987-07-08',
      customerEmail: 'tung.vo@email.com',
      description: 'Tư vấn về an toàn tình dục và phòng chống HIV',
      status: 'done',
      report:
        'Đã hướng dẫn các biện pháp an toàn và phòng tránh. Khuyến nghị xét nghiệm định kỳ.',
      priority: 'medium',
      category: 'sexual_health',
      createdAt: '2024-01-14T11:20:00',
    },
    // Wednesday
    {
      id: 'APT007',
      date: '2024-01-17',
      slot: 1,
      customerName: 'Đặng Thị Hoa',
      customerPhone: '0147258369',
      customerDOB: '1989-09-12',
      customerEmail: 'hoa.dang@email.com',
      description: 'Tư vấn về mãn kinh sớm và liệu pháp hormone',
      status: 'accepted',
      report: '',
      priority: 'medium',
      category: 'reproductive_health',
      createdAt: '2024-01-16T10:00:00',
    },
    {
      id: 'APT008',
      date: '2024-01-17',
      slot: 3,
      customerName: 'Bùi Văn Nam',
      customerPhone: '0963852741',
      customerDOB: '1994-04-25',
      customerEmail: 'nam.bui@email.com',
      description: 'Tư vấn về vô sinh nam và các phương pháp điều trị',
      status: 'unaccepted',
      report: '',
      priority: 'high',
      category: 'fertility',
      createdAt: '2024-01-16T14:45:00',
    },
    // Thursday
    {
      id: 'APT009',
      date: '2024-01-18',
      slot: 2,
      customerName: 'Lý Thị Kim',
      customerPhone: '0741852963',
      customerDOB: '1991-06-18',
      customerEmail: 'kim.ly@email.com',
      description: 'Tư vấn về viêm nhiễm phụ khoa và điều trị',
      status: 'accepted',
      report: '',
      priority: 'medium',
      category: 'gynecology',
      createdAt: '2024-01-17T09:30:00',
    },
    // Friday
    {
      id: 'APT010',
      date: '2024-01-19',
      slot: 1,
      customerName: 'Ngô Văn Long',
      customerPhone: '0258147963',
      customerDOB: '1986-10-05',
      customerEmail: 'long.ngo@email.com',
      description: 'Tư vấn về xuất tinh sớm và các giải pháp',
      status: 'done',
      report:
        'Đã điều trị và hướng dẫn các kỹ thuật cải thiện. Tái khám sau 1 tháng.',
      priority: 'medium',
      category: 'mens_health',
      createdAt: '2024-01-17T15:20:00',
    },
    // Saturday
    {
      id: 'APT011',
      date: '2024-01-20',
      slot: 2,
      customerName: 'Tôn Thị Linh',
      customerPhone: '0852147369',
      customerDOB: '1993-05-22',
      customerEmail: 'linh.ton@email.com',
      description: 'Tư vấn về thuốc tránh thai và tác dụng phụ',
      status: 'accepted',
      report: '',
      priority: 'low',
      category: 'contraception',
      createdAt: '2024-01-18T13:15:00',
    },
  ]);

  // Schedule data - consultant working hours
  const [schedule, setSchedule] = useState([
    { date: '2024-01-15', slots: [1, 2, 3, 4, 5, 6, 7, 8] }, // Monday
    { date: '2024-01-16', slots: [1, 2, 3, 4, 5, 6, 7, 8] }, // Tuesday
    { date: '2024-01-17', slots: [1, 2, 3, 4, 5, 6, 7, 8] }, // Wednesday
    { date: '2024-01-18', slots: [1, 2, 3, 4, 5, 6, 7, 8] }, // Thursday
    { date: '2024-01-19', slots: [1, 2, 3, 4, 5, 6, 7, 8] }, // Friday
    { date: '2024-01-20', slots: [1, 2, 3, 4, 5, 6] }, // Saturday - shorter hours
    // Sunday - no working hours (rest day)
  ]);

  // Helper functions
  function getWeekDates(date) {
    const week = [];
    const monday = new Date(date);
    const day = monday.getDay();
    const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
    monday.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }
    return week;
  }

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getAppointment = (date, slotId) => {
    const dateStr = formatDate(date);
    return appointments.find(
      (apt) => apt.date === dateStr && apt.slot === slotId
    );
  };

  const hasSchedule = (date, slotId) => {
    const dateStr = formatDate(date);
    const daySchedule = schedule.find((s) => s.date === dateStr);
    return daySchedule ? daySchedule.slots.includes(slotId) : false;
  };

  const isSunday = (date) => {
    return date.getDay() === 0;
  };

  const isToday = (date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const getCellStatus = (date, slotId) => {
    if (isSunday(date)) {
      return { status: 'rest-day', className: 'cell-rest-day' };
    }

    if (!hasSchedule(date, slotId)) {
      return { status: 'no-schedule', className: 'cell-no-schedule' };
    }

    const appointment = getAppointment(date, slotId);
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

  // Statistics calculations
  const getStatistics = () => {
    const today = formatDate(new Date());
    const todayAppointments = appointments.filter((apt) => apt.date === today);

    return {
      total: appointments.length,
      today: todayAppointments.length,
      pending: appointments.filter((apt) => apt.status === 'unaccepted').length,
      accepted: appointments.filter((apt) => apt.status === 'accepted').length,
      completed: appointments.filter((apt) => apt.status === 'done').length,
      todayPending: todayAppointments.filter(
        (apt) => apt.status === 'unaccepted'
      ).length,
      todayAccepted: todayAppointments.filter(
        (apt) => apt.status === 'accepted'
      ).length,
      todayCompleted: todayAppointments.filter((apt) => apt.status === 'done')
        .length,
    };
  };

  // Filter appointments based on current filter and search
  const getFilteredAppointments = () => {
    let filtered = appointments;

    // Apply status filter
    if (filter !== 'All') {
      const statusMap = {
        Pending: 'unaccepted',
        Accepted: 'accepted',
        Completed: 'done',
      };
      filtered = filtered.filter((apt) => apt.status === statusMap[filter]);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const shouldShowCell = (cellStatus) => {
    const filtered = getFilteredAppointments();
    if (!cellStatus.appointment) return true;
    return filtered.some((apt) => apt.id === cellStatus.appointment.id);
  };

  // Event handlers
  const handleCellClick = (date, slotId) => {
    if (isSunday(date)) return;

    const cellStatus = getCellStatus(date, slotId);
    if (cellStatus.appointment) {
      setSelectedAppointment(cellStatus.appointment);
      setShowModal(true);
    }
  };

  const handleAcceptAppointment = (appointmentId) => {
    setIsLoading(true);
    setTimeout(() => {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: 'accepted' } : apt
        )
      );
      setIsLoading(false);
      setShowModal(false);
    }, 500);
  };

  const handleRejectAppointment = (appointmentId) => {
    setIsLoading(true);
    setTimeout(() => {
      setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
      setIsLoading(false);
      setShowModal(false);
    }, 500);
  };

  const handleDoneAppointment = (appointmentId, report) => {
    setIsLoading(true);
    setTimeout(() => {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: 'done', report } : apt
        )
      );
      setIsLoading(false);
      setShowModal(false);
    }, 500);
  };

  const handleBulkAction = (action) => {
    if (selectedAppointments.length === 0) return;

    setIsLoading(true);
    setTimeout(() => {
      if (action === 'accept') {
        setAppointments((prev) =>
          prev.map((apt) =>
            selectedAppointments.includes(apt.id)
              ? { ...apt, status: 'accepted' }
              : apt
          )
        );
      } else if (action === 'reject') {
        setAppointments((prev) =>
          prev.filter((apt) => !selectedAppointments.includes(apt.id))
        );
      }
      setSelectedAppointments([]);
      setIsLoading(false);
    }, 500);
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const statistics = getStatistics();

  return (
    <div className="consultant-appointment">
      {/* Header Section */}
      <div className="appointment-header">
        <div className="header-top">
          <div className="header-info">
            <h1>📅 Quản Lý Lịch Hẹn</h1>
            <p className="header-subtitle">
              Theo dõi và quản lý các cuộc hẹn tư vấn của bạn
            </p>
            <div className="current-time">
              <span className="time-icon">🕐</span>
              <span>{currentTime.toLocaleString('vi-VN')}</span>
            </div>
          </div>

          <div className="quick-actions">
            <button className="btn btn-today" onClick={goToToday}>
              📍 Hôm nay
            </button>
            <button
              className="btn btn-refresh"
              onClick={() => window.location.reload()}
            >
              🔄 Làm mới
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{statistics.total}</h3>
              <p>Tổng lịch hẹn</p>
            </div>
          </div>

          <div className="stat-card today">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>{statistics.today}</h3>
              <p>Hôm nay</p>
              <span className="stat-detail">
                {statistics.todayPending} chờ • {statistics.todayAccepted} đã
                nhận • {statistics.todayCompleted} hoàn thành
              </span>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{statistics.pending}</h3>
              <p>Chờ xác nhận</p>
            </div>
          </div>

          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{statistics.completed}</h3>
              <p>Đã hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Filters */}
      <div className="controls-section">
        <div className="week-navigation">
          <button className="btn btn-nav" onClick={() => navigateWeek(-1)}>
            ← Tuần trước
          </button>
          <span className="current-week">
            <span className="week-label">Tuần:</span>
            <span className="week-dates">
              {weekDates[0].toLocaleDateString('vi-VN')} -{' '}
              {weekDates[6].toLocaleDateString('vi-VN')}
            </span>
          </span>
          <button className="btn btn-nav" onClick={() => navigateWeek(1)}>
            Tuần sau →
          </button>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, ID hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="status-filters">
            {['All', 'Pending', 'Accepted', 'Completed'].map((filterOption) => (
              <button
                key={filterOption}
                className={`filter-btn ${filter === filterOption ? 'active' : ''}`}
                onClick={() => setFilter(filterOption)}
              >
                {filterOption === 'All' && '📋 Tất cả'}
                {filterOption === 'Pending' && '⏳ Chờ xác nhận'}
                {filterOption === 'Accepted' && '✅ Đã nhận'}
                {filterOption === 'Completed' && '🏁 Hoàn thành'}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAppointments.length > 0 && (
          <div className="bulk-actions">
            <span className="selected-count">
              Đã chọn {selectedAppointments.length} lịch hẹn
            </span>
            <button
              className="btn btn-bulk-accept"
              onClick={() => handleBulkAction('accept')}
            >
              ✅ Chấp nhận tất cả
            </button>
            <button
              className="btn btn-bulk-reject"
              onClick={() => handleBulkAction('reject')}
            >
              ❌ Từ chối tất cả
            </button>
            <button
              className="btn btn-bulk-clear"
              onClick={() => setSelectedAppointments([])}
            >
              🔄 Bỏ chọn
            </button>
          </div>
        )}
      </div>

      {/* Schedule Grid */}
      <div className="schedule-container">
        <div className="schedule-grid">
          {/* Time Column */}
          <div className="time-column">
            <div className="time-header">
              <div className="time-title">⏰ Giờ làm việc</div>
              <div className="time-subtitle">8 ca/ngày</div>
            </div>
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot.id} className={`time-slot ${timeSlot.period}`}>
                <div className="time-range">{timeSlot.time}</div>
                <div className="slot-info">Ca {timeSlot.id}</div>
                <div className="period-indicator">
                  {timeSlot.period === 'morning' ? '🌅' : '🌇'}
                </div>
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="days-container">
            {weekDates.map((date, dayIndex) => (
              <div key={formatDate(date)} className="day-column">
                <div
                  className={`day-header ${isSunday(date) ? 'rest-day' : ''} ${isToday(date) ? 'today' : ''}`}
                >
                  <div className="day-name">{daysOfWeek[dayIndex]}</div>
                  <div className="day-date">
                    {date.getDate()}/{date.getMonth() + 1}
                  </div>
                  {isToday(date) && (
                    <div className="today-indicator">📍 Hôm nay</div>
                  )}
                  {isSunday(date) && <div className="rest-label">💤 Nghỉ</div>}

                  {/* Day statistics */}
                  {!isSunday(date) && (
                    <div className="day-stats">
                      {(() => {
                        const dayAppointments = appointments.filter(
                          (apt) => apt.date === formatDate(date)
                        );
                        return (
                          <span className="day-count">
                            {dayAppointments.length} lịch hẹn
                          </span>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <div className="day-slots">
                  {timeSlots.map((timeSlot) => {
                    const cellStatus = getCellStatus(date, timeSlot.id);
                    const showCell = shouldShowCell(cellStatus);

                    return (
                      <div
                        key={`${formatDate(date)}-${timeSlot.id}`}
                        className={`
                          schedule-cell 
                          ${cellStatus.className} 
                          ${!showCell ? 'filtered-out' : ''}
                          ${cellStatus.appointment && selectedAppointments.includes(cellStatus.appointment.id) ? 'selected' : ''}
                        `}
                        onClick={() => handleCellClick(date, timeSlot.id)}
                      >
                        {cellStatus.appointment && showCell && (
                          <div className="appointment-card">
                            <div className="appointment-header-card">
                              <span className="appointment-id">
                                {cellStatus.appointment.id}
                              </span>
                              <span
                                className={`priority-badge ${cellStatus.appointment.priority}`}
                              >
                                {cellStatus.appointment.priority === 'high' &&
                                  '🔴'}
                                {cellStatus.appointment.priority === 'medium' &&
                                  '🟡'}
                                {cellStatus.appointment.priority === 'low' &&
                                  '🟢'}
                              </span>
                            </div>
                            <div className="customer-name">
                              {cellStatus.appointment.customerName}
                            </div>
                            <div className="appointment-category">
                              {cellStatus.appointment.category ===
                                'reproductive_health' && '🌸 Sức khỏe sinh sản'}
                              {cellStatus.appointment.category ===
                                'family_planning' && '👨‍👩‍👧‍👦 Kế hoạch hóa gia đình'}
                              {cellStatus.appointment.category ===
                                'sexual_health' && '💕 Sức khỏe tình dục'}
                              {cellStatus.appointment.category ===
                                'mens_health' && '👨 Nam khoa'}
                              {cellStatus.appointment.category ===
                                'pregnancy' && '🤱 Thai kỳ'}
                              {cellStatus.appointment.category ===
                                'fertility' && '🌱 Hiếm muộn'}
                              {cellStatus.appointment.category ===
                                'gynecology' && '🌺 Phụ khoa'}
                              {cellStatus.appointment.category ===
                                'contraception' && '💊 Tránh thai'}
                            </div>
                            <div className="appointment-actions">
                              <input
                                type="checkbox"
                                checked={selectedAppointments.includes(
                                  cellStatus.appointment.id
                                )}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (e.target.checked) {
                                    setSelectedAppointments((prev) => [
                                      ...prev,
                                      cellStatus.appointment.id,
                                    ]);
                                  } else {
                                    setSelectedAppointments((prev) =>
                                      prev.filter(
                                        (id) => id !== cellStatus.appointment.id
                                      )
                                    );
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                        )}

                        {isSunday(date) && (
                          <div className="rest-indicator">
                            <span className="rest-emoji">😴</span>
                            <span className="rest-text">Nghỉ</span>
                          </div>
                        )}

                        {!cellStatus.appointment &&
                          !isSunday(date) &&
                          hasSchedule(date, timeSlot.id) && (
                            <div className="empty-slot">
                              <span className="empty-icon">📅</span>
                              <span className="empty-text">Trống</span>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="legend-section">
        <h4>🎨 Chú thích</h4>
        <div className="legend-grid">
          <div className="legend-item">
            <div className="legend-color cell-rest-day"></div>
            <span>💤 Ngày nghỉ</span>
          </div>
          <div className="legend-item">
            <div className="legend-color cell-no-schedule"></div>
            <span>⚫ Không có ca</span>
          </div>
          <div className="legend-item">
            <div className="legend-color cell-available"></div>
            <span>✅ Ca trống</span>
          </div>
          <div className="legend-item">
            <div className="legend-color cell-unaccepted"></div>
            <span>⏳ Chờ xác nhận</span>
          </div>
          <div className="legend-item">
            <div className="legend-color cell-accepted"></div>
            <span>📋 Đã nhận</span>
          </div>
          <div className="legend-item">
            <div className="legend-color cell-done"></div>
            <span>🏁 Hoàn thành</span>
          </div>
        </div>

        <div className="priority-legend">
          <h5>Mức độ ưu tiên:</h5>
          <span className="priority-item high">🔴 Cao</span>
          <span className="priority-item medium">🟡 Trung bình</span>
          <span className="priority-item low">🟢 Thấp</span>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang xử lý...</p>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
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
