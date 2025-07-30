import React, { useState, useEffect } from 'react';
import './BulkEmail.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000';


const BulkEmail = () => {
  const [emailData, setEmailData] = useState({
    subject: '',
    templateFile: null,
    targetRoles: [],
    body: '',
  });

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewMode, setPreviewMode] = useState(false);

  const roles = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'STAFF', label: 'Staff' },
    { value: 'CONSULTANT', label: 'Consultant' },
    { value: 'CUSTOMER', label: 'Customer' },
  ];

  const emailTemplates = [
    {
      id: 'campaign_health',
      name: 'Chiến dịch chăm sóc sức khỏe',
      subject: 'Tham gia chiến dịch chăm sóc sức khỏe phụ nữ 2024',
    },
    {
      id: 'task_assignment',
      name: 'Phân công nhiệm vụ',
      subject: 'Thông báo phân công nhiệm vụ mới',
    },
    {
      id: 'announcement',
      name: 'Thông báo chung',
      subject: 'Thông báo quan trọng từ ban quản trị',
    },
  ];

  useEffect(() => {
    // Mock user data
    const mockUsers = [
      {
        id: 1,
        name: 'Nguyễn Văn Admin',
        email: 'admin@health.com',
        role: 'admin',
      },
      {
        id: 2,
        name: 'Trần Thị Manager',
        email: 'manager@health.com',
        role: 'manager',
      },
      {
        id: 3,
        name: 'Lê Văn Staff',
        email: 'staff1@health.com',
        role: 'staff',
      },
      {
        id: 4,
        name: 'Phạm Thị Consultant',
        email: 'consultant1@health.com',
        role: 'consultant',
      },
      {
        id: 5,
        name: 'Hoàng Văn Customer',
        email: 'customer1@health.com',
        role: 'customer',
      },
    ];

    setUsers(mockUsers);
    setTemplates(emailTemplates);
  }, []);

  useEffect(() => {
    if (emailData.targetRoles.length > 0) {
      const filtered = users.filter((user) =>
        emailData.targetRoles.includes(user.role)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [emailData.targetRoles, users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (roleValue) => {
    setEmailData((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(roleValue)
        ? prev.targetRoles.filter((role) => role !== roleValue)
        : [...prev.targetRoles, roleValue],
    }));
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setEmailData((prev) => ({
        ...prev,
        subject: template.subject,
      }));
      setSelectedTemplate(templateId);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/html') {
      setEmailData((prev) => ({
        ...prev,
        templateFile: file,
      }));
    } else {
      alert('Vui lòng chọn file HTML (.html)');
      event.target.value = '';
    }
  };

  const validateForm = () => {
    if (!emailData.subject.trim()) {
      return 'Vui lòng nhập tiêu đề email';
    }
    if (!emailData.templateFile) {
      return 'Vui lòng đính kèm file HTML';
    }
    if (emailData.targetRoles.length === 0) {
      return 'Vui lòng chọn ít nhất một vai trò';
    }
    return null;
  };

  const handleSendEmail = async () => {
    const error = validateForm();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      const accessToken = Cookies.get('accessToken');
      const accountId = Cookies.get('accountId');
      await axios.post(`${API_URL}/admin/send-campaign-from-file`, {
        subject: emailData.subject,
        body: emailData.body,
        templateFile: emailData.templateFile,
        targetRoles: emailData.targetRoles,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
      ).then((response) => {
        console.log("send-email response: ", response);
        setMessage({
          type: 'success',
          text: `${response.data.message} Có hiệu lực với ${emailData.targetRoles.map((r) => r).join(', ')}`,
        });
      });

      // Reset form
      setEmailData({
        subject: '',
        templateFile: null,
        targetRoles: [],
        body: '',
      });
      setSelectedTemplate('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi gửi email' });
    } finally {
      setLoading(false);
    }
  };

  const getTotalRecipients = () => {
    return emailData.targetRoles.reduce((total, role) => {
      const roleData = roles.find((r) => r.value === role);
      return total + (roleData ? roleData.count : 0);
    }, 0);
  };

  const getRoleIcon = (roleValue) => {
    switch (roleValue) {
      case 'ADMIN':
        return '👑';
      case 'MANAGER':
        return '👨‍💼';
      case 'STAFF':
        return '👷‍♂️';
      case 'CONSULTANT':
        return '👨‍🔬';
      case 'CUSTOMER':
        return '👤';
      default:
        return '❓';
    }
  };

  return (
    <div className="bulk-email">
      <div className="bulk-email-header">
        <h1>Gửi email hàng loạt</h1>
        <p>
          Gửi email đến nhiều người dùng theo vai trò để củng cố chiến dịch hoặc
          phân nhiệm vụ
        </p>
      </div>

      <div className="bulk-email-container-single">
        <div className="email-form-section">
          <div className="form-section">
            <h2>Mẫu email có sẵn</h2>
            <div className="template-selector">
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
              >
                <option value="">Chọn mẫu email...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>Thông tin email</h2>

            <div className="form-group">
              <label htmlFor="subject">Tiêu đề email *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={emailData.subject}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Mội dung email *</label>
              <input
                type="text"
                id="body"
                name="body"
                value={emailData.body}
                onChange={handleInputChange}
                placeholder="Nhập nội dung email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="templateFile">Đính kèm file HTML *</label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="templateFile"
                  accept=".html"
                  onChange={handleFileSelect}
                  className="file-input"
                />
                <label htmlFor="templateFile" className="file-input-label">
                  <span className="file-icon">📎</span>
                  {emailData.templateFile
                    ? emailData.templateFile.name
                    : 'Chọn file HTML'}
                </label>
                {emailData.templateFile && (
                  <div className="file-info">
                    <span className="file-size">
                      ({(emailData.templateFile.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() =>
                        setEmailData((prev) => ({ ...prev, templateFile: null }))
                      }
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <small className="file-help">
                Chọn file HTML chứa nội dung email. File sẽ được sử dụng làm nội
                dung email.
              </small>
            </div>

          </div>

          <div className="form-section">
            <h2>
              <span className="section-icon">👥</span>
              Đối tượng nhận email
            </h2>
            <p className="section-description">
              <span className="desc-icon">📧</span>
              Chọn vai trò người dùng sẽ nhận email này
            </p>

            <div className="role-selection-grid">
              {roles.map((role) => (
                <div
                  key={role.value}
                  className={`role-card ${emailData.targetRoles.includes(role.value) ? 'selected' : ''}`}
                  onClick={() => handleRoleChange(role.value)}
                >
                  <div className="role-card-header">
                    <div className="role-icon-wrapper">
                      <span className="role-icon">
                        {getRoleIcon(role.value)}
                      </span>
                    </div>
                    <div className="role-checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={emailData.targetRoles.includes(role.value)}
                        onChange={() => handleRoleChange(role.value)}
                        className="role-checkbox-input"
                      />
                      <span className="role-checkmark"></span>
                    </div>
                  </div>
                  <div className="role-card-content">
                    <h3 className="role-name">{role.label}</h3>
                    <div className="role-stats">
                      <span className="role-count">{role.count}</span>
                      <span className="role-count-label">người dùng</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {emailData.targetRoles.length > 0 && (
              <div className="recipient-summary-card">
                <div className="summary-icon">
                  <span>📊</span>
                </div>
                <div className="summary-content">
                  <div className="summary-main">
                    {/* <span className="summary-label">Tổng số người nhận:</span>
                    <span className="summary-count">
                      {getTotalRecipients()}
                    </span> */}
                  </div>
                  <div className="summary-breakdown">
                    {emailData.targetRoles.map((roleValue) => {
                      const role = roles.find((r) => r.value === roleValue);
                      return (
                        <span key={roleValue} className="breakdown-item">
                          <span className="breakdown-icon">
                            {getRoleIcon(roleValue)}
                          </span>
                          <span className="breakdown-text">
                            {role.label}: {role.count}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {emailData.targetRoles.length === 0 && (
              <div className="no-selection-card">
                <div className="no-selection-icon">🎯</div>
                <div className="no-selection-text">
                  <h4>Chưa chọn đối tượng</h4>
                  <p>Hãy chọn ít nhất một vai trò để gửi email</p>
                </div>
              </div>
            )}
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-preview"
              onClick={() => setPreviewMode(true)}
              disabled={!emailData.subject || !emailData.templateFile}
            >
              Xem trước
            </button>
            <button
              type="button"
              className="btn-send"
              onClick={handleSendEmail}
              disabled={loading || getTotalRecipients() === 0}
            >
              {loading ? 'Đang gửi...' : 'Gửi email'}
            </button>
          </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      {previewMode && (
        <div className="modal-overlay" onClick={() => setPreviewMode(false)}>
          <div
            className="modal-content email-preview"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Xem trước email</h2>
              <button
                className="modal-close"
                onClick={() => setPreviewMode(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="email-preview-content">
                <div className="email-header">
                  <p>
                    <strong>Từ:</strong> admin@health.com
                  </p>
                  <p>
                    <strong>Đến:</strong>
                    {emailData.targetRoles.map((roleValue) => {
                      const role = roles.find((r) => r.value === roleValue);
                      return (
                        <span key={roleValue} className="breakdown-item">
                          <span className="breakdown-icon">
                            {getRoleIcon(roleValue)}
                          </span>
                          <span className="breakdown-text">
                            {role.label}: {role.count}
                          </span>
                        </span>
                      );
                    })}
                  </p>
                  <p>
                    <strong>Tiêu đề:</strong> {emailData.subject}
                  </p>
                </div>
                <div className="email-body">
                  <h3>Nội dung:</h3>
                  <div className="email-body-content">
                    <p>{emailData.body}</p>
                  </div>
                  <div className="email-content">
                    {emailData.templateFile ? (
                      <div className="html-file-preview">
                        <p>
                          <strong>File HTML:</strong> {emailData.templateFile.name}
                        </p>
                        <p>
                          <strong>Kích thước:</strong>{' '}
                          {(emailData.templateFile.size / 1024).toFixed(1)} KB
                        </p>
                        <p>
                          <em>Nội dung email sẽ được lấy từ file HTML này.</em>
                        </p>
                      </div>
                    ) : (
                      <p>Chưa có file HTML được chọn</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setPreviewMode(false)}
              >
                Đóng
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setPreviewMode(false);
                  handleSendEmail();
                }}
              >
                Gửi ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkEmail;
