import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Table, List, Typography, Divider } from 'antd';
import './UserAccount.css';

const { Title, Text } = Typography;

const UserAccount = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      const account_id = localStorage.getItem('account_id');
      if (!account_id) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post('http://localhost:3000/account/get-account-from-redis', {
          account_id
        });
        setUserInfo(res.data.result);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin tài khoản:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  if (loading) {
    return (
      <div className="account-container">
        <Card className="account-card">
          <Title level={4}>Đang tải thông tin tài khoản...</Title>
        </Card>
      </div>
    );
  }

  const accountInfoData = [
    { title: 'Tên tài khoản', value: userInfo?.full_name || '' },
    { title: 'Email', value: userInfo?.email || '' },
    { title: 'Số điện thoại', value: userInfo?.phone || '' },
    { title: 'Ngày sinh', value: userInfo?.dob || '' },
    { title: 'Giới tính', value: userInfo?.gender || '' }
  ];

  return (
    <div className="account-container">
      <Card className="account-card">
        <Title level={4} className="section-title">Thông tin tài khoản</Title>
        <Text strong className="greeting-text">
          {userInfo ? `Xin chào, ${userInfo.full_name}` : 'Không tìm thấy người dùng'}
        </Text>

        <Divider className="divider" />

        <List
          itemLayout="horizontal"
          dataSource={accountInfoData}
          renderItem={(item) => (
            <List.Item className="account-list-item">
              <List.Item.Meta
                title={<Text className="info-title">{item.title}</Text>}
                description={
                  <Text className={item.value ? 'info-value' : 'empty-text'}>
                    {item.value || 'Chưa cập nhật'}
                  </Text>
                }
              />
            </List.Item>
          )}
          className="account-list"
        />
      </Card>
    </div>
  );
};

export default UserAccount;
