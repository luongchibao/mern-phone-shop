import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';

// Import real promotional banner images from assets/images
import ip16Img from '../../assets/images/ip16.jpeg';
import s24Img from '../../assets/images/ssS24.jpg';
import flashsaleImg from '../../assets/images/flashsale.jpg';

const DEFAULT_BANNERS = [
  {
    _id: 'default-1',
    imageUrl: ip16Img,
    title: 'iPhone 16 Pro | Pro Max - Giá Tốt Nhất',
    link: '/?brand=Apple',
    duration: 5000,
  },
  {
    _id: 'default-2',
    imageUrl: s24Img,
    title: 'Samsung Galaxy S24 Ultra - Đỉnh Cao Công Nghệ',
    link: '/?brand=Samsung',
    duration: 5000,
  },
  {
    _id: 'default-3',
    imageUrl: flashsaleImg,
    title: 'Đại Tiệc Flash Sale Giảm Đến 40%',
    link: '/',
    duration: 5000,
  },
];

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [currentDuration, setCurrentDuration] = useState(5000);

  useEffect(() => {
    async function loadBanners() {
      try {
        const { data } = await api.get('/banners');
        setBanners(data);
        if (data.length > 0) {
          setCurrentDuration(data[0].duration || 5000);
        }
      } catch (err) {
        console.error('Error loading banners:', err);
      }
    }
    loadBanners();
  }, []);

  const activeBanners = banners && banners.length > 0 ? banners : DEFAULT_BANNERS;

  // Auto slide with dynamic duration per banner
  useEffect(() => {
    if (!isAutoPlaying || activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % activeBanners.length;
        setCurrentDuration(activeBanners[nextIndex].duration || 5000);
        return nextIndex;
      });
    }, currentDuration);

    return () => clearInterval(interval);
  }, [isAutoPlaying, activeBanners.length, currentDuration]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setCurrentDuration(activeBanners[index].duration || 5000);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    const prevIndex = (currentIndex - 1 + activeBanners.length) % activeBanners.length;
    setCurrentIndex(prevIndex);
    setCurrentDuration(activeBanners[prevIndex].duration || 5000);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % activeBanners.length;
    setCurrentIndex(nextIndex);
    setCurrentDuration(activeBanners[nextIndex].duration || 5000);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div
      className="position-relative overflow-hidden mb-4"
      style={{
        borderRadius: 'var(--radius-2xl)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        backgroundColor: '#0f172a',
      }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides Container */}
      <div
        className="d-flex"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {activeBanners.map((banner) => (
          <div
            key={banner._id}
            style={{
              minWidth: '100%',
              position: 'relative',
              backgroundColor: '#0f172a',
            }}
          >
            {banner.link ? (
              <a href={banner.link} style={{ display: 'block', width: '100%' }}>
                <img
                  src={banner.imageUrl}
                  alt={banner.title || 'Khuyến mãi Phone DZ'}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '440px',
                    minHeight: '220px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </a>
            ) : (
              <img
                src={banner.imageUrl}
                alt={banner.title || 'Khuyến mãi Phone DZ'}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '440px',
                  minHeight: '220px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="btn position-absolute top-50 start-0 translate-middle-y ms-3 d-flex align-items-center justify-content-center"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 10,
              fontSize: '1.4rem',
              transition: 'all 0.2s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(79, 70, 229, 0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.65)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
            aria-label="Previous Slide"
          >
            ‹
          </button>

          <button
            onClick={goToNext}
            className="btn position-absolute top-50 end-0 translate-middle-y me-3 d-flex align-items-center justify-content-center"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 10,
              fontSize: '1.4rem',
              transition: 'all 0.2s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(79, 70, 229, 0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.65)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
            aria-label="Next Slide"
          >
            ›
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {activeBanners.length > 1 && (
        <div
          className="position-absolute bottom-0 start-50 translate-middle-x mb-3"
          style={{ zIndex: 10 }}
        >
          <div
            className="d-flex align-items-center gap-2 px-3 py-1"
            style={{
              background: 'rgba(15, 23, 42, 0.55)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: currentIndex === index ? '26px' : '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background: currentIndex === index ? '#ffffff' : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
