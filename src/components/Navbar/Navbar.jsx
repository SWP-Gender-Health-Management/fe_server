import {
  AppstoreOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  ExperimentOutlined,
  HeartOutlined,
  HomeOutlined,
  MailOutlined,
  MenuOutlined,
  PhoneOutlined,
  ReadOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  WechatWorkOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Dropdown, Menu, Tooltip } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Logo from '@assets/Blue-full.svg?react';
import Logout from '@components/Logout/Logout';
import { useAuth } from '@context/AuthContext';
import '@styles/reset.css';
import NotificationDropdown from '../Notification/NotificationDropdown';
import api from '@/api/api';

import './Navbar.css';

const API_URL = 'http://localhost:3000';

const Navbar = ({ onLoginClick }) => {
  const { isLoggedIn, userInfo, onLogout } = useAuth(); // ✅ lấy từ context
  const { fullname, role } = userInfo || {};
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [blogTitle, setBlogTitle] = useState(null);
  const [loading, setLoading] = useState(false); // Sửa tên _loading thành loading

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const match = location.pathname.match(/^\/blog\/(\d+)$/);
    if (match) {
      const blogId = match[1];
      const fetchBlogTitle = async () => {
        try {
          const res = await api.get(`/blog/get-blog-by-id/${blogId}`);
          setBlogTitle(res.data.result.title);
        } catch (error) {
          console.error('Không lấy được tiêu đề blog:', error);
          setBlogTitle('Không tìm thấy');
        }
      };
      fetchBlogTitle();
    }
  }, [location.pathname]);

  const pathDisplayNames = {
    'dich-vu': 'Dịch vụ',
    'tin-tuc': 'Tin tức',
    've-chung-toi': 'Về chúng tôi',
    'lien-he': 'Liên hệ',
    'tai-khoan': 'Tài khoản',
    'chu-ki': 'Theo dõi chu kỳ',
    'hoi-dap': 'Hỏi đáp',
    'chu-ky-kinh-nguyet': 'Chu kỳ kinh nguyệt',
    'admin': 'Quản trị viên',
    'blog': 'Blog',
    'dat-lich-xet-nghiem': 'Đặt lịch xét nghiệm',
    'dat-lich-tu-van': 'Đặt lịch tư vấn',
  };

  const pathnames = location.pathname.split('/').filter((x) => x);

  // Services dropdown menu
  const servicesMenu = {
    items: [
      {
        key: 'cycle-tracking',
        label: (
          <Link to="/dich-vu/chu-ky-kinh-nguyet" className="dropdown-link">
            <HeartOutlined style={{ marginRight: '8px', color: '#ff69b4' }} />
            <div>
              <div className="service-title">Theo dõi chu kỳ kinh nguyệt</div>
              <div className="service-desc">
                Theo dõi và dự đoán chu kỳ thông minh
              </div>
            </div>
          </Link>
        ),
      },
      {
        key: 'lab-booking',
        label: (
          <Link to="/dat-lich-xet-nghiem" className="dropdown-link">
            <ExperimentOutlined
              style={{ marginRight: '8px', color: '#4ecdc4' }}
            />
            <div>
              <div className="service-title">Đặt lịch xét nghiệm</div>
              <div className="service-desc">Xét nghiệm sức khỏe sinh sản</div>
            </div>
          </Link>
        ),
      },
      {
        key: 'consultation',
        label: (
          <Link to="/dat-lich-tu-van" className="dropdown-link">
            <CalendarOutlined
              style={{ marginRight: '8px', color: '#667eea' }}
            />
            <div>
              <div className="service-title">Tư vấn 1:1 với bác sĩ</div>
              <div className="service-desc">
                Tư vấn trực tiếp với chuyên gia
              </div>
            </div>
          </Link>
        ),
      },
      { type: 'divider' },
      {
        key: 'all-services',
        label: (
          <Link to="/dich-vu" className="dropdown-link view-all">
            <AppstoreOutlined style={{ marginRight: '8px' }} />
            Xem tất cả dịch vụ
          </Link>
        ),
      },
    ],
  };

  const menuItems = [
    {
      label: <Link to="/">Trang Chủ</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: (
        <Dropdown
          menu={servicesMenu}
          placement="bottom"
          trigger={['hover']}
          overlayClassName="services-dropdown"
        >
          <span className="nav-link-1 dropdown-trigger">Dịch vụ</span>
        </Dropdown>
      ),
      key: 'services',
      icon: <AppstoreOutlined />,
    },
    {
      label: <Link to="/tin-tuc">Tin tức</Link>,
      key: 'news',
      icon: <ReadOutlined />,
    },
    {
      label: <Link to="/ve-chung-toi">Về chúng tôi</Link>,
      key: 'about',
      icon: <TeamOutlined />,
    },
    {
      label: <Link to="/lien-he">Liên hệ</Link>,
      key: 'contact',
      icon: <PhoneOutlined />,
    },
    {
      label: <Link to="/hoi-dap">QaA</Link>,
      key: 'questions',
      icon: <WechatWorkOutlined />,
    },
  ];
  const roleRoutes = {
    ADMIN: { path: '/admin', label: 'Admin' },
    STAFF: { path: '/staff', label: 'Nhân viên' },
    MANAGER: { path: '/manager', label: 'Quản lý' },
    CONSULTANT: { path: '/consultant', label: 'Tư vấn' },
    RECEPTIONIST: { path: '/receptionist', label: 'Lễ tân' },
  };

  const accountMenu = {
    items: [
      {
        key: 'profile',
        label: (
          <Link to="/tai-khoan" className="dropdown-link">
            <UserOutlined style={{ marginRight: '8px' }} />
            Hồ sơ cá nhân
          </Link>
        ),
      },
      ...(role === 'CUSTOMER' || role === 3
        ? []
        : [
            {
              key: 'settings',
              label: (
                <Link
                  to={roleRoutes[role]?.path || '/settings'}
                  className="dropdown-link"
                >
                  <AppstoreOutlined style={{ marginRight: '8px' }} />
                  {roleRoutes[role]?.label || 'Cài đặt'}
                </Link>
              ),
            },
          ]),
      { type: 'divider' },
      {
        key: 'logout',
        label: (
          <span
            onClick={() => setIsLogoutVisible(true)}
            className="dropdown-link logout-link"
          >
            <AppstoreOutlined style={{ marginRight: '8px' }} />
            Đăng xuất
          </span>
        ),
      },
    ],
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const userId = Cookies.get('accountId') || 1; // Thay sessionStorage bằng Cookies
      const res = await axios.get(
        `${API_URL}/api/notifications?userId=${userId}`
      );
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchNotifications();
  }, [isLoggedIn]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const notiDropdown = {
    items: notifications.map((item, index) => ({
      key: `noti-${index}`,
      label: (
        <div style={{ whiteSpace: 'normal', maxWidth: 250 }}>
          <strong>{item.title || 'Thông báo mới'}</strong>
          <div style={{ fontSize: 12, color: '#888' }}>{item.message}</div>
        </div>
      ),
      style: { backgroundColor: item.read ? '#fff' : '#f6f6f6' },
    })),
  };

  return (
    <div className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top contact bar - hidden on mobile */}
      <div className="top-bar desktop-only">
        <div className="top-bar-content">
          <div className="top-bar-layout">
            <div className="contact-1">
              <div className="contact-info row-direction">
                <div className="top-contact-item">
                  <PhoneOutlined className="top-bar-icon" />
                  <span>Hotline: (024) 3926 1234</span>
                </div>
                <div className="top-contact-item">
                  <ClockCircleOutlined className="top-bar-icon" />
                  <span>7:00 - 18:00 Hằng ngày</span>
                </div>
                <div className="top-contact-item">
                  <MailOutlined className="top-bar-icon" />
                  <span>support@gendercare.vn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="main-nav">
        <div className="nav-content">
          <div className="nav-left">
            <Link to="/" className="logo-container">
              <Logo className="nav-logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="nav-center desktop-menu">
            <Menu
              mode="horizontal"
              items={menuItems}
              selectedKeys={[location.pathname.split('/')[1] || 'home']}
              className="nav-menu-1"
            />
          </div>

          <div className="nav-right">
            {/* Search Icon */}
            <Tooltip title="Tìm kiếm">
              <Button
                type="text"
                icon={<SearchOutlined />}
                className="action-button search-button"
              />
            </Tooltip>

            {/* Notifications */}
            <NotificationDropdown
              isLoggedIn={isLoggedIn}
              onLoginClick={onLoginClick}
              menu={notiDropdown}
              unreadCount={unreadCount}
              loading={loading}
            />

            {/* User Account */}
            {isLoggedIn ? (
              <Dropdown
                menu={accountMenu}
                placement="bottomRight"
                trigger={['click']}
                overlayClassName="user-dropdown"
              >
                <Button className="user-button">
                  <UserOutlined />
                  <span className="user-name">{fullname}</span>
                </Button>
              </Dropdown>
            ) : (
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={onLoginClick}
                className="login-button"
              >
                Đăng nhập
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              type="text"
              icon={isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
              onClick={toggleMobileMenu}
              className="mobile-menu-button"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <div className="mobile-menu-item">
              <HomeOutlined />
              <Link to="/">Trang Chủ</Link>
            </div>
            <div className="mobile-menu-item">
              <AppstoreOutlined />
              <Dropdown
                menu={servicesMenu}
                placement="bottomLeft"
                trigger={['click']}
                overlayClassName="services-dropdown mobile-services-dropdown"
              >
                <span className="nav-link-1 dropdown-trigger">Dịch vụ</span>
              </Dropdown>
            </div>
            <div className="mobile-menu-item">
              <ReadOutlined />
              <Link to="/tin-tuc">Tin tức</Link>
            </div>
            <div className="mobile-menu-item">
              <TeamOutlined />
              <Link to="/ve-chung-toi">Về chúng tôi</Link>
            </div>
            <div className="mobile-menu-item">
              <PhoneOutlined />
              <Link to="/lien-he">Liên hệ</Link>
            </div>
            <div className="mobile-menu-item">
              <WechatWorkOutlined />
              <Link to="/hoi-dap">QaA</Link>
            </div>
          </div>

          <div className="nav-right">
            <SearchOutlined className="search-icon" />

            {isLoggedIn ? (
              <Dropdown menu={accountMenu} placement="bottomRight">
                <Button className="login-button" icon={<UserOutlined />}>
                  {fullname}
                </Button>
              </Dropdown>
            ) : (
              <Button
                className="login-button"
                icon={<UserOutlined />}
                onClick={onLoginClick}
              >
                Tài khoản
              </Button>
            )}

            <NotificationDropdown
              isLoggedIn={isLoggedIn}
              onLoginClick={onLoginClick}
              menu={notiDropdown}
              unreadCount={unreadCount}
              loading={loading}
            />
          </div>
        </div>

        {/* Breadcrumb - only show on non-home pages */}
        {pathnames.length > 0 && (
          <div className="breadcrumb-bar">
            <div className="breadcrumb-content">
              <Breadcrumb
                items={[
                  {
                    title: (
                      <Link to="/" className="breadcrumb-link">
                        Trang chủ
                      </Link>
                    ),
                  },
                  ...pathnames.map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    if (
                      index === pathnames.length - 1 &&
                      pathnames[index - 1] === 'blog' &&
                      !isNaN(name)
                    ) {
                      return {
                        title: (
                          <span className="breadcrumb-current">
                            {blogTitle || 'Đang tải...'}
                          </span>
                        ),
                      };
                    } else {
                      const displayName =
                        pathDisplayNames[name] || name.replace(/-/g, ' ');
                      return {
                        title:
                          index === pathnames.length - 1 ? (
                            <span className="breadcrumb-current">
                              {displayName}
                            </span>
                          ) : (
                            <Link to={routeTo} className="breadcrumb-link">
                              {displayName}
                            </Link>
                          ),
                      };
                    }
                  }),
                ]}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal Logout */}
      <Logout
        open={isLogoutVisible}
        onCancel={() => setIsLogoutVisible(false)}
        onLogout={onLogout}
      />
    </div>
  );
};

export default Navbar;
