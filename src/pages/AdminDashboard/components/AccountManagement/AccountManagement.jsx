import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserModal from '../UserModal/UserModal';
import './AccountManagement.css';

const AccountManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, edit, view
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Mock data - trong thực tế sẽ fetch từ API
  useEffect(() => {
    const mockUsers = [
      {
        account_id: 1,
        full_name: 'Nguyễn Văn An',
        email: 'nguyen.van.an@email.com',
        avatar: null,
        role: 'ADMIN',
        is_banned: true,
        created_at: '2024-01-15',
      }
    ];

    // Generate more mock users
    const additionalUsers = Array.from({ length: 20 }, (_, index) => ({
      account_id: index + 6,
      full_name: `Người dùng ${index + 6}`,
      email: `user${index + 6}@example.com`,
      avatar: null,
      role: ['ADMIN', 'MANAGER', 'CUSTOMER', 'CONSULTANT', 'STAFF'][Math.floor(Math.random() * 3)],
      is_banned: [true, false][Math.floor(Math.random() * 2)],
      created_at: new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split('T')[0],
    }));

    const allUsers = [...mockUsers, ...additionalUsers];
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => `${user.is_banned}` === statusFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter, users]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle user actions
  const handleCreateUser = () => {
    navigate('/admin/users');
  };

  const handleViewUser = (user) => {
    setModalMode('view');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.account_id !== userToDelete.account_id));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleToggleStatus = (user) => {
    const updatedUsers = users.map((u) =>
      u.account_id === user.account_id
        ? { ...u, is_banned: u.is_banned === true ? false : true }
        : u
    );
    setUsers(updatedUsers);
  };

  const handleResetPassword = (user) => {
    alert(`Đặt lại mật khẩu cho ${user.full_name}`);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((user) => user.account_id));
    }
  };

  const getStatusBadge = (is_banned) => {
    return (
      <span className={`status-badge ${is_banned ? 'banned' : 'active'}`}>
        {is_banned ? 'Bị khóa' : 'Hoạt động'}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      ADMIN: 'admin',
      MANGER: 'admin',
      CONSULTANT: 'manager',
      STAFF: 'manager',
      CUSTOMER: 'user',
    };
    return <span className={`role-badge ${roleColors[role]}`}>{role}</span>;
  };

  const getAvatar = (user) => {
    if (user.avatar) {
      return <img src={user.avatar} alt={user.full_name} className="user-avatar" />;
    }
    return (
      <div className="user-avatar-placeholder">
        {user.full_name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="account-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Quản lý tài khoản</h1>
          <p>Quản lý người dùng và phân quyền trong hệ thống</p>
        </div>
        <button className="create-btn" onClick={handleCreateUser}>
          <span className="btn-icon">+</span>
          Thêm tài khoản mới
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Vai trò:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="CUSTOMER">Customer</option>
              <option value="CONSULTANT">Consultant</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Trạng thái:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value={false}>Hoạt động</option>
              <option value={true}>Bị khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results summary */}
      <div className="results-summary">
        Hiển thị {startIndex + 1}-
        {Math.min(startIndex + itemsPerPage, filteredUsers.length)} trong tổng
        số {filteredUsers.length} người dùng
        {selectedUsers.length > 0 && (
          <span className="selection-info">
            ({selectedUsers.length} đã chọn)
          </span>
        )}
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              {/* <th>
                <input
                  type="checkbox"
                  checked={
                    selectedUsers.length === paginatedUsers.length &&
                    paginatedUsers.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th> */}
              <th>Thông tin người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Ngày tham gia</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user.account_id}
                className={selectedUsers.includes(user.account_id) ? 'selected' : ''}
              >
                {/* <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.account_id)}
                    onChange={() => handleSelectUser(user.account_id)}
                  />
                </td> */}
                <td>
                  <div className="user-info">
                    {getAvatar(user)}
                    <div className="user-details">
                      <div className="user-name">{user.full_name}</div>
                      <div className="user-id">ID: {user.account_id}</div>
                    </div>
                  </div>
                </td>
                <td className="email-cell">{user.email}</td>
                <td>{getRoleBadge(user.role)}</td>
                <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                <td>{getStatusBadge(user.is_banned)}</td>
                <td>
                  <div className="actions-dropdown">
                    <button className="actions-btn">⋮</button>
                    <div className="dropdown-menu">
                      <button onClick={() => handleViewUser(user)}>
                        👁 Xem chi tiết
                      </button>
                      <button onClick={() => handleResetPassword(user)}>
                        🔑 Đặt lại mật khẩu
                      </button>
                      <button onClick={() => handleToggleStatus(user)}>
                        {user.is_banned === false
                          ? '🔒 Khóa tài khoản'
                          : '🔓 Mở khóa tài khoản'}
                      </button>
                      {user.role !== 'Admin' && (
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="delete-action"
                        >
                          🗑 Xóa
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          Trang {currentPage} của {totalPages}
        </div>
        <div className="pagination-controls">
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
        </div>
      </div>

      {/* User Modal */}
      {showModal && (
        <UserModal
          mode={modalMode}
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={(updatedUser) => {
            if (modalMode === 'edit') {
              setUsers(
                users.map((u) => (u.account_id === updatedUser.account_id ? updatedUser : u))
              );
            }
            setShowModal(false);
          }}
          onEdit={() => setModalMode('edit')}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Xác nhận xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa người dùng{' '}
              <strong>{userToDelete?.full_name}</strong>?
            </p>
            <p className="warning">Hành động này không thể hoàn tác!</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Hủy
              </button>
              <button className="delete-btn" onClick={confirmDelete}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
