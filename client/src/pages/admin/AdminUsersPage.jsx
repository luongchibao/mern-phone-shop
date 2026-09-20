import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import AdminNav from '../../components/AdminNav.jsx';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoadingUsers(true);
        const { data } = await api.get('/admin/users');
        setUsers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingUsers(false);
      }
    }
    loadUsers();
  }, []);

  const handleViewOrders = async (user) => {
    setSelectedUser(user);
    setOrders([]);
    try {
      setLoadingOrders(true);
      const { data } = await api.get(`/admin/users/${user._id}/orders`);
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      if (selectedUser?._id === userId) {
        setSelectedUser(null);
        setOrders([]);
      }
      setDeleteConfirm(null);
      alert('✓ Xoá người dùng thành công!');
    } catch (err) {
      console.error(err);
      alert('❌ Xoá người dùng thất bại');
    }
  };

  return (
    <div className="container my-4 my-md-5">
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1 text-dark">
          👥 Quản Lý Người Dùng
        </h1>
        <p className="text-muted small">
          Xem danh sách tài khoản thành viên, lịch sử đơn hàng cá nhân và phân quyền
        </p>
      </div>

      {/* ADMIN SUBNAV */}
      <AdminNav />

      <div className="row g-4">
        {/* USERS LIST */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white h-100">
            <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
              <h5 className="h6 fw-bold mb-0 text-dark">
                Danh sách tài khoản ({users.length})
              </h5>
            </div>

            <div className="p-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {loadingUsers ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary spinner-border-sm" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <p>Chưa có người dùng nào trong hệ thống.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Người dùng</th>
                        <th>Email</th>
                        <th className="text-center">Vai trò</th>
                        <th className="text-end" style={{ width: '130px' }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr
                          key={u._id}
                          className={selectedUser?._id === u._id ? 'table-primary bg-opacity-25' : ''}
                        >
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                  color: '#fff',
                                  fontWeight: '700',
                                  fontSize: '0.8rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {u.username ? u.username.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <span className="fw-semibold text-dark small">{u.username}</span>
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">{u.email}</small>
                          </td>
                          <td className="text-center">
                            <span
                              className={`badge ${
                                u.role === 'admin'
                                  ? 'bg-danger bg-opacity-10 text-danger border border-danger'
                                  : 'bg-secondary bg-opacity-10 text-secondary'
                              }`}
                            >
                              {u.role === 'admin' ? '👑 Admin' : '👤 Khách'}
                            </span>
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-outline-primary btn-sm py-1 px-2 me-1"
                              style={{ fontSize: '0.8rem' }}
                              onClick={() => handleViewOrders(u)}
                            >
                              Đơn hàng
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm py-1 px-2"
                              style={{ fontSize: '0.8rem' }}
                              onClick={() => setDeleteConfirm(u)}
                              title="Xoá người dùng"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* USER ORDERS */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white h-100">
            <div className="p-3 bg-light border-bottom">
              <h5 className="h6 fw-bold mb-0 text-dark">
                📦 Lịch sử mua hàng của:{' '}
                {selectedUser ? (
                  <span className="text-primary">{selectedUser.username}</span>
                ) : (
                  <span className="text-muted fw-normal">—</span>
                )}
              </h5>
            </div>

            <div className="p-3">
              {!selectedUser ? (
                <div className="text-center py-5 text-muted">
                  <p className="mb-0">👈 Chọn một người dùng ở danh sách bên trái để xem các đơn hàng của họ.</p>
                </div>
              ) : loadingOrders ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary spinner-border-sm" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <p className="mb-0">Người dùng này chưa có đơn hàng nào.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Mã</th>
                        <th>Ngày</th>
                        <th className="text-end">Tổng tiền</th>
                        <th className="text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id}>
                          <td>
                            <strong className="text-primary small">
                              #{o._id.slice(-6).toUpperCase()}
                            </strong>
                          </td>
                          <td className="small text-muted">
                            {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="text-end fw-bold small text-dark">
                            {o.totalPrice?.toLocaleString('vi-VN')} ₫
                          </td>
                          <td className="text-center">
                            <span className="badge bg-light text-dark border small">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="p-4">
                <h5 className="fw-bold text-danger mb-2">⚠️ Xác nhận xóa người dùng</h5>
                <p className="text-muted mb-4">
                  Bạn chắc chắn muốn xóa tài khoản <strong>"{deleteConfirm.email}"</strong> ({deleteConfirm.username})?
                </p>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteUser(deleteConfirm._id)}
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
