import React, { useState, useEffect } from 'react';
import './BlogManagement.css';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(5);
  const [searchBy, setSearchBy] = useState('title');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const statusSelectOptions = [
    { value: 'draft', label: 'Bản nháp' },
    { value: 'pending', label: 'Chờ duyệt' },
    { value: 'approved', label: 'Đã duyệt' },
    { value: 'rejected', label: 'Từ chối' },
    { value: 'published', label: 'Đã xuất bản' },
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
      {
        id: 6,
        title: 'Các phương pháp tránh thai hiện đại',
        author: 'Dr. Nguyễn Văn Tuấn',
        status: 'published',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-07',
        views: 2100,
        category: 'Kế hoạch hóa gia đình',
        excerpt:
          'Tổng quan về các phương pháp tránh thai hiện đại và hiệu quả...',
        content: 'Nội dung chi tiết về các phương pháp tránh thai hiện đại...',
      },
      {
        id: 7,
        title: 'Chăm sóc sức khỏe sau sinh',
        author: 'Dr. Trần Thị Hương',
        status: 'published',
        createdAt: '2024-01-03',
        updatedAt: '2024-01-04',
        views: 1800,
        category: 'Sau sinh',
        excerpt: 'Hướng dẫn chăm sóc sức khỏe cho mẹ sau khi sinh con...',
        content: 'Nội dung chi tiết về chăm sóc sức khỏe sau sinh...',
      },
      {
        id: 8,
        title: 'Xét nghiệm tiền sản phụ khoa',
        author: 'Dr. Lê Văn Hùng',
        status: 'pending',
        createdAt: '2024-01-22',
        updatedAt: '2024-01-22',
        views: 0,
        category: 'Xét nghiệm',
        excerpt:
          'Các xét nghiệm quan trọng cần thực hiện trước khi mang thai...',
        content: 'Nội dung chi tiết về xét nghiệm tiền sản phụ khoa...',
      },
    ];

    setBlogs(mockBlogs);
    setFilteredBlogs(mockBlogs);
  }, []);

  useEffect(() => {
    filterBlogs();
    setCurrentPage(1); // Reset to first page when filter changes
  }, [blogs, selectedStatus, searchTerm, searchBy]);

  const filterBlogs = () => {
    let filtered = blogs;

    // Apply status filter
    if (selectedStatus === 'true') {
      filtered = filtered.filter((blog) =>
        ['approved', 'published'].includes(blog.status)
      );
    } else if (selectedStatus === 'false') {
      filtered = filtered.filter((blog) =>
        ['draft', 'pending', 'rejected'].includes(blog.status)
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      if (searchBy === 'title') {
        filtered = filtered.filter((blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (searchBy === 'author') {
        filtered = filtered.filter((blog) =>
          blog.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (searchBy === 'category') {
        filtered = filtered.filter((blog) =>
          blog.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    setFilteredBlogs(filtered);
  };

  // Get current blogs for pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredBlogs.length / blogsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBlogsPerPageChange = (e) => {
    setBlogsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
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

  return (
    <div className="blog-management">
      <div className="blog-header">
        <h1>Quản lý bài viết</h1>
        <p>Xem và quản lý tất cả bài viết trong hệ thống</p>
      </div>

      {/* Filters */}
      <div className="blog-filters">
        <div className="search-filter">
          <div className="search-controls">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="search-by-select"
            >
              <option value="title">Tiêu đề</option>
              <option value="author">Tác giả</option>
              <option value="category">Danh mục</option>
            </select>
            <input
              type="text"
              placeholder={`Tìm kiếm theo ${searchBy === 'title' ? 'tiêu đề' : searchBy === 'author' ? 'tác giả' : 'danh mục'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="category-select"
            >
              <option value="all">Tất cả</option>
              <option value="true">Đã duyệt</option>
              <option value="false">Chưa duyệt</option>
            </select>
          </div>
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
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentBlogs.map((blog) => (
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
                <td>
                  <div className="status-cell">
                    {getStatusBadge(blog.status)}
                    {/* <select
                      value={blog.status}
                      onChange={(e) =>
                        handleStatusChange(blog.id, e.target.value)
                      }
                      className="status-select"
                    >
                      {statusSelectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select> */}
                  </div>
                </td>
                <td>{formatDate(blog.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewBlog(blog)}
                    >
                      Xem
                    </button>
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

        {/* Pagination */}
        {filteredBlogs.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Hiển thị {indexOfFirstBlog + 1} đến{' '}
              {Math.min(indexOfLastBlog, filteredBlogs.length)} trong tổng số{' '}
              {filteredBlogs.length} bài viết
            </div>
            <div className="pagination-controls">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
              >
                &laquo; Trước
              </button>

              <div className="pagination-numbers">
                {Array.from({
                  length: Math.ceil(filteredBlogs.length / blogsPerPage),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={
                  currentPage === Math.ceil(filteredBlogs.length / blogsPerPage)
                }
                className={`pagination-btn ${currentPage === Math.ceil(filteredBlogs.length / blogsPerPage) ? 'disabled' : ''}`}
              >
                Tiếp &raquo;
              </button>
            </div>

            <div className="items-per-page">
              <label htmlFor="blogsPerPage">Số bài viết mỗi trang:</label>
              <select
                id="blogsPerPage"
                value={blogsPerPage}
                onChange={handleBlogsPerPageChange}
                className="per-page-select"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
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
              <div className="status-change">
                <label htmlFor="blog-status">Thay đổi trạng thái:</label>
                <select
                  id="blog-status"
                  value={selectedBlog.status}
                  onChange={(e) => {
                    handleStatusChange(selectedBlog.id, e.target.value);
                  }}
                  className="status-select modal-status-select"
                >
                  {statusSelectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  className="btn-save-status"
                  onClick={() => setShowModal(false)}
                >
                  Lưu & Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
