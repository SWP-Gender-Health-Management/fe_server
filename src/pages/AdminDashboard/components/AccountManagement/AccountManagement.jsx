import React, { useState, useEffect } from 'react';
import { Await, useNavigate } from 'react-router-dom';
import UserModal from '../UserModal/UserModal';
import './AccountManagement.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000';


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
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Mock data - trong thực tế sẽ fetch từ API
  // useEffect(() => {
  //   const mockUsers = [
  //     {
  //       account_id: 1,
  //       full_name: 'Nguyễn Văn An',
  //       email: 'nguyen.van.an@email.com',
  //       avatar: null,
  //       role: 'ADMIN',
  //       is_banned: true,
  //       created_at: '2024-01-15',
  //     }
  //   ];

  //   // Generate more mock users
  //   const additionalUsers = Array.from({ length: 20 }, (_, index) => ({
  //     account_id: index + 6,
  //     full_name: `Người dùng ${index + 6}`,
  //     email: `user${index + 6}@example.com`,
  //     avatar: null,
  //     role: ['ADMIN', 'MANAGER', 'CUSTOMER', 'CONSULTANT', 'STAFF'][Math.floor(Math.random() * 3)],
  //     is_banned: [true, false][Math.floor(Math.random() * 2)],
  //     created_at: new Date(
  //       2024,
  //       Math.floor(Math.random() * 12),
  //       Math.floor(Math.random() * 28) + 1
  //     )
  //       .toISOString()
  //       .split('T')[0],
  //   }));

  //   const allUsers = [...mockUsers, ...additionalUsers];
  //   setUsers(allUsers);
  //   setFilteredUsers(allUsers);
  // }, []);

  useEffect(() => {
    fetchAccounts();
  }, [currentPage, roleFilter, statusFilter])

  const fetchAccounts = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const accountId = Cookies.get('accountId');
      await axios.get(`${API_URL}/admin/get-accounts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          limit: itemsPerPage,
          page: currentPage,
          role: roleFilter,
          banned: statusFilter
        },
      }).then(async (response) => {
        const { accounts, totalItems, totalPages } = await response.data.data;
        // console.log("fetchAccounts response: ", { accounts, totalItems, totalPages });
        setUsers(accounts || []);
        setTotalItems(totalItems || 0);
        setTotalPages(totalPages || 0);
      });


    } catch (error) {
      console.error('fetchAccounts error: ', error);
      setUsers([]);
    }
  }

  // Filter and search logic
  // useEffect(() => {
  //   let filtered = users;

  //   // Search filter
  //   if (searchTerm) {
  //     filtered = filtered.filter(
  //       (user) =>
  //         user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         user.email.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }

  //   // Role filter
  //   if (roleFilter !== 'all') {
  //     filtered = filtered.filter((user) => user.role === roleFilter);
  //   }

  //   // Status filter
  //   if (statusFilter !== 'all') {
  //     filtered = filtered.filter((user) => `${user.is_banned}` === statusFilter);
  //   }

  //   setFilteredUsers(filtered);
  //   setCurrentPage(1);

  // }, [searchTerm, roleFilter, statusFilter, users]);


  // Handle user actions
  const handleCreateUser = () => {
    navigate('/admin/users');
  };

  const handleUpdateUser = async (updatedUser) => {
    console.log("updatedUser: ", updatedUser);
    if (updatedUser.role === 'CONSULTANT') {
      try {
        const accessToken = Cookies.get('accessToken');
        const accountId = Cookies.get('accountId');
        await axios.put(`${API_URL}/admin/update-con-profile`,
          {
            acc_id: updatedUser.id,
            full_name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            is_banned: updatedUser.status === 'banned' ? true : false,
            dob: updatedUser.dateOfBirth,
            gender: updatedUser.gender || '',
            phone: updatedUser.phone || '',
            address: updatedUser.address || '',
            description: updatedUser.description || '',
            gg_meet: updatedUser.gg_meet_link || '',
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }).then((response) => {
            console.log("update-account response: ", response);
            fetchAccounts();
          });
      } catch (error) {
        console.error("update-account error: ", error);
      }
    } else {
      try {
        const accessToken = Cookies.get('accessToken');
        const accountId = Cookies.get('accountId');
        await axios.put(`${API_URL}/admin/update-profile`,
          {
            acc_id: updatedUser.id,
            full_name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            is_banned: updatedUser.status === 'banned' ? true : false,
            dob: updatedUser.dateOfBirth,
            gender: updatedUser.gender || '',
            phone: updatedUser.phone || '',
            address: updatedUser.address || '',
            description: updatedUser.description || '',
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }).then((response) => {
            console.log("update-account response: ", response);
            fetchAccounts();
          });
      } catch (error) {
        console.error("update-account error: ", error);
      }
    }

  }


  const handleViewUser = (user) => {
    setModalMode('view');
    setSelectedUser(user);
    console.log("selectedUser: ", user);
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

  // Khóa / Mở khóa tài khoảng
  const handleToggleStatus = async (user) => {
    // const updatedUsers = users.map((u) =>
    //   u.account_id === user.account_id
    //     ? { ...u, is_banned: u.is_banned === true ? false : true }
    //     : u
    // );
    // setUsers(updatedUsers);
    try {
      if (user.is_banned === false || user.is_banned === 'false') {
        const accessToken = Cookies.get('accessToken');
        const accountId = Cookies.get('accountId');
        await axios.post(`${API_URL}/admin/ban-account`,
          {
            selected_account_id: user.account_id
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        ).then((response) => {
          // console.log("ban-account response: ", response)
        })
      } else if (user.is_banned === true || user.is_banned === 'true') {
        const accessToken = Cookies.get('accessToken');
        const accountId = Cookies.get('accountId');
        await axios.post(`${API_URL}/admin/unban-account`,
          {
            selected_account_id: user.account_id
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        ).then((response) => {
          // console.log("unban-account response: ", response)
        })
      }
    } catch (error) {
      console.error("ban error: ", error);
    } finally {
      fetchAccounts();
    }
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
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.account_id));
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
      MANAGER: 'admin',
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
        {user.full_name?.charAt(0).toUpperCase()}
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
              placeholder="     Tìm kiếm theo tên hoặc email..."
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
        Hiển thị {((currentPage - 1) * itemsPerPage + 1)}-
        {((currentPage - 1) * itemsPerPage + 1 + itemsPerPage - 1)} trong tổng
        số {totalItems} người dùng
        {/* {selectedUsers.length > 0 && (
          <span className="selection-info">
            ({selectedUsers.length} đã chọn)
          </span>
        )} */}
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
                    selectedUsers.length === users.length &&
                    users.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th> */}
              <th>STT</th>
              <th>Thông tin người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Ngày tham gia</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
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
                <td>{(index + 1) + ((currentPage - 1) * itemsPerPage)}</td>
                <td>
                  <div className="user-info">
                    {getAvatar(user)}
                    <div className="user-details">
                      <div className="account-management-user-name">{user.full_name}</div>
                      {/* <div className="user-id">ID: {user.account_id}</div> */}
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
                      <button onClick={() => handleToggleStatus(user)}> {/*Khóa tài khoảng*/}
                        {user.is_banned === false
                          ? '🔒 Khóa tài khoản'
                          : '🔓 Mở khóa tài khoản'}
                      </button>
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

      {/* User Modal */}
      {showModal && (
        <UserModal
          mode={modalMode}
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={(updatedUser) => {
            if (modalMode === 'edit') {
              handleUpdateUser(updatedUser);
            }
            setShowModal(false);
          }}
          onEdit={() => setModalMode('edit')}
        />
      )}

    </div>
  );
};

export default AccountManagement;
