import React, { useState, useEffect } from 'react';
import './ConsultantBlog.css';

const ConsultantBlog = () => {
  const [articles, setArticles] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock articles data
  useEffect(() => {
    const mockArticles = [
      {
        id: 1,
        title: 'Kế hoạch hóa gia đình: Những điều cần biết',
        content:
          'Kế hoạch hóa gia đình là việc quyết định số lượng con cái, khoảng cách sinh và thời điểm sinh con phù hợp với điều kiện kinh tế, sức khỏe...',
        excerpt:
          'Hướng dẫn chi tiết về các phương pháp kế hoạch hóa gia đình hiện đại và an toàn.',
        status: 'published',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        views: 1245,
        likes: 89,
        category: 'Kế hoạch hóa gia đình',
        readingTime: 5,
        image: '/api/placeholder/400/200',
        tags: ['kế hoạch', 'gia đình', 'tránh thai'],
      },
      {
        id: 2,
        title: 'Chu kỳ kinh nguyệt và sức khỏe phụ nữ',
        content:
          'Chu kỳ kinh nguyệt là một phần quan trọng trong sức khỏe sinh sản của phụ nữ. Hiểu rõ về chu kỳ này giúp chị em theo dõi...',
        excerpt:
          'Tìm hiểu về chu kỳ kinh nguyệt bình thường và các dấu hiệu cần lưu ý.',
        status: 'draft',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
        views: 0,
        likes: 0,
        category: 'Sức khỏe sinh sản',
        readingTime: 7,
        image: '/api/placeholder/400/200',
        tags: ['kinh nguyệt', 'sức khỏe', 'phụ nữ'],
      },
      {
        id: 3,
        title: 'Chăm sóc sức khỏe sau sinh',
        content:
          'Thời kỳ sau sinh là giai đoạn quan trọng đối với sức khỏe của người mẹ. Việc chăm sóc đúng cách sẽ giúp mẹ phục hồi nhanh chóng...',
        excerpt:
          'Hướng dẫn chăm sóc toàn diện cho mẹ trong giai đoạn sau sinh.',
        status: 'pending',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
        views: 567,
        likes: 34,
        category: 'Sau sinh',
        readingTime: 6,
        image: '/api/placeholder/400/200',
        tags: ['sau sinh', 'chăm sóc', 'phục hồi'],
      },
    ];
    setArticles(mockArticles);
  }, []);

  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    image: null,
  });

  // Filter and sort articles
  const filteredAndSortedArticles = articles
    .filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' || article.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return '#10b981';
      case 'draft':
        return '#6b7280';
      case 'pending':
        return '#f59e0b';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published':
        return 'Đã xuất bản';
      case 'draft':
        return 'Bản nháp';
      case 'pending':
        return 'Chờ duyệt';
      case 'rejected':
        return 'Bị từ chối';
      default:
        return 'Không xác định';
    }
  };

  const handleCreateArticle = () => {
    if (!newArticle.title || !newArticle.content) {
      alert('Vui lòng nhập tiêu đề và nội dung bài viết');
      return;
    }

    const article = {
      id: Date.now(),
      ...newArticle,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
      readingTime: Math.ceil(newArticle.content.split(' ').length / 200),
    };

    setArticles([article, ...articles]);
    setNewArticle({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: [],
      image: null,
    });
    setShowCreateModal(false);
  };

  const handleDeleteArticle = (articleId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      setArticles(articles.filter((article) => article.id !== articleId));
    }
  };

  const handleStatusChange = (articleId, newStatus) => {
    setArticles(
      articles.map((article) =>
        article.id === articleId
          ? { ...article, status: newStatus, updatedAt: new Date() }
          : article
      )
    );
  };

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    draft: articles.filter((a) => a.status === 'draft').length,
    pending: articles.filter((a) => a.status === 'pending').length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
    totalLikes: articles.reduce((sum, a) => sum + a.likes, 0),
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
          <span className="stat-icon">📝</span>
          <div className="stat-content">
            <h3>{stats.draft}</h3>
            <p>Bản nháp</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Chờ duyệt</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">👀</span>
          <div className="stat-content">
            <h3>{stats.totalViews}</h3>
            <p>Lượt xem</p>
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
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
            <option value="pending">Chờ duyệt</option>
            <option value="rejected">Bị từ chối</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="views">Nhiều lượt xem</option>
            <option value="likes">Nhiều lượt thích</option>
            <option value="title">Theo tên</option>
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="articles-grid">
        {filteredAndSortedArticles.length > 0 ? (
          filteredAndSortedArticles.map((article) => (
            <div key={article.id} className="article-card">
              <div className="article-image">
                <img src={article.image} alt={article.title} />
                <div className="article-status">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(article.status) }}
                  >
                    {getStatusText(article.status)}
                  </span>
                </div>
              </div>

              <div className="article-content">
                <div className="article-meta">
                  <span className="category">{article.category}</span>
                  <span className="reading-time">
                    {article.readingTime} phút đọc
                  </span>
                </div>

                <h3 className="article-title">{article.title}</h3>
                <p className="article-excerpt">{article.excerpt}</p>

                <div className="article-tags">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="article-stats">
                  <span>👀 {article.views}</span>
                  <span>❤️ {article.likes}</span>
                  <span>
                    📅 {article.createdAt.toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              <div className="article-actions">
                <button
                  className="action-btn view"
                  onClick={() => {
                    setSelectedArticle(article);
                    setShowDetailModal(true);
                  }}
                >
                  👁️ Xem
                </button>
                <button className="action-btn edit">✏️ Sửa</button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDeleteArticle(article.id)}
                >
                  🗑️ Xóa
                </button>

                {article.status === 'draft' && (
                  <button
                    className="action-btn publish"
                    onClick={() => handleStatusChange(article.id, 'pending')}
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

      {/* Create Article Modal */}
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
                  value={newArticle.title}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, title: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Danh mục</label>
                <select
                  value={newArticle.category}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, category: e.target.value })
                  }
                  className="form-select"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="Kế hoạch hóa gia đình">
                    Kế hoạch hóa gia đình
                  </option>
                  <option value="Sức khỏe sinh sản">Sức khỏe sinh sản</option>
                  <option value="Sau sinh">Sau sinh</option>
                  <option value="Tư vấn tâm lý">Tư vấn tâm lý</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tóm tắt</label>
                <textarea
                  placeholder="Viết tóm tắt ngắn gọn về bài viết..."
                  value={newArticle.excerpt}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, excerpt: e.target.value })
                  }
                  className="form-textarea short"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Nội dung bài viết</label>
                <textarea
                  placeholder="Viết nội dung chi tiết của bài viết..."
                  value={newArticle.content}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, content: e.target.value })
                  }
                  className="form-textarea"
                  rows="10"
                />
              </div>

              <div className="form-group">
                <label>Tags (cách nhau bằng dấu phẩy)</label>
                <input
                  type="text"
                  placeholder="tag1, tag2, tag3..."
                  onChange={(e) => {
                    const tags = e.target.value
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter((tag) => tag);
                    setNewArticle({ ...newArticle, tags });
                  }}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="action-btn save"
                  onClick={handleCreateArticle}
                >
                  💾 Lưu bản nháp
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

      {/* Article Detail Modal */}
      {showDetailModal && selectedArticle && (
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
              <div className="article-detail">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="detail-image"
                />

                <div className="detail-meta">
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(selectedArticle.status),
                    }}
                  >
                    {getStatusText(selectedArticle.status)}
                  </span>
                  <span className="category">{selectedArticle.category}</span>
                  <span className="reading-time">
                    {selectedArticle.readingTime} phút đọc
                  </span>
                </div>

                <h1 className="detail-title">{selectedArticle.title}</h1>

                <div className="detail-stats">
                  <span>👀 {selectedArticle.views} lượt xem</span>
                  <span>❤️ {selectedArticle.likes} lượt thích</span>
                  <span>
                    📅 {selectedArticle.createdAt.toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="detail-excerpt">
                  <h4>Tóm tắt:</h4>
                  <p>{selectedArticle.excerpt}</p>
                </div>

                <div className="detail-content">
                  <h4>Nội dung:</h4>
                  <div className="content-text">{selectedArticle.content}</div>
                </div>

                <div className="detail-tags">
                  <h4>Tags:</h4>
                  <div className="tags-list">
                    {selectedArticle.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantBlog;
