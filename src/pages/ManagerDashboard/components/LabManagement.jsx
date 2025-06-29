import React, { useState, useEffect } from 'react';
import './LabManagement.css';

const LabManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [testTypeFilter, setTestTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Mock data for lab appointments
  useEffect(() => {
    const mockAppointments = [
      {
        id: 'LAB001',
        customerName: 'Lê Văn Minh',
        customerPhone: '0901234567',
        testType: 'Xét nghiệm STD Panel',
        appointmentDate: '2024-12-21',
        appointmentTime: '10:30',
        status: 'confirmed',
        price: 850000,
        notes: 'Khách hàng đã thanh toán trước',
        resultFile: null,
        createdAt: '2024-12-20 14:30',
      },
      {
        id: 'LAB002',
        customerName: 'Hoàng Văn Đức',
        customerPhone: '0912345678',
        testType: 'Xét nghiệm HIV',
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
        testType: 'Xét nghiệm Syphilis',
        appointmentDate: '2024-12-20',
        appointmentTime: '09:00',
        status: 'completed',
        price: 250000,
        notes: 'Đã hoàn thành, có kết quả',
        resultFile: 'result_lab003.pdf',
        createdAt: '2024-12-19 16:20',
      },
      {
        id: 'LAB004',
        customerName: 'Trần Thị Mai',
        customerPhone: '0934567890',
        testType: 'Xét nghiệm Hepatitis B',
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
        testType: 'Xét nghiệm tổng quát',
        appointmentDate: '2024-12-22',
        appointmentTime: '14:00',
        status: 'in_progress',
        price: 600000,
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.testType
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (appointment) => appointment.status === statusFilter
      );
    }

    // Test type filter
    if (testTypeFilter !== 'all') {
      filtered = filtered.filter(
        (appointment) => appointment.testType === testTypeFilter
      );
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, testTypeFilter, appointments]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_payment: { text: 'Chờ thanh toán', color: '#f59e0b' },
      confirmed: { text: 'Đã xác nhận', color: '#10b981' },
      in_progress: { text: 'Đang thực hiện', color: '#3b82f6' },
      completed: { text: 'Đã có kết quả', color: '#059669' },
      cancelled: { text: 'Đã hủy', color: '#ef4444' },
    };

    const config = statusConfig[status] || statusConfig.pending_payment;

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

  const handleUploadResult = (appointmentId) => {
    // Simulate file upload
    const fileName = `result_${appointmentId.toLowerCase()}.pdf`;
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === appointmentId
          ? { ...app, status: 'completed', resultFile: fileName }
          : app
      )
    );
    alert(`Đã tải lên kết quả: ${fileName}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getUniqueTestTypes = () => {
    const testTypes = [...new Set(appointments.map((app) => app.testType))];
    return testTypes.sort();
  };

  return (
    <div className="lab-management">
      <div className="lab-header">
        <h2>Quản lý Lịch hẹn Xét nghiệm</h2>
        <p>Theo dõi và quản lý các cuộc hẹn xét nghiệm y tế</p>
      </div>

      {/* Filters and Search */}
      <div className="lab-toolbar">
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng, loại xét nghiệm hoặc ID..."
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
              <option value="pending_payment">Chờ thanh toán</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="in_progress">Đang thực hiện</option>
              <option value="completed">Đã có kết quả</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Loại xét nghiệm:</label>
            <select
              value={testTypeFilter}
              onChange={(e) => setTestTypeFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {getUniqueTestTypes().map((testType) => (
                <option key={testType} value={testType}>
                  {testType}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lab Appointments Table */}
      <div className="lab-table-container">
        <table className="lab-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Loại xét nghiệm</th>
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
                <td className="test-type">{appointment.testType}</td>
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
                    {appointment.status === 'pending_payment' && (
                      <button
                        className="confirm-btn"
                        onClick={() =>
                          handleUpdateStatus(appointment.id, 'confirmed')
                        }
                      >
                        ✅
                      </button>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button
                        className="progress-btn"
                        onClick={() =>
                          handleUpdateStatus(appointment.id, 'in_progress')
                        }
                      >
                        🔄
                      </button>
                    )}
                    {(appointment.status === 'in_progress' ||
                      appointment.status === 'confirmed') && (
                      <button
                        className="upload-btn"
                        onClick={() => handleUploadResult(appointment.id)}
                      >
                        📤
                      </button>
                    )}
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
                  <label>Loại xét nghiệm:</label>
                  <span>{selectedAppointment.testType}</span>
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
