import React, { useState } from 'react';
import BlogDetailModal from '../BlogDetail/BlogDetailModal';
import BlogFormModal from '../BlogForm/BlogFormModal';
import './StaffBlog.css';

const StaffBlog = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Mock blog data
  const [blogs, setBlogs] = useState([
    {
      id: 'BLOG001',
      title: 'Tầm quan trọng của xét nghiệm sức khỏe sinh sản định kỳ',
      major: 'Sức khỏe sinh sản',
      content:
        'Xét nghiệm sức khỏe sinh sản định kỳ là một phần quan trọng trong việc duy trì sức khỏe tổng thể. Các xét nghiệm này giúp phát hiện sớm các bệnh lý, giúp điều trị kịp thời và hiệu quả. Việc thực hiện các xét nghiệm định kỳ giúp người bệnh có thể phát hiện sớm các vấn đề sức khỏe tiềm ẩn.',
      imageList: [
        'https://via.placeholder.com/600x400/667eea/ffffff?text=Health+Check',
        'https://via.placeholder.com/600x400/764ba2/ffffff?text=Medical+Test',
      ],
      status: 'verified',
      createdDate: '2024-01-10',
      updatedDate: '2024-01-10',
    },
    {
      id: 'BLOG002',
      title: 'Hướng dẫn chuẩn bị trước khi xét nghiệm hormone',
      major: 'Nội tiết',
      content:
        'Việc chuẩn bị đúng cách trước khi xét nghiệm hormone sẽ giúp kết quả chính xác hơn. Bài viết này sẽ hướng dẫn chi tiết các bước chuẩn bị cần thiết như nhịn ăn, thời gian lấy mẫu phù hợp, và những lưu ý quan trọng khác.',
      imageList: [
        'https://via.placeholder.com/600x400/10b981/ffffff?text=Hormone+Test',
      ],
      status: 'unverified',
      createdDate: '2024-01-12',
      updatedDate: '2024-01-12',
    },
    {
      id: 'BLOG003',
      title: 'Những điều cần biết về xét nghiệm máu tổng quát',
      major: 'Huyết học',
      content:
        'Xét nghiệm máu tổng quát là một trong những xét nghiệm cơ bản nhất trong y học. Tìm hiểu về các chỉ số như hồng cầu, bạch cầu, tiểu cầu và ý nghĩa của chúng trong chẩn đoán bệnh.',
      imageList: [
        'https://via.placeholder.com/600x400/f59e0b/ffffff?text=Blood+Test',
        'https://via.placeholder.com/600x400/ef4444/ffffff?text=Laboratory',
      ],
      status: 'verified',
      createdDate: '2024-01-08',
      updatedDate: '2024-01-08',
    },
  ]);

  // Filter blogs based on selected filter
  const filteredBlogs = blogs.filter((blog) => {
    switch (selectedFilter) {
      case 'Verified':
        return blog.status === 'verified';
      case 'Unverified':
        return blog.status === 'unverified';
      default:
        return true;
    }
  });

  // Get filter counts
  const getFilterCounts = () => {
    const counts = { All: 0, Verified: 0, Unverified: 0 };

    blogs.forEach((blog) => {
      counts.All++;
      if (blog.status === 'verified') counts.Verified++;
      if (blog.status === 'unverified') counts.Unverified++;
    });

    return counts;
  };

  // Handle blog click
  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setIsDetailModalOpen(true);
  };

  // Handle create new blog
  const handleCreateBlog = () => {
    setIsFormModalOpen(true);
  };

  // Handle blog creation
  const handleBlogCreated = (newBlog) => {
    const blogWithId = {
      ...newBlog,
      id: `BLOG${String(blogs.length + 1).padStart(3, '0')}`,
      status: 'unverified',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
    };

    setBlogs((prev) => [...prev, blogWithId]);
    setIsFormModalOpen(false);
  };

  // Handle blog update
  const handleBlogUpdated = (updatedBlog) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === updatedBlog.id
          ? {
              ...updatedBlog,
              status: 'unverified',
              updatedDate: new Date().toISOString().split('T')[0],
            }
          : blog
      )
    );
    setIsDetailModalOpen(false);
    setSelectedBlog(null);
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  // Truncate content for preview
  const truncateContent = (content, maxLength = 150) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + '...'
      : content;
  };

  const filterCounts = getFilterCounts();

  return (
    <div className="staff-blog">
      <div className="staff-page-header">
        <h1 className="staff-page-title">Blog</h1>
        <p className="staff-page-subtitle">
          Quản lý bài viết và kiến thức chuyên môn
        </p>
      </div>

      {/* Header with filters and create button */}
      <div className="blog-header">
        <div className="blog-filters">
          {Object.entries(filterCounts).map(([filter, count]) => (
            <button
              key={filter}
              className={`blog-filter-btn ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter} ({count})
            </button>
          ))}
        </div>

        <button
          className="staff-btn staff-btn-primary"
          onClick={handleCreateBlog}
        >
          ✏️ Create Blog
        </button>
      </div>

      {/* Blog List */}
      <div className="blog-list">
        {filteredBlogs.length === 0 ? (
          <div className="blog-empty-state">
            <div className="blog-empty-icon">📝</div>
            <h3>Không có bài viết nào</h3>
            <p>
              {selectedFilter === 'All'
                ? 'Chưa có bài viết nào được tạo. Hãy tạo bài viết đầu tiên!'
                : `Không có bài viết nào có trạng thái ${selectedFilter.toLowerCase()}.`}
            </p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="blog-card staff-card"
                onClick={() => handleBlogClick(blog)}
              >
                {/* Blog Image */}
                <div className="blog-card-image">
                  {blog.imageList.length > 0 ? (
                    <img src={blog.imageList[0]} alt={blog.title} />
                  ) : (
                    <div className="blog-card-no-image">
                      <span>📄</span>
                    </div>
                  )}
                  <div className={`blog-status-badge ${blog.status}`}>
                    {blog.status === 'verified'
                      ? '✅ Verified'
                      : '⏳ Unverified'}
                  </div>
                </div>

                {/* Blog Content */}
                <div className="blog-card-content">
                  <div className="blog-card-header">
                    <h3 className="blog-card-title">{blog.title}</h3>
                    <span className="blog-card-major">{blog.major}</span>
                  </div>

                  <p className="blog-card-preview">
                    {truncateContent(blog.content)}
                  </p>

                  <div className="blog-card-footer">
                    <div className="blog-card-dates">
                      <span>Tạo: {formatDate(blog.createdDate)}</span>
                      {blog.updatedDate !== blog.createdDate && (
                        <span>Cập nhật: {formatDate(blog.updatedDate)}</span>
                      )}
                    </div>
                    <div className="blog-card-meta">
                      <span className="blog-card-id">{blog.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {isDetailModalOpen && selectedBlog && (
        <BlogDetailModal
          blog={selectedBlog}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedBlog(null);
          }}
          onUpdate={handleBlogUpdated}
        />
      )}

      {isFormModalOpen && (
        <BlogFormModal
          onClose={() => setIsFormModalOpen(false)}
          onCreate={handleBlogCreated}
        />
      )}
    </div>
  );
};

export default StaffBlog;
