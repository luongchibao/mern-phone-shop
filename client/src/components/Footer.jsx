import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* BRAND COLUMN */}
          <div className="col-12 col-lg-4 pe-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="brand-icon-wrapper" style={{ width: '36px', height: '36px', fontSize: '1.1rem' }}>
                📱
              </div>
              <span className="h4 fw-bold text-white mb-0">Phone DZ</span>
            </div>
            <p className="text-light small mb-3" style={{ lineHeight: '1.7' }}>
              Hệ thống bán lẻ điện thoại di động, smartphone cao cấp &amp; phụ kiện công nghệ chính hãng hàng đầu Việt Nam. Cam kết chất lượng, bảo hành tận tâm và giá tốt nhất thị trường.
            </p>
            <div className="d-flex flex-column gap-2 small text-light mb-4">
              <div>📍 <strong>Địa chỉ:</strong> 123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh</div>
              <div>📞 <strong>Hotline CSKH:</strong> <span className="text-white fw-bold">1800 6868</span> (8h - 22h)</div>
              <div>✉️ <strong>Email:</strong> support@phonedz.vn</div>
            </div>
            {/* PAYMENT BADGES */}
            <div>
              <div className="small fw-bold text-white mb-2">Phương thức thanh toán chấp nhận:</div>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-secondary bg-opacity-25 border border-secondary text-light px-2 py-1">💵 Tiền mặt (COD)</span>
                <span className="badge bg-secondary bg-opacity-25 border border-secondary text-light px-2 py-1">💳 Visa / Master</span>
                <span className="badge bg-secondary bg-opacity-25 border border-secondary text-light px-2 py-1">🏦 Chuyển khoản</span>
                <span className="badge bg-secondary bg-opacity-25 border border-secondary text-light px-2 py-1">📱 VNPay / MoMo</span>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="col-6 col-sm-4 col-lg-2">
            <div className="footer-section">
              <h5>Về chúng tôi</h5>
              <ul>
                <li><Link to="/">Giới thiệu công ty</Link></li>
                <li><Link to="/">Hệ thống cửa hàng</Link></li>
                <li><Link to="/">Tin công nghệ &amp; Đánh giá</Link></li>
                <li><Link to="/">Cơ hội nghề nghiệp</Link></li>
                <li><Link to="/">Liên hệ hợp tác</Link></li>
              </ul>
            </div>
          </div>

          {/* CUSTOMER SUPPORT */}
          <div className="col-6 col-sm-4 col-lg-3">
            <div className="footer-section">
              <h5>Hỗ trợ khách hàng</h5>
              <ul>
                <li><Link to="/">Hướng dẫn mua hàng online</Link></li>
                <li><Link to="/">Chính sách bảo hành &amp; đổi trả</Link></li>
                <li><Link to="/">Chính sách giao hàng &amp; lắp đặt</Link></li>
                <li><Link to="/">Quy định bảo mật thông tin</Link></li>
                <li><Link to="/">Tra cứu đơn hàng trực tuyến</Link></li>
              </ul>
            </div>
          </div>

          {/* SOCIAL & CONNECT */}
          <div className="col-12 col-sm-4 col-lg-3">
            <div className="footer-section">
              <h5>Kết nối cùng Phone DZ</h5>
              <p className="small text-light mb-3">
                Theo dõi các kênh mạng xã hội để cập nhật chương trình khuyến mãi sớm nhất.
              </p>
              <div className="d-flex gap-2 mb-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-sm text-light border-secondary"
                  style={{ width: '38px', height: '38px', padding: 0 }}
                  title="Facebook"
                >
                  f
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-sm text-light border-secondary"
                  style={{ width: '38px', height: '38px', padding: 0 }}
                  title="YouTube"
                >
                  ▶
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-sm text-light border-secondary"
                  style={{ width: '38px', height: '38px', padding: 0 }}
                  title="TikTok"
                >
                  🎵
                </a>
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-sm text-light border-secondary"
                  style={{ width: '38px', height: '38px', padding: 0 }}
                  title="Zalo"
                >
                  Z
                </a>
              </div>
              <div className="p-3 bg-secondary bg-opacity-10 border border-secondary border-opacity-25 rounded-3">
                <div className="fw-bold text-white small mb-1">🎁 Nhận Voucher 100.000₫</div>
                <div className="text-light" style={{ fontSize: '0.775rem' }}>
                  Đăng ký tài khoản thành viên ngay hôm nay để nhận voucher giảm giá cho đơn hàng đầu tiên!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} <strong>Phone DZ Shop</strong>. Tất cả quyền được bảo lưu. Thiết kế giao diện cao cấp.
          </p>
          <div className="d-flex gap-3 text-light small">
            <Link to="/" className="text-light text-decoration-none">Điều khoản sử dụng</Link>
            <span>•</span>
            <Link to="/" className="text-light text-decoration-none">Chính sách bảo mật</Link>
            <span>•</span>
            <Link to="/" className="text-light text-decoration-none">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
