import React from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Progress,
  Statistic,
  Button,
  Badge,
  Upload,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import './ProfileHeader.css';

const { Title, Text } = Typography;

const ProfileHeader = ({
  editedInfo,
  avatarUrl,
  profileCompletion,
  conApps,
  labApps,
  isEditing,
  setIsEditing,
  handleAvatarUpload,
}) => {
  return (
    <Card className="profile-header">
      <Row gutter={24} align="middle">
        <Col xs={24} sm={6} md={4}>
          <div className="avatar-section">
            <Badge
              count={
                <Upload
                  name="avatar"
                  showUploadList={false}
                  customRequest={handleAvatarUpload}
                  accept="image/*"
                >
                  <Button
                    size="small"
                    icon={<CameraOutlined />}
                    shape="circle"
                    className="avatar-edit-btn"
                  />
                </Upload>
              }
              offset={[-10, 35]}
            >
              <Avatar
                size={80}
                src={avatarUrl || undefined} // Hiển thị avatar từ URL
                icon={!avatarUrl && <UserOutlined />} // Icon mặc định nếu không có avatar
                className="user-avatar"
              />
            </Badge>
          </div>
        </Col>
        <Col xs={24} sm={12} md={14}>
          <div className="profile-info">
            <Title level={3} className="user-name">
              {editedInfo.full_name || 'Chưa cập nhật tên'}
            </Title>
            <Text type="secondary" className="user-email">
              {editedInfo.email || 'Chưa cập nhật email'}
            </Text>
            <div className="profile-completion">
              <Text>Hoàn thiện hồ sơ: </Text>
              <Progress
                percent={profileCompletion}
                size="small"
                style={{ width: 200, marginLeft: 8 }}
              />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={6} md={6}>
          <div className="profile-stats">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Lịch hẹn"
                  value={conApps.length}
                  prefix={<CalendarOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Hồ sơ"
                  value={labApps.length}
                  prefix={<FileTextOutlined />}
                />
              </Col>
            </Row>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(!isEditing)}
              className="edit-profile-btn"
            >
              {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa hồ sơ'}
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ProfileHeader;
