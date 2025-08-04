import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LineChart from '../Chart/LineChart';
import axios from 'axios';
import './Dashboard.css';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000/admin';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [kpiDatas, setKpiDatas] = useState({
    totalCustomers: 0,
    totalNewCustomers: 0,
    totalRevenue: 0,
    importantNews: 0,
  });

  const fetchKpiData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const accountId = Cookies.get('accountId');
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
      if (response.data?.data) {
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
    const fetchCustomerChartData = async () => {
      const accessToken = Cookies.get('accessToken');
      const accountId = Cookies.get('accountId');
      try {
        await axios.get(`${API_URL}/get-percent-customer`, {
          params: {
            day: 30,
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then(async (response) => {
          const data = response.data.data;
          // console.log('fetchCustomerChartData data: ', data);

          const { listCount, listDate } = data;
          const customerGrowthData = await Promise.all(listCount.map(async (count, index) => {
            const date = new Date(listDate[index]);
            const dayLabel = `${date.getDate()}/${date.getMonth() + 1}`;
            return {
              date: date.toISOString().split('T')[0],
              users: count,
              label: dayLabel,
            };
          }));
          // console.log('customerGrowthData: ', customerGrowthData);
          setChartData(customerGrowthData);
        });
      } catch (error) {
        console.error('fetchCustomerChartData error: ', error);
        return [];
      }
    };

    fetchCustomerChartData();

  }, []);

  const quickActions = [
    {
      title: 'Add User',
      description:
        'Create new accounts for admin, manager, staff, consultant, customer',
      icon: '👥',
      color: '#10b981',
      action: () => navigate('/admin/users'),
    },
    {
      title: 'View Reports',
      description: 'View reports on users, revenue, appointments, reviews',
      icon: '📊',
      color: '#3b82f6',
      action: () => navigate('/admin/reports'),
    },
    {
      title: 'Bulk Email',
      description: 'Send bulk emails to users',
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
    const kpiDatas = fetchKpiData();
    setKpiDatas(kpiDatas);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! This is your system overview.</p>
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
            <div className="kpi-label">Total Users</div>
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
            <div className="kpi-label">New Users (30 days)</div>
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
            <div className="kpi-label">Revenue</div>
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
            <div className="kpi-label">Important Activities</div>
            <div className="kpi-value">{formatNumber(kpiDatas.importantNews)}</div>
            <div className="kpi-change neutral">In the last 24h</div>
          </div>
        </div>
      </div>

      {/* Charts and Activity Section */}
      <div className="dashboard-main-1">
        {/* User Growth Chart */}
        <div className="chart-section">
          <div className="section-header">
            <h2>Tăng trưởng khách hàng</h2>
            <p>Số lượng người dùng đăng ký trong 30 ngày qua</p>
          </div>
          <div className="chart-container">
            <LineChart data={chartData} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
            <p>Common functions</p>
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
