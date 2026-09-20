import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ p }) {
  const imgSrc =
    (Array.isArray(p.images) && p.images[0]) ||
    p.image ||
    '';

  const installmentPerMonth = p.price ? Math.round(p.price / 12) : 0;

  return (
    <Link
      to={`/product/${p._id}`}
      className="product-card-modern"
    >
      {/* THUMBNAIL CONTAINER */}
      <div className="product-card-thumb-wrap">
        {p.brand && (
          <span className="product-badge-float">
            {p.brand}
          </span>
        )}

        {/* DISCOUNT BADGE */}
        <span className="product-badge-discount">
          -15%
        </span>

        {imgSrc ? (
          <img
            src={imgSrc}
            className="product-card-img"
            alt={p.name}
            loading="lazy"
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center text-muted" style={{ fontSize: '3.5rem' }}>
            📱
          </div>
        )}
      </div>

      {/* CARD BODY */}
      <div className="product-card-body">
        {/* INSTALLMENT PILL */}
        <div className="product-installment-tag">
          <span>💳</span> Trả góp 0%
        </div>

        <h3
          className="product-card-title"
          title={p.name}
        >
          {p.name}
        </h3>

        <div className="product-card-meta">
          <span className="product-rating-badge">
            ★ {p.rating ? p.rating.toFixed(1) : '5.0'}
          </span>
          <span className="text-muted small d-flex align-items-center gap-1">
            {p.quantity > 0 ? (
              <>
                <span className="status-dot-pulse online"></span>
                <span className="text-success fw-semibold ms-1">Còn hàng</span>
              </>
            ) : (
              <>
                <span className="status-dot-pulse offline"></span>
                <span className="text-danger fw-semibold ms-1">Tạm hết</span>
              </>
            )}
          </span>
        </div>

        {/* PRICE & INSTALLMENT */}
        <div className="product-card-price-wrap">
          <div className="product-card-price">
            {p.price ? p.price.toLocaleString('vi-VN') : 0} ₫
          </div>
          {installmentPerMonth > 0 && (
            <div className="product-card-installment-text">
              Trả góp chỉ từ <strong>{installmentPerMonth.toLocaleString('vi-VN')}₫</strong>/tháng
            </div>
          )}
        </div>

        {/* ACTION BUTTON */}
        <div className="product-card-btn btn-shine">
          <span>Xem chi tiết →</span>
        </div>
      </div>
    </Link>
  );
}
