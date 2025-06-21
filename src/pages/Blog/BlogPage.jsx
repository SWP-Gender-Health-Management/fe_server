import React, { useState } from 'react';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import './BlogPage.css';

const posts = [
  {
    id: 1,
    title: 'Top những thực phẩm không tốt cho tinh trùng nam giới cần tránh',
    tag: 'Nam khoa',
    time: '2 ngày trước',
    img: 'https://source.unsplash.com/featured/?health,man',
  },
  {
    id: 2,
    title: 'Có nên tự điều hòa kinh nguyệt tại nhà không?',
    tag: 'Phụ khoa',
    time: '2 giờ trước',
    img: 'https://source.unsplash.com/featured/?health,woman',
  },
  {
    id: 3,
    title: 'Làm sao để có kinh nguyệt trở lại đều đặn?',
    tag: 'Phụ khoa',
    time: '2 giờ trước',
    img: 'https://source.unsplash.com/featured/?menstruation',
  },
  {
    id: 4,
    title: 'Kinh nguyệt màu đen có sao không? Kinh nguyệt màu đen',
    tag: 'Phụ khoa',
    time: '2 ngày trước',
    img: 'https://source.unsplash.com/featured/?women,healthcare',
  },
  {
    id: 5,
    title:
      'Bao nhiêu tinh trùng mới có thai? Cách cải thiện chất lượng tinh trùng',
    tag: 'Nam khoa',
    time: '2 ngày trước',
    img: 'https://source.unsplash.com/featured/?sperm',
  },
  {
    id: 6,
    title: 'Chụp X quang có ảnh hưởng đến tinh trùng không?',
    tag: 'Nam khoa',
    time: '2 ngày trước',
    img: 'https://source.unsplash.com/featured/?xray',
  },
];

const categories = ['Tất cả', 'Phụ khoa', 'Nam khoa'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  const filteredPosts = posts.filter(
    (post) =>
      (selectedCategory === 'Tất cả' || post.tag === selectedCategory) &&
      post.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

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
              placeholder="Tìm bài viết..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
            <Button onClick={() => setSearchText('')}>Xóa</Button>
          </div>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <div key={post.id} className="blog-post">
                <img src={post.img} alt={post.title} className="post-image" />
                <div className="post-content">
                  <div className="post-meta">
                    <span className="post-tag">{post.tag}</span> •{' '}
                    <span className="post-time">{post.time}</span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                </div>
              </div>
            ))
          ) : (
            <p>Không tìm thấy bài viết nào phù hợp.</p>
          )}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
