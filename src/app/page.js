'use client';

import { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

export default function HomePage() {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.data);
      })
      .catch(err => console.error('Error loading products:', err));
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
          <h1 className="video-section__title">DARK WATERS AW24</h1>
          <div className="video-section__actions">
            <a href="/#collections" className="btn-hero-action">
              Details
            </a>
            <button 
              className="btn-hero-action" 
              onClick={() => openVideo('/videos/tj_campaign_3.mp4')}
            >
              Full Look Video
            </button>
          </div>
        </div>
      </section>

      {/* CURRENT COLLECTION BANNER */}
      <section className="hero-banner__image-wrapper" id="section-collection-banner">
        <img 
          src="/images/tj_drive_6.jpg" 
          alt="Current Collection FW23" 
          className="hero-banner__img" 
        />
        <div className="hero-banner__overlay"></div>

        <div className="hero-banner__content">
          <h2 className="hero-banner__title">Current Collection FW23</h2>
          <div className="hero-banner__actions">
            <a href="/#collections" className="btn-hero-action">
              Shop now
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCT COLLECTION GRID WITH DYNAMIC CURRENCY */}
      <section className="collection-section" id="collections">
        
        {/* FILTER TABS */}
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
              className={`tab-btn-pill ${activeCategory === 'archive-sale' ? 'active' : ''}`}
              onClick={() => setActiveCategory('archive-sale')}
            >
              Archive sale
            </button>
          </div>
        </div>

        {/* RESPONSIVE PRODUCT GRID */}
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="grid-view-item">
              <a href={`/product/${product.id}`} className="grid-view-item__link">
                
                <div className="grid-view-item__image-wrapper">
                  {product.badge && (
                    <span className={`badge ${product.badgeClass || ''}`}>
                      {product.badge}
                    </span>
                  )}
                  <img 
                    src={product.primaryImage} 
                    alt={product.title} 
                    className="grid-view-item__image primary" 
                  />
                  <img 
                    src={product.secondaryImage || product.primaryImage} 
                    alt={`${product.title} hover`} 
                    className="grid-view-item__image secondary" 
                  />
                </div>

                <div className="grid-view-item__meta">
                  <h3 className="grid-view-item__title">{product.title}</h3>
                  <div className="product-price">
                    {product.originalPriceEUR && (
                      <span className="product-price__sale">{formatPrice(product.originalPriceEUR)}</span>
                    )}
                    <span>{formatPrice(product.priceEUR)}</span>
                  </div>
                </div>

              </a>
            </div>
          ))}
        </div>

      </section>

      {/* BRAND WORLD BANNER */}
      <section className="brand-world-container" id="section-world">
        <video 
          className="brand-world__bg-video" 
          autoPlay 
          muted 
          loop 
          playsInline 
          poster="/images/tj_drive_5.jpg"
        >
          <source src="/videos/tj_campaign_4.mp4" type="video/mp4" />
        </video>
        <div className="brand-world__overlay"></div>

        <div className="brand-world__content">
          <h2 className="brand-world__title">TOKYO JAMES World WE CARE</h2>
          <div className="brand-world__actions">
            <button 
              className="btn-hero-action" 
              onClick={() => openVideo('/videos/tj_campaign_4.mp4')}
            >
              Read our Manifesto
            </button>
          </div>
        </div>
      </section>

      {/* RUNWAY LOOKBOOKS */}
      <section className="lookbook-archive-section" id="lookbooks">
        <div className="section-header-title">
          <h2>Runway Lookbook Archives</h2>
        </div>

        <div className="lookbook-archive-grid">
          <div className="lookbook-card" onClick={() => openVideo('/videos/tj_campaign_3.mp4')}>
            <img src="/images/tj_drive_6.jpg" alt="DARK WATERS AW24" />
            <div className="lookbook-card__info">
              <span className="lookbook-card__tag">AUTUMN / WINTER 2024</span>
              <h3>DARK WATERS AW24</h3>
            </div>
          </div>

          <div className="lookbook-card" onClick={() => openVideo('/videos/tj_campaign_4.mp4')}>
            <img src="/images/tj_drive_7.jpg" alt="AFRO-FUTURISM SS24" />
            <div className="lookbook-card__info">
              <span className="lookbook-card__tag">SPRING / SUMMER 2024</span>
              <h3>AFRO-FUTURISM SS24</h3>
            </div>
          </div>

          <div className="lookbook-card" onClick={() => openVideo('/videos/tj_campaign_5.mp4')}>
            <img src="/images/tj_drive_5.jpg" alt="COWHIDE REBELLION AW23" />
            <div className="lookbook-card__info">
              <span className="lookbook-card__tag">AUTUMN / WINTER 2023</span>
              <h3>COWHIDE REBELLION AW23</h3>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {isVideoModalOpen && (
        <div className="modal-overlay is-open" onClick={() => setIsVideoModalOpen(false)}>
          <div style={{ width: '100%', maxWidth: '900px', margin: 'auto', position: 'relative', background: '#000', padding: '10px' }}>
            <span 
              onClick={() => setIsVideoModalOpen(false)}
              style={{ position: 'absolute', top: '-30px', right: '0', color: '#fff', fontSize: '24px', cursor: 'pointer', zIndex: 10 }}
            >
              ✕
            </span>
            <video controls autoPlay style={{ width: '100%', maxHeight: '80vh' }}>
              <source src={activeVideoUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

    </div>
  );
}
