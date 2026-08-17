'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
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
      alert('Error deleting product: ' + err.message);
    }
  };

  const handleToggleStock = async (product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !product.inStock })
      });
      const data = await res.json();
      if (data.success) fetchProducts();
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  const handleFileUpload = async (e, fieldType) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    if (fieldType === 'primary') setUploadingPrimary(true);
    if (fieldType === 'secondary') setUploadingSecondary(true);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data
      });
      const result = await res.json();

      if (result.success) {
        if (fieldType === 'primary') {
          setFormData(prev => ({ ...prev, primaryImage: result.url }));
        } else {
          setFormData(prev => ({ ...prev, secondaryImage: result.url }));
        }
      } else {
        alert('Upload failed: ' + result.message);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Url = uploadEvent.target.result;
        if (fieldType === 'primary') {
          setFormData(prev => ({ ...prev, primaryImage: base64Url }));
        } else {
          setFormData(prev => ({ ...prev, secondaryImage: base64Url }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      if (fieldType === 'primary') setUploadingPrimary(false);
      if (fieldType === 'secondary') setUploadingSecondary(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.primaryImage) {
      alert('Please upload or select a primary product image!');
      return;
    }

    const payload = {
      ...formData,
      priceEUR: parseFloat(formData.priceEUR),
      originalPriceEUR: formData.originalPriceEUR ? parseFloat(formData.originalPriceEUR) : undefined,
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
        alert(editingProduct ? 'Product updated successfully!' : 'Product added to store!');
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
    if (!confirm('This will reset the database to original TOKYO JAMES runway collections. Proceed?')) return;
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
            Store Control & Order Management
          </h1>
          <p style={{ color: '#71717a', fontSize: '13px', marginTop: '4px' }}>
            Manage store inventory, upload fashion media, and process client test orders.
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
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            + Upload New Product
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#121215', border: '1px solid #27272a', padding: '20px', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Products</span>
          <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px', color: '#ffffff' }}>{products.length}</div>
        </div>

        <div style={{ background: '#121215', border: '1px solid #27272a', padding: '20px', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px' }}>Received Orders</span>
          <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px', color: '#22c55e' }}>
            {orders.length}
          </div>
        </div>

        <div style={{ background: '#121215', border: '1px solid #27272a', padding: '20px', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Store Revenue</span>
          <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px', color: '#d00000' }}>
            € {totalRevenue.toFixed(2).replace('.', ',')}
          </div>
        </div>

        <div style={{ background: '#121215', border: '1px solid #27272a', padding: '20px', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px' }}>Catalog Total Value</span>
          <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px', color: '#ffffff' }}>
            € {totalCatalogValue.toFixed(2).replace('.', ',')}
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #27272a' }}>
        <button 
          onClick={() => setActiveTab('products')}
          style={{ 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'products' ? '2px solid #d00000' : 'none', 
            color: activeTab === 'products' ? '#fff' : '#a1a1aa', 
            padding: '12px 16px', 
            fontSize: '13px', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            cursor: 'pointer' 
          }}
        >
          Inventory Catalog ({products.length})
        </button>

        <button 
          onClick={() => setActiveTab('orders')}
          style={{ 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'orders' ? '2px solid #d00000' : 'none', 
            color: activeTab === 'orders' ? '#fff' : '#a1a1aa', 
            padding: '12px 16px', 
            fontSize: '13px', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            cursor: 'pointer' 
          }}
        >
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* TAB 1: INVENTORY TABLE */}
      {activeTab === 'products' && (
        <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', padding: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              Garment Inventory Catalog
            </h2>
            
            <input 
              type="text" 
              placeholder="Search inventory..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                background: '#18181b', 
                border: '1px solid #3f3f46', 
                color: '#fff', 
                padding: '8px 14px', 
                borderRadius: '6px', 
                fontSize: '13px', 
                width: '260px',
                outline: 'none'
              }}
            />
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>Loading Inventory...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #27272a', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>
                    <th style={{ padding: '12px' }}>Image</th>
                    <th style={{ padding: '12px' }}>Title</th>
                    <th style={{ padding: '12px' }}>Category</th>
                    <th style={{ padding: '12px' }}>Price (EUR)</th>
                    <th style={{ padding: '12px' }}>Badge</th>
                    <th style={{ padding: '12px' }}>Stock Status</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #1c1c21' }}>
                      <td style={{ padding: '12px' }}>
                        <img src={p.primaryImage} alt={p.title} style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #27272a' }} />
                      </td>
                      <td style={{ padding: '12px', fontWeight: '600', color: '#fff' }}>
                        <a href={`/product/${p.id}`} target="_blank" style={{ color: '#fff', textDecoration: 'none' }}>
                          {p.title} ↗
                        </a>
                      </td>
                      <td style={{ padding: '12px', color: '#a1a1aa' }}>{p.categoryName}</td>
                      <td style={{ padding: '12px', fontWeight: '700', color: '#d00000' }}>
                        € {p.priceEUR.toFixed(2).replace('.', ',')}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {p.badge ? (
                          <span style={{ background: '#27272a', color: '#fff', padding: '2px 6px', fontSize: '10px', borderRadius: '3px', textTransform: 'uppercase' }}>
                            {p.badge}
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button 
                          onClick={() => handleToggleStock(p)}
                          style={{ 
                            background: p.inStock !== false ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: p.inStock !== false ? '#22c55e' : '#ef4444',
                            border: `1px solid ${p.inStock !== false ? '#22c55e' : '#ef4444'}`,
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {p.inStock !== false ? '● In Stock' : '✕ Out of Stock'}
                        </button>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleEdit(p)}
                          style={{ background: '#27272a', color: '#fff', border: '1px solid #3f3f46', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', marginRight: '8px', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          style={{ background: 'rgba(208, 0, 0, 0.2)', color: '#ef4444', border: '1px solid #d00000', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CUSTOMER ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '8px', padding: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              Received Client Test Orders
            </h2>
            <button onClick={fetchOrders} style={{ background: '#27272a', color: '#fff', border: '1px solid #3f3f46', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
              ↻ Refresh Orders
            </button>
          </div>

          {orders.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>No test orders placed yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #27272a', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>
                    <th style={{ padding: '12px' }}>Order ID</th>
                    <th style={{ padding: '12px' }}>Customer Name</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>Items Purchased</th>
                    <th style={{ padding: '12px' }}>Total Paid</th>
                    <th style={{ padding: '12px' }}>Shipping Address</th>
                    <th style={{ padding: '12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #1c1c21' }}>
                      <td style={{ padding: '12px', fontWeight: '700', color: '#d00000' }}>{order.id}</td>
                      <td style={{ padding: '12px', fontWeight: '600', color: '#fff' }}>{order.customerName}</td>
                      <td style={{ padding: '12px', color: '#a1a1aa' }}>{order.email}</td>
                      <td style={{ padding: '12px' }}>
                        {order.items.map((it, idx) => (
                          <div key={idx} style={{ fontSize: '12px', color: '#fff' }}>
                            {it.quantity}x {it.title} (Size {it.size})
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: '12px', fontWeight: '700', color: '#22c55e' }}>
                        € {order.totalEUR.toFixed(2).replace('.', ',')}
                      </td>
                      <td style={{ padding: '12px', color: '#a1a1aa', fontSize: '12px', maxWidth: '240px' }}>
                        {order.shippingAddress}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid #22c55e', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', textTransform: 'uppercase', fontWeight: '700' }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#121215', border: '1px solid #3f3f46', borderRadius: '8px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', color: '#fff' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #27272a', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', textTransform: 'uppercase', margin: 0 }}>
                {editingProduct ? 'Edit TOKYO JAMES Garment' : 'Upload New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Garment Title *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  style={{ width: '100%', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', padding: '10px', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                  placeholder="e.g. Sculptural Leather Overcoat"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Category *</label>
                  <select 
                    value={formData.category} 
                    onChange={e => {
                      const catNames = {
                        tailoring: 'Bespoke Tailoring',
                        jackets: 'Leather & Jackets',
                        polos: 'Polos & Shirts',
                        trousers: 'Trousers',
                        knitwear: 'Knitwear',
                        accessories: 'Footwear & Bags',
                        'archive-sale': 'Archive Sale'
                      };
                      setFormData({ ...formData, category: e.target.value, categoryName: catNames[e.target.value] || 'Tailoring' });
                    }} 
                    style={{ width: '100%', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', padding: '10px', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
                  >
                    <option value="tailoring">Bespoke Tailoring</option>
                    <option value="jackets">Leather & Jackets</option>
                    <option value="polos">Polos & Shirts</option>
                    <option value="trousers">Trousers</option>
                    <option value="knitwear">Knitwear</option>
                    <option value="accessories">Footwear & Accessories</option>
                    <option value="archive-sale">Archive Sale</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Price EUR (€) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={formData.priceEUR} 
                    onChange={e => setFormData({ ...formData, priceEUR: e.target.value })} 
                    style={{ width: '100%', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', padding: '10px', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                    placeholder="1850.00"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Original Price (If Sale)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.originalPriceEUR} 
                    onChange={e => setFormData({ ...formData, originalPriceEUR: e.target.value })} 
                    style={{ width: '100%', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', padding: '10px', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                    placeholder="2200.00"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Badge Tag</label>
                  <input 
                    type="text" 
                    value={formData.badge} 
                    onChange={e => setFormData({ ...formData, badge: e.target.value })} 
                    style={{ width: '100%', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', padding: '10px', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                    placeholder="Runway AW24 / House Signature / Sale"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Primary Product Image (Upload File) *
                </label>
                
                <div style={{ border: '2px dashed #3f3f46', borderRadius: '6px', padding: '20px', textAlign: 'center', background: '#18181b', position: 'relative' }}>
                  {formData.primaryImage ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={formData.primaryImage} alt="Primary Preview" style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #3f3f46' }} />
                      <div style={{ textAlign: 'left', flexGrow: 1 }}>
                        <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '700', display: 'block' }}>✓ Image Ready</span>
                        <span style={{ fontSize: '11px', color: '#71717a', wordBreak: 'break-all' }}>{formData.primaryImage}</span>
                        <div style={{ marginTop: '8px' }}>
                          <label style={{ background: '#27272a', color: '#fff', padding: '4px 10px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer' }}>
                            Change File
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, 'primary')} />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '4px 0' }}>
                        {uploadingPrimary ? 'Uploading file...' : 'Click to upload image file from computer'}
                      </p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => handleFileUpload(e, 'primary')}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Secondary Image (Hover / Model View File Upload)
                </label>
                
                <div style={{ border: '2px dashed #3f3f46', borderRadius: '6px', padding: '20px', textAlign: 'center', background: '#18181b', position: 'relative' }}>
                  {formData.secondaryImage ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={formData.secondaryImage} alt="Secondary Preview" style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #3f3f46' }} />
                      <div style={{ textAlign: 'left', flexGrow: 1 }}>
                        <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '700', display: 'block' }}>✓ Secondary Image Ready</span>
                        <span style={{ fontSize: '11px', color: '#71717a', wordBreak: 'break-all' }}>{formData.secondaryImage}</span>
                        <div style={{ marginTop: '8px' }}>
                          <label style={{ background: '#27272a', color: '#fff', padding: '4px 10px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer' }}>
                            Change File
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, 'secondary')} />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '4px 0' }}>
                        {uploadingSecondary ? 'Uploading secondary file...' : 'Upload secondary hover view image'}
                      </p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => handleFileUpload(e, 'secondary')}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a1a1aa', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Garment Description</label>
                <textarea 
                  rows={3} 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  style={{ width: '100%', background: '#18181b', border: '1px solid #3f3f46', color: '#fff', padding: '10px', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                  placeholder="Describe tailoring, craftsmanship, materials..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#27272a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ background: '#d00000', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {editingProduct ? 'Save Changes' : 'Upload Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
