import React, { useState, useEffect } from 'react';
import PieChart from '../Chart/PieChart';
import './MenstrualManagement.css';

const MenstrualManagement = () => {
  const [stats, setStats] = useState({});
  const [cycleDistribution, setCycleDistribution] = useState([]);
  const [monthlyNotifications, setMonthlyNotifications] = useState([]);
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [symptomData, setSymptomData] = useState([]);
  const [usagePatterns, setUsagePatterns] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
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
        averagePeriodLength: 5.2,
        irregularCycleUsers: 234,
        regularCycleUsers: 1013,
        premiumUsers: 89,
        averageAge: 26.8,
        mostCommonSymptom: 'Đau bụng kinh',
        averageAppUsageTime: 8.5,
        retentionRate: 78.3,
        satisfactionScore: 4.6,
        healthConsultations: 156,
        emergencyAlerts: 23,
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

      // Thêm dữ liệu thống kê mới
      const mockAgeDistribution = [
        { label: '15-19 tuổi', value: 156, color: '#fbbf24' },
        { label: '20-24 tuổi', value: 423, color: '#10b981' },
        { label: '25-29 tuổi', value: 389, color: '#3b82f6' },
        { label: '30-34 tuổi', value: 198, color: '#8b5cf6' },
        { label: '35+ tuổi', value: 81, color: '#ef4444' },
      ];

      const mockSymptomData = [
        { symptom: 'Đau bụng kinh', count: 892, percentage: 71.5 },
        { symptom: 'Mệt mỏi', count: 756, percentage: 60.6 },
        { symptom: 'Thay đổi tâm trạng', count: 634, percentage: 50.8 },
        { symptom: 'Đau lưng', count: 523, percentage: 41.9 },
        { symptom: 'Đau đầu', count: 445, percentage: 35.7 },
        { symptom: 'Chuột rút', count: 378, percentage: 30.3 },
        { symptom: 'Đầy hơi', count: 312, percentage: 25.0 },
        { symptom: 'Mất ngủ', count: 267, percentage: 21.4 },
      ];

      const mockUsagePatterns = [
        { time: '06:00-09:00', usage: 23.4, color: '#fbbf24' },
        { time: '09:00-12:00', usage: 18.7, color: '#10b981' },
        { time: '12:00-15:00', usage: 15.2, color: '#3b82f6' },
        { time: '15:00-18:00', usage: 19.8, color: '#8b5cf6' },
        { time: '18:00-21:00', usage: 16.3, color: '#ef4444' },
        { time: '21:00-24:00', usage: 6.6, color: '#6b7280' },
      ];

      const mockHealthMetrics = [
        { metric: 'Chu kỳ đều', value: 81.2, target: 85, color: '#10b981' },
        {
          metric: 'Ghi chép đầy đủ',
          value: 73.8,
          target: 80,
          color: '#3b82f6',
        },
        {
          metric: 'Theo dõi triệu chứng',
          value: 67.4,
          target: 75,
          color: '#f59e0b',
        },
        {
          metric: 'Tư vấn sức khỏe',
          value: 45.2,
          target: 60,
          color: '#8b5cf6',
        },
        { metric: 'Khám định kỳ', value: 38.9, target: 50, color: '#ef4444' },
      ];

      const mockMonthlyTrends = [
        { month: 'T7', newUsers: 134, activeUsers: 756, predictions: 245 },
        { month: 'T8', newUsers: 145, activeUsers: 789, predictions: 267 },
        { month: 'T9', newUsers: 167, activeUsers: 823, predictions: 289 },
        { month: 'T10', newUsers: 178, activeUsers: 856, predictions: 312 },
        { month: 'T11', newUsers: 189, activeUsers: 889, predictions: 334 },
        { month: 'T12', newUsers: 201, activeUsers: 923, predictions: 356 },
      ];

      setStats(mockStats);
      setCycleDistribution(mockCycleDistribution);
      setMonthlyNotifications(mockMonthlyNotifications);
      setAgeDistribution(mockAgeDistribution);
      setSymptomData(mockSymptomData);
      setUsagePatterns(mockUsagePatterns);
      setHealthMetrics(mockHealthMetrics);
      setMonthlyTrends(mockMonthlyTrends);
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
        <div className="manager-stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="manager-stat-content">
            <div className="manager-stat-value">{formatNumber(stats.totalUsers)}</div>
            <div className="manager-stat-label">Tổng người dùng theo dõi</div>
            <div className="stat-change positive">
              +{formatNumber(stats.newUsersThisMonth)} người mới tháng này
            </div>
          </div>
        </div>

        {/* <div className="manager-stat-card secondary">
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
        </div> */}

        <div className="manager-stat-card accent">
          <div className="stat-icon">📅</div>
          <div className="manager-stat-content">
            <div className="manager-stat-value">{stats.averageCycleLength} ngày</div>
            <div className="manager-stat-label">Độ dài chu kỳ trung bình</div>
            <div className="stat-change neutral">Dữ liệu tổng hợp</div>
          </div>
        </div>

        <div className="manager-stat-card info">
          <div className="stat-icon">⏱️</div>
          <div className="manager-stat-content">
            <div className="manager-stat-value">{stats.averagePeriodLength} ngày</div>
            <div className="manager-stat-label">Thời gian hành kinh TB</div>
            <div className="stat-change neutral">Trung bình</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="manager-menstrual-main ">
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

        {/* Age Distribution */}
        <div className="chart-section">
          <div className="section-header">
            <h3>Phân bổ độ tuổi người dùng</h3>
            <p>Thống kê độ tuổi của người dùng đang theo dõi chu kỳ</p>
          </div>
          <div className="chart-container">
            {ageDistribution && ageDistribution.length > 0 ? (
              <PieChart data={ageDistribution} />
            ) : (
              <div style={{ color: '#6b7280', textAlign: 'center' }}>
                Không có dữ liệu để hiển thị
              </div>
            )}
          </div>
          <div className="chart-legend">
            {ageDistribution &&
              ageDistribution.map((item, index) => (
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
