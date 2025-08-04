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
  InputNumber,
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
  SyncOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './SearchAppointments.css';
import ErrorBoundary from '../../../../components/ErrorBoundary/ErrorBoundary';
import axios from 'axios';
import Cookies from 'js-cookie'; // Thêm import Cookies

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const API_URL = 'http://localhost:3000';

const SearchAppointments = ({ inputAppointments, fetchInputAppointments }) => {
  const [appointments, setAppointments] = useState(inputAppointments);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Search filters
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Update modal
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [internalDescription, setInternalDescription] = useState('');
  const [testResults, setTestResults] = useState({});
  const [resultValue, setResultValue] = useState(0);


  // Mock historical data với nhiều xét nghiệm
  // const mockHistoricalAppointments = [
  //   {
  //     app_id: 'a',
  //     queue_index: 'XN001',
  //     customer: {
  //       full_name: 'Nguyễn Văn An',
  //       phone: "0901234567",
  //       email: "a@1",
  //     },
  //     tests: [
  //       {
  //         name: 'Xét nghiệm máu tổng quát',
  //         estimatedTime: 30,
  //         result: null,
  //         status: "pending",
  //         normal_range: "1-2",
  //         specimen: "",
  //         unit: "m",
  //         conclusion: null
  //       },
  //       {
  //         name: 'Xét nghiệm đường huyết',
  //         estimatedTime: 20,
  //         result: null,
  //         status: "pending",
  //         normal_range: "1-2",
  //         specimen: "",
  //         unit: "m",
  //         conclusion: null
  //       },
  //     ],
  //     working_slot: {
  //       slot_id: "",
  //       start_at: "08:30",
  //       end_at: "",
  //       name: "Slot 2a"
  //     },
  //     date: '2024-01-10',
  //     status: 'pending',
  //     description: 'Khách hàng nhịn ăn từ 10h tối hôm trước',
  //     created_at: '2024-01-15T07:30:00',
  //   },
  //   {
  //     app_id: 'b',
  //     queue_index: 'XN001',
  //     customer: {
  //       full_name: 'Nguyễn Văn An',
  //       phone: "0901234567",
  //       email: "a@1",
  //     },
  //     tests: [
  //       {
  //         name: 'Xét nghiệm máu tổng quát',
  //         estimatedTime: 30,
  //         result: null,
  //         status: "pending",
  //         normal_range: "1-2",
  //         specimen: "",
  //         unit: "m",
  //         conclusion: null
  //       },
  //       {
  //         name: 'Xét nghiệm đường huyết',
  //         estimatedTime: 20,
  //         result: null,
  //         status: "pending",
  //         normal_range: "1-2",
  //         specimen: "",
  //         unit: "m",
  //         conclusion: null
  //       },
  //     ],
  //     working_slot: {
  //       slot_id: "",
  //       start_at: "08:30",
  //       end_at: "",
  //       name: "Slot 2a"
  //     },
  //     date: '2024-01-10',
  //     status: 'pending',
  //     description: 'Khách hàng nhịn ăn từ 10h tối hôm trước',
  //     created_at: '2024-01-15T07:30:00',
  //   }
  // ];



  useEffect(() => {
    searchAppointments();
  }, [currentPage, pageSize, appointments]);

  const searchAppointments = async () => {
    setSearchLoading(true);
    // console.log("Start to search: ", inputAppointments)
    // Simulate API call với filters
    setTimeout(() => {
      let filtered = appointments;

      // Filter by search text
      if (searchText) {
        filtered = filtered.filter(
          (apt) =>
            apt.customer.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
            apt.customer.phone.includes(searchText) ||
            apt.tests.some((test) =>
              test.name.toLowerCase().includes(searchText.toLowerCase())
            )
        );
      }

      // Filter by date range
      if (dateRange && dateRange.length === 2) {
        const [startDate, endDate] = dateRange;
        filtered = filtered.filter((apt) => {
          const aptDate = dayjs(new Date(apt.date));
          return (
            aptDate.isAfter(startDate.subtract(1, 'day')) &&
            aptDate.isBefore(endDate.add(1, 'day'))
          );
        });
      }

      // Filter by status
      if (statusFilter !== 'all') {
        filtered = filtered.filter((apt) => apt.status === statusFilter);
      }


      // Pagination
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filtered.slice(startIndex, endIndex);

      // setAppointments(filtered);
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
    setStatusFilter('all')
    setCurrentPage(1);
    setTimeout(() => {
      searchAppointments();
    }, 100);
  };

  const getStatusConfig = (status) => {
    const configs = {
      'pending': {
        color: 'orange',
        text: 'Chờ xử lý',
        icon: <ClockCircleOutlined />,
      },
      'in_progress': {
        color: 'blue',
        text: 'Đang xét nghiệm',
        icon: <SyncOutlined spin />,
      },
      'completed': {
        color: 'green',
        text: 'Đã hoàn thành',
        icon: <CheckCircleOutlined />,
      },
      'confirmed': {
        color: 'blue',
        text: 'Đã xác nhận',
        icon: <CheckCircleOutlined />,
      },
    };
    return configs[status] || configs.pending;
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
    setNewStatus(appointment.status);
    setInternalDescription(appointment.description || '');
    setResultValue(0);

    // Initialize test result state
    const initialTestResults = {};
    appointment.tests.forEach((test) => {
      initialTestResults[test.name] = {
        value: test.result ? test.result : null,
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

  const handleTestDescriptionChange = (testId, notes) => {
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

  const handleInputResult = (testId, value) => {
    setTestResults((prev) => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        value,
      },
    }));
  };



  const handleSaveUpdate = async () => {
    if (!selectedAppointment) return;
    setUpdating(true);
    try {
      let result = await Promise.all(
        selectedAppointment.tests
          .filter(test => testResults[test.name]?.value) // Only include tests with valid results
          .map(test => ({
            name: test.name,
            result: testResults[test.name].value
          }))
      );
      console.log("result entities: ", result);
      if (result.length > 0) {
        const accessToken = Cookies.get('accessToken');
        const responseUpdateResult = await axios.post(
          `${API_URL}/staff/update-result`,
          {
            result,
            app_id: selectedAppointment.app_id
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }


      if (newStatus === "completed" && selectedAppointment.tests.filter(test => test.status === "completed").length < selectedAppointment.tests.length) {
        alert("The tests of appointment haven't been completed!!!");
        return;
      }

      if (newStatus !== selectedAppointment.status) {
        const accessToken = Cookies.get('accessToken');
        const responseUpdateStatus = await axios.post(
          `${API_URL}/staff/update-appointment-status`,
          {
            status: newStatus,
            description: internalDescription,
            app_id: selectedAppointment.app_id
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      const updatedData = await fetchInputAppointments(); // Get the updated appointments
      setAppointments(updatedData); // Update child component's appointments state
      await searchAppointments(); // Refresh filteredAppointments to update UI

    } catch (error) {
      console.error("Error when save update: ", error)
    } finally {

      setUpdateModalVisible(false);
      setUpdating(false);
    }

  };

  const renderTestsList = (tests) => {
    return (
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {tests.map((test) => {
          const statusConfig = getStatusConfig(test.status);

          return (
            <div key={test.name} className="test-item">
              <Space>
                <ExperimentOutlined style={{ color: statusConfig.color }} />
                <span className="test-name">{test.name}</span>
                <Tag color={statusConfig.color} icon={statusConfig.icon}>
                  {statusConfig.text}
                </Tag>
                {test.result && (
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
      dataIndex: 'app_id',
      key: 'app_id',
      width: 80,
      render: (_, record) => (
        <>
          <code>{record.queue_index}</code><br />
          <code>{record.working_slot.name}</code>
        </>
      ),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <strong>{record.customer.full_name}</strong>
          <span className="phone-number">{record.customer.phone}</span>
          <span className="phone-number">{record.customer.email}</span>
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
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span>
            <CalendarOutlined />{' '}
            {dayjs(record.date).format('DD/MM/YYYY')}
          </span>
          <span>
            <ClockCircleOutlined />
            <strong>{record.working_slot.start_at}</strong>
          </span>
        </Space>
      ),
    },
    {
      title: 'Trạng thái tổng',
      key: 'status',
      width: 150,
      render: (_, record) => {
        const config = getStatusConfig(record.status);
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
          {/* <Tooltip title="Xem chi tiết">
             <Button
               icon={<EyeOutlined />}
               size="small"
             />
           </Tooltip> */}
        </Space>
      ),
    },
  ];

  return (
    <ErrorBoundary>
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
                  className="status-select"
                  placeholder="Trạng thái"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: '100%' }}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="pending">Chờ xử lý</Option>
                  <Option value="in_progress">Đang xét nghiệm</Option>
                  <Option value="confirmed">Đã xác nhận</Option>
                  <Option value="completed">Đã hoàn thành</Option>
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
                <Card count={total} showZero overflowCount={999}>
                  <span>Tổng kết quả: {total}</span>
                </Card>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* Results Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredAppointments}
            rowKey="app_id"
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
              Cập nhật kết quả xét nghiệm - {selectedAppointment?.working_slot.name + " - " + selectedAppointment?.queue_index}
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
                    {selectedAppointment.customer.full_name}
                  </Col>
                  <Col span={12}>
                    <strong>SĐT:</strong> {selectedAppointment.customer.phone}
                  </Col>
                  <Col span={12}>
                    <strong>Email:</strong> {selectedAppointment.customer.email}
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
                  <Option value="confirmed">Đã xác nhận</Option>
                  <Option value="in_progress">Đang xử lý</Option>
                  <Option value="completed">Đã hoàn thành</Option>
                </Select>
              </Form.Item>

              {/* Tests Management */}
              <Form.Item label="Cập nhật từng xét nghiệm">
                <Collapse
                  defaultActiveKey={selectedAppointment.tests.map(
                    (test) => test.name
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
                        </Space>
                      }
                      key={test.name}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Form.Item label="Trạng thái">
                          {getStatusConfig(test.status).text}
                        </Form.Item>

                        {/* <Form.Item label="Ghi chú kết quả">
                            <TextArea
                              value={testResults[test.name]?.description || ''}
                              onChange={(e) =>
                                handleTestDescriptionChange(test.name, e.target.value)
                              }
                              placeholder="Nhập ghi chú về kết quả xét nghiệm..."
                              rows={3}
                            />
                          </Form.Item> */}
                        {test.status !== "pending" &&
                          <Form.Item label="Nhập kết quả xé nghiệm">
                            {
                              test.result ?
                                (<p>{test.result}</p>)
                                : (<InputNumber
                                  value={null}
                                  // onChange={(e) =>
                                  //   handleInputResult(test.name, e.target.value)
                                  // }
                                  onChange={(value) => handleInputResult(test.name, value)}
                                  placeholder="Nhập kết quả xét nghiệm..."

                                />)
                            }
                          </Form.Item>
                        }
                        <Form.Item label="Đơn vị">
                          <p>{test.unit}</p>
                        </Form.Item>

                        <Form.Item label="Normal Range">
                          <p>{test.normal_range}</p>
                        </Form.Item>

                        <Form.Item label="Specimen">
                          <p>{test.specimen}</p>
                        </Form.Item>
                        {test.status !== "pending" && test.conclusion &&
                          <Form.Item label="Conclusion">
                            <p>{test.conclusion}</p>
                          </Form.Item>
                        }
                      </Space>
                    </Panel>
                  ))}
                </Collapse>
              </Form.Item>

              {/* Internal Description */}
              <Form.Item label="Ghi chú nội bộ">
                <TextArea
                  value={internalDescription}
                  onChange={(e) => setInternalDescription(e.target.value)}
                  placeholder="Nhập ghi chú nội bộ cho đồng nghiệp..."
                  rows={4}
                />
              </Form.Item>
            </div>
          )}
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default SearchAppointments;
