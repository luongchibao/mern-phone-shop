import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import AdminNav from '../../components/AdminNav.jsx';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    backgroundUrl: '',
    backgroundColor: '#ffffff',
    logoUrl: '',
    siteName: 'Phone DZ',
    siteNameColor: '#ffffff',
  });
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [logoPreviewUrl, setLogoPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('site-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        setPreviewUrl(parsed.backgroundUrl || '');
        setLogoPreviewUrl(parsed.logoUrl || '');
        applyBackground(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const applyBackground = (bg) => {
    if (bg.backgroundUrl) {
      document.body.style.background = `url('${bg.backgroundUrl}') center/cover no-repeat fixed`;
    } else if (bg.backgroundColor) {
      document.body.style.background = bg.backgroundColor;
    }
  };

  const handleColorChange = (e) => {
    const newBg = { ...settings, backgroundColor: e.target.value, backgroundUrl: '' };
    setSettings(newBg);
    setPreviewUrl('');
    applyBackground(newBg);
  };

  const handleUrlChange = (e) => {
    setPreviewUrl(e.target.value);
  };

  const applyUrl = () => {
    if (!previewUrl.trim()) {
      alert('Vui lòng nhập URL ảnh');
      return;
    }
    const newBg = { ...settings, backgroundUrl: previewUrl };
    setSettings(newBg);
    applyBackground(newBg);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('❌ Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = data.url || data.path;
      const newBg = { ...settings, backgroundUrl: imageUrl };
      setSettings(newBg);
      setPreviewUrl(imageUrl);
      applyBackground(newBg);
      alert('✓ Upload ảnh thành công!');
    } catch (err) {
      console.error(err);
      alert('❌ Upload ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('❌ Kích thước logo không được vượt quá 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('❌ Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const logoUrl = data.url || data.path;
      const newSettings = { ...settings, logoUrl };
      setSettings(newSettings);
      setLogoPreviewUrl(logoUrl);
      alert('✓ Upload logo thành công!');
    } catch (err) {
      console.error(err);
      alert('❌ Upload logo thất bại');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      localStorage.setItem('site-settings', JSON.stringify(settings));
      alert('✓ Lưu cài đặt thành công!');
    } catch (err) {
      console.error(err);
      alert('❌ Lưu cài đặt thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const defaultBg = {
      backgroundUrl: '',
      backgroundColor: '#f8fafc',
      logoUrl: '',
      siteName: 'Phone DZ',
      siteNameColor: '#ffffff',
    };
    setSettings(defaultBg);
    setPreviewUrl('');
    setLogoPreviewUrl('');
    applyBackground(defaultBg);
    localStorage.setItem('site-settings', JSON.stringify(defaultBg));
    alert('✓ Reset cài đặt mặc định!');
  };

  return (
    <div className="container my-4 my-md-5">
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1 text-dark">
          ⚙️ Cài Đặt Giao Diện Website
        </h1>
        <p className="text-muted small">
          Tùy biến Logo thương hiệu, tên shop hiển thị và hình nền website
        </p>
      </div>

      {/* ADMIN SUBNAV */}
      <AdminNav />

      <div className="row g-4">
        {/* SETTINGS FORM */}
        <div className="col-12 col-lg-6">
          {/* LOGO & BRAND CARD */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <h5 className="h6 fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <span>📱</span> Logo &amp; Tên thương hiệu
            </h5>

            <div className="mb-3">
              <label className="form-label small fw-bold">Tên website hiển thị</label>
              <input
                type="text"
                className="form-control"
                placeholder="Phone DZ"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Màu chữ tên website (trên thanh Header)</label>
              <div className="d-flex align-items-center gap-3">
                <input
                  type="color"
                  className="form-control form-control-color"
                  style={{ width: '50px', height: '40px', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                  value={settings.siteNameColor}
                  onChange={(e) => setSettings({ ...settings, siteNameColor: e.target.value })}
                />
                <span className="fw-semibold small text-dark">{settings.siteNameColor}</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Upload Logo mới</label>
              <input
                type="file"
                className="form-control form-control-sm"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
              />
              <small className="text-muted d-block mt-1">
                {uploadingLogo ? '⏳ Đang tải logo...' : 'Định dạng PNG/SVG nền trong suốt là tốt nhất'}
              </small>
            </div>

            {logoPreviewUrl && (
              <div className="p-3 bg-dark rounded-3 text-center mb-2">
                <img
                  src={logoPreviewUrl}
                  alt="Logo Preview"
                  style={{ maxHeight: '50px', maxWidth: '180px', objectFit: 'contain' }}
                />
                <div className="mt-2">
                  <button
                    className="btn btn-outline-danger btn-sm py-0 px-2"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => {
                      setSettings({ ...settings, logoUrl: '' });
                      setLogoPreviewUrl('');
                    }}
                  >
                    Xóa logo hiện tại
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BACKGROUND CUSTOMIZATION */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="h6 fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <span>🎨</span> Tùy chỉnh Background trang web
            </h5>

            <div className="mb-3">
              <label className="form-label small fw-bold">Upload hình nền (từ máy)</label>
              <input
                type="file"
                className="form-control form-control-sm"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <small className="text-muted d-block mt-1">
                {uploading ? '⏳ Đang tải ảnh...' : 'Dung lượng tối đa: 5MB (JPG, PNG)'}
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Hoặc nhập link ảnh trực tiếp</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={previewUrl}
                  onChange={handleUrlChange}
                />
                <button className="btn btn-outline-primary" type="button" onClick={applyUrl}>
                  Áp dụng
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">Màu nền đơn sắc (Solid background)</label>
              <div className="d-flex align-items-center gap-3">
                <input
                  type="color"
                  className="form-control form-control-color"
                  style={{ width: '50px', height: '40px', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                  value={settings.backgroundColor}
                  onChange={handleColorChange}
                  disabled={!!settings.backgroundUrl}
                />
                <span className="small text-muted">
                  {settings.backgroundUrl
                    ? '(Đang ưu tiên hiển thị ảnh nền)'
                    : settings.backgroundColor}
                </span>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-primary btn-sm flex-grow-1 py-2 fw-bold"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '⏳ Đang lưu...' : '✓ Lưu Cài Đặt'}
              </button>
              <button
                className="btn btn-outline-secondary btn-sm px-3"
                onClick={handleReset}
              >
                Khôi phục mặc định
              </button>
            </div>
          </div>
        </div>

        {/* PREVIEW CARD */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white h-100">
            <div className="p-3 bg-light border-bottom">
              <h5 className="h6 fw-bold mb-0 text-dark">
                👀 Xem trước nền hiển thị
              </h5>
            </div>
            <div className="card-body p-0">
              <div
                style={{
                  minHeight: '400px',
                  background: settings.backgroundUrl
                    ? `url('${settings.backgroundUrl}') center/cover no-repeat`
                    : settings.backgroundColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  padding: '2rem',
                }}
              >
                <div className="p-4 bg-white bg-opacity-75 rounded-4 shadow-sm text-center" style={{ backdropFilter: 'blur(10px)', maxWidth: '320px' }}>
                  <h4 className="fw-bold mb-1" style={{ color: settings.siteNameColor === '#ffffff' ? '#0f172a' : settings.siteNameColor }}>
                    {settings.siteName}
                  </h4>
                  <p className="text-muted small mb-0">
                    {settings.backgroundUrl ? 'Đang dùng hình nền tùy chỉnh' : `Màu nền: ${settings.backgroundColor}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
