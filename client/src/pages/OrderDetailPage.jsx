import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
        alert('❌ Không tìm thấy đơn hàng');
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-3 text-muted">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="alert alert-danger p-4 rounded-4 shadow-sm" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h5 className="fw-bold mb-2">❌ Không tìm thấy đơn hàng</h5>
          <Link to="/profile" className="btn btn-primary btn-sm mt-2">
            ← Quay lại tài khoản
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'warning', text: 'Chờ xác nhận', icon: '⏳' },
      paid: { bg: 'info', text: 'Đã thanh toán', icon: '💳' },
      shipped: { bg: 'primary', text: 'Đang giao hàng', icon: '🚚' },
      delivered: { bg: 'success', text: 'Đã giao hàng thành công', icon: '✓' },
      cancelled: { bg: 'danger', text: 'Đã hủy đơn', icon: '✕' },
    };
    return badges[status] || badges.pending;
  };

  const statusInfo = getStatusBadge(order.status);

  return (
    <div className="container my-4 my-md-5">
      {/* HEADER */}
      <div className="mb-4">
        <Link to="/profile" className="btn btn-outline-secondary btn-sm mb-3">
          ← Quay lại danh sách đơn hàng
        </Link>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 p-4 bg-white border rounded-4 shadow-sm">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h1 className="h4 fw-bold mb-0 text-dark">
                Đơn hàng #{order._id.slice(-8).toUpperCase()}
              </h1>
              <span className={`badge bg-${statusInfo.bg} bg-opacity-10 text-${statusInfo.bg} border border-${statusInfo.bg} px-3 py-1 rounded-pill fw-bold`}>
                {statusInfo.icon} {statusInfo.text}
              </span>
            </div>
            <p className="text-muted small mb-0">
              Đặt lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT: PRODUCTS & ADDRESS */}
        <div className="col-12 col-lg-8">
          {/* PRODUCTS CARD */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
            <div className="p-3 bg-light border-bottom">
              <h5 className="h6 fw-bold mb-0 text-dark">
                🛍️ Danh sách sản phẩm đã đặt ({order.items?.length || 0})
              </h5>
            </div>
            <div className="p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-center">Số lượng</th>
                      <th className="text-end">Đơn giá</th>
                      <th className="text-end">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, idx) => (
                      <tr key={idx} className="border-bottom">
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div
                              style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: 'var(--radius-sm)',
                                background: '#f8fafc',
                                border: '1px solid var(--border)',
                                padding: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                />
                              ) : (
                                <span>📱</span>
                              )}
                            </div>
                            <div>
                              <div className="fw-semibold text-dark small">{item.name}</div>
                              {item.product && (
                                <Link
                                  to={`/product/${item.product}`}
                                  className="text-primary text-decoration-none small"
                                  style={{ fontSize: '0.8rem' }}
                                >
                                  Xem lại sản phẩm →
                                </Link>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center fw-bold small">{item.qty}</td>
                        <td className="text-end small">
                          {item.price?.toLocaleString('vi-VN')} ₫
                        </td>
                        <td className="text-end fw-bold text-primary small">
                          {((item.price || 0) * (item.qty || 0)).toLocaleString('vi-VN')} ₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SHIPPING ADDRESS & PAYMENT */}
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                <h6 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
                  <span>📍</span> Địa chỉ nhận hàng
                </h6>
                {order.shippingAddress ? (
                  <div className="small">
                    <strong className="d-block text-dark mb-1">
                      {order.shippingAddress.fullName}
                    </strong>
                    <div className="text-muted mb-1">
                      📞 {order.shippingAddress.phone}
                    </div>
                    <div className="text-muted">
                      {[
                        order.shippingAddress.street,
                        order.shippingAddress.ward,
                        order.shippingAddress.district,
                        order.shippingAddress.city,
                        order.shippingAddress.postalCode,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted small mb-0">Chưa có thông tin địa chỉ</p>
                )}
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                <h6 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
                  <span>💳</span> Phương thức thanh toán
                </h6>
                <div className="mb-2">
                  <span className="badge bg-light text-dark border px-3 py-2 fw-semibold">
                    {order.paymentMethod === 'COD'
                      ? '💵 Tiền mặt khi nhận hàng (COD)'
                      : '🏦 ' + order.paymentMethod}
                  </span>
                </div>
                {order.isPaid ? (
                  <div className="small text-success fw-semibold">
                    ✓ Đã thanh toán lúc {new Date(order.paidAt).toLocaleString('vi-VN')}
                  </div>
                ) : (
                  <div className="small text-muted">
                    Chưa thanh toán (Thanh toán khi nhận kiện hàng)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: SUMMARY & TIMELINE */}
        <div className="col-12 col-lg-4">
          <div className="summary-sticky-card">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">
              💰 Chi tiết thanh toán
            </h5>

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Tạm tính:</span>
              <strong>{(order.itemsPrice || 0).toLocaleString('vi-VN')} ₫</strong>
            </div>

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Phí giao hàng:</span>
              <strong>{(order.shippingPrice || 0).toLocaleString('vi-VN')} ₫</strong>
            </div>

            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom small">
              <span className="text-muted">Thuế VAT (10%):</span>
              <strong>{(order.taxPrice || 0).toLocaleString('vi-VN')} ₫</strong>
            </div>

            <div className="p-3 bg-light rounded-3 mb-4 border">
              <div className="d-flex justify-content-between align-items-baseline">
                <span className="fw-bold text-dark">Tổng tiền đơn:</span>
                <span className="h4 fw-bold text-primary mb-0">
                  {(order.totalPrice || 0).toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>

            {/* TIMELINE */}
            <div>
              <h6 className="fw-bold text-dark mb-3">📅 Tiến trình đơn hàng</h6>
              <div className="d-flex flex-column gap-3 small border-start ps-3 ms-2">
                <div className="position-relative">
                  <span className="position-absolute start-0 top-0 translate-middle-x badge bg-success rounded-pill" style={{ marginLeft: '-17px' }}>
                    ✓
                  </span>
                  <strong className="d-block text-dark">Đặt hàng thành công</strong>
                  <span className="text-muted">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>

                {order.isPaid && order.paidAt && (
                  <div className="position-relative">
                    <span className="position-absolute start-0 top-0 translate-middle-x badge bg-success rounded-pill" style={{ marginLeft: '-17px' }}>
                      ✓
                    </span>
                    <strong className="d-block text-dark">Đã xác nhận thanh toán</strong>
                    <span className="text-muted">
                      {new Date(order.paidAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                )}

                {order.status === 'shipped' && (
                  <div className="position-relative">
                    <span className="position-absolute start-0 top-0 translate-middle-x badge bg-primary rounded-pill" style={{ marginLeft: '-17px' }}>
                      🚚
                    </span>
                    <strong className="d-block text-primary">Đang giao tới địa chỉ của bạn</strong>
                  </div>
                )}

                {order.status === 'delivered' && (
                  <div className="position-relative">
                    <span className="position-absolute start-0 top-0 translate-middle-x badge bg-success rounded-pill" style={{ marginLeft: '-17px' }}>
                      ✓
                    </span>
                    <strong className="d-block text-success">Giao hàng thành công</strong>
                    {order.deliveredAt && (
                      <span className="text-muted">
                        {new Date(order.deliveredAt).toLocaleString('vi-VN')}
                      </span>
                    )}
                  </div>
                )}

                {order.status === 'cancelled' && (
                  <div className="position-relative">
                    <span className="position-absolute start-0 top-0 translate-middle-x badge bg-danger rounded-pill" style={{ marginLeft: '-17px' }}>
                      ✕
                    </span>
                    <strong className="d-block text-danger">Đơn hàng đã hủy</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
