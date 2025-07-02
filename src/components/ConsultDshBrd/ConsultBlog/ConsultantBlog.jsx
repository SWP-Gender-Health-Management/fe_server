import React, { useEffect, useState, useRef } from 'react';
import BlogModal from '@components/ConsultDshBrd/BlogModal/BlogModal';
import BlogFormModal from '@components/ConsultDshBrd/BlogForm/BlogFormModal';
import './ConsultantBlog.css';
import axios, { AxiosHeaders } from 'axios';
import Cookies from 'js-cookie';

const ConsultantBlog = () => {
  const [filter, setFilter] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showTooltip, setShowTooltip] = useState({
    show: false,
    text: '',
    position: { x: 0, y: 0 },
  });
  const searchInputRef = useRef(null);
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);

  // Mock data cho blogs - fake data for testing
  const [blogs, setBlogs] = useState([
    {
      id: 'B001',
      title: 'Hướng dẫn chăm sóc vùng kín cho phụ nữ',
      major: 'Sức khỏe phụ nữ',
      content:
        'Vệ sinh vùng kín là một phần quan trọng trong việc duy trì sức khỏe sinh sản của phụ nữ. Việc chăm sóc đúng cách không chỉ giúp phòng ngừa các bệnh nhiễm trùng mà còn giúp phụ nữ cảm thấy tự tin và thoải mái hơn. Trong bài viết này, chúng ta sẽ tìm hiểu về các nguyên tắc cơ bản và những lưu ý quan trọng khi chăm sóc vùng kín. Đầu tiên, việc vệ sinh hàng ngày nên được thực hiện bằng nước sạch và xà phòng nhẹ không mùi. Tránh sử dụng các sản phẩm có chứa hóa chất mạnh hoặc hương liệu có thể gây kích ứng. Việc rửa sạch từ phía trước ra sau sẽ giúp ngăn ngừa vi khuẩn từ hậu môn di chuyển đến âm đạo.',
      status: true,
      createdAt: '2024-01-10T09:00:00.000Z',
      updatedAt: '2024-01-10T09:00:00.000Z',
      images: [],
      views: 1250,
      likes: 89,
    },
    {
      id: 'B002',
      title: 'Các biện pháp tránh thai hiện đại và hiệu quả',
      major: 'Kế hoạch hóa gia đình',
      content:
        'Ngày nay, có rất nhiều phương pháp tránh thai khác nhau, từ các biện pháp truyền thống đến những công nghệ hiện đại. Việc lựa chọn phương pháp phù hợp phụ thuộc vào nhiều yếu tố như độ tuổi, tình trạng sức khỏe, kế hoạch sinh con và sở thích cá nhân. Hãy cùng tìm hiểu về các phương pháp tránh thai phổ biến và hiệu quả nhất hiện nay. Thuốc tránh thai hàng ngày là một trong những phương pháp phổ biến nhất với hiệu quả lên đến 99% khi sử dụng đúng cách. Bao cao su không chỉ ngăn ngừa thai kỳ mà còn bảo vệ khỏi các bệnh lây truyền qua đường tình dục.',
      status: true,
      createdAt: '2024-01-12T14:30:00.000Z',
      updatedAt: '2024-01-12T14:30:00.000Z',
      images: [],
      views: 980,
      likes: 67,
    },
    {
      id: 'B003',
      title: 'Hiểu rõ về chu kỳ kinh nguyệt và sức khỏe sinh sản',
      major: 'Sức khỏe phụ nữ',
      content:
        'Chu kỳ kinh nguyệt là một quá trình sinh lý tự nhiên xảy ra hàng tháng ở phụ nữ trong độ tuổi sinh sản. Hiểu rõ về chu kỳ này không chỉ giúp phụ nữ theo dõi sức khỏe sinh sản mà còn hỗ trợ trong việc kế hoạch hóa gia đình. Một chu kỳ kinh nguyệt bình thường kéo dài từ 21-35 ngày, tính từ ngày đầu của kỳ kinh này đến ngày đầu của kỳ kinh tiếp theo. Trong suốt chu kỳ, cơ thể phụ nữ trải qua nhiều thay đổi hormone quan trọng. Việc theo dõi chu kỳ kinh nguyệt giúp phát hiện sớm các bất thường về sức khỏe sinh sản.',
      status: false,
      createdAt: '2024-01-15T16:20:00.000Z',
      updatedAt: '2024-01-15T16:20:00.000Z',
      images: [],
      views: 543,
      likes: 34,
    },
    {
      id: 'B004',
      title: 'Nam giới và sức khỏe sinh sản: Những điều cần biết',
      major: 'Sức khỏe nam giới',
      content:
        'Sức khỏe sinh sản nam giới là một chủ đề quan trọng nhưng thường bị bỏ qua trong xã hội. Nam giới cũng cần quan tâm và chăm sóc sức khỏe sinh sản của mình không kém gì phụ nữ. Các vấn đề như rối loạn cương dương, xuất tinh sớm, vô sinh nam ngày càng phổ biến. Việc nhận biết sớm các dấu hiệu bất thường và tìm kiếm sự tư vấn y tế kịp thời là rất quan trọng. Lối sống lành mạnh bao gồm chế độ ăn uống cân bằng, tập thể dục đều đặn và tránh các tác nhân có hại như thuốc lá, rượu bia sẽ góp phần duy trì sức khỏe sinh sản tốt.',
      status: true,
      createdAt: '2024-01-16T11:45:00.000Z',
      updatedAt: '2024-01-16T11:45:00.000Z',
      images: [],
      views: 721,
      likes: 45,
    },
    {
      id: 'B005',
      title: 'Chuẩn bị cho thai kỳ: Những điều quan trọng cần biết',
      major: 'Thai sản',
      content:
        'Việc chuẩn bị chu đáo trước khi mang thai là chìa khóa cho một thai kỳ khỏe mạnh và an toàn. Điều này bao gồm việc chăm sóc sức khỏe thể chất, tinh thần, dinh dưỡng và lối sống. Các cặp đôi nên bắt đầu chuẩn bị ít nhất 3-6 tháng trước khi dự định có con. Việc khám sức khỏe tiền hôn nhân và tư vấn di truyền là những bước quan trọng không thể bỏ qua. Bổ sung axit folic, vitamin và khoáng chất cần thiết, duy trì cân nặng hợp lý và tập thể dục đều đặn sẽ tạo điều kiện tốt nhất cho việc thụ thai và phát triển thai nhi.',
      status: false,
      createdAt: '2024-01-17T13:30:00.000Z',
      updatedAt: '2024-01-17T13:30:00.000Z',
      images: [],
      views: 432,
      likes: 28,
    },
    {
      id: 'B006',
      title: 'Phòng ngừa và điều trị các bệnh lây truyền qua đường tình dục',
      major: 'An toàn tình dục',
      content:
        'Các bệnh lây truyền qua đường tình dục (STDs) là một vấn đề sức khỏe công cộng nghiêm trọng, ảnh hưởng đến hàng triệu người trên toàn thế giới. Những bệnh này có thể gây ra các biến chứng nghiêm trọng nếu không được phát hiện và điều trị kịp thời. Hiểu biết về các biện pháp phòng ngừa là bước đầu tiên để bảo vệ bản thân và người thân. Sử dụng bao cao su đúng cách, thực hiện tình dục an toàn, khám sức khỏe định kỳ và tiêm vắc xin phòng bệnh khi cần thiết là những biện pháp hiệu quả. Việc giáo dục và nâng cao nhận thức về an toàn tình dục cần được thực hiện từ sớm.',
      status: true,
      createdAt: '2024-01-18T10:15:00.000Z',
      updatedAt: '2024-01-18T10:15:00.000Z',
      images: [],
      views: 876,
      likes: 52,
    },
    {
      id: 'B007',
      title: 'Tư vấn dinh dưỡng cho phụ nữ mang thai',
      major: 'Thai sản',
      content:
        'Dinh dưỡng trong thai kỳ đóng vai trò vô cùng quan trọng đối với sự phát triển của thai nhi và sức khỏe của mẹ. Một chế độ ăn uống cân bằng và đầy đủ chất dinh dưỡng sẽ giúp đảm bảo thai nhi phát triển khỏe mạnh và mẹ duy trì được sức khỏe tốt trong suốt thai kỳ. Protein, carbohydrate, chất béo lành mạnh, vitamin và khoáng chất đều cần được bổ sung đầy đủ. Đặc biệt, axit folic, canxi, sắt và DHA là những chất dinh dưỡng thiết yếu cần được quan tâm đặc biệt. Tránh các thực phẩm có thể gây hại như rượu bia, caffeine quá nhiều và thực phẩm sống không đảm bảo vệ sinh.',
      status: false,
      createdAt: '2024-01-19T15:45:00.000Z',
      updatedAt: '2024-01-19T15:45:00.000Z',
      images: [],
      views: 654,
      likes: 41,
    },
    {
      id: 'B008',
      title: 'Giáo dục giới tính cho thanh thiếu niên',
      major: 'Giáo dục giới tính',
      content:
        'Giáo dục giới tính là một phần thiết yếu trong sự phát triển của thanh thiếu niên. Việc cung cấp thông tin chính xác, khoa học về giới tính sẽ giúp các em hiểu rõ hơn về cơ thể, tình dục và các mối quan hệ. Điều này không chỉ giúp các em bảo vệ bản thân mà còn hình thành thái độ tích cực và trách nhiệm trong các mối quan hệ tình cảm. Giáo dục giới tính nên được thực hiện một cách khoa học, phù hợp với từng độ tuổi và văn hóa. Sự phối hợp giữa gia đình, nhà trường và xã hội là rất quan trọng để tạo ra một môi trường giáo dục toàn diện và hiệu quả.',
      status: true,
      createdAt: '2024-01-20T12:20:00.000Z',
      updatedAt: '2024-01-20T12:20:00.000Z',
      images: [],
      views: 789,
      likes: 63,
    },
  ]);

  const [majors, setMajors] = useState([
    { id: 1, name: 'Sức khỏe phụ nữ' },
    { id: 2, name: 'Sức khỏe nam giới' },
    { id: 3, name: 'Kế hoạch hóa gia đình' },
    { id: 4, name: 'Thai sản' },
    { id: 5, name: 'An toàn tình dục' },
    { id: 6, name: 'Giáo dục giới tính' },
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Ctrl/Cmd + N: Create new blog
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleCreateBlog();
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        if (showBlogModal) setShowBlogModal(false);
        if (showCreateModal) setShowCreateModal(false);
        if (bulkActionMode) setBulkActionMode(false);
      }

      // Delete: Delete selected blogs in bulk mode
      if (e.key === 'Delete' && bulkActionMode && selectedCards.size > 0) {
        e.preventDefault();
        handleBulkDelete();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showBlogModal, showCreateModal, bulkActionMode, selectedCards]);

  // Filter and search blogs
  const getFilteredAndSortedBlogs = () => {
    let filteredBlogs = blogs.filter((blog) => {
      // Filter by status
      const statusMatch =
        filter === 'All' ||
        (filter === 'true' &&
          (blog.status === true || blog.status === 'true')) ||
        (filter === 'false' &&
          (blog.status === false || blog.status === 'false'));

      // Filter by search query
      const searchMatch =
        !searchQuery ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && searchMatch;
    });

    // Sort blogs
    filteredBlogs.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'most-viewed':
          return (b.views || 0) - (a.views || 0);
        case 'most-liked':
          return (b.likes || 0) - (a.likes || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filteredBlogs;
  };

  const filteredBlogs = getFilteredAndSortedBlogs();

  // Handle blog click
  const handleBlogClick = (blog) => {
    if (bulkActionMode) {
      handleCardSelect(blog.id);
      return;
    }
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
  const handleEditBlog = (blog, e) => {
    e.stopPropagation();
    setSelectedBlog(blog);
    setIsEditing(true);
    setShowCreateModal(true);
  };

  // Handle blog submission (create or update)
  const handleBlogSubmit = async (blogData) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isEditing && selectedBlog) {
      // Update existing blog
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === selectedBlog.id
            ? {
                ...blog,
                ...blogData,
                status: false, // Reset to false when updated
                updatedAt: new Date().toISOString(),
              }
            : blog
        )
      );
    } else {
      // Create new blog
      const newBlog = {
        id: 'B' + String(blogs.length + 1).padStart(3, '0'),
        title: blogData.title,
        major: blogData.major,
        content: blogData.content,
        status: false, // New blogs start as pending
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: blogData.images || [],
        views: 0,
        likes: 0,
      };

      setBlogs((prev) => [newBlog, ...prev]);
    }

    setIsLoading(false);
    setShowCreateModal(false);

    // Show success toast
    showSuccessToast(
      isEditing ? 'Blog đã được cập nhật!' : 'Blog mới đã được tạo!'
    );
  };

  // Handle delete blog
  const handleDeleteBlog = (blogId, e) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa blog này không?')) {
      setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
      showSuccessToast('Blog đã được xóa!');
    }
  };

  // Bulk actions
  const handleCardSelect = (blogId) => {
    setSelectedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(blogId)) {
        newSet.delete(blogId);
      } else {
        newSet.add(blogId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedCards.size === filteredBlogs.length) {
      setSelectedCards(new Set());
    } else {
      setSelectedCards(new Set(filteredBlogs.map((blog) => blog.id)));
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedCards.size} blog đã chọn?`
      )
    ) {
      setBlogs((prev) => prev.filter((blog) => !selectedCards.has(blog.id)));
      setSelectedCards(new Set());
      setBulkActionMode(false);
      showSuccessToast(`Đã xóa ${selectedCards.size} blog!`);
    }
  };

  // Tooltip helpers
  const showTooltipHelper = (text, event) => {
    setShowTooltip({
      show: true,
      text,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const hideTooltip = () => {
    setShowTooltip({ show: false, text: '', position: { x: 0, y: 0 } });
  };

  // Success toast
  const showSuccessToast = (message) => {
    // Simple implementation - you can enhance this with a toast library
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Format reading time
  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return `${readingTime} phút đọc`;
  };

  // Get blog stats
  const getBlogStats = () => {
    const published = blogs.filter(
      (b) => b.status === 'true' || b.status === true
    ).length;
    const pending = blogs.filter(
      (b) => b.status === 'false' || b.status === false
    ).length;
    const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
    const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);

    return { published, pending, total: blogs.length, totalViews, totalLikes };
  };

  const stats = getBlogStats();

  return (
    <div className="enhanced-consultant-blog">
      {/* Header Section */}
      <div className="blog-header-section">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">
              <span className="title-icon">📝</span>
              Quản lý Blog
            </h1>
            <p className="page-subtitle">
              Chia sẻ kiến thức chuyên môn và xây dựng uy tín với bệnh nhân
              thông qua các bài viết chất lượng
            </p>
          </div>
          <button
            className="create-blog-btn primary"
            onClick={handleCreateBlog}
            onMouseEnter={(e) =>
              showTooltipHelper('Tạo blog mới (Ctrl + N)', e)
            }
            onMouseLeave={hideTooltip}
          >
            <span className="btn-icon">✨</span>
            <span className="btn-text">Tạo blog mới</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-overview">
          <div className="stat-card published">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.published}</div>
              <div className="stat-label">Đã duyệt</div>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Chờ duyệt</div>
            </div>
          </div>
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Tổng cộng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="blog-controls-section">
        <div className="search-and-filters">
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, chuyên ngành hoặc nội dung... (Ctrl + K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                  onMouseEnter={(e) => showTooltipHelper('Xóa tìm kiếm', e)}
                  onMouseLeave={hideTooltip}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="filters-container">
            <div className="filter-group">
              <label className="filter-label">Trạng thái:</label>
              <div className="filter-tabs">
                {[
                  { key: 'All', label: 'Tất cả', count: stats.total },
                  { key: 'true', label: 'Đã duyệt', count: stats.published },
                  { key: 'false', label: 'Chờ duyệt', count: stats.pending },
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    className={`filter-tab ${filter === filterOption.key ? 'active' : ''}`}
                    onClick={() => setFilter(filterOption.key)}
                  >
                    <span className="tab-label">{filterOption.label}</span>
                    <span className="tab-count">{filterOption.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sort-group">
              <label className="filter-label">Sắp xếp:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="most-viewed">Xem nhiều nhất</option>
                <option value="most-liked">Thích nhiều nhất</option>
                <option value="alphabetical">Theo tên A-Z</option>
              </select>
            </div>

            {/* Bulk actions toggle */}
            <div className="bulk-actions-toggle">
              <button
                className={`bulk-toggle-btn ${bulkActionMode ? 'active' : ''}`}
                onClick={() => setBulkActionMode(!bulkActionMode)}
                onMouseEnter={(e) => showTooltipHelper('Chế độ chọn nhiều', e)}
                onMouseLeave={hideTooltip}
              >
                <span className="bulk-icon">☑️</span>
                <span className="bulk-text">Chọn nhiều</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bulk actions bar */}
        {bulkActionMode && (
          <div className="bulk-actions-bar">
            <div className="bulk-info">
              <button className="select-all-btn" onClick={handleSelectAll}>
                {selectedCards.size === filteredBlogs.length ? '☑️' : '☐'}
                Chọn tất cả ({selectedCards.size}/{filteredBlogs.length})
              </button>
            </div>

            {selectedCards.size > 0 && (
              <div className="bulk-actions">
                <button
                  className="bulk-action-btn delete"
                  onClick={handleBulkDelete}
                  onMouseEnter={(e) =>
                    showTooltipHelper('Xóa các blog đã chọn (Delete)', e)
                  }
                  onMouseLeave={hideTooltip}
                >
                  <span className="action-icon">🗑️</span>
                  <span className="action-text">
                    Xóa {selectedCards.size} blog
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results summary */}
        <div className="results-summary">
          <span className="results-count">
            Hiển thị {filteredBlogs.length} trong số {blogs.length} blog
          </span>
          {searchQuery && (
            <span className="search-info">
              cho từ khóa "<strong>{searchQuery}</strong>"
            </span>
          )}
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="blogs-content">
        {filteredBlogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <span className="empty-icon">
                {searchQuery
                  ? '🔍'
                  : filter === 'All'
                    ? '📝'
                    : filter === 'true'
                      ? '✅'
                      : '⏳'}
              </span>
            </div>
            <h3 className="empty-title">
              {searchQuery
                ? 'Không tìm thấy blog nào'
                : filter === 'All'
                  ? 'Chưa có blog nào'
                  : filter === 'true'
                    ? 'Chưa có blog nào được duyệt'
                    : 'Chưa có blog nào đang chờ duyệt'}
            </h3>
            <p className="empty-description">
              {searchQuery
                ? `Không có blog nào khớp với từ khóa "${searchQuery}". Thử tìm kiếm với từ khóa khác.`
                : filter === 'All'
                  ? 'Bạn chưa tạo blog nào. Hãy chia sẻ kiến thức chuyên môn của bạn!'
                  : filter === 'true'
                    ? 'Hiện tại chưa có blog nào được admin phê duyệt.'
                    : 'Hiện tại chưa có blog nào đang chờ duyệt.'}
            </p>
            <div className="empty-actions">
              {searchQuery ? (
                <button
                  className="action-btn secondary"
                  onClick={() => setSearchQuery('')}
                >
                  <span className="btn-icon">🔄</span>
                  <span className="btn-text">Xóa tìm kiếm</span>
                </button>
              ) : filter === 'All' ? (
                <button
                  className="action-btn primary"
                  onClick={handleCreateBlog}
                >
                  <span className="btn-icon">✨</span>
                  <span className="btn-text">Tạo blog đầu tiên</span>
                </button>
              ) : (
                <button
                  className="action-btn secondary"
                  onClick={() => setFilter('All')}
                >
                  <span className="btn-icon">📋</span>
                  <span className="btn-text">Xem tất cả blog</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="blogs-grid">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className={`enhanced-blog-card ${blog.status} ${bulkActionMode ? 'bulk-mode' : ''} ${selectedCards.has(blog.id) ? 'selected' : ''}`}
                onClick={() => handleBlogClick(blog)}
                onMouseEnter={() => setHoveredCard(blog.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Selection checkbox for bulk mode */}
                {bulkActionMode && (
                  <div className="selection-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCards.has(blog.id)}
                      onChange={() => handleCardSelect(blog.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

                <div className="blog-card-header">
                  <div className="blog-image-placeholder">
                    {blog.images && blog.images.length > 0 ? (
                      <img src={blog.images[0]} alt={blog.title} />
                    ) : (
                      <div className="placeholder-content">
                        <span className="placeholder-icon">📝</span>
                      </div>
                    )}
                    <div
                      className={`status-badge enhanced-status-${blog.status}`}
                    >
                      <span className="status-icon">
                        {blog.status === 'true' || blog.status === true
                          ? '✅'
                          : '⏳'}
                      </span>
                      <span className="status-text">
                        {blog.status === 'true' || blog.status === true
                          ? 'Đã duyệt'
                          : 'Chờ duyệt'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="blog-card-content">
                  <div className="blog-meta-info">
                    <span className="blog-major">{blog.major}</span>
                    <span className="blog-date">
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>

                  <h3 className="blog-title">{blog.title}</h3>

                  <p className="blog-excerpt">
                    {blog.content.substring(0, 120)}...
                  </p>

                  {/* Preview on hover */}
                  {hoveredCard === blog.id && (
                    <div className="hover-preview">
                      <div className="preview-content">
                        <p>{blog.content.substring(0, 250)}...</p>
                      </div>
                    </div>
                  )}
                </div>

                {!bulkActionMode && (
                  <div className="blog-card-actions">
                    <button
                      className="action-btn view-btn"
                      onClick={() => handleBlogClick(blog)}
                      title="Xem chi tiết"
                    >
                      <span className="btn-icon">👁️</span>
                      <span className="btn-text">Xem chi tiết</span>
                    </button>

                    <div className="action-group">
                      <button
                        className="action-btn edit-btn"
                        onClick={(e) => handleEditBlog(blog, e)}
                        title="Chỉnh sửa"
                        onMouseEnter={(e) =>
                          showTooltipHelper('Chỉnh sửa blog', e)
                        }
                        onMouseLeave={hideTooltip}
                      >
                        <span className="btn-icon">✏️</span>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={(e) => handleDeleteBlog(blog.id, e)}
                        title="Xóa blog"
                        onMouseEnter={(e) => showTooltipHelper('Xóa blog', e)}
                        onMouseLeave={hideTooltip}
                      >
                        <span className="btn-icon">🗑️</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Quick Create Action */}
      <div className="floating-action">
        <button
          className="floating-create-btn"
          onClick={handleCreateBlog}
          title="Tạo blog mới"
          onMouseEnter={(e) => showTooltipHelper('Tạo blog mới (Ctrl + N)', e)}
          onMouseLeave={hideTooltip}
        >
          <span className="fab-icon">✨</span>
        </button>
      </div>

      {/* Custom Tooltip */}
      {showTooltip.show && (
        <div
          className="custom-tooltip"
          style={{
            position: 'fixed',
            left: showTooltip.position.x + 10,
            top: showTooltip.position.y - 30,
            zIndex: 10000,
          }}
        >
          {showTooltip.text}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Đang xử lý...</span>
          </div>
        </div>
      )}

      {/* Blog Detail Modal */}
      {showBlogModal && (
        <BlogModal
          blog={selectedBlog}
          onClose={() => setShowBlogModal(false)}
          onEdit={() => {
            setShowBlogModal(false);
            handleEditBlog(selectedBlog, { stopPropagation: () => {} });
          }}
        />
      )}

      {/* Blog Create/Edit Modal */}
      {showCreateModal && (
        <BlogFormModal
          blog={isEditing ? selectedBlog : null}
          majors={majors.map((m) => m.name)}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleBlogSubmit}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default ConsultantBlog;
