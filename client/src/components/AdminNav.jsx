import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminNav() {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: '📊 Tổng quan', exact: true },
    { path: '/admin/products', label: '📦 Sản phẩm' },
    { path: '/admin/orders', label: '📋 Đơn hàng' },
    { path: '/admin/users', label: '👥 Người dùng' },
    { path: '/admin/reviews', label: '💬 Đánh giá' },
    { path: '/admin/banners', label: '🖼️ Banners' },
    { path: '/admin/settings', label: '⚙️ Cài đặt' },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="mb-4">
      <div className="d-flex flex-wrap gap-2 p-2 bg-white border rounded-4 shadow-sm">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`btn btn-sm ${
                active ? 'btn-primary text-white fw-bold' : 'btn-light text-dark'
              }`}
              style={{
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 0.95rem',
                transition: 'all 0.2s ease',
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
