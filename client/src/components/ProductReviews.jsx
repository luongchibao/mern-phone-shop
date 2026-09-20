import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios.js';

export default function ProductReviews({ productId, reviews, onReviewAdded }) {
  const { user } = useSelector((s) => s.auth);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const hasReviewed = reviews?.some((r) => r.user === user?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Vui lòng đăng nhập để đánh giá!');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      alert('✓ Đánh giá thành công!');
      setComment('');
      setRating(5);
      onReviewAdded();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Đánh giá thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (reviewId) => {
    setSubmitting(true);
    try {
      await api.put(`/products/${productId}/reviews/${reviewId}`, {
        rating: editingReview.rating,
        comment: editingReview.comment,
      });
      alert('✓ Cập nhật đánh giá thành công!');
      setEditingReview(null);
      onReviewAdded();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Cập nhật thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

    try {
      await api.delete(`/products/${productId}/reviews/${reviewId}`);
      alert('✓ Đã xóa đánh giá!');
      onReviewAdded();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Xóa thất bại!');
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-5 p-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h3 className="h5 fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <span>💬</span> Đánh giá từ khách hàng
          </h3>
          <p className="text-muted small mb-0">
            Tổng cộng {reviews?.length || 0} lượt nhận xét &amp; đánh giá
          </p>
        </div>
      </div>

      {/* FORM THÊM ĐÁNH GIÁ */}
      {user && !hasReviewed && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 rounded-4 bg-light border">
          <h4 className="h6 fw-bold text-dark mb-3">✍️ Viết đánh giá của bạn</h4>

          <div className="mb-3">
            <label className="form-label small fw-bold">Mức độ hài lòng của bạn:</label>
            <div className="d-flex align-items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="btn p-0 border-0 bg-transparent text-warning"
                  style={{
                    fontSize: '1.75rem',
                    lineHeight: 1,
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                  }}
                >
                  {(hoverRating || rating) >= star ? '★' : '☆'}
                </button>
              ))}
              <span className="ms-2 fw-semibold text-dark small">
                ({rating} / 5 sao - {rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Hài lòng' : rating === 3 ? 'Bình thường' : 'Chưa tốt'})
              </span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Nội dung nhận xét:</label>
            <textarea
              className="form-control"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cảm nhận về thiết kế, hiệu năng, pin, camera..."
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-sm px-4 fw-bold"
            disabled={submitting}
          >
            {submitting ? 'Đang gửi...' : '✓ Gửi đánh giá ngay'}
          </button>
        </form>
      )}

      {!user && (
        <div className="alert alert-info border-0 rounded-3 mb-4 d-flex align-items-center gap-2">
          <span>ℹ️</span>
          <span>Vui lòng đăng nhập tài khoản để viết đánh giá cho sản phẩm này!</span>
        </div>
      )}

      {hasReviewed && (
        <div className="alert alert-success border-0 rounded-3 mb-4 d-flex align-items-center gap-2">
          <span>✓</span>
          <span>Bạn đã gửi đánh giá cho sản phẩm này. Cảm ơn phản hồi của bạn!</span>
        </div>
      )}

      {/* DANH SÁCH ĐÁNH GIÁ */}
      <div className="reviews-list">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="mb-3 p-3 p-md-4 border rounded-3 bg-white"
              style={{ transition: 'all 0.2s ease' }}
            >
              {editingReview?._id === review._id ? (
                // EDIT FORM
                <div>
                  <div className="mb-2">
                    <label className="form-label small fw-bold">Chọn lại số sao:</label>
                    <div className="d-flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditingReview({ ...editingReview, rating: star })}
                          className="btn p-0 border-0 bg-transparent text-warning"
                          style={{ fontSize: '1.4rem' }}
                        >
                          {star <= editingReview.rating ? '★' : '☆'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows="2"
                      value={editingReview.comment}
                      onChange={(e) =>
                        setEditingReview({ ...editingReview, comment: e.target.value })
                      }
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => handleEdit(review._id)}
                      className="btn btn-success btn-sm"
                      disabled={submitting}
                    >
                      ✓ Lưu thay đổi
                    </button>
                    <button
                      onClick={() => setEditingReview(null)}
                      className="btn btn-secondary btn-sm"
                    >
                      ✕ Hủy
                    </button>
                  </div>
                </div>
              ) : (
                // NORMAL VIEW
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)',
                          color: '#fff',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                        }}
                      >
                        {review.username ? review.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <strong className="text-dark d-block" style={{ fontSize: '0.925rem' }}>
                          {review.username}
                        </strong>
                        <small className="text-muted" style={{ fontSize: '0.775rem' }}>
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <div className="text-warning fw-bold" style={{ letterSpacing: '2px' }}>
                        {'★'.repeat(review.rating)}
                        <span className="text-muted opacity-25">
                          {'★'.repeat(Math.max(0, 5 - review.rating))}
                        </span>
                      </div>

                      {(user?._id === review.user || user?.role === 'admin') && (
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary dropdown-toggle py-0 px-2"
                            data-bs-toggle="dropdown"
                            style={{ borderRadius: 'var(--radius-sm)' }}
                          >
                            ⋮
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                            <li>
                              <button
                                className="dropdown-item small"
                                onClick={() => setEditingReview(review)}
                              >
                                ✏️ Sửa nhận xét
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item small text-danger"
                                onClick={() => handleDelete(review._id)}
                              >
                                🗑️ Xóa nhận xét
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mb-0 text-secondary mt-2" style={{ lineHeight: '1.6', fontSize: '0.925rem' }}>
                    {review.comment}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
            <p className="mb-0">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>
          </div>
        )}
      </div>
    </div>
  );
}
