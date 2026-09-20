import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser } from '../slices/authSlice.js';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((s) => s.auth);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const onSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      alert('❌ Mật khẩu xác nhận không khớp!');
      return;
    }

    const { confirmPassword, ...registerData } = values;
    const action = await dispatch(registerUser(registerData));
    if (registerUser.fulfilled.match(action)) {
      navigate('/');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-glass-card">
        <div className="text-center mb-4">
          <div className="brand-icon-wrapper mx-auto mb-3" style={{ width: '54px', height: '54px', fontSize: '1.6rem' }}>
            🎉
          </div>
          <h1 className="h4 fw-bold text-dark mb-1">Tạo tài khoản mới</h1>
          <p className="text-muted small">Đăng ký thành viên để nhận voucher 100.000₫</p>
        </div>

        {error && (
          <div className="alert alert-danger border-0 rounded-3 small p-3 mb-3 d-flex align-items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Tên hiển thị / Họ tên *</label>
            <input
              className="form-control"
              placeholder="Nguyễn Văn A"
              {...register('username', { required: 'Vui lòng nhập tên hiển thị' })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              {...register('email', { required: 'Vui lòng nhập email' })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu *</label>
            <div className="password-toggle-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Tối thiểu 6 ký tự"
                {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
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

          <div className="mb-3">
            <label className="form-label">Xác nhận mật khẩu *</label>
            <div className="password-toggle-wrap">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Nhập lại mật khẩu"
                {...register('confirmPassword', { required: 'Vui lòng xác nhận mật khẩu' })}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
                title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-glow btn-shine w-100 py-2 fw-bold mt-2"
            disabled={isSubmitting}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            {isSubmitting ? '⏳ Đang đăng ký...' : 'Đăng ký ngay'}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted small mb-0">
            Đã có tài khoản?{' '}
            <Link to="/login" className="fw-bold text-primary text-decoration-none">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
