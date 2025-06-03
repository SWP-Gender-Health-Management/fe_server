import React from 'react';
import { Card, Table, List, Typography, Divider } from 'antd';
import '@/UserAccount.css';

const { Title, Text } = Typography;

const UserAccount = () => {
  // Orders table data
  const ordersColumns = [
    { title: 'Đơn hàng', dataIndex: 'order', key: 'order', 
      render: (text) => <Text className="empty-text">{text}</Text> },
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    { title: 'Giá trị đơn hàng', dataIndex: 'amount', key: 'amount' },
    { title: 'Trạng thái thanh toán', dataIndex: 'paymentStatus', key: 'paymentStatus' },
    { title: 'Trạng thái giao hàng', dataIndex: 'deliveryStatus', key: 'deliveryStatus' },
  ];

  const ordersData = [
    { key: '1', order: 'Không có đơn hàng nào.', date: '', amount: '', paymentStatus: '', deliveryStatus: '' },
  ];

  // Account information data
  const accountInfoData = [
    { title: 'Tên tài khoản', value: '1' },
    { title: 'Địa chỉ', value: '' },
    { title: 'Điện thoại', value: '' },
    { title: 'Địa chỉ 1', value: '' },
    { title: 'Công ty', value: '' },
    { title: 'Quốc gia', value: 'Vietnam' },
    { title: 'Zip code', value: '70000' },
  ];

  return (
    <div className="account-container">
      {/* Orders Section */}
      <Card className="account-card">
        <Title level={4} className="section-title">Thông tin tài khoản</Title>
        <Text strong className="greeting-text">Xin chào, I</Text>
        
        <Divider className="divider" />
        
        <Title level={5} className="subsection-title">Đơn hàng</Title>
        <Table
          columns={ordersColumns}
          dataSource={ordersData}
          pagination={false}
          bordered
          className="orders-table"
        />
      </Card>

      {/* Account Info Section */}
      <Card className="account-card" style={{ marginTop: 24 }}>
        <Title level={4} className="section-title">Thông tin tài khoản</Title>
        <Text strong className="greeting-text">Xin chào, I</Text>
        
        <Divider className="divider" />
        
        <List
          itemLayout="horizontal"
          dataSource={accountInfoData}
          renderItem={(item) => (
            <List.Item className="account-list-item">
              <List.Item.Meta
                title={<Text className="info-title">{item.title}</Text>}
                description={<Text className={item.value ? "info-value" : "empty-text"}>{item.value || ' '}</Text>}
              />
            </List.Item>
          )}
          className="account-list"
        />
        
        <Divider className="divider" />
        
        <Text className="address-count">Số địa chỉ (1)</Text>
      </Card>
    </div>
  );
};

export default UserAccount;