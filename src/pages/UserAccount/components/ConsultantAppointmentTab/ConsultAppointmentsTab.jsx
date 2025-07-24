import React, { useState } from 'react';
import {
  Table,
  Empty,
  Button,
  Space,
  Tag,
  Avatar,
  Tooltip,
  Modal,
  Descriptions,
  Typography,
} from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3000';



const ConsultAppointmentsTab = ({
  conApps,
  conAppsPagination,
  handleConAppsPaginationChange,
  showConAppDetail,
  getStatusColor,
  getStatusText,
  conAppDetailVisible,
  setConAppDetailVisible,
  selectedConApp,
  dayjs,
  fetchConApp
}) => {


  const accessToken = Cookies.get('accessToken');
  const accountId = Cookies.get('accountId');

  const [feedbackForm, setFeedbackForm] = useState({
    content: '',
    customer_id: accountId,
    type: 'consult',
    rating: 0,
  });

  const handleSubmitFeedBack = async () => {
    if (feedbackForm.content.trim().length === 0) {
      alert("Xin hãy nhập feedback ạ!!!");
      return;
    }
    console.log("feedbackForm: ", feedbackForm)
    try {
      await axios.post(
        `${API_URL}/feedback/create-feedback`,
        {
          ...feedbackForm,
          app_id: selectedConApp.app_id
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      ).then((response) => {
        console.log("create-feedback response: ", response.data);
      })
    } catch (error) {
      console.error("Create feedback error: ", error);
    } finally {
      await fetchConApp();
      setConAppDetailVisible(false);
    }
  }

  // Columns cho bảng lịch hẹn tư vấn
  const conAppColumns = [
    {
      title: 'Ngày hẹn',
      dataIndex: 'date',
      key: 'date',
      render: (_, record) => (
        <div className="appointment-date">
          <CalendarOutlined className="date-icon" />
          <div>
            <div className="date">
              {dayjs(record.date).format('DD/MM/YYYY')}
            </div>
            <div className="time">{record.time || 'Không rõ'}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Chuyên gia',
      dataIndex: 'consultant',
      key: 'consultant',
      render: (_, record) => (
        <div className="appointment-consultant">
          <Avatar
            size="small"
            icon={<UserOutlined />}
            src={record.consultant_avatar}
          />
          <span className="consultant-name">
            {record.consultant || 'Chưa xác định'}
          </span>
        </div>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      key: 'description',
      render: (_, record) => (
        <Tooltip title={record.description || ''}>
          <span>{record.description || 'Tư vấn'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      render: (_, record) => (
        <div className="appointment-location">
          <EnvironmentOutlined />
          <span>{record.location || 'Online'}</span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>
          {getStatusText(record.status)}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => showConAppDetail(record)}
            disabled={record.status !== 'completed'}
          >
            Chi tiết
          </Button>
          {record.status === 'pending' && (
            <Button type="link" size="small" danger>
              Hủy
            </Button>
          )}
          {record.status === 'confirmed' && (
            <Link to='https://meet.google.com/pfa-oqau-zwn' target="_blank">
              Meeting
            </Link>
          )}
        </Space>
      ),
    },
    {
      title: 'Feedback',
      key: 'feedback',
      render: (_, record) => (
        <>
          {record.feed_id ? (
            <p>Đã feedback</p>
          ) : (
            <p>Chưa feedback</p>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="tab-content">
      <div className="appointments-table-container">
        <Table
          dataSource={conApps}
          columns={conAppColumns}
          rowKey={(record) => record.id || Math.random().toString()}
          pagination={{
            current: conAppsPagination.current,
            pageSize: conAppsPagination.pageSize,
            total: conAppsPagination.total,
            onChange: handleConAppsPaginationChange,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showTotal: (total) => `Tổng ${total} lịch hẹn`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Bạn chưa có lịch hẹn tư vấn nào"
              />
            ),
          }}
        />
      </div>
      {/* Modal chi tiết kết quả tư vấn */}
      <Modal
        title={
          <div className="appointment-detail-title">
            <div>Chi tiết kết quả tư vấn</div>
            {selectedConApp && (
              <Tag color={getStatusColor(selectedConApp.status)}>
                {getStatusText(selectedConApp.status)}
              </Tag>
            )}
          </div>
        }
        open={conAppDetailVisible}
        onCancel={() => setConAppDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setConAppDetailVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
        className="appointment-detail-modal"
      >
        {selectedConApp && (
          <div className="appointment-detail-content">
            <Descriptions title="Thông tin buổi tư vấn" bordered column={2}>
              <Descriptions.Item label="Chuyên gia" span={2}>
                <div className="consultant-info">
                  <Avatar
                    size={64}
                    src={selectedConApp.consultant_avatar}
                    icon={<UserOutlined />}
                  />
                  <div className="consultant-details">
                    <div className="consultant-name">
                      {selectedConApp.consultant}
                    </div>
                  </div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Dịch vụ">Tư vấn</Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {dayjs(selectedConApp.date).format('DD/MM/YYYY')}{' '}
                {selectedConApp.time}
              </Descriptions.Item>
              <Descriptions.Item label="Địa điểm">Online</Descriptions.Item>
            </Descriptions>
            {selectedConApp.report ? (
              <div className="appointment-result">
                <Typography.Title level={4}>Kết quả tư vấn</Typography.Title>
                <Typography.Paragraph>
                  {selectedConApp.report.name}
                </Typography.Paragraph>
                <Typography.Paragraph strong style={{ whiteSpace: 'pre-line' }}>
                  {selectedConApp.report.description?.split('. ').join('.\n')}
                </Typography.Paragraph>
              </div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có kết quả tư vấn"
              />
            )}
            {selectedConApp.feed_id ?
              (<>
                <p>Feedback: {selectedConApp.feedback?.content}</p>
                <p>Rating: {selectedConApp.feedback?.rating}</p>
              </>) : (
                <>
                  <label>
                    Feedback:
                  </label>
                  <input type='text' name='feedback' value={feedbackForm.content} onChange={(e) => {
                    setFeedbackForm((prev) => ({
                      ...prev,
                      content: e.target.value
                    }))
                  }} />
                  <label>
                    Rating:
                  </label>
                  <input type='number' name='rating' max={5} min={0} value={feedbackForm.rating} onChange={(e) => {
                    setFeedbackForm((prev) => ({
                      ...prev,
                      rating: e.target.value
                    }))
                  }} />
                  <button key="sendFeed" onClick={handleSubmitFeedBack}>Send Feedback</button>
                </>
              )
            }
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ConsultAppointmentsTab;
