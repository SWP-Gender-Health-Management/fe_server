import React from 'react';
import { Menu, Button, Row, Col, Breadcrumb, Dropdown, Modal } from 'antd';
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
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Logo from '@assets/Blue-full.svg?react';
import './Navbar.css';

const Navbar = ({ onLoginClick, isLoggedIn, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const fullname = sessionStorage.getItem('fullname') || 'Người dùng';

  const pathDisplayNames = {
    'dich-vu': 'Dịch vụ',
    'tin-tuc': 'Tin tức',
    've-chung-toi': 'Về chúng tôi',
    'lien-he': 'Liên hệ',
    'tai-khoan': 'Tài khoản'
  };

  const pathnames = location.pathname.split('/').filter(x => x);

  const menuItems = [
    { label: <Link to="/">Trang Chủ</Link>, key: 'home', icon: <HomeOutlined /> },
    { label: <Link to="/dich-vu">Dịch vụ</Link>, key: 'services', icon: <AppstoreOutlined /> },
    { label: <Link to="/tin-tuc">Tin tức</Link>, key: 'news', icon: <ReadOutlined /> },
    { label: <Link to="/ve-chung-toi">Về chúng tôi</Link>, key: 'about', icon: <TeamOutlined /> },
    { label: <Link to="/lien-he">Liên hệ</Link>, key: 'contact', icon: <PhoneOutlined /> },
  ];

  const handleConfirmLogout = () => {
    Modal.confirm({
      title: `Đăng xuất khỏi tài khoản ${fullname}?`,
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      centered: true,
      onOk: () => {
        sessionStorage.clear();
        onLogout();
        navigate('/');
      }
    });
  };

  const accountMenu = {
    items: [
      {
        key: 'account',
        label: <Link to="/tai-khoan">Tài khoản</Link>,
      },
      {
        key: 'logout',
        label: <span onClick={handleConfirmLogout}>Đăng xuất</span>,
      },
    ]
  };

  return (
    <div className="navbar-container">
      {/* Top bar */}
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

      {/* Main nav */}
      <div className="main-nav">
        <Logo className="logo" />
        <div className="nav-left">
          <Menu
            mode="horizontal"
            items={menuItems}
            selectedKeys={[location.pathname.split('/')[1] || 'home']}
            className="nav-menu"
          />
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

          <Button className="noti-button" icon={<BellOutlined />} />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <Breadcrumb
          items={[
            { title: <Link to="/">Trang chủ</Link> },
            ...pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
              const displayName = pathDisplayNames[name] || name.replace(/-/g, ' ');
              return {
                title:
                  index === pathnames.length - 1
                    ? displayName
                    : <Link to={routeTo}>{displayName}</Link>,
              };
            }),
          ]}
        />
      </div>
    </div>
  );
};

export default Navbar;
