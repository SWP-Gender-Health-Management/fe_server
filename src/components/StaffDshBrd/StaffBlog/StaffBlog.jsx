import React, { useState, useEffect } from 'react';
import './StaffBlog.css';
import Cookies from 'js-cookie';
import axios from 'axios';

const StaffBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [imageInput, setImageInput] = useState([]);
  const [majors, setMajors] = useState([]);


  // Mock blogs data
  useEffect(() => {
    fetchBlogs();
    fetchMajors();
  }, [showCreateModal]);

  // Fetch blogs from the server
  const fetchBlogs = async function () {
    try {
      const accountId = await Cookies.get('accountId');
      const accessToken = await Cookies.get('accessToken');
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
      console.log('Blog Response:', response.data.result);
      setBlogs(response.data.result || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return;
    }
  };

  // Fetch majors from the server
  const fetchMajors = async () => {
    try {
      const accountId = await Cookies.get('accountId');
      const accessToken = await Cookies.get('accessToken');

      const response = await axios.get(
        'http://localhost:3000/blog/get-major',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setMajors(response.data.result || []);
    } catch (error) {
      console.error("Error fetching majors:", error);
      return;
    }

  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('vi-VN') +
      ' ' +
      date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    );
  };

  const [newBlog, setNewBlog] = useState({
    title: '',
    major: '',
    content: '',
    images: [],
  });

  // Filter and sort blogs
  const filteredAndSortedBlogs = blogs
    .filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' || blog.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'true':
        return '#10b981';
      case true:
        return '#10b981';
      case 'false':
        return '#f59e0b';
      case false:
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'true':
        return 'Đã xuất bản';
      case true:
        return 'Đã xuất bản';
      case 'false':
        return 'Chờ duyệt';
      case false:
        return 'Chờ duyệt';
      default:
        return 'Không xác định';
    }
  };

  const handleAddImage = () => {
    if (imageInput.length > 0) {
      const newImages = Array.from(imageInput).map(file => ({
        type: 'file',
        value: file,
        preview: URL.createObjectURL(file) // Tạo URL tạm thời để hiển thị
      }));
      setNewBlog((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
      setImageInput([]); // Xóa input sau khi thêm
      // Reset input file
      document.querySelector('input[type="file"]').value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setNewBlog((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      // Thu hồi URL tạm thời nếu là file
      if (prev.images[index].type === 'file') {
        URL.revokeObjectURL(prev.images[index].preview);
      }
      return { ...prev, images: updatedImages };
    });
  };

  const handleCreateBlog = async () => {
    if (!newBlog.title || !newBlog.content) {
      alert('Vui lòng nhập tiêu đề và nội dung bài viết');
      return;
    }
    newBlog.images = newBlog.images.map((image) => image.value);
    const accountId = await Cookies.get('accountId');
    const accessToken = await Cookies.get('accessToken');


    const formDataToSend = new FormData();
    formDataToSend.append('title', newBlog.title);
    formDataToSend.append('major', newBlog.major);
    formDataToSend.append('content', newBlog.content);
    formDataToSend.append('account_id', accountId || '');

    newBlog.images.forEach((file) => {
      formDataToSend.append(`images`, file);
    });
    try {

      const response = await axios.post(
        'http://localhost:3000/blog/create-blog',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Có lỗi xảy ra khi tạo blog. Vui lòng thử lại sau.");
      return;
    }
    setNewBlog({
      title: '',
      content: '',
      major: '',
      images: [],
    });
    setShowCreateModal(false);
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      // setBlogs(blogs.filter((blog) => blog.blog_id !== blogId));
      try {
        const accountId = await Cookies.get('accountId');
        const accessToken = await Cookies.get('accessToken');
        await axios.delete(
          `http://localhost:3000/blog/delete-blog/${blogId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
          }
        );
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Có lỗi xảy ra khi xóa blog. Vui lòng thử lại sau.");
        return;
      } finally {
        fetchBlogs()
      }
    }
  };

  const handleStatusChange = (blogId, newStatus) => {
    setBlogs(
      blogs.map((blog) =>
        blog.blog_id === blogId
          ? { ...blog, status: newStatus, updated_at: new Date() }
          : blog
      )
    );
  };

  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === 'true' || b.status === true).length,
    pending: blogs.filter((b) => b.status === 'false' || b.status === false).length,
  };

  return (
    <div className="consultant-blog">
      {/* Header */}
      <div className="blog-header">
        <div className="header-content">
          <h2>📝 Quản lý Bài viết</h2>
          <p>Tạo và quản lý các bài blog chia sẻ kiến thức chuyên môn</p>
        </div>

        <button className="create-btn" onClick={() => setShowCreateModal(true)}>
          ✏️ Viết bài mới
        </button>
      </div>

      {/* Statistics */}
      <div className="blog-stats">
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng bài viết</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-content">
            <h3>{stats.published}</h3>
            <p>Đã xuất bản</p>
          </div>
        </div>


        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Chờ duyệt</p>
          </div>
        </div>

      </div>

      {/* Filters and Search */}
      <div className="blog-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="true">Đã xuất bản</option>
            <option value="false">Chờ duyệt</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="title">Theo tên</option>
          </select>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="blogs-grid">
        {filteredAndSortedBlogs.length > 0 ? (
          filteredAndSortedBlogs.map((blog) => (
            <div key={blog.blog_id} className="blog-card">
              <div className="blog-image">
                <img src={blog.images[0]} alt={blog.title} />
                <div className="blog-status">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(blog.status) }}
                  >
                    {getStatusText(blog.status)}
                  </span>
                </div>
              </div>

              <div className="blog-content">
                <div className="blog-meta">
                  <span className="major">{blog.major}</span>
                </div>

                <h3 className="blog-title">{blog.title}</h3>



                <div className="blog-stats">
                  <span>
                    📅 {formatDate(blog.created_at)}
                  </span>
                </div>
              </div>

              <div className="blog-actions">
                <button
                  className="action-btn view"
                  onClick={() => {
                    setSelectedBlog(blog);
                    setShowDetailModal(true);
                  }}
                >
                  👁️ Xem
                </button>
                <button className="action-btn edit">
                  ✏️ Sửa
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDeleteBlog(blog.blog_id)}
                >
                  🗑️ Xóa
                </button>

                {blog.status === 'draft' && (
                  <button
                    className="action-btn publish"
                    onClick={() => handleStatusChange(blog.blog_id, 'pending')}
                  >
                    📤 Gửi duyệt
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <span>📝</span>
            <h3>Chưa có bài viết nào</h3>
            <p>Hãy tạo bài viết đầu tiên của bạn</p>
            <button
              className="create-first-btn"
              onClick={() => setShowCreateModal(true)}
            >
              Viết bài đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Create Blog Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="create-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Viết bài mới</h3>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label>Tiêu đề bài viết</label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề bài viết..."
                  value={newBlog.title}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, title: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Chuyên ngành</label>
                <select
                  value={newBlog.major}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, major: e.target.value })
                  }
                  className="form-select"
                >
                  <option key={0} value="">Chọn danh mục</option>
                  {majors.map((major, index) => (
                    <option key={index} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
              </div>



              <div className="form-group">
                <label>Nội dung bài viết</label>
                <textarea
                  placeholder="Viết nội dung chi tiết của bài viết..."
                  value={newBlog.content}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, content: e.target.value })
                  }
                  className="form-textarea"
                  rows="10"
                />
              </div>

              <div className="form-group">
                <label>Ảnh của bài Viết</label>
                <div className="image-input-group">
                  <input
                    type="file"
                    multiple // Cho phép chọn nhiều file
                    accept="image/*" // Chỉ chấp nhận file ảnh
                    onChange={(e) => setImageInput(e.target.files)}
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="btn btn-outline"
                    disabled={imageInput.length === 0}
                  >
                    ➕ Thêm
                  </button>
                </div>
              </div>
              {newBlog.images.length > 0 && (
                <div className="images-preview">
                  <h4>Hình ảnh đã thêm ({newBlog.images.length})</h4>
                  <div className="images-grid">
                    {newBlog.images.map((image, index) => (
                      <div key={index} className="image-preview-item">
                        <img
                          src={image.type === 'file' ? image.preview : image.value}
                          alt={`Preview ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="remove-image-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              <div className="modal-actions">
                <button
                  className="action-btn save"
                  onClick={handleCreateBlog}
                >
                  💾 Tạo
                </button>
                <button
                  className="action-btn secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Detail Modal */}
      {showDetailModal && selectedBlog && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết bài viết</h3>
              <button
                className="close-btn"
                onClick={() => setShowDetailModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="blog-detail">
                <img
                  src={selectedBlog.images[0]}
                  alt={selectedBlog.title}
                  className="detail-image"
                />

                <div className="detail-meta">
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(selectedBlog.status),
                    }}
                  >
                    {getStatusText(selectedBlog.status)}
                  </span>
                  <span className="major">{selectedBlog.major}</span>
                </div>

                <h1 className="detail-title">{selectedBlog.title}</h1>

                <div className="detail-stats">
                  <span>
                    📅 {formatDate(selectedBlog.created_at)}
                  </span>
                </div>



                <div className="detail-content">
                  <h4>Nội dung:</h4>
                  <div className="content-text">{selectedBlog.content}</div>
                </div>
                {/* Blog Images */}

                {selectedBlog.images && selectedBlog.images.length > 0 && (
                  <div className="blog-images-section">
                    <h3>Hình Ảnh ({selectedBlog.images.length})</h3>
                    <div className="images-grid">
                      {selectedBlog.images.map((image, index) => (
                        <div key={index} className="image-item">
                          <img src={image} alt={`Blog image ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}


              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffBlog;
