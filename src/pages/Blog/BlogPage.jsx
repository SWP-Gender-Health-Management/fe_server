import React, { useState } from 'react';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import './BlogPage.css';

const posts = [
  // Bệnh nữ khoa
  {
    id: 1,
    title: 'Viêm âm đạo: Nguyên nhân, triệu chứng và cách điều trị hiệu quả',
    excerpt:
      'Viêm âm đạo là bệnh phụ khoa phổ biến ở phụ nữ. Hiểu rõ nguyên nhân và cách điều trị để bảo vệ sức khỏe sinh sản.',
    category: 'Bệnh nữ khoa',
    time: '2 ngày trước',
    readTime: '5 phút đọc',
    author: 'BS. Nguyễn Thị Hạnh',
    views: '2.3k',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
    tags: ['Viêm âm đạo', 'Phụ khoa', 'Điều trị'],
  },
  {
    id: 2,
    title: 'Rối loạn kinh nguyệt: Dấu hiệu cảnh báo không thể bỏ qua',
    excerpt:
      'Kinh nguyệt không đều có thể là dấu hiệu của nhiều vấn đề sức khỏe nghiêm trọng. Tìm hiểu khi nào cần đi khám.',
    category: 'Bệnh nữ khoa',
    time: '1 ngày trước',
    readTime: '4 phút đọc',
    author: 'BS. Lê Thị Mai',
    views: '1.8k',
    img: 'https://images.unsplash.com/photo-1594824154122-864b3c99f1a0?w=600',
    tags: ['Kinh nguyệt', 'Rối loạn', 'Hormone'],
  },
  {
    id: 3,
    title: 'U xơ tử cung: Những điều phụ nữ cần biết để phòng tránh',
    excerpt:
      'U xơ tử cung ảnh hưởng đến khả năng sinh sản. Khám phá các phương pháp phòng ngừa và điều trị hiện đại.',
    category: 'Bệnh nữ khoa',
    time: '3 ngày trước',
    readTime: '7 phút đọc',
    author: 'BS. Trần Minh Châu',
    views: '3.1k',
    img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600',
    tags: ['U xơ tử cung', 'Sinh sản', 'Phòng ngừa'],
  },

  // Bệnh nam khoa
  {
    id: 4,
    title: 'Yếu sinh lý nam giới: Nguyên nhân và giải pháp điều trị',
    excerpt:
      'Rối loạn cương dương ảnh hưởng đến chất lượng cuộc sống. Tìm hiểu các phương pháp điều trị an toàn và hiệu quả.',
    category: 'Bệnh nam khoa',
    time: '1 ngày trước',
    readTime: '6 phút đọc',
    author: 'BS. Phạm Văn Đức',
    views: '4.2k',
    img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600',
    tags: ['Sinh lý nam', 'ED', 'Điều trị'],
  },
  {
    id: 5,
    title: 'Viêm tuyến tiền liệt: Triệu chứng và cách phòng ngừa',
    excerpt:
      'Viêm tuyến tiền liệt ngày càng phổ biến ở nam giới trẻ. Nhận biết sớm để có phương pháp điều trị kịp thời.',
    category: 'Bệnh nam khoa',
    time: '4 ngày trước',
    readTime: '5 phút đọc',
    author: 'BS. Hoàng Minh Tuấn',
    views: '2.9k',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600',
    tags: ['Tuyến tiền liệt', 'Viêm nhiễm', 'Nam khoa'],
  },
  {
    id: 6,
    title: 'Vô sinh nam: Nguyên nhân và phương pháp hỗ trợ sinh sản',
    excerpt:
      'Vô sinh nam chiếm 40% các trường hợp vô sinh. Tìm hiểu về các kỹ thuật hỗ trợ sinh sản hiện đại.',
    category: 'Bệnh nam khoa',
    time: '5 ngày trước',
    readTime: '8 phút đọc',
    author: 'BS. Nguyễn Văn Thành',
    views: '3.7k',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600',
    tags: ['Vô sinh', 'Sinh sản', 'IVF'],
  },

  // Bệnh lây qua đường tình dục
  {
    id: 7,
    title: 'HIV/AIDS: Phòng ngừa và điều trị trong thời đại mới',
    excerpt:
      'Những tiến bộ mới trong điều trị HIV giúp người bệnh sống khỏe mạnh. Cập nhật kiến thức về phòng chống HIV.',
    category: 'Bệnh tình dục',
    time: '2 ngày trước',
    readTime: '6 phút đọc',
    author: 'BS. Lê Văn Hải',
    views: '5.1k',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
    tags: ['HIV', 'AIDS', 'Phòng ngừa'],
  },
  {
    id: 8,
    title: 'Giang mai: Triệu chứng, chẩn đoán và điều trị',
    excerpt:
      'Giang mai có thể điều trị khỏi hoàn toàn nếu phát hiện sớm. Tìm hiểu về các giai đoạn và phương pháp điều trị.',
    category: 'Bệnh tình dục',
    time: '3 ngày trước',
    readTime: '4 phút đọc',
    author: 'BS. Trần Thị Lan',
    views: '2.8k',
    img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600',
    tags: ['Giang mai', 'STD', 'Chẩn đoán'],
  },
  {
    id: 9,
    title: 'HPV và ung thư cổ tử cung: Tầm soát và phòng ngừa',
    excerpt:
      'Virus HPV là nguyên nhân chính gây ung thư cổ tử cung. Vaccine HPV có thể phòng ngừa hiệu quả.',
    category: 'Bệnh tình dục',
    time: '1 tuần trước',
    readTime: '7 phút đọc',
    author: 'BS. Phạm Thị Hương',
    views: '4.6k',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600',
    tags: ['HPV', 'Ung thư', 'Vaccine'],
  },
  {
    id: 10,
    title: 'Lậu và chlamydia: Hai bệnh tình dục thầm lặng',
    excerpt:
      'Nhiều trường hợp lậu và chlamydia không có triệu chứng rõ ràng, dẫn đến biến chứng nghiêm trọng.',
    category: 'Bệnh tình dục',
    time: '1 tuần trước',
    readTime: '5 phút đọc',
    author: 'BS. Đỗ Văn Nam',
    views: '3.4k',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600',
    tags: ['Lậu', 'Chlamydia', 'STI'],
  },
];

const categories = [
  { id: 'all', name: 'Tất cả', icon: '📰', count: posts.length },
  {
    id: 'Bệnh nữ khoa',
    name: 'Bệnh nữ khoa',
    icon: '🌸',
    count: posts.filter((p) => p.category === 'Bệnh nữ khoa').length,
  },
  {
    id: 'Bệnh nam khoa',
    name: 'Bệnh nam khoa',
    icon: '👨‍⚕️',
    count: posts.filter((p) => p.category === 'Bệnh nam khoa').length,
  },
  {
    id: 'Bệnh tình dục',
    name: 'Bệnh tình dục',
    icon: '🛡️',
    count: posts.filter((p) => p.category === 'Bệnh tình dục').length,
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts = posts.filter(
    (post) =>
      (selectedCategory === 'all' || post.category === selectedCategory) &&
      (post.title.toLowerCase().includes(searchText.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchText.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchText.toLowerCase())
        ))
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const featuredPost = posts[0];

  return (
    <div>
      <div className="blog-container">
        <div className="sidebar">
          <h2 className="sidebar-title">Phân loại</h2>
          <ul className="category-list">
            {categories.map((category) => (
              <li
                key={category}
                className={`category-item ${
                  selectedCategory === category ? 'active' : ''
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
        <div className="main-content">
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
            <Button className="hero-search-btn">
              <i className="search-icon">🔍</i>
            </Button>
          </div>
        </div>
      </div>

      <div className="blog-container">
        {/* Sidebar */}
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

          {/* Featured Post */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Bài viết nổi bật</h3>
            <div className="featured-post">
              <img
                src={featuredPost.img}
                alt={featuredPost.title}
                className="featured-img"
              />
              <div className="featured-content">
                <span className="featured-category">
                  {featuredPost.category}
                </span>
                <h4 className="featured-title">{featuredPost.title}</h4>
                <div className="featured-meta">
                  <span className="featured-author">{featuredPost.author}</span>
                  <span className="featured-views">
                    {featuredPost.views} lượt xem
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Đăng ký nhận tin</h3>
            <p className="newsletter-text">
              Nhận tin tức sức khỏe mới nhất qua email
            </p>
            <div className="newsletter-form">
              <Input placeholder="Email của bạn" className="newsletter-input" />
              <Button className="newsletter-btn">Đăng ký</Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="blog-main">
          <div className="blog-header">
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
                <article key={post.id} className="blog-card">
                  <div className="card-image">
                    <img src={post.img} alt={post.title} />
                    <div className="card-overlay">
                      <span className="card-category">{post.category}</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="card-meta">
                      <span className="card-author">{post.author}</span>
                      <span className="meta-divider">•</span>
                      <span className="card-time">{post.time}</span>
                      <span className="meta-divider">•</span>
                      <span className="card-read-time">{post.readTime}</span>
                    </div>
                    <h3 className="card-title">{post.title}</h3>
                    <p className="card-excerpt">{post.excerpt}</p>
                    <div className="card-footer">
                      <div className="card-tags">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="card-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="card-stats">
                        <span className="card-views">👁️ {post.views}</span>
                      </div>
                    </div>
                    <Button className="read-more-btn">Đọc tiếp</Button>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="pagination-btn"
              >
                Trước
              </Button>
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="pagination-btn"
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
