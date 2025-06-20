import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Menu,
  Button,
  Row,
  Col,
  Breadcrumb,
  Dropdown,
  Modal,
  Badge,
  Tooltip,
  List, 
  Spin,
} from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  ReadOutlined,
  TeamOutlined,
  PhoneOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  BellOutlined,
  MailOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  MenuOutlined,
  CloseOutlined,
  WechatWorkOutlined

} from '@ant-design/icons';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Logo from '@assets/Blue-full.svg?react';
import '@styles/reset.css'; // Reset CSS for consistent styling
import './Navbar.css';

const Navbar = ({ onLoginClick, isLoggedIn, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const fullname = sessionStorage.getItem('fullname') || 'Người dùng';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pathDisplayNames = {
    'dich-vu': 'Dịch vụ',
    'tin-tuc': 'Tin tức',
    've-chung-toi': 'Về chúng tôi',
    'lien-he': 'Liên hệ',
    'tai-khoan': 'Tài khoản',
    'chu-ki': 'Theo dõi chu kỳ',
    'hoi-dap': 'Hỏi đáp',

  };

  const pathnames = location.pathname.split('/').filter((x) => x);

  const menuItems = [
    { label: <Link to="/">Trang Chủ</Link>, key: 'home', icon: <HomeOutlined /> },
    { label: <Link to="/dich-vu">Dịch vụ</Link>, key: 'services', icon: <AppstoreOutlined /> },
    { label: <Link to="/tin-tuc">Tin tức</Link>, key: 'news', icon: <ReadOutlined /> },
    { label: <Link to="/ve-chung-toi">Về chúng tôi</Link>, key: 'about', icon: <TeamOutlined /> },
    { label: <Link to="/lien-he">Liên hệ</Link>, key: 'contact', icon: <PhoneOutlined /> },
    { label: <Link to="/hoi-dap">QaA</Link>, key: 'questions', icon: <WechatWorkOutlined /> },
  ];

  const handleConfirmLogout = () => {
    Modal.confirm({
      title: `Đăng xuất khỏi tài khoản ${fullname}?`,
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      centered: true,
      okButtonProps: {
        style: {
          background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
          border: 'none',
        },
      },
      onOk: () => {
        sessionStorage.clear();
        onLogout();
        navigate('/');
      },
    });
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
      {
        key: 'settings',
        label: (
          <span className="dropdown-link">
            <AppstoreOutlined style={{ marginRight: '8px' }} />
            Cài đặt
          </span>
        ),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: (
          <span
            onClick={handleConfirmLogout}
            className="dropdown-link logout-link"
          >
            <PhoneOutlined style={{ marginRight: '8px' }} />
            Đăng xuất
          </span>
        ),
      },
    ],
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const [notifications, setNotifications] = useState([]);
  const [_loading, setLoading] = useState(false); //Thêm mục loading vào sau khi call api

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/notifications?userId=1');
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchNotifications();
  }, [isLoggedIn]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const notiDropdown = {
    items: notifications.map((item, index) => ({
      key: `noti-${index}`,
      label: (
        <div style={{ whiteSpace: 'normal', maxWidth: 250 }}>
          <strong>{item.title || 'Thông báo mới'}</strong>
          <div style={{ fontSize: 12, color: '#888' }}>{item.message}</div>
        </div>
      ),
      style: {
        backgroundColor: item.read ? '#fff' : '#f6f6f6',
      },
    })),
  };


  return (
    <div className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top contact bar - hidden on mobile */}
      <div className="top-bar desktop-only">
        <div className="top-bar-content">
          <div className="contact-info">
            <div className="contact-item">
              <PhoneOutlined className="top-bar-icon" />
              <span>Hotline: (024) 3926 1234</span>
            </div>
            <div className="contact-item">
              <ClockCircleOutlined className="top-bar-icon" />
              <span>7:00 - 18:00 Hằng ngày</span>
            </div>
            <div className="contact-item">
              <MailOutlined className="top-bar-icon" />
              <span>support@gendercare.vn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="main-nav">
        <div className="nav-content">
          <div className="nav-left">
            <Link to="/" className="logo-container">
              <Logo className="logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="nav-center desktop-menu">
            <Menu
              mode="horizontal"
              items={menuItems}
              selectedKeys={[location.pathname.split('/')[1] || 'home']}
              className="nav-menu"
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
            <Tooltip title="Thông báo">
              <Badge count={3} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  className="action-button"
                />
              </Badge>
            </Tooltip>

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
            {menuItems.map((item) => (
              <div key={item.key} className="mobile-menu-item">
                {item.icon}
                {item.label}
              </div>
            ))}
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
            <Button className="login-button" icon={<UserOutlined />} onClick={onLoginClick}>
              Tài khoản
            </Button>
          )}

          <Dropdown menu={notiDropdown} placement="bottomRight" arrow trigger={['click']}>
            <Badge count={unreadCount} offset={[-2, 2]} size="small">
              <Button shape="default" icon={<BellOutlined />} className="noti-button" />
            </Badge>
          </Dropdown>
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
                }),
              ]}
            />
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default Navbar;
