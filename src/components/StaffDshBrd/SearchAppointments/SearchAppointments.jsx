import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Table,
  Tag,
  Space,
  DatePicker,
  Select,
  Modal,
  Form,
  Upload,
  message,
  Tooltip,
  Badge,
  Divider,
  Collapse,
} from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  EditOutlined,
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ClearOutlined,
  ExperimentOutlined,
  UploadOutlined,
  DownOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './SearchAppointments.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const SearchAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Search filters
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Update modal
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [testResults, setTestResults] = useState({});

  // Mock historical data với nhiều xét nghiệm
  const mockHistoricalAppointments = [
    {
      id: 'XN001',
      customerName: 'Nguyễn Văn An',
      customerPhone: '0901234567',
      tests: [
        {
          id: 'T001',
          name: 'Xét nghiệm máu tổng quát',
          status: 'completed',
          priority: 'normal',
          results: { file: 'ket-qua-t001.pdf', notes: 'Bình thường' },
        },
        {
          id: 'T002',
          name: 'Xét nghiệm đường huyết',
          status: 'completed',
          priority: 'normal',
          results: { file: 'ket-qua-t002.pdf', notes: 'Hơi cao' },
        },
      ],
      appointmentDate: '2024-01-10',
      appointmentTime: '08:30',
      shift: 'morning',
      overallStatus: 'completed',
      notes: 'Khách hàng hài lòng với kết quả',
      staffId: 'ST001',
      staffName: 'Nguyễn Thị Mai',
    },
    {
      id: 'XN002',
      customerName: 'Trần Thị Bình',
      customerPhone: '0907654321',
      tests: [
        {
          id: 'T003',
          name: 'Xét nghiệm nước tiểu',
          status: 'has-result',
          priority: 'high',
          results: { file: 'ket-qua-t003.pdf', notes: 'Có protein nhẹ' },
        },
      ],
      appointmentDate: '2024-01-12',
      appointmentTime: '14:00',
      shift: 'afternoon',
      overallStatus: 'has-result',
      notes: 'Cần tư vấn thêm',
      staffId: 'ST002',
      staffName: 'Lê Văn Cường',
    },
    {
      id: 'XN003',
      customerName: 'Phạm Thị Dung',
      customerPhone: '0912345678',
      tests: [
        {
          id: 'T004',
          name: 'Xét nghiệm HIV',
          status: 'completed',
          priority: 'urgent',
          results: { file: 'ket-qua-t004.pdf', notes: 'Âm tính' },
        },
        {
          id: 'T005',
          name: 'Xét nghiệm Syphilis',
          status: 'completed',
          priority: 'urgent',
          results: { file: 'ket-qua-t005.pdf', notes: 'Âm tính' },
        },
      ],
      appointmentDate: '2024-01-15',
      appointmentTime: '10:00',
      shift: 'morning',
      overallStatus: 'completed',
      notes: 'Xử lý khẩn cấp thành công',
      staffId: 'ST001',
      staffName: 'Nguyễn Thị Mai',
    },
    {
      id: 'XN004',
      customerName: 'Lê Hoàng Minh',
      customerPhone: '0909876543',
      tests: [
        {
          id: 'T006',
          name: 'Xét nghiệm gan',
          status: 'in-progress',
          priority: 'normal',
          results: null,
        },
      ],
      appointmentDate: '2024-01-16',
      appointmentTime: '09:30',
      shift: 'morning',
      overallStatus: 'in-progress',
      notes: 'Đang xử lý',
      staffId: 'ST003',
      staffName: 'Hoàng Thị Lan',
    },
    // Thêm nhiều dữ liệu để test pagination
    ...Array.from({ length: 25 }, (_, index) => ({
      id: `XN${(index + 5).toString().padStart(3, '0')}`,
      customerName: `Khách hàng ${index + 5}`,
      customerPhone: `090${(1234567 + index).toString()}`,
      tests: [
        {
          id: `T${(index + 7).toString().padStart(3, '0')}`,
          name: 'Xét nghiệm tổng quát',
          status: ['pending', 'in-progress', 'has-result', 'completed'][
            index % 4
          ],
          priority: ['normal', 'high', 'urgent'][index % 3],
          results:
            index % 2 === 0
              ? { file: `ket-qua-t${index + 7}.pdf`, notes: 'Bình thường' }
              : null,
        },
      ],
      appointmentDate: dayjs()
        .subtract(Math.floor(index / 5), 'day')
        .format('YYYY-MM-DD'),
      appointmentTime: `${8 + (index % 8)}:${['00', '15', '30', '45'][index % 4]}`,
      shift: index % 2 === 0 ? 'morning' : 'afternoon',
      overallStatus: ['pending', 'in-progress', 'has-result', 'completed'][
        index % 4
      ],
      notes: `Ghi chú ${index + 5}`,
      staffId: `ST${((index % 3) + 1).toString().padStart(3, '0')}`,
      staffName: ['Nguyễn Thị Mai', 'Lê Văn Cường', 'Hoàng Thị Lan'][index % 3],
    })),
  ];

  useEffect(() => {
    searchAppointments();
  }, [currentPage, pageSize]);

  const searchAppointments = async () => {
    setSearchLoading(true);

    // Simulate API call với filters
    setTimeout(() => {
      let filtered = [...mockHistoricalAppointments];

      // Filter by search text
      if (searchText) {
        filtered = filtered.filter(
          (apt) =>
            apt.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
            apt.customerPhone.includes(searchText) ||
            apt.id.toLowerCase().includes(searchText.toLowerCase()) ||
            apt.tests.some((test) =>
              test.name.toLowerCase().includes(searchText.toLowerCase())
            )
        );
      }

      // Filter by date range
      if (dateRange && dateRange.length === 2) {
        const [startDate, endDate] = dateRange;
        filtered = filtered.filter((apt) => {
          const aptDate = dayjs(apt.appointmentDate);
          return (
            aptDate.isAfter(startDate.subtract(1, 'day')) &&
            aptDate.isBefore(endDate.add(1, 'day'))
          );
        });
      }

      // Filter by status
      if (statusFilter !== 'all') {
        filtered = filtered.filter((apt) => apt.overallStatus === statusFilter);
      }

      // Filter by shift
      if (shiftFilter !== 'all') {
        filtered = filtered.filter((apt) => apt.shift === shiftFilter);
      }

      // Filter by priority
      if (priorityFilter !== 'all') {
        filtered = filtered.filter((apt) =>
          apt.tests.some((test) => test.priority === priorityFilter)
        );
      }

      // Pagination
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filtered.slice(startIndex, endIndex);

      setAppointments(filtered);
      setFilteredAppointments(paginatedData);
      setTotal(filtered.length);
      setSearchLoading(false);
    }, 800);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    searchAppointments();
  };

  const handleClearFilters = () => {
    setSearchText('');
    setDateRange([]);
    setStatusFilter('all');
    setShiftFilter('all');
    setPriorityFilter('all');
    setCurrentPage(1);
    setTimeout(() => {
      searchAppointments();
    }, 100);
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
        text: 'Đang xử lý',
        icon: <ClockCircleOutlined />,
      },
      'has-result': {
        color: 'green',
        text: 'Đã có kết quả',
        icon: <DownloadOutlined />,
      },
      completed: {
        color: 'default',
        text: 'Đã hoàn thành',
        icon: <DownloadOutlined />,
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

  const getShiftConfig = (shift) => {
    const configs = {
      morning: { color: 'blue', text: 'Ca sáng' },
      afternoon: { color: 'green', text: 'Ca chiều' },
      evening: { color: 'purple', text: 'Ca tối' },
    };
    return configs[shift] || configs.morning;
  };

  const handleUpdateAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.overallStatus);
    setInternalNotes(appointment.notes || '');

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
      // Update in local data
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

      // Refresh the filtered data
      searchAppointments();

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
                    <DownloadOutlined style={{ color: '#52c41a' }} />
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
      width: 160,
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
      width: 280,
      render: (_, record) => renderTestsList(record.tests),
    },
    {
      title: 'Ngày & Ca',
      key: 'dateTime',
      width: 140,
      render: (_, record) => {
        const shiftConfig = getShiftConfig(record.shift);
        return (
          <Space direction="vertical" size="small">
            <span>
              <CalendarOutlined />{' '}
              {dayjs(record.appointmentDate).format('DD/MM/YYYY')}
            </span>
            <span>
              <ClockCircleOutlined /> {record.appointmentTime}
            </span>
            <Tag color={shiftConfig.color}>{shiftConfig.text}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Trạng thái',
      key: 'overallStatus',
      width: 120,
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
      title: 'Nhân viên',
      key: 'staff',
      width: 120,
      render: (_, record) => <span>{record.staffName}</span>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="Cập nhật">
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

  return (
    <div className="search-appointments">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h2>Tìm kiếm Lịch hẹn</h2>
          <p>Tra cứu và cập nhật lịch sử các lịch hẹn xét nghiệm</p>
        </div>
      </div>

      {/* Search Filters */}
      <Card className="search-filters" style={{ marginBottom: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* Text Search */}
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Tìm theo tên, SĐT, ID lịch hẹn, loại xét nghiệm..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                placeholder={['Từ ngày', 'Đến ngày']}
                format="DD/MM/YYYY"
                value={dateRange}
                onChange={setDateRange}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder="Ca làm việc"
                value={shiftFilter}
                onChange={setShiftFilter}
                style={{ width: '100%' }}
              >
                <Option value="all">Tất cả ca</Option>
                <Option value="morning">Ca sáng</Option>
                <Option value="afternoon">Ca chiều</Option>
                <Option value="evening">Ca tối</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Select
                placeholder="Trạng thái"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: '100%' }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="pending">Chờ xử lý</Option>
                <Option value="in-progress">Đang xử lý</Option>
                <Option value="has-result">Đã có kết quả</Option>
                <Option value="completed">Đã hoàn thành</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="Độ ưu tiên"
                value={priorityFilter}
                onChange={setPriorityFilter}
                style={{ width: '100%' }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="normal">Thường</Option>
                <Option value="high">Cao</Option>
                <Option value="urgent">Khẩn cấp</Option>
              </Select>
            </Col>
          </Row>

          {/* Action Buttons */}
          <Row justify="space-between">
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  loading={searchLoading}
                >
                  Tìm kiếm
                </Button>
                <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
                  Xóa bộ lọc
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setCurrentPage(1);
                    searchAppointments();
                  }}
                >
                  Làm mới
                </Button>
              </Space>
            </Col>
            <Col>
              <Badge count={total} showZero overflowCount={999}>
                <span>Tổng kết quả</span>
              </Badge>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Results Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredAppointments}
          rowKey="id"
          loading={searchLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong ${total} lịch hẹn`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            onShowSizeChange: (current, size) => {
              setCurrentPage(1);
              setPageSize(size);
            },
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Update Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            Cập nhật lịch hẹn - {selectedAppointment?.id}
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
              <Row gutter={16}>
                <Col span={8}>
                  <strong>Khách hàng:</strong>{' '}
                  {selectedAppointment.customerName}
                </Col>
                <Col span={8}>
                  <strong>SĐT:</strong> {selectedAppointment.customerPhone}
                </Col>
                <Col span={8}>
                  <strong>Ngày hẹn:</strong>{' '}
                  {dayjs(selectedAppointment.appointmentDate).format(
                    'DD/MM/YYYY'
                  )}
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

export default SearchAppointments;
