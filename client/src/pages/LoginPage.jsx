import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/authSlice.js';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((s) => s.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const onSubmit = async (values) => {
    const action = await dispatch(login(values));
    if (login.fulfilled.match(action)) {
      navigate('/');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-glass-card">
        <div className="text-center mb-4">
          <div className="brand-icon-wrapper mx-auto mb-3" style={{ width: '54px', height: '54px', fontSize: '1.6rem' }}>
            📱
          </div>
          <h1 className="h4 fw-bold text-dark mb-1">Chào mừng trở lại!</h1>
          <p className="text-muted small">Đăng nhập tài khoản Phone DZ của bạn</p>
        </div>

        {error && (
          <div className="alert alert-danger border-0 rounded-3 small p-3 mb-3 d-flex align-items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Email đăng nhập</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              {...register('email', { required: 'Email là bắt buộc' })}
            />
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label mb-0">Mật khẩu</label>
              <Link to="/forgot-password" className="small text-primary text-decoration-none">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="password-toggle-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                {...register('password', { required: 'Mật khẩu là bắt buộc' })}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-glow btn-shine w-100 py-2 fw-bold mt-2"
            disabled={isSubmitting}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            {isSubmitting ? '⏳ Đang đăng nhập...' : 'Đăng nhập ngay'}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted small mb-0">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="fw-bold text-primary text-decoration-none">
              Đăng ký miễn phí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
