import React, { useState, useEffect } from 'react';
import PieChart from '../Chart/PieChart';
import './MenstrualManagement.css';

const MenstrualManagement = () => {
  const [stats, setStats] = useState({});
  const [cycleDistribution, setCycleDistribution] = useState([]);
  const [monthlyNotifications, setMonthlyNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);

      // Mock aggregated statistics (no personal data)
      const mockStats = {
        totalUsers: 1247,
        activeUsersThisMonth: 823,
        newUsersThisMonth: 156,
        averageCycleLength: 28.3,
        notificationsSentThisMonth: 3421,
        predictionAccuracy: 87.2,
        dataRetentionCompliance: 98.5,
      };

      // Mock cycle length distribution
      const mockCycleDistribution = [
        { label: '21-24 ngày', value: 185, color: '#ef4444' },
        { label: '25-27 ngày', value: 298, color: '#f59e0b' },
        { label: '28-30 ngày', value: 512, color: '#10b981' },
        { label: '31-33 ngày', value: 189, color: '#3b82f6' },
        { label: '34+ ngày', value: 63, color: '#8b5cf6' },
      ];

      // Mock monthly notification data
      const mockMonthlyNotifications = [
        { month: 'T7', predictions: 245, reminders: 489, health_tips: 123 },
        { month: 'T8', predictions: 267, reminders: 523, health_tips: 145 },
        { month: 'T9', predictions: 289, reminders: 556, health_tips: 167 },
        { month: 'T10', predictions: 312, reminders: 578, health_tips: 189 },
        { month: 'T11', predictions: 334, reminders: 601, health_tips: 201 },
        { month: 'T12', predictions: 356, reminders: 634, health_tips: 223 },
      ];

      setStats(mockStats);
      setCycleDistribution(mockCycleDistribution);
      setMonthlyNotifications(mockMonthlyNotifications);
      setError(null);
    } catch (err) {
      console.error('Error loading menstrual data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const formatPercentage = (num) => {
    if (!num && num !== 0) return '0%';
    return `${num.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="menstrual-management">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            fontSize: '16px',
            color: '#10b981',
          }}
        >
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menstrual-management">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            fontSize: '16px',
            color: '#ef4444',
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="menstrual-management">
      <div className="menstrual-header">
        <h2>Quản lý Chu kỳ Kinh nguyệt</h2>
        <p>
          Thống kê tổng hợp và báo cáo ẩn danh về dữ liệu chu kỳ kinh nguyệt
        </p>
        <div className="privacy-notice">
          <span className="privacy-icon">🔒</span>
          <span>Tất cả dữ liệu được ẩn danh và tuân thủ quy định bảo mật</span>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{formatNumber(stats.totalUsers)}</div>
            <div className="stat-label">Tổng người dùng theo dõi</div>
            <div className="stat-change positive">
              +{formatNumber(stats.newUsersThisMonth)} người mới tháng này
            </div>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">
              {formatNumber(stats.activeUsersThisMonth)}
            </div>
            <div className="stat-label">Người dùng hoạt động</div>
            <div className="stat-change neutral">
              Trong tháng {new Date().getMonth() + 1}
            </div>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.averageCycleLength} ngày</div>
            <div className="stat-label">Độ dài chu kỳ trung bình</div>
            <div className="stat-change neutral">Dữ liệu tổng hợp</div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <div className="stat-value">
              {formatNumber(stats.notificationsSentThisMonth)}
            </div>
            <div className="stat-label">Thông báo đã gửi</div>
            <div className="stat-change positive">Tháng này</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="menstrual-main">
        {/* Cycle Distribution Chart */}
        <div className="chart-section">
          <div className="section-header">
            <h3>Phân bổ độ dài chu kỳ</h3>
            <p>Thống kê ẩn danh về độ dài chu kỳ kinh nguyệt của người dùng</p>
          </div>
          <div className="chart-container">
            {cycleDistribution && cycleDistribution.length > 0 ? (
              <PieChart data={cycleDistribution} />
            ) : (
              <div style={{ color: '#6b7280', textAlign: 'center' }}>
                Không có dữ liệu để hiển thị
              </div>
            )}
          </div>
          <div className="chart-legend">
            {cycleDistribution &&
              cycleDistribution.map((item, index) => (
                <div key={index} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="legend-label">
                    {item.label}: {item.value} người (
                    {stats.totalUsers
                      ? ((item.value / stats.totalUsers) * 100).toFixed(1)
                      : 0}
                    %)
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="metrics-section">
          <div className="section-header">
            <h3>Hiệu suất hệ thống</h3>
            <p>Các chỉ số quan trọng về chất lượng dịch vụ</p>
          </div>

          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-icon">🎯</div>
              <div className="metric-content">
                <div className="metric-value">
                  {formatPercentage(stats.predictionAccuracy)}
                </div>
                <div className="metric-label">Độ chính xác dự đoán</div>
                <div className="metric-description">
                  Tỷ lệ dự đoán chu kỳ chính xác
                </div>
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-icon">✅</div>
              <div className="metric-content">
                <div className="metric-value">
                  {formatPercentage(stats.dataRetentionCompliance)}
                </div>
                <div className="metric-label">Tuân thủ bảo mật</div>
                <div className="metric-description">
                  Tỷ lệ tuân thủ quy định lưu trữ dữ liệu
                </div>
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-icon">📈</div>
              <div className="metric-content">
                <div className="metric-value">
                  {formatNumber(stats.newUsersThisMonth)}
                </div>
                <div className="metric-label">Tăng trưởng tháng</div>
                <div className="metric-description">
                  Số người dùng mới tham gia
                </div>
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-icon">💬</div>
              <div className="metric-content">
                <div className="metric-value">
                  {stats.totalUsers && stats.activeUsersThisMonth
                    ? formatPercentage(
                        (stats.activeUsersThisMonth / stats.totalUsers) * 100
                      )
                    : '0%'}
                </div>
                <div className="metric-label">Tỷ lệ tương tác</div>
                <div className="metric-description">
                  Người dùng hoạt động trong tháng
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Analytics */}
      <div className="notifications-section">
        <div className="section-header">
          <h3>Thống kê thông báo</h3>
          <p>Số lượng thông báo được gửi trong 6 tháng gần đây</p>
        </div>

        <div className="notifications-chart">
          <div className="chart-header">
            <div className="chart-legend-horizontal">
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: '#10b981' }}
                ></div>
                <span>Dự đoán chu kỳ</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: '#3b82f6' }}
                ></div>
                <span>Nhắc nhở</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: '#8b5cf6' }}
                ></div>
                <span>Mẹo sức khỏe</span>
              </div>
            </div>
          </div>

          <div className="bar-chart">
            {monthlyNotifications.map((month, index) => {
              const total =
                month.predictions + month.reminders + month.health_tips;
              const maxTotal = Math.max(
                ...monthlyNotifications.map(
                  (m) => m.predictions + m.reminders + m.health_tips
                )
              );

              return (
                <div key={index} className="bar-group">
                  <div
                    className="bar-stack"
                    style={{ height: `${(total / maxTotal) * 200}px` }}
                  >
                    <div
                      className="bar-segment predictions"
                      style={{
                        height: `${(month.predictions / total) * 100}%`,
                        backgroundColor: '#10b981',
                      }}
                    ></div>
                    <div
                      className="bar-segment reminders"
                      style={{
                        height: `${(month.reminders / total) * 100}%`,
                        backgroundColor: '#3b82f6',
                      }}
                    ></div>
                    <div
                      className="bar-segment health-tips"
                      style={{
                        height: `${(month.health_tips / total) * 100}%`,
                        backgroundColor: '#8b5cf6',
                      }}
                    ></div>
                  </div>
                  <div className="bar-label">{month.month}</div>
                  <div className="bar-total">{formatNumber(total)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Privacy & Compliance */}
      <div className="compliance-section">
        <div className="section-header">
          <h3>Tuân thủ & Bảo mật</h3>
          <p>Cam kết bảo vệ quyền riêng tư và tuân thủ quy định</p>
        </div>

        <div className="compliance-grid">
          <div className="compliance-item">
            <div className="compliance-icon">🔐</div>
            <div className="compliance-content">
              <h4>Mã hóa dữ liệu</h4>
              <p>Tất cả dữ liệu chu kỳ được mã hóa end-to-end</p>
            </div>
          </div>

          <div className="compliance-item">
            <div className="compliance-icon">🗑️</div>
            <div className="compliance-content">
              <h4>Tự động xóa</h4>
              <p>Dữ liệu cũ được tự động xóa sau 24 tháng</p>
            </div>
          </div>

          <div className="compliance-item">
            <div className="compliance-icon">📊</div>
            <div className="compliance-content">
              <h4>Ẩn danh hóa</h4>
              <p>Chỉ lưu trữ và xử lý dữ liệu ẩn danh</p>
            </div>
          </div>

          <div className="compliance-item">
            <div className="compliance-icon">✅</div>
            <div className="compliance-content">
              <h4>Tuân thủ GDPR</h4>
              <p>Đáp ứng đầy đủ các yêu cầu bảo mật quốc tế</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenstrualManagement;
