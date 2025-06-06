import React from 'react';
import { Menu, Button, Row, Col, Breadcrumb } from 'antd';
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
  BellOutlined
} from '@ant-design/icons';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLoginClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Custom mapping for breadcrumb display names
  const pathDisplayNames = {
    'dich-vu': 'Dịch vụ',
    'tin-tuc': 'Tin tức',
    've-chung-toi': 'Về chúng tôi',
    'lien-he': 'Liên hệ',
    'tai-khoan': 'Tài khoản'
  };

  // Generate breadcrumb from pathname
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Menu items with navigation
  const menuItems = [
    { label: <Link to="/">Trang Chủ</Link>, key: 'home', icon: <HomeOutlined /> },
    { label: <Link to="/dich-vu">Dịch vụ</Link>, key: 'services', icon: <AppstoreOutlined /> },
    { label: <Link to="/tin-tuc">Tin tức</Link>, key: 'news', icon: <ReadOutlined /> },
    { label: <Link to="/ve-chung-toi">Về chúng tôi</Link>, key: 'about', icon: <TeamOutlined /> },
    { label: <Link to="/lien-he">Liên hệ</Link>, key: 'contact', icon: <PhoneOutlined /> },
  ];

  return (
    <div className="navbar-container">
      {/* Top contact info bar */}
      <div className="top-bar">
        <Row justify="space-between" className="top-bar-content">
          <Col>
            <PhoneOutlined className="top-bar-icon" />
            <span>HOTLINE (024)0000000</span>
          </Col>
          <Col>
            <ClockCircleOutlined className="top-bar-icon" />
            <span>08:00 - 17:00 Hằng ngày</span>
          </Col>
          <Col>
            <EnvironmentOutlined className="top-bar-icon" />
            <span>ĐỊA CHỈ TP.HCM</span>
          </Col>
        </Row>
      </div>

      {/* Main navigation bar */}
      <div className="main-nav">
        <div className="nav-left">
          <div className="logo" onClick={() => navigate('/')}>🌐</div>
          <Menu
            mode="horizontal"
            items={menuItems}
            selectedKeys={[location.pathname.split('/')[1] || 'home']}
            className="nav-menu"
          />
        </div>

        <div className="nav-right">
          <SearchOutlined className="search-icon" />
          <Button
            className="login-button"
            icon={<UserOutlined />}
            onClick={onLoginClick}
          >
            Tài khoản
          </Button>
          <Button
            className="noti-button"
            icon={<BellOutlined />}
            >
          </Button>
        </div>
      </div>

      {/* Breadcrumb navigation */}
      <div className="breadcrumb-bar">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Trang chủ</Link>
        </Breadcrumb.Item>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const displayName = pathDisplayNames[name] || name.replace(/-/g, ' ');
          
          return (
            <Breadcrumb.Item key={name}>
              {index === pathnames.length - 1 ? (
                displayName
              ) : (
                <Link to={routeTo}>{displayName}</Link>
              )}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      </div>
    </div>
  );
};

export default Navbar;