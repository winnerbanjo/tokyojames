'use client';

import './globals.css';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const [cart, setCart] = useState([
    { id: 'tj-1', title: 'Sculptural Cowhide-Panelled Wool Blazer', size: '48', priceEUR: 1850.00, quantity: 1, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop' }
  ]);

  const [currency, setCurrency] = useState('EUR');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'about', 'manifesto', 'sustainability', 'video'
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

  const currencyRates = {
    EUR: { symbol: '€', rate: 1.0 },
    USD: { symbol: '$', rate: 1.08 },
    GBP: { symbol: '£', rate: 0.85 }
  };

  const formatPrice = (amountEUR) => {
    const { symbol, rate } = currencyRates[currency] || currencyRates.EUR;
    const converted = amountEUR * rate;
    if (currency === 'EUR') return `€ ${converted.toFixed(2).replace('.', ',')}`;
    return `${symbol} ${converted.toFixed(2)}`;
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.priceEUR * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
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
      e.target.reset();
    } catch (err) {
      alert('Subscribed to TOKYO JAMES archives!');
    }
  };

  return (
    <html lang="en">
      <head>
        <title>TOKYO JAMES — TOKYO JAMES World</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <meta name="description" content="British tailoring with West African soul by Ina Adenugba. Runway collections, leather jackets, tailored outerwear, and lookbooks." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Helvetica+Neue:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* SITE HEADER MATCHING BOTTER.WORLD + MOBILE HAMBURGER */}
        <header className="site-header" id="myHeader">
          <div className="site-header__container">
            
            {/* MOBILE HAMBURGER TOGGLE BUTTON */}
            <button className="mobile-hamburger-btn" onClick={() => setIsMobileNavOpen(true)} aria-label="Open Mobile Menu">
              ☰
            </button>

            {/* DESKTOP LEFT NAVIGATION */}
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
              <div 
                className={`site-nav__link ${megamenu === 'lookbook' ? 'active' : ''}`}
                onMouseEnter={() => setMegamenu('lookbook')}
              >
                Lookbook ▾
              </div>
            </nav>

            {/* LOGO CENTERED */}
            <div className="site-header__logo">
              <a href="/" className="site-header__logo-link">
                <span className="site-header__logo-text">TOKYO JAMES</span>
              </a>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="site-header__nav-right">
              <button className="site-header__icon-btn" onClick={() => setIsSearchOpen(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <span className="visually-hidden">Search</span>
              </button>

              <button className="site-header__icon-btn" onClick={() => setActiveModal('about')}>
                Account
              </button>

              <button className="site-header__icon-btn" onClick={() => setIsCartOpen(true)}>
                Cart ( {cartCount} )
              </button>
            </div>
          </div>

          {/* DESKTOP MEGAMENU SHOP */}
          <div 
            className={`megamenu ${megamenu === 'shop' ? 'is-open' : ''}`}
            onMouseLeave={() => setMegamenu(null)}
          >
            <div className="megamenu__container">
              <div className="megamenu__column">
                <h4 className="megamenu__column-title">CATEGORIES</h4>
                <ul className="megamenu__list">
                  <li><a href="/#collections">All</a></li>
                  <li><a href="/#collections">Tailoring</a></li>
                  <li><a href="/#collections">Jackets</a></li>
                  <li><a href="/#collections">Polos</a></li>
                  <li><a href="/#collections">Trousers</a></li>
                  <li><a href="/#collections">T-shirts</a></li>
                  <li><a href="/#collections">Sweaters</a></li>
                  <li><a href="/#collections">Hoodies</a></li>
                  <li><a href="/#collections">Knitwear</a></li>
                  <li><a href="/#collections">Accessories</a></li>
                  <li><a href="/#collections" style={{ color: 'var(--color-sale)' }}>Archive sale</a></li>
                </ul>
              </div>

              <div className="megamenu__column megamenu__preview-col">
                <h4 className="megamenu__column-title">FEATURED PIECES</h4>
                <div className="megamenu__preview-grid">
                  <div className="megamenu__preview-item">
                    <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop" alt="Cowhide Blazer" />
                    <div className="megamenu__preview-name">Sculptural Cowhide Wool Blazer</div>
                    <div className="megamenu__preview-price">{formatPrice(1850)}</div>
                  </div>
                  <div className="megamenu__preview-item">
                    <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop" alt="Croc Leather Biker" />
                    <div className="megamenu__preview-name">Embossed Croc Leather Biker</div>
                    <div className="megamenu__preview-price">{formatPrice(2400)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP MEGAMENU WORLD */}
          <div 
            className={`megamenu ${megamenu === 'world' ? 'is-open' : ''}`}
            onMouseLeave={() => setMegamenu(null)}
          >
            <div className="megamenu__container">
              <div className="megamenu__column">
                <h4 className="megamenu__column-title">WORLD</h4>
                <ul className="megamenu__list">
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('about'); }}>About</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('manifesto'); }}>Manifesto</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('sustainability'); }}>Sustainability</a></li>
                </ul>
              </div>

              <div className="megamenu__column">
                <h4 className="megamenu__column-title">THE HOUSE</h4>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#444', fontStyle: 'italic' }}>
                  "Tailoring is an armour of identity. Combining British Savile Row precision with modern West African soul."
                </p>
              </div>
            </div>
          </div>

          {/* DESKTOP MEGAMENU LOOKBOOK */}
          <div 
            className={`megamenu ${megamenu === 'lookbook' ? 'is-open' : ''}`}
            onMouseLeave={() => setMegamenu(null)}
          >
            <div className="megamenu__container" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <div>
                <h4 className="megamenu__column-title">AW24</h4>
                <ul className="megamenu__list">
                  <li><a href="/#lookbooks">Full Looks</a></li>
                  <li><a href="/#lookbooks">Details</a></li>
                </ul>
              </div>
              <div>
                <h4 className="megamenu__column-title">SS24</h4>
                <ul className="megamenu__list">
                  <li><a href="/#lookbooks">Full Looks</a></li>
                  <li><a href="/#lookbooks">Details</a></li>
                </ul>
              </div>
              <div>
                <h4 className="megamenu__column-title">AW23</h4>
                <ul className="megamenu__list">
                  <li><a href="/#lookbooks">Full Looks</a></li>
                  <li><a href="/#lookbooks">Details</a></li>
                </ul>
              </div>
              <div>
                <h4 className="megamenu__column-title">ARCHIVES</h4>
                <ul className="megamenu__list">
                  <li><a href="/#lookbooks">SS23 • AW22 • SS22</a></li>
                  <li><a href="/#lookbooks">AW21 • SS21 • AW20</a></li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE NAVIGATION DRAWER */}
        <div className={`mobile-nav-overlay ${isMobileNavOpen ? 'is-open' : ''}`} onClick={() => setIsMobileNavOpen(false)}></div>
        <aside className={`mobile-nav-drawer ${isMobileNavOpen ? 'is-open' : ''}`}>
          <div className="mobile-nav-drawer__header">
            <span style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>TOKYO JAMES</span>
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

            <div className="mobile-nav-group">
              <h4 className="mobile-nav-group__title">RUNWAY ARCHIVES</h4>
              <div className="mobile-nav-group__list">
                <a href="/#lookbooks" onClick={() => setIsMobileNavOpen(false)}>AW24 Night Call <span>→</span></a>
                <a href="/#lookbooks" onClick={() => setIsMobileNavOpen(false)}>SS24 Afro-Futurism <span>→</span></a>
                <a href="/#lookbooks" onClick={() => setIsMobileNavOpen(false)}>AW23 Cowhide Rebellion <span>→</span></a>
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
                <option value="USD">USD $</option>
                <option value="GBP">GBP £</option>
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
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('about'); }}>About</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('sustainability'); }}>Sustainability</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('manifesto'); }}>Manifesto</a></li>
                <li><a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a></li>
              </ul>
            </div>

            <div className="site-footer__column">
              <p className="site-footer__block-title">Customer Service</p>
              <ul className="site-footer__linklist">
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: We protect your data.'); }}>Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Terms of Service: Official TOKYO JAMES terms.'); }}>Terms of Service</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Shipping Policy: Free worldwide express shipping.'); }}>Shipping Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Refund Policy: 14-day hassle free returns.'); }}>Refund Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Contact: concierge@tokyojames.com'); }}>Contact</a></li>
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
                <option value="USD">USD $</option>
                <option value="GBP">GBP £</option>
              </select>
            </div>
          </div>

          <div className="site-footer__copyright">
            <small>&copy; 2026, <a href="/">TOKYO JAMES World</a> London • Lagos • Paris, VAT: UK080129472</small>
          </div>
        </footer>

        {/* CART DRAWER */}
        <div className={`cart-drawer-overlay ${isCartOpen ? 'is-open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
        <aside className={`cart-drawer ${isCartOpen ? 'is-open' : ''}`}>
          <div className="cart-drawer__header">
            <h3 className="cart-drawer__title">Cart</h3>
            <button className="cart-drawer__close" onClick={() => setIsCartOpen(false)}>✕</button>
          </div>

          <div className="cart-drawer__body">
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                <p style={{ fontSize: '13px' }}>Your cart is currently empty.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img className="cart-item__image" src={item.image} alt={item.title} />
                  <div className="cart-item__details">
                    <div>
                      <h4 className="cart-item__title">{item.title}</h4>
                      <div className="cart-item__meta">Size: {item.size}</div>
                      <div className="cart-item__price">{formatPrice(item.priceEUR)}</div>
                    </div>

                    <div className="cart-item__quantity-controls">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
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
            <p style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>Taxes and shipping calculated at checkout</p>
            <button className="btn-hero-action" style={{ width: '100%' }} onClick={() => alert('Proceeding to Checkout...')}>
              Check out
            </button>
          </div>
        </aside>

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

        {/* MODALS */}
        <div className={`modal-overlay ${activeModal === 'about' ? 'is-open' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && setActiveModal(null)}>
          <div className="modal-content">
            <span className="modal-close-btn" onClick={() => setActiveModal(null)}>✕</span>
            <h2 className="modal-title">About TOKYO JAMES</h2>
            <div className="modal-body">
              <p>
                Representing the fusion of music, literary, culinary and origins, that all together forms the rich and hybrid African and British culture. <strong>TOKYO JAMES</strong>’s identity combines its ‘Caribbean & African Couture’ spirit, as well as its glance towards Arte Povera’s philosophy, together with a strong sustainability consciousness.
              </p>
              <p>
                Ina Adenugba is the creative force behind TOKYO JAMES. The designer combines multicultural influences and mastery of tailoring to infuse the label with a distinct notion of luxury. Edgy yet inclusive, creative sight is an extension of personality.
              </p>
            </div>
          </div>
        </div>

        <div className={`modal-overlay ${activeModal === 'manifesto' ? 'is-open' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && setActiveModal(null)}>
          <div className="modal-content">
            <span className="modal-close-btn" onClick={() => setActiveModal(null)}>✕</span>
            <h2 className="modal-title">Manifesto</h2>
            <div className="modal-body">
              <blockquote>
                "At TOKYO JAMES we care. We care about fashion, as the golden daughter of all arts. We care about nature, as the golden mother of all arts. Without nature, no arts, nothing."
              </blockquote>
              <p>
                Speaking up and acting for cultural identity and environment is an act of respect. Giving back to nature is giving back to the world. This is the idea we have for a better world, this is the idea we have for the TOKYO JAMES world.
              </p>
            </div>
          </div>
        </div>

        <div className={`modal-overlay ${activeModal === 'sustainability' ? 'is-open' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && setActiveModal(null)}>
          <div className="modal-content">
            <span className="modal-close-btn" onClick={() => setActiveModal(null)}>✕</span>
            <h2 className="modal-title">Sustainability</h2>
            <div className="modal-body">
              <p><strong>Giving back through fashion and zero-waste tailoring</strong></p>
              <p>
                We are truly connected to our narrative, telling an honest story through our brand and our creations. TOKYO JAMES's collections are run on a Solar punk mindset where technology is leading and emotion and storytelling are vital.
              </p>
            </div>
          </div>
        </div>

      </body>
    </html>
  );
}
