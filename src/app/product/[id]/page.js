'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';

export default function ProductDetailPage() {
  const params = useParams();
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (params?.id) {
      fetch(`/api/products/${params.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setProduct(data.data);
            setActiveImage(data.data.primaryImage);
            if (data.data.sizes && data.data.sizes.length) {
              setSelectedSize(data.data.sizes[0]);
            }
          }
        })
        .catch(err => console.error('Error fetching product:', err))
        .finally(() => setLoading(false));
    }
  }, [params]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size first!');
      return;
    }
    
    const event = new CustomEvent('tj-add-to-cart', {
      detail: {
        id: product.id,
        title: product.title,
        size: selectedSize,
        priceEUR: product.priceEUR,
        quantity: quantity,
        image: product.primaryImage
      }
    });
    window.dispatchEvent(event);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size first!');
      return;
    }
    
    const event = new CustomEvent('tj-buy-now', {
      detail: {
        id: product.id,
        title: product.title,
        size: selectedSize,
        priceEUR: product.priceEUR,
        quantity: quantity,
        image: product.primaryImage
      }
    });
    window.dispatchEvent(event);
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', background: '#fff', minHeight: '60vh' }}>
        <h2 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>Loading TOKYO JAMES Garment...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', background: '#fff', minHeight: '60vh' }}>
        <h2 style={{ fontSize: '18px', textTransform: 'uppercase' }}>Garment Not Found</h2>
        <a href="/" style={{ fontSize: '13px', textDecoration: 'underline', marginTop: '12px', display: 'inline-block' }}>← Return to Storefront</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px 80px' }}>
      
      {/* BREADCRUMB */}
      <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', marginBottom: '24px', letterSpacing: '1px' }}>
        <a href="/">Store</a> / <a href="/#collections">{product.categoryName}</a> / <span style={{ color: '#000', fontWeight: '700' }}>{product.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
        
        {/* GALLERY IMAGES */}
        <div>
          <div style={{ border: '1px solid #000', overflow: 'hidden', background: '#f7f7f7', marginBottom: '16px' }}>
            <img src={activeImage || product.primaryImage} alt={product.title} style={{ width: '100%', height: '580px', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <img 
              src={product.primaryImage} 
              alt="Thumb 1" 
              onClick={() => setActiveImage(product.primaryImage)}
              style={{ width: '80px', height: '100px', objectFit: 'cover', cursor: 'pointer', border: activeImage === product.primaryImage ? '2px solid #000' : '1px solid #ddd' }} 
            />
            {product.secondaryImage && (
              <img 
                src={product.secondaryImage} 
                alt="Thumb 2" 
                onClick={() => setActiveImage(product.secondaryImage)}
                style={{ width: '80px', height: '100px', objectFit: 'cover', cursor: 'pointer', border: activeImage === product.secondaryImage ? '2px solid #000' : '1px solid #ddd' }} 
              />
            )}
          </div>
        </div>

        {/* GARMENT DETAILS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {product.badge && (
            <span style={{ display: 'inline-block', background: '#000', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '4px 10px', textTransform: 'uppercase', width: 'max-content' }}>
              {product.badge}
            </span>
          )}

          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '700', textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
            {product.title}
          </h1>

          <div style={{ fontSize: '20px', fontWeight: '700', color: '#d00000' }}>
            {formatPrice(product.priceEUR)}
          </div>

          <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#333' }}>
            {product.description}
          </p>

          {/* SIZE SELECTOR */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}>Select Size:</span>
              <span style={{ fontSize: '11px', textDecoration: 'underline', color: '#666', cursor: 'pointer' }} onClick={() => alert('Size Guide: 46 (S), 48 (M), 50 (L), 52 (XL)')}>Size Guide</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {product.sizes && product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    border: selectedSize === size ? '2px solid #000' : '1px solid #ccc',
                    background: selectedSize === size ? '#000' : '#fff',
                    color: selectedSize === size ? '#fff' : '#000',
                    padding: '10px 18px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    minWidth: '54px'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY CONTROL */}
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Quantity:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ border: '1px solid #000', width: '36px', height: '36px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}
              >
                -
              </button>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                style={{ border: '1px solid #000', width: '36px', height: '36px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <button 
              onClick={handleAddToCart}
              style={{
                background: '#000000',
                color: '#ffffff',
                border: '1px solid #000000',
                padding: '16px',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s ease'
              }}
            >
              Add to Cart
            </button>

            <button 
              onClick={handleBuyNow}
              style={{
                background: '#d00000',
                color: '#ffffff',
                border: 'none',
                padding: '16px',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Buy Now — Express Checkout
            </button>
          </div>

          {/* ACCORDION DETAILS */}
          <div style={{ marginTop: '24px', borderTop: '1px solid #eee', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '12px' }}>
            <div>
              <strong style={{ textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>✓ Craftsmanship & Fit</strong>
              Hand-tailored according to Savile Row specifications with West African artisanal embellishment. Model is 188cm wearing size 48.
            </div>

            <div>
              <strong style={{ textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>✓ Worldwide Express Delivery</strong>
              Dispatched within 24 hours. Complimentary worldwide express shipping on all orders over €500.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
