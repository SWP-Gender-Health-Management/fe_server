import React, { useState } from 'react';
import './BlogModal.css';

const BlogModal = ({ blog, onClose, onEdit }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) +
      ' ' +
      date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    );
  };

  const formatReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return `${readingTime} phút đọc`;
  };

  const nextImage = () => {
    if (blog.images && blog.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === blog.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (blog.images && blog.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? blog.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="enhanced-blog-modal-backdrop" onClick={handleBackdropClick}>
      <div className="enhanced-blog-modal">
        {/* Modal Header */}
        <div className="enhanced-modal-header">
          <div className="header-content">
            <div className="blog-type-badge">
              <span className="type-icon">📝</span>
              <span>Chi tiết blog</span>
            </div>
            <div className="header-actions">
              <button
                className="action-btn edit-btn"
                onClick={onEdit}
                title="Chỉnh sửa"
              >
                <span className="btn-icon">✏️</span>
                <span className="btn-text">Chỉnh sửa</span>
              </button>
              <button
                className="action-btn close-btn"
                onClick={onClose}
                title="Đóng"
              >
                <span className="btn-icon">✕</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="enhanced-modal-content">
          {/* Blog Header Section */}
          <div className="blog-header-section">
            <div className="title-section">
              <h1 className="blog-title">{blog.title}</h1>
              <div className="blog-meta">
                <div className="meta-item">
                  <span className="meta-icon">🏷️</span>
                  <span className="major-tag">{blog.major}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📖</span>
                  <span>{formatReadingTime(blog.content)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                {blog.updatedAt !== blog.createdAt && (
                  <div className="meta-item updated">
                    <span className="meta-icon">🔄</span>
                    <span>Cập nhật: {formatDate(blog.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="status-section">
              <div className={`status-badge enhanced-status-${blog.status}`}>
                <span className="status-icon">
                  {blog.status === 'true' || blog.status === true ? '✅' : '⏳'}
                </span>
                <span className="status-text">
                  {blog.status === 'true' || blog.status === true
                    ? 'Đã duyệt'
                    : 'Chờ duyệt'}
                </span>
              </div>
            </div>
          </div>

          {/* Status Information Card */}
          <div className="status-info-card">
            <div className={`status-info enhanced-status-${blog.status}`}>
              <div className="status-visual">
                <div className="status-icon-large">
                  {blog.status === 'true' || blog.status === true ? '✅' : '⏳'}
                </div>
                <div className="status-details">
                  <h3 className="status-title">
                    {blog.status === 'true' || blog.status === true
                      ? 'Blog đã được duyệt'
                      : 'Blog đang chờ duyệt'}
                  </h3>
                  <p className="status-description">
                    {blog.status === 'true' || blog.status === true
                      ? 'Blog của bạn đã được admin phê duyệt và hiển thị công khai cho người dùng.'
                      : 'Blog của bạn đang được xem xét bởi admin. Thời gian duyệt thường từ 1-3 ngày làm việc.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Images Section */}
          {blog.images && blog.images.length > 0 && (
            <div className="blog-images-section">
              <h3 className="section-title">
                <span className="title-icon">🖼️</span>
                Hình ảnh ({blog.images.length})
              </h3>
              <div className="images-carousel">
                <div className="carousel-container">
                  <div className="main-image">
                    <img
                      src={blog.images[currentImageIndex]}
                      alt={`Blog image ${currentImageIndex + 1}`}
                      className="carousel-image"
                    />
                    {blog.images.length > 1 && (
                      <>
                        <button
                          className="carousel-btn prev-btn"
                          onClick={prevImage}
                        >
                          <span>‹</span>
                        </button>
                        <button
                          className="carousel-btn next-btn"
                          onClick={nextImage}
                        >
                          <span>›</span>
                        </button>
                      </>
                    )}
                    <div className="image-counter">
                      {currentImageIndex + 1} / {blog.images.length}
                    </div>
                  </div>
                  {blog.images.length > 1 && (
                    <div className="thumbnail-strip">
                      {blog.images.map((image, index) => (
                        <button
                          key={index}
                          className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img src={image} alt={`Thumbnail ${index + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Blog Content Section */}
          <div className="blog-content-section">
            <h3 className="section-title">
              <span className="title-icon">📄</span>
              Nội dung
            </h3>
            <div className="content-container">
              <div className="blog-content-text">
                {blog.content.split('\n').map(
                  (paragraph, index) =>
                    paragraph.trim() && (
                      <p key={index} className="content-paragraph">
                        {paragraph}
                      </p>
                    )
                )}
              </div>
            </div>
          </div>

          {/* Blog Statistics */}
          <div className="blog-stats-section">
            <h3 className="section-title">
              <span className="title-icon">📊</span>
              Thống kê
            </h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <div className="stat-number">
                    {blog.content.split(' ').length}
                  </div>
                  <div className="stat-label">Từ</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📖</div>
                <div className="stat-content">
                  <div className="stat-number">
                    {formatReadingTime(blog.content)}
                  </div>
                  <div className="stat-label">Đọc</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🖼️</div>
                <div className="stat-content">
                  <div className="stat-number">
                    {blog.images ? blog.images.length : 0}
                  </div>
                  <div className="stat-label">Hình ảnh</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <div className="stat-number">
                    {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="stat-label">Ngày tạo</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="enhanced-modal-footer">
          <div className="footer-actions">
            <button className="footer-btn secondary-btn" onClick={onClose}>
              <span className="btn-icon">👈</span>
              <span className="btn-text">Quay lại</span>
            </button>
            <button className="footer-btn primary-btn" onClick={onEdit}>
              <span className="btn-icon">✏️</span>
              <span className="btn-text">Chỉnh sửa blog</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
