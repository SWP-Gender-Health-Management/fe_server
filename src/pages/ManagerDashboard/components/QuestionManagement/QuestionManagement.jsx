import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Tag,
  Avatar,
  Typography,
  Space,
  Pagination,
  Card,
  Statistic,
  Row,
  Col,
  Tooltip,
  message,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import './QuestionManagement.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';

const { Text, Title } = Typography;
const { Option } = Select;

const API_URL = 'http://localhost:3000';

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    answered: 0,
    pending: 0,
  });

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, statusFilter]);

  const fetchQuestions = async () => {
    setLoading(true);
    const accessToken = Cookies.get('accessToken');

    try {
      const params = {
        page: currentPage,
        limit: pageSize,
      };

      // Add filter params based on status
      if (statusFilter === 'answered') {
        params.is_replied = 'true';
      } else if (statusFilter === 'pending') {
        params.is_replied = 'false';
      }

      const response = await axios.get(`${API_URL}/manager/get-questions`, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.result) {
        setQuestions(response.data.result.result || []);
        setTotalQuestions(response.data.result.total || 0);

        // Calculate stats
        const allQuestions = response.data.result.result || [];
        const answered = allQuestions.filter((q) => q.reply?.content).length;
        const pending = allQuestions.filter((q) => !q.reply?.content).length;

        setStats({
          total: allQuestions.length,
          answered,
          pending,
        });
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      message.error('Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (question) => {
    const hasReply = question.reply?.content;

    if (hasReply) {
      return (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          Đã trả lời
        </Tag>
      );
    } else {
      return (
        <Tag color="warning" icon={<ClockCircleOutlined />}>
          Chờ trả lời
        </Tag>
      );
    }
  };

  const handleViewDetail = (question) => {
    setSelectedQuestion(question);
    setModalVisible(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    return moment(dateString).format('DD/MM/YYYY HH:mm');
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      !searchText ||
      question.customer?.toLowerCase().includes(searchText.toLowerCase()) ||
      question.content?.toLowerCase().includes(searchText.toLowerCase());

    return matchesSearch;
  });

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      width: 200,
      render: (customer) => (
        <Space>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{ backgroundColor: '#667eea' }}
          >
            {customer?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <Text strong>{customer}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (content) => (
        <Tooltip title={content}>
          <Text>
            {content?.length > 100
              ? `${content.substring(0, 100)}...`
              : content}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 150,
      align: 'center',
      render: (_, record) => getStatusTag(record),
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date) => (
        <Space>
          <CalendarOutlined />
          <Text>{formatDate(date)}</Text>
        </Space>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
          size="small"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="question-management-container">
      {/* Header */}
      <div className="page-header">
        <Title level={2}>
          <QuestionCircleOutlined style={{ marginRight: 12 }} />
          Quản lý câu hỏi khách hàng
        </Title>
        <Text type="secondary">
          Quản lý và theo dõi các câu hỏi từ khách hàng
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng câu hỏi"
              value={stats.total}
              prefix={<QuestionCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đã trả lời"
              value={stats.answered}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Chờ trả lời"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm theo tên khách hàng hoặc nội dung..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">Tất cả</Option>
              <Option value="pending">Chờ trả lời</Option>
              <Option value="answered">Đã trả lời</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={10}>
            <Space>
              <Button type="primary" onClick={fetchQuestions} loading={loading}>
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Questions Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredQuestions}
          loading={loading}
          pagination={false}
          rowKey={(record, index) => `question-${index}`}
          locale={{
            emptyText: 'Không có câu hỏi nào',
          }}
        />

        {/* Custom Pagination */}
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalQuestions}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} câu hỏi`
            }
          />
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <QuestionCircleOutlined />
            Chi tiết câu hỏi
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedQuestion && (
          <div className="question-detail">
            {/* Customer Info */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space>
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#667eea' }}
                >
                  {selectedQuestion.customer?.charAt(0)?.toUpperCase()}
                </Avatar>
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    {selectedQuestion.customer}
                  </Title>
                  <Text type="secondary">
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {formatDate(selectedQuestion.created_at)}
                  </Text>
                </div>
              </Space>
            </Card>

            {/* Question Content */}
            <Card
              title="Nội dung câu hỏi"
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Text>{selectedQuestion.content}</Text>
            </Card>

            {/* Reply Content */}
            <Card
              title={
                <Space>
                  Trả lời
                  {getStatusTag(selectedQuestion)}
                </Space>
              }
              size="small"
            >
              {selectedQuestion.reply?.content ? (
                <div>
                  <Text>{selectedQuestion.reply.content}</Text>
                  {selectedQuestion.reply.created_at && (
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        Trả lời vào:{' '}
                        {formatDate(selectedQuestion.reply.created_at)}
                      </Text>
                    </div>
                  )}
                </div>
              ) : (
                <Text type="secondary" italic>
                  Chưa có câu trả lời
                </Text>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuestionManagement;
