import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Button,
  Modal,
  Select,
  Upload,
  Input,
  message,
  Card,
  Row,
  Col,
  Space,
  Badge,
  Tooltip,
  Progress,
  Collapse,
  List,
  Checkbox,
  Form,
  Divider,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  UploadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  FileTextOutlined,
  ReloadOutlined,
  ExperimentOutlined,
  DownOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import './TodayAppointments.css';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Form states for update modal
  const [newStatus, setNewStatus] = useState('');
  const [resultFiles, setResultFiles] = useState([]);
  const [internalNotes, setInternalNotes] = useState('');
  const [testResults, setTestResults] = useState({});

  // Mock data với nhiều xét nghiệm
  const mockAppointments = [
    {
      id: 'XN001',
      customerName: 'Nguyễn Văn An',
      customerPhone: '0901234567',
      tests: [
        {
          id: 'T001',
          name: 'Xét nghiệm máu tổng quát',
          status: 'pending',
          priority: 'normal',
          estimatedTime: 30,
          results: null,
        },
        {
          id: 'T002',
          name: 'Xét nghiệm đường huyết',
          status: 'pending',
          priority: 'normal',
          estimatedTime: 20,
          results: null,
        },
      ],
      appointmentTime: '08:30',
      overallStatus: 'pending',
      notes: 'Khách hàng nhịn ăn từ 10h tối hôm trước',
      createdAt: '2024-01-15T07:30:00',
    },
    {
      id: 'XN002',
      customerName: 'Trần Thị Bình',
      customerPhone: '0907654321',
      tests: [
        {
          id: 'T003',
          name: 'Xét nghiệm nước tiểu',
          status: 'in-progress',
          priority: 'high',
          estimatedTime: 15,
          results: null,
        },
      ],
      appointmentTime: '09:00',
      overallStatus: 'in-progress',
      notes: '',
      createdAt: '2024-01-15T08:00:00',
    },
    {
      id: 'XN003',
      customerName: 'Lê Hoàng Cường',
      customerPhone: '0909876543',
      tests: [
        {
          id: 'T004',
          name: 'Xét nghiệm đường huyết',
          status: 'completed',
          priority: 'normal',
          estimatedTime: 20,
          results: { file: 'ket-qua-t004.pdf', notes: 'Bình thường' },
        },
        {
          id: 'T005',
          name: 'Xét nghiệm cholesterol',
          status: 'has-result',
          priority: 'normal',
          estimatedTime: 25,
          results: { file: 'ket-qua-t005.pdf', notes: 'Cao hơn bình thường' },
        },
      ],
      appointmentTime: '09:30',
      overallStatus: 'has-result',
      notes: 'Đã có kết quả',
      createdAt: '2024-01-15T08:30:00',
    },
    {
      id: 'XN004',
      customerName: 'Phạm Thị Dung',
      customerPhone: '0912345678',
      tests: [
        {
          id: 'T006',
          name: 'Xét nghiệm HIV',
          status: 'has-result',
          priority: 'urgent',
          estimatedTime: 45,
          results: { file: 'ket-qua-t006.pdf', notes: 'Âm tính' },
        },
        {
          id: 'T007',
          name: 'Xét nghiệm Syphilis',
          status: 'pending',
          priority: 'urgent',
          estimatedTime: 30,
          results: null,
        },
      ],
      appointmentTime: '10:00',
      overallStatus: 'in-progress',
      notes: 'Cần xử lý khẩn cấp',
      createdAt: '2024-01-15T09:00:00',
    },
  ];

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, statusFilter]);

  const fetchTodayAppointments = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  };

  const filterAppointments = () => {
    let filtered = appointments;
    if (statusFilter !== 'all') {
      filtered = appointments.filter(
        (apt) => apt.overallStatus === statusFilter
      );
    }
    setFilteredAppointments(filtered);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'orange',
        text: 'Chờ xử lý',
        icon: <ClockCircleOutlined />,
      },
      'in-progress': {
        color: 'blue',
        text: 'Đang xét nghiệm',
        icon: <SyncOutlined spin />,
      },
      'has-result': {
        color: 'green',
        text: 'Đã có kết quả',
        icon: <CheckCircleOutlined />,
      },
      completed: {
        color: 'default',
        text: 'Đã hoàn thành',
        icon: <CheckCircleOutlined />,
      },
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      normal: { color: 'default', text: 'Thường' },
      high: { color: 'orange', text: 'Cao' },
      urgent: { color: 'red', text: 'Khẩn cấp' },
    };
    return configs[priority] || configs.normal;
  };

  const calculateOverallStatus = (tests) => {
    if (tests.every((test) => test.status === 'completed')) return 'completed';
    if (tests.some((test) => test.status === 'has-result')) return 'has-result';
    if (tests.some((test) => test.status === 'in-progress'))
      return 'in-progress';
    return 'pending';
  };

  const handleUpdateAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.overallStatus);
    setInternalNotes(appointment.notes || '');
    setResultFiles([]);

    // Initialize test results state
    const initialTestResults = {};
    appointment.tests.forEach((test) => {
      initialTestResults[test.id] = {
        status: test.status,
        notes: test.results?.notes || '',
        file: null,
      };
    });
    setTestResults(initialTestResults);

    setUpdateModalVisible(true);
  };

  const handleTestStatusChange = (testId, status) => {
    setTestResults((prev) => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        status: status,
      },
    }));
  };

  const handleTestNotesChange = (testId, notes) => {
    setTestResults((prev) => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        notes: notes,
      },
    }));
  };

  const handleFileUpload = (testId, fileList) => {
    setTestResults((prev) => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        file: fileList[0] || null,
      },
    }));
  };

  const handleSaveUpdate = async () => {
    if (!selectedAppointment) return;

    setUpdating(true);

    // Simulate API call
    setTimeout(() => {
      const updatedAppointments = appointments.map((apt) =>
        apt.id === selectedAppointment.id
          ? {
              ...apt,
              notes: internalNotes,
              overallStatus: newStatus,
              tests: apt.tests.map((test) => ({
                ...test,
                status: testResults[test.id]?.status || test.status,
                results:
                  testResults[test.id]?.notes || testResults[test.id]?.file
                    ? {
                        notes: testResults[test.id]?.notes || '',
                        file:
                          testResults[test.id]?.file?.name ||
                          test.results?.file ||
                          null,
                      }
                    : test.results,
              })),
            }
          : apt
      );

      setAppointments(updatedAppointments);
      setUpdateModalVisible(false);
      setUpdating(false);

      message.success('Cập nhật thành công! Đã gửi thông báo cho khách hàng.');
    }, 1500);
  };

  const renderTestsList = (tests) => {
    return (
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {tests.map((test) => {
          const statusConfig = getStatusConfig(test.status);
          const priorityConfig = getPriorityConfig(test.priority);

          return (
            <div key={test.id} className="test-item">
              <Space>
                <ExperimentOutlined style={{ color: statusConfig.color }} />
                <span className="test-name">{test.name}</span>
                <Tag color={statusConfig.color} icon={statusConfig.icon}>
                  {statusConfig.text}
                </Tag>
                <Tag color={priorityConfig.color}>{priorityConfig.text}</Tag>
                {test.results && (
                  <Tooltip title="Đã có kết quả">
                    <FileTextOutlined style={{ color: '#52c41a' }} />
                  </Tooltip>
                )}
              </Space>
            </div>
          );
        })}
      </Space>
    );
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => <code>{id}</code>,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <strong>{record.customerName}</strong>
          <span className="phone-number">{record.customerPhone}</span>
        </Space>
      ),
    },
    {
      title: 'Các xét nghiệm',
      key: 'tests',
      width: 300,
      render: (_, record) => renderTestsList(record.tests),
    },
    {
      title: 'Thời gian',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
      width: 100,
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          <strong>{time}</strong>
        </Space>
      ),
    },
    {
      title: 'Trạng thái tổng',
      key: 'overallStatus',
      width: 150,
      render: (_, record) => {
        const config = getStatusConfig(record.overallStatus);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Cập nhật kết quả">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleUpdateAppointment(record)}
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const statsCards = [
    {
      title: 'Tổng lịch hẹn',
      value: appointments.length,
      color: '#1890ff',
      icon: <CalendarOutlined />,
    },
    {
      title: 'Chờ xử lý',
      value: appointments.filter((apt) => apt.overallStatus === 'pending')
        .length,
      color: '#faad14',
      icon: <ClockCircleOutlined />,
    },
    {
      title: 'Đang xử lý',
      value: appointments.filter((apt) => apt.overallStatus === 'in-progress')
        .length,
      color: '#13c2c2',
      icon: <SyncOutlined />,
    },
    {
      title: 'Đã hoàn thành',
      value: appointments.filter((apt) =>
        ['completed', 'has-result'].includes(apt.overallStatus)
      ).length,
      color: '#52c41a',
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <div className="today-appointments">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h2>Lịch hẹn Hôm nay</h2>
          <p>Quản lý các lịch hẹn xét nghiệm trong ngày</p>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchTodayAppointments}
          loading={loading}
        >
          Làm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statsCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              className="stats-card"
              style={{ borderLeft: `4px solid ${card.color}` }}
            >
              <Row align="middle">
                <Col span={18}>
                  <div className="stats-content">
                    <div className="stats-title">{card.title}</div>
                    <div className="stats-value">{card.value}</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="stats-icon" style={{ color: card.color }}>
                    {card.icon}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space>
              <span>Lọc theo trạng thái:</span>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 200 }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="pending">Chờ xử lý</Option>
                <Option value="in-progress">Đang xử lý</Option>
                <Option value="has-result">Đã có kết quả</Option>
                <Option value="completed">Đã hoàn thành</Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Appointments Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredAppointments}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong ${total} lịch hẹn`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Update Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            Cập nhật kết quả xét nghiệm - {selectedAppointment?.id}
          </Space>
        }
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        onOk={handleSaveUpdate}
        confirmLoading={updating}
        width={800}
        okText="Lưu và gửi thông báo"
        cancelText="Hủy"
      >
        {selectedAppointment && (
          <div className="update-modal-content">
            {/* Customer Info */}
            <Card size="small" style={{ marginBottom: '16px' }}>
              <Row>
                <Col span={12}>
                  <strong>Khách hàng:</strong>{' '}
                  {selectedAppointment.customerName}
                </Col>
                <Col span={12}>
                  <strong>SĐT:</strong> {selectedAppointment.customerPhone}
                </Col>
              </Row>
            </Card>

            {/* Overall Status */}
            <Form.Item label="Trạng thái tổng quát">
              <Select
                value={newStatus}
                onChange={setNewStatus}
                style={{ width: '100%' }}
              >
                <Option value="pending">Chờ xử lý</Option>
                <Option value="in-progress">Đang xử lý</Option>
                <Option value="has-result">Đã có kết quả</Option>
                <Option value="completed">Đã hoàn thành</Option>
              </Select>
            </Form.Item>

            {/* Tests Management */}
            <Form.Item label="Cập nhật từng xét nghiệm">
              <Collapse
                defaultActiveKey={selectedAppointment.tests.map(
                  (test) => test.id
                )}
                expandIcon={({ isActive }) => (
                  <DownOutlined rotate={isActive ? 180 : 0} />
                )}
              >
                {selectedAppointment.tests.map((test) => (
                  <Panel
                    header={
                      <Space>
                        <ExperimentOutlined />
                        <span>{test.name}</span>
                        <Tag color={getStatusConfig(test.status).color}>
                          {getStatusConfig(test.status).text}
                        </Tag>
                        <Tag color={getPriorityConfig(test.priority).color}>
                          {getPriorityConfig(test.priority).text}
                        </Tag>
                      </Space>
                    }
                    key={test.id}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Form.Item label="Trạng thái">
                        <Select
                          value={testResults[test.id]?.status || test.status}
                          onChange={(value) =>
                            handleTestStatusChange(test.id, value)
                          }
                          style={{ width: '100%' }}
                        >
                          <Option value="pending">Chờ xử lý</Option>
                          <Option value="in-progress">Đang xử lý</Option>
                          <Option value="has-result">Đã có kết quả</Option>
                          <Option value="completed">Đã hoàn thành</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item label="Ghi chú kết quả">
                        <TextArea
                          value={testResults[test.id]?.notes || ''}
                          onChange={(e) =>
                            handleTestNotesChange(test.id, e.target.value)
                          }
                          placeholder="Nhập ghi chú về kết quả xét nghiệm..."
                          rows={3}
                        />
                      </Form.Item>

                      <Form.Item label="Upload kết quả (PDF)">
                        <Upload
                          beforeUpload={() => false}
                          accept=".pdf"
                          maxCount={1}
                          onChange={({ fileList }) =>
                            handleFileUpload(test.id, fileList)
                          }
                        >
                          <Button icon={<UploadOutlined />}>
                            Chọn file PDF
                          </Button>
                        </Upload>
                      </Form.Item>
                    </Space>
                  </Panel>
                ))}
              </Collapse>
            </Form.Item>

            {/* Internal Notes */}
            <Form.Item label="Ghi chú nội bộ">
              <TextArea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Nhập ghi chú nội bộ cho đồng nghiệp..."
                rows={4}
              />
            </Form.Item>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TodayAppointments;
