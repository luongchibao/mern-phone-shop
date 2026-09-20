import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import BannerSlider from '../components/BannerSlider.jsx';

const POPULAR_BRANDS = [
  'Tất cả',
  'Apple',
  'Samsung',
  'Xiaomi',
  'OPPO',
  'Vivo',
  'Realme',
  'Google',
  'Asus',
  'Honor',
];

export default function HomePage() {
  const [data, setData] = useState({ products: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const page = Number(params.get('page') || 1);
  const keyword = params.get('keyword') || '';
  const category = params.get('category') || '';
  const brand = params.get('brand') || '';
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';
  const rating = params.get('rating') || '';
  const sort = params.get('sort') || '';

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await api.get('/products', {
          params: { page, keyword, category, brand, minPrice, maxPrice, rating, sort },
        });
        setData(data);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, keyword, category, brand, minPrice, maxPrice, rating, sort]);

  const handleBrandSelect = (selectedBrand) => {
    const p = new URLSearchParams(window.location.search);
    if (selectedBrand && selectedBrand !== 'Tất cả') {
      p.set('brand', selectedBrand);
    } else {
      p.delete('brand');
    }
    p.set('page', '1');
    window.location.href = `/?${p.toString()}`;
  };

  const handleCategorySelect = (selectedCategory) => {
    const p = new URLSearchParams(window.location.search);
    if (selectedCategory) {
      p.set('category', selectedCategory);
    } else {
      p.delete('category');
    }
    p.set('page', '1');
    window.location.href = `/?${p.toString()}`;
  };

  const handleSortChange = (e) => {
    const p = new URLSearchParams(window.location.search);
    if (e.target.value) {
      p.set('sort', e.target.value);
    } else {
      p.delete('sort');
    }
    p.set('page', '1');
    window.location.href = `/?${p.toString()}`;
  };

  const handlePricePreset = (min, max) => {
    const p = new URLSearchParams(window.location.search);
    if (min) p.set('minPrice', min);
    else p.delete('minPrice');
    if (max) p.set('maxPrice', max);
    else p.delete('maxPrice');
    p.set('page', '1');
    window.location.href = `/?${p.toString()}`;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const p = new URLSearchParams();
    for (let [k, v] of formData.entries()) {
      if (v) p.set(k, v);
    }
    p.set('page', '1');
    window.location.href = `/?${p.toString()}`;
  };

  return (
    <div className="container my-4 my-md-5">
      {/* HERO BANNER SLIDER */}
      <BannerSlider />

      {/* VALUE PROPOSITION STRIP */}
      <div className="perks-strip">
        <div className="perk-card">
          <div className="perk-icon-wrap" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            🚚
          </div>
          <div className="perk-info">
            <h6>Giao Siêu Tốc 2H</h6>
            <p>Miễn phí cho đơn từ 500.000₫</p>
          </div>
        </div>

        <div className="perk-card">
          <div className="perk-icon-wrap" style={{ background: '#dcfce7', color: '#15803d' }}>
            🛡️
          </div>
          <div className="perk-info">
            <h6>100% Chính Hãng</h6>
            <p>Bảo hành toàn quốc 12-24 tháng</p>
          </div>
        </div>

        <div className="perk-card">
          <div className="perk-icon-wrap" style={{ background: '#fef3c7', color: '#b45309' }}>
            🔄
          </div>
          <div className="perk-info">
            <h6>Đổi Trả 30 Ngày</h6>
            <p>1 đổi 1 tận nơi nếu lỗi do NSX</p>
          </div>
        </div>

        <div className="perk-card">
          <div className="perk-icon-wrap" style={{ background: '#fce7f3', color: '#be185d' }}>
            💳
          </div>
          <div className="perk-info">
            <h6>Trả Góp 0% Lãi</h6>
            <p>Duyệt hồ sơ nhanh trong 5 phút</p>
          </div>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="filter-panel">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <div>
            <h2 className="filter-panel-title mb-1">
              Chọn thương hiệu yêu thích
            </h2>
            <p className="filter-panel-subtitle mb-0">Lọc nhanh các dòng máy nổi bật chính hãng VN/A</p>
          </div>
          <div className="os-segmented-control">
            <button
              type="button"
              className={`os-seg-btn ${category === '' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('')}
            >
              Tất cả hệ điều hành
            </button>
            <button
              type="button"
              className={`os-seg-btn ${category === 'ios' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('ios')}
            >
              iOS (iPhone)
            </button>
            <button
              type="button"
              className={`os-seg-btn ${category === 'android' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('android')}
            >
              Android
            </button>
          </div>
        </div>

        {/* BRAND CHIPS */}
        <div className="brand-chips-wrapper">
          {POPULAR_BRANDS.map((b) => {
            const isAll = b === 'Tất cả';
            const isActive = isAll ? brand === '' : brand.toLowerCase() === b.toLowerCase();
            return (
              <button
                key={b}
                type="button"
                className={`brand-chip ${isActive ? 'active' : ''}`}
                onClick={() => handleBrandSelect(b)}
              >
                {b}
              </button>
            );
          })}
        </div>

        {/* QUICK PRICE PRESETS */}
        <div className="quick-price-chips mb-3">
          <span className="small text-muted me-1 fw-semibold">Khoảng giá nhanh:</span>
          <button
            type="button"
            className={`quick-price-chip ${!minPrice && maxPrice === '5000000' ? 'active' : ''}`}
            onClick={() => handlePricePreset('', '5000000')}
          >
            Dưới 5 triệu
          </button>
          <button
            type="button"
            className={`quick-price-chip ${minPrice === '5000000' && maxPrice === '10000000' ? 'active' : ''}`}
            onClick={() => handlePricePreset('5000000', '10000000')}
          >
            5 - 10 triệu
          </button>
          <button
            type="button"
            className={`quick-price-chip ${minPrice === '10000000' && maxPrice === '20000000' ? 'active' : ''}`}
            onClick={() => handlePricePreset('10000000', '20000000')}
          >
            10 - 20 triệu
          </button>
          <button
            type="button"
            className={`quick-price-chip ${minPrice === '20000000' && !maxPrice ? 'active' : ''}`}
            onClick={() => handlePricePreset('20000000', '')}
          >
            Trên 20 triệu
          </button>
        </div>

        {/* DETAILED SEARCH FORM */}
        <form className="row g-3 align-items-end" onSubmit={handleFormSubmit}>
          <div className="col-12 col-md-3">
            <label className="filter-input-label">Từ khóa tìm kiếm</label>
            <input
              name="keyword"
              className="filter-form-control"
              placeholder="Tên máy, model..."
              defaultValue={keyword}
            />
          </div>

          <div className="col-6 col-md-2">
            <label className="filter-input-label">Giá từ (₫)</label>
            <input
              name="minPrice"
              type="number"
              className="filter-form-control"
              placeholder="0"
              defaultValue={minPrice}
            />
          </div>

          <div className="col-6 col-md-2">
            <label className="filter-input-label">Giá đến (₫)</label>
            <input
              name="maxPrice"
              type="number"
              className="filter-form-control"
              placeholder="50.000.000"
              defaultValue={maxPrice}
            />
          </div>

          <div className="col-6 col-md-2">
            <label className="filter-input-label">Đánh giá sao</label>
            <select
              name="rating"
              defaultValue={rating}
              className="filter-form-control form-select"
            >
              <option value="">Tất cả đánh giá</option>
              <option value="4">Từ 4 sao trở lên</option>
              <option value="3">Từ 3 sao trở lên</option>
            </select>
          </div>

          <div className="col-6 col-md-3">
            <label className="filter-input-label">Sắp xếp theo</label>
            <select
              name="sort"
              value={sort}
              onChange={handleSortChange}
              className="filter-form-control form-select"
            >
              <option value="">Mới nhất</option>
              <option value="price">Giá tăng dần</option>
              <option value="-price">Giá giảm dần</option>
              <option value="-rating">Đánh giá cao nhất</option>
            </select>
          </div>

          <div className="col-12 d-flex justify-content-end gap-2 pt-1">
            <button
              type="button"
              className="btn-filter-reset"
              onClick={() => {
                window.location.href = '/';
              }}
            >
              Xóa bộ lọc
            </button>
            <button type="submit" className="btn-filter-apply">
              Áp dụng lọc
            </button>
          </div>
        </form>

        {/* ACTIVE FILTER TAGS */}
        {(brand || keyword || category || minPrice || maxPrice || rating) && (
          <div className="mt-3 pt-3 border-top d-flex flex-wrap align-items-center gap-2">
            <span className="small text-muted fw-bold">Đang lọc theo:</span>
            {brand && (
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill small d-inline-flex align-items-center gap-2">
                <span>Hãng: <strong>{brand}</strong></span>
                <button
                  type="button"
                  className="btn-close"
                  style={{ fontSize: '0.6rem' }}
                  onClick={() => handleBrandSelect('Tất cả')}
                  aria-label="Remove brand filter"
                />
              </span>
            )}
            {category && (
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill small d-inline-flex align-items-center gap-2">
                <span>HĐH: <strong>{category.toUpperCase()}</strong></span>
                <button
                  type="button"
                  className="btn-close"
                  style={{ fontSize: '0.6rem' }}
                  onClick={() => handleCategorySelect('')}
                  aria-label="Remove category filter"
                />
              </span>
            )}
            {keyword && (
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill small">
                Từ khoá: "{keyword}"
              </span>
            )}
            {minPrice && (
              <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-2 rounded-pill small">
                Giá từ {Number(minPrice).toLocaleString('vi-VN')}₫
              </span>
            )}
            {maxPrice && (
              <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-2 rounded-pill small">
                Giá đến {Number(maxPrice).toLocaleString('vi-VN')}₫
              </span>
            )}
            {rating && (
              <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-2 rounded-pill small">
                Đánh giá: Từ {rating} sao
              </span>
            )}
            <button
              type="button"
              className="btn btn-link btn-sm text-danger text-decoration-none p-0 ms-1 fw-semibold"
              onClick={() => { window.location.href = '/'; }}
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>

      {/* PRODUCTS LIST HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-danger text-white fw-bold px-2 py-1 rounded-pill" style={{ fontSize: '0.75rem' }}>
              🔥 HOT DEALS
            </span>
            <h2 className="h4 fw-bold text-dark mb-0">
              {keyword ? `Kết quả tìm kiếm cho "${keyword}"` : 'Điện Thoại Nổi Bật &amp; Bán Chạy'}
            </h2>
          </div>
          {data.total > 0 && (
            <p className="text-muted small mb-0">
              Hiển thị <strong className="text-primary">{data.products.length}</strong> trên tổng số <strong>{data.total}</strong> mẫu smartphone chính hãng
            </p>
          )}
        </div>
      </div>

      {/* PRODUCTS DISPLAY */}
      {loading ? (
        <div className="text-center py-5 my-5">
          <div
            className="spinner-border text-primary"
            style={{ width: '3rem', height: '3rem' }}
            role="status"
          >
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3 text-muted fw-semibold">Đang tải danh sách điện thoại...</p>
        </div>
      ) : data.products && data.products.length > 0 ? (
        <>
          <div className="product-grid-modern">
            {data.products.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>

          {/* PAGINATION */}
          {data.pages > 1 && (
            <nav className="my-5 d-flex justify-content-center">
              <ul className="pagination gap-1">
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
                  <li
                    key={n}
                    className={`page-item ${n === data.page ? 'active' : ''}`}
                  >
                    <a
                      className="page-link"
                      style={{
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.5rem 0.85rem',
                        fontWeight: '600',
                      }}
                      href={`/?${new URLSearchParams({
                        page: n,
                        keyword,
                        category,
                        brand,
                        minPrice,
                        maxPrice,
                        rating,
                        sort,
                      }).toString()}`}
                    >
                      {n}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      ) : (
        <div
          className="text-center py-5 my-4 bg-white border rounded-4 p-5 shadow-sm"
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3 className="h4 fw-bold text-dark mb-2">Không tìm thấy sản phẩm nào</h3>
          <p className="text-muted mb-4">
            Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp với tiêu chí lọc của bạn. Hãy thử đổi từ khoá hoặc xoá các điều kiện lọc.
          </p>
          <button
            type="button"
            className="btn btn-primary px-4 py-2"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            ✕ Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
