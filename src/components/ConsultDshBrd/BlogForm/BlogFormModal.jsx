import React, { useState, useEffect, useRef } from 'react';
import './BlogFormModal.css';

const BlogFormModal = ({ blog, majors, onClose, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({
    title: '',
    major: '',
    content: '',
    images: [],
  });

  const [imageInput, setImageInput] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [characterCount, setCharacterCount] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && blog) {
      setFormData({
        title: blog.title,
        major: blog.major,
        content: blog.content,
        images: [...blog.images],
      });
      setCharacterCount(blog.content.length);
    }
  }, [blog, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Tiêu đề phải có ít nhất 10 ký tự';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Tiêu đề không được quá 200 ký tự';
    }

    if (!formData.major) {
      newErrors.major = 'Vui lòng chọn chuyên ngành';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung không được để trống';
    } else if (formData.content.length < 100) {
      newErrors.content = 'Nội dung phải có ít nhất 100 ký tự';
    } else if (formData.content.length > 10000) {
      newErrors.content = 'Nội dung không được quá 10,000 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'content') {
      setCharacterCount(value.length);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        alert(`File ${file.name} quá lớn. Vui lòng chọn file nhỏ hơn 5MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(
          `File ${file.name} không đúng định dạng. Chỉ chấp nhận JPG, PNG, WEBP.`
        );
        return false;
      }
      return true;
    });

    const newImages = validFiles.map((file) => ({
      type: 'file',
      value: file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const imageToRemove = prev.images[index];
      // Revoke URL if it's a file
      if (imageToRemove.type === 'file' && imageToRemove.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      const updatedImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: updatedImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Process images
      const processedImages = formData.images.map((image) => image.value);

      await onSubmit({
        ...formData,
        images: processedImages,
      });
    } catch (error) {
      console.error('Error submitting blog:', error);
      alert('Có lỗi xảy ra khi lưu blog. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).length;
  };

  const getReadingTime = (text) => {
    const wordCount = getWordCount(text);
    const readingTime = Math.ceil(wordCount / 200);
    return readingTime;
  };

  return (
    <div className="enhanced-blog-form-backdrop" onClick={handleBackdropClick}>
      <div className="enhanced-blog-form-modal">
        {/* Modal Header */}
        <div className="enhanced-form-header">
          <div className="header-content">
            <div className="form-type-badge">
              <span className="type-icon">{isEditing ? '✏️' : '➕'}</span>
              <span>{isEditing ? 'Chỉnh sửa blog' : 'Tạo blog mới'}</span>
            </div>
            <div className="header-actions">
              <button
                type="button"
                className="action-btn preview-btn"
                onClick={() => setPreviewMode(!previewMode)}
                disabled={!formData.content.trim()}
              >
                <span className="btn-icon">{previewMode ? '✏️' : '👁️'}</span>
                <span className="btn-text">
                  {previewMode ? 'Chỉnh sửa' : 'Xem trước'}
                </span>
              </button>
              <button
                type="button"
                className="action-btn close-btn"
                onClick={onClose}
                disabled={isSubmitting}
              >
                <span className="btn-icon">✕</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="enhanced-form-content">
            {!previewMode ? (
              <>
                {/* Basic Information Section */}
                <div className="form-section">
                  <h3 className="section-title">
                    <span className="section-icon">📋</span>
                    Thông tin cơ bản
                  </h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="title" className="form-label">
                        Tiêu đề blog <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Nhập tiêu đề hấp dẫn cho blog..."
                        className={`form-input ${errors.title ? 'error' : ''}`}
                        maxLength={200}
                      />
                      <div className="input-meta">
                        <span
                          className={`char-count ${formData.title.length > 180 ? 'warning' : ''}`}
                        >
                          {formData.title.length}/200
                        </span>
                        {errors.title && (
                          <span className="error-text">{errors.title}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="major" className="form-label">
                        Chuyên ngành <span className="required">*</span>
                      </label>
                      <select
                        id="major"
                        name="major"
                        value={formData.major}
                        onChange={handleInputChange}
                        className={`form-select ${errors.major ? 'error' : ''}`}
                      >
                        <option value="">Chọn chuyên ngành phù hợp</option>
                        {majors.map((major, index) => (
                          <option key={index} value={major}>
                            {major}
                          </option>
                        ))}
                      </select>
                      {errors.major && (
                        <span className="error-text">{errors.major}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="form-section">
                  <h3 className="section-title">
                    <span className="section-icon">📝</span>
                    Nội dung bài viết
                  </h3>

                  <div className="content-stats">
                    <div className="stat-item">
                      <span className="stat-icon">📊</span>
                      <span>{characterCount} ký tự</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">📖</span>
                      <span>{getWordCount(formData.content)} từ</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">⏱️</span>
                      <span>{getReadingTime(formData.content)} phút đọc</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="content" className="form-label">
                      Nội dung chi tiết <span className="required">*</span>
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Chia sẻ kiến thức chuyên môn của bạn một cách chi tiết và dễ hiểu..."
                      className={`form-textarea ${errors.content ? 'error' : ''}`}
                      rows="15"
                      maxLength={10000}
                    />
                    <div className="input-meta">
                      <span
                        className={`char-count ${characterCount > 9500 ? 'warning' : ''}`}
                      >
                        {characterCount}/10,000
                      </span>
                      {errors.content && (
                        <span className="error-text">{errors.content}</span>
                      )}
                    </div>
                  </div>

                  <div className="content-tips">
                    <h4>💡 Gợi ý viết blog chất lượng:</h4>
                    <ul>
                      <li>
                        Sử dụng ngôn ngữ dễ hiểu, tránh thuật ngữ phức tạp
                      </li>
                      <li>Cung cấp thông tin chính xác, có căn cứ khoa học</li>
                      <li>Cấu trúc bài viết rõ ràng với các đoạn ngắn</li>
                      <li>Tránh đưa ra chẩn đoán y khoa cụ thể</li>
                      <li>Khuyến khích độc giả tham khảo ý kiến chuyên gia</li>
                    </ul>
                  </div>
                </div>

                {/* Images Section */}
                <div className="form-section">
                  <h3 className="section-title">
                    <span className="section-icon">🖼️</span>
                    Hình ảnh minh họa
                  </h3>

                  <div className="image-upload-area">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="upload-label">
                      <div className="upload-content">
                        <span className="upload-icon">📷</span>
                        <span className="upload-text">Chọn hình ảnh</span>
                        <span className="upload-subtitle">
                          Hỗ trợ JPG, PNG, WEBP (tối đa 5MB)
                        </span>
                      </div>
                    </label>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="images-preview">
                      <h4>Hình ảnh đã thêm ({formData.images.length})</h4>
                      <div className="images-grid">
                        {formData.images.map((image, index) => (
                          <div key={index} className="image-preview-item">
                            <div className="image-wrapper">
                              <img
                                src={
                                  image.type === 'file'
                                    ? image.preview
                                    : image.value
                                }
                                alt={`Preview ${index + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="remove-image-btn"
                              >
                                <span>✕</span>
                              </button>
                            </div>
                            {image.type === 'file' && (
                              <div className="image-info">
                                <span className="image-name">{image.name}</span>
                                <span className="image-size">
                                  {formatFileSize(image.size)}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Preview Mode */
              <div className="preview-section">
                <h3 className="section-title">
                  <span className="section-icon">👁️</span>
                  Xem trước bài viết
                </h3>

                <div className="preview-container">
                  <div className="preview-header">
                    <h1 className="preview-title">
                      {formData.title || 'Tiêu đề blog'}
                    </h1>
                    <div className="preview-meta">
                      <span className="preview-major">
                        {formData.major || 'Chuyên ngành'}
                      </span>
                      <span className="preview-stats">
                        {getWordCount(formData.content)} từ •{' '}
                        {getReadingTime(formData.content)} phút đọc
                      </span>
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="preview-images">
                      <img
                        src={
                          formData.images[0].type === 'file'
                            ? formData.images[0].preview
                            : formData.images[0].value
                        }
                        alt="Featured"
                        className="preview-featured-image"
                      />
                    </div>
                  )}

                  <div className="preview-content">
                    {formData.content.split('\n').map(
                      (paragraph, index) =>
                        paragraph.trim() && (
                          <p key={index} className="preview-paragraph">
                            {paragraph}
                          </p>
                        )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="enhanced-form-footer">
            <div className="footer-actions">
              <button
                type="button"
                className="footer-btn secondary-btn"
                onClick={onClose}
                disabled={isSubmitting}
              >
                <span className="btn-icon">❌</span>
                <span className="btn-text">Hủy bỏ</span>
              </button>

              <div className="primary-actions">
                <button
                  type="button"
                  className="footer-btn preview-btn"
                  onClick={() => setPreviewMode(!previewMode)}
                  disabled={!formData.content.trim() || isSubmitting}
                >
                  <span className="btn-icon">{previewMode ? '✏️' : '👁️'}</span>
                  <span className="btn-text">
                    {previewMode ? 'Tiếp tục chỉnh sửa' : 'Xem trước'}
                  </span>
                </button>

                <button
                  type="submit"
                  className="footer-btn primary-btn"
                  disabled={isSubmitting}
                >
                  <span className="btn-icon">
                    {isSubmitting ? '⏳' : isEditing ? '💾' : '🚀'}
                  </span>
                  <span className="btn-text">
                    {isSubmitting
                      ? 'Đang lưu...'
                      : isEditing
                        ? 'Cập nhật blog'
                        : 'Xuất bản blog'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormModal;
