import React, { useState, useEffect } from 'react';
import './BlogManagement.css';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'Tất cả', count: 0 },
    { value: 'draft', label: 'Bản nháp', count: 0 },
    { value: 'pending', label: 'Chờ duyệt', count: 0 },
    { value: 'approved', label: 'Đã duyệt', count: 0 },
    { value: 'rejected', label: 'Từ chối', count: 0 },
    { value: 'published', label: 'Đã xuất bản', count: 0 },
  ];

  useEffect(() => {
    // Mock data for blogs
    const mockBlogs = [
      {
        id: 1,
        title: 'Chăm sóc sức khỏe sinh sản phụ nữ',
        author: 'Dr. Nguyễn Thị Lan',
        status: 'published',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-16',
        views: 1250,
        category: 'Sức khỏe sinh sản',
        excerpt:
          'Hướng dẫn chi tiết về cách chăm sóc sức khỏe sinh sản cho phụ nữ...',
        content: 'Nội dung bài viết đầy đủ về chăm sóc sức khỏe sinh sản...',
      },
      {
        id: 2,
        title: 'Tầm quan trọng của xét nghiệm định kỳ',
        author: 'Dr. Trần Văn Nam',
        status: 'pending',
        createdAt: '2024-01-18',
        updatedAt: '2024-01-18',
        views: 0,
        category: 'Xét nghiệm',
        excerpt:
          'Tại sao việc xét nghiệm định kỳ lại quan trọng đối với sức khỏe...',
        content:
          'Nội dung chi tiết về tầm quan trọng của xét nghiệm định kỳ...',
      },
      {
        id: 3,
        title: 'Phòng ngừa các bệnh lây truyền qua đường tình dục',
        author: 'Dr. Phạm Thị Hoa',
        status: 'approved',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-12',
        views: 890,
        category: 'Phòng ngừa',
        excerpt: 'Các biện pháp phòng ngừa hiệu quả các bệnh lây truyền...',
        content:
          'Hướng dẫn đầy đủ về phòng ngừa các bệnh lây truyền qua đường tình dục...',
      },
      {
        id: 4,
        title: 'Dinh dưỡng cho phụ nữ mang thai',
        author: 'Dr. Lê Thị Mai',
        status: 'draft',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        views: 0,
        category: 'Thai kỳ',
        excerpt: 'Những lưu ý về dinh dưỡng quan trọng trong thai kỳ...',
        content: 'Nội dung chi tiết về dinh dưỡng cho phụ nữ mang thai...',
      },
      {
        id: 5,
        title: 'Tư vấn sức khỏe tâm lý cho phụ nữ',
        author: 'Dr. Hoàng Văn Đức',
        status: 'rejected',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-14',
        views: 0,
        category: 'Tâm lý',
        excerpt: 'Các vấn đề tâm lý thường gặp ở phụ nữ và cách giải quyết...',
        content: 'Nội dung về tư vấn sức khỏe tâm lý cho phụ nữ...',
        rejectionReason: 'Nội dung cần bổ sung thêm tài liệu tham khảo',
      },
    ];

    setBlogs(mockBlogs);
    setFilteredBlogs(mockBlogs);
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, statusFilter, searchTerm]);

  const filterBlogs = () => {
    let filtered = blogs;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((blog) => blog.status === statusFilter);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  };

  const getStatusCounts = () => {
    const counts = {
      all: blogs.length,
      draft: blogs.filter((b) => b.status === 'draft').length,
      pending: blogs.filter((b) => b.status === 'pending').length,
      approved: blogs.filter((b) => b.status === 'approved').length,
      rejected: blogs.filter((b) => b.status === 'rejected').length,
      published: blogs.filter((b) => b.status === 'published').length,
    };
    return counts;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: 'Bản nháp', class: 'status-draft' },
      pending: { label: 'Chờ duyệt', class: 'status-pending' },
      approved: { label: 'Đã duyệt', class: 'status-approved' },
      rejected: { label: 'Từ chối', class: 'status-rejected' },
      published: { label: 'Đã xuất bản', class: 'status-published' },
    };

    const config = statusConfig[status] || {
      label: status,
      class: 'status-default',
    };
    return (
      <span className={`status-badge ${config.class}`}>{config.label}</span>
    );
  };

  const handleStatusChange = (blogId, newStatus) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === blogId
          ? {
              ...blog,
              status: newStatus,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : blog
      )
    );
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const counts = getStatusCounts();

  return (
    <div className="blog-management">
      <div className="blog-header">
        <h1>Quản lý bài viết</h1>
        <p>Xem và quản lý tất cả bài viết trong hệ thống</p>
      </div>

      {/* Filters */}
      <div className="blog-filters">
        <div className="status-filters">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={`filter-btn ${statusFilter === option.value ? 'active' : ''}`}
              onClick={() => setStatusFilter(option.value)}
            >
              {option.label} ({counts[option.value]})
            </button>
          ))}
        </div>

        <div className="search-filter">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, tác giả, danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Blog Table */}
      <div className="blog-table-container">
        <table className="blog-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Lượt xem</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr key={blog.id}>
                <td>
                  <div className="blog-title">
                    <h4>{blog.title}</h4>
                    <p className="blog-excerpt">{blog.excerpt}</p>
                  </div>
                </td>
                <td>{blog.author}</td>
                <td>
                  <span className="category-tag">{blog.category}</span>
                </td>
                <td>{getStatusBadge(blog.status)}</td>
                <td>{formatDate(blog.createdAt)}</td>
                <td>{blog.views.toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewBlog(blog)}
                    >
                      Xem
                    </button>
                    {blog.status === 'pending' && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() =>
                            handleStatusChange(blog.id, 'approved')
                          }
                        >
                          Duyệt
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() =>
                            handleStatusChange(blog.id, 'rejected')
                          }
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                    {blog.status === 'approved' && (
                      <button
                        className="btn-publish"
                        onClick={() => handleStatusChange(blog.id, 'published')}
                      >
                        Xuất bản
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBlogs.length === 0 && (
          <div className="no-results">
            <p>Không tìm thấy bài viết nào phù hợp với bộ lọc</p>
          </div>
        )}
      </div>

      {/* Blog Detail Modal */}
      {showModal && selectedBlog && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedBlog.title}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="blog-meta">
                <p>
                  <strong>Tác giả:</strong> {selectedBlog.author}
                </p>
                <p>
                  <strong>Danh mục:</strong> {selectedBlog.category}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{' '}
                  {getStatusBadge(selectedBlog.status)}
                </p>
                <p>
                  <strong>Ngày tạo:</strong>{' '}
                  {formatDate(selectedBlog.createdAt)}
                </p>
                <p>
                  <strong>Lần cập nhật cuối:</strong>{' '}
                  {formatDate(selectedBlog.updatedAt)}
                </p>
                <p>
                  <strong>Lượt xem:</strong>{' '}
                  {selectedBlog.views.toLocaleString()}
                </p>
                {selectedBlog.rejectionReason && (
                  <p>
                    <strong>Lý do từ chối:</strong>{' '}
                    {selectedBlog.rejectionReason}
                  </p>
                )}
              </div>
              <div className="blog-content">
                <h3>Nội dung:</h3>
                <p>{selectedBlog.content}</p>
              </div>
            </div>
            <div className="modal-footer">
              {selectedBlog.status === 'pending' && (
                <>
                  <button
                    className="btn-approve"
                    onClick={() => {
                      handleStatusChange(selectedBlog.id, 'approved');
                      setShowModal(false);
                    }}
                  >
                    Duyệt bài viết
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => {
                      handleStatusChange(selectedBlog.id, 'rejected');
                      setShowModal(false);
                    }}
                  >
                    Từ chối
                  </button>
                </>
              )}
              {selectedBlog.status === 'approved' && (
                <button
                  className="btn-publish"
                  onClick={() => {
                    handleStatusChange(selectedBlog.id, 'published');
                    setShowModal(false);
                  }}
                >
                  Xuất bản
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
