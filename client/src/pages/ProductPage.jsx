import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axios.js';
import { addToCart } from '../slices/cartSlice.js';
import ProductReviews from '../components/ProductReviews.jsx';
import RelatedProducts from '../components/RelatedProducts.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setP(data);
      if (data.images && data.images.length > 0) {
        setSelectedImage(data.images[0]);
      } else if (data.image) {
        setSelectedImage(data.image);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert('⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }

    const action = await dispatch(addToCart({ productId: p._id, qty }));
    if (addToCart.fulfilled.match(action)) {
      navigate('/cart');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      alert('⚠️ Vui lòng đăng nhập để tiến hành mua ngay!');
      navigate('/login');
      return;
    }

    const action = await dispatch(addToCart({ productId: p._id, qty }));
    if (addToCart.fulfilled.match(action)) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="container my-5 py-5 text-center">
        <div
          className="spinner-border text-primary"
          style={{ width: '3rem', height: '3rem' }}
          role="status"
        >
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-3 text-muted fw-semibold">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="alert alert-danger p-4 rounded-4 shadow-sm" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h4 className="fw-bold mb-2">❌ Không tìm thấy sản phẩm</h4>
          <p className="mb-3 text-muted">Sản phẩm này không tồn tại hoặc đã ngừng kinh doanh.</p>
          <Link to="/" className="btn btn-primary btn-sm">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const allImages = p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [];

  return (
    <div className="container my-4 my-md-5">
      {/* BREADCRUMB */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none text-muted">Trang chủ</Link>
          </li>
          {p.brand && (
            <li className="breadcrumb-item">
              <Link to={`/?brand=${encodeURIComponent(p.brand)}`} className="text-decoration-none text-muted">
                {p.brand}
              </Link>
            </li>
          )}
          <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
            {p.name}
          </li>
        </ol>
      </nav>

      {/* HERO PRODUCT SECTION */}
      <div className="product-hero-card mb-5">
        <div className="row g-4 g-lg-5 align-items-start">
          {/* LEFT: IMAGE & GALLERY */}
          <div className="col-12 col-lg-5">
            <div className="product-gallery-view position-relative">
              {p.brand && (
                <span className="position-absolute top-0 start-0 m-3 badge bg-dark text-white px-3 py-2 rounded-pill fw-bold">
                  {p.brand}
                </span>
              )}
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={p.name}
                  className="product-gallery-img"
                />
              ) : (
                <div className="text-muted" style={{ fontSize: '6rem' }}>📱</div>
              )}
            </div>

            {/* THUMBNAILS IF MULTIPLE */}
            {allImages.length > 1 && (
              <div className="d-flex gap-2 mt-3 overflow-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className="btn p-1 border rounded-3 bg-white"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderColor: selectedImage === img ? 'var(--primary)' : 'var(--border)',
                      boxShadow: selectedImage === img ? '0 0 0 2px rgba(79, 70, 229, 0.4)' : 'none',
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div className="col-12 col-lg-7">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="badge bg-primary bg-opacity-10 text-primary fw-bold px-3 py-1 rounded-pill">
                Chính Hãng VN/A
              </span>
              {p.category && (
                <span className="badge bg-secondary bg-opacity-10 text-secondary fw-semibold px-3 py-1 rounded-pill text-uppercase">
                  {p.category}
                </span>
              )}
            </div>

            <h1 className="h2 fw-bold text-dark mb-3" style={{ letterSpacing: '-0.02em' }}>
              {p.name}
            </h1>

            {/* RATING & REVIEWS */}
            <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
              <div className="d-flex align-items-center gap-1 text-warning fw-bold">
                <span style={{ fontSize: '1.1rem' }}>★</span>
                <span className="text-dark">{p.rating ? p.rating.toFixed(1) : '5.0'}</span>
              </div>
              <span className="text-muted">|</span>
              <a href="#reviews-section" className="text-muted text-decoration-none small hover-text-primary">
                💬 {p.numReviews || 0} lượt đánh giá
              </a>
              <span className="text-muted">|</span>
              <div className="small d-flex align-items-center gap-1">
                {p.quantity > 0 ? (
                  <>
                    <span className="status-dot-pulse online"></span>
                    <span className="text-success fw-bold ms-1">Còn hàng ({p.quantity} máy có sẵn)</span>
                  </>
                ) : (
                  <>
                    <span className="status-dot-pulse offline"></span>
                    <span className="text-danger fw-bold ms-1">Tạm hết hàng</span>
                  </>
                )}
              </div>
            </div>

            {/* PRICE CARD */}
            <div className="product-price-box">
              <div className="small text-muted mb-1">Giá bán ưu đãi chính thức:</div>
              <div className="d-flex align-items-baseline gap-3">
                <span className="h1 fw-bold text-primary mb-0" style={{ letterSpacing: '-0.03em' }}>
                  {p.price ? p.price.toLocaleString('vi-VN') : 0} ₫
                </span>
                <span className="badge bg-danger bg-opacity-10 text-danger fw-bold px-2 py-1 rounded">
                  Tiết kiệm 15%
                </span>
                <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1 rounded">
                  Đã gồm VAT
                </span>
              </div>
              <div className="small text-muted mt-2">
                💳 Hoặc trả góp lãi suất 0% chỉ từ{' '}
                <strong>
                  {p.price ? Math.round(p.price / 12).toLocaleString('vi-VN') : 0} ₫/tháng
                </strong>
              </div>
            </div>

            {/* PROMOTIONAL GIFTS & PERKS BOX */}
            <div className="p-3 mb-4 rounded-3 border" style={{ background: '#fdfcfe', borderColor: '#e0e7ff' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span style={{ fontSize: '1.2rem' }}>🎁</span>
                <strong className="text-dark" style={{ fontSize: '0.9rem' }}>Khuyến Mãi &amp; Đặc Quyền Khi Mua:</strong>
              </div>
              <ul className="mb-0 ps-3 small text-muted d-flex flex-column gap-1" style={{ lineHeight: '1.6' }}>
                <li>⚡ Tặng củ sạc siêu nhanh 25W và cáp sạc bọc dù cao cấp</li>
                <li>💎 Thu cũ lên đời trợ giá đến <strong className="text-danger">2.000.000₫</strong></li>
                <li>🛡️ Tặng gói dán màn hình cường lực 12 tháng tại 120 cửa hàng</li>
                <li>💳 Giảm thêm <strong className="text-primary">500.000₫</strong> khi thanh toán qua VNPay hoặc thẻ tín dụng</li>
              </ul>
            </div>

            {/* DESCRIPTION */}
            {p.description && (
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2">Đặc điểm nổi bật:</h6>
                <p className="text-muted mb-0" style={{ lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                  {p.description}
                </p>
              </div>
            )}

            {/* QUANTITY & ACTIONS */}
            <div className="mb-4 pt-3 border-top">
              <div className="d-flex align-items-center gap-3 mb-3">
                <label className="form-label small fw-bold mb-0">Số lượng mua:</label>
                <div className="quantity-stepper">
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={p.quantity || 100}
                    value={qty}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1 && val <= (p.quantity || 100)) setQty(val);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.min(p.quantity || 100, prev + 1))}
                    disabled={qty >= (p.quantity || 100)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* DUAL ACTION BUTTONS */}
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="btn btn-buy-now btn-shine w-100 py-3 fw-bold"
                  disabled={!p.quantity}
                  style={{ fontSize: '1.05rem', borderRadius: 'var(--radius-lg)' }}
                >
                  ⚡ MUA NGAY
                  <small className="d-block fw-normal" style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                    (Giao hàng tận nơi siêu tốc 2h hoặc nhận tại shop)
                  </small>
                </button>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="btn btn-glow btn-shine flex-grow-1 py-2 fw-semibold"
                    disabled={!p.quantity}
                    style={{ fontSize: '0.925rem', borderRadius: 'var(--radius-md)' }}
                  >
                    🛒 Thêm Vào Giỏ Hàng
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="btn btn-outline-secondary px-3 py-2"
                    style={{ borderRadius: 'var(--radius-md)' }}
                    title="Tiếp tục mua sắm"
                  >
                    ← Xem máy khác
                  </button>
                </div>
              </div>
            </div>

            {/* POLICY PERKS */}
            <div className="row g-2 pt-3 border-top text-center text-md-start">
              <div className="col-12 col-md-4">
                <div className="p-2 border rounded-3 bg-light d-flex align-items-center gap-2">
                  <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                  <div className="small">
                    <strong className="d-block text-dark">Bảo hành 12 tháng</strong>
                    <span className="text-muted">Tại TTBH chính hãng</span>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-2 border rounded-3 bg-light d-flex align-items-center gap-2">
                  <span style={{ fontSize: '1.2rem' }}>🚚</span>
                  <div className="small">
                    <strong className="d-block text-dark">Giao hàng miễn phí</strong>
                    <span className="text-muted">Nhận máy sau 2 giờ</span>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-2 border rounded-3 bg-light d-flex align-items-center gap-2">
                  <span style={{ fontSize: '1.2rem' }}>🔄</span>
                  <div className="small">
                    <strong className="d-block text-dark">1 đổi 1 trong 30 ngày</strong>
                    <span className="text-muted">Nếu có lỗi phần cứng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SPECS SECTION */}
      {p.specs && Object.keys(p.specs).length > 0 && (
        <div className="card border-0 shadow-sm rounded-4 mb-5 p-4 bg-white">
          <h3 className="h5 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <span>⚙️</span> Thông số kỹ thuật chi tiết
          </h3>
          <div className="specs-grid">
            {Object.entries(p.specs).map(([k, v]) => (
              <div key={k} className="spec-item-card">
                <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                  {k}
                </small>
                <strong className="text-dark d-block mt-1" style={{ fontSize: '0.9rem' }}>
                  {v}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS SECTION */}
      <div id="reviews-section">
        <ProductReviews
          productId={p._id}
          reviews={p.reviews || []}
          onReviewAdded={loadProduct}
        />
      </div>

      {/* RELATED PRODUCTS */}
      <RelatedProducts
        currentProductId={p._id}
        category={p.category}
        brand={p.brand}
      />
    </div>
  );
}
