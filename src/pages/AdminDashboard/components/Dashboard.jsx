import React, { useState, useEffect } from 'react';
import LineChart from './LineChart';
import './Dashboard.css';

const Dashboard = () => {
  const [kpiData, setKpiData] = useState({
    totalUsers: 2847,
    newUsers: 156,
    revenue: 45200000,
    activities: 89,
  });

  const [chartData, setChartData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Mock data for chart (30 days)
  useEffect(() => {
    const generateChartData = () => {
      const data = [];
      const today = new Date();

      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const users = Math.floor(Math.random() * 20) + 5; // 5-25 users per day
        data.push({
          date: date.toISOString().split('T')[0],
          users: users,
          label: `${date.getDate()}/${date.getMonth() + 1}`,
        });
      }
      return data;
    };

    const generateRecentActivities = () => [
      {
        id: 1,
        type: 'user_register',
        message: 'Người dùng mới "Nguyễn Văn A" đã đăng ký tài khoản',
        time: '2 phút trước',
        icon: '👤',
        color: '#10b981',
      },
      {
        id: 2,
        type: 'appointment',
        message: 'Cuộc hẹn khám với BS. Trần Thị B đã được xác nhận',
        time: '15 phút trước',
        icon: '📅',
        color: '#3b82f6',
      },
      {
        id: 3,
        type: 'blog_approved',
        message: 'Bài viết "Chăm sóc sức khỏe sinh sản" đã được duyệt',
        time: '1 giờ trước',
        icon: '📝',
        color: '#8b5cf6',
      },
      {
        id: 4,
        type: 'payment',
        message: 'Thanh toán 350.000đ cho dịch vụ xét nghiệm đã hoàn tất',
        time: '2 giờ trước',
        icon: '💳',
        color: '#f59e0b',
      },
      {
        id: 5,
        type: 'consultation',
        message: 'Câu hỏi tư vấn mới từ người dùng "user123"',
        time: '3 giờ trước',
        icon: '💬',
        color: '#ef4444',
      },
      {
        id: 6,
        type: 'lab_booking',
        message: 'Đặt lịch xét nghiệm STD Panel cho ngày 25/12/2024',
        time: '4 giờ trước',
        icon: '🧪',
        color: '#06b6d4',
      },
    ];

    setChartData(generateChartData());
    setRecentActivities(generateRecentActivities());
  }, []);

  const quickActions = [
    {
      title: 'Thêm người dùng',
      description: 'Tạo tài khoản mới',
      icon: '👥',
      color: '#10b981',
      action: () => console.log('Add user'),
    },
    {
      title: 'Xem báo cáo',
      description: 'Báo cáo tổng quan',
      icon: '📊',
      color: '#3b82f6',
      action: () => console.log('View reports'),
    },
    {
      title: 'Quản lý bài viết',
      description: 'Duyệt nội dung',
      icon: '📝',
      color: '#8b5cf6',
      action: () => console.log('Manage content'),
    },
    {
      title: 'Cài đặt hệ thống',
      description: 'Cấu hình chung',
      icon: '⚙️',
      color: '#f59e0b',
      action: () => console.log('Settings'),
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bảng điều khiển</h1>
        <p>Chào mừng quay trở lại! Đây là tổng quan hệ thống của bạn.</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div
            className="kpi-icon"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            👥
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Tổng số người dùng</div>
            <div className="kpi-value">{formatNumber(kpiData.totalUsers)}</div>
            <div className="kpi-change positive">+12% từ tháng trước</div>
          </div>
        </div>

        <div className="kpi-card">
          <div
            className="kpi-icon"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            }}
          >
            📈
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Người dùng mới (30 ngày)</div>
            <div className="kpi-value">{formatNumber(kpiData.newUsers)}</div>
            <div className="kpi-change positive">+8% từ tháng trước</div>
          </div>
        </div>

        <div className="kpi-card">
          <div
            className="kpi-icon"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            }}
          >
            💰
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Doanh thu</div>
            <div className="kpi-value">{formatCurrency(kpiData.revenue)}</div>
            <div className="kpi-change positive">+15% từ tháng trước</div>
          </div>
        </div>

        <div className="kpi-card">
          <div
            className="kpi-icon"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            }}
          >
            ⚡
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Hoạt động quan trọng</div>
            <div className="kpi-value">{formatNumber(kpiData.activities)}</div>
            <div className="kpi-change neutral">Trong 24h qua</div>
          </div>
        </div>
      </div>

      {/* Charts and Activity Section */}
      <div className="dashboard-main">
        {/* User Growth Chart */}
        <div className="chart-section">
          <div className="section-header">
            <h2>Tăng trưởng người dùng</h2>
            <p>Số lượng đăng ký mới trong 30 ngày qua</p>
          </div>
          <div className="chart-container">
            <LineChart data={chartData} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <div className="section-header">
            <h2>Thao tác nhanh</h2>
            <p>Các chức năng thường dùng</p>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="quick-action-card"
                onClick={action.action}
              >
                <div
                  className="action-icon"
                  style={{ backgroundColor: action.color }}
                >
                  {action.icon}
                </div>
                <div className="action-content">
                  <div className="action-title">{action.title}</div>
                  <div className="action-description">{action.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="activities-section">
        <div className="section-header">
          <h2>Hoạt động gần đây</h2>
          <p>Các sự kiện mới nhất trong hệ thống</p>
        </div>
        <div className="activities-list">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div
                className="activity-icon"
                style={{ backgroundColor: activity.color }}
              >
                {activity.icon}
              </div>
              <div className="activity-content">
                <div className="activity-message">{activity.message}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="activities-footer">
          <button className="view-all-btn">Xem tất cả hoạt động</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
