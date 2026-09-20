import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice.js';

export default function Header() {
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [siteSettings, setSiteSettings] = React.useState({
    logoUrl: '',
    siteName: 'Phone DZ',
    siteNameColor: '#ffffff',
  });

  // Load site settings from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('site-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSiteSettings({
          logoUrl: parsed.logoUrl || '',
          siteName: parsed.siteName || 'Phone DZ',
          siteNameColor: parsed.siteNameColor || '#ffffff',
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const cartCount = items?.reduce((sum, i) => sum + (i.qty || 0), 0) || 0;

  const onLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get('q');
    const params = new URLSearchParams(window.location.search);
    if (q) params.set('keyword', q);
    else params.delete('keyword');
    params.set('page', '1');
    window.location.href = `/?${params.toString()}`;
  };

  return (
    <>
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="announcement-bar d-none d-md-block">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-danger text-white fw-bold px-2 py-1 rounded-pill" style={{ fontSize: '0.7rem' }}>
              ⚡ FLASH SALE
            </span>
            <span>Ưu đãi thành viên: Giảm đến 40% &amp; Trả góp 0%</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span className="d-flex align-items-center gap-1">
              <span className="status-dot-pulse online me-1"></span>
              Miễn phí giao siêu tốc 2h cho đơn từ 500.000₫
            </span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span>📞 Hotline CSKH: <strong className="text-warning">1800 6868</strong> (8h - 22h)</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <Link to="/" className="text-decoration-none text-white-50 hover-text-white d-flex align-items-center gap-1">
              <span>📍</span> 120 cửa hàng toàn quốc
            </Link>
          </div>
        </div>
      </div>

      {/* STICKY GLASS NAVBAR */}
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container">
          {/* LOGO */}
          <Link
            to="/"
            className="navbar-brand me-4"
          >
            {siteSettings.logoUrl ? (
              <>
                <img
                  src={siteSettings.logoUrl}
                  alt={siteSettings.siteName}
                  style={{
                    height: '38px',
                    maxWidth: '120px',
                    objectFit: 'contain',
                  }}
                />
                <span style={{ color: siteSettings.siteNameColor }}>
                  {siteSettings.siteName}
                </span>
              </>
            ) : (
              <>
                <div className="brand-icon-wrapper">
                  📱
                </div>
                <span style={{ color: siteSettings.siteNameColor }}>
                  {siteSettings.siteName}
                </span>
              </>
            )}
          </Link>

          {/* MOBILE TOGGLER */}
          <button
            className="navbar-toggler border-0 p-2 text-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-label="Toggle navigation"
            style={{ filter: 'invert(1)' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            {/* SEARCH FORM & QUICK TAGS */}
            <div className="mx-auto my-2 my-lg-0" style={{ maxWidth: '500px', width: '100%' }}>
              <form
                className="search-form-wrapper w-100"
                onSubmit={handleSearch}
              >
                <input
                  className="form-control search-input-modern w-100"
                  name="q"
                  type="search"
                  placeholder="🔍 Bạn muốn tìm iPhone 16, Galaxy S24 Ultra...?"
                  aria-label="Tìm kiếm sản phẩm"
                />
                <button className="btn search-btn-modern btn-shine" type="submit">
                  Tìm kiếm
                </button>
              </form>

              {/* QUICK SUGGESTION TAGS */}
              <div className="search-quick-tags d-none d-lg-flex">
                <span className="text-white-50" style={{ fontSize: '0.7rem' }}>Gợi ý:</span>
                <a href="/?keyword=iPhone+16" className="search-tag-chip">iPhone 16 Pro</a>
                <a href="/?keyword=Galaxy+S24" className="search-tag-chip">Galaxy S24 Ultra</a>
                <a href="/?keyword=Xiaomi+14" className="search-tag-chip">Xiaomi 14</a>
                <a href="/?brand=Apple" className="search-tag-chip">🍎 Apple</a>
                <a href="/?brand=Samsung" className="search-tag-chip">Samsung</a>
              </div>
            </div>

            {/* NAV ACTIONS */}
            <ul className="navbar-nav align-items-lg-center gap-2 ms-lg-auto mt-2 mt-lg-0">
              {/* CART LINK */}
              <li className="nav-item">
                <Link
                  to="/cart"
                  className="nav-link-modern position-relative"
                >
                  <span style={{ fontSize: '1.25rem' }}>🛒</span>
                  <span>Giỏ hàng</span>
                  {cartCount > 0 && (
                    <span className="cart-badge-bounce ms-1">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>

              {/* USER / AUTH */}
              {user ? (
                <li className="nav-item dropdown">
                  <button
                    className="btn nav-link-modern dropdown-toggle d-flex align-items-center gap-2 bg-transparent border-0"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.5)',
                      }}
                    >
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="d-flex flex-column text-start" style={{ lineHeight: '1.2' }}>
                      <span className="text-white fw-semibold">{user.username}</span>
                      {user.role === 'admin' && (
                        <span className="badge bg-danger py-0 px-1 text-white" style={{ fontSize: '0.65rem' }}>
                          Admin
                        </span>
                      )}
                    </div>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-modern dropdown-menu-end">
                    <li>
                      <div className="px-3 py-2 border-bottom mb-1">
                        <div className="fw-bold text-dark">{user.username}</div>
                        <small className="text-muted">{user.email}</small>
                      </div>
                    </li>
                    <li>
                      <Link className="dropdown-item-modern" to="/profile">
                        <span>👤</span> Trang cá nhân &amp; Đơn hàng
                      </Link>
                    </li>

                    {user.role === 'admin' && (
                      <>
                        <li><hr className="dropdown-divider-modern" /></li>
                        <li>
                          <div className="px-3 py-1 text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                            Quản trị viên
                          </div>
                        </li>
                        <li>
                          <Link className="dropdown-item-modern" to="/admin">
                            <span>📊</span> Dashboard Quản trị
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item-modern" to="/admin/products">
                            <span>📦</span> Quản lý sản phẩm
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item-modern" to="/admin/orders">
                            <span>📋</span> Quản lý đơn hàng
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item-modern" to="/admin/users">
                            <span>👥</span> Quản lý người dùng
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item-modern" to="/admin/reviews">
                            <span>💬</span> Quản lý đánh giá
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item-modern" to="/admin/banners">
                            <span>🖼️</span> Quản lý banners
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item-modern" to="/admin/settings">
                            <span>⚙️</span> Cài đặt giao diện
                          </Link>
                        </li>
                      </>
                    )}

                    <li><hr className="dropdown-divider-modern" /></li>
                    <li>
                      <button
                        className="dropdown-item-modern text-danger w-100 bg-transparent border-0 text-start"
                        onClick={onLogout}
                      >
                        <span>↪️</span> Đăng xuất
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item d-flex gap-2">
                  <Link
                    to="/login"
                    className="btn btn-outline-primary text-white border-white-50 btn-sm px-3"
                    style={{ borderRadius: 'var(--radius-full)' }}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm px-3"
                    style={{ borderRadius: 'var(--radius-full)' }}
                  >
                    Đăng ký
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
