import React, { useState, useEffect } from 'react';
import './LabManagement.css';
import dayjs from 'dayjs';

const LabManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openTestDropdown, setOpenTestDropdown] = useState(null);

  // Mock data for lab appointments (mỗi appointment có thể có nhiều xét nghiệm)
  useEffect(() => {
    const mockAppointments = [
      {
        id: 'LAB001',
        customerName: 'Lê Văn Minh',
        customerPhone: '0901234567',
        tests: ['Xét nghiệm STD Panel', 'Xét nghiệm HIV'],
        appointmentDate: '2024-12-21',
        appointmentTime: '10:30',
        status: 'confirmed',
        price: 1150000,
        notes: 'Khách hàng đã thanh toán trước',
        resultFile: null,
        createdAt: '2024-12-20 14:30',
      },
      {
        id: 'LAB002',
        customerName: 'Hoàng Văn Đức',
        customerPhone: '0912345678',
        tests: ['Xét nghiệm HIV'],
        appointmentDate: '2024-12-21',
        appointmentTime: '15:30',
        status: 'confirmed',
        price: 300000,
        notes: 'Cần nhắc nhở khách hàng nhịn ăn',
        resultFile: null,
        createdAt: '2024-12-20 15:45',
      },
      {
        id: 'LAB003',
        customerName: 'Nguyễn Thị Hạnh',
        customerPhone: '0923456789',
        tests: ['Xét nghiệm Syphilis', 'Xét nghiệm tổng quát'],
        appointmentDate: '2024-12-20',
        appointmentTime: '09:00',
        status: 'completed',
        price: 850000,
        notes: 'Đã hoàn thành, có kết quả',
        resultFile: 'result_lab003.pdf',
        createdAt: '2024-12-19 16:20',
      },
      {
        id: 'LAB004',
        customerName: 'Trần Thị Mai',
        customerPhone: '0934567890',
        tests: ['Xét nghiệm Hepatitis B'],
        appointmentDate: '2024-12-22',
        appointmentTime: '08:30',
        status: 'pending_payment',
        price: 400000,
        notes: 'Chờ khách hàng thanh toán',
        resultFile: null,
        createdAt: '2024-12-20 17:10',
      },
      {
        id: 'LAB005',
        customerName: 'Phạm Văn Tú',
        customerPhone: '0945678901',
        tests: ['Xét nghiệm tổng quát', 'Xét nghiệm HIV'],
        appointmentDate: '2024-12-22',
        appointmentTime: '14:00',
        status: 'in_progress',
        price: 900000,
        notes: 'Đang thực hiện xét nghiệm',
        resultFile: null,
        createdAt: '2024-12-21 09:15',
      },
    ];
    setAppointments(mockAppointments);
    setFilteredAppointments(mockAppointments);
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = appointments;
    // Search by customer name
    if (searchTerm) {
      filtered = filtered.filter((appointment) =>
        appointment.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (appointment) => appointment.status === statusFilter
      );
    }
    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(
        (appointment) => appointment.appointmentDate === dateFilter
      );
    }
    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, dateFilter, appointments]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_payment: { text: 'Chờ thanh toán', color: '#f59e0b' },
      confirmed: { text: 'Đã xác nhận', color: '#10b981' },
      in_progress: { text: 'Đang thực hiện', color: '#3b82f6' },
      completed: { text: 'Đã có kết quả', color: '#059669' },
      cancelled: { text: 'Đã huỷ', color: '#ef4444' },
    };
    const config = statusConfig[status] || statusConfig.pending_payment;
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

  return (
    <div className="lab-management">
      <div className="lab-header">
        <h2>Quản lý Lịch hẹn Xét nghiệm</h2>
        <p>Theo dõi và quản lý các cuộc hẹn xét nghiệm y tế</p>
      </div>
      {/* Filters and Search */}
      <div className="lab-toolbar">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending_payment">Chờ thanh toán</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="in_progress">Đang thực hiện</option>
            <option value="completed">Đã có kết quả</option>
            <option value="cancelled">Đã huỷ</option>
          </select>
        </div>
        <div className="filter-group">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-date"
          />
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
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="appointment-id">{appointment.id}</td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">
                      {appointment.customerName}
                    </div>
                    <div className="customer-phone">
                      {appointment.customerPhone}
                    </div>
                  </div>
                </td>
                <td className="test-type">
                  <div className="test-dropdown-wrapper">
                    <button
                      className="test-dropdown-btn"
                      onClick={() =>
                        setOpenTestDropdown(
                          openTestDropdown === appointment.id
                            ? null
                            : appointment.id
                        )
                      }
                    >
                      {appointment.tests.length} xét nghiệm ▼
                    </button>
                    {openTestDropdown === appointment.id && (
                      <ul className="test-dropdown-list">
                        {appointment.tests.map((test, idx) => (
                          <li key={idx} className="test-item">
                            {test}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </td>
                <td>
                  <div className="appointment-datetime">
                    <div className="date">
                      {dayjs(appointment.appointmentDate).format('DD/MM/YYYY')}
                    </div>
                    <div className="time">{appointment.appointmentTime}</div>
                  </div>
                </td>
                <td className="price">{formatCurrency(appointment.price)}</td>
                <td>{getStatusBadge(appointment.status)}</td>
                <td>
                  {appointment.resultFile ? (
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Lab Appointment Detail Modal */}
      {showModal && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="lab-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết lịch hẹn xét nghiệm</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>ID:</label>
                  <span>{selectedAppointment.id}</span>
                </div>
                <div className="detail-item">
                  <label>Khách hàng:</label>
                  <span>{selectedAppointment.customerName}</span>
                </div>
                <div className="detail-item">
                  <label>Số điện thoại:</label>
                  <span>{selectedAppointment.customerPhone}</span>
                </div>
                <div className="detail-item">
                  <label>Xét nghiệm:</label>
                  <ul className="test-list">
                    {selectedAppointment.tests.map((test, idx) => (
                      <li key={idx} className="test-item">
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="detail-item">
                  <label>Ngày hẹn:</label>
                  <span>
                    {dayjs(selectedAppointment.appointmentDate).format(
                      'DD/MM/YYYY'
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Giờ hẹn:</label>
                  <span>{selectedAppointment.appointmentTime}</span>
                </div>
                <div className="detail-item">
                  <label>Giá tiền:</label>
                  <span>{formatCurrency(selectedAppointment.price)}</span>
                </div>
                <div className="detail-item">
                  <label>Trạng thái:</label>
                  <span>{getStatusBadge(selectedAppointment.status)}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Ghi chú:</label>
                  <span>{selectedAppointment.notes}</span>
                </div>
                <div className="detail-item">
                  <label>File kết quả:</label>
                  <span>
                    {selectedAppointment.resultFile ? (
                      <a href="#" className="result-link">
                        📄 {selectedAppointment.resultFile}
                      </a>
                    ) : (
                      'Chưa có kết quả'
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Tạo lúc:</label>
                  <span>{selectedAppointment.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabManagement;
