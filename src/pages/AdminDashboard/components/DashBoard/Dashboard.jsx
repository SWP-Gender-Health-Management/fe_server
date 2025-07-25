import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LineChart from '../Chart/LineChart';
import axios from 'axios';
import './Dashboard.css';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000/admin';
const accessToken = Cookies.get('accessToken');
const accountId = Cookies.get('accountId');

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [kpiDatas, setKpiDatas] = useState({
    totalCustomers: 0,
    totalNewCustomers: 0,
    totalRevenue: 0,
    importantNews: 0,
  });

  const kpiData = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-overall-kpis`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          day: new Date().toISOString().split('T')[0],
        },
      });
      console.log('Response:', response.data);
      const kpiData = response.data?.data
      if(response.data?.data) {
        setKpiDatas({
          ...kpiData,
          totalRevenue: kpiData.totalRevenue.total_revenue
        })
      }
      console.log('KPI data fetched successfully');
    } catch (error) {
      console.error('Error fetching KPI data:', error);
      // return null;
    } finally {

      setIsLoading(false);
    }
  };

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

        const users = Math.floor(Math.random() * 30) + 5; // 5-25 users per day
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
      description:
        'Tạo tài khoản mới cho admin, manager, staff, consultant, customer',
      icon: '👥',
      color: '#10b981',
      action: () => navigate('/admin/users'),
    },
    {
      title: 'Xem báo cáo',
      description: 'Xem báo cáo về người dùng, doanh thu, cuộc hẹn, đánh giá',
      icon: '📊',
      color: '#3b82f6',
      action: () => navigate('/admin/reports'),
    },
    {
      title: 'Gửi email hàng loạt',
      description: 'Gửi email hàng loạt cho người dùng',
      icon: '📧',
      color: '#f59e0b',
      action: () => navigate('/admin/bulk-email'),
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

  useEffect(() => {
    const kpiDatas = kpiData();
    setKpiDatas(kpiDatas);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bảng điều khiển</h1>
        <p>Chào mừng quay trở lại! Đây là tổng quan hệ thống của bạn.</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {/* Total Users */}
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
            <div className="kpi-value">{formatNumber(kpiDatas.totalCustomers)}</div>
            {/* <div className="kpi-change positive">+12% từ tháng trước</div> */}
          </div>
        </div>

        {/* New Users */}
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
            <div className="kpi-value">{formatNumber(kpiDatas.totalNewCustomers)}</div>
            {/* <div className="kpi-change positive">+8% từ tháng trước</div> */}
          </div>
        </div>

        {/* Revenue */}
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
            <div className="kpi-value">{formatCurrency(kpiDatas.totalRevenue)}</div>
            {/* <div className="kpi-change positive">+15% từ tháng trước</div> */}
          </div>
        </div>

        {/* Activities */}
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
            <div className="kpi-value">{formatNumber(kpiDatas.importantNews)}</div>
            <div className="kpi-change neutral">Trong 24h qua</div>
          </div>
        </div>
      </div>

      {/* Charts and Activity Section */}
      <div className="dashboard-main-1">
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
    </div>
  );
};

export default Dashboard;
