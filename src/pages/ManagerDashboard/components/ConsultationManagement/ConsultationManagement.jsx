import React, { useState, useEffect } from 'react';
import './ConsultationManagement.css';
import dayjs from 'dayjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button, Descriptions, Modal } from 'antd';

const accountId = Cookies.get('accountId');
const accessToken = Cookies.get('accessToken');

const API_URL = 'http://localhost:3000';

const ConsultationManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [refundInformation, setRefundInformation] = useState(null);

  // Mock data for consultation appointments
  // useEffect(() => {
  //   const mockAppointments = [
  //     {
  //       app_id: 1,
  //       consultant: 'BS. Trần Văn Nam',
  //       customer: {
  //         account_id: "12345",
  //         full_name: "Nguyễn Thị Lan",
  //         phone: "0901234567",
  //       },
  //       date: '2024-12-21',
  //       time: '09:00',
  //       status: 'confirmed',
  //       description: 'Khách hàng có triệu chứng viêm nhiễm nhẹ',
  //       created_at: '2024-12-20 14:30',
  //     },
  //     {
  //       app_id: 2,
  //       customer: {
  //         account_id: "12345",
  //         full_name: "Phạm Thị Hoa",
  //         phone: "0912345678",
  //       },
  //       consultant: 'BS. Nguyễn Thị Mai',
  //       date: '2024-12-21',
  //       time: '14:00',
  //       status: 'pending',
  //       description: 'Tư vấn phương pháp tránh thai an toàn',
  //       created_at: '2024-12-20 15:45',
  //     },

  //   ];
  //   setAppointments(mockAppointments);
  //   setFilteredAppointments(mockAppointments);
  // }, []);
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
  //   setCurrentPage(1);
  // }, [searchTerm, statusFilter, dateFilter, appointments]);

  const fetchAppointments = async () => {
    try {
      await axios
        .get(`${API_URL}/consult-appointment/get-all-consult-appointments`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm.trim(),
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
          console.log('Fetched manager appointments:', data);
          setAppointments(data.conApp || []);
          setFilteredAppointments(data.conApp || []);
          setTotalPages(data.pages || 1);
        });
    } catch (error) {
      console.error('Error fetching manager appointments:', error);
      setAppointments([]);
      setFilteredAppointments([]);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Chờ xác nhận', color: '#f59e0b' },
      confirmed: { text: 'Đã xác nhận', color: '#10b981' },
      completed: { text: 'Đã hoàn thành', color: '#059669' },
      pending_cancelled: { text: 'Đã huỷ', color: '#ef4444' },
      confirmed_cancelled: { text: 'Đã huỷ', color: '#ef4444' },
      in_progress: { text: 'Đang tiến hành', color: '#3b82f6' },
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

  const handleRefundAppointment = async (appointment) => {
    await axios
      .get(
        `${API_URL}/consult-appointment/get-refund-info/${appointment.app_id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        const data = response.data.result;
        console.log('Fetched refund information:', data);
        setRefundInformation(
          {
            ...data,
            customer: appointment.customer,
            consultant: appointment.consultant,
            date: appointment.date,
            app_id: appointment.app_id,
          } || null
        );
      })
      .catch((error) => {
        console.error('Error fetching refund information:', error);
        setRefundInformation(null);
      });
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleUpdateStatus = (appointmentId, newStatus) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.app_id === appointmentId ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleRefund = async (appointmentId) => {
    try {
      await axios
        .put(
          `${API_URL}/consult-appointment/refund/${appointmentId}`,
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

  return (
    <div className="consultation-management">
      <div className="consultation-header">
        <h2>Quản lý Lịch hẹn Tư vấn</h2>
        <p>Theo dõi và quản lý các cuộc hẹn tư vấn sức khỏe sinh sản</p>
      </div>
      {/* Filters and Search */}
      <div className="consultation-toolbar">
        <div className="filter-row">
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
                if(currentPage !== 1) {
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
      </div>
      {/* Appointments Table */}
      <div className="appointments-table-container">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Bác sĩ</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.app_id}>
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
                <td className="consultant-name">{appointment.consultant}</td>
                <td>
                  <div className="appointment-datetime">
                    <div className="date">
                      {dayjs(appointment.date).format('DD/MM/YYYY')}
                    </div>
                    <div className="time">{appointment.time}</div>
                  </div>
                </td>
                <td>{getStatusBadge(appointment.status)}</td>
                <td className="notes">{appointment.description}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => handleViewAppointment(appointment)}
                    >
                      👁
                    </button>
                    {/* <button
                      className="confirm-btn"
                      onClick={() =>
                        handleUpdateStatus(appointment.app_id, 'confirmed')
                      }
                    >
                      ✅
                    </button>
                    <button
                      className="complete-btn"
                      onClick={() =>
                        handleUpdateStatus(appointment.app_id, 'completed')
                      }
                    >
                      ✔️
                    </button> */}
                    {appointment.isRequestedRefund ? (
                      <button
                        className="view-btn"
                        onClick={() => handleRefundAppointment(appointment)}
                      >
                        💸 Hoàn tiền
                      </button>
                    ) : (
                      appointment.isRefunded && (
                        <span className="refund-completed">Đã hoàn tiền</span>
                      )
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

      {/* Appointment Detail Modal */}
      {showModal && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="appointment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Chi tiết lịch hẹn tư vấn</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Khách hàng:</label>
                  <span>{selectedAppointment.customer.full_name}</span>
                </div>
                <div className="detail-item">
                  <label>Số điện thoại:</label>
                  <span>{selectedAppointment.customer.phone}</span>
                </div>
                <div className="detail-item">
                  <label>Bác sĩ:</label>
                  <span>{selectedAppointment.consultant}</span>
                </div>
                <div className="detail-item">
                  <label>Ngày hẹn:</label>
                  <span>
                    {dayjs(selectedAppointment.date).format('DD/MM/YYYY')}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Trạng thái:</label>
                  <span>{getStatusBadge(selectedAppointment.status)}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Ghi chú:</label>
                  <span>{selectedAppointment.description}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Refund Appointment Modal */}
      <Modal
        open={refundInformation !== null}
        onCancel={() => setRefundInformation(null)}
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
            <Descriptions.Item label="Bác sĩ">
              <strong>{refundInformation.consultant}</strong>
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

export default ConsultationManagement;
