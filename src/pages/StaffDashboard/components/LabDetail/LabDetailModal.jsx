import React, { useState } from 'react';
import './LabDetailModal.css';

const LabDetailModal = ({ labData, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [registrations, setRegistrations] = useState(labData.registrationList);
  const [report, setReport] = useState('');

  // Filter registrations based on search term
  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.id.toString().includes(searchTerm) ||
      reg.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle result update
  const handleResultUpdate = (regId, newResult) => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === regId ? { ...reg, result: newResult } : reg
      )
    );
  };

  // Handle status update
  const handleStatusUpdate = (regId, newStatus) => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === regId ? { ...reg, status: newStatus } : reg
      )
    );
  };

  // Handle note update
  const handleNoteUpdate = (regId, newNote) => {
    setRegistrations((prev) =>
      prev.map((reg) => (reg.id === regId ? { ...reg, note: newNote } : reg))
    );
  };

  // Save changes
  const handleSave = () => {
    // Here you would typically send the data to your backend
    console.log('Saving lab data:', {
      ...labData,
      registrationList: registrations,
      report: report,
    });
    onClose();
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="lab-modal-overlay">
      <div className="lab-modal">
        {/* Modal Header */}
        <div className="lab-modal-header">
          <h2>Chi tiết Lab</h2>
          <button className="lab-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="lab-modal-content">
          {/* Lab Information */}
          <div className="lab-info-section">
            <div className="lab-info-grid">
              <div className="lab-info-item">
                <label>Lab ID:</label>
                <span>{labData.id}</span>
              </div>
              <div className="lab-info-item">
                <label>Ngày:</label>
                <span>{formatDate(labData.date)}</span>
              </div>
              <div className="lab-info-item">
                <label>Slot:</label>
                <span>Slot {labData.slot}</span>
              </div>
              <div className="lab-info-item">
                <label>Loại xét nghiệm:</label>
                <span>{labData.type}</span>
              </div>
              <div className="lab-info-item">
                <label>Số lượng đăng ký:</label>
                <span>{labData.registrations} người</span>
              </div>
              <div className="lab-info-item">
                <label>Trạng thái:</label>
                <span className={`lab-status ${labData.status}`}>
                  {labData.status === 'ongoing'
                    ? 'Đang thực hiện'
                    : 'Hoàn thành'}
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="lab-search-section">
            <h3>Danh sách đăng ký</h3>
            <div className="lab-search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm theo STT hoặc tên khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="lab-search-icon">🔍</span>
            </div>
          </div>

          {/* Registration List */}
          <div className="lab-registration-list">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Ghi chú</th>
                  <th>Kết quả</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>{reg.id}</td>
                    <td>
                      <div className="customer-info">
                        <strong>{reg.customerName}</strong>
                      </div>
                    </td>
                    <td>{reg.phone}</td>
                    <td>
                      <input
                        type="text"
                        value={reg.note}
                        onChange={(e) =>
                          handleNoteUpdate(reg.id, e.target.value)
                        }
                        placeholder="Thêm ghi chú..."
                        className="lab-note-input"
                      />
                    </td>
                    <td>
                      {labData.status === 'done' ? (
                        <span className="lab-result-display">{reg.result}</span>
                      ) : (
                        <div className="lab-result-input">
                          <input
                            type="text"
                            value={reg.result}
                            onChange={(e) =>
                              handleResultUpdate(reg.id, e.target.value)
                            }
                            placeholder="Nhập kết quả..."
                          />
                          <button
                            className="lab-upload-btn"
                            title="Upload file kết quả"
                          >
                            📁
                          </button>
                        </div>
                      )}
                    </td>
                    <td>
                      <select
                        value={reg.status}
                        onChange={(e) =>
                          handleStatusUpdate(reg.id, e.target.value)
                        }
                        className={`lab-status-select ${reg.status}`}
                        disabled={labData.status === 'done'}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="completed">Hoàn thành</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Report Section */}
          <div className="lab-report-section">
            <h3>Báo cáo tổng hợp</h3>
            <textarea
              className="lab-report-textarea"
              placeholder="Consultant sẽ viết báo cáo sau khi tư vấn xong..."
              value={report}
              onChange={(e) => setReport(e.target.value)}
              rows={4}
              disabled={labData.status === 'done'}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="lab-modal-footer">
          <button className="staff-btn staff-btn-secondary" onClick={onClose}>
            Đóng
          </button>
          {labData.status !== 'done' && (
            <button
              className="staff-btn staff-btn-primary"
              onClick={handleSave}
            >
              💾 Lưu thay đổi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabDetailModal;
