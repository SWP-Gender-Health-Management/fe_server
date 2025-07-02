import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import './BlogPage.css';

const API_BASE = 'http://localhost:3000';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    major: '',
    status: true,
    images: [],
  });
  const [editingBlog, setEditingBlog] = useState(null);

  const fetchAllBlogs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/blog/get-all-blogs`);
      setBlogs(res.data.result || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBlog = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn không thể thực hiện hành động này.');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('content', formData.content);
      payload.append('major', formData.major);
      payload.append('status', formData.status);
      for (let file of formData.images) {
        payload.append('images', file);
      }

      await axios.post(`${API_BASE}/blog/create-blog`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setShowForm(false);
      setFormData({
        title: '',
        content: '',
        major: '',
        status: true,
        images: [],
      });
      fetchAllBlogs();
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn không thể thực hiện hành động này.');
      return;
    }

    try {
      await axios.delete(`${API_BASE}/blog/delete-blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchAllBlogs();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleUpdateBlog = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn không thể thực hiện hành động này.');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('content', formData.content);
      payload.append('major', formData.major);
      payload.append('status', formData.status);
      for (let file of formData.images) {
        payload.append('images', file);
      }

      await axios.put(
        `${API_BASE}/blog/update-blog/${editingBlog.blog_id}`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowForm(false);
      setFormData({
        title: '',
        content: '',
        major: '',
        status: true,
        images: [],
      });
      setEditingBlog(null);
      fetchAllBlogs();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const filteredPosts = blogs.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || post.major === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const postsPerPage = 6;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const categories = [
    { id: 'all', name: 'Tất cả', icon: '📚', count: blogs.length },
    ...Array.from(new Set(blogs.map((b) => b.major))).map((major) => ({
      id: major,
      name: major,
      icon: '📌',
      count: blogs.filter((b) => b.major === major).length,
    })),
  ];

  const featuredPost = blogs[0];

  return (
    <div className="blog-container">
      <aside className="blog-sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Chuyên mục</h3>
          <div className="category-list">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentPage(1);
                }}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">({category.count})</span>
              </div>
            ))}
          </div>
        </div>

        {featuredPost && (
          <div className="sidebar-section">
            <h3 className="sidebar-title">Bài viết nổi bật</h3>
            <div className="featured-post">
              <img
                src={featuredPost?.images?.[0]}
                alt={featuredPost.title}
                className="featured-img"
              />
              <div className="featured-content">
                <span className="featured-category">{featuredPost.major}</span>
                <h4 className="featured-title">{featuredPost.title}</h4>
                <div className="featured-meta">
                  <span className="featured-author">
                    {featuredPost.author || 'Ẩn danh'}
                  </span>
                  <span className="featured-views">
                    {featuredPost.views || 0} lượt xem
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sidebar-section">
          <h3 className="sidebar-title">Đăng bài</h3>
          <Button onClick={() => setShowForm(true)} className="newsletter-btn">
            + Bài viết mới
          </Button>
        </div>
      </aside>

      <main className="blog-main">
        <div className="blog-header">
          <h1 className="page-title">Tin tức</h1>
          <div className="search-bar">
            <Input
              type="text"
              placeholder="Tìm kiếm bài viết, chủ đề..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="hero-search-input"
            />
            <Button className="hero-search-btn">🔍</Button>
          </div>
          <div className="blog-stats">
            <span className="stats-text">
              Tìm thấy <strong>{filteredPosts.length}</strong> bài viết
              {selectedCategory !== 'all' &&
                ` trong "${categories.find((c) => c.id === selectedCategory)?.name}"`}
            </span>
          </div>
        </div>

        {currentPosts.length > 0 ? (
          <div className="blog-grid">
            {currentPosts.map((post) => (
              <article key={post.blog_id} className="blog-card">
                <div className="card-image">
                  <img
                    src={post?.images?.[0]}
                    alt={post.title}
                    className="featured-img"
                  />
                  <div className="card-overlay">
                    <span className="card-category">{post.major}</span>
                  </div>
                </div>
                <div className="card-content">
                  <div className="card-meta">
                    <span className="card-author">
                      {post.author || 'Ẩn danh'}
                    </span>
                    <span className="meta-divider">•</span>
                    <span className="card-time">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="meta-divider">•</span>
                    <span className="card-read-time">
                      {(post.content.length / 500).toFixed(0)} phút đọc
                    </span>
                  </div>
                  <h3 className="card-title">{post.title}</h3>
                  <p className="card-excerpt">
                    {post.content.slice(0, 100)}...
                  </p>
                  <div className="card-footer">
                    <div className="card-tags">
                      {(post.tags || ['#Blog'])
                        .slice(0, 2)
                        .map((tag, index) => (
                          <span key={index} className="card-tag">
                            #{tag}
                          </span>
                        ))}
                    </div>
                    <div className="card-stats">
                      <span className="card-views">👁️ {post.views || '0'}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <Button onClick={() => handleUpdateBlog(post)}>📝</Button>
                    <Button onClick={() => handleDelete(post.blog_id)}>
                      🗑️
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>Không tìm thấy bài viết</h3>
            <p>Thử thay đổi từ khóa tìm kiếm hoặc chọn chuyên mục khác</p>
            <Button
              onClick={() => {
                setSearchText('');
                setSelectedCategory('all');
              }}
            >
              Xem tất cả bài viết
            </Button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Trước
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau
            </Button>
          </div>
        )}

        {showForm && (
          <div className="blog-form-modal">
            <div className="blog-form">
              <h3>{editingBlog ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h3>

              <div className="blog-form-group">
                <label className="blog-form-label">Tiêu đề</label>
                <input
                  className="blog-form-input"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>

              <div className="blog-form-group">
                <label className="blog-form-label">Chuyên mục</label>
                <input
                  className="blog-form-input"
                  value={formData.major}
                  onChange={(e) =>
                    setFormData({ ...formData, major: e.target.value })
                  }
                  placeholder="Ví dụ: Tin tức, Kỹ thuật, Sức khỏe..."
                />
              </div>

              <div className="blog-form-group">
                <label className="blog-form-label">Nội dung</label>
                <textarea
                  className="blog-form-textarea"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Nhập nội dung bài viết..."
                />
              </div>

              <div className="blog-form-group">
                <label className="blog-form-label">
                  Hình ảnh (có thể chọn nhiều)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setFormData({ ...formData, images: [...e.target.files] })
                  }
                />
              </div>

              <div className="form-buttons">
                <button
                  onClick={editingBlog ? handleUpdateBlog : handleCreateBlog}
                >
                  {editingBlog ? 'Lưu chỉnh sửa' : 'Đăng bài'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingBlog(null);
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
