import React, { useState, useEffect } from 'react';
import './RecentActivities.css';

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const activitiesPerPage = 20;

  useEffect(() => {
    generateMockActivities();
  }, []);

  const generateMockActivities = () => {
    setLoading(true);

    // Generate mock activities
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

  // Pagination
  const totalPages = Math.ceil(activities.length / activitiesPerPage);
  const startIndex = (currentPage - 1) * activitiesPerPage;
  const paginatedActivities = activities.slice(
    startIndex,
    startIndex + activitiesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="recent-activities">
      <div className="activities-header">
        <h1>
          <span className="header-icon">📋</span>
          Hoạt động gần đây
        </h1>
        <p>
          <span className="desc-icon">🔍</span>
          Xem tất cả hoạt động trong hệ thống
        </p>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <>
          {/* Activities List */}
          <div className="activities-list">
            {paginatedActivities.map((activity) => (
              <div key={activity.id} className="activity-item-simple">
                <div className="activity-content">
                  <div className="activity-main-content">
                    <div className="activity-icon-wrapper">
                      <div
                        className="activity-icon"
                        style={{
                          backgroundColor: getActivityColor(activity.type),
                        }}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="activity-message">{activity.message}</div>
                  </div>
                  <div className="activity-time">
                    <span className="time-icon">🕒</span>
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-info">
              <span className="info-icon">📊</span>
              Hiển thị {startIndex + 1}-
              {Math.min(startIndex + activitiesPerPage, activities.length)}
              trong tổng số {activities.length} hoạt động
            </div>
            <div className="pagination-controls">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-btn"
              >
                <span className="nav-icon">←</span>
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
                    onClick={() => handlePageChange(pageNum)}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Sau
                <span className="nav-icon">→</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentActivities;
