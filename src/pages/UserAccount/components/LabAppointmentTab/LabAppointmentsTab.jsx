import React from 'react';
import {
  Table,
  Empty,
  Button,
  Tag,
  Badge,
  Modal,
  Descriptions,
  Typography,
} from 'antd';
import { CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const LabAppointmentsTab = ({
  labApps,
  labAppsPagination,
  handleLabAppsPaginationChange,
  showLabAppDetail,
  labAppDetailVisible,
  setLabAppDetailVisible,
  selectedLabApp,
  dayjs,
  message,
}) => {
  // Columns cho bảng lịch hẹn xét nghiệm
  const labAppColumns = [
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
      title: 'Loại xét nghiệm',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <div>
          <FileTextOutlined />
          <span style={{ marginLeft: 8 }}>{text || 'Xét nghiệm'}</span>
          {record.result && record.result.length > 0 && (
            <Badge
              count={record.result.length}
              style={{ backgroundColor: '#1890ff', marginLeft: 8 }}
              title={`${record.result.length} xét nghiệm`}
            />
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let text = 'Chưa xác định';

        switch (status) {
          case 'pending':
            color = 'warning';
            text = 'Đang chờ';
            break;
          case 'processing':
            color = 'processing';
            text = 'Đang xử lý';
            break;
          case 'completed':
            color = 'success';
            text = 'Hoàn thành';
            break;
          case 'cancelled':
            color = 'error';
            text = 'Đã hủy';
            break;
          default:
            color = 'default';
            text = 'Chưa xác định';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          disabled={record.status !== 'completed'}
          onClick={() => showLabAppDetail(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="tab-content">
      <div className="lab-apps-table-container">
        <Table
          dataSource={labApps}
          columns={labAppColumns}
          rowKey={(record) => record.id || Math.random().toString()}
          pagination={{
            current: labAppsPagination.current,
            pageSize: labAppsPagination.pageSize,
            total: labAppsPagination.total,
            onChange: handleLabAppsPaginationChange,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showTotal: (total) => `Tổng ${total} lịch hẹn xét nghiệm`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Bạn chưa có lịch hẹn xét nghiệm nào"
              />
            ),
          }}
        />
      </div>
      {/* Modal chi tiết lịch hẹn xét nghiệm */}
      <Modal
        title={
          <div className="lab-detail-title">
            <div>Chi tiết lịch hẹn xét nghiệm</div>
            {selectedLabApp && (
              <Tag
                color={
                  selectedLabApp.status === 'completed'
                    ? 'blue'
                    : selectedLabApp.status === 'confirmed'
                      ? 'green'
                      : selectedLabApp.status === 'pending'
                        ? 'orange'
                        : 'red'
                }
              >
                {selectedLabApp.status === 'completed'
                  ? 'Đã hoàn thành'
                  : selectedLabApp.status === 'confirmed'
                    ? 'Đã xác nhận'
                    : selectedLabApp.status === 'pending'
                      ? 'Chờ xác nhận'
                      : 'Đã hủy'}
              </Tag>
            )}
          </div>
        }
        open={labAppDetailVisible}
        onCancel={() => setLabAppDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setLabAppDetailVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
        className="lab-detail-modal"
      >
        {selectedLabApp && (
          <div className="lab-detail-content">
            {/* Thông tin lịch hẹn */}
            <Descriptions title="Thông tin lịch hẹn" bordered column={2}>
              <Descriptions.Item label="Ngày hẹn">
                {dayjs(selectedLabApp.date).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Giờ hẹn">
                {selectedLabApp.time}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {selectedLabApp.description}
              </Descriptions.Item>
            </Descriptions>

            {/* Danh sách các xét nghiệm đã đăng ký */}
            {/* <Typography.Title level={5} style={{ marginTop: 24 }}>
              Danh sách xét nghiệm
            </Typography.Title>
            <Table
              dataSource={selectedLabApp.lab || []}
              rowKey="lab_id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: 'Tên xét nghiệm',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Loại mẫu',
                  dataIndex: 'specimen',
                  key: 'specimen',
                },
                {
                  title: 'Giá',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => price?.toLocaleString('vi-VN') + ' ₫',
                },
                {
                  title: 'Mô tả',
                  dataIndex: 'description',
                  key: 'description',
                  ellipsis: true,
                },
              ]}
              style={{ marginBottom: 24 }}
            /> */}

            {/* Kết quả xét nghiệm */}
            <Typography.Title level={5} style={{ marginTop: 24 }}>
              Kết quả xét nghiệm
            </Typography.Title>
            {selectedLabApp.result && selectedLabApp.result.length > 0 ? (
              <Table
                dataSource={selectedLabApp.result}
                rowKey="result_id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: 'Tên xét nghiệm',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: 'Kết quả',
                    dataIndex: 'result',
                    key: 'result',
                  },
                  {
                    title: 'Đơn vị',
                    dataIndex: 'unit',
                    key: 'unit',
                  },
                  {
                    title: 'Giá trị bình thường',
                    dataIndex: 'normal_range',
                    key: 'normal_range',
                  },
                  {
                    title: 'Kết luận',
                    dataIndex: 'conclusion',
                    key: 'conclusion',
                    ellipsis: true,
                  },
                ]}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có kết quả xét nghiệm"
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LabAppointmentsTab;
