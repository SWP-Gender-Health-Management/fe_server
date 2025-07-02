import React, { useState, useEffect } from 'react';
import './BlogFormModal.css';

const BlogFormModal = ({ blog, majors, onClose, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({
    title: '',
    major: '',
    content: '',
    images: [],
  });
  const [imageInput, setImageInput] = useState([]);

  useEffect(() => {
    if (isEditing && blog) {
      setFormData({
        title: blog.title,
        major: blog.major,
        content: blog.content,
        images: [...blog.images],
      });
    }
  }, [blog, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddImage = () => {
    if (imageInput.length > 0) {
      const newImages = Array.from(imageInput).map(file => ({
        type: 'file',
        value: file,
        preview: URL.createObjectURL(file) // Tạo URL tạm thời để hiển thị
      }));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
      setImageInput([]); // Xóa input sau khi thêm
      // Reset input file
      document.querySelector('input[type="file"]').value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      // Thu hồi URL tạm thời nếu là file
      if (prev.images[index].type === 'file') {
        URL.revokeObjectURL(prev.images[index].preview);
      }
      return { ...prev, images: updatedImages };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề blog.');
      return;
    }
    if (!formData.major) {
      alert('Vui lòng chọn chuyên ngành.');
      return;
    }
    if (!formData.content.trim()) {
      alert('Vui lòng nhập nội dung blog.');
      return;
    }

    formData.images = formData.images.map((image) => image.value); // Chỉ giữ lại giá trị file hoặc URL

    onSubmit(formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="blog-form-modal-backdrop" onClick={handleBackdropClick}>
      <div className="blog-form-modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Chỉnh Sửa Blog' : 'Tạo Blog Mới'}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="form-section">
              <h3>Thông Tin Cơ Bản</h3>

              <div className="form-group">
                <label htmlFor="title">Tiêu đề *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề blog..."
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="major">Chuyên ngành *</label>
                <select
                  id="major"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Chọn chuyên ngành</option>
                  {majors.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>Nội Dung</h3>
              <div className="form-group">
                <label htmlFor="content">Nội dung blog *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Nhập nội dung chi tiết của blog..."
                  className="form-textarea"
                  rows="10"
                  required
                />
                <div className="content-tips">
                  <strong>💡 Gợi ý viết blog:</strong>
                  <ul>
                    <li>Sử dụng ngôn ngữ dễ hiểu, thân thiện</li>
                    <li>Cung cấp thông tin chính xác và khoa học</li>
                    <li>Cấu trúc bài viết rõ ràng với các đoạn ngắn</li>
                    <li>Tránh đưa ra chẩn đoán y khoa cụ thể</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Hình Ảnh</h3>
              <div className="form-group">
                <label>Thêm hình ảnh</label>
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

              {formData.images.length > 0 && (
                <div className="images-preview">
                  <h4>Hình ảnh đã thêm ({formData.images.length})</h4>
                  <div className="images-grid">
                    {formData.images.map((image, index) => (
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
            </div>

            {isEditing && (
              <div className="form-section warning-section">
                <div className="warning-info">
                  <div className="warning-icon">⚠️</div>
                  <div className="warning-text">
                    <strong>Lưu ý khi cập nhật:</strong>
                    <p>
                      Khi bạn cập nhật blog, trạng thái sẽ chuyển về "Chờ duyệt"
                      và cần được admin/manager phê duyệt lại.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              <span>{isEditing ? '💾' : '➕'}</span>
              {isEditing ? 'Cập nhật' : 'Tạo blog'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormModal;
