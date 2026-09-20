import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { updateProfile, clearProfileStatus } from '../slices/authSlice.js';

export default function ProfilePage() {
  const { user, profileError, profileSuccess } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      fullName: user?.address?.fullName || '',
      phone: user?.address?.phone || '',
      street: user?.address?.street || '',
      ward: user?.address?.ward || '',
      district: user?.address?.district || '',
      city: user?.address?.city || '',
      postalCode: user?.address?.postalCode || '',
    },
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || '',
        email: user.email || '',
        password: '',
        fullName: user.address?.fullName || '',
        phone: user.address?.phone || '',
        street: user.address?.street || '',
        ward: user.address?.ward || '',
        district: user.address?.district || '',
        city: user.address?.city || '',
        postalCode: user.address?.postalCode || '',
      });
    }
  }, [user, reset]);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoadingOrders(true);
        const { data } = await api.get('/orders/mine');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, []);

  useEffect(() => {
    if (profileSuccess || profileError) {
      const t = setTimeout(() => dispatch(clearProfileStatus()), 3000);
      return () => clearTimeout(t);
    }
  }, [profileSuccess, profileError, dispatch]);

  if (!user) return null;

  const onSubmit = (values) => {
    const payload = {
      username: values.username,
      email: values.email,
      address: {
        fullName: values.fullName,
        phone: values.phone,
        street: values.street,
        ward: values.ward,
        district: values.district,
        city: values.city,
        postalCode: values.postalCode,
      },
    };
    if (values.password) payload.password = values.password;
    dispatch(updateProfile(payload));
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1">✓ Đã giao</span>;
      case 'shipped':
        return <span className="badge bg-info bg-opacity-10 text-info fw-bold px-2 py-1">🚚 Đang giao</span>;
      case 'paid':
        return <span className="badge bg-primary bg-opacity-10 text-primary fw-bold px-2 py-1">💳 Đã thanh toán</span>;
      case 'cancelled':
        return <span className="badge bg-danger bg-opacity-10 text-danger fw-bold px-2 py-1">✕ Đã hủy</span>;
      default:
        return <span className="badge bg-warning bg-opacity-10 text-warning fw-bold px-2 py-1">⏳ Chờ duyệt</span>;
    }
  };

  return (
    <div className="container my-4 my-md-5">
      {/* USER BANNER */}
      <div
        className="p-4 p-md-5 rounded-4 mb-4 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-4 position-relative" style={{ zIndex: 2 }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: '800',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h1 className="h3 fw-bold mb-0 text-white">{user.username}</h1>
              {user.role === 'admin' && (
                <span className="badge bg-danger text-white px-2 py-1 rounded-pill small">
                  Admin
                </span>
              )}
            </div>
            <p className="text-white-50 mb-0 small">
              ✉️ {user.email} &bull; Thành viên Phone DZ
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* EDIT PROFILE FORM */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <span>⚙️</span> Cập nhật thông tin cá nhân
            </h5>

            {profileError && (
              <div className="alert alert-danger border-0 rounded-3 small p-3 mb-3">
                ❌ {profileError}
              </div>
            )}
            {profileSuccess && (
              <div className="alert alert-success border-0 rounded-3 small p-3 mb-3">
                ✓ Đã cập nhật hồ sơ thành công!
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Tên hiển thị</label>
                <input
                  className="form-control"
                  {...register('username', { required: true })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  {...register('email', { required: true })}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Đổi mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Để trống nếu không đổi mật khẩu"
                  {...register('password')}
                />
              </div>

              <h6 className="fw-bold text-dark mb-3 pt-3 border-top">
                📍 Địa chỉ nhận hàng mặc định
              </h6>

              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Họ tên người nhận</label>
                  <input className="form-control" {...register('fullName')} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Số điện thoại</label>
                  <input className="form-control" {...register('phone')} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Địa chỉ chi tiết (Số nhà, đường)</label>
                  <input className="form-control" {...register('street')} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">Phường / Xã</label>
                  <input className="form-control" {...register('ward')} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">Quận / Huyện</label>
                  <input className="form-control" {...register('district')} />
                </div>
                <div className="col-8">
                  <label className="form-label small fw-bold">Tỉnh / Thành phố</label>
                  <input className="form-control" {...register('city')} />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-bold">Mã bưu chính</label>
                  <input className="form-control" {...register('postalCode')} />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold"
                disabled={isSubmitting}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                {isSubmitting ? '⏳ Đang lưu...' : '✓ Lưu Thay Đổi'}
              </button>
            </form>
          </div>
        </div>

        {/* ORDER HISTORY */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-dark mb-0 small text-uppercase" style={{ letterSpacing: '0.05em' }}>
                📦 Lịch sử đơn hàng ({orders.length})
              </h5>
            </div>

            <div className="p-0">
              {loadingOrders ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary spinner-border-sm" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-5 text-muted p-4">
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📦</div>
                  <p className="mb-2">Bạn chưa có đơn hàng nào.</p>
                  <Link to="/" className="btn btn-outline-primary btn-sm">
                    Khám phá sản phẩm ngay
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Mã đơn</th>
                        <th>Ngày đặt</th>
                        <th className="text-end">Tổng tiền</th>
                        <th className="text-center">Trạng thái</th>
                        <th></th>
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
                          <td className="text-end fw-bold text-dark small">
                            {o.totalPrice?.toLocaleString('vi-VN')} ₫
                          </td>
                          <td className="text-center">
                            {getOrderStatusBadge(o.status)}
                          </td>
                          <td className="text-end">
                            <Link
                              to={`/orders/${o._id}`}
                              className="btn btn-outline-secondary btn-sm py-1 px-2"
                              style={{ fontSize: '0.8rem' }}
                            >
                              Chi tiết
                            </Link>
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
    </div>
  );
}
