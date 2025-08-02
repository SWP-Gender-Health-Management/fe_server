import React, { useState, useEffect } from 'react';
import './LabManagement.css';
import dayjs from 'dayjs';
import {
  Button,
  Descriptions,
  Empty,
  Modal,
  Table,
  Tag,
  Typography,
} from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const accountId = Cookies.get('accountId');
const accessToken = Cookies.get('accessToken');

const API_URL = 'http://localhost:3000';

const LabManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openTestDropdown, setOpenTestDropdown] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [refundInformation, setRefundInformation] = useState(null);

  // Mock data for lab appointments (mỗi appointment có thể có nhiều xét nghiệm)
  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  // Filter logic
  // useEffect(() => {
  //   let filtered = appointments;
  //   // Search by customer name
  //   if (searchTerm) {
  //     filtered = filtered.filter((appointment) =>
  //       appointment.customer.full_name
  //         .toLowerCase()
  //         .includes(searchTerm.toLowerCase())
  //     );
  //   }
  //   // Status filter
  //   if (statusFilter !== 'all') {
  //     filtered = filtered.filter(
  //       (appointment) => appointment.status === statusFilter
  //     );
  //   }
  //   // Date filter
  //   if (dateFilter) {
  //     filtered = filtered.filter(
  //       (appointment) => appointment.date === dateFilter
  //     );
  //   }
  //   setFilteredAppointments(filtered);
  // }, [searchTerm, statusFilter, dateFilter, appointments, currentPage]);

  const fetchAppointments = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const accountId = Cookies.get('accountId');
      await axios
        .get(`${API_URL}/manager/get-lab-app`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            fullname: searchTerm.trim(),
            status: statusFilter,
            date: dateFilter,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          const data = response.data.result;
          console.log('Fetched manager lab appointments:', data);
          setAppointments(data.labApp || []);
          setFilteredAppointments(data.labApp || []);
          setTotalPages(data.pages || 1);
        });
    } catch (error) {
      console.error('Error fetching manager lab appointments:', error);
      setAppointments([]);
      setFilteredAppointments([]);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Chờ thanh toán', color: '#f59e0b' },
      confirmed: { text: 'Đã xác nhận', color: '#10b981' },
      in_progress: { text: 'Đang thực hiện', color: '#3b82f6' },
      completed: { text: 'Đã có kết quả', color: '#059669' },
      confirmed_cancelled: { text: 'Đã huỷ', color: '#ef4444' },
      pending_cancelled: { text: 'Đã huỷ', color: '#ef4444' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className="status-badge"
        style={{ backgroundColor: `${config.color}20`, color: config.color }}
      >
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleRefund = async (appointmentId) => {
    try {
      await axios
        .put(
          `${API_URL}/manager/refund/${appointmentId}`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .then((response) => {
          console.log('Hoàn tiền thành công: ', response.data);
          setRefundInformation(null);
          fetchAppointments(); // Refresh appointments after refund
        });
    } catch (error) {
      console.error('Hoàn tiền thất bại: ', error);
    }
  };

  const handleRefundAppointment = async (appointment) => {
    const accessToken = Cookies.get('accessToken');
    const accountId = Cookies.get('accountId');
    await axios
      .get(`${API_URL}/manager/get-refund-info/${appointment.app_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        const data = response.data.result;
        console.log('Fetched refund information:', data);
        setRefundInformation(
          {
            ...data,
            customer: appointment.customer,
            lab: appointment.lab,
            date: appointment.date,
            app_id: appointment.app_id,
            isRefunded: appointment.isRefunded,
          } || null
        );
      })
      .catch((error) => {
        console.error('Error fetching refund information:', error);
        setRefundInformation(null);
      });
  };

  return (
    <div className="lab-management">
      <div className="lab-header">
        <h2>Quản lý Lịch hẹn Xét nghiệm</h2>
        <p>Theo dõi và quản lý các cuộc hẹn xét nghiệm y tế</p>
      </div>
      {/* Filters and Search */}
      <div className="lab-toolbar">
        <div className="filter-group">
          <label htmlFor="customer-search">Khách hàng:</label>
          <input
            id="customer-search"
            type="text"
            placeholder="Tìm kiếm theo tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="status-select">Trạng thái:</label>
          <select
            id="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="cancelled">Đã huỷ</option>
            <option value="in_progress">Đang tiến hành</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="date-filter">Ngày hẹn:</label>
          <input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-date"
          />
        </div>
        <div className="filter-group">
          <Button
            onClick={() => {
              if (currentPage !== 1) {
                setCurrentPage(1);
              } else {
                fetchAppointments();
              }
            }}
            type="primary"
            className="filter-button"
          >
            <span className="filter-button">Tìm kiếm</span>
          </Button>
        </div>
      </div>
      {/* Lab Appointments Table */}
      <div className="lab-table-container">
        <table className="lab-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Xét nghiệm</th>
              <th>Thời gian</th>
              <th>Giá tiền</th>
              <th>Trạng thái</th>
              <th>Kết quả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment, index) => (
              <tr key={index + (currentPage - 1) * itemsPerPage + 1}>
                <td className="appointment-id">
                  {index + (currentPage - 1) * itemsPerPage + 1}
                </td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">
                      {appointment.customer.full_name}
                    </div>
                    <div className="customer-phone">
                      {appointment.customer.phone}
                    </div>
                  </div>
                </td>
                <td className="test-type">
                  <div className="test-dropdown-wrapper">
                    <button
                      className="test-dropdown-btn"
                      onClick={() =>
                        setOpenTestDropdown(
                          openTestDropdown === appointment.app_id
                            ? null
                            : appointment.app_id
                        )
                      }
                    >
                      {appointment.lab.length} xét nghiệm ▼
                    </button>
                    {openTestDropdown === appointment.app_id && (
                      <ul className="test-dropdown-list">
                        {appointment.lab.map((l, idx) => (
                          <li key={idx} className="test-item">
                            {l.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </td>
                <td>
                  <div className="appointment-datetime">
                    <div className="date">
                      {dayjs(appointment.date).format('DD/MM/YYYY')}
                    </div>
                    <div className="time">{appointment.time}</div>
                  </div>
                </td>
                <td className="price">{formatCurrency(appointment.amount)}</td>
                <td>{getStatusBadge(appointment.status)}</td>
                <td>
                  {appointment.result && appointment.result.length > 0 ? (
                    <span className="has-result">📄 Có kết quả</span>
                  ) : (
                    <span className="no-result">Chưa có</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => handleViewAppointment(appointment)}
                    >
                      👁
                    </button>
                    {appointment.isRequestedRefund && (
                      <button
                        className="view-btn"
                        onClick={() => handleRefundAppointment(appointment)}
                      >
                        💸{' '}
                        {appointment.isRefunded
                          ? 'Đã hoàn tiền'
                          : 'Chưa hoàn tiền'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          Trang {currentPage} của {totalPages}
        </div>
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            Đầu
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={currentPage === pageNum ? 'active' : ''}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Cuối
          </button>
        </div>
      </div>

      {/* Lab Appointment Detail Modal */}
      <Modal
        title={
          <div className="lab-detail-title">
            <div>Chi tiết lịch hẹn xét nghiệm</div>
            {selectedAppointment && (
              <Tag
                color={
                  selectedAppointment.status === 'completed'
                    ? 'blue'
                    : selectedAppointment.status === 'confirmed'
                      ? 'green'
                      : selectedAppointment.status === 'pending'
                        ? 'orange'
                        : 'red'
                }
              >
                {selectedAppointment.status === 'completed'
                  ? 'Đã hoàn thành'
                  : selectedAppointment.status === 'confirmed'
                    ? 'Đã xác nhận'
                    : selectedAppointment.status === 'pending'
                      ? 'Chờ xác nhận'
                      : 'Đã hủy'}
              </Tag>
            )}
          </div>
        }
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => setShowModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowModal(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
        className="lab-detail-modal"
      >
        {selectedAppointment && (
          <div className="lab-detail-content">
            {/* Thông tin lịch hẹn */}
            <Descriptions title="Thông tin lịch hẹn" bordered column={2}>
              <Descriptions.Item label="Ngày hẹn">
                {dayjs(selectedAppointment.date).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Giờ hẹn">
                {selectedAppointment.time}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {selectedAppointment.description}
              </Descriptions.Item>
              <Descriptions.Item label="Loại xét nghiệm" span={2}>
                {selectedAppointment.lab.map((l, index) => (
                  <span key={index} style={{ marginLeft: index > 0 ? 8 : 0 }}>
                    {l.name || 'Xét nghiệm'}
                    {index < selectedAppointment.lab.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </Descriptions.Item>
            </Descriptions>

            {/* Kết quả xét nghiệm */}
            <Typography.Title level={5} style={{ marginTop: 24 }}>
              Kết quả xét nghiệm
            </Typography.Title>
            {selectedAppointment.result &&
              selectedAppointment.result.length > 0 ? (
              <Table
                dataSource={selectedAppointment.result}
                rowKey="result_id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: 'Tên xét nghiệm',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: 'Kết quả',
                    dataIndex: 'result',
                    key: 'result',
                  },
                  {
                    title: 'Đơn vị',
                    dataIndex: 'unit',
                    key: 'unit',
                  },
                  {
                    title: 'Giá trị bình thường',
                    dataIndex: 'normal_range',
                    key: 'normal_range',
                  },
                  {
                    title: 'Kết luận',
                    dataIndex: 'conclusion',
                    key: 'conclusion',
                    ellipsis: true,
                  },
                ]}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có kết quả xét nghiệm"
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        )}
      </Modal>

      {/* Refund Appointment Modal */}
      <Modal
        open={refundInformation !== null}
        onCancel={() => setRefundInformation(null)}
        onOk={() => setRefundInformation(null)}
        title="Xác nhận hoàn tiền"
      >
        <h1>Thông tin hoàn tiền</h1>
        {refundInformation && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Khách hàng">
              <strong>{refundInformation.customer.full_name}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              <strong>{refundInformation.customer.phone}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Loại xét nghiệm">
              {refundInformation.lab.map((l, index) => (
                <span key={index}>
                  {l.name || 'Xét nghiệm'}
                  {index < refundInformation.lab.length - 1 ? ', ' : ''}
                </span>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày hẹn">
              <strong>
                {dayjs(refundInformation.date).format('DD/MM/YYYY')}
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Tên ngân hàng">
              <strong>{refundInformation.bankName}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Số tài khoảng">
              <strong>{refundInformation.accountNumber}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền">
              <strong>{refundInformation.amount}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Nguyên nhân">
              <strong>{refundInformation.description}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              <strong>
                {dayjs(refundInformation.created_at).format('DD/MM/YYYY')}
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Đã hoàn tiền">
              {refundInformation.isRefunded ? (
                <span style={{ color: 'green' }}>Đã hoàn tiền</span>
              ) : (
                <Button
                  onClick={() => handleRefund(refundInformation.app_id)}
                  style={{ color: 'red' }}
                >
                  Chưa hoàn tiền
                </Button>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default LabManagement;
