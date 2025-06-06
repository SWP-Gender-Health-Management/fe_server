import React from 'react';
import { Row, Col, Card, Typography, Button} from 'antd';
// import StatsCard from '@components/StatsCard';
import LineChart from '@components/AdminDashboard/LineChart';
import UserTable from '@components/AdminDashboard/UserTable';
import HealthIndicatorTable from '@components/AdminDashboard/HealthIndicator';
import './AdminDashboard.css';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  // Mock data
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      data: [250, 500, 750, 1000],
      borderColor: '#1890ff',
      tension: 0.1
    }]
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      data: [15000, 30000, 45000, 60000],
      borderColor: '#52c41a',
      tension: 0.1
    }]
  };

  const users = [
    { id: 1, status: 'Active', name: 'user14', email: 'user14@example.com' },
    { id: 2, status: 'Active', name: 'user18', email: 'user18@example.com' },
    { id: 3, status: 'Active', name: 'user4', email: 'user4@example.com' },
    { id: 4, status: 'Active', name: 'user6', email: 'user6@example.com' },
    { id: 5, status: 'Active', name: 'user12', email: 'user12@example.com' }
  ];

  const healthIndicators = [
    { id: 1, status: 'Active', name: 'Tuần thai', type: 'Number', unit: 'Week(s)' },
    { id: 2, status: 'Active', name: 'Trọng lượng mẹ', type: 'Number', unit: 'Kg' },
    { id: 3, status: 'Active', name: 'Trọng lượng con', type: 'Number', unit: 'G' }
  ];

  return (
    <div className="admin-dashboard">
      <Title level={2}>Admin Dashboard</Title>
      
      {/* Stats Section */}
      <Row gutter={16} className="stats-row">
        <Col span={12}>
          <Card title="User Growth">
            <LineChart data={userGrowthData} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Revenue by Month">
            <LineChart data={revenueData} />
          </Card>
        </Col>
      </Row>

      {/* Users Section */}
      <Card 
        title="Admin Account" 
        style={{ marginTop: 24 }}
        extra={<Title level={5}>Total Users: {users.length}</Title>}
      >
        <UserTable data={users} />
      </Card>

      {/* Pregnancy Health Indicators */}
      <Card 
        title="Admin Pregnancies" 
        style={{ marginTop: 24 }}
        extra={<Button type="primary">Add</Button>}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Diều chỉnh tính năng theo dõi sức khỏe thai kỳ</Text>
        </div>
        <HealthIndicatorTable data={healthIndicators} />
      </Card>
    </div>
  );
};

export default AdminDashboard;