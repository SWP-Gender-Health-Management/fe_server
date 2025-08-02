import React, { useEffect, useState } from 'react';
import api from '@/api/api';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { useNavigate } from 'react-router-dom';
import './BlogPage.css';

const API_BASE = 'http://localhost:3000';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchAllBlogs = async () => {
    try {
      const res = await api.get('/blog/get-all-blogs');
      setBlogs(res.data.result || []);
    } catch (err) {
      console.error(err);
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

  // const featuredPost = blogs[0];

  return (
    <div className="blog-page">
      <div className="blog-container">
        <aside className="blog-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Chuyên mục</h3>
            <div className="category-list">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`category-item ${
                    selectedCategory === category.id ? 'active' : ''
                  }`}
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

          {/* {featuredPost && (
            <div className="sidebar-section">
              <h3 className="sidebar-title">Bài viết nổi bật</h3>
              <div
                className="featured-post"
                onClick={() => navigate(`/tin-tuc/${featuredPost.blog_id}`)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={
                    featuredPost?.images?.[0] ||
                    'https://via.placeholder.com/300x200?text=Không+có+hình+ảnh'
                  }
                  alt={featuredPost.title}
                  className="featured-img"
                />
                <div className="featured-content">
                  <span className="featured-category">
                    {featuredPost.major}
                  </span>
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
          )} */}
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
                aria-label="Tìm kiếm bài viết"
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
                  <div
                    className="card-image"
                    onClick={() => navigate(`/tin-tuc/${post.blog_id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={
                        post?.images?.[0] ||
                        'https://via.placeholder.com/300x200?text=Không+có+hình+ảnh'
                      }
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
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </span>
                      <span className="meta-divider">•</span>
                      <span className="card-read-time">
                        {(post.content.length / 500).toFixed(0)} phút đọc
                      </span>
                    </div>
                    <h3
                      className="card-title"
                      onClick={() => navigate(`/tin-tuc/${post.blog_id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {post.title}
                    </h3>
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
                        <span className="card-views">
                          👁️ {post.views || '0'}
                        </span>
                      </div>
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
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Trước
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`pagination-number ${
                    currentPage === i + 1 ? 'active' : ''
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <Button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
