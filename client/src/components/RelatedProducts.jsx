import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';
import ProductCard from './ProductCard.jsx';

export default function RelatedProducts({ currentProductId, category, brand }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRelated() {
      try {
        setLoading(true);
        const { data } = await api.get('/products', {
          params: {
            category: category || '',
            brand: brand || '',
            limit: 5,
          },
        });

        const filtered = data.products
          ?.filter((p) => p._id !== currentProductId)
          .slice(0, 4);

        setProducts(filtered || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (currentProductId) {
      loadRelated();
    }
  }, [currentProductId, category, brand]);

  if (loading) {
    return null;
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 pt-4 border-top">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="h5 fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <span>✨</span> Có thể bạn cũng thích
          </h4>
          <p className="text-muted small mb-0">Các sản phẩm cùng thương hiệu hoặc phân khúc</p>
        </div>
      </div>

      <div className="product-grid-modern">
        {products.map((p) => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>
    </div>
  );
}
