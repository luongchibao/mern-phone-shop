import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import { Link } from 'react-router-dom';
import AdminNav from '../../components/AdminNav.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    userCount: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [prodRes, orderRes, userRes] = await Promise.all([
          api.get('/products', { params: { limit: 1 } }),
          api.get('/orders'),
          api.get('/admin/users'),
        ]);

        const productsData = prodRes.data;
        const orders = orderRes.data;
        const users = userRes.data;

        const revenue = orders.reduce(
          (sum, o) => sum + (o.totalPrice || 0),
          0
        );

        setStats({
          productCount: productsData.total || productsData.products?.length || 0,
          orderCount: orders.length || 0,
          userCount: users.length || 0,
          revenue,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleResetRevenue = async () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }

    try {
      alert('⚠️ Tính năng reset doanh thu yêu cầu xoá lịch sử đơn hàng. Vui lòng xoá từng đơn hàng trong phần Quản lý đơn hàng.');
      setShowResetConfirm(false);
    } catch (e) {
      console.error(e);
      alert('❌ Lỗi khi reset doanh thu');
      setShowResetConfirm(false);
    }
  };

  return (
    <div className="container my-4 my-md-5">
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1 text-dark">
          📊 Bảng Điều Khiển Quản Trị (Admin)
        </h1>
        <p className="text-muted small">
          Theo dõi tổng quan tình hình kinh doanh, số lượng sản phẩm, đơn hàng và doanh số
        </p>
      </div>

      {/* ADMIN SUBNAV */}
      <AdminNav />

      {loading ? (
        <div className="text-center py-5 my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3 text-muted">Đang tổng hợp dữ liệu thống kê...</p>
        </div>
      ) : (
        <>
          {/* STATS CARDS */}
          <div className="row g-4 mb-4">
            {/* PRODUCTS */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="admin-stat-card h-100" style={{ borderTop: '4px solid var(--primary)' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span className="text-muted small fw-semibold">Tổng sản phẩm</span>
                    <h2 className="h3 fw-bold text-dark mt-1 mb-0">{stats.productCount}</h2>
                  </div>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      background: '#e0e7ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      boxShadow: '0 2px 6px rgba(79, 70, 229, 0.2)',
                    }}
                  >
                    📦
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
                  <span className="kpi-trend-pill positive">
                    ↑ 100% Khả dụng
                  </span>
                  <Link to="/admin/products" className="small fw-bold text-primary text-decoration-none">
                    Quản lý →
                  </Link>
                </div>
              </div>
            </div>

            {/* ORDERS */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="admin-stat-card h-100" style={{ borderTop: '4px solid var(--success)' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span className="text-muted small fw-semibold">Tổng đơn hàng</span>
                    <h2 className="h3 fw-bold text-dark mt-1 mb-0">{stats.orderCount}</h2>
                  </div>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      background: '#dcfce7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    📋
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
                  <span className="kpi-trend-pill positive">
                    ↑ Đơn phát sinh
                  </span>
                  <Link to="/admin/orders" className="small fw-bold text-success text-decoration-none">
                    Xử lý ngay →
                  </Link>
                </div>
              </div>
            </div>

            {/* USERS */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="admin-stat-card h-100" style={{ borderTop: '4px solid var(--info)' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span className="text-muted small fw-semibold">Khách hàng</span>
                    <h2 className="h3 fw-bold text-dark mt-1 mb-0">{stats.userCount}</h2>
                  </div>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      background: '#e0f2fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      boxShadow: '0 2px 6px rgba(14, 165, 233, 0.2)',
                    }}
                  >
                    👥
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
                  <span className="kpi-trend-pill positive">
                    ↑ Tài khoản
                  </span>
                  <Link to="/admin/users" className="small fw-bold text-info text-decoration-none">
                    Xem danh sách →
                  </Link>
                </div>
              </div>
            </div>

            {/* REVENUE */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="admin-stat-card h-100" style={{ borderTop: '4px solid var(--warning)' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span className="text-muted small fw-semibold">Tổng doanh thu</span>
                    <h2 className="h4 fw-bold text-dark mt-1 mb-0">
                      {(stats.revenue / 1000000).toFixed(1)}M ₫
                    </h2>
                  </div>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      background: '#fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      boxShadow: '0 2px 6px rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    💰
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
                  <span className="small text-muted">
                    Thực nhận: <strong>{stats.revenue.toLocaleString('vi-VN')} ₫</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS GRID */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark mb-3">🚀 Truy cập nhanh các tác vụ</h5>
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-md-4">
                <Link to="/admin/products" className="btn btn-outline-primary w-100 py-3 text-start d-flex align-items-center gap-3">
                  <span style={{ fontSize: '1.5rem' }}>📦</span>
                  <div>
                    <strong className="d-block">Sản phẩm &amp; Tồn kho</strong>
                    <small className="text-muted">Thêm mới, sửa giá, số lượng</small>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-sm-6 col-md-4">
                <Link to="/admin/orders" className="btn btn-outline-success w-100 py-3 text-start d-flex align-items-center gap-3">
                  <span style={{ fontSize: '1.5rem' }}>📋</span>
                  <div>
                    <strong className="d-block">Xử lý Đơn hàng</strong>
                    <small className="text-muted">Cập nhật trạng thái giao hàng</small>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-sm-6 col-md-4">
                <Link to="/admin/users" className="btn btn-outline-info w-100 py-3 text-start d-flex align-items-center gap-3">
                  <span style={{ fontSize: '1.5rem' }}>👥</span>
                  <div>
                    <strong className="d-block">Tài khoản Người dùng</strong>
                    <small className="text-muted">Quản lý phân quyền, xóa tài khoản</small>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-sm-6 col-md-4">
                <Link to="/admin/reviews" className="btn btn-outline-secondary w-100 py-3 text-start d-flex align-items-center gap-3">
                  <span style={{ fontSize: '1.5rem' }}>💬</span>
                  <div>
                    <strong className="d-block">Kiểm duyệt Đánh giá</strong>
                    <small className="text-muted">Xem phản hồi và đánh giá sao</small>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-sm-6 col-md-4">
                <Link to="/admin/banners" className="btn btn-outline-danger w-100 py-3 text-start d-flex align-items-center gap-3">
                  <span style={{ fontSize: '1.5rem' }}>🖼️</span>
                  <div>
                    <strong className="d-block">Banner Khuyến mãi</strong>
                    <small className="text-muted">Thay đổi ảnh slide trang chủ</small>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-sm-6 col-md-4">
                <Link to="/admin/settings" className="btn btn-outline-warning w-100 py-3 text-start d-flex align-items-center gap-3">
                  <span style={{ fontSize: '1.5rem' }}>⚙️</span>
                  <div>
                    <strong className="d-block">Cài đặt Website</strong>
                    <small className="text-muted">Đổi Logo, tên shop và hình nền</small>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
