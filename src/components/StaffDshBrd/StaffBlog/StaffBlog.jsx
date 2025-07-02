import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Space,
  Tag,
  Avatar,
  Pagination,
  Empty,
  Tooltip,
  Select,
  DatePicker,
  Badge,
  Popconfirm,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  TagsOutlined,
  ReloadOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './StaffBlog.css';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

const StaffBlog = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9); // 3 columns x 3 rows

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Form
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Mock data - bài viết của staff
  const mockArticles = [
    {
      id: 'ART001',
      title: 'Hướng dẫn xét nghiệm máu an toàn',
      excerpt:
        'Quy trình chuẩn để thực hiện xét nghiệm máu một cách an toàn và chính xác...',
      content:
        'Nội dung đầy đủ về hướng dẫn xét nghiệm máu bao gồm chuẩn bị mẫu, quy trình lấy máu, bảo quản và vận chuyển mẫu...',
      category: 'huong-dan',
      tags: ['xét nghiệm', 'máu', 'an toàn', 'quy trình'],
      status: 'published',
      thumbnail: 'https://via.placeholder.com/400x250',
      authorId: 'ST001',
      authorName: 'Nguyễn Thị Mai',
      createdAt: '2024-01-10T08:30:00',
      updatedAt: '2024-01-10T08:30:00',
      publishedAt: '2024-01-11T09:00:00',
      views: 245,
      adminNote: '',
    },
    {
      id: 'ART002',
      title: 'Cách đọc kết quả xét nghiệm nước tiểu',
      excerpt:
        'Giải thích các chỉ số trong kết quả xét nghiệm nước tiểu và ý nghĩa lâm sàng...',
      content:
        'Bài viết chi tiết về cách đọc và hiểu các chỉ số trong kết quả xét nghiệm nước tiểu...',
      category: 'giai-thich',
      tags: ['nước tiểu', 'kết quả', 'chỉ số'],
      status: 'pending',
      thumbnail: 'https://via.placeholder.com/400x250',
      authorId: 'ST001',
      authorName: 'Nguyễn Thị Mai',
      createdAt: '2024-01-15T14:20:00',
      updatedAt: '2024-01-15T14:20:00',
      views: 0,
      adminNote: '',
    },
    {
      id: 'ART003',
      title: 'Tiêu chuẩn bảo quản mẫu xét nghiệm',
      excerpt:
        'Các yêu cầu về nhiệt độ, thời gian và điều kiện bảo quản mẫu xét nghiệm...',
      content:
        'Hướng dẫn chi tiết về cách bảo quản các loại mẫu xét nghiệm khác nhau...',
      category: 'tieu-chuan',
      tags: ['bảo quản', 'mẫu', 'nhiệt độ', 'tiêu chuẩn'],
      status: 'rejected',
      thumbnail: 'https://via.placeholder.com/400x250',
      authorId: 'ST001',
      authorName: 'Nguyễn Thị Mai',
      createdAt: '2024-01-12T10:15:00',
      updatedAt: '2024-01-13T16:30:00',
      views: 0,
      adminNote:
        'Cần bổ sung thêm thông tin về bảo quản mẫu đặc biệt và cập nhật theo tiêu chuẩn mới nhất.',
    },
    // Thêm nhiều bài viết để test pagination
    ...Array.from({ length: 15 }, (_, index) => ({
      id: `ART${(index + 4).toString().padStart(3, '0')}`,
      title: `Bài viết ${index + 4}: Kiến thức xét nghiệm cơ bản`,
      excerpt: `Tóm tắt ngắn gọn về nội dung bài viết ${index + 4} trong lĩnh vực xét nghiệm y khoa...`,
      content: `Nội dung đầy đủ của bài viết ${index + 4} về các kiến thức cơ bản trong xét nghiệm...`,
      category: ['huong-dan', 'giai-thich', 'tieu-chuan'][index % 3],
      tags: ['xét nghiệm', 'y khoa', 'kiến thức'],
      status: ['published', 'pending', 'rejected'][index % 3],
      thumbnail: 'https://via.placeholder.com/400x250',
      authorId: 'ST001',
      authorName: 'Nguyễn Thị Mai',
      createdAt: dayjs().subtract(index, 'day').toISOString(),
      updatedAt: dayjs().subtract(index, 'day').toISOString(),
      publishedAt:
        index % 3 === 0
          ? dayjs()
              .subtract(index - 1, 'day')
              .toISOString()
          : null,
      views: index % 3 === 0 ? Math.floor(Math.random() * 500) : 0,
      adminNote:
        index % 3 === 2
          ? 'Cần chỉnh sửa một số nội dung để phù hợp với chính sách.'
          : '',
    })),
  ];

  const categories = [
    { value: 'huong-dan', label: 'Hướng dẫn', color: 'blue' },
    { value: 'giai-thich', label: 'Giải thích', color: 'green' },
    { value: 'tieu-chuan', label: 'Tiêu chuẩn', color: 'purple' },
    { value: 'kinh-nghiem', label: 'Kinh nghiệm', color: 'orange' },
    { value: 'cong-nghe', label: 'Công nghệ', color: 'red' },
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, statusFilter, categoryFilter]);

  const fetchArticles = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 800);
  };

  const filterArticles = () => {
    let filtered = articles;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((article) => article.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (article) => article.category === categoryFilter
      );
    }

    setFilteredArticles(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const getStatusConfig = (status) => {
    const configs = {
      published: {
        color: 'green',
        text: 'Đã xuất bản',
        icon: <CheckCircleOutlined />,
      },
      pending: {
        color: 'orange',
        text: 'Chờ duyệt',
        icon: <ClockCircleOutlined />,
      },
      rejected: {
        color: 'red',
        text: 'Bị từ chối',
        icon: <ExclamationCircleOutlined />,
      },
      draft: {
        color: 'gray',
        text: 'Bản nháp',
        icon: <FileTextOutlined />,
      },
    };
    return configs[status] || configs.draft;
  };

  const getCategoryConfig = (category) => {
    const config = categories.find((cat) => cat.value === category);
    return config || { label: category, color: 'default' };
  };

  const handleCreateArticle = async (values) => {
    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newArticle = {
        id: `ART${(articles.length + 1).toString().padStart(3, '0')}`,
        title: values.title,
        excerpt: values.excerpt,
        content: values.content,
        category: values.category,
        tags: values.tags
          ? values.tags.split(',').map((tag) => tag.trim())
          : [],
        status: 'pending',
        thumbnail:
          values.thumbnail?.[0]?.response?.url ||
          'https://via.placeholder.com/400x250',
        authorId: 'ST001',
        authorName: 'Nguyễn Thị Mai',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        adminNote: '',
      };

      setArticles((prev) => [newArticle, ...prev]);
      setCreateModalVisible(false);
      form.resetFields();
      setSubmitting(false);

      message.success('Bài viết đã được tạo và gửi chờ admin xét duyệt!');
    }, 1500);
  };

  const handleEditArticle = async (values) => {
    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const updatedArticles = articles.map((article) =>
        article.id === selectedArticle.id
          ? {
              ...article,
              title: values.title,
              excerpt: values.excerpt,
              content: values.content,
              category: values.category,
              tags: values.tags
                ? values.tags.split(',').map((tag) => tag.trim())
                : article.tags,
              status:
                article.status === 'rejected' ? 'pending' : article.status, // Re-submit if was rejected
              thumbnail:
                values.thumbnail?.[0]?.response?.url || article.thumbnail,
              updatedAt: new Date().toISOString(),
            }
          : article
      );

      setArticles(updatedArticles);
      setEditModalVisible(false);
      editForm.resetFields();
      setSelectedArticle(null);
      setSubmitting(false);

      message.success('Bài viết đã được cập nhật!');
    }, 1500);
  };

  const handleDeleteArticle = async (articleId) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedArticles = articles.filter(
        (article) => article.id !== articleId
      );
      setArticles(updatedArticles);
      setLoading(false);

      message.success('Bài viết đã được xóa!');
    }, 800);
  };

  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    setViewModalVisible(true);
  };

  const handleEditClick = (article) => {
    setSelectedArticle(article);
    editForm.setFieldsValue({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags.join(', '),
    });
    setEditModalVisible(true);
  };

  // Pagination calculation
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    beforeUpload: () => false, // Prevent auto upload
    accept: 'image/*',
    maxCount: 1,
  };

  const statsCards = [
    {
      title: 'Tổng bài viết',
      value: articles.length,
      color: '#1890ff',
      icon: <FileTextOutlined />,
    },
    {
      title: 'Đã xuất bản',
      value: articles.filter((a) => a.status === 'published').length,
      color: '#52c41a',
      icon: <CheckCircleOutlined />,
    },
    {
      title: 'Chờ duyệt',
      value: articles.filter((a) => a.status === 'pending').length,
      color: '#faad14',
      icon: <ClockCircleOutlined />,
    },
    {
      title: 'Bị từ chối',
      value: articles.filter((a) => a.status === 'rejected').length,
      color: '#ff4d4f',
      icon: <ExclamationCircleOutlined />,
    },
  ];

  return (
    <div className="staff-blog">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h2>Quản lý Bài viết</h2>
          <p>Tạo và quản lý các bài viết chuyên môn về xét nghiệm</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
          size="large"
        >
          Tạo bài viết mới
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statsCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              className="stats-card"
              style={{ borderLeft: `4px solid ${card.color}` }}
            >
              <Row align="middle">
                <Col span={18}>
                  <div className="stats-content">
                    <div className="stats-title">{card.title}</div>
                    <div className="stats-value">{card.value}</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="stats-icon" style={{ color: card.color }}>
                    {card.icon}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space size="middle">
              <span>Lọc theo:</span>
              <Select
                placeholder="Trạng thái"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 140 }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="published">Đã xuất bản</Option>
                <Option value="pending">Chờ duyệt</Option>
                <Option value="rejected">Bị từ chối</Option>
              </Select>
              <Select
                placeholder="Danh mục"
                value={categoryFilter}
                onChange={setCategoryFilter}
                style={{ width: 140 }}
              >
                <Option value="all">Tất cả</Option>
                {categories.map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchArticles}
                loading={loading}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
          <Col>
            <Badge count={filteredArticles.length} showZero>
              <span>Tổng bài viết</span>
            </Badge>
          </Col>
        </Row>
      </Card>

      {/* Articles Grid */}
      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div className="loading-spinner">Đang tải...</div>
          </div>
        ) : paginatedArticles.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {paginatedArticles.map((article) => {
                const statusConfig = getStatusConfig(article.status);
                const categoryConfig = getCategoryConfig(article.category);

                return (
                  <Col xs={24} sm={12} lg={8} key={article.id}>
                    <Card
                      className="article-card"
                      cover={
                        <div className="article-cover">
                          <img
                            alt={article.title}
                            src={article.thumbnail}
                            style={{ height: 200, objectFit: 'cover' }}
                          />
                          <div className="article-overlay">
                            <Space>
                              <Tooltip title="Xem chi tiết">
                                <Button
                                  type="primary"
                                  icon={<EyeOutlined />}
                                  onClick={() => handleViewArticle(article)}
                                />
                              </Tooltip>
                              <Tooltip title="Chỉnh sửa">
                                <Button
                                  icon={<EditOutlined />}
                                  onClick={() => handleEditClick(article)}
                                />
                              </Tooltip>
                              <Tooltip title="Xóa">
                                <Popconfirm
                                  title="Bạn có chắc chắn muốn xóa bài viết này?"
                                  onConfirm={() =>
                                    handleDeleteArticle(article.id)
                                  }
                                  okText="Xóa"
                                  cancelText="Hủy"
                                >
                                  <Button danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                              </Tooltip>
                            </Space>
                          </div>
                        </div>
                      }
                      actions={[
                        <Tag
                          color={statusConfig.color}
                          icon={statusConfig.icon}
                        >
                          {statusConfig.text}
                        </Tag>,
                        <Tag color={categoryConfig.color}>
                          {categoryConfig.label}
                        </Tag>,
                        <span>
                          <EyeOutlined /> {article.views || 0}
                        </span>,
                      ]}
                    >
                      <Card.Meta
                        title={
                          <Tooltip title={article.title}>
                            <div className="article-title">{article.title}</div>
                          </Tooltip>
                        }
                        description={
                          <div>
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              style={{ marginBottom: 8 }}
                            >
                              {article.excerpt}
                            </Paragraph>
                            <div className="article-meta">
                              <Space>
                                <Avatar size="small" icon={<UserOutlined />} />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {dayjs(article.createdAt).format(
                                    'DD/MM/YYYY'
                                  )}
                                </Text>
                              </Space>
                            </div>
                            {article.tags && article.tags.length > 0 && (
                              <div
                                className="article-tags"
                                style={{ marginTop: 8 }}
                              >
                                {article.tags.slice(0, 3).map((tag) => (
                                  <Tag key={tag} size="small" color="blue">
                                    {tag}
                                  </Tag>
                                ))}
                              </div>
                            )}
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {/* Pagination */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredArticles.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} trong ${total} bài viết`
                }
              />
            </div>
          </>
        ) : (
          <Empty description="Chưa có bài viết nào" style={{ padding: '50px' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
            >
              Tạo bài viết đầu tiên
            </Button>
          </Empty>
        )}
      </Card>

      {/* Create Article Modal */}
      <Modal
        title={
          <Space>
            <PlusOutlined />
            Tạo bài viết mới
          </Space>
        }
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        width={800}
        okText="Tạo và gửi duyệt"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateArticle}>
          <Form.Item
            name="title"
            label="Tiêu đề bài viết"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề!' },
              { min: 10, message: 'Tiêu đề phải có ít nhất 10 ký tự!' },
            ]}
          >
            <Input placeholder="Nhập tiêu đề bài viết..." />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Tóm tắt"
            rules={[
              { required: true, message: 'Vui lòng nhập tóm tắt!' },
              { min: 20, message: 'Tóm tắt phải có ít nhất 20 ký tự!' },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục bài viết">
              {categories.map((cat) => (
                <Option key={cat.value} value={cat.value}>
                  <Tag color={cat.color}>{cat.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
            extra="Nhập các từ khóa, cách nhau bởi dấu phẩy"
          >
            <Input placeholder="vd: xét nghiệm, máu, an toàn" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung!' },
              { min: 100, message: 'Nội dung phải có ít nhất 100 ký tự!' },
            ]}
          >
            <TextArea
              rows={10}
              placeholder="Nhập nội dung đầy đủ của bài viết..."
              showCount
            />
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="Ảnh đại diện"
            extra="Chọn ảnh đại diện cho bài viết (không bắt buộc)"
          >
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Article Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            Chỉnh sửa bài viết
          </Space>
        }
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
          setSelectedArticle(null);
        }}
        onOk={() => editForm.submit()}
        confirmLoading={submitting}
        width={800}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditArticle}>
          <Form.Item
            name="title"
            label="Tiêu đề bài viết"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề!' },
              { min: 10, message: 'Tiêu đề phải có ít nhất 10 ký tự!' },
            ]}
          >
            <Input placeholder="Nhập tiêu đề bài viết..." />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Tóm tắt"
            rules={[
              { required: true, message: 'Vui lòng nhập tóm tắt!' },
              { min: 20, message: 'Tóm tắt phải có ít nhất 20 ký tự!' },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục bài viết">
              {categories.map((cat) => (
                <Option key={cat.value} value={cat.value}>
                  <Tag color={cat.color}>{cat.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
            extra="Nhập các từ khóa, cách nhau bởi dấu phẩy"
          >
            <Input placeholder="vd: xét nghiệm, máu, an toàn" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung!' },
              { min: 100, message: 'Nội dung phải có ít nhất 100 ký tự!' },
            ]}
          >
            <TextArea
              rows={10}
              placeholder="Nhập nội dung đầy đủ của bài viết..."
              showCount
            />
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="Ảnh đại diện"
            extra="Chọn ảnh đại diện mới (không bắt buộc)"
          >
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Article Modal */}
      <Modal
        title={
          <Space>
            <EyeOutlined />
            Chi tiết bài viết
          </Space>
        }
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedArticle(null);
        }}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setViewModalVisible(false);
              handleEditClick(selectedArticle);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={900}
      >
        {selectedArticle && (
          <div className="article-detail">
            <div style={{ marginBottom: '16px' }}>
              <img
                src={selectedArticle.thumbnail}
                alt={selectedArticle.title}
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </div>

            <Title level={3}>{selectedArticle.title}</Title>

            <div style={{ marginBottom: '16px' }}>
              <Space wrap>
                <Tag
                  color={getStatusConfig(selectedArticle.status).color}
                  icon={getStatusConfig(selectedArticle.status).icon}
                >
                  {getStatusConfig(selectedArticle.status).text}
                </Tag>
                <Tag color={getCategoryConfig(selectedArticle.category).color}>
                  {getCategoryConfig(selectedArticle.category).label}
                </Tag>
                <span>
                  <CalendarOutlined />{' '}
                  {dayjs(selectedArticle.createdAt).format('DD/MM/YYYY HH:mm')}
                </span>
                <span>
                  <EyeOutlined /> {selectedArticle.views || 0} lượt xem
                </span>
              </Space>
            </div>

            {selectedArticle.tags && selectedArticle.tags.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Tags: </Text>
                {selectedArticle.tags.map((tag) => (
                  <Tag key={tag} color="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
            )}

            <Title level={5}>Tóm tắt:</Title>
            <Paragraph>{selectedArticle.excerpt}</Paragraph>

            <Title level={5}>Nội dung:</Title>
            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
              {selectedArticle.content}
            </Paragraph>

            {selectedArticle.status === 'rejected' &&
              selectedArticle.adminNote && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#fff2f0',
                    border: '1px solid #ffccc7',
                    borderRadius: '6px',
                  }}
                >
                  <Text strong style={{ color: '#cf1322' }}>
                    Ghi chú từ Admin:
                  </Text>
                  <Paragraph style={{ marginTop: '8px', marginBottom: 0 }}>
                    {selectedArticle.adminNote}
                  </Paragraph>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffBlog;
