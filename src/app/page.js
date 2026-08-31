'use client';

import { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

export default function HomePage() {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState('');
  const [heroContent, setHeroContent] = useState({
    headline: 'DARK WATERS AW24',
    subheadline: 'The New Autumn / Winter Runway Collection by Ina Adenugba',
    primaryBtnText: 'Details',
    secondaryBtnText: 'Full Look Video'
  });

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.data);
      })
      .catch(err => console.error('Error loading products:', err));

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

  const openVideo = (url) => {
    setActiveVideoUrl(url);
    setIsVideoModalOpen(true);
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
          poster="/images/tj_drive_4.jpg"
        >
          <source src="/videos/tj_campaign_3.mp4" type="video/mp4" />
        </video>
        <div className="video-section__overlay"></div>

        <div className="video-section__content">
          <h1 className="video-section__title">{heroContent.headline || 'DARK WATERS AW24'}</h1>
          <div className="video-section__actions">
            <a href="/#collections" className="btn-hero-action">
              {heroContent.primaryBtnText || 'Details'}
            </a>
            <button 
              className="btn-hero-action" 
              onClick={() => openVideo('/videos/tj_campaign_3.mp4')}
            >
              {heroContent.secondaryBtnText || 'Full Look Video'}
            </button>
          </div>
        </div>
      </section>

      {/* BANNER 2: FW23 RUNWAY */}
      <section className="hero-banner__image-wrapper">
        <img 
          src="/images/tj_drive_1.jpg" 
          alt="Current Collection FW23" 
          className="hero-banner__img" 
        />
        <div className="hero-banner__overlay"></div>
        <div className="hero-banner__content">
          <h2 className="hero-banner__title">Current Collection FW23</h2>
          <a href="/#collections" className="btn-hero-action">
            Shop now
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

        <div className="product-grid">
          {filteredProducts.map(p => (
            <div key={p.id} className="grid-view-item">
              <a href={`/product/${p.id}`}>
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
                  />
                  <img 
                    src={p.secondaryImage || p.primaryImage} 
                    alt={p.title} 
                    className="grid-view-item__image secondary" 
                  />
                </div>
              </a>

              <div className="grid-view-item__meta">
                <a href={`/product/${p.id}`} className="grid-view-item__title">
                  {p.title}
                </a>

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
          ))}
        </div>
      </section>

      {/* BRAND WORLD VIDEO BANNER */}
      <section className="brand-world-container">
        <video 
          className="brand-world__bg-video" 
          autoPlay 
          muted 
          loop 
          playsInline 
          poster="/images/tj_drive_2.jpg"
        >
          <source src="/videos/tj_campaign_2.mp4" type="video/mp4" />
        </video>
        <div className="brand-world__overlay"></div>

        <div className="brand-world__content">
          <h2 className="brand-world__title">TOKYO JAMES World WE CARE</h2>
          <button className="btn-hero-action" onClick={() => openVideo('/videos/tj_campaign_2.mp4')}>
            Read our Manifesto
          </button>
        </div>
      </section>

      {/* RUNWAY LOOKBOOK ARCHIVE GRID */}
      <section className="lookbook-archive-section" id="lookbooks">
        <div className="section-header-title">
          <h2>Runway Lookbook Archives</h2>
        </div>

        <div className="lookbook-archive-grid">
          <div className="lookbook-card" onClick={() => openVideo('/videos/tj_campaign_1.mp4')}>
            <img src="/images/tj_drive_3.jpg" alt="Dark Waters AW24" />
            <div className="lookbook-card__info">
              <span className="lookbook-card__tag">AUTUMN / WINTER 2024</span>
              <h3>DARK WATERS AW24</h3>
            </div>
          </div>

          <div className="lookbook-card" onClick={() => openVideo('/videos/tj_campaign_2.mp4')}>
            <img src="/images/tj_drive_5.jpg" alt="Afro-Futurism SS24" />
            <div className="lookbook-card__info">
              <span className="lookbook-card__tag">SPRING / SUMMER 2024</span>
              <h3>AFRO-FUTURISM SS24</h3>
            </div>
          </div>

          <div className="lookbook-card" onClick={() => openVideo('/videos/tj_campaign_3.mp4')}>
            <img src="/images/tj_drive_6.jpg" alt="Cowhide Rebellion AW23" />
            <div className="lookbook-card__info">
              <span className="lookbook-card__tag">AUTUMN / WINTER 2023</span>
              <h3>COWHIDE REBELLION AW23</h3>
            </div>
          </div>
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
