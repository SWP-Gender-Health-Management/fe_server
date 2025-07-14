import React, { useState } from 'react';
import './BlogDetailModal.css';

const BlogDetailModal = ({ blog, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: blog.title,
    major: blog.major,
    content: blog.content,
    imageList: blog.imageList,
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  const majorOptions = [
    'Sức khỏe sinh sản',
    'Nội tiết',
    'Huyết học',
    'Sinh hóa',
    'Vi sinh',
    'Miễn dịch',
    'Giải phẫu bệnh',
    'Khác',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        imageList: [...prev.imageList, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageList: prev.imageList.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    const updatedBlog = {
      ...blog,
      ...formData,
    };
    onUpdate(updatedBlog);
  };

  const handleCancel = () => {
    setFormData({
      title: blog.title,
      major: blog.major,
      content: blog.content,
      imageList: blog.imageList,
    });
    setIsEditing(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="blog-detail-modal-overlay">
      <div className="blog-detail-modal">
        <div className="blog-detail-modal-header">
          <div>
            <h2>{isEditing ? 'Chỉnh sửa bài viết' : 'Chi tiết bài viết'}</h2>
            <div className="blog-meta-info">
              <span className="blog-id">ID: {blog.id}</span>
              <span className={`blog-status-indicator ${blog.status}`}>
                {blog.status === 'verified' ? '✅ Đã duyệt' : '⏳ Chờ duyệt'}
              </span>
            </div>
          </div>
          <button className="blog-detail-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="blog-detail-modal-content">
          {isEditing ? (
            <form className="blog-edit-form">
              <div className="blog-form-group">
                <label>Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="blog-form-group">
                <label>Chuyên ngành</label>
                <select
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  required
                >
                  {majorOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="blog-form-group">
                <label>Nội dung</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={10}
                  required
                />
              </div>

              <div className="blog-form-group">
                <label>Hình ảnh</label>
                <div className="blog-image-manager">
                  <div className="blog-add-image">
                    <input
                      type="url"
                      placeholder="Nhập URL hình ảnh..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                    <button type="button" onClick={handleAddImage}>
                      Thêm
                    </button>
                  </div>

                  <div className="blog-image-list">
                    {formData.imageList.map((imageUrl, index) => (
                      <div key={index} className="blog-image-item">
                        <img src={imageUrl} alt={`Blog image ${index + 1}`} />
                        <button
                          type="button"
                          className="blog-remove-image"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="blog-detail-view">
              <div className="blog-detail-header">
                <h1 className="blog-title">{blog.title}</h1>
                <div className="blog-major">{blog.major}</div>
              </div>

              <div className="blog-detail-meta">
                <div className="blog-date-info">
                  <span>Ngày tạo: {formatDate(blog.createdDate)}</span>
                  {blog.updatedDate !== blog.createdDate && (
                    <span>Cập nhật: {formatDate(blog.updatedDate)}</span>
                  )}
                </div>
              </div>

              <div className="blog-content">
                <h3>Nội dung</h3>
                <div className="blog-content-text">
                  {blog.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {blog.imageList.length > 0 && (
                <div className="blog-images">
                  <h3>Hình ảnh</h3>
                  <div className="blog-image-gallery">
                    {blog.imageList.map((imageUrl, index) => (
                      <div key={index} className="blog-gallery-item">
                        <img src={imageUrl} alt={`Blog image ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="blog-detail-modal-footer">
          <button className="staff-btn staff-btn-secondary" onClick={onClose}>
            Đóng
          </button>
          {isEditing ? (
            <>
              <button
                className="staff-btn staff-btn-secondary"
                onClick={handleCancel}
              >
                Hủy
              </button>
              <button
                className="staff-btn staff-btn-primary"
                onClick={handleSave}
              >
                💾 Lưu thay đổi
              </button>
            </>
          ) : (
            <button
              className="staff-btn staff-btn-primary"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailModal;
