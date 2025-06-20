import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, List, Typography, Divider, Button, Checkbox, Input, message } from 'antd';
import { useAuth } from '../../context/AuthContext.jsx'; // Sử dụng .jsx
import './UserAccount.css';

const { Title, Text } = Typography;

const UserAccount = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const { isLoggedIn, userInfo } = useAuth();

  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        setLoading(false);
        message.error('Vui lòng đăng nhập để xem thông tin tài khoản.');
        return;
      }

      try {
        const response = await axios.post(
          'http://localhost:3000/account/view-account',
          {},
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setEditedInfo(response.data.result || {});
      } catch (err) {
        console.error('Lỗi khi lấy thông tin tài khoản:', err);
        message.error('Không thể tải thông tin tài khoản. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) fetchAccountInfo();
  }, [isLoggedIn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo({ ...editedInfo, [name]: value });
  };

  const handleGenderChange = (e) => {
    setEditedInfo({ ...editedInfo, gender: e.target.checked ? 'Male' : 'Female' });
  };

  const handleSave = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      message.error('Vui lòng đăng nhập để lưu thông tin.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/account/update-profile',
        { ...editedInfo },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setEditedInfo(response.data.result || {});
      setIsEditing(false);
      message.success('Cập nhật thông tin thành công!');
    } catch (err) {
      console.error('Lỗi khi cập nhật thông tin:', err);
      message.error('Không thể cập nhật thông tin. Vui lòng thử lại.');
    }
  };

  const handleDelete = () => {
    setEditedInfo(userInfo || {});
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

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
    { title: 'Tên tài khoản', value: 'full_name', editable: true },
    { title: 'Email', value: 'email', editable: false },
    { title: 'Số điện thoại', value: 'phone', editable: true },
    { title: 'Ngày sinh', value: 'dob', editable: true },
    { title: 'Giới tính', value: 'gender', editable: true, type: 'checkbox' },
  ];

  return (
    <div className="account-container">
      <Card className="account-card">
        <Title level={4} className="section-title">Thông tin tài khoản</Title>
        <Text strong className="greeting-text">
          {userInfo.full_name ? `Xin chào, ${userInfo.full_name}` : 'Không tìm thấy người dùng'}
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
                  isEditing ? (
                    item.type === 'checkbox' ? (
                      <>
                        <Checkbox
                          checked={editedInfo[item.value] === 'Male'}
                          onChange={handleGenderChange}
                        >
                          Nam
                        </Checkbox>
                        <Checkbox
                          checked={editedInfo[item.value] === 'Female'}
                          onChange={handleGenderChange}
                        >
                          Nữ
                        </Checkbox>
                      </>
                    ) : (
                      <Input
                        name={item.value}
                        value={editedInfo[item.value] || ''}
                        onChange={handleChange}
                        disabled={!item.editable}
                        className={editedInfo[item.value] ? 'info-value' : 'empty-text'}
                      />
                    )
                  ) : (
                    <Text className={editedInfo[item.value] ? 'info-value' : 'empty-text'}>
                      {editedInfo[item.value] || 'Chưa cập nhật'}
                    </Text>
                  )
                }
              />
            </List.Item>
          )}
          className="account-list"
        />
        {editedInfo && (
          <div style={{ marginTop: '16px' }}>
            {isEditing ? (
              <>
                <Button type="primary" onClick={handleSave} style={{ marginRight: '8px' }}>
                  Lưu & Xác nhận
                </Button>
                <Button type="default" onClick={handleDelete}>
                  Hủy
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserAccount;