import React, { useEffect, useState } from 'react';
import {
  Table,
  Empty,
  Button,
  Tag,
  Badge,
  Modal,
  Descriptions,
  Typography,
  Space,
  Form,
  Input,
  Select,
} from 'antd';
import { CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000';

const LabAppointmentsTab = ({
  labApps,
  labAppsPagination,
  handleLabAppsPaginationChange,
  showLabAppDetail,
  labAppDetailVisible,
  setLabAppDetailVisible,
  selectedLabApp,
  dayjs,
  fetchLabApp,
}) => {
  // Columns cho bảng lịch hẹn xét nghiệm

  const accessToken = Cookies.get('accessToken');
  const accountId = Cookies.get('accountId');
  const [deleteAppointment, setDeleteAppointment] = useState(null);
  const [refundAppointment, setRefundAppointment] = useState(null);
  const [bankList, setBankList] = useState([]);

  const [refundForm, setRefundForm] = useState({
    description: '',
    app_id: '',
    bankName: '',
    accountNumber: '',
  });

  const [feedbackForm, setFeedbackForm] = useState({
    content: '',
    customer_id: accountId,
    type: 'laboratory',
    rating: 0,
  });

  useEffect(() => {
    fetchBankList();
  }, []);

  const fetchBankList = async () => {
    try {
      await axios.get(`https://api.vietqr.io/v2/banks`).then((response) => {
        setBankList(
          response.data.data.map((bank) => ({
            code: bank.code,
            shortName: bank.shortName,
          })) || []
        );
      });
    } catch (error) {
      console.error('Error fetching bank list:', error);
      setBankList([]);
    }
  };

  const handleSubmitFeedBack = async () => {
    if (feedbackForm.content.trim().length === 0) {
      alert('Xin hãy nhập feedback ạ!!!');
      return;
    }
    console.log('feedbackForm: ', feedbackForm);
    try {
      await axios
        .post(
          `${API_URL}/feedback/create-feedback`,
          {
            ...feedbackForm,
            app_id: selectedLabApp.app_id,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          console.log('create-feedback response: ', response.data);
        });
    } catch (error) {
      console.error('Create feedback error: ', error);
    } finally {
      await fetchLabApp();
      setLabAppDetailVisible(false);
    }
  };

  const handleRefundAppointment = async () => {
    try {
      await axios
        .post(
          `${API_URL}/customer/create-lab-appointment-refund`,
          {
            ...refundForm,
            app_id: refundAppointment.app_id,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          console.log('Refund appointment response: ', response.data);
        });
    } catch (error) {
      alert('Yêu cầu hoàn tiền không thành công, vui lòng thử lại sau!');
      console.error('Refund appointment error: ', error);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios
        .put(
          `${API_URL}/customer/cancel-lab-appointment/${appointmentId}`,
          {
            appointment_id: appointmentId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          console.log('Cancel appointment response: ', response.data);
        });
    } catch (error) {
      alert('Hủy lịch hẹn không thành công, vui lòng thử lại sau!');
      console.error('Cancel appointment error: ', error);
    }
  };

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
      dataIndex: 'result.name',
      key: 'result',
      render: (_, record) => (
        <div>
          <FileTextOutlined />
          {record.lab &&
            record.lab.length > 0 &&
            record.lab.map((l, index) => {
              return (
                <span key={index} style={{ marginLeft: index > 0 ? 8 : 0 }}>
                  {l.name || 'Xét nghiệm'}
                  {index < record.lab.length - 1 ? ', ' : ''}
                </span>
              );
            })}
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
          case 'confirmed':
            color = 'processing';
            text = 'Đã xác nhận';
            break;
          case 'in_progress':
            color = 'processing';
            text = 'Đang xử lý';
            break;
          case 'completed':
            color = 'success';
            text = 'Hoàn thành';
            break;
          case 'confirmed_cancelled':
            color = 'error';
            text = 'Đã hủy';
            break;
          case 'pending_cancelled':
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
        <Space size="small">
          <Button
            type="link"
            size="small"
            disabled={record.status !== 'completed'}
            onClick={() => showLabAppDetail(record)}
          >
            Xem chi tiết
          </Button>
          {(record.status === 'pending' || record.status === 'confirmed') && (
            <Button
              type="link"
              size="small"
              danger
              onClick={() => {
                setDeleteAppointment(record);
              }}
            >
              Hủy
            </Button>
          )}
          {record.status === 'confirmed_cancelled' && (
            <Button
              type="link"
              size="small"
              onClick={() => {
                setRefundAppointment(record);
                console.log('Refund appointment: ', record);
              }}
              disabled={record.isRequestedRefund ? true : false}
            >
              {record.isRequestedRefund
                ? record.isRefunded
                  ? 'Đã hoàn tiền'
                  : 'Đang xử lý hoàn tiền'
                : 'Yêu cầu hoàn tiền'}
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: 'Feedback',
      key: 'feedback',
      render: (_, record) => (
        <>{record.feed_id ? <p>Đã feedback</p> : <p>Chưa feedback</p>}</>
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
              <Descriptions.Item label="Loại xét nghiệm" span={2}>
                {selectedLabApp.lab.map((l, index) => (
                  <span key={index} style={{ marginLeft: index > 0 ? 8 : 0 }}>
                    {l.name || 'Xét nghiệm'}
                    {index < selectedLabApp.lab.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </Descriptions.Item>
            </Descriptions>

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
            {selectedLabApp.feed_id ? (
              <>
                <p>Feedback: {selectedLabApp.feedback?.content}</p>
                <p>Rating: {selectedLabApp.feedback?.rating}</p>
              </>
            ) : (
              <>
                <label>Feedback:</label>
                <input
                  type="text"
                  name="feedback"
                  value={feedbackForm.content}
                  onChange={(e) => {
                    setFeedbackForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }));
                  }}
                />
                <label>Rating:</label>
                <input
                  type="number"
                  name="rating"
                  max={5}
                  min={0}
                  value={feedbackForm.rating}
                  onChange={(e) => {
                    setFeedbackForm((prev) => ({
                      ...prev,
                      rating: e.target.value,
                    }));
                  }}
                />
                <button key="sendFeed" onClick={handleSubmitFeedBack}>
                  Send Feedback
                </button>
              </>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={deleteAppointment !== null}
        title="Xác nhận hủy xét nghiệm"
        onCancel={() => {
          setDeleteAppointment(null);
        }}
        onOk={() => {
          handleCancelAppointment(deleteAppointment.app_id);
          setDeleteAppointment(null);
        }}
        okText="Xác nhận hủy"
        afterClose={() => {
          fetchLabApp();
        }}
      >
        <h1>Nếu bạn đã thanh toán, bạn chỉ được hoàn trả 70% sốt tiền!!!</h1>
        <h1>Bạn có chắc chắn muốn hủy xét nghiệm không không?</h1>
      </Modal>

      <Modal
        open={refundAppointment !== null}
        title="Xác nhận hoàn tiền"
        onCancel={() => {
          setRefundAppointment(null);
        }}
        onOk={() => {
          handleRefundAppointment(refundAppointment.app_id);
          setRefundAppointment(null);
          fetchLabApp();
        }}
        okText="Gửi yêu cầu hoàn tiền"
      >
        <p>
          Bạn có chắc chắn muốn gửi yêu cầu hoàn tiền cho lịch hẹn này? Vui lòng
          liên hệ với bộ phận hỗ trợ nếu cần thêm thông tin.
        </p>
        {/* Thêm thông tin chi tiết về lịch hẹn nếu cần */}
        {refundAppointment && (
          <>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Loại xét nghiệm">
                {refundAppointment.lab.map((l, index) => (
                  <span key={index} style={{ marginLeft: index > 0 ? 8 : 0 }}>
                    {l.name || 'Xét nghiệm'}
                  </span>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hẹn">
                {dayjs(refundAppointment.date).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {refundAppointment.time}
              </Descriptions.Item>
            </Descriptions>
            <Form>
              <Form.Item label="Nội dung">
                <Input.TextArea
                  value={refundForm.description}
                  onChange={(e) => {
                    setRefundForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
              <Form.Item label="Tên ngân hàng">
                {/* <Input
                        value={refundForm.bankName}
                        onChange={(e) => {
                          setRefundForm((prev) => ({
                            ...prev,
                            bankName: e.target.value,
                          }));
                        }}
                      /> */}
                <Select
                  value={refundForm.bankName}
                  onChange={(value) => {
                    setRefundForm((prev) => ({
                      ...prev,
                      bankName: value,
                    }));
                  }}
                  placeholder="Chọn ngân hàng"
                  showSearch
                >
                  {bankList.map((bank) => (
                    <Select.Option key={bank.code} value={bank.shortName}>
                      {bank.shortName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Số tài khoản">
                <Input
                  value={refundForm.accountNumber}
                  onChange={(e) => {
                    setRefundForm((prev) => ({
                      ...prev,
                      accountNumber: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default LabAppointmentsTab;
