import React, { useState, useEffect } from 'react';
import './ConsultationManagement.css';

const ConsultationManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [consultantFilter, setConsultantFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Mock data for consultation appointments
  useEffect(() => {
    const mockAppointments = [
      {
        id: 1,
        customerName: 'Nguyễn Thị Lan',
        customerPhone: '0901234567',
        serviceName: 'Tư vấn sức khỏe sinh sản',
        consultantName: 'BS. Trần Văn Nam',
        appointmentDate: '2024-12-21',
        appointmentTime: '09:00',
        status: 'confirmed',
        notes: 'Khách hàng có triệu chứng viêm nhiễm nhẹ',
        createdAt: '2024-12-20 14:30',
      },
      {
        id: 2,
        customerName: 'Phạm Thị Hoa',
        customerPhone: '0912345678',
        serviceName: 'Tư vấn kế hoạch hóa gia đình',
        consultantName: 'BS. Nguyễn Thị Mai',
        appointmentDate: '2024-12-21',
        appointmentTime: '14:00',
        status: 'pending',
        notes: 'Tư vấn phương pháp tránh thai an toàn',
        createdAt: '2024-12-20 15:45',
      },
      {
        id: 3,
        customerName: 'Trần Thị Bích',
        customerPhone: '0923456789',
        serviceName: 'Tư vấn điều trị nhiễm trùng',
        consultantName: 'BS. Lê Văn Tùng',
        appointmentDate: '2024-12-21',
        appointmentTime: '16:00',
        status: 'confirmed',
        notes: 'Follow-up sau điều trị',
        createdAt: '2024-12-20 16:20',
      },
      {
        id: 4,
        customerName: 'Lê Thị Minh',
        customerPhone: '0934567890',
        serviceName: 'Tư vấn sức khỏe phụ nữ',
        consultantName: 'BS. Trần Văn Nam',
        appointmentDate: '2024-12-22',
        appointmentTime: '10:30',
        status: 'pending',
        notes: 'Tư vấn về chu kỳ kinh nguyệt',
        createdAt: '2024-12-20 17:10',
      },
    ];

    setAppointments(mockAppointments);
    setFilteredAppointments(mockAppointments);
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = appointments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.consultantName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.serviceName
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

    // Consultant filter
    if (consultantFilter !== 'all') {
      filtered = filtered.filter(
        (appointment) => appointment.consultantName === consultantFilter
      );
    }

    setFilteredAppointments(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, consultantFilter, appointments]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Chờ xác nhận', color: '#f59e0b' },
      confirmed: { text: 'Đã xác nhận', color: '#10b981' },
      completed: { text: 'Đã hoàn thành', color: '#059669' },
      cancelled: { text: 'Đã hủy', color: '#ef4444' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className="status-badge"
        style={{
          backgroundColor: `${config.color}20`,
          color: config.color,
        }}
      >
        {config.text}
      </span>
    );
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleUpdateStatus = (appointmentId, newStatus) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === appointmentId ? { ...app, status: newStatus } : app
      )
    );
  };

  return (
    <div className="consultation-management">
      <div className="consultation-header">
        <h2>Quản lý Lịch hẹn Tư vấn</h2>
        <p>Theo dõi và quản lý các cuộc hẹn tư vấn sức khỏe sinh sản</p>
      </div>

      {/* Filters and Search */}
      <div className="consultation-toolbar">
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng, bác sĩ hoặc dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Trạng thái:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="appointments-table-container">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Dịch vụ</th>
              <th>Bác sĩ</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
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
                <td className="service-name">{appointment.serviceName}</td>
                <td className="consultant-name">
                  {appointment.consultantName}
                </td>
                <td>
                  <div className="appointment-datetime">
                    <div className="date">
                      {new Date(appointment.appointmentDate).toLocaleDateString(
                        'vi-VN'
                      )}
                    </div>
                    <div className="time">{appointment.appointmentTime}</div>
                  </div>
                </td>
                <td>{getStatusBadge(appointment.status)}</td>
                <td className="notes">{appointment.notes}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => handleViewAppointment(appointment)}
                    >
                      👁
                    </button>
                    <button
                      className="confirm-btn"
                      onClick={() =>
                        handleUpdateStatus(appointment.id, 'confirmed')
                      }
                    >
                      ✅
                    </button>
                    <button
                      className="complete-btn"
                      onClick={() =>
                        handleUpdateStatus(appointment.id, 'completed')
                      }
                    >
                      ✔️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                  <span>{selectedAppointment.customerName}</span>
                </div>
                <div className="detail-item">
                  <label>Số điện thoại:</label>
                  <span>{selectedAppointment.customerPhone}</span>
                </div>
                <div className="detail-item">
                  <label>Dịch vụ:</label>
                  <span>{selectedAppointment.serviceName}</span>
                </div>
                <div className="detail-item">
                  <label>Bác sĩ:</label>
                  <span>{selectedAppointment.consultantName}</span>
                </div>
                <div className="detail-item">
                  <label>Ngày hẹn:</label>
                  <span>
                    {new Date(
                      selectedAppointment.appointmentDate
                    ).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Trạng thái:</label>
                  <span>{getStatusBadge(selectedAppointment.status)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationManagement;
