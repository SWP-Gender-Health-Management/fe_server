import React, { useState, useEffect } from 'react';
import LineChart from './LineChart';
import PieChart from './PieChart';
import './Reports.css';

const Reports = () => {
  const [reportData, setReportData] = useState({
    userStats: {
      total: 2847,
      newThisMonth: 156,
      activeToday: 89,
      byRole: {
        customer: 2450,
        consultant: 15,
        staff: 8,
        manager: 4,
        admin: 2,
      },
    },
    revenueStats: {
      total: 45200000,
      thisMonth: 12500000,
      growth: 15.2,
      byService: {
        consultation: 18000000,
        labTest: 15200000,
        appointment: 12000000,
      },
    },
    appointmentStats: {
      total: 1245,
      completed: 1108,
      cancelled: 137,
      pending: 89,
      thisMonth: 345,
    },
    reviewStats: {
      total: 892,
      average: 4.6,
      ratings: {
        5: 456,
        4: 298,
        3: 102,
        2: 26,
        1: 10,
      },
    },
  });

  const [chartData, setChartData] = useState({
    userGrowth: [],
    revenue: [],
    appointments: [],
  });

  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  useEffect(() => {
    generateChartData();
  }, [selectedPeriod]);

  const generateChartData = () => {
    const periods = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
    };

    const days = periods[selectedPeriod];
    const today = new Date();

    const userGrowthData = [];
    const revenueData = [];
    const appointmentData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayLabel = `${date.getDate()}/${date.getMonth() + 1}`;

      userGrowthData.push({
        date: date.toISOString().split('T')[0],
        users: Math.floor(Math.random() * 20) + 5,
        label: dayLabel,
      });

      revenueData.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 2000000) + 500000,
        label: dayLabel,
      });

      appointmentData.push({
        date: date.toISOString().split('T')[0],
        appointments: Math.floor(Math.random() * 15) + 2,
        label: dayLabel,
      });
    }

    setChartData({
      userGrowth: userGrowthData,
      revenue: revenueData,
      appointments: appointmentData,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const userRoleData = Object.entries(reportData.userStats.byRole).map(
    ([role, count]) => ({
      name: role,
      value: count,
      label: {
        customer: 'Khách hàng',
        consultant: 'Tư vấn viên',
        staff: 'Nhân viên',
        manager: 'Quản lý',
        admin: 'Admin',
      }[role],
    })
  );

  const serviceRevenueData = Object.entries(
    reportData.revenueStats.byService
  ).map(([service, revenue]) => ({
    name: service,
    value: revenue,
    label: {
      consultation: 'Tư vấn',
      labTest: 'Xét nghiệm',
      appointment: 'Cuộc hẹn',
    }[service],
  }));

  const ratingData = Object.entries(reportData.reviewStats.ratings).map(
    ([rating, count]) => ({
      name: `${rating} sao`,
      value: count,
      label: `${rating} sao`,
    })
  );

  return (
    <div className="reports">
      <div className="reports-header">
        <h1>Báo cáo tổng quan</h1>
        <p>Xem chi tiết về người dùng, doanh thu, cuộc hẹn và đánh giá</p>

        <div className="period-selector">
          <label>Thời gian:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
          </select>
        </div>
      </div>

      {/* Tổng quan KPIs */}
      <div className="reports-overview">
        <div className="overview-card">
          <h3>Người dùng</h3>
          <div className="metric">
            <span className="metric-value">
              {formatNumber(reportData.userStats.total)}
            </span>
            <span className="metric-label">Tổng số</span>
          </div>
          <div className="metric-small">
            <span className="metric-value">
              {formatNumber(reportData.userStats.newThisMonth)}
            </span>
            <span className="metric-label">Mới tháng này</span>
          </div>
        </div>

        <div className="overview-card">
          <h3>Doanh thu</h3>
          <div className="metric">
            <span className="metric-value">
              {formatCurrency(reportData.revenueStats.total)}
            </span>
            <span className="metric-label">Tổng</span>
          </div>
          <div className="metric-small">
            <span className="metric-value positive">
              +{reportData.revenueStats.growth}%
            </span>
            <span className="metric-label">Tăng trưởng</span>
          </div>
        </div>

        <div className="overview-card">
          <h3>Cuộc hẹn</h3>
          <div className="metric">
            <span className="metric-value">
              {formatNumber(reportData.appointmentStats.total)}
            </span>
            <span className="metric-label">Tổng số</span>
          </div>
          <div className="metric-small">
            <span className="metric-value">
              {formatNumber(reportData.appointmentStats.completed)}
            </span>
            <span className="metric-label">Hoàn thành</span>
          </div>
        </div>

        <div className="overview-card">
          <h3>Đánh giá</h3>
          <div className="metric">
            <span className="metric-value">
              {reportData.reviewStats.average}/5
            </span>
            <span className="metric-label">Điểm trung bình</span>
          </div>
          <div className="metric-small">
            <span className="metric-value">
              {formatNumber(reportData.reviewStats.total)}
            </span>
            <span className="metric-label">Tổng đánh giá</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* User Growth Chart */}
        <div className="chart-container">
          <h3>Tăng trưởng người dùng</h3>
          <LineChart data={chartData.userGrowth} />
        </div>

        {/* Revenue Chart */}
        <div className="chart-container">
          <h3>Doanh thu theo thời gian</h3>
          <LineChart
            data={chartData.revenue.map((item) => ({
              ...item,
              users: item.revenue / 100000, // Scale for display
            }))}
          />
        </div>

        {/* Appointments Chart */}
        <div className="chart-container">
          <h3>Số lượng cuộc hẹn</h3>
          <LineChart
            data={chartData.appointments.map((item) => ({
              ...item,
              users: item.appointments,
            }))}
          />
        </div>
      </div>

      {/* Pie Charts Section */}
      <div className="pie-charts-section">
        <div className="pie-chart-container">
          <h3>Phân bố người dùng theo vai trò</h3>
          <PieChart data={userRoleData} />
          <div className="chart-legend">
            {userRoleData.map((item, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                ></span>
                <span>
                  {item.label}: {formatNumber(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pie-chart-container">
          <h3>Doanh thu theo dịch vụ</h3>
          <PieChart data={serviceRevenueData} />
          <div className="chart-legend">
            {serviceRevenueData.map((item, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: `hsl(${index * 120}, 70%, 50%)` }}
                ></span>
                <span>
                  {item.label}: {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pie-chart-container">
          <h3>Phân bố đánh giá</h3>
          <PieChart data={ratingData} />
          <div className="chart-legend">
            {ratingData.map((item, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: `hsl(${index * 45}, 70%, 50%)` }}
                ></span>
                <span>
                  {item.label}: {formatNumber(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="detailed-stats">
        <div className="stats-section">
          <h3>Chi tiết cuộc hẹn</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Hoàn thành</span>
              <span className="stat-value">
                {formatNumber(reportData.appointmentStats.completed)}
              </span>
              <span className="stat-percentage">
                {(
                  (reportData.appointmentStats.completed /
                    reportData.appointmentStats.total) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đã hủy</span>
              <span className="stat-value">
                {formatNumber(reportData.appointmentStats.cancelled)}
              </span>
              <span className="stat-percentage">
                {(
                  (reportData.appointmentStats.cancelled /
                    reportData.appointmentStats.total) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đang chờ</span>
              <span className="stat-value">
                {formatNumber(reportData.appointmentStats.pending)}
              </span>
              <span className="stat-percentage">
                {(
                  (reportData.appointmentStats.pending /
                    reportData.appointmentStats.total) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h3>Thống kê người dùng hoạt động</h3>
          <div className="activity-stats">
            <div className="activity-item">
              <span>Đang hoạt động hôm nay</span>
              <span>{formatNumber(reportData.userStats.activeToday)}</span>
            </div>
            <div className="activity-item">
              <span>Đăng ký mới tháng này</span>
              <span>{formatNumber(reportData.userStats.newThisMonth)}</span>
            </div>
            <div className="activity-item">
              <span>Tỷ lệ người dùng hoạt động</span>
              <span>
                {(
                  (reportData.userStats.activeToday /
                    reportData.userStats.total) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
