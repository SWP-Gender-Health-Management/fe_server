import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api/api';
import './BlogDetailPage.css';

function BlogDetailPage() {
  const { blog_id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogById = async () => {
      try {
        const res = await api.get(`/blog/get-blog-by-id/${blog_id}`);
        setBlog(res.data.result);
      } catch (err) {
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogById();
  }, [blog_id]);

  if (loading) return <p>Đang tải...</p>;
  if (!blog) return <p>Không tìm thấy bài viết</p>;

  return (
    <div className="blog-detail-wrapper">
      <div className="blog-detail-content">
        <h1 className="blog-detail-title">{blog.title}</h1>
        <div className="blog-detail-img">
          <img
            src={
              blog.images ||
              'https://via.placeholder.com/300x200?text=Không+có+hình+ảnh'
            }
            alt="Ảnh bài viết"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>{' '}
        <div className="blog-detail-meta">
          <span className="blog-detail-major">Chuyên khoa: {blog.major}</span>
          <span className="blog-detail-date">
            Ngày tạo: {new Date(blog.created_at).toLocaleString()}
          </span>
        </div>
        <div
          className="blog-detail-body"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        <div className="blog-detail-author">
          <strong>Tác giả:</strong> {blog.account.full_name}
          <br />
          <strong>Email:</strong> {blog.account.email}
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
