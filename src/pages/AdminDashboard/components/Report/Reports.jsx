import React, { useState, useEffect } from 'react';
import LineChart from '../Chart/LineChart';
import PieChart from '../Chart/PieChart';
import './Reports.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000';


const Reports = () => {
  const [reportData, setReportData] = useState({
    userStats: {
      total: 0,
      newThisMonth: 0,
      activeToday: 0,
      byRole: {
        customer: 2450,
        consultant: 15,
        staff: 8,
        manager: 4,
        admin: 2,
      },
    },
    revenueStats: {
      total: 0,
      thisMonth: 0,
      growth: 0,
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
      total: 0,
      average: 0,
      ratings: {
        5: 456,
        4: 298,
        3: 102,
        2: 26,
        1: 10,
      },
    },
  });

  const [reportOverallData, setReportOverallData] = useState({
    sumFeedRating: 0,
    totalApp: 0,
    totalCon: 0,
    totalCustomer: 0,
    totalFeed: 0,
    totalLab: 0,
    totalNewCus: 0,
    totalRevenue: 0,
  });

  const [customerChartData, setCustomerChartData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [accountPieChartData, setAccountPieChartData] = useState([]);
  const [serviceRevenuePieChartData, setServiceRevenuePieChartData] = useState([]);
  const [feedBackPieChartData, setFeedBackPieChartData] = useState([]);

  const [selectedPeriod, setSelectedPeriod] = useState('30days');


  useEffect(() => {
    if (selectedPeriod) {
      fetchReportData();
      fetchCustomerChartData();
      fetchRevenueChartData();
      fetchAccountPieChartData();
      fetchServiceRevenuePieChartData();
      fetchFeedBackPieChartData();
    }
  }, [selectedPeriod]);

  const fetchFeedBackPieChartData = async () => {
    const accessToken = Cookies.get('accessToken');
    const accountId = Cookies.get('accountId');
    try {
      await axios.get(`${API_URL}/admin/get-percent-feedback`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((response) => {
        const data = response.data.data;
        // console.log('fetchFeedBackPieChartData data: ', data);
        const feedBackPieChartData = Object.entries(data).map(
          ([rating, count]) => ({
            name: `${rating}`,
            value: count,
            label: {
              goodFeed: 'Tốt',
              badFeed: 'Xấu',
              normalFeed: 'Trung bình',
            }[rating],
          })
        );
        // console.log('feedBackPieChartData: ', feedBackPieChartData);
        setFeedBackPieChartData(feedBackPieChartData);
      });
    } catch (error) {
      console.error('fetchFeedBackPieChartData error: ', error);
    }
  };

  const fetchServiceRevenuePieChartData = async () => {
    const accessToken = Cookies.get('accessToken');
    const accountId = Cookies.get('accountId');
    try {
      await axios.get(`${API_URL}/admin/get-percent-revenue-service`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((response) => {
        const data = response.data.data;
        // console.log('fetchServiceRevenuePieChartData data: ', data);
        const serviceRevenuePieChartData = Object.entries(
          data
        ).map(([service, revenue]) => ({
          name: {
            con: 'consultation',
            lab: 'labTest',
          }[service],
          value: revenue,
          label: {
            con: 'Tư vấn',
            lab: 'Xét nghiệm',
          }[service],
        }));
        // console.log('serviceRevenuePieChartData: ', serviceRevenuePieChartData);
        setServiceRevenuePieChartData(serviceRevenuePieChartData);
      });
    } catch (error) {
      console.error('fetchServiceRevenuePieChartData error: ', error);
    }
  };

  const fetchAccountPieChartData = async () => {
    const accessToken = Cookies.get('accessToken');
    const accountId = Cookies.get('accountId');
    try {
      await axios.get(`${API_URL}/admin/get-percent-account`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((response) => {
        const data = response.data.data;
        // console.log('fetchAccountData data: ', data);
        const accountPieChartData = Object.entries(data).map(
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
        // console.log('accountPieChartData: ', accountPieChartData);
        setAccountPieChartData(accountPieChartData);
      });
    } catch (error) {
      console.error('fetchAccountData error: ', error);
    }
  };

  const fetchRevenueChartData = async () => {
    const accessToken = Cookies.get('accessToken');
    const accountId = Cookies.get('accountId');
    try {
      await axios.get(`${API_URL}/admin/get-percent-revenue`, {
        params: {
          day: selectedPeriod === '7days' ? 7 : 30,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then(async (response) => {
        const data = response.data.data;
        // console.log('fetchRevenueChartData data: ', data);
        const { listSumRevenue, listDate } = data;
        const revenueGrowthData = await Promise.all(listSumRevenue.map(async (revenue, index) => {
          const date = new Date(listDate[index]);
          const dayLabel = `${date.getDate()}/${date.getMonth() + 1}`;
          return {
            date: date.toISOString().split('T')[0],
            revenue: revenue || 0,
            label: dayLabel,
          };
        }));
        // console.log('revenueGrowthData: ', revenueGrowthData);
        setRevenueChartData(revenueGrowthData);
      });
    } catch (error) {
      console.error('fetchRevenueChartData error: ', error);
    }
  };

  const fetchCustomerChartData = async () => {
    const accessToken = Cookies.get('accessToken');
    const accountId = Cookies.get('accountId');
    try {
      await axios.get(`${API_URL}/admin/get-percent-customer`, {
        params: {
          day: selectedPeriod === '7days' ? 7 : 30,
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
            customers: count,
            label: dayLabel,
          };
        }));
        // console.log('customerGrowthData: ', customerGrowthData);
        setCustomerChartData(customerGrowthData);
      });
    } catch (error) {
      console.error('fetchCustomerChartData error: ', error);
    }
  };

  const fetchReportData = async () => {
    const accessToken = Cookies.get('accessToken');
    const accountId = Cookies.get('accountId');
    try {
      await axios.get(`${API_URL}/admin/get-report-overall`, {
        params: {
          day: selectedPeriod === '7days' ? 7 : 30,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((response) => {
        const data = response.data.data;
        // console.log('fetchReportData overall kpis data: ', data);
        setReportOverallData({
          sumFeedRating: data.sumFeedRating,
          totalApp: data.totalApp,
          totalCon: data.totalCon,
          totalCustomer: data.totalCustomer,
          totalFeed: data.totalFeed,
          totalLab: data.totalLab,
          totalNewCus: data.totalNewCus,
          totalRevenue: data.totalRevenue,
        });

      });
    } catch (error) {
      console.error('fetchReportData overall kpis error: ', error);
    }
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
            {/* <option value="90days">90 ngày qua</option> */}
          </select>
        </div>
      </div>

      {/* Tổng quan KPIs */}
      <div className="reports-overview">
        <div className="overview-card">
          <h3>Người dùng</h3>
          <div className="manager-report-metric">
            <span className="manager-report-metric-value">
              {formatNumber(reportOverallData.totalCustomer)}
            </span>
            <span className="metric-label">Tổng số</span>
          </div>
          <div className="manager-report-metric">
            <span className="manager-report-metric-value">
              {formatNumber(reportOverallData.totalNewCus)}
            </span>
            <span className="metric-label">{selectedPeriod === '7days' ? 'Mới 7 ngày qua' : 'Mới 30 ngày qua'}</span>
          </div>
        </div>

        <div className="overview-card">
          <h3>Doanh thu</h3>
          <div className="manager-report-metric">
            <span className="manager-report-metric-value">
              {formatCurrency(reportOverallData.totalRevenue)}
            </span>
            <span className="metric-label">{selectedPeriod === '7days' ? '7 ngày qua' : '30 ngày qua'}</span>
          </div>
          {/* <div className="manager-report-metric">
            <span className="manager-report-metric-value positive">
              +{reportData.revenueStats.growth}%
            </span>
            <span className="metric-label">Tăng trưởng</span>
          </div> */}
        </div>

        <div className="overview-card">
          <h3>Cuộc hẹn</h3>
          <div className="manager-report-metric">
            <span className="manager-report-metric-value">
              {formatNumber(reportOverallData.totalApp)}
            </span>
            <span className="metric-label">Tổng số</span>
          </div>
          <div className="manager-report-metric">
            <span className="manager-report-metric-value">
              {formatNumber(reportOverallData.totalCon)}
            </span>
            <span className="metric-label">Tư vấn</span>
          </div>
          <div className="manager-report-metric">
            <span className="manager-report-metric-value">
              {formatNumber(reportOverallData.totalLab)}
            </span>
            <span className="metric-label">Xét nghiệm</span>
          </div>
        </div>

        <div className="overview-card">
          <h3>Đánh giá</h3>
          <div className="manager-report-metric">
            <span className="manager-report-metric-value">
              {reportOverallData.sumFeedRating}/5
            </span>
            <span className="metric-label">Điểm trung bình</span>
          </div>
          <div className="manager-report-metric">
            <span className="manager-report-metric-value">
              {formatNumber(reportOverallData.totalFeed)}
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
          <LineChart data={customerChartData.map((item) => ({
            ...item,
            users: item.customers || 0,
          }))} />
        </div>

        {/* Revenue Chart */}
        <div className="chart-container">
          <h3>Doanh thu theo thời gian</h3>
          <LineChart
            data={revenueChartData.map((item) => ({
              ...item,
              users: item.revenue || 0,
            }))}
          />
        </div>

        {/* Appointments Chart */}
        {/* <div className="chart-container">
          <h3>Số lượng cuộc hẹn</h3>
          <LineChart
            data={chartData.appointments.map((item) => ({
              ...item,
              users: item.appointments,
            }))}
          />
        </div> */}
      </div>

      {/* Pie Charts Section */}
      <div className="pie-charts-section">
        <div className="pie-chart-container">
          <h3>Phân bố người dùng theo vai trò</h3>
          <PieChart data={accountPieChartData} />
          <div className="chart-legend">
            {accountPieChartData.map((item, index) => (
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
          <PieChart data={serviceRevenuePieChartData} />
          <div className="chart-legend">
            {serviceRevenuePieChartData.map((item, index) => (
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
          <PieChart data={feedBackPieChartData} />
          <div className="chart-legend">
            {feedBackPieChartData.map((item, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: `hsl(${index * 120}, 70%, 50%)` }}
                ></span>
                <span>
                  {item.label}: {formatNumber(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
