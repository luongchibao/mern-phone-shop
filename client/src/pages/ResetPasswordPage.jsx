import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios.js';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('❌ Link không hợp lệ hoặc đã hết hạn');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError('❌ Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setError('❌ Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', { token, password });
      alert('✓ Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || '❌ Có lỗi xảy ra. Link có thể đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="auth-wrapper">
        <div className="auth-glass-card text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 className="h4 fw-bold mb-2 text-danger">Link không hợp lệ</h1>
          <p className="text-muted small mb-4">
            Link đặt lại mật khẩu đã hết hạn hoặc không tồn tại. Vui lòng yêu cầu link mới.
          </p>
          <Link to="/forgot-password" className="btn btn-primary btn-sm px-4">
            Yêu cầu link mới
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-glass-card">
        <div className="text-center mb-4">
          <div className="brand-icon-wrapper mx-auto mb-3" style={{ width: '54px', height: '54px', fontSize: '1.6rem' }}>
            🔑
          </div>
          <h1 className="h4 fw-bold text-dark mb-1">Đặt lại mật khẩu</h1>
          <p className="text-muted small">Nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>

        {error && (
          <div className="alert alert-danger border-0 rounded-3 small p-3 mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-glow w-100 py-2 fw-bold mt-2"
            disabled={loading}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            {loading ? '⏳ Đang lưu...' : 'Xác nhận đổi mật khẩu'}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <Link to="/login" className="small fw-semibold text-muted text-decoration-none">
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
