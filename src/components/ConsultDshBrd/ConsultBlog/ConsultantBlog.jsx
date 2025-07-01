import React, { useEffect, useState } from 'react';
import BlogModal from '@components/ConsultDshBrd/BlogModal/BlogModal';
import BlogFormModal from '@components/ConsultDshBrd/BlogModal/BlogModal';
import './ConsultantBlog.css';
import axios, { AxiosHeaders } from 'axios';

const ConsultantBlog = () => {
  const [filter, setFilter] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data cho blogs
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      const accountId = await sessionStorage.getItem('accountId');
      const accessToken = await sessionStorage.getItem('accessToken');
      // console.log('useEffect has been called!:', accountId);
      console.log('useEffect has been called!:', accessToken);
      const response = await axios.get(
        `http://localhost:3000/blog/get-blog-by-account/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Response:', response.data);
      setBlogs(response.data.result || []);
    }
    fetchBlogs();
  }, []);

  const majors = [
    'Sức khỏe sinh sản',
    'Kế hoạch hóa gia đình',
    'Sức khỏe tình dục',
    'Sức khỏe phụ khoa',
    'Sức khỏe nam giới',
    'Giáo dục giới tính',
  ];

  // Filter blogs based on status
  const filteredBlogs = blogs.filter((blog) => {
    if (filter === 'true') {
      return blog.status === true || blog.status === 'true';
    } else if (filter === 'false') {
      return blog.status === false || blog.status === 'false';
    }
    return true;
  });

  // Handle blog click
  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setShowBlogModal(true);
  };

  // Handle create blog
  const handleCreateBlog = () => {
    setSelectedBlog(null);
    setIsEditing(false);
    setShowCreateModal(true);
  };

  // Handle edit blog
  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setIsEditing(true);
    setShowCreateModal(true);
  };

  // Handle blog submission (create or update)
  const handleBlogSubmit = (blogData) => {
    if (isEditing && selectedBlog) {
      // Update existing blog
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === selectedBlog.id
            ? {
              ...blog,
              ...blogData,
              status: 'false', // Reset to false when updated
              updatedAt: new Date().toISOString(),
            }
            : blog
        )
      );
    } else {
      // Create new blog
      const newBlog = {
        id: `B${String(blogs.length + 1).padStart(3, '0')}`,
        ...blogData,
        status: 'false',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: sessionStorage.getItem('full_name') || 'Tư vấn viên',
      };
      setBlogs((prev) => [newBlog, ...prev]);
    }
    setShowCreateModal(false);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('vi-VN') +
      ' ' +
      date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <div className="consultant-blog">
      <div className="blog-header">
        <h1>Quản Lý Blog</h1>
        <div className="blog-stats">
          <div className="stat-item">
            <span className="stat-number">
              {blogs.filter((b) => (b.status === 'true' || b.status === true)).length}
            </span>
            <span className="stat-label">Đã duyệt</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {blogs.filter((b) => (b.status === 'false' || b.status === false)).length}
            </span>
            <span className="stat-label">Chờ duyệt</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{blogs.length}</span>
            <span className="stat-label">Tổng cộng</span>
          </div>
        </div>
      </div>

      <div className="blog-controls">
        <div className="blog-filters">
          {['All', 'true', 'false'].map((filterOption) => (
            <button
              key={filterOption}
              className={`filter-btn ${filter === filterOption ? 'active' : ''}`}
              onClick={() => setFilter(filterOption)}
            >
              {filterOption === 'All'
                ? 'Tất cả'
                : filterOption === 'true'
                  ? 'Đã duyệt'
                  : 'Chờ duyệt'}
              <span className="filter-count">
                (
                {filterOption === 'All'
                  ? blogs.length
                  : filterOption === 'true'
                    ? blogs.filter((b) => b.status === 'true' || b.status === true).length
                    : blogs.filter((b) => b.status === 'false' || b.status === false).length}
                )
              </span>
            </button>
          ))}
        </div>
        <button
          className="btn btn-primary create-btn"
          onClick={handleCreateBlog}
        >
          <span>➕</span> Tạo Blog Mới
        </button>
      </div>

      <div className="blogs-grid">
        {filteredBlogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>Không có blog nào</h3>
            <p>
              {filter === 'All'
                ? 'Bạn chưa tạo blog nào. Hãy tạo blog đầu tiên của bạn!'
                : filter === 'true'
                  ? 'Hiện tại chưa có blog nào được duyệt.'
                  : 'Hiện tại chưa có blog nào đang chờ duyệt.'}
            </p>
            {filter === 'All' && (
              <button className="btn btn-primary" onClick={handleCreateBlog}>
                <span>➕</span> Tạo Blog Đầu Tiên
              </button>
            )}
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div key={blog.id} className={`blog-card ${blog.status}`} onClick={() => handleBlogClick(blog)}>
              <div className="blog-image">
                {blog.images && blog.images.length > 0 ? (
                  <img src={blog.images[0]} alt={blog.title} />
                ) : (
                  <div className="no-image">
                    <span>📝</span>
                  </div>
                )}
                <div className={`status-badge status-${blog.status}`}>
                  {(blog.status === 'true' || blog.status === true) ? 'Đã duyệt' : 'Chờ duyệt'}
                </div>
              </div>
              <div className="blog-content">
                <div className="blog-info">
                  <h3 className="blog-title">{blog.title}</h3>
                  <div className="blog-major">
                    <span className="major-tag">{blog.major}</span>
                  </div>
                  <p className="blog-excerpt">
                    {blog.content.substring(0, 150)}...
                  </p>
                  <div className="blog-meta">
                    <span className="blog-date">
                      {formatDate(blog.createdAt)}
                    </span>
                    {blog.updatedAt !== blog.createdAt && (
                      <span className="blog-updated">
                        Cập nhật: {formatDate(blog.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="blog-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => handleBlogClick(blog)}
                  >
                    👁️ Xem chi tiết
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBlog(blog);
                    }}
                  >
                    ✏️ Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Blog Detail Modal */}
      {showBlogModal && (
        <BlogModal
          blog={selectedBlog}
          onClose={() => setShowBlogModal(false)}
          onEdit={() => {
            setShowBlogModal(false);
            handleEditBlog(selectedBlog);
          }}
        />
      )}

      {/* Blog Create/Edit Modal */}
      {showCreateModal && (
        <BlogFormModal
          blog={isEditing ? selectedBlog : null}
          majors={majors}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleBlogSubmit}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default ConsultantBlog;
