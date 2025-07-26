import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PieChart from '../Chart/PieChart';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState({
    totalAppointments: 23,
    consultationRevenue: 1250000,
    labRevenue: 2100000,
    newMenstrualUsers: 8,
  });

  const [bookingMixData, setBookingMixData] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    // Mock data for booking mix chart (7 days)
    const generateBookingMix = () => [
      { label: 'Tư vấn', value: 35, color: '#10b981' },
      { label: 'Xét nghiệm', value: 42, color: '#059669' },
    ];

    // Mock data for upcoming appointments
    const generateUpcomingAppointments = () => [
      {
        id: 1,
        customerName: 'Nguyễn Thị Lan',
        serviceName: 'Tư vấn sức khỏe sinh sản',
        time: '2024-12-21 09:00',
        consultant: 'BS. Trần Văn Nam',
        type: 'consultation',
        status: 'confirmed',
      },
      {
        id: 2,
        customerName: 'Lê Văn Minh',
        serviceName: 'Xét nghiệm STD Panel',
        time: '2024-12-21 10:30',
        consultant: null,
        type: 'lab',
        status: 'confirmed',
      },
      {
        id: 3,
        customerName: 'Phạm Thị Hoa',
        serviceName: 'Tư vấn kế hoạch hóa gia đình',
        time: '2024-12-21 14:00',
        consultant: 'BS. Nguyễn Thị Mai',
        type: 'consultation',
        status: 'pending',
      },
      {
        id: 4,
        customerName: 'Hoàng Văn Đức',
        serviceName: 'Xét nghiệm HIV',
        time: '2024-12-21 15:30',
        consultant: null,
        type: 'lab',
        status: 'confirmed',
      },
      {
        id: 5,
        customerName: 'Trần Thị Bích',
        serviceName: 'Tư vấn điều trị nhiễm trùng',
        time: '2024-12-21 16:00',
        consultant: 'BS. Lê Văn Tùng',
        type: 'consultation',
        status: 'confirmed',
      },
    ];

    setBookingMixData(generateBookingMix());
    setUpcomingAppointments(generateUpcomingAppointments());
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { text: 'Đã xác nhận', color: '#10b981' },
      pending: { text: 'Chờ xác nhận', color: '#f59e0b' },
      cancelled: { text: 'Đã hủy', color: '#ef4444' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className="status-badge"
        style={{
          backgroundColor: `${config.color}20`,
          color: config.color,
        }}
      >
        {config.text}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    return type === 'consultation' ? '💬' : '🧪';
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      time: date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      date: date.toLocaleDateString('vi-VN'),
    };
  };

  return (
    <div className="manager-dashboard-page">
      <div className="dashboard-header">
        <h1>Business Dashboard</h1>
        <p>
          Today's service activity overview -{' '}
          {new Date().toLocaleDateString('vi-VN')}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div
            className="kpi-icon"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            }}
          >
            📅
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Tổng lịch hẹn hôm nay</div>
            <div className="kpi-value">
              {formatNumber(kpiData.totalAppointments)}
            </div>
            <div className="kpi-change positive">+15% so với hôm qua</div>
          </div>
        </div>

        <div className="kpi-card">
          <div
            className="kpi-icon"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            }}
          >
            💰
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Doanh thu tư vấn</div>
            <div className="kpi-value">
              {formatCurrency(kpiData.consultationRevenue)}
            </div>
            <div className="kpi-change positive">+8% so với hôm qua</div>
          </div>
        </div>

        <div className="kpi-card">
          <div
            className="kpi-icon"
            style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            }}
          >
            🧪
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Doanh thu xét nghiệm</div>
            <div className="kpi-value">
              {formatCurrency(kpiData.labRevenue)}
            </div>
            <div className="kpi-change positive">+22% so với hôm qua</div>
          </div>
        </div>

        <div className="kpi-card">
          <div
            className="kpi-icon"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            }}
          >
            📱
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Người dùng mới theo dõi chu kỳ</div>
            <div className="kpi-value">
              {formatNumber(kpiData.newMenstrualUsers)}
            </div>
            <div className="kpi-change neutral">Hôm nay</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="quick-actions-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
          <p>Common management functions</p>
        </div>
        <div className="quick-actions-grid">
          <div
            className="quick-action-card"
            onClick={() => navigate('/manager/services')}
          >
            <div className="action-icon" style={{ backgroundColor: '#10b981' }}>
              🏥
            </div>
            <div className="action-content">
                          <div className="action-title">Service Management</div>
            <div className="action-description">
              Manage consultation, testing and cycle services
            </div>
            </div>
          </div>
          <div
            className="quick-action-card"
            onClick={() => navigate('/manager/blogs')}
          >
            <div className="action-icon" style={{ backgroundColor: '#8b5cf6' }}>
              📝
            </div>
            <div className="action-content">
                          <div className="action-title">Blog Management</div>
            <div className="action-description">
              View and manage all articles in all statuses
            </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Dashboard Content */}
      <div className="dashboard-main">
        {/* Booking Mix Chart */}
        <div className="chart-section">
          <div className="section-header">
            <h2>Phân bổ lịch hẹn</h2>
            <p>Tỷ lệ giữa tư vấn và xét nghiệm trong 7 ngày qua</p>
          </div>
          <div className="chart-container">
            <PieChart data={bookingMixData} />
          </div>
          <div className="chart-legend">
            {bookingMixData.map((item, index) => (
              <div key={index} className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="legend-label">
                  {item.label}: {item.value} lịch hẹn
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats-section">
          <div className="section-header">
            <h2>Thống kê nhanh</h2>
            <p>Các chỉ số quan trọng khác</p>
          </div>
          <div className="quick-stats-grid">
            <div className="stat-item">
              <div className="stat-icon">⏰</div>
              <div className="stat-content">
                <div className="stat-value">4</div>
                <div className="stat-label">Lịch hẹn chờ xác nhận</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">19</div>
                <div className="stat-label">Lịch hẹn đã xác nhận</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">👨‍⚕️</div>
              <div className="stat-content">
                <div className="stat-value">5</div>
                <div className="stat-label">Active Doctors</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">92%</div>
                <div className="stat-label">Tỷ lệ hoàn thành</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="appointments-section">
        <div className="section-header">
          <h2>Lịch hẹn sắp tới</h2>
          <p>Các cuộc hẹn gần nhất cần theo dõi</p>
        </div>
        <div className="appointments-table">
          <table>
            <thead>
              <tr>
                <th>Loại</th>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Thời gian</th>
                <th>Bác sĩ</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAppointments.map((appointment) => {
                const { time, date } = formatDateTime(appointment.time);
                return (
                  <tr key={appointment.id}>
                    <td>
                      <div className="appointment-type">
                        <span className="type-icon">
                          {getTypeIcon(appointment.type)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">
                          {appointment.customerName}
                        </div>
                        <div className="customer-id">ID: {appointment.id}</div>
                      </div>
                    </td>
                    <td className="service-name">{appointment.serviceName}</td>
                    <td>
                      <div className="appointment-time">
                        <div className="time">{time}</div>
                        <div className="date">{date}</div>
                      </div>
                    </td>
                    <td>
                      <span className="consultant-name">
                        {appointment.consultant || 'Chưa phân công'}
                      </span>
                    </td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>
                      <div className="appointment-actions">
                        <button className="action-btn view">👁</button>
                        <button className="action-btn edit">✏️</button>
                        <button className="action-btn more">⋮</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="appointments-footer">
          <button className="view-all-btn">Xem tất cả lịch hẹn</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
