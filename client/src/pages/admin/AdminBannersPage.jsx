import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import AdminNav from '../../components/AdminNav.jsx';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    link: '',
    order: 0,
    isActive: true,
    duration: 5000,
  });

  const loadBanners = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/banners/admin');
      setBanners(data);
    } catch (e) {
      console.error(e);
      alert('Lỗi khi tải banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        imageUrl: banner.imageUrl,
        link: banner.link || '',
        order: banner.order || 0,
        isActive: banner.isActive,
        duration: banner.duration || 5000,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        imageUrl: '',
        link: '',
        order: banners.length,
        isActive: true,
        duration: 5000,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await api.put(`/banners/admin/${editingBanner._id}`, formData);
        alert('✓ Cập nhật banner thành công!');
      } else {
        await api.post('/banners/admin', formData);
        alert('✓ Thêm banner thành công!');
      }
      handleCloseModal();
      loadBanners();
    } catch (e) {
      console.error(e);
      alert('❌ Lỗi khi lưu banner');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa banner này?')) return;
    try {
      await api.delete(`/banners/admin/${id}`);
      alert('✓ Xóa banner thành công!');
      loadBanners();
    } catch (e) {
      console.error(e);
      alert('❌ Lỗi khi xóa banner');
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('image', file);

    try {
      const { data } = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      alert('✓ Upload ảnh thành công!');
    } catch (e) {
      console.error(e);
      alert('❌ Lỗi khi upload ảnh');
    }
  };

  return (
    <div className="container my-4 my-md-5">
      {/* HEADER */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1 text-dark">
            🎨 Quản Lý Banners
          </h1>
          <p className="text-muted small mb-0">
            Tùy chỉnh hình ảnh banner quảng cáo trên trang chủ, link liên kết và thời gian trượt
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm px-3 py-2 fw-bold"
          onClick={() => handleOpenModal()}
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          + Thêm Banner Mới
        </button>
      </div>

      {/* ADMIN SUBNAV */}
      <AdminNav />

      {loading ? (
        <div className="text-center py-5 my-5">
          <div className="spinner-border text-primary spinner-border-sm" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3 text-muted">Đang tải danh sách banner...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
          <h5 className="fw-bold mb-2">Chưa có banner nào</h5>
          <p className="text-muted small mb-3">Tạo banner đầu tiên để hiển thị trên slider trang chủ.</p>
          <button className="btn btn-primary btn-sm px-3" onClick={() => handleOpenModal()}>
            + Thêm Banner Đầu Tiên
          </button>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="p-3 bg-light border-bottom">
            <h5 className="h6 fw-bold mb-0 text-dark">
              Danh sách banners ({banners.length})
            </h5>
          </div>

          <div className="p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th style={{ width: '80px' }}>Thứ tự</th>
                    <th style={{ width: '220px' }}>Ảnh xem trước</th>
                    <th>Link liên kết</th>
                    <th className="text-center">Thời gian</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-end" style={{ width: '130px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner) => (
                    <tr key={banner._id}>
                      <td>
                        <span className="badge bg-light text-dark border fw-bold">
                          #{banner.order}
                        </span>
                      </td>
                      <td>
                        <div
                          style={{
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            border: '1px solid var(--border)',
                            maxHeight: '70px',
                            background: '#0f172a',
                          }}
                        >
                          <img
                            src={banner.imageUrl}
                            alt={banner.title || 'Banner'}
                            style={{ width: '100%', height: '65px', objectFit: 'cover' }}
                          />
                        </div>
                      </td>
                      <td>
                        {banner.link ? (
                          <a
                            href={banner.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-decoration-none small text-truncate d-inline-block"
                            style={{ maxWidth: '200px' }}
                          >
                            🔗 {banner.link}
                          </a>
                        ) : (
                          <span className="text-muted small">— Không đặt link</span>
                        )}
                      </td>
                      <td className="text-center">
                        <span className="badge bg-info bg-opacity-10 text-info border border-info small">
                          {(banner.duration / 1000).toFixed(1)}s
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            banner.isActive
                              ? 'bg-success bg-opacity-10 text-success'
                              : 'bg-secondary bg-opacity-10 text-secondary'
                          }`}
                        >
                          {banner.isActive ? '✓ Hoạt động' : '✕ Tắt'}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary py-1 px-2 me-1"
                          style={{ fontSize: '0.8rem' }}
                          onClick={() => handleOpenModal(banner)}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger py-1 px-2"
                          style={{ fontSize: '0.8rem' }}
                          onClick={() => handleDelete(banner._id)}
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="p-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                <h5 className="modal-title fw-bold text-dark mb-0">
                  {editingBanner ? '✏️ Chỉnh sửa Banner' : '➕ Thêm Banner Mới'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Hình ảnh Banner *</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        required
                        placeholder="Nhập URL ảnh hoặc bấm Upload từ máy"
                      />
                      <label className="btn btn-outline-secondary">
                        📁 Chọn file
                        <input
                          type="file"
                          className="d-none"
                          accept="image/*"
                          onChange={handleUploadImage}
                        />
                      </label>
                    </div>
                    {formData.imageUrl && (
                      <div className="mt-2 p-2 border rounded-3 text-center bg-dark">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '180px',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Link dẫn khi click vào banner (Tùy chọn)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.link}
                      onChange={(e) =>
                        setFormData({ ...formData, link: e.target.value })
                      }
                      placeholder="VD: /?brand=Apple hoặc /product/64a..."
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-bold">Thời gian trượt (giây)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.duration / 1000}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            duration: Number(e.target.value) * 1000,
                          })
                        }
                        min="1"
                        step="0.5"
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-bold">Thứ tự ưu tiên</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: Number(e.target.value) })
                        }
                        min="0"
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-bold">Trạng thái</label>
                      <div className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="bannerActiveSwitch"
                          checked={formData.isActive}
                          onChange={(e) =>
                            setFormData({ ...formData, isActive: e.target.checked })
                          }
                        />
                        <label className="form-check-label small fw-bold" htmlFor="bannerActiveSwitch">
                          {formData.isActive ? 'Đang kích hoạt' : 'Tạm ẩn'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-light border-top d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleCloseModal}
                  >
                    Hủy bỏ
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm px-3">
                    {editingBanner ? '✓ Lưu thay đổi' : '+ Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
