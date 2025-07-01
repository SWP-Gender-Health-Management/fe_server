import React, { useState } from 'react';
import LabDetailModal from '@components/StaffDshBrd/LabDetail/LabDetailModal';
import './StaffLaboratory.css';

const StaffLaboratory = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedLab, setSelectedLab] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for laboratory appointments
  const [labData] = useState({
    // Format: 'YYYY-MM-DD-slot': {...}
    '2024-01-15-1': {
      id: 'LAB001',
      date: '2024-01-15',
      slot: 1,
      type: 'Xét nghiệm máu',
      registrations: 5,
      status: 'ongoing', // ongoing, done
      registrationList: [
        {
          id: 1,
          customerName: 'Nguyễn Văn A',
          phone: '0901234567',
          note: 'Nhịn ăn 12 tiếng',
          result: '',
          status: 'pending',
        },
        {
          id: 2,
          customerName: 'Trần Thị B',
          phone: '0987654321',
          note: 'Có tiền sử dị ứng',
          result: '',
          status: 'pending',
        },
        {
          id: 3,
          customerName: 'Lê Văn C',
          phone: '0912345678',
          note: '',
          result: '',
          status: 'pending',
        },
        {
          id: 4,
          customerName: 'Phạm Thị D',
          phone: '0923456789',
          note: 'Cần kết quả gấp',
          result: '',
          status: 'pending',
        },
        {
          id: 5,
          customerName: 'Hoàng Văn E',
          phone: '0934567890',
          note: '',
          result: '',
          status: 'pending',
        },
      ],
    },
    '2024-01-16-3': {
      id: 'LAB002',
      date: '2024-01-16',
      slot: 3,
      type: 'Xét nghiệm nước tiểu',
      registrations: 3,
      status: 'done',
      registrationList: [
        {
          id: 1,
          customerName: 'Đỗ Văn F',
          phone: '0945678901',
          note: '',
          result: 'Bình thường',
          status: 'completed',
        },
        {
          id: 2,
          customerName: 'Vũ Thị G',
          phone: '0956789012',
          note: 'Thai phụ',
          result: 'Có protein',
          status: 'completed',
        },
        {
          id: 3,
          customerName: 'Bùi Văn H',
          phone: '0967890123',
          note: '',
          result: 'Bình thường',
          status: 'completed',
        },
      ],
    },
    '2024-01-17-2': {
      id: 'LAB003',
      date: '2024-01-17',
      slot: 2,
      type: 'Xét nghiệm hormone',
      registrations: 2,
      status: 'ongoing',
      registrationList: [
        {
          id: 1,
          customerName: 'Cao Thị I',
          phone: '0978901234',
          note: 'Đến sáng sớm',
          result: '',
          status: 'pending',
        },
        {
          id: 2,
          customerName: 'Đinh Văn J',
          phone: '0989012345',
          note: '',
          result: '',
          status: 'pending',
        },
      ],
    },
  });

  // Get week range
  const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

    return { startOfWeek, endOfWeek };
  };

  // Get days of current week
  const getWeekDays = () => {
    const { startOfWeek } = getWeekRange(currentWeek);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    return days;
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  // Get day name in Vietnamese
  const getDayName = (date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  };

  // Get cell data for specific date and slot
  const getCellData = (date, slot) => {
    const dateStr = date.toISOString().split('T')[0];
    const key = `${dateStr}-${slot}`;
    return labData[key] || null;
  };

  // Get cell class based on status and filter
  const getCellClass = (cellData) => {
    if (!cellData) return 'lab-cell-empty';

    switch (selectedFilter) {
      case 'On Going':
        return cellData.status === 'ongoing'
          ? 'lab-cell-ongoing'
          : 'lab-cell-hidden';
      case 'Done':
        return cellData.status === 'done' ? 'lab-cell-done' : 'lab-cell-hidden';
      default:
        return cellData.status === 'ongoing'
          ? 'lab-cell-ongoing'
          : 'lab-cell-done';
    }
  };

  // Handle cell click
  const handleCellClick = (cellData) => {
    if (cellData) {
      setSelectedLab(cellData);
      setIsModalOpen(true);
    }
  };

  // Navigate week
  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
  };

  // Get filter counts
  const getFilterCounts = () => {
    const counts = { All: 0, 'On Going': 0, Done: 0 };

    Object.values(labData).forEach((lab) => {
      counts.All++;
      if (lab.status === 'ongoing') counts['On Going']++;
      if (lab.status === 'done') counts.Done++;
    });

    return counts;
  };

  const { startOfWeek, endOfWeek } = getWeekRange(currentWeek);
  const weekDays = getWeekDays();
  const filterCounts = getFilterCounts();

  return (
    <div className="staff-laboratory">
      <div className="staff-page-header">
        <h1 className="staff-page-title">Laboratory</h1>
        <p className="staff-page-subtitle">
          Quản lý lịch xét nghiệm và mẫu bệnh phẩm
        </p>
      </div>

      {/* Filters */}
      <div className="lab-filters">
        {Object.entries(filterCounts).map(([filter, count]) => (
          <button
            key={filter}
            className={`lab-filter-btn ${selectedFilter === filter ? 'active' : ''}`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter} ({count})
          </button>
        ))}
      </div>

      {/* Calendar */}
      <div className="lab-calendar-container staff-card">
        {/* Calendar Header */}
        <div className="lab-calendar-header">
          <button className="lab-nav-btn" onClick={() => navigateWeek(-1)}>
            ← Tuần trước
          </button>

          <h3 className="lab-week-title">
            {formatDate(startOfWeek)} - {formatDate(endOfWeek)}
          </h3>

          <button className="lab-nav-btn" onClick={() => navigateWeek(1)}>
            Tuần sau →
          </button>
        </div>

        {/* Calendar Table */}
        <div className="lab-calendar-table">
          <table>
            <thead>
              <tr>
                <th className="lab-slot-header">Slot</th>
                {weekDays.map((day, index) => (
                  <th key={index} className="lab-day-header">
                    <div className="lab-day-name">{getDayName(day)}</div>
                    <div className="lab-day-date">{formatDate(day)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
                <tr key={slot}>
                  <td className="lab-slot-cell">Slot {slot}</td>
                  {weekDays.map((day, dayIndex) => {
                    const cellData = getCellData(day, slot);
                    const cellClass = getCellClass(cellData);

                    return (
                      <td
                        key={dayIndex}
                        className={`lab-schedule-cell ${cellClass}`}
                        onClick={() => handleCellClick(cellData)}
                      >
                        {cellData && cellClass !== 'lab-cell-hidden' && (
                          <div className="lab-cell-content">
                            <div className="lab-id">{cellData.id}</div>
                            <div className="lab-type">{cellData.type}</div>
                            <div className="lab-count">
                              {cellData.registrations} người
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
      </div>

      {/* Lab Detail Modal */}
      {isModalOpen && selectedLab && (
        <LabDetailModal
          labData={selectedLab}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLab(null);
          }}
        />
      )}
    </div>
  );
};

export default StaffLaboratory;
