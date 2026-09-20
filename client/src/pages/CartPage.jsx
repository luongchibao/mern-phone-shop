import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateCartItem, removeCartItem } from '../slices/cartSlice.js';

export default function CartPage() {
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState(null);
  const [couponError, setCouponError] = React.useState('');

  const subtotal = items?.reduce((sum, i) => sum + i.price * i.qty, 0) || 0;
  const freeShippingThreshold = 500000;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code === 'PHONEDZ' || appliedCoupon.code === 'PHONEDZ10') {
      discount = 100000;
    } else if (appliedCoupon.code === 'VIP20') {
      discount = Math.round(subtotal * 0.05);
    }
  }

  const tax = Math.round(Math.max(0, subtotal - discount) * 0.1);
  const total = Math.max(0, subtotal - discount) + tax;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'PHONEDZ' || code === 'PHONEDZ10' || code === 'VIP20') {
      setAppliedCoupon({
        code,
        discountText: code === 'VIP20' ? 'Giảm 5% giá trị máy' : 'Giảm 100.000₫ đơn hàng',
      });
      setCouponCode('');
    } else {
      setCouponError('❌ Mã giảm giá không hợp lệ hoặc đã hết hạn (Thử mã: PHONEDZ)');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleUpdateQty = async (productId, newQty) => {
    if (newQty < 1) return;
    await dispatch(updateCartItem({ productId, qty: newQty }));
  };

  const handleRemove = async (productId) => {
    if (window.confirm('🗑️ Bạn chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      await dispatch(removeCartItem({ productId }));
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('🗑️ Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      for (const item of items) {
        await dispatch(removeCartItem({ productId: item.product }));
      }
    }
  };

  const goCheckout = () => {
    navigate('/checkout');
  };

  if (!items || items.length === 0) {
    return (
      <div className="container my-5 py-5">
        <div
          className="text-center p-5 bg-white border rounded-4 shadow-sm"
          style={{ maxWidth: '540px', margin: '0 auto' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h2 className="h4 fw-bold text-dark mb-2">Giỏ hàng của bạn đang trống</h2>
          <p className="text-muted mb-4">
            Bạn chưa chọn sản phẩm nào. Khám phá ngay hàng trăm mẫu smartphone chính hãng với giá ưu đãi!
          </p>
          <Link to="/" className="btn btn-primary px-4 py-2 fw-bold">
            ← Khám phá sản phẩm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4 my-md-5">
      {/* CHECKOUT PROGRESS BAR */}
      <div className="checkout-step-bar">
        <div className="step-item active">
          <span className="step-number">1</span>
          <span>Giỏ hàng ({items.length})</span>
        </div>
        <div style={{ width: '40px', height: '2px', background: '#e2e8f0' }} />
        <div className="step-item">
          <span className="step-number">2</span>
          <span>Địa chỉ &amp; Thanh toán</span>
        </div>
        <div style={{ width: '40px', height: '2px', background: '#e2e8f0' }} />
        <div className="step-item">
          <span className="step-number">3</span>
          <span>Hoàn tất</span>
        </div>
      </div>

      {/* FREE SHIPPING PROGRESS */}
      <div className="free-shipping-box">
        <div className="d-flex justify-content-between align-items-center small">
          <span className="fw-semibold text-dark">
            {subtotal >= freeShippingThreshold ? (
              <span className="text-success">🎉 Tuyệt vời! Đơn hàng của bạn đã đủ điều kiện <strong>MIỄN PHÍ GIAO HÀNG</strong>!</span>
            ) : (
              <span>🚚 Mua thêm <strong>{(freeShippingThreshold - subtotal).toLocaleString('vi-VN')} ₫</strong> để được Miễn Phí Vận Chuyển!</span>
            )}
          </span>
          <span className="fw-bold text-success">{freeShippingProgress}%</span>
        </div>
        <div className="free-shipping-track">
          <div className="free-shipping-fill" style={{ width: `${freeShippingProgress}%` }}></div>
        </div>
      </div>

      {/* TOP ACTIONS */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
          ← Tiếp tục chọn máy
        </Link>
        <button
          onClick={handleClearCart}
          className="btn btn-outline-danger btn-sm"
        >
          🗑️ Xóa toàn bộ giỏ hàng
        </button>
      </div>

      <div className="row g-4">
        {/* CART ITEMS LIST */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
              <span className="fw-bold text-dark">Danh sách sản phẩm trong giỏ</span>
              <span className="badge bg-primary rounded-pill">{items.length} món</span>
            </div>

            <div className="p-0">
              {items.map((i) => (
                <div
                  key={i.product}
                  className="p-3 p-md-4 border-bottom d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3"
                >
                  {/* PRODUCT INFO */}
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: 'var(--radius-md)',
                        background: '#f8fafc',
                        border: '1px solid var(--border)',
                        padding: '0.4rem',
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
                        <span style={{ fontSize: '2rem' }}>📱</span>
                      )}
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-1">{i.name}</h6>
                      {i.brand && (
                        <span className="badge bg-light text-secondary border small mb-1">
                          {i.brand}
                        </span>
                      )}
                      <div className="text-primary fw-bold small">
                        {i.price ? i.price.toLocaleString('vi-VN') : 0} ₫
                      </div>
                    </div>
                  </div>

                  {/* QUANTITY & ACTIONS */}
                  <div className="d-flex align-items-center justify-content-between gap-3">
                    {/* QUANTITY STEPPER */}
                    <div className="quantity-stepper">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(i.product, i.qty - 1)}
                        disabled={i.qty <= 1}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={i.qty}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= 1) handleUpdateQty(i.product, val);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(i.product, i.qty + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* ITEM TOTAL */}
                    <div className="text-end" style={{ minWidth: '110px' }}>
                      <span className="d-block small text-muted">Thành tiền:</span>
                      <strong className="text-dark">
                        {(i.price * i.qty).toLocaleString('vi-VN')} ₫
                      </strong>
                    </div>

                    {/* REMOVE BTN */}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger p-2"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                      onClick={() => handleRemove(i.product)}
                      title="Xóa khỏi giỏ hàng"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY (STICKY) */}
        <div className="col-12 col-lg-4">
          <div className="summary-sticky-card">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">
              Tóm tắt đơn hàng
            </h5>

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Tạm tính hàng:</span>
              <strong className="text-dark">{subtotal.toLocaleString('vi-VN')} ₫</strong>
            </div>

            {appliedCoupon && (
              <div className="d-flex justify-content-between mb-2 small text-success">
                <span>Khuyến mãi ({appliedCoupon.code}):</span>
                <strong>- {discount.toLocaleString('vi-VN')} ₫</strong>
              </div>
            )}

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Phí giao hàng:</span>
              <span className="text-success fw-bold">
                {subtotal >= freeShippingThreshold ? 'Miễn phí' : '30.000 ₫'}
              </span>
            </div>

            <div className="d-flex justify-content-between mb-3 small">
              <span className="text-muted">Thuế VAT (10%):</span>
              <strong className="text-dark">{tax.toLocaleString('vi-VN')} ₫</strong>
            </div>

            {/* COUPON INPUT */}
            <div className="coupon-box mb-3">
              <div className="small fw-bold text-dark mb-2 d-flex align-items-center gap-1">
                <span>🎟️</span> Mã giảm giá / Voucher
              </div>
              {appliedCoupon ? (
                <div className="coupon-applied-badge">
                  <div>
                    <strong>{appliedCoupon.code}</strong>
                    <small className="d-block">{appliedCoupon.discountText}</small>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm text-danger p-0 fw-bold"
                    onClick={handleRemoveCoupon}
                  >
                    ✕ Bỏ mã
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm text-uppercase"
                    placeholder="Nhập PHONEDZ..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="submit" className="btn btn-sm btn-primary px-3">
                    Áp dụng
                  </button>
                </form>
              )}
              {couponError && (
                <div className="text-danger small mt-2">{couponError}</div>
              )}
            </div>

            <div className="p-3 bg-light rounded-3 mb-3 border">
              <div className="d-flex justify-content-between align-items-baseline">
                <span className="fw-bold text-dark">Tổng thanh toán:</span>
                <span className="h4 fw-bold text-primary mb-0">
                  {total.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <small className="text-muted d-block mt-1">Đã bao gồm VAT và vận chuyển</small>
            </div>

            <button
              className="btn btn-glow btn-shine w-100 py-3 fw-bold mb-3"
              onClick={goCheckout}
              style={{ fontSize: '1rem', borderRadius: 'var(--radius-lg)' }}
            >
              Tiến Hành Thanh Toán →
            </button>

            <div className="p-2 border rounded-3 text-center small text-muted bg-white">
              🔒 Bảo mật thanh toán SSL 256-bit chuẩn quốc tế
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
