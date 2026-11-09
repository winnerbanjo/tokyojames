'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import defaults from '@/data/site_content.json';
import { useCurrency } from '@/context/CurrencyContext';

export default function HomePage() {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState('');
  const [heroContent, setHeroContent] = useState(defaults.hero);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message || 'Unable to load the collection.');
        setProducts(data.data);
      })
      .catch(err => setError(err.message)).finally(() => setLoading(false));

    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.hero) {
          setHeroContent(data.data.hero);
        }
      })
      .catch(err => console.error('Error loading hero content:', err));
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const heroVideoUrl = heroContent.videoUrl || '/videos/hero_video.mp4';
  const heroPoster = heroContent.posterImage || '/images/hero_poster.jpg';
  const bannerImage = heroContent.bannerImage || '/images/tj_drive_1.jpg';
  const bannerHeadline = heroContent.bannerHeadline || 'TOKYO JAMES Collection';
  const bannerBtnText = heroContent.bannerBtnText || 'Shop now';

  const openVideo = (url) => {
    setActiveVideoUrl(url);
    setIsVideoModalOpen(true);
  };

  const handleQuickAdd = (p, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const sizeToUse = (p.sizes && p.sizes.length) ? p.sizes[0] : 'Medium';
    const event = new CustomEvent('tj-add-to-cart', {
      detail: {
        id: p.id,
        title: p.title,
        size: sizeToUse,
        priceEUR: p.priceEUR,
        quantity: 1,
        image: p.primaryImage
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <div>
      {/* HERO CAMPAIGN VIDEO SECTION */}
      <section className="video-section-container" id="section-hero">
        <video
          className="video-section__bg-video"
          autoPlay
          muted
          loop
          playsInline
          poster={heroPoster}
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
        <div className="video-section__overlay"></div>

        <div className="video-section__content">
          <div className="video-section__actions">
            <a href="/#collections" className="btn-hero-action">
              {heroContent.primaryBtnText || 'Explore'}
            </a>
            <button
              className="btn-hero-action"
              onClick={() => openVideo(heroVideoUrl)}
            >
              {heroContent.secondaryBtnText || 'Watch Film'}
            </button>
          </div>
        </div>
      </section>

      {/* BANNER 2: EDITORIAL BANNER */}
      <section className="hero-banner__image-wrapper">
        <img
          src={bannerImage}
          alt={bannerHeadline}
          className="hero-banner__img"
        />
        <div className="hero-banner__overlay"></div>
        <div className="hero-banner__content">
          <h2 className="hero-banner__title">{bannerHeadline}</h2>
          <a href="/#collections" className="btn-hero-action">
            {bannerBtnText}
          </a>
        </div>
      </section>

      {/* COLLECTION GRID & FILTER TABS */}
      <section className="collection-section" id="collections">
        <div className="collection-tabs-scroll-container">
          <div className="collection-tabs-scroll">
            <button
              className={`tab-btn-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            <button
              className={`tab-btn-pill ${activeCategory === 'tailoring' ? 'active' : ''}`}
              onClick={() => setActiveCategory('tailoring')}
            >
              Tailoring
            </button>
            <button
              className={`tab-btn-pill ${activeCategory === 'jackets' ? 'active' : ''}`}
              onClick={() => setActiveCategory('jackets')}
            >
              Jackets
            </button>
            <button
              className={`tab-btn-pill ${activeCategory === 'polos' ? 'active' : ''}`}
              onClick={() => setActiveCategory('polos')}
            >
              Polos
            </button>
            <button
              className={`tab-btn-pill ${activeCategory === 'trousers' ? 'active' : ''}`}
              onClick={() => setActiveCategory('trousers')}
            >
              Trousers
            </button>
            <button
              className={`tab-btn-pill ${activeCategory === 'knitwear' ? 'active' : ''}`}
              onClick={() => setActiveCategory('knitwear')}
            >
              Knitwear
            </button>
            <button
              className={`tab-btn-pill ${activeCategory === 'accessories' ? 'active' : ''}`}
              onClick={() => setActiveCategory('accessories')}
            >
              Accessories
            </button>
            <button
              className={`tab-btn-pill ${activeCategory === 'sale' ? 'active' : ''}`}
              onClick={() => setActiveCategory('sale')}
              style={{ color: 'var(--color-sale)' }}
            >
              Archive sale
            </button>
          </div>
        </div>

        {loading && <p role="status">Loading collection…</p>}
        {error && <p role="alert">The collection is temporarily unavailable. Please try again shortly.</p>}
        {!loading && !error && filteredProducts.length === 0 && <p style={{ padding: '48px 20px', textAlign: 'center' }}>New pieces are coming soon.</p>}
        <div className="product-grid">
          {filteredProducts.map((p, idx) => {
            const alternateImages = [
              '/images/tj_drive_2.png',
              '/images/tj_drive_4.jpg',
              '/images/tj_drive_5.jpg',
              '/images/tj_drive_6.jpg',
              '/images/tj_drive_7.jpg',
              '/images/tj_drive_1.jpg'
            ];
            const hasDistinctSecondary = p.secondaryImage && p.secondaryImage !== p.primaryImage;
            const hoverImage = hasDistinctSecondary ? p.secondaryImage : alternateImages[idx % alternateImages.length];

            return (
              <div key={p.id} className="grid-view-item">
                <Link href={`/product/${p.id}`} className="grid-view-item__link">
                  <div className="grid-view-item__image-wrapper">
                    {p.badge && (
                      <span className={`badge ${p.badgeClass}`}>
                        {p.badge}
                      </span>
                    )}
                    <img
                      src={p.primaryImage}
                      alt={p.title}
                      className="grid-view-item__image primary"
                      loading="lazy"
                    />
                    <img
                      src={hoverImage}
                      alt={`${p.title} - Runway View`}
                      className="grid-view-item__image secondary"
                      loading="lazy"
                    />
                    {/* QUICK ADD TO CART BUTTON ON HOVER */}
                    <button
                      type="button"
                      className="quick-add-btn"
                      onClick={(e) => handleQuickAdd(p, e)}
                      aria-label={`Add ${p.title} to bag`}
                    >
                      + Quick Add to Cart
                    </button>
                  </div>
                </Link>

                <div className="grid-view-item__meta">
                  <Link href={`/product/${p.id}`} className="grid-view-item__title">
                    {p.title}
                  </Link>

                  <div className="product-price">
                    {p.originalPriceEUR ? (
                      <>
                        <span className="product-price__sale">
                          {formatPrice(p.originalPriceEUR)}
                        </span>
                        <span style={{ color: 'var(--color-sale)' }}>
                          {formatPrice(p.priceEUR)}
                        </span>
                      </>
                    ) : (
                      <span>{formatPrice(p.priceEUR)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* VIDEO LIGHTBOX MODAL */}
      {isVideoModalOpen && (
        <div
          className="modal-overlay is-open"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="modal-content"
            style={{ maxWidth: '960px', background: '#000', padding: '0', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="modal-close-btn"
              style={{ color: '#fff', top: '12px', right: '16px', zIndex: 10 }}
              onClick={() => setIsVideoModalOpen(false)}
            >
              ✕
            </span>
            <video controls autoPlay style={{ width: '100%', height: 'auto', display: 'block' }}>
              <source src={activeVideoUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

    </div>
  );
}
