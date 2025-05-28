import React from 'react';
import { Menu, Button, Row, Col } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  ReadOutlined,
  TeamOutlined,
  PhoneOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

const items = [
  { label: 'Trang Chủ', key: 'home', icon: <HomeOutlined /> },
  { label: 'Dịch vụ', key: 'services', icon: <AppstoreOutlined /> },
  { label: 'Tin tức', key: 'news', icon: <ReadOutlined /> },
  { label: 'Về chúng tôi', key: 'about', icon: <TeamOutlined /> },
  {
    label: (
      <span
        style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: 4 }}
      >
        Liên hệ
      </span>
    ),
    key: 'contact',
    icon: <PhoneOutlined />,
  },
];

const Navbar = ({ onLoginClick }) => {
  return (
    <div>
      {/* ✅ TOP BAR riêng biệt */}
      <div
        style={{
          backgroundColor: '#0766F7',
          color: 'white',
          fontSize: 13,
          padding: '4px 24px',
        }}
      >
        <Row justify="space-between">
          <Col>
            <PhoneOutlined style={{ marginRight: 6 }} />
            HOTLINE (024)0000000
          </Col>
          <Col>
            <ClockCircleOutlined style={{ marginRight: 6 }} />
            08:00 - 17:00 Hằng ngày
          </Col>
          <Col>
            <EnvironmentOutlined style={{ marginRight: 6 }} />
            ĐỊA CHỈ TP.HCM
          </Col>
        </Row>
      </div>

      {/* ✅ NAVIGATION BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e8e8e8',
          height: 64,
          justifyContent: 'space-between',
        }}
      >
        {/* Logo + Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ fontWeight: 'bold', fontSize: 24, color: '#1677ff' }}>
            🌐
          </div>
          <Menu
            mode="horizontal"
            items={items}
            defaultSelectedKeys={['home']}
          />
        </div>

        {/* Search + Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <SearchOutlined style={{ fontSize: 18 }} />
          <Button
            style={{
              backgroundColor: '#facc15',
              color: '#000',
              fontWeight: 600,
              border: 'none',
              borderRadius: '999px',
            }}
            onClick={onLoginClick}
          >
            Login/Signup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
