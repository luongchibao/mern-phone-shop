import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';

export default function CheckoutPage() {
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: user?.address?.fullName || user?.username || '',
      phone: user?.address?.phone || '',
      street: user?.address?.street || '',
      ward: user?.address?.ward || '',
      district: user?.address?.district || '',
      city: user?.address?.city || '',
      postalCode: user?.address?.postalCode || '',
      paymentMethod: 'COD',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.address?.fullName || user.username || '',
        phone: user.address?.phone || '',
        street: user.address?.street || '',
        ward: user.address?.ward || '',
        district: user.address?.district || '',
        city: user.address?.city || '',
        postalCode: user.address?.postalCode || '',
        paymentMethod: 'COD',
      });
    }
  }, [user, reset]);

  const subtotal = items?.reduce((sum, i) => sum + i.price * i.qty, 0) || 0;
  const shippingFee = subtotal > 0 ? 30000 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingFee + tax;

  const onSubmit = async (values) => {
    try {
      if (!items || items.length === 0) {
        alert('Giỏ hàng đang trống!');
        return;
      }

      const payload = {
        items: items.map((i) => ({
          product: i.product,
          qty: i.qty,
        })),
        shippingAddress: {
          fullName: values.fullName,
          phone: values.phone,
          street: values.street,
          ward: values.ward,
          district: values.district,
          city: values.city,
          postalCode: values.postalCode,
        },
        paymentMethod: values.paymentMethod,
      };

      await api.post('/orders', payload);
      alert('✓ Đặt hàng thành công! Đơn hàng của bạn đã được ghi nhận.');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('❌ Đặt hàng thất bại. Vui lòng thử lại!');
    }
  };

  if (!user) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="alert alert-warning p-5 rounded-4 shadow-sm" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h4 className="fw-bold mb-2">Yêu cầu đăng nhập</h4>
          <p className="text-muted mb-4">Bạn cần đăng nhập tài khoản trước khi tiến hành thanh toán đơn hàng.</p>
          <Link to="/login" className="btn btn-primary px-4 py-2 fw-bold">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="p-5 bg-white border rounded-4 shadow-sm" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <h4 className="fw-bold mb-2">Giỏ hàng trống</h4>
          <p className="text-muted mb-4">Vui lòng chọn sản phẩm vào giỏ hàng trước khi thanh toán.</p>
          <Link to="/" className="btn btn-primary px-4 py-2">
            ← Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4 my-md-5">
      {/* CHECKOUT PROGRESS BAR */}
      <div className="checkout-step-bar">
        <div className="step-item">
          <span className="step-number" style={{ background: '#10b981', color: '#fff' }}>✓</span>
          <span>Giỏ hàng</span>
        </div>
        <div style={{ width: '40px', height: '2px', background: 'var(--primary)' }} />
        <div className="step-item active">
          <span className="step-number">2</span>
          <span>Địa chỉ &amp; Thanh toán</span>
        </div>
        <div style={{ width: '40px', height: '2px', background: '#e2e8f0' }} />
        <div className="step-item">
          <span className="step-number">3</span>
          <span>Hoàn tất</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-4">
          {/* LEFT: SHIPPING & PAYMENT DETAILS */}
          <div className="col-12 col-lg-7">
            {/* SHIPPING ADDRESS CARD */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 pb-2 border-bottom">
                <span>📍</span> Thông tin nhận hàng
              </h5>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Họ và tên người nhận *</label>
                  <input
                    className="form-control"
                    placeholder="Nguyễn Văn A"
                    {...register('fullName', { required: true })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Số điện thoại *</label>
                  <input
                    className="form-control"
                    placeholder="0912 345 678"
                    {...register('phone', { required: true })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Địa chỉ chi tiết (Số nhà, tên đường) *</label>
                  <input
                    className="form-control"
                    placeholder="Số 123 Đường Lê Lợi"
                    {...register('street', { required: true })}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Phường / Xã *</label>
                  <input
                    className="form-control"
                    placeholder="Phường Bến Nghé"
                    {...register('ward', { required: true })}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Quận / Huyện *</label>
                  <input
                    className="form-control"
                    placeholder="Quận 1"
                    {...register('district', { required: true })}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Tỉnh / Thành phố *</label>
                  <input
                    className="form-control"
                    placeholder="Hồ Chí Minh"
                    {...register('city', { required: true })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Mã bưu điện (Tùy chọn)</label>
                  <input
                    className="form-control"
                    placeholder="700000"
                    {...register('postalCode')}
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD CARD */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 pb-2 border-bottom">
                <span>💳</span> Phương thức thanh toán
              </h5>

              <div className="d-flex flex-column gap-3">
                {/* COD OPTION */}
                <div
                  className={`payment-method-card ${selectedPaymentMethod === 'COD' ? 'selected' : ''}`}
                  onClick={() => setValue('paymentMethod', 'COD')}
                >
                  <input
                    type="radio"
                    value="COD"
                    {...register('paymentMethod')}
                    id="payCOD"
                    className="form-check-input"
                  />
                  <div className="flex-grow-1">
                    <label htmlFor="payCOD" className="fw-bold text-dark d-block mb-0 cursor-pointer">
                      💵 Thanh toán tiền mặt khi nhận hàng (COD)
                    </label>
                    <small className="text-muted d-block mt-1">
                      Kiểm tra máy và thanh toán tiền mặt trực tiếp cho nhân viên giao hàng.
                    </small>
                  </div>
                </div>

                {/* BANK TRANSFER OPTION */}
                <div
                  className={`payment-method-card ${selectedPaymentMethod === 'BANKING' ? 'selected' : ''}`}
                  onClick={() => setValue('paymentMethod', 'BANKING')}
                >
                  <input
                    type="radio"
                    value="BANKING"
                    {...register('paymentMethod')}
                    id="payBanking"
                    className="form-check-input"
                  />
                  <div className="flex-grow-1">
                    <label htmlFor="payBanking" className="fw-bold text-dark d-block mb-0 cursor-pointer">
                      🏦 Chuyển khoản ngân hàng (VietQR / Internet Banking)
                    </label>
                    <small className="text-muted d-block mt-1">
                      Quét mã VietQR nhanh chóng, miễn phí giao dịch 24/7.
                    </small>
                  </div>
                </div>

                {/* VNPAY OPTION */}
                <div
                  className={`payment-method-card ${selectedPaymentMethod === 'VNPAY' ? 'selected' : ''}`}
                  onClick={() => setValue('paymentMethod', 'VNPAY')}
                >
                  <input
                    type="radio"
                    value="VNPAY"
                    {...register('paymentMethod')}
                    id="payVnpay"
                    className="form-check-input"
                  />
                  <div className="flex-grow-1">
                    <label htmlFor="payVnpay" className="fw-bold text-dark d-block mb-0 cursor-pointer">
                      📱 Cổng thanh toán VNPAY-QR / Ví Điện Tử
                    </label>
                    <small className="text-muted d-block mt-1">
                      Hỗ trợ tất cả ứng dụng ngân hàng và ví điện tử, chiết khấu lên đến 100k.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY (STICKY) */}
          <div className="col-12 col-lg-5">
            <div className="summary-sticky-card">
              <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">
                Đơn hàng ({items.length} sản phẩm)
              </h5>

              {/* PRODUCTS PREVIEW */}
              <div className="overflow-auto pe-1 mb-3" style={{ maxHeight: '240px' }}>
                {items.map((i) => (
                  <div key={i.product} className="d-flex align-items-center gap-3 py-2 border-bottom">
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: 'var(--radius-sm)',
                        background: '#f8fafc',
                        border: '1px solid var(--border)',
                        padding: '0.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {i.image ? (
                        <img
                          src={i.image}
                          alt={i.name}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <span>📱</span>
                      )}
                    </div>
                    <div className="flex-grow-1 small">
                      <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '180px' }}>
                        {i.name}
                      </div>
                      <span className="text-muted">SL: {i.qty}</span>
                    </div>
                    <div className="text-end small fw-bold text-dark">
                      {(i.price * i.qty).toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTALS */}
              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Tạm tính hàng:</span>
                <strong className="text-dark">{subtotal.toLocaleString('vi-VN')} ₫</strong>
              </div>

              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Phí giao hàng:</span>
                <strong className="text-dark">{shippingFee.toLocaleString('vi-VN')} ₫</strong>
              </div>

              <div className="d-flex justify-content-between mb-3 small">
                <span className="text-muted">Thuế VAT (10%):</span>
                <strong className="text-dark">{tax.toLocaleString('vi-VN')} ₫</strong>
              </div>

              <div className="p-3 bg-light rounded-3 mb-3 border">
                <div className="d-flex justify-content-between align-items-baseline">
                  <span className="fw-bold text-dark">Tổng thanh toán:</span>
                  <span className="h4 fw-bold text-primary mb-0">
                    {total.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-glow w-100 py-3 fw-bold mb-3"
                disabled={isSubmitting}
                style={{ fontSize: '1rem', borderRadius: 'var(--radius-lg)' }}
              >
                {isSubmitting ? '⏳ Đang xử lý đơn hàng...' : '✓ Xác Nhận Đặt Hàng'}
              </button>

              <div className="text-center small text-muted">
                Bằng việc bấm đặt hàng, bạn đồng ý với các <Link to="/">Điều khoản</Link> của Phone DZ.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
