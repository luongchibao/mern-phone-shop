import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import AdminNav from '../../components/AdminNav.jsx';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, avgRating: 0 });

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/reviews');
      setReviews(data.reviews || []);

      const total = data.reviews.length;
      const avgRating =
        total > 0
          ? (data.reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
          : 0;
      setStats({ total, avgRating });
    } catch (error) {
      console.error(error);
      alert('Lỗi tải dữ liệu đánh giá!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (productId, reviewId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

    try {
      await api.delete(`/products/${productId}/reviews/${reviewId}`);
      alert('✓ Đã xóa đánh giá!');
      loadReviews();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Xóa thất bại!');
    }
  };

  return (
    <div className="container my-4 my-md-5">
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1 text-dark">
          💬 Quản Lý Đánh Giá
        </h1>
        <p className="text-muted small">
          Kiểm duyệt và quản lý các bình luận, phản hồi của người dùng về sản phẩm
        </p>
      </div>

      {/* ADMIN SUBNAV */}
      <AdminNav />

      {loading ? (
        <div className="text-center py-5 my-5">
          <div className="spinner-border text-primary spinner-border-sm" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3 text-muted">Đang tải danh sách đánh giá...</p>
        </div>
      ) : (
        <>
          {/* STATS CARDS */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                <span className="text-muted small fw-semibold">Tổng lượt đánh giá</span>
                <h3 className="h2 fw-bold text-primary mt-1 mb-0">{stats.total}</h3>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                <span className="text-muted small fw-semibold">Điểm số trung bình</span>
                <h3 className="h2 fw-bold text-warning mt-1 mb-0">⭐ {stats.avgRating} / 5</h3>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                <span className="text-muted small fw-semibold">Nhận xét tuần qua</span>
                <h3 className="h2 fw-bold text-success mt-1 mb-0">
                  {reviews.filter((r) => new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </h3>
              </div>
            </div>
          </div>

          {/* REVIEWS TABLE */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="p-3 bg-light border-bottom">
              <h5 className="h6 fw-bold mb-0 text-dark">
                Danh sách đánh giá mới nhất ({reviews.length})
              </h5>
            </div>

            <div className="p-0">
              {reviews.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Người gửi</th>
                        <th>Sao</th>
                        <th>Nội dung nhận xét</th>
                        <th>Thời gian</th>
                        <th className="text-center" style={{ width: '60px' }}>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((review) => (
                        <tr key={review._id}>
                          <td>
                            <Link
                              to={`/product/${review.productId}`}
                              className="text-decoration-none text-primary fw-semibold small"
                            >
                              {review.productName}
                            </Link>
                          </td>
                          <td>
                            <strong className="text-dark small">{review.username}</strong>
                          </td>
                          <td>
                            <div className="text-warning small" style={{ letterSpacing: '2px' }}>
                              {'★'.repeat(review.rating)}
                            </div>
                          </td>
                          <td>
                            <p className="mb-0 text-secondary small" style={{ maxWidth: '340px' }}>
                              {review.comment}
                            </p>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(review.createdAt).toLocaleString('vi-VN')}
                            </small>
                          </td>
                          <td className="text-center">
                            <button
                              onClick={() => handleDelete(review.productId, review._id)}
                              className="btn btn-sm btn-outline-danger p-1"
                              title="Xóa đánh giá"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <p className="mb-0">Chưa có đánh giá nào từ khách hàng.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
