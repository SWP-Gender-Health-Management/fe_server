import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, List, Typography, Divider, Button, Checkbox, Input } from 'antd';
import './UserAccount.css';

const { Title, Text } = Typography;

const UserAccount = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});

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
        setEditedInfo(res.data.result || {});
      } catch (err) {
        console.error('Lỗi khi lấy thông tin tài khoản:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo({ ...editedInfo, [name]: value });
  };

  const handleGenderChange = (e) => {
    setEditedInfo({ ...editedInfo, gender: e.target.checked ? 'Male' : 'Female' });
  };

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:3000/account/update-profile', {
        account_id: localStorage.getItem('account_id'),
        ...editedInfo
      });
      setUserInfo({ ...userInfo, ...editedInfo });
      setIsEditing(false);
    } catch (err) {
      console.error('Lỗi khi cập nhật thông tin:', err);
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
    { title: 'Giới tính', value: 'gender', editable: true, type: 'checkbox' }
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
                  isEditing ? (
                    item.type === 'checkbox' ? (
                      <Checkbox
                        checked={editedInfo[item.value] === 'Male'}
                        onChange={handleGenderChange}
                      >
                        Nam
                      </Checkbox>
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
                    <Text className={userInfo?.[item.value] ? 'info-value' : 'empty-text'}>
                      {userInfo?.[item.value] || 'Chưa cập nhật'}
                    </Text>
                  )
                }
              />
            </List.Item>
          )}
          className="account-list"
        />
        {userInfo && (
          <div style={{ marginTop: '16px' }}>
            {isEditing ? (
              <>
                <Button type="primary" onClick={handleSave} style={{ marginRight: '8px' }}>
                  Lưu & Xác nhận
                </Button>
                <Button type="default" onClick={handleDelete}>
                  Xóa
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