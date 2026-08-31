'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'pages', 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [siteContent, setSiteContent] = useState({
    about: { title: '', paragraph1: '', paragraph2: '' },
    manifesto: { title: '', quote: '', subtext: '' },
    sustainability: { title: '', headline: '', paragraph: '' },
    hero: { headline: '', subheadline: '', primaryBtnText: '', secondaryBtnText: '' },
    footer: { vatNumber: '', copyrightText: '', contactEmail: '', instagramUrl: '' },
    rates: { USD: 1.08, GBP: 0.85 }
  });
  const [savingContent, setSavingContent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingSecondary, setUploadingSecondary] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'tailoring',
    categoryName: 'Bespoke Tailoring',
    priceEUR: '',
    originalPriceEUR: '',
    badge: '',
    primaryImage: '',
    secondaryImage: '',
    description: '',
    sizes: '46, 48, 50, 52'
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchSiteContent();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  const fetchSiteContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.success && data.data) setSiteContent(data.data);
    } catch (err) {
      console.error('Error loading site content:', err);
    }
  };

  const handleSaveSiteContent = async (e) => {
    e.preventDefault();
    setSavingContent(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteContent)
      });
      const data = await res.json();
      if (data.success) {
        alert('✨ Site Pages & Content saved successfully! All storefront copy is now updated live.');
      } else {
        alert('Failed to save content: ' + data.message);
      }
    } catch (err) {
      alert('Error saving site content: ' + err.message);
    } finally {
      setSavingContent(false);
    }
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      category: 'tailoring',
      categoryName: 'Bespoke Tailoring',
      priceEUR: '',
      originalPriceEUR: '',
      badge: '',
      primaryImage: '',
      secondaryImage: '',
      description: '',
      sizes: '46, 48, 50, 52'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      categoryName: product.categoryName,
      priceEUR: product.priceEUR,
      originalPriceEUR: product.originalPriceEUR || '',
      badge: product.badge || '',
      primaryImage: product.primaryImage,
      secondaryImage: product.secondaryImage || '',
      description: product.description,
      sizes: product.sizes ? product.sizes.join(', ') : '46, 48, 50, 52'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product from TOKYO JAMES store?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('Product deleted successfully');
        fetchProducts();
      }
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    const isPrimary = type === 'primary';
    if (isPrimary) setUploadingPrimary(true);
    else setUploadingSecondary(true);

    try {
      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body
      });
      const data = await res.json();

      if (data.success && data.url) {
        setFormData(prev => ({
          ...prev,
          [isPrimary ? 'primaryImage' : 'secondaryImage']: data.url
        }));
      } else {
        alert('Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error uploading file: ' + err.message);
    } finally {
      if (isPrimary) setUploadingPrimary(false);
      else setUploadingSecondary(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.priceEUR || !formData.primaryImage) {
      alert('Please fill in Title, Price in EUR, and upload/provide a Primary Image');
      return;
    }

    const payload = {
      title: formData.title,
      category: formData.category,
      categoryName: formData.categoryName,
      priceEUR: parseFloat(formData.priceEUR),
      originalPriceEUR: formData.originalPriceEUR ? parseFloat(formData.originalPriceEUR) : null,
      badge: formData.badge || null,
      badgeClass: formData.badge ? (formData.badge.toLowerCase().includes('sale') ? 'badge--sale' : 'badge--new') : '',
      primaryImage: formData.primaryImage,
      secondaryImage: formData.secondaryImage || formData.primaryImage,
      description: formData.description,
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        alert(editingProduct ? 'Product updated successfully!' : 'Product added to store catalog!');
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to save product: ' + err.message);
    }
  };

  const handleReseed = async () => {
    if (!confirm('This will reset the catalog database to original TOKYO JAMES runway collections. Proceed?')) return;
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      alert(data.message || 'Database re-seeded successfully!');
      fetchProducts();
    } catch (err) {
      alert('Error seeding database: ' + err.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const totalCatalogValue = products.reduce((sum, p) => sum + (p.priceEUR || 0), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalEUR || 0), 0);

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* DASHBOARD HEADER & QUICK ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
            TOKYO JAMES — Store CMS & Order Management
          </h1>
          <p style={{ color: '#71717a', fontSize: '13px', marginTop: '4px' }}>
            100% Editable inner pages, hero banners, product catalog, upload fashion media, and client orders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleReseed} 
            style={{ 
              background: '#27272a', 
              color: '#f4f4f5', 
              border: '1px solid #3f3f46', 
              padding: '10px 18px', 
              borderRadius: '6px', 
              fontSize: '12px', 
              fontWeight: '600', 
              cursor: 'pointer' 
            }}
          >
            ⚡ Re-Seed Catalog
          </button>
          <button 
            onClick={handleCreateNew} 
            style={{ 
              background: '#d00000', 
              color: '#ffffff', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '6px', 
              fontSize: '12px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              cursor: 'pointer' 
            }}
          >
            + Add New Garment
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', fontWeight: '600' }}>Active Store Products</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', marginTop: '6px' }}>{products.length}</div>
        </div>

        <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', fontWeight: '600' }}>Total Catalog Value (EUR)</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#22c55e', marginTop: '6px' }}>
            € {totalCatalogValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', fontWeight: '600' }}>Total Client Orders</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', marginTop: '6px' }}>{orders.length}</div>
        </div>

        <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', padding: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', fontWeight: '600' }}>Total Revenue</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#eab308', marginTop: '6px' }}>
            € {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #27272a', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('products')} 
          style={{ 
            padding: '12px 24px', 
            fontSize: '13px', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            background: 'none', 
            color: activeTab === 'products' ? '#d00000' : '#a1a1aa', 
            borderBottom: activeTab === 'products' ? '2px solid #d00000' : 'none', 
            cursor: 'pointer' 
          }}
        >
          Garments & Catalog ({products.length})
        </button>

        <button 
          onClick={() => setActiveTab('pages')} 
          style={{ 
            padding: '12px 24px', 
            fontSize: '13px', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            background: 'none', 
            color: activeTab === 'pages' ? '#d00000' : '#a1a1aa', 
            borderBottom: activeTab === 'pages' ? '2px solid #d00000' : 'none', 
            cursor: 'pointer' 
          }}
        >
          📝 Site Pages & Content (CMS)
        </button>

        <button 
          onClick={() => setActiveTab('orders')} 
          style={{ 
            padding: '12px 24px', 
            fontSize: '13px', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            background: 'none', 
            color: activeTab === 'orders' ? '#d00000' : '#a1a1aa', 
            borderBottom: activeTab === 'orders' ? '2px solid #d00000' : 'none', 
            cursor: 'pointer' 
          }}
        >
          Client Orders ({orders.length})
        </button>
      </div>

      {/* TAB 1: PRODUCTS CATALOG */}
      {activeTab === 'products' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search garments by title or category..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ 
                width: '340px', 
                background: '#18181b', 
                border: '1px solid #3f3f46', 
                color: '#fff', 
                padding: '10px 14px', 
                borderRadius: '6px', 
                fontSize: '13px', 
                outline: 'none' 
              }}
            />
          </div>

          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#18181b', borderBottom: '1px solid #27272a', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>
                  <th style={{ padding: '14px 16px' }}>Garment Image</th>
                  <th style={{ padding: '14px 16px' }}>Title</th>
                  <th style={{ padding: '14px 16px' }}>Category</th>
                  <th style={{ padding: '14px 16px' }}>Price (EUR)</th>
                  <th style={{ padding: '14px 16px' }}>Badge</th>
                  <th style={{ padding: '14px 16px' }}>Available Sizes</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #27272a', color: '#e4e4e7' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <img src={p.primaryImage} alt={p.title} style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #3f3f46' }} />
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>
                      {p.title}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#a1a1aa' }}>
                      {p.categoryName}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#22c55e' }}>
                      € {p.priceEUR.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.badge ? (
                        <span style={{ background: p.badgeClass === 'badge--sale' ? '#d00000' : '#27272a', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                          {p.badge}
                        </span>
                      ) : (
                        <span style={{ color: '#52525b', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#a1a1aa' }}>
                      {p.sizes ? p.sizes.join(', ') : '46, 48, 50, 52'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleEdit(p)}
                        style={{ background: '#27272a', color: '#38bdf8', border: '1px solid #0284c7', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', marginRight: '8px', cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        style={{ background: '#27272a', color: '#ef4444', border: '1px solid #dc2626', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TAB 2: SITE PAGES & CONTENT (CMS) */}
      {activeTab === 'pages' && (
        <form onSubmit={handleSaveSiteContent} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* SECTION 1: ABOUT PAGE */}
          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #27272a', paddingBottom: '10px', marginTop: 0, color: '#d00000' }}>
              1. About TOKYO JAMES Page & Modal
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Modal Title</label>
                <input 
                  type="text" 
                  value={siteContent.about.title} 
                  onChange={e => setSiteContent({ ...siteContent, about: { ...siteContent.about, title: e.target.value } })} 
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Brand Story (Paragraph 1)</label>
                <textarea 
                  rows={4} 
                  value={siteContent.about.paragraph1} 
                  onChange={e => setSiteContent({ ...siteContent, about: { ...siteContent.about, paragraph1: e.target.value } })} 
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', lineHeight: '1.6' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Designer Profile (Paragraph 2)</label>
                <textarea 
                  rows={4} 
                  value={siteContent.about.paragraph2} 
                  onChange={e => setSiteContent({ ...siteContent, about: { ...siteContent.about, paragraph2: e.target.value } })} 
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', lineHeight: '1.6' }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: MANIFESTO */}
          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #27272a', paddingBottom: '10px', marginTop: 0, color: '#d00000' }}>
              2. The Manifesto & Philosophy
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Brand Quote</label>
                <textarea 
                  rows={3} 
                  value={siteContent.manifesto.quote} 
                  onChange={e => setSiteContent({ ...siteContent, manifesto: { ...siteContent.manifesto, quote: e.target.value } })} 
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', lineHeight: '1.6' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Manifesto Mission Statement</label>
                <textarea 
                  rows={3} 
                  value={siteContent.manifesto.subtext} 
                  onChange={e => setSiteContent({ ...siteContent, manifesto: { ...siteContent.manifesto, subtext: e.target.value } })} 
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', lineHeight: '1.6' }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: CRAFTSMANSHIP & SUSTAINABILITY */}
          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #27272a', paddingBottom: '10px', marginTop: 0, color: '#d00000' }}>
              3. Craftsmanship & Sustainability
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Headline</label>
                <input 
                  type="text" 
                  value={siteContent.sustainability.headline} 
                  onChange={e => setSiteContent({ ...siteContent, sustainability: { ...siteContent.sustainability, headline: e.target.value } })} 
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Sustainability Policy & Solar-Punk Narrative</label>
                <textarea 
                  rows={4} 
                  value={siteContent.sustainability.paragraph} 
                  onChange={e => setSiteContent({ ...siteContent, sustainability: { ...siteContent.sustainability, paragraph: e.target.value } })} 
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', lineHeight: '1.6' }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: HERO CAMPAIGN BANNER */}
          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #27272a', paddingBottom: '10px', marginTop: 0, color: '#d00000' }}>
              4. Homepage Hero Campaign Banner
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Main Runway Headline</label>
                <input 
                  type="text" 
                  value={siteContent.hero.headline} 
                  onChange={e => setSiteContent({ ...siteContent, hero: { ...siteContent.hero, headline: e.target.value } })} 
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Sub-Headline</label>
                <input 
                  type="text" 
                  value={siteContent.hero.subheadline} 
                  onChange={e => setSiteContent({ ...siteContent, hero: { ...siteContent.hero, subheadline: e.target.value } })} 
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px' }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: FOOTER & CURRENCY RATES */}
          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #27272a', paddingBottom: '10px', marginTop: 0, color: '#d00000' }}>
              5. Footer Copy & Exchange Rates
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>VAT Details</label>
                <input 
                  type="text" 
                  value={siteContent.footer.vatNumber} 
                  onChange={e => setSiteContent({ ...siteContent, footer: { ...siteContent.footer, vatNumber: e.target.value } })} 
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Copyright Line</label>
                <input 
                  type="text" 
                  value={siteContent.footer.copyrightText} 
                  onChange={e => setSiteContent({ ...siteContent, footer: { ...siteContent.footer, copyrightText: e.target.value } })} 
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>USD ($) Exchange Rate</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={siteContent.rates.USD} 
                  onChange={e => setSiteContent({ ...siteContent, rates: { ...siteContent.rates, USD: parseFloat(e.target.value) } })} 
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>GBP (£) Exchange Rate</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={siteContent.rates.GBP} 
                  onChange={e => setSiteContent({ ...siteContent, rates: { ...siteContent.rates, GBP: parseFloat(e.target.value) } })} 
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button 
              type="submit" 
              disabled={savingContent}
              style={{ background: '#d00000', color: '#fff', border: 'none', padding: '16px 36px', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', borderRadius: '6px' }}
            >
              {savingContent ? 'Saving Live Content...' : '💾 Save All Site Content →'}
            </button>
          </div>

        </form>
      )}

      {/* TAB 3: CLIENT ORDERS */}
      {activeTab === 'orders' && (
        <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#18181b', borderBottom: '1px solid #27272a', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>
                <th style={{ padding: '14px 16px' }}>Receipt ID</th>
                <th style={{ padding: '14px 16px' }}>Customer Name</th>
                <th style={{ padding: '14px 16px' }}>Email</th>
                <th style={{ padding: '14px 16px' }}>Shipping Address</th>
                <th style={{ padding: '14px 16px' }}>Total (EUR)</th>
                <th style={{ padding: '14px 16px' }}>Date</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #27272a', color: '#e4e4e7' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#d00000' }}>
                    {o.id}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>
                    {o.customerName}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#a1a1aa' }}>
                    {o.email}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px' }}>
                    {o.shippingAddress}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#22c55e' }}>
                    € {o.totalEUR.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '11px', color: '#71717a' }}>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#14532d', color: '#4ade80', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {o.status || 'Confirmed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT GARMENT MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '12px', padding: '32px', width: '90%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', textTransform: 'uppercase', margin: 0, color: '#fff' }}>
                {editingProduct ? 'Edit Runway Garment' : 'Add New Garment to Catalog'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: '#a1a1aa', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Garment Title *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                  placeholder="e.g. Asymmetric Zip Wool Trench"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Category *</label>
                  <select 
                    value={formData.category}
                    onChange={e => {
                      const catNames = { tailoring: 'Bespoke Tailoring', jackets: 'Leather & Outerwear', polos: 'Polos & Shirts', trousers: 'Tailored Trousers', knitwear: 'Luxury Knitwear', accessories: 'Accessories', sale: 'Archive Sale' };
                      setFormData({ ...formData, category: e.target.value, categoryName: catNames[e.target.value] || 'Tailoring' });
                    }}
                    style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', fontSize: '13px' }}
                  >
                    <option value="tailoring">Bespoke Tailoring</option>
                    <option value="jackets">Leather & Outerwear</option>
                    <option value="polos">Polos & Shirts</option>
                    <option value="trousers">Tailored Trousers</option>
                    <option value="knitwear">Luxury Knitwear</option>
                    <option value="accessories">Accessories</option>
                    <option value="sale">Archive Sale</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Price (EUR €) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={formData.priceEUR} 
                    onChange={e => setFormData({ ...formData, priceEUR: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', fontSize: '13px' }} 
                    placeholder="1850.00"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Badge (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.badge} 
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', fontSize: '13px' }} 
                    placeholder="e.g. Runway AW24 or Archive Sale"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Available Sizes</label>
                  <input 
                    type="text" 
                    value={formData.sizes} 
                    onChange={e => setFormData({ ...formData, sizes: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', fontSize: '13px' }} 
                    placeholder="46, 48, 50, 52"
                  />
                </div>
              </div>

              {/* FILE UPLOAD: PRIMARY IMAGE */}
              <div style={{ border: '1px dashed #3f3f46', padding: '12px', borderRadius: '6px', background: '#18181b' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>
                  Primary Image File Upload *
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => handleFileUpload(e.target.files[0], 'primary')}
                    style={{ fontSize: '12px', color: '#a1a1aa' }}
                  />
                  {uploadingPrimary && <span style={{ fontSize: '11px', color: '#eab308' }}>Uploading image...</span>}
                </div>
                <input 
                  type="text" 
                  value={formData.primaryImage} 
                  onChange={e => setFormData({ ...formData, primaryImage: e.target.value })}
                  style={{ width: '100%', padding: '8px', background: '#09090b', border: '1px solid #27272a', color: '#fff', borderRadius: '4px', fontSize: '12px', marginTop: '8px' }} 
                  placeholder="/images/tj_drive_1.jpg or image URL"
                />
              </div>

              {/* FILE UPLOAD: SECONDARY IMAGE */}
              <div style={{ border: '1px dashed #3f3f46', padding: '12px', borderRadius: '6px', background: '#18181b' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>
                  Secondary Hover Image File Upload (Optional)
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => handleFileUpload(e.target.files[0], 'secondary')}
                    style={{ fontSize: '12px', color: '#a1a1aa' }}
                  />
                  {uploadingSecondary && <span style={{ fontSize: '11px', color: '#eab308' }}>Uploading image...</span>}
                </div>
                <input 
                  type="text" 
                  value={formData.secondaryImage} 
                  onChange={e => setFormData({ ...formData, secondaryImage: e.target.value })}
                  style={{ width: '100%', padding: '8px', background: '#09090b', border: '1px solid #27272a', color: '#fff', borderRadius: '4px', fontSize: '12px', marginTop: '8px' }} 
                  placeholder="/images/tj_drive_2.jpg"
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Garment Description</label>
                <textarea 
                  rows={3} 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', fontSize: '13px' }} 
                  placeholder="Tailored according to Savile Row specifications with West African embellishment..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#27272a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#d00000', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer' }}>Save Garment</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
