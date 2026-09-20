import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import AdminNav from '../../components/AdminNav.jsx';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (e) {
      console.error(e);
      alert('Lỗi khi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      await load();
    } catch (e) {
      console.error(e);
      alert('Cập nhật trạng thái thất bại');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      setDeleteConfirm(null);
      alert('✓ Xoá đơn hàng thành công!');
    } catch (err) {
      console.error(err);
      alert('❌ Xoá đơn hàng thất bại');
    }
  };

  return (
    <div className="container my-4 my-md-5">
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1 text-dark">
          📋 Quản Lý Đơn Hàng
        </h1>
        <p className="text-muted small">
          Theo dõi và cập nhật trạng thái đơn hàng (Chờ xác nhận, Đang giao, Đã giao)
        </p>
      </div>

      {/* ADMIN SUBNAV */}
      <AdminNav />

      {loading ? (
        <div className="text-center py-5 my-5">
          <div className="spinner-border text-primary spinner-border-sm" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3 text-muted">Đang tải danh sách đơn hàng...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h5 className="fw-bold mb-2">Chưa có đơn hàng nào</h5>
          <p className="text-muted small mb-0">Khi có khách đặt hàng, đơn hàng sẽ hiển thị tại đây.</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
            <h5 className="h6 fw-bold mb-0 text-dark">
              Tổng số đơn hàng: {orders.length}
            </h5>
          </div>

          <div className="p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th style={{ width: '100px' }}>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Ngày đặt</th>
                    <th className="text-end">Tổng tiền</th>
                    <th style={{ width: '180px' }}>Cập nhật trạng thái</th>
                    <th className="text-center" style={{ width: '60px' }}>Xóa</th>
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
                      <td>
                        <div className="fw-semibold text-dark small">
                          {o.shippingAddress?.fullName || 'Khách hàng'}
                        </div>
                        <small className="text-muted">
                          {o.shippingAddress?.phone || 'Chưa có SĐT'}
                        </small>
                      </td>
                      <td className="small text-muted">
                        {new Date(o.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="text-end fw-bold text-dark small">
                        {o.totalPrice?.toLocaleString('vi-VN')} ₫
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={o.status || 'pending'}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                          style={{
                            fontWeight: '600',
                            fontSize: '0.825rem',
                            color:
                              o.status === 'delivered'
                                ? '#15803d'
                                : o.status === 'shipped'
                                ? '#0284c7'
                                : o.status === 'cancelled'
                                ? '#b91c1c'
                                : '#b45309',
                          }}
                        >
                          <option value="pending">⏳ Chờ xác nhận</option>
                          <option value="paid">💳 Đã thanh toán</option>
                          <option value="shipped">🚚 Đang giao hàng</option>
                          <option value="delivered">✓ Đã giao hàng</option>
                          <option value="cancelled">✕ Đã hủy</option>
                        </select>
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger p-1"
                          onClick={() => setDeleteConfirm(o)}
                          title="Xóa đơn hàng"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
                <h5 className="fw-bold text-danger mb-2">⚠️ Xác nhận xóa đơn hàng</h5>
                <p className="text-muted mb-4">
                  Bạn có chắc chắn muốn xóa đơn hàng <strong>#{deleteConfirm._id.slice(-6).toUpperCase()}</strong>?
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
                    onClick={() => handleDeleteOrder(deleteConfirm._id)}
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
