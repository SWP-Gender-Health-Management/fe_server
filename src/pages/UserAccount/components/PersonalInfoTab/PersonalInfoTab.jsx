import React from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  DatePicker,
  Space,
  Typography,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import './PersonalInfoTab.css';

const { TextArea } = Input;
const { Option } = Select;

const PersonalInfoTab = ({
  form,
  editedInfo,
  isEditing,
  loading,
  handleSave,
  handleCancel,
}) => {
  return (
    <div className="tab-content">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={editedInfo}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Họ và tên"
              name="full_name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập họ và tên"
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Nhập email"
                disabled={true}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: false, message: 'Vui lòng nhập số điện thoại' },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Nhập số điện thoại"
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Ngày sinh" name="dob">
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Chọn ngày sinh"
                disabled={!isEditing}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="Giới tính" name="gender">
              <Select placeholder="Chọn giới tính" disabled={!isEditing}>
                <Option value="Female">Nữ</Option>
                <Option value="Male">Nam</Option>
                <Option value="Other">Khác</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Tình trạng hôn nhân" name="marital_status">
              <Select placeholder="Chọn tình trạng" disabled={!isEditing}>
                <Option value="single">Độc thân</Option>
                <Option value="married">Đã kết hôn</Option>
                <Option value="divorced">Đã ly hôn</Option>
                <Option value="widowed">Góa phụ</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24}>
            <Form.Item label="Địa chỉ" name="address">
              <TextArea
                rows={3}
                placeholder="Nhập địa chỉ chi tiết"
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24}>
            <Form.Item label="Ghi chú sức khỏe" name="description">
              <TextArea
                rows={4}
                placeholder="Ghi chú về tình trạng sức khỏe, dị ứng, thuốc đang sử dụng..."
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
        </Row>

        {isEditing && (
          <div className="form-actions">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Lưu thay đổi
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </Space>
          </div>
        )}
      </Form>
    </div>
  );
};

export default PersonalInfoTab;
