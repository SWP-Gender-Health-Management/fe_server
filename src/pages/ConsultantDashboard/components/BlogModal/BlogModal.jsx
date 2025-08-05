import React from 'react';
import './BlogModal.css';

const BlogModal = ({ blog, onClose, onEdit }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('vi-VN') +
      ' ' +
      date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <div className="blog-modal-backdrop" onClick={handleBackdropClick}>
      <div className="blog-modal">
        <div className="blog-modal-header">
          <h2>Chi Tiết Blog</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="blog-details">
            {/* Blog Header */}
            <div className="blog-header-section">
              <div className="blog-title-section">
                <h1 className="blog-title">{blog.title}</h1>
                <div className="blog-meta-info">
                  <span className="blog-major-tag">{blog.major}</span>
                  <span className={`status-badge status-${blog.status}`}>
                    {(blog.status === 'true' || blog.status === true) ? 'Đã duyệt' : 'Chờ duyệt'}
                  </span>
                </div>
              </div>
              <div className="blog-dates">
                <div className="date-info">
                  <strong>Tạo:</strong> {formatDate(blog.createdAt)}
                </div>
                {blog.updatedAt !== blog.createdAt && (
                  <div className="date-info">
                    <strong>Cập nhật:</strong> {formatDate(blog.updatedAt)}
                  </div>
                )}
                <div className="date-info">
                  <strong>Tác giả:</strong> {blog.author}
                </div>
              </div>
            </div>

            {/* Blog Content */}
            <div className="blog-content-section">
              <h3>Nội Dung</h3>
              <div className="blog-content-text">
                {blog.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Blog Images */}
            {blog.images && blog.images.length > 0 && (
              <div className="blog-images-section">
                <h3>Hình Ảnh ({blog.images.length})</h3>
                <div className="images-grid">
                  {blog.images.map((image, index) => (
                    <div key={index} className="image-item">
                      <img src={image} alt={`Blog image ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Information */}
            <div className="blog-status-section">
              <h3>Trạng Thái Blog</h3>
              <div className={`status-info status-${blog.status}`}>
                {(blog.status === 'true' || blog.status === true) ? (
                  <>
                    <div className="status-icon">✅</div>
                    <div className="status-text">
                      <strong>Đã được duyệt</strong>
                      <p>
                        Blog này đã được admin/manager phê duyệt và hiển thị
                        công khai.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="status-icon">⏳</div>
                    <div className="status-text">
                      <strong>Đang chờ duyệt</strong>
                      <p>
                        Blog này đang được xem xét và chờ admin/manager phê
                        duyệt.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onEdit}>
            <span>✏️</span> Chỉnh sửa
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
