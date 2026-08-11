'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.data);
      })
      .catch(err => console.error('Error fetching products:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* SECTION 1: HERO CAMPAIGN VIDEO (MATCHING SECTION 16233187224fbfb5fe ON BOTTER.WORLD) */}
      <section className="shopify-section index-section video-section">
        <div className="video-section-container">
          <video autoPlay loop muted playsInline className="video-section__bg-video">
            <source src="https://cdn.shopify.com/videos/c/o/v/538bd57650114bd59e2877c2d4bbb432.mp4" type="video/mp4" />
          </video>
          <div className="video-section__overlay"></div>
          <div className="video-section__content">
            <h1 className="video-section__title">DARK WATERS AW24</h1>
            <div className="video-section__actions">
              <a href="/#collections" className="btn-hero-action">Details</a>
              <button className="btn-hero-action" onClick={() => alert('Launching Full Look Video Lightbox...')}>Full Look Video</button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CURRENT COLLECTION BANNER (MATCHING SECTION 162279797744ca9d51 ON BOTTER.WORLD) */}
      <section className="shopify-section hero-section-banner">
        <div className="hero-banner__image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop" 
            alt="Current Collection FW23"
            className="hero-banner__img"
          />
          <div className="hero-banner__overlay"></div>
          <div className="hero-banner__content">
            <h2 className="hero-banner__title">Current Collection FW23</h2>
            <a href="/#collections" className="btn-hero-action">Shop now</a>
          </div>
        </div>
      </section>

      {/* SECTION 3: PRODUCT COLLECTION SHOWCASE (MATCHING SECTION COLLECTION ON BOTTER.WORLD) */}
      <section className="shopify-section collection-section" id="collections">
        <div className="grid-collection-container">
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', fontSize: '13px', textTransform: 'uppercase' }}>
              Loading products...
            </div>
          ) : (
            <div className="product-grid">
              {products.map(p => (
                <div key={p.id} className="grid-view-item">
                  <div className="grid-view-item__image-wrapper">
                    {p.badge && (
                      <span className={`badge ${p.badgeClass === 'badge-sale' ? 'badge--sale' : ''}`}>
                        {p.badge}
                      </span>
                    )}
                    <a href={`/product/${p.id}`}>
                      <img className="grid-view-item__image primary" src={p.primaryImage} alt={p.title} />
                      <img className="grid-view-item__image secondary" src={p.secondaryImage} alt={`${p.title} secondary`} />
                    </a>
                  </div>

                  <div className="grid-view-item__meta">
                    <h3 className="grid-view-item__title">
                      <a href={`/product/${p.id}`}>{p.title}</a>
                    </h3>
                    <div className="product-price">
                      {p.originalPriceEUR && (
                        <s className="product-price__price product-price__sale">€ {p.originalPriceEUR.toFixed(2).replace('.', ',')}</s>
                      )}
                      <span className="product-price__price">€ {p.priceEUR.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: BRAND WORLD MANIFESTO BANNER (MATCHING SECTION 1623318819506b80ee ON BOTTER.WORLD) */}
      <section className="shopify-section brand-world-section">
        <div className="brand-world-container">
          <video autoPlay loop muted playsInline className="brand-world__bg-video">
            <source src="https://cdn.shopify.com/videos/c/o/v/538bd57650114bd59e2877c2d4bbb432.mp4" type="video/mp4" />
          </video>
          <div className="brand-world__overlay"></div>
          <div className="brand-world__content">
            <h2 className="brand-world__title">TOKYO JAMES World WE CARE</h2>
            <a href="#" className="btn-hero-action" onClick={(e) => { e.preventDefault(); alert('Opening Manifesto...'); }}>Read our Manifesto</a>
          </div>
        </div>
      </section>

      {/* SECTION 5: RUNWAY LOOKBOOKS ARCHIVE */}
      <section className="shopify-section lookbook-archive-section" id="lookbooks">
        <div className="section-header-title">
          <h2>RUNWAY ARCHIVES</h2>
        </div>

        <div className="lookbook-archive-grid">
          <div className="lookbook-card">
            <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop" alt="AW24 Night Call" />
            <div className="lookbook-card__info">
              <span className="lookbook-card__tag">AW24</span>
              <h3>NIGHT CALL</h3>
            </div>
          </div>

          <div className="lookbook-card">
            <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop" alt="SS24 Afro-Futurism" />
            <div className="lookbook-card__info">
              <span className="lookbook-card__tag">SS24</span>
              <h3>AFRO-FUTURISM</h3>
            </div>
          </div>

          <div className="lookbook-card">
            <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop" alt="AW23 Cowhide Rebellion" />
            <div className="lookbook-card__info">
              <span className="lookbook-card__tag">AW23</span>
              <h3>COWHIDE REBELLION</h3>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
