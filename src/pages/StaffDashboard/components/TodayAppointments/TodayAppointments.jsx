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
  InputNumber,
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
import axios from 'axios';
import Cookies from 'js-cookie'; // Thêm import Cookies

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const API_URL = 'http://localhost:3000';

const TodayAppointments = ({ todayAppointments, fetchTodayAppointmentsOfStaff }) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Form states for update modal
  const [newStatus, setNewStatus] = useState('');
  const [resultValue, setResultValue] = useState(0);
  const [internalDescription, setInternalDescription] = useState('');
  const [testResults, setTestResults] = useState({});



  // Mock data với nhiều xét nghiệm
  const mockAppointments = [
    {
      app_id: 'a',
      queue_index: 'XN001',
      customer: {
        full_name: 'Nguyễn Văn An',
        phone: "0901234567",
        email: "a@1",
      },
      tests: [
        {
          name: 'Xét nghiệm máu tổng quát',
          estimatedTime: 30,
          result: null,
          status: "pending",
          normal_range: "1-2",
          specimen: "",
          unit: "m",
          conclusion: null
        },
        {
          name: 'Xét nghiệm đường huyết',
          estimatedTime: 20,
          result: null,
          status: "pending",
          normal_range: "1-2",
          specimen: "",
          unit: "m",
          conclusion: null
        },
      ],
      working_slot: {
        slot_id: "",
        start_at: "08:30",
        end_at: "",
        name: "Slot 2a"
      },
      date: '2024-01-10',
      status: 'pending',
      description: 'Khách hàng nhịn ăn từ 10h tối hôm trước',
      created_at: '2024-01-15T07:30:00',
    },
    {
      app_id: '',
      queue_index: 'XN001',
      customer: {
        full_name: 'Nguyễn Văn An',
        phone: "0901234567",
        email: "a@1",
      },
      tests: [
        {
          name: 'Xét nghiệm máu tổng quát',
          estimatedTime: 30,
          result: null,
          status: "pending",
          normal_range: "1-2",
          specimen: "",
          unit: "m",
          conclusion: null
        },
        {
          name: 'Xét nghiệm đường huyết',
          estimatedTime: 20,
          result: null,
          status: "pending",
          normal_range: "1-2",
          specimen: "",
          unit: "m",
          conclusion: null
        },
      ],
      working_slot: {
        slot_id: "",
        start_at: "08:30",
        end_at: "",
        name: "Slot 1m"
      },
      status: 'pending',
      description: 'Khách hàng nhịn ăn từ 10h tối hôm trước',
      created_at: '2024-01-15T07:30:00',
    }
  ];

  useEffect(() => {
    setAppointments(todayAppointments);
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, statusFilter]);

  const filterAppointments = () => {
    let filtered = appointments;
    if (statusFilter !== 'all') {
      filtered = appointments.filter(
        (apt) => apt.status === statusFilter
      );
    }
    setFilteredAppointments(filtered);
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




  const handleUpdateAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setInternalDescription(appointment.description || '');
    setResultValue(0);

    // Initialize test result state
    const initialTestResults = {};
    appointment.tests.forEach((test) => {
      initialTestResults[test.name] = {
        value: null,
      };
    });
    setTestResults(initialTestResults);

    setUpdateModalVisible(true);
  };

  // const handleTestStatusChange = (testId, status) => {
  //   setTestResults((prev) => ({
  //     ...prev,
  //     [testId]: {
  //       ...prev[testId],
  //       status: status,
  //     },
  //   }));
  // };

  // const handleTestDescriptionChange = (testId, description) => {
  //   setTestResults((prev) => ({
  //     ...prev,
  //     [testId]: {
  //       ...prev[testId],
  //       description: description,
  //     },
  //   }));
  // };

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
        const accessToken = Cookies.get("accessToken");
        const accountId = Cookies.get("accountId");
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

      if (
        newStatus !== selectedAppointment.status ||
        (internalDescription.trim().length > 0 &&
          (!selectedAppointment.description ||
            selectedAppointment.description.trim() !==
            internalDescription.trim()))
      ) {
        const accessToken = Cookies.get('accessToken');
        const accountId = Cookies.get('accountId');
        const responseUpdateStatus = await axios.post(
          `${API_URL}/staff/update-appointment-status`,
          {
            status: newStatus,
            app_id: selectedAppointment.app_id,
            description: internalDescription
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log("responseUpdateStatus: ", responseUpdateStatus.data);

      }

      const updatedData = await fetchTodayAppointmentsOfStaff(); // Get the updated appointments
      setAppointments(updatedData); // Update child component's appointments state
      await filterAppointments(); // Refresh filteredAppointments to update UI

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

                {test.result ? (
                  <Tooltip title="Đã có kết quả">
                    <FileTextOutlined style={{ color: '#52c41a' }} />
                  </Tooltip>
                ) : (null)}
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
        <Space>
          <ClockCircleOutlined />
          <strong>{record.working_slot.start_at}</strong>
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

  const statsCards = [
    {
      title: 'Tổng lịch hẹn',
      value: appointments.length,
      color: '#1890ff',
      icon: <CalendarOutlined />,
    },
    {
      title: 'Chờ xử lý',
      value: appointments.filter((apt) => apt.status === 'pending')
        .length,
      color: '#faad14',
      icon: <ClockCircleOutlined />,
    },
    {
      title: 'Đang xử lý',
      value: appointments.filter((apt) => apt.status === 'in_progress')
        .length,
      color: '#13c2c2',
      icon: <SyncOutlined />,
    },
    {
      title: 'Đã hoàn thành',
      value: appointments.filter((apt) =>
        ['completed', 'has-result'].includes(apt.status)
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
        {true &&
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchTodayAppointmentsOfStaff}
            loading={loading}
          >
            Làm mới
          </Button>
        }
      </div>

      {/* Stats Cards */}

      (
      <>
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
                  <Option value="in_progress">Đang xét nghiệm</Option>
                  <Option value="confirmed">Đã xác nhận</Option>
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
            rowKey="app_id"
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
      </>
      )

    </div>

  );

};

export default TodayAppointments;
