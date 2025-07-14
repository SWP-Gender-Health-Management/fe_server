import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import BlueLogo from '@assets/Blue-full.svg';

const NotFound = () => (
  <div
    style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      background: '#f6f9fb',
    }}
  >
    {/* <img
      src={BlueLogo}
      alt="404"
      style={{ width: 220, marginBottom: 32, opacity: 0.85 }}
    /> */}
    <Result
      status="404"
      title={<span style={{ fontSize: 48, color: '#1890ff' }}>404</span>}
      subTitle={
        <span style={{ fontSize: 20, color: '#555' }}>
          Rất tiếc, trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </span>
      }
      extra={
        <Button type="primary" size="large" as={Link} to="/">
          Về trang chủ
        </Button>
      }
      style={{
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 2px 8px #e6e6e6',
        padding: 32,
        width: 420,
      }}
    />
  </div>
);

export default NotFound;
