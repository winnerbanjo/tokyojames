'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.data);
          setActiveImage(data.data.primaryImage);
          if (data.data.sizes && data.data.sizes.length > 0) {
            setSelectedSize(data.data.sizes[0]);
          }
        }
      })
      .catch(err => console.error('Error fetching product:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '2px' }}>
        Loading TOKYO JAMES Piece...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center', fontFamily: 'var(--font-display)' }}>
        <h2 style={{ fontSize: '24px', textTransform: 'uppercase', marginBottom: '16px' }}>Product Not Found</h2>
        <a href="/" className="btn-primary btn-dark">Return to Collections</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1300px', margin: '40px auto', padding: '0 var(--container-padding)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px' }}>
        
        {/* IMAGES GALLERY */}
        <div>
          <div style={{ width: '100%', height: '560px', overflow: 'hidden', background: '#f7f7f7', border: '1px solid #000', marginBottom: '16px' }}>
            <img src={activeImage} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <img 
              src={product.primaryImage} 
              alt="View 1" 
              style={{ width: '90px', height: '110px', objectFit: 'cover', border: activeImage === product.primaryImage ? '2px solid #d00000' : '1px solid #ddd', cursor: 'pointer' }}
              onClick={() => setActiveImage(product.primaryImage)} 
            />
            <img 
              src={product.secondaryImage} 
              alt="View 2" 
              style={{ width: '90px', height: '110px', objectFit: 'cover', border: activeImage === product.secondaryImage ? '2px solid #d00000' : '1px solid #ddd', cursor: 'pointer' }}
              onClick={() => setActiveImage(product.secondaryImage)} 
            />
          </div>
        </div>

        {/* DETAILS COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: '700', letterSpacing: '2px' }}>
              {product.categoryName}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '700', textTransform: 'uppercase', margin: '12px 0 16px 0', lineHeight: '1.1' }}>
              {product.title}
            </h1>
            
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '700', color: 'var(--color-accent)', marginBottom: '24px' }}>
              € {product.priceEUR.toFixed(2).replace('.', ',')}
            </div>

            <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#333', marginBottom: '32px', borderBottom: '1px solid #eee', paddingBottom: '24px' }}>
              {product.description}
            </p>

            {/* SIZE SELECTOR */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '12px' }}>
                Select Size (EU Tailoring):
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.sizes.map(size => (
                  <button 
                    key={size} 
                    style={{ 
                      padding: '10px 18px', 
                      border: selectedSize === size ? '2px solid #000' : '1px solid #ccc', 
                      background: selectedSize === size ? '#000' : '#fff', 
                      color: selectedSize === size ? '#fff' : '#000', 
                      fontFamily: 'var(--font-display)', 
                      fontSize: '12px', 
                      fontWeight: '700' 
                    }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <button 
              className="btn-primary btn-dark" 
              style={{ width: '100%', padding: '16px', fontSize: '13px', marginBottom: '16px' }}
              onClick={() => alert(`Added ${product.title} (Size: ${selectedSize}) to your TOKYO JAMES cart!`)}
            >
              ADD TO CART — € {product.priceEUR.toFixed(2).replace('.', ',')}
            </button>
            <p style={{ fontSize: '11px', color: '#666', textAlign: 'center', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
              ✓ Free Worldwide Express Shipping • Handcrafted Heritage Garment
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
