import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Progress,
  Tag,
  Avatar,
  Statistic,
  Timeline,
  Button,
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExperimentOutlined,
  TrophyOutlined,
  AlertOutlined,
  UserOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import './StaffOverview.css';

const StaffOverview = ({ staffData }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Mock data for staff overview
  const todayStats = {
    completed: 12,
    pending: 8,
    inProgress: 3,
    hasResult: 5,
    total: 28,
  };

  const performanceStats = {
    completionRate: 95,
    avgProcessTime: 25, // minutes
    weeklyTests: 145,
    monthlyTests: 580,
  };

  const recentActivities = [
    {
      time: '14:30',
      action: 'Hoàn thành xét nghiệm máu',
      patient: 'Nguyễn Văn A',
      status: 'completed',
    },
    {
      time: '14:15',
      action: 'Bắt đầu xét nghiệm nước tiểu',
      patient: 'Trần Thị B',
      status: 'in-progress',
    },
    {
      time: '14:00',
      action: 'Upload kết quả xét nghiệm',
      patient: 'Lê Văn C',
      status: 'completed',
    },
    {
      time: '13:45',
      action: 'Nhận mẫu xét nghiệm mới',
      patient: 'Phạm Thị D',
      status: 'pending',
    },
  ];

  const upcomingTasks = [
    {
      time: '15:00',
      task: 'Xét nghiệm HIV khẩn cấp',
      priority: 'high',
    },
    {
      time: '15:30',
      task: 'Kiểm tra máy xét nghiệm',
      priority: 'medium',
    },
    {
      time: '16:00',
      task: 'Họp team cuối ngày',
      priority: 'low',
    },
  ];

  return (
    <div className="staff-overview-page">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1>Chào mừng trở lại, {staffData?.full_name}!</h1>
            <p>
              Hôm nay là {formatDate(currentTime)} - {formatTime(currentTime)}
            </p>
            <div className="shift-info">
              <Tag color="green" icon={<CheckCircleOutlined />}>
                Trực tuyến
              </Tag>
            </div>
          </div>
          <div className="staff-avatar-large">
            <Avatar size={80} src={staffData?.avatar} icon={<UserOutlined />} />
          </div>
        </div>
      </div>

      {/* Today's Summary */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="summary-card completed">
            <Statistic
              title="Đã hoàn thành"
              value={todayStats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="summary-card pending">
            <Statistic
              title="Chờ xử lý"
              value={todayStats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="summary-card in-progress">
            <Statistic
              title="Đang xử lý"
              value={todayStats.inProgress}
              prefix={<ExperimentOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="summary-card has-result">
            <Statistic
              title="Có kết quả"
              value={todayStats.hasResult}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Performance Overview */}
        <Col xs={24} lg={12}>
          <Card title="Hiệu suất làm việc" className="performance-card">
            <div className="performance-metrics">
              <div className="metric-item">
                <div className="metric-label">Tỷ lệ hoàn thành</div>
                <Progress
                  percent={performanceStats.completionRate}
                  strokeColor="#52c41a"
                  size="small"
                />
                <div className="metric-value">
                  {performanceStats.completionRate}%
                </div>
              </div>


              <div className="stat-box">
                <div className="stat-number">
                  {performanceStats.weeklyTests}
                </div>
                <div className="stat-label">XN tuần này</div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <Card title="Bài viết chưa được duyện" className="activities-card">
            <div className="stat-box">
                <div className="stat-number">
                  {staffData.pendingBlogs}
                </div>
                <div className="stat-label">Bài viết</div>
              </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        {/* Daily Progress */}
        <Col xs={24} lg={8}>
          <Card title="Tiến độ hôm nay" className="progress-card">
            <div className="daily-progress">
              <div className="progress-circle">
                <Progress
                  type="circle"
                  percent={Math.round(
                    (todayStats.completed / todayStats.total) * 100
                  )}
                  strokeColor="#667eea"
                  size={120}
                />
              </div>
              <div className="progress-info">
                <div className="progress-text">
                  {todayStats.completed}/{todayStats.total} xét nghiệm
                </div>
                <div className="progress-label">Đã hoàn thành hôm nay</div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Upcoming Tasks */}
        <Col xs={24} lg={16}>
          <Card title="Xét nghiệm sắp tới" className="tasks-card">
            <div className="tasks-list">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="task-item">
                  <div className="task-time">
                    <ClockCircleOutlined />
                    <span>{task.time}</span>
                  </div>
                  <div className="task-content">
                    <div className="task-name">{task.task}</div>
                    <Tag
                      color={
                        task.priority === 'high'
                          ? 'red'
                          : task.priority === 'medium'
                            ? 'orange'
                            : 'blue'
                      }
                    >
                      {task.priority === 'high'
                        ? 'Khẩn cấp'
                        : task.priority === 'medium'
                          ? 'Trung bình'
                          : 'Thường'}
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      {/* <Card title="Hành động nhanh" style={{ marginTop: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Button
              type="primary"
              block
              size="large"
              icon={<ExperimentOutlined />}
            >
              Bắt đầu xét nghiệm
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button block size="large" icon={<FileTextOutlined />}>
              Upload kết quả
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button block size="large" icon={<CalendarOutlined />}>
              Xem lịch hẹn
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button block size="large" icon={<AlertOutlined />}>
              Báo cáo sự cố
            </Button>
          </Col>
        </Row>
      </Card> */}
    </div>
  );
};

export default StaffOverview;
