import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import AdminNav from '../../components/AdminNav.jsx';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
  });
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoadingProducts(true);
        const { data } = await api.get('/products', { params: { limit: 100 } });
        setProducts(data.products || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProducts(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageUrl(data.url);
    } catch (err) {
      console.error(err);
      alert('Upload ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.brand || !form.category) {
      alert('Vui lòng nhập tên, giá, thương hiệu, danh mục');
      return;
    }

    try {
      setCreating(true);

      const payload = {
        name: form.name,
        description: form.description || form.name,
        price: Number(form.price),
        category: form.category,
        brand: form.brand,
        quantity: Number(form.quantity || 0),
        images: imageUrl ? [imageUrl] : [],
      };

      const { data } = await api.post('/products', payload);
      setProducts((prev) => [data, ...prev]);

      setForm({
        name: '',
        brand: '',
        category: '',
        price: '',
        quantity: '',
        description: '',
      });
      setImageUrl('');
      alert('✓ Thêm sản phẩm thành công!');
    } catch (err) {
      console.error(err);
      alert('Thêm sản phẩm thất bại');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setDeleteConfirm(null);
      alert('✓ Xoá sản phẩm thành công!');
    } catch (err) {
      console.error(err);
      alert('❌ Xoá sản phẩm thất bại');
    }
  };

  return (
    <div className="container my-4 my-md-5">
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1 text-dark">
          📦 Quản Lý Sản Phẩm
        </h1>
        <p className="text-muted small">
          Thêm mới, sửa đổi thông tin hoặc xóa các sản phẩm trong hệ thống
        </p>
      </div>

      {/* ADMIN SUBNAV */}
      <AdminNav />

      <div className="row g-4">
        {/* PRODUCT LIST */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
              <h5 className="h6 fw-bold mb-0 text-dark">
                Danh sách sản phẩm ({products.length})
              </h5>
            </div>

            <div className="p-0" style={{ maxHeight: '750px', overflowY: 'auto' }}>
              {loadingProducts ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary spinner-border-sm" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <p>Chưa có sản phẩm nào trong kho.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Hãng</th>
                        <th className="text-end">Đơn giá</th>
                        <th className="text-center">Kho</th>
                        <th className="text-center" style={{ width: '60px' }}>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => {
                        const img = (Array.isArray(p.images) && p.images[0]) || p.image || '';
                        return (
                          <tr key={p._id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  style={{
                                    width: '42px',
                                    height: '42px',
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
                                  {img ? (
                                    <img
                                      src={img}
                                      alt={p.name}
                                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                  ) : (
                                    <span>📱</span>
                                  )}
                                </div>
                                <div>
                                  <div className="fw-semibold text-dark small text-truncate" style={{ maxWidth: '170px' }}>
                                    {p.name}
                                  </div>
                                  <small className="text-muted">{p.category}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-secondary border small">
                                {p.brand}
                              </span>
                            </td>
                            <td className="text-end fw-bold text-primary small">
                              {p.price?.toLocaleString('vi-VN')} ₫
                            </td>
                            <td className="text-center">
                              <span className={`badge ${p.quantity > 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                                {p.quantity}
                              </span>
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger p-1"
                                onClick={() => setDeleteConfirm(p)}
                                title="Xóa sản phẩm"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ADD PRODUCT FORM */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="h6 fw-bold mb-3 text-dark pb-2 border-bottom d-flex align-items-center gap-2">
              <span>➕</span> Thêm sản phẩm mới
            </h5>

            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Tên sản phẩm *</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="VD: iPhone 16 Pro Max 256GB"
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold">Thương hiệu *</label>
                  <input
                    className="form-control"
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="VD: Apple"
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">Hệ điều hành / Loại *</label>
                  <input
                    className="form-control"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="VD: ios hoặc android"
                    required
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold">Giá bán (₫) *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="34990000"
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">Số lượng tồn kho</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Mô tả sản phẩm</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Mô tả các tính năng nổi bật..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Hình ảnh sản phẩm</label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {uploading && (
                  <small className="text-primary mt-1 d-block">
                    📤 Đang tải ảnh lên server...
                  </small>
                )}
                {imageUrl && (
                  <div className="mt-2 p-2 border rounded-3 bg-light text-center">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold"
                disabled={creating || uploading}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                {creating ? '⏳ Đang lưu sản phẩm...' : '✓ Thêm Sản Phẩm'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="p-4">
                <h5 className="fw-bold text-danger mb-2">⚠️ Xác nhận xóa sản phẩm</h5>
                <p className="text-muted mb-4">
                  Bạn có chắc chắn muốn xóa sản phẩm <strong>"{deleteConfirm.name}"</strong>? Thao tác này không thể hoàn tác.
                </p>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProduct(deleteConfirm._id)}
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
