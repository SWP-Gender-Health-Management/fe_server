import React, { useState, useEffect } from 'react';
import {
  Badge,
  Dropdown,
  Button,
  List,
  Spin,
  Empty,
  Typography,
  Divider,
  Avatar,
  Tag,
  Tooltip,
} from 'antd';
import {
  BellOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  WechatWorkOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/vi';
import './NotificationDropdown.css';
import Cookies from 'js-cookie';

const { Text } = Typography;

// Set Vietnamese locale for moment
moment.locale('vi');

const API_URL = 'http://localhost:3000';

const NotificationDropdown = ({ isLoggedIn, onLoginClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const pageSize = 8; // Hiển thị 8 thông báo đầu tiên
  const loadMoreSize = 4; // Load thêm 4 thông báo mỗi lần

  // Fetch notifications từ API
  const fetchNotifications = async (pageNum = 1, reset = false) => {
    if (!isLoggedIn) return;

    const currentSize = pageNum === 1 ? pageSize : loadMoreSize;
    const skip = pageNum === 1 ? 0 : pageSize + (pageNum - 2) * loadMoreSize;
    const token = Cookies.get('accessToken');
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await axios.get(
        `${API_URL}/notification/get-notification`,
        {
          params: {
            limit: currentSize,
            skip: skip,
            // userId: getUserId(), // Hàm helper để lấy user ID
          },
          headers: {
            Authorization: `Bearer ${token}`, // Hàm helper để lấy token
          },
        }
      );

      const {
        noti,
        total,
        // hasMore: moreAvailable,
      } = response.data;

      if (pageNum === 1 || reset) {
        setNotifications(noti);
      } else {
        setNotifications((prev) => [...prev, ...noti]);
      }

      setTotal(total);
      setHasMore(total > noti.length);
      setPage(pageNum);
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error);
      // Fallback với dữ liệu mẫu nếu API lỗi
      // if (pageNum === 1) {
      //   setNotifications(getMockNotifications());
      //   setTotal(15);
      //   setHasMore(true);
      // } else {
      //   // Load more data mẫu
      //   const moreNotifications = getMoreMockNotifications();
      //   setNotifications((prev) => [...prev, ...moreNotifications]);
      //   setHasMore(moreNotifications.length === loadMoreSize);
      // }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Helper function để lấy user ID
  const getUserId = () => {
    return (
      sessionStorage.getItem('userId') || localStorage.getItem('userId') || '1'
    );
  };

  // Helper function để lấy token
  const getToken = () => {
    return (
      sessionStorage.getItem('app_token') || localStorage.getItem('app_token')
    );
  };

  // Dữ liệu mẫu cho thông báo
  // const getMockNotifications = () => [
  //   {
  //     id: 1,
  //     title: 'Đặt lịch thành công',
  //     message:
  //       'Bạn đã đặt lịch khám sức khỏe tổng quát thành công vào ngày 28/12/2024 lúc 9:00 AM',
  //     type: 'appointment',
  //     read: false,
  //     createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 phút trước
  //     priority: 'high',
  //   },
  //   {
  //     id: 2,
  //     title: 'Đã trả lời câu hỏi',
  //     message:
  //       'Bác sĩ Nguyễn Văn A đã trả lời câu hỏi "Làm thế nào để duy trì chu kỳ kinh nguyệt đều đặn?" của bạn',
  //     type: 'question',
  //     read: false,
  //     createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 giờ trước
  //     priority: 'medium',
  //   },
  //   {
  //     id: 3,
  //     title: 'Đổi mật khẩu thành công',
  //     message:
  //       'Mật khẩu tài khoản của bạn đã được thay đổi thành công lúc 14:30 hôm nay',
  //     type: 'security',
  //     read: false,
  //     createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 giờ trước
  //     priority: 'high',
  //   },
  //   {
  //     id: 4,
  //     title: 'Đặt lịch thành công',
  //     message:
  //       'Lịch hẹn tư vấn dinh dưỡng của bạn đã được xác nhận vào ngày 30/12/2024 lúc 14:00',
  //     type: 'appointment',
  //     read: true,
  //     createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 ngày trước
  //     priority: 'medium',
  //   },
  //   {
  //     id: 5,
  //     title: 'Câu hỏi được phản hồi',
  //     message:
  //       'Chuyên gia đã trả lời câu hỏi "Thực đơn dinh dưỡng cho phụ nữ mang thai" của bạn',
  //     type: 'question',
  //     read: true,
  //     createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), // 1.5 ngày trước
  //     priority: 'medium',
  //   },
  //   {
  //     id: 6,
  //     title: 'Đặt lịch khám thành công',
  //     message:
  //       'Bạn đã đặt lịch xét nghiệm máu định kỳ thành công. Ngày hẹn: 02/01/2025 lúc 8:00 AM',
  //     type: 'appointment',
  //     read: true,
  //     createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 ngày trước
  //     priority: 'high',
  //   },
  //   {
  //     id: 7,
  //     title: 'Cập nhật bảo mật',
  //     message:
  //       'Bạn đã cập nhật thông tin bảo mật tài khoản và thiết lập xác thực 2 bước thành công',
  //     type: 'security',
  //     read: true,
  //     createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 ngày trước
  //     priority: 'medium',
  //   },
  //   {
  //     id: 8,
  //     title: 'Phản hồi câu hỏi mới',
  //     message:
  //       'Bác sĩ đã trả lời câu hỏi "Cách chăm sóc sức khỏe sau sinh" với lời khuyên chi tiết',
  //     type: 'question',
  //     read: true,
  //     createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 ngày trước
  //     priority: 'medium',
  //   },
  //   {
  //     id: 9,
  //     title: 'Đặt lịch tái khám thành công',
  //     message:
  //       'Lịch tái khám sau điều trị đã được đặt thành công vào ngày 15/01/2025 lúc 10:30 AM',
  //     type: 'appointment',
  //     read: true,
  //     createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 ngày trước
  //     priority: 'high',
  //   },
  //   {
  //     id: 10,
  //     title: 'Thay đổi mật khẩu',
  //     message:
  //       'Mật khẩu của bạn đã được thay đổi thành công. Nếu không phải bạn, vui lòng liên hệ hỗ trợ',
  //     type: 'security',
  //     read: true,
  //     createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 ngày trước
  //     priority: 'high',
  //   },
  // ];

  // // Dữ liệu mẫu bổ sung cho load more
  // const getMoreMockNotifications = () => [
  //   {
  //     id: 11,
  //     title: 'Câu hỏi về dinh dưỡng đã được trả lời',
  //     message:
  //       'Chuyên gia dinh dưỡng đã phản hồi câu hỏi "Chế độ ăn cho người tiểu đường thai kỳ"',
  //     type: 'question',
  //     read: true,
  //     createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 ngày trước
  //     priority: 'medium',
  //   },
  //   {
  //     id: 12,
  //     title: 'Đặt lịch tư vấn thành công',
  //     message:
  //       'Lịch tư vấn tâm lý sau sinh đã được đặt thành công vào ngày 20/01/2025 lúc 16:00',
  //     type: 'appointment',
  //     read: true,
  //     createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 ngày trước
  //     priority: 'medium',
  //   },
  //   {
  //     id: 13,
  //     title: 'Thay đổi email thành công',
  //     message:
  //       'Email tài khoản đã được cập nhật thành công. Vui lòng kiểm tra email xác nhận',
  //     type: 'security',
  //     read: true,
  //     createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 ngày trước
  //     priority: 'medium',
  //   },
  //   {
  //     id: 14,
  //     title: 'Phản hồi tư vấn sức khỏe',
  //     message:
  //       'Bác sĩ đã trả lời câu hỏi "Cách tăng cường sức đề kháng cho phụ nữ"',
  //     type: 'question',
  //     read: true,
  //     createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 ngày trước
  //     priority: 'low',
  //   },
  //   {
  //     id: 15,
  //     title: 'Đặt lịch kiểm tra thành công',
  //     message:
  //       'Lịch kiểm tra sức khỏe định kỳ đã được đặt vào ngày 25/01/2025 lúc 9:30 AM',
  //     type: 'appointment',
  //     read: true,
  //     createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), // 11 ngày trước
  //     priority: 'low',
  //   },
  // ];

  // Load thêm thông báo
  const loadMoreNotifications = () => {
    if (!loadingMore && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  // Đánh dấu đã đọc
  // const markAsRead = async (notificationId) => {
  //   try {
  //     await axios.patch(
  //       `${API_URL}/api/notifications/${notificationId}/read`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${getToken()}`,
  //         },
  //       }
  //     );

  //     setNotifications((prev) =>
  //       prev.map((notif) =>
  //         notif.id === notificationId ? { ...notif, read: true } : notif
  //       )
  //     );
  //   } catch (error) {
  //     console.error('Lỗi khi đánh dấu đã đọc:', error);
  //     // Fallback: update local state
  //     setNotifications((prev) =>
  //       prev.map((notif) =>
  //         notif.id === notificationId ? { ...notif, read: true } : notif
  //       )
  //     );
  //   }
  // };

  // Đánh dấu tất cả đã đọc
  const markAllAsRead = async () => {
    const token = Cookies.get('accessToken');
    try {
      await axios.put(
        `${API_URL}/notification/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', error);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type, priority) => {
    const iconProps = {
      style: {
        fontSize: '16px',
        color: getNotificationColor(type, priority),
      },
    };

    switch (type) {
      case 'appointment':
        return <ClockCircleOutlined {...iconProps} />;
      case 'result':
        return <CheckCircleOutlined {...iconProps} />;
      case 'reminder':
        return <ExclamationCircleOutlined {...iconProps} />;
      case 'question':
        return <WechatWorkOutlined {...iconProps} />;
      case 'security':
        return <SecurityScanOutlined {...iconProps} />;
      default:
        return <InfoCircleOutlined {...iconProps} />;
    }
  };

  // Get color based on type and priority
  const getNotificationColor = (type, priority) => {
    // Màu sắc theo loại thông báo
    const typeColors = {
      appointment: '#1890ff', // Xanh dương cho lịch hẹn
      question: '#52c41a', // Xanh lá cho câu hỏi
      security: '#fa541c', // Cam đỏ cho bảo mật
      result: '#722ed1', // Tím cho kết quả
      payment: '#13c2c2', // Xanh ngọc cho thanh toán
      reminder: '#faad14', // Vàng cho nhắc nhở
    };

    // Ưu tiên màu theo loại, sau đó theo priority
    const baseColor = typeColors[type] || '#1890ff';

    // Điều chỉnh độ đậm theo priority
    if (priority === 'high') {
      return baseColor; // Màu đậm nhất
    } else if (priority === 'medium') {
      return baseColor; // Màu trung bình
    } else {
      return baseColor; // Màu nhạt nhất
    }
  };

  // Format time display
  const formatTime = (date) => {
    const now = moment();
    const notifTime = moment(date);
    const diffHours = now.diff(notifTime, 'hours');
    const diffDays = now.diff(notifTime, 'days');

    if (diffHours < 1) {
      return 'Vừa xong';
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return notifTime.format('DD/MM/YYYY');
    }
  };

  // Load notifications when component mounts
  useEffect(() => {
    if (isLoggedIn && visible) {
      fetchNotifications(1, true);
    }
  }, [isLoggedIn, visible]);

  // Tính số thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Refresh notifications
  const refreshNotifications = () => {
    setPage(1);
    setHasMore(true);
    fetchNotifications(1, true);
  };

  // Notification dropdown content
  const notificationContent = (
    <div className="notification-dropdown">
      {/* Header */}
      <div className="notification-header">
        <div className="notification-title">
          <Text strong>Thông báo</Text>
          {total > 0 && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {total}
            </Tag>
          )}
        </div>
        <div className="notification-actions">
          <Tooltip title="Làm mới">
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined />}
              onClick={refreshNotifications}
              loading={loading}
            />
          </Tooltip>
          {unreadCount > 0 && (
            <Button type="text" size="small" onClick={markAllAsRead}>
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* Notification List */}
      <div className="notification-list">
        {loading ? (
          <div className="notification-loading">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              tip="Đang tải thông báo..."
            />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            description="Không có thông báo nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: '20px 0' }}
          />
        ) : (
          <>
            <List
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  className={`notification-item ${!item.read ? 'unread' : 'read'}`}
                  onClick={() => !item.read && markAsRead(item.id)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={getNotificationIcon(item.type, item.priority)}
                        style={{
                          backgroundColor: !item.read ? '#f0f2ff' : '#f5f5f5',
                          border: `2px solid ${getNotificationColor(item.type, item.priority)}`,
                        }}
                      />
                    }
                    title={
                      <div className="notification-item-title">
                        <Text
                          strong={!item.read}
                          className="notification-title-text"
                        >
                          {item.title}
                        </Text>
                        {!item.read && <div className="unread-indicator" />}
                      </div>
                    }
                    description={
                      <div className="notification-description">
                        <Text className="notification-message">
                          {item.message}
                        </Text>
                        <Text type="secondary" className="notification-time">
                          {formatTime(item.createdAt)}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />

            {/* Load More Button */}
            {hasMore && (
              <div className="notification-load-more">
                <Button
                  type="primary"
                  ghost
                  block
                  loading={loadingMore}
                  onClick={loadMoreNotifications}
                  icon={<ReloadOutlined />}
                >
                  {loadingMore ? 'Đang tải...' : `Tải thêm thông báo`}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (!isLoggedIn) {
    const notLoginContent = (
      <div className="notification-dropdown">
        <div className="notification-header">
          <div className="notification-title">
            <Text strong>Thông báo</Text>
          </div>
        </div>
        <Divider style={{ margin: '8px 0' }} />
        <div className="notification-list">
          <Empty
            description="Vui lòng đăng nhập để xem thông báo"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: '40px 20px' }}
          >
            <Button type="primary" onClick={onLoginClick}>
              Đăng nhập ngay
            </Button>
          </Empty>
        </div>
      </div>
    );

    return (
      <Dropdown
        dropdownRender={() => notLoginContent}
        placement="bottomRight"
        trigger={['click']}
        overlayClassName="notification-dropdown-overlay"
        overlayStyle={{ width: 380 }}
      >
        <Tooltip title="Thông báo">
          <Button
            type="text"
            icon={<BellOutlined />}
            className="notification-trigger-button"
          />
        </Tooltip>
      </Dropdown>
    );
  }

  return (
    <Dropdown
      dropdownRender={() => notificationContent}
      placement="bottomRight"
      trigger={['click']}
      open={visible}
      onOpenChange={setVisible}
      overlayClassName="notification-dropdown-overlay"
      overlayStyle={{ width: 380 }}
    >
      <Tooltip title="Thông báo">
        <Badge
          count={unreadCount}
          size="small"
          offset={[-2, 2]}
          overflowCount={99}
        >
          <Button
            type="text"
            icon={<BellOutlined />}
            className="notification-trigger-button"
          />
        </Badge>
      </Tooltip>
    </Dropdown>
  );
};

export default NotificationDropdown;
