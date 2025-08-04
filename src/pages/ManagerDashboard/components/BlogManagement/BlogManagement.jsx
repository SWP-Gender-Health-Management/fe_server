import React, { useState, useEffect } from 'react';
import './BlogManagement.css';
import axios from 'axios';
import Cookies from 'js-cookie';



const API_URL = 'http://localhost:3000';


const BlogManagement = () => {


  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(5);
  const [searchBy, setSearchBy] = useState('title');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [totalPages, setTotalPages] = useState(1);
  const [newStatus, setNewStatus] = useState(false);

  const statusSelectOptions = [
    { value: 'false', label: 'Chờ duyệt' },
    { value: 'true', label: 'Đã duyệt' },
  ];

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  // useEffect(() => {
  //   filterBlogs();
  //   setCurrentPage(1); // Reset to first page when filter changes
  // }, [blogs, selectedStatus, searchTerm, searchBy]);
  const fetchBlogs = async () => {
    const accessToken = Cookies.get('accessToken');
    const accountId = Cookies.get('accountId');
    try {
      await axios
        .get(`${API_URL}/manager/get-blogs`, {
          params: {
            page: currentPage,
            limit: blogsPerPage,
            status: selectedStatus,
            [searchBy]: searchTerm.trim(),
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          const data = response.data.result;
          console.log('Fetched manager blogs:', data);
          setBlogs(data.result || []);
          setFilteredBlogs(data.result || []);
          setTotalPages(data.totalPage || 1);
        });
    } catch (error) {
      console.error('Error fetching manager blogs:', error);
      setBlogs([]);
      setFilteredBlogs([]);
    }
  };


  // Get current blogs for pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  // const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);


  const getStatusBadge = (status) => {
    console.log("status", status);
    const statusConfig = {
      false: { label: 'Chờ duyệt', class: 'status-pending' },
      true: { label: 'Đã duyệt', class: 'status-approved' },
    };

    const config = statusConfig[status] || {
      label: status,
      class: 'status-default',
    };
    return (
      <span className={`status-badge-manager ${config.class}`}>{config.label}</span>
    );
  };

  const handleStatusChange = async (blogId, newStatus) => {
    const accessToken = Cookies.get('accessToken');
    const accountId = Cookies.get('accountId');
    try {
      await axios.put(
        `${API_URL}/manager/set-blog-status`,
        { blog_id: blogId, status: newStatus },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      ).then((response) => {
        console.log('Blog status updated:', response.data);
        fetchBlogs();
      });
    } catch (error) {
      console.error('Error updating blog status:', error);
    }
  };

  const handleViewBlog = (blog) => {
    setNewStatus(blog.status)
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="blog-management">
      <div className="blog-header">
        <h1>Quản lý bài viết</h1>
        <p>Xem và quản lý tất cả bài viết trong hệ thống</p>
      </div>

      {/* Filters */}
      <div className="blog-filters">
        <div className="search-filter">
          <div className="search-controls">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="search-by-select"
            >
              <option value="title">Tiêu đề</option>
              <option value="author">Tác giả</option>
              <option value="category">Danh mục</option>
            </select>
            <input
              type="text"
              placeholder={`Tìm kiếm theo ${searchBy === 'title' ? 'tiêu đề' : searchBy === 'author' ? 'tác giả' : 'danh mục'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="category-select"
            >
              <option value="all">Tất cả</option>
              <option value="true">Đã duyệt</option>
              <option value="false">Chưa duyệt</option>
            </select>
          </div>
          <button
            className="btn-search"
            onClick={async () => {
              await setCurrentPage(1);
              await fetchBlogs();
            }}
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Blog Table */}
      <div className="blog-table-container">
        <table className="blog-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr key={blog.blog_id}>
                <td>
                  <div className="blog-title">
                    <h4>{blog.title}</h4>
                    <p className="blog-excerpt">{blog.title}</p>
                  </div>
                </td>
                <td>{blog.author}</td>
                <td>
                  <span className="category-tag">{blog.major}</span>
                </td>
                <td>
                  <div className="status-cell">
                    {getStatusBadge(blog.status.toString())}
                    {/* <select
                      value={blog.status}
                      onChange={(e) =>
                        handleStatusChange(blog.blog_id, e.target.value)
                      }
                      className="status-select"
                    >
                      {statusSelectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select> */}
                  </div>
                </td>
                <td>{formatDate(blog.created_at)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewBlog(blog)}
                    >
                      Xem
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBlogs.length === 0 && (
          <div className="no-results">
            <p>Không tìm thấy bài viết nào phù hợp với bộ lọc</p>
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            Trang {currentPage} của {totalPages}
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              Đầu
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? 'active' : ''}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Cuối
            </button>
          </div>
        </div>
      </div>

      {/* Blog Detail Modal */}
      {showModal && selectedBlog && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedBlog.title}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="blog-meta">
                <p>
                  <strong>Tác giả:</strong> {selectedBlog.author}
                </p>
                <p>
                  <strong>Danh mục:</strong> {selectedBlog.major}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{' '}
                  {getStatusBadge(selectedBlog.status.toString())}
                </p>
                <p>
                  <strong>Ngày tạo:</strong>{' '}
                  {formatDate(selectedBlog.created_at)}
                </p>
                {/* <p>
                  <strong>Lần cập nhật cuối:</strong>{' '}
                  {formatDate(selectedBlog.updatedAt)}
                </p> */}
                {/* <p>
                  <strong>Lượt xem:</strong>{' '}
                  {selectedBlog.views.toLocaleString()}
                </p> */}
                {selectedBlog.rejectionReason && (
                  <p>
                    <strong>Lý do từ chối:</strong>{' '}
                    {selectedBlog.rejectionReason}
                  </p>
                )}
              </div>
              <div className="blog-content">
                <h3>Nội dung:</h3>
                <p>{selectedBlog.content}</p>
              </div>
            </div>
            <div className="modal-footer">
              <div className="status-change">
                <label htmlFor="blog-status">Thay đổi trạng thái:</label>
                <select
                  id="blog-status"
                  value={newStatus}
                  onChange={(e) => {
                    setNewStatus(e.target.value);
                  }}
                  className="status-select modal-status-select"
                >
                  {statusSelectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  className="btn-save-status"
                  onClick={async () => {
                    await handleStatusChange(selectedBlog.blog_id, newStatus);
                    setShowModal(false);
                  }}
                >
                  Lưu & Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
