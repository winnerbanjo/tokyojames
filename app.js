/**
 * BOTTER WORLD - Application Interactive Logic
 */

// Product Data Store
const PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Afro Comb With Croc Print Leather Bag',
    category: 'accessories',
    categoryName: 'Accessories',
    priceEUR: 292.56,
    badge: 'Sale',
    badgeClass: 'badge-sale',
    primaryImage: 'https://botter.world/cdn/shop/products/Afro-comb-with-croc-printed-leather-bag-pic1_1200x.jpg?v=1636117629',
    secondaryImage: 'https://botter.world/cdn/shop/files/C1A4959_1200x.jpg?v=1706520793',
    description: 'Iconic afro comb integrated luxury croc-embossed leather handbag. Handcrafted in Italy with silver hardware.',
    sizes: ['ONE SIZE']
  },
  {
    id: 'prod-2',
    title: 'Bikini Cut Out Jacket',
    category: 'tailoring',
    categoryName: 'Tailoring & Jackets',
    priceEUR: 1576.86,
    badge: 'Caribbean Couture',
    badgeClass: 'badge-couture',
    primaryImage: 'https://botter.world/cdn/shop/files/ecommerce_front_images_0002_15a_1200x.jpg?v=1719830480',
    secondaryImage: 'https://botter.world/cdn/shop/files/15b_1200x.jpg?v=1719830543',
    description: 'Sculptural wool tailoring jacket featuring signature aquatic bikini cut-out detailing on lapels and waist.',
    sizes: ['46', '48', '50', '52']
  },
  {
    id: 'prod-3',
    title: 'Black Crochet Bikini Sweater',
    category: 'sweaters',
    categoryName: 'Knitwear & Sweaters',
    priceEUR: 644.63,
    badge: 'New Arrival',
    badgeClass: '',
    primaryImage: 'https://botter.world/cdn/shop/files/C1A4961_1200x.jpg?v=1706520792',
    secondaryImage: 'https://botter.world/cdn/shop/files/C1A4959_1200x.jpg?v=1706520793',
    description: 'Hand-crocheted organic cotton knit sweater with open-weave mesh texture and Caribbean bikini accents.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'prod-4',
    title: 'Bikini Tailored Shirt',
    category: 'polos',
    categoryName: 'Polos & Shirts',
    priceEUR: 743.80,
    badge: 'Runway Feature',
    badgeClass: '',
    primaryImage: 'https://botter.world/cdn/shop/files/15b_1200x.jpg?v=1719830543',
    secondaryImage: 'https://botter.world/cdn/shop/files/ecommerce_front_images_0002_15a_1200x.jpg?v=1719830480',
    description: 'Crisp poplin cotton tailored shirt with layered collar construction and contrasting piping.',
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'prod-5',
    title: 'Archive Classic Botter Polo Blue With Navy Stripes',
    category: 'archive-sale',
    categoryName: 'Archive Sale',
    priceEUR: 644.63,
    originalPriceEUR: 850.00,
    badge: 'Archive Sale',
    badgeClass: 'badge-sale',
    primaryImage: 'https://botter.world/cdn/shop/files/BOTTER-20201232-2.jpg?v=1625496290',
    secondaryImage: 'https://botter.world/cdn/shop/files/C1A4961_1200x.jpg?v=1706520792',
    description: 'Classic oversized piqué polo shirt featuring royal blue body and deep navy chest stripes.',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'prod-6',
    title: 'Coral Reef Algae-Fabric Utility Jacket',
    category: 'jackets',
    categoryName: 'Jackets',
    priceEUR: 1250.00,
    badge: 'Solar Punk Eco',
    badgeClass: '',
    primaryImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
    description: 'Innovated bio-fabricated utility jacket created from algae-derived textiles and biodegradable shell water-repellent coating.',
    sizes: ['M', 'L', 'XL']
  },
  {
    id: 'prod-7',
    title: 'Solar Punk Scuba Vinyl Knit Hoodie',
    category: 'hoodies',
    categoryName: 'Hoodies',
    priceEUR: 580.00,
    badge: 'Exclusive',
    badgeClass: '',
    primaryImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    description: 'Heavyweight organic cotton jersey hoodie featuring high-gloss vinyl ocean motif screenprint.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'prod-8',
    title: 'Water-Resistant Aquatic Tailored Trousers',
    category: 'trousers',
    categoryName: 'Trousers',
    priceEUR: 820.00,
    badge: 'Tailoring',
    badgeClass: '',
    primaryImage: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1000&auto=format&fit=crop',
    description: 'Sharp relaxed-fit virgin wool trousers featuring sealed water-repellent zippers and extended waist tabs.',
    sizes: ['46', '48', '50']
  }
];

// Lookbook Data
const LOOKBOOK_ITEMS = [
  {
    season: 'AW24',
    title: 'Dark Waters',
    image: 'https://botter.world/cdn/shop/files/BACKGROUND7_1296x.jpg',
    videoUrl: 'https://player.vimeo.com/video/988386260?badge=0&autopause=0'
  },
  {
    season: 'SS24',
    title: 'Voodoo Child',
    image: 'https://botter.world/cdn/shop/files/C1A4961_1200x.jpg?v=1706520792',
    videoUrl: 'https://player.vimeo.com/video/558547726?autoplay=1'
  },
  {
    season: 'AW23',
    title: 'Caribbean Coral',
    image: 'https://botter.world/cdn/shop/files/ecommerce_front_images_0002_15a_1200x.jpg?v=1719830480',
    videoUrl: 'https://player.vimeo.com/video/988386260'
  }
];

// App State
let activeCurrency = 'EUR';
const CURRENCY_RATES = {
  EUR: { symbol: '€', rate: 1.0 },
  USD: { symbol: '$', rate: 1.08 },
  GBP: { symbol: '£', rate: 0.85 }
};

let cart = [
  { productId: 'prod-1', size: 'ONE SIZE', quantity: 1 }
];

// DOM Load
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCurrencySelector();
  renderProducts('all');
  initTabs();
  initCartDrawer();
  initModals();
  initSearch();
  initLookbook();
  updateCartUI();
});

/* ==========================================================================
   NAVIGATION & MEGAMENU
   ========================================================================== */
function initNavigation() {
  const navShop = document.getElementById('nav-shop');
  const navWorld = document.getElementById('nav-world');
  const megamenuShop = document.getElementById('megamenu-shop');
  const megamenuWorld = document.getElementById('megamenu-world');
  const siteHeader = document.getElementById('site-header');

  if (navShop && megamenuShop) {
    navShop.addEventListener('mouseenter', () => {
      megamenuShop.classList.add('is-open');
      megamenuWorld?.classList.remove('is-open');
    });

    megamenuShop.addEventListener('mouseleave', () => {
      megamenuShop.classList.remove('is-open');
    });
  }

  if (navWorld && megamenuWorld) {
    navWorld.addEventListener('mouseenter', () => {
      megamenuWorld.classList.add('is-open');
      megamenuShop?.classList.remove('is-open');
    });

    megamenuWorld.addEventListener('mouseleave', () => {
      megamenuWorld.classList.remove('is-open');
    });
  }

  // Scroll effect for header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('is-scrolled');
    } else {
      siteHeader?.classList.remove('is-scrolled');
    }
  });
}

/* ==========================================================================
   CURRENCY SELECTOR
   ========================================================================== */
function initCurrencySelector() {
  const select = document.getElementById('currency-select');
  if (!select) return;

  select.addEventListener('change', (e) => {
    activeCurrency = e.target.value;
    renderProducts(getActiveCategory());
    updateCartUI();
  });
}

function formatPrice(amountEUR) {
  const { symbol, rate } = CURRENCY_RATES[activeCurrency];
  const converted = amountEUR * rate;
  if (activeCurrency === 'EUR') {
    return `€ ${converted.toFixed(2).replace('.', ',')}`;
  } else if (activeCurrency === 'USD') {
    return `$ ${converted.toFixed(2)}`;
  } else if (activeCurrency === 'GBP') {
    return `£ ${converted.toFixed(2)}`;
  }
  return `${symbol} ${converted.toFixed(2)}`;
}

function getActiveCategory() {
  const activeTab = document.querySelector('.tab-btn.active');
  return activeTab ? activeTab.dataset.category : 'all';
}

/* ==========================================================================
   PRODUCT RENDERING & FILTERING
   ========================================================================== */
function renderProducts(category = 'all') {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const filtered = category === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === category);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-card__image-container">
        ${p.badge ? `<span class="product-card__badge ${p.badgeClass}">${p.badge}</span>` : ''}
        <img class="product-card__image product-card__image--primary" src="${p.primaryImage}" alt="${p.title}" loading="lazy">
        <img class="product-card__image product-card__image--secondary" src="${p.secondaryImage}" alt="${p.title} view 2" loading="lazy">
        
        <div class="product-card__quick-add">
          <button class="btn-primary btn-dark" style="width:100%; padding: 10px;" onclick="quickAddToCart('${p.id}')">
            + Quick Add
          </button>
        </div>
      </div>

      <div class="product-card__content">
        <div>
          <span class="product-card__category">${p.categoryName}</span>
          <h3 class="product-card__title" onclick="openQuickViewModal('${p.id}')" style="cursor:pointer;">${p.title}</h3>
        </div>

        <div class="product-card__price-row">
          <span class="product-card__price ${p.originalPriceEUR ? 'product-card__price--sale' : ''}">
            ${formatPrice(p.priceEUR)}
          </span>
          ${p.originalPriceEUR ? `
            <span class="product-card__price product-card__price--regular">
              ${formatPrice(p.originalPriceEUR)}
            </span>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderProducts(tab.dataset.category);
    });
  });
}

/* ==========================================================================
   CART & DRAWER LOGIC
   ========================================================================== */
function initCartDrawer() {
  const openBtn = document.getElementById('cart-trigger');
  const closeBtn = document.getElementById('cart-close');
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');

  openBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openCartDrawer();
  });

  closeBtn?.addEventListener('click', closeCartDrawer);
  overlay?.addEventListener('click', closeCartDrawer);
}

function openCartDrawer() {
  document.getElementById('cart-overlay')?.classList.add('is-open');
  document.getElementById('cart-drawer')?.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.getElementById('cart-overlay')?.classList.remove('is-open');
  document.getElementById('cart-drawer')?.classList.remove('is-open');
  document.body.style.overflow = '';
}

function quickAddToCart(productId) {
  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId, size: 'M', quantity: 1 });
  }
  updateCartUI();
  openCartDrawer();
}

function updateCartQuantity(productId, delta) {
  const idx = cart.findIndex(item => item.productId === productId);
  if (idx !== -1) {
    cart[idx].quantity += delta;
    if (cart[idx].quantity <= 0) {
      cart.splice(idx, 1);
    }
  }
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById('cart-count-badge');
  const body = document.getElementById('cart-drawer-body');
  const subtotalEl = document.getElementById('cart-subtotal');

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) badge.textContent = totalCount;

  let subtotal = 0;

  if (body) {
    if (cart.length === 0) {
      body.innerHTML = `
        <div style="text-align:center; padding: 40px 0; color: #888;">
          <p style="text-transform:uppercase; font-size:12px; letter-spacing:1px;">Your cart is currently empty.</p>
        </div>
      `;
    } else {
      body.innerHTML = cart.map(item => {
        const prod = PRODUCTS.find(p => p.id === item.productId);
        if (!prod) return '';
        const itemTotal = prod.priceEUR * item.quantity;
        subtotal += itemTotal;

        return `
          <div class="cart-item">
            <img class="cart-item__image" src="${prod.primaryImage}" alt="${prod.title}">
            <div class="cart-item__details">
              <div>
                <h4 class="cart-item__title">${prod.title}</h4>
                <div class="cart-item__meta">Size: ${item.size}</div>
                <div class="cart-item__price">${formatPrice(prod.priceEUR)}</div>
              </div>

              <div class="cart-item__quantity-controls">
                <button class="qty-btn" onclick="updateCartQuantity('${prod.id}', -1)">-</button>
                <span style="font-size:12px; font-weight:600;">${item.quantity}</span>
                <button class="qty-btn" onclick="updateCartQuantity('${prod.id}', 1)">+</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  if (subtotalEl) {
    subtotalEl.textContent = formatPrice(subtotal);
  }
}

function triggerCheckout() {
  alert('Redirecting to secure BOTTER Checkout with Shop Pay / Apple Pay...');
}

/* ==========================================================================
   MODALS (ABOUT, MANIFESTO, SUSTAINABILITY, QUICK VIEW)
   ========================================================================== */
function initModals() {
  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      openModal(targetId);
    });
  });

  document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(close => {
    close.addEventListener('click', (e) => {
      if (e.target === close) {
        closeAllModals();
      }
    });
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('is-open'));
  document.body.style.overflow = '';
}

function openQuickViewModal(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  const modalBody = document.getElementById('quickview-modal-body');
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 30px;">
        <div>
          <img src="${prod.primaryImage}" alt="${prod.title}" style="width:100%; border:1px solid #eee;">
        </div>
        <div style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <span style="font-size:11px; text-transform:uppercase; color:#888;">${prod.categoryName}</span>
            <h2 style="font-family:var(--font-display); font-size:22px; text-transform:uppercase; margin:8px 0;">${prod.title}</h2>
            <div style="font-size:18px; font-weight:700; color:var(--color-accent); margin-bottom:16px;">
              ${formatPrice(prod.priceEUR)}
            </div>
            <p style="font-size:13px; line-height:1.6; color:#444; margin-bottom:20px;">
              ${prod.description}
            </p>
            <div style="margin-bottom:20px;">
              <span style="font-size:11px; text-transform:uppercase; font-weight:600; display:block; margin-bottom:8px;">Select Size:</span>
              <div style="display:flex; gap:8px;">
                ${prod.sizes.map(s => `
                  <button style="border:1px solid #000; padding:6px 12px; font-size:11px; font-weight:600;">${s}</button>
                `).join('')}
              </div>
            </div>
          </div>
          <button class="btn-primary btn-dark" style="width:100%; padding:14px;" onclick="quickAddToCart('${prod.id}'); closeAllModals();">
            Add to Cart — ${formatPrice(prod.priceEUR)}
          </button>
        </div>
      </div>
    `;
    openModal('modal-quickview');
  }
}

function openVideoModal() {
  openModal('modal-video');
}

/* ==========================================================================
   PREDICTIVE SEARCH
   ========================================================================== */
function initSearch() {
  const trigger = document.getElementById('search-trigger');
  const overlay = document.getElementById('search-overlay');
  const close = document.getElementById('search-close');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  trigger?.addEventListener('click', (e) => {
    e.preventDefault();
    overlay?.classList.add('is-open');
    input?.focus();
  });

  close?.addEventListener('click', () => {
    overlay?.classList.remove('is-open');
  });

  input?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      if (results) results.innerHTML = '';
      return;
    }

    const matches = PRODUCTS.filter(p => p.title.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q));

    if (results) {
      if (matches.length === 0) {
        results.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:20px; text-transform:uppercase; font-size:12px;">No results found for "${q}".</p>`;
      } else {
        results.innerHTML = matches.map(p => `
          <div style="background:#fff; border:1px solid #ddd; padding:12px; cursor:pointer;" onclick="openQuickViewModal('${p.id}'); document.getElementById('search-overlay').classList.remove('is-open');">
            <img src="${p.primaryImage}" style="width:100%; height:160px; object-fit:cover; margin-bottom:8px;">
            <h4 style="font-size:11px; text-transform:uppercase;">${p.title}</h4>
            <span style="font-size:12px; font-weight:700; color:var(--color-accent);">${formatPrice(p.priceEUR)}</span>
          </div>
        `).join('');
      }
    }
  });
}

/* ==========================================================================
   LOOKBOOK SHOWCASE
   ========================================================================== */
function initLookbook() {
  const container = document.getElementById('lookbook-grid');
  if (!container) return;

  container.innerHTML = LOOKBOOK_ITEMS.map(lb => `
    <div class="lookbook-item" onclick="openVideoModal()">
      <img src="${lb.image}" alt="${lb.season} - ${lb.title}">
      <div class="lookbook-item__overlay">
        <span class="lookbook-item__season">${lb.season} Lookbook</span>
        <h3 class="lookbook-item__title">${lb.title}</h3>
      </div>
    </div>
  `).join('');
}
