import React, { useState, useEffect } from 'react';
import './RecentActivities.css';

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const activitiesPerPage = 20;

  const activityTypes = [
    { value: 'all', label: 'Tất cả', icon: '📋' },
    { value: 'user_register', label: 'Đăng ký tài khoản', icon: '👤' },
    { value: 'appointment', label: 'Cuộc hẹn', icon: '📅' },
    { value: 'blog_approved', label: 'Duyệt bài viết', icon: '📝' },
    { value: 'payment', label: 'Thanh toán', icon: '💳' },
    { value: 'consultation', label: 'Tư vấn', icon: '💬' },
    { value: 'lab_booking', label: 'Đặt xét nghiệm', icon: '🧪' },
    { value: 'system', label: 'Hệ thống', icon: '⚙️' },
  ];

  const dateFilters = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'yesterday', label: 'Hôm qua' },
    { value: 'week', label: '7 ngày qua' },
    { value: 'month', label: '30 ngày qua' },
    { value: 'all', label: 'Tất cả' },
  ];

  useEffect(() => {
    generateMockActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, typeFilter, dateFilter, searchTerm]);

  const generateMockActivities = () => {
    setLoading(true);

    // Generate more mock activities for better demonstration
    const mockActivities = [];
    const types = [
      'user_register',
      'appointment',
      'blog_approved',
      'payment',
      'consultation',
      'lab_booking',
      'system',
    ];
    const now = new Date();

    for (let i = 0; i < 100; i++) {
      const hoursAgo = Math.floor(Math.random() * 72); // Random hours within 3 days
      const activityTime = new Date(now - hoursAgo * 60 * 60 * 1000);
      const type = types[Math.floor(Math.random() * types.length)];

      const activity = {
        id: i + 1,
        type: type,
        message: generateMessage(type, i),
        time: getTimeAgo(activityTime),
        fullTime: activityTime.toLocaleString('vi-VN'),
        timestamp: activityTime,
        icon: getActivityIcon(type),
        color: getActivityColor(type),
        user: `User${Math.floor(Math.random() * 1000)}`,
        details: generateDetails(type, i),
      };

      mockActivities.push(activity);
    }

    // Sort by timestamp (newest first)
    mockActivities.sort((a, b) => b.timestamp - a.timestamp);

    setActivities(mockActivities);
    setLoading(false);
  };

  const generateMessage = (type, index) => {
    const messages = {
      user_register: [
        `Người dùng mới "Nguyễn Văn ${index}" đã đăng ký tài khoản`,
        `Tài khoản mới được tạo cho "Trần Thị ${index}"`,
        `Đăng ký thành công cho "Lê Văn ${index}"`,
      ],
      appointment: [
        `Cuộc hẹn khám với BS. Trần Thị B đã được xác nhận`,
        `Lịch hẹn mới được đặt cho ngày ${new Date().toLocaleDateString()}`,
        `Cuộc hẹn đã được hoàn thành thành công`,
      ],
      blog_approved: [
        `Bài viết "Chăm sóc sức khỏe sinh sản" đã được duyệt`,
        `Nội dung mới đã được phê duyệt và xuất bản`,
        `Bài viết về dinh dưỡng đã được duyệt`,
      ],
      payment: [
        `Thanh toán 350.000đ cho dịch vụ xét nghiệm đã hoàn tất`,
        `Giao dịch thanh toán ${(Math.random() * 1000000).toFixed(0)}đ thành công`,
        `Thanh toán dịch vụ tư vấn đã được xử lý`,
      ],
      consultation: [
        `Câu hỏi tư vấn mới từ người dùng "user${index}"`,
        `Phiên tư vấn đã được hoàn thành`,
        `Yêu cầu tư vấn sức khỏe mới được gửi`,
      ],
      lab_booking: [
        `Đặt lịch xét nghiệm STD Panel cho ngày ${new Date().toLocaleDateString()}`,
        `Lịch xét nghiệm máu đã được xác nhận`,
        `Đặt lịch kiểm tra sức khỏe định kỳ`,
      ],
      system: [
        `Hệ thống đã được cập nhật phiên bản mới`,
        `Backup dữ liệu đã hoàn thành`,
        `Bảo trì hệ thống định kỳ đã thực hiện`,
      ],
    };

    const typeMessages = messages[type] || ['Hoạt động hệ thống'];
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  };

  const generateDetails = (type, index) => {
    switch (type) {
      case 'user_register':
        return {
          email: `user${index}@example.com`,
          role: 'customer',
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        };
      case 'payment':
        return {
          amount: Math.floor(Math.random() * 1000000),
          method: 'credit_card',
          transactionId: `TXN${Date.now()}${index}`,
        };
      case 'appointment':
        return {
          doctor: 'BS. Nguyễn Văn A',
          service: 'Khám tổng quát',
          date: new Date().toLocaleDateString(),
        };
      default:
        return {};
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      user_register: '👤',
      appointment: '📅',
      blog_approved: '📝',
      payment: '💳',
      consultation: '💬',
      lab_booking: '🧪',
      system: '⚙️',
    };
    return icons[type] || '📋';
  };

  const getActivityColor = (type) => {
    const colors = {
      user_register: '#10b981',
      appointment: '#3b82f6',
      blog_approved: '#8b5cf6',
      payment: '#f59e0b',
      consultation: '#ef4444',
      lab_booking: '#06b6d4',
      system: '#6b7280',
    };
    return colors[type] || '#6b7280';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    return date.toLocaleDateString('vi-VN');
  };

  const filterActivities = () => {
    let filtered = activities;

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter((activity) => activity.type === typeFilter);
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      let cutoffDate;

      switch (dateFilter) {
        case 'today':
          cutoffDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case 'yesterday':
          cutoffDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1
          );
          filtered = filtered.filter((activity) => {
            const activityDate = new Date(
              activity.timestamp.getFullYear(),
              activity.timestamp.getMonth(),
              activity.timestamp.getDate()
            );
            return activityDate.getTime() === cutoffDate.getTime();
          });
          break;
        case 'week':
          cutoffDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = null;
      }

      if (cutoffDate && dateFilter !== 'yesterday') {
        filtered = filtered.filter(
          (activity) => activity.timestamp >= cutoffDate
        );
      }
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (activity) =>
          activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const getActivityTypeCounts = () => {
    const counts = { all: activities.length };
    activityTypes.forEach((type) => {
      if (type.value !== 'all') {
        counts[type.value] = activities.filter(
          (a) => a.type === type.value
        ).length;
      }
    });
    return counts;
  };

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);
  const startIndex = (currentPage - 1) * activitiesPerPage;
  const endIndex = startIndex + activitiesPerPage;
  const currentActivities = filteredActivities.slice(startIndex, endIndex);

  const counts = getActivityTypeCounts();

  return (
    <div className="recent-activities">
      <div className="activities-header">
        <h1>Hoạt động gần đây</h1>
        <p>Theo dõi tất cả hoạt động và sự kiện trong hệ thống</p>

        <div className="activity-stats">
          <div className="stat-item">
            <span className="stat-number">{activities.length}</span>
            <span className="stat-label">Tổng hoạt động</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{filteredActivities.length}</span>
            <span className="stat-label">Kết quả lọc</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="activity-filters">
        <div className="filter-section">
          <label>Loại hoạt động:</label>
          <div className="type-filters">
            {activityTypes.map((type) => (
              <button
                key={type.value}
                className={`filter-btn ${typeFilter === type.value ? 'active' : ''}`}
                onClick={() => setTypeFilter(type.value)}
              >
                <span className="filter-icon">{type.icon}</span>
                <span className="filter-text">{type.label}</span>
                <span className="filter-count">
                  ({counts[type.value] || 0})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <label>Thời gian:</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="date-filter"
          >
            {dateFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <label>Tìm kiếm:</label>
          <input
            type="text"
            placeholder="Tìm kiếm hoạt động..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <button
            className="refresh-btn"
            onClick={generateMockActivities}
            disabled={loading}
          >
            {loading ? '🔄' : '↻'} Làm mới
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="activities-container">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : currentActivities.length > 0 ? (
          <div className="activities-list">
            {currentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div
                  className="activity-icon"
                  style={{ backgroundColor: activity.color }}
                >
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <div className="activity-main">
                    <div className="activity-message">{activity.message}</div>
                    <div className="activity-meta">
                      <span className="activity-user">
                        Bởi: {activity.user}
                      </span>
                      <span className="activity-time" title={activity.fullTime}>
                        {activity.time}
                      </span>
                    </div>
                  </div>
                  {Object.keys(activity.details).length > 0 && (
                    <div className="activity-details">
                      {Object.entries(activity.details).map(([key, value]) => (
                        <span key={key} className="detail-item">
                          <strong>{key}:</strong> {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="activity-type">
                  <span className={`type-badge type-${activity.type}`}>
                    {activityTypes.find((t) => t.value === activity.type)
                      ?.label || activity.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-activities">
            <p>Không tìm thấy hoạt động nào phù hợp với bộ lọc</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Trước
            </button>

            <div className="pagination-info">
              Trang {currentPage} / {totalPages}
              <span className="pagination-details">
                ({startIndex + 1}-
                {Math.min(endIndex, filteredActivities.length)} của{' '}
                {filteredActivities.length})
              </span>
            </div>

            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
