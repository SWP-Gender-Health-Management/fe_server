import React, { useState } from 'react';
import './BlogFormModal.css';

const BlogFormModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    major: 'Sức khỏe sinh sản',
    content: '',
    imageList: [],
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [errors, setErrors] = useState({});

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung không được để trống';
    }

    if (formData.content.trim().length < 50) {
      newErrors.content = 'Nội dung phải có ít nhất 50 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onCreate(formData);
    }
  };

  return (
    <div className="blog-form-modal-overlay">
      <div className="blog-form-modal">
        {/* Modal Header */}
        <div className="blog-form-modal-header">
          <h2>Tạo bài viết mới</h2>
          <button className="blog-form-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="blog-form-modal-content">
          <form onSubmit={handleSubmit} className="blog-create-form">
            <div className="blog-form-group">
              <label>
                Tiêu đề <span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề bài viết..."
                className={errors.title ? 'error' : ''}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="blog-form-group">
              <label>
                Chuyên ngành <span className="required">*</span>
              </label>
              <select
                name="major"
                value={formData.major}
                onChange={handleInputChange}
              >
                {majorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="blog-form-group">
              <label>
                Nội dung <span className="required">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={12}
                placeholder="Nhập nội dung bài viết..."
                className={errors.content ? 'error' : ''}
              />
              <div className="character-count">
                {formData.content.length} ký tự (tối thiểu 50 ký tự)
              </div>
              {errors.content && (
                <span className="error-message">{errors.content}</span>
              )}
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
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="add-image-btn"
                  >
                    📷 Thêm
                  </button>
                </div>

                {formData.imageList.length > 0 && (
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
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="blog-form-modal-footer">
          <button
            type="button"
            className="staff-btn staff-btn-secondary"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="staff-btn staff-btn-primary"
            onClick={handleSubmit}
          >
            ✏️ Tạo bài viết
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogFormModal;
