import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    setResetUrl('');

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message || '✓ Link đặt lại mật khẩu đã được gửi đến email của bạn!');

      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }

      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || '❌ Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-glass-card">
        <div className="text-center mb-4">
          <div className="brand-icon-wrapper mx-auto mb-3" style={{ width: '54px', height: '54px', fontSize: '1.6rem' }}>
            🔐
          </div>
          <h1 className="h4 fw-bold text-dark mb-1">Quên mật khẩu?</h1>
          <p className="text-muted small">
            Nhập email tài khoản, chúng tôi sẽ hỗ trợ tạo lại mật khẩu mới cho bạn.
          </p>
        </div>

        {message && (
          <div className="alert alert-success border-0 rounded-3 small p-3 mb-3">
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger border-0 rounded-3 small p-3 mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email của bạn</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-glow w-100 py-2 fw-bold mt-2"
            disabled={loading}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            {loading ? '⏳ Đang gửi yêu cầu...' : 'Gửi link đặt lại mật khẩu'}
          </button>
        </form>

        {resetUrl && (
          <div className="mt-3 p-3 bg-light border rounded-3 small">
            <strong className="d-block mb-1 text-dark">🔗 Link dev test:</strong>
            <a href={resetUrl} className="text-break text-primary">
              {resetUrl}
            </a>
          </div>
        )}

        <div className="text-center mt-4 pt-3 border-top">
          <Link to="/login" className="small fw-semibold text-muted text-decoration-none">
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
