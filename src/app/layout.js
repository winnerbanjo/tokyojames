'use client';

import './globals.css';
import defaults from '@/data/site_content.json';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CurrencyProvider, useCurrency } from '@/context/CurrencyContext';

function LayoutInner({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  const { currency, setCurrency, formatPrice } = useCurrency();
  const [cart, setCart] = useState([]);
  const [siteContent, setSiteContent] = useState(defaults);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'about', 'manifesto', 'sustainability'
  const [megamenu, setMegamenu] = useState(null); // 'shop', 'world', 'lookbook'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.data);
      })
      .catch(err => console.error('Error fetching products:', err));

    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setSiteContent(data.data);
      })
      .catch(err => console.error('Error fetching dynamic site content:', err));
  }, []);

  // Listen for custom add to cart & buy now events from Product Detail Page
  useEffect(() => {
    const handleAddToCartEvent = (e) => {
      const item = e.detail;
      setCart(prev => {
        const existingIdx = prev.findIndex(p => p.id === item.id && p.size === item.size);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += item.quantity;
          return updated;
        }
        return [...prev, item];
      });
      setIsCartOpen(true);
    };

    const handleBuyNowEvent = (e) => {
      const item = e.detail;
      setCart([item]);
      setIsCheckoutOpen(true);
    };

    window.addEventListener('tj-add-to-cart', handleAddToCartEvent);
    window.addEventListener('tj-buy-now', handleBuyNowEvent);

    return () => {
      window.removeEventListener('tj-add-to-cart', handleAddToCartEvent);
      window.removeEventListener('tj-buy-now', handleBuyNowEvent);
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matched = products.filter(p => p.title.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q));
    setSearchResults(matched);
  }, [searchQuery, products]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.priceEUR * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (id, size, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.size === size) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      alert(data.message || 'Subscribed successfully!');
      if (res.ok && data.success) e.target.reset();
    } catch (err) {
      alert('Subscription could not be saved. Please try again.');
    }
  };

  // IF ADMIN ROUTE, DO NOT RENDER PUBLIC STOREFRONT HEADER OR FOOTER
  if (isAdmin) {
    return <main id="MainContent">{children}</main>;
  }

  return (
    <>
      {/* HEADER */}
      <header className="site-header" id="myHeader">
        <div className="site-header__container">

          <button className="mobile-hamburger-btn" onClick={() => setIsMobileNavOpen(true)} aria-label="Open Mobile Menu">
            ☰
          </button>

          <nav className="site-header__nav-left">
            <div
              className={`site-nav__link ${megamenu === 'shop' ? 'active' : ''}`}
              onMouseEnter={() => setMegamenu('shop')}
            >
              Shop ▾
            </div>
            <div
              className={`site-nav__link ${megamenu === 'world' ? 'active' : ''}`}
              onMouseEnter={() => setMegamenu('world')}
            >
              World ▾
            </div>

          </nav>

          {/* OFFICIAL ULTRA-CLEAR BRAND LOGO */}
          <div className="site-header__logo">
            <a href="/" className="site-header__logo-link">
              <img
                src="/images/tokyo_james_logo.png"
                alt="TOKYO JAMES"
                className="site-header__logo-img"
              />
            </a>
          </div>

          <div className="site-header__nav-right">
            {/* HEADER CURRENCY SELECTOR */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ border: 'none', background: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}
            >
              <option value="EUR">EUR €</option>


            </select>

            <button className="site-header__icon-btn" onClick={() => setIsSearchOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span className="visually-hidden">Search</span>
            </button>

            <button className="site-header__icon-btn" onClick={() => setIsCartOpen(true)}>
              Cart ( {cartCount} )
            </button>
          </div>
        </div>

        {/* MEGAMENU SHOP */}
        <div
          className={`megamenu ${megamenu === 'shop' ? 'is-open' : ''}`}
          onMouseLeave={() => setMegamenu(null)}
        >
          <div className="megamenu__container">
            <div className="megamenu__column">
              <h4 className="megamenu__column-title">CATEGORIES</h4>
              <ul className="megamenu__list">
                <li><a href="/#collections">All Products</a></li>
                <li><a href="/#collections">Bespoke Tailoring</a></li>
                <li><a href="/#collections">Leather & Jackets</a></li>
                <li><a href="/#collections">Polos & Shirts</a></li>
                <li><a href="/#collections">Trousers</a></li>
                <li><a href="/#collections">Knitwear</a></li>
                <li><a href="/#collections">Accessories</a></li>
                <li><a href="/#collections" style={{ color: 'var(--color-sale)' }}>Archive sale</a></li>
              </ul>
            </div>

            <div className="megamenu__column megamenu__preview-col">
              <h4 className="megamenu__column-title">FEATURED RUNWAY GARMENTS</h4>
              <div className="megamenu__preview-grid">
                {products.slice(0, 2).map(product => <a key={product.id} href={`/product/${product.id}`} className="megamenu__preview-item">
                  <img src={product.primaryImage} alt={product.title} />
                  <div className="megamenu__preview-name">{product.title}</div>
                  <div className="megamenu__preview-price">{formatPrice(product.priceEUR)}</div>
                </a>)}
              </div>
            </div>
          </div>
        </div>

        {/* MEGAMENU WORLD */}
        <div
          className={`megamenu ${megamenu === 'world' ? 'is-open' : ''}`}
          onMouseLeave={() => setMegamenu(null)}
        >
          <div className="megamenu__container">
            <div className="megamenu__column">
              <h4 className="megamenu__column-title">WORLD</h4>
              <ul className="megamenu__list">
                {siteContent.about.paragraph1 && <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('about'); }}>About Tokyo James</a></li>}
                {siteContent.manifesto.quote && <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('manifesto'); }}>The Manifesto</a></li>}
                {siteContent.sustainability.paragraph && <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('sustainability'); }}>Sustainability</a></li>}
              </ul>
            </div>

            <div className="megamenu__column">
              <h4 className="megamenu__column-title">THE HOUSE</h4>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#444', fontStyle: 'italic' }}>
                TOKYO JAMES
              </p>
            </div>
          </div>
        </div>

      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      <div className={`mobile-nav-overlay ${isMobileNavOpen ? 'is-open' : ''}`} onClick={() => setIsMobileNavOpen(false)}></div>
      <aside className={`mobile-nav-drawer ${isMobileNavOpen ? 'is-open' : ''}`}>
        <div className="mobile-nav-drawer__header">
          <img
            src="/images/tokyo_james_logo.png"
            alt="TOKYO JAMES"
            className="mobile-logo-img"
          />
          <button style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => setIsMobileNavOpen(false)}>✕</button>
        </div>

        <div className="mobile-nav-drawer__body">
          <div className="mobile-nav-group">
            <h4 className="mobile-nav-group__title">SHOP CATEGORIES</h4>
            <div className="mobile-nav-group__list">
              <a href="/#collections" onClick={() => setIsMobileNavOpen(false)}>All Products <span>→</span></a>
              <a href="/#collections" onClick={() => setIsMobileNavOpen(false)}>Bespoke Tailoring <span>→</span></a>
              <a href="/#collections" onClick={() => setIsMobileNavOpen(false)}>Leather & Jackets <span>→</span></a>
              <a href="/#collections" onClick={() => setIsMobileNavOpen(false)}>Polos & Shirts <span>→</span></a>
              <a href="/#collections" onClick={() => setIsMobileNavOpen(false)}>Trousers <span>→</span></a>
              <a href="/#collections" onClick={() => setIsMobileNavOpen(false)}>Knitwear <span>→</span></a>
              <a href="/#collections" onClick={() => setIsMobileNavOpen(false)}>Accessories <span>→</span></a>
              <a href="/#collections" onClick={() => setIsMobileNavOpen(false)} style={{ color: 'var(--color-sale)' }}>Archive Sale <span>→</span></a>
            </div>
          </div>

          <div className="mobile-nav-group">
            <h4 className="mobile-nav-group__title">WORLD & HOUSE</h4>
            <div className="mobile-nav-group__list">
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('about'); setIsMobileNavOpen(false); }}>About Tokyo James <span>→</span></a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('manifesto'); setIsMobileNavOpen(false); }}>The Manifesto <span>→</span></a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('sustainability'); setIsMobileNavOpen(false); }}>Craftsmanship & Sustainability <span>→</span></a>
            </div>
          </div>
        </div>

        <div className="mobile-nav-drawer__footer">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '600' }}>Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ border: '1px solid #000', padding: '4px 8px', fontSize: '12px' }}
            >
              <option value="EUR">EUR €</option>


            </select>
          </div>
        </div>
      </aside>

      {/* MAIN PAGE */}
      <main id="MainContent">
        {children}
      </main>

      {/* SITE FOOTER */}
      <footer className="site-footer" role="contentinfo">
        <div className="site-footer__content">
          <div className="site-footer__column">
            <p className="site-footer__block-title">Company</p>
            <ul className="site-footer__linklist">
              {siteContent.about.paragraph1 && <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('about'); }}>About</a></li>}
              {siteContent.sustainability.paragraph && <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('sustainability'); }}>Sustainability</a></li>}
              {siteContent.manifesto.quote && <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('manifesto'); }}>Manifesto</a></li>}
              {siteContent.footer?.instagramUrl && <li><a href={siteContent.footer.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
            </ul>
          </div>

          <div className="site-footer__column">
            <p className="site-footer__block-title">Customer Service</p>
            <ul className="site-footer__linklist">
              {siteContent.footer.contactEmail && <li><a href={`mailto:${siteContent.footer.contactEmail}`}>Contact</a></li>}
              <li>Online ordering opens soon</li>
            </ul>
          </div>

          <div className="site-footer__column">
            <p className="site-footer__block-title">Newsletter</p>
            <div className="site-footer__newsletter">
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>Subscribe to our newsletter</p>
              <form className="site-footer__form" onSubmit={handleSubscribe}>
                <input type="email" name="email" placeholder="Email address" required className="site-footer__input" />
                <button type="submit" className="site-footer__submit-btn">Subscribe</button>
              </form>
            </div>
          </div>

          <div className="site-footer__column">
            <p className="site-footer__block-title">Currency</p>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="site-footer__currency-select"
            >
              <option value="EUR">EUR €</option>


            </select>
          </div>
        </div>

        <div className="site-footer__copyright">
          <small>{siteContent.footer?.copyrightText || '© 2026 TOKYO JAMES'} {siteContent.footer?.vatNumber}</small>
        </div>
      </footer>

      {/* CART DRAWER */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'is-open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <aside className={`cart-drawer ${isCartOpen ? 'is-open' : ''}`}>
        <div className="cart-drawer__header">
          <h3 className="cart-drawer__title">Cart ({cartCount})</h3>
          <button className="cart-drawer__close" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        <div className="cart-drawer__body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
              <p style={{ fontSize: '13px' }}>Your cart is currently empty.</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.id}-${item.size}-${idx}`} className="cart-item">
                <img className="cart-item__image" src={item.image} alt={item.title} />
                <div className="cart-item__details">
                  <div>
                    <h4 className="cart-item__title">{item.title}</h4>
                    <div className="cart-item__meta">Size: {item.size}</div>
                    <div className="cart-item__price">{formatPrice(item.priceEUR)}</div>
                  </div>

                  <div className="cart-item__quantity-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.size, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.size, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-drawer__footer">
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>Online ordering opens soon.</p>
          <button
            className="btn-hero-action"
            style={{ width: '100%', background: '#000', color: '#fff' }}
            onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
            disabled={!cart.length}
          >
            Checkout availability
          </button>
        </div>
      </aside>

      {isCheckoutOpen && (
        <div className="modal-overlay is-open" onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" aria-label="Close" onClick={() => setIsCheckoutOpen(false)}>✕</button>
            <h2 id="checkout-title">Online ordering opens soon</h2>
            <p>Checkout is currently unavailable. No payment has been taken.</p>
            {siteContent.footer.contactEmail && <a href={`mailto:${siteContent.footer.contactEmail}`}>Contact the store</a>}
          </div>
        </div>
      )}

      {/* SEARCH OVERLAY */}
      <div className={`search-overlay ${isSearchOpen ? 'is-open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ fontSize: '24px' }} onClick={() => setIsSearchOpen(false)}>✕</button>
        </div>
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="search-results">
          {searchResults.map(p => (
            <div
              key={p.id}
              style={{ background: '#fff', border: '1px solid #000', padding: '12px', cursor: 'pointer' }}
              onClick={() => { window.location.href = `/product/${p.id}`; setIsSearchOpen(false); }}
            >
              <img src={p.primaryImage} style={{ width: '100%', height: '160px', objectFit: 'cover', marginBottom: '8px' }} alt={p.title} />
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase' }}>{p.title}</h4>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-sale)' }}>{formatPrice(p.priceEUR)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DYNAMIC EDITABLE MODALS */}
      <div className={`modal-overlay ${activeModal === 'about' ? 'is-open' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && setActiveModal(null)}>
        <div className="modal-content">
          <span className="modal-close-btn" onClick={() => setActiveModal(null)}>✕</span>
          <h2 className="modal-title">{siteContent.about?.title || 'About TOKYO JAMES'}</h2>
          <div className="modal-body">
            <p>{siteContent.about?.paragraph1}</p>
            <p>{siteContent.about?.paragraph2}</p>
          </div>
        </div>
      </div>

      <div className={`modal-overlay ${activeModal === 'manifesto' ? 'is-open' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && setActiveModal(null)}>
        <div className="modal-content">
          <span className="modal-close-btn" onClick={() => setActiveModal(null)}>✕</span>
          <h2 className="modal-title">{siteContent.manifesto?.title || 'The Manifesto'}</h2>
          <div className="modal-body">
            <blockquote>"{siteContent.manifesto?.quote}"</blockquote>
            <p>{siteContent.manifesto?.subtext}</p>
          </div>
        </div>
      </div>

      <div className={`modal-overlay ${activeModal === 'sustainability' ? 'is-open' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && setActiveModal(null)}>
        <div className="modal-content">
          <span className="modal-close-btn" onClick={() => setActiveModal(null)}>✕</span>
          <h2 className="modal-title">{siteContent.sustainability?.title || 'Craftsmanship & Sustainability'}</h2>
          <div className="modal-body">
            <p><strong>{siteContent.sustainability?.headline}</strong></p>
            <p>{siteContent.sustainability?.paragraph}</p>
          </div>
        </div>
      </div>

    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>TOKYO JAMES — Official Store</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Explore TOKYO JAMES collections and films." />
      </head>
      <body>
        <CurrencyProvider>
          <LayoutInner>{children}</LayoutInner>
        </CurrencyProvider>
      </body>
    </html>
  );
}
