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
    if (!product.inStock || !selectedSize) {
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
    if (!product.inStock || !selectedSize) {
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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px 80px' }}>

      {/* BREADCRUMB */}
      <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', marginBottom: '20px', letterSpacing: '1px' }}>
        <a href="/">Store</a> / <a href="/#collections">{product.categoryName}</a> / <span style={{ color: '#000', fontWeight: '700' }}>{product.title}</span>
      </div>

      <div className="pdp-grid">

        {/* GALLERY IMAGES */}
        <div>
          <div style={{ border: '1px solid #000', overflow: 'hidden', background: '#f7f7f7', marginBottom: '16px' }}>
            <img src={activeImage || product.primaryImage} alt={product.title} style={{ width: '100%', height: 'auto', maxHeight: '580px', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <img
              src={product.primaryImage}
              alt="Thumb 1"
              onClick={() => setActiveImage(product.primaryImage)}
              style={{ width: '70px', height: '90px', objectFit: 'cover', cursor: 'pointer', border: activeImage === product.primaryImage ? '2px solid #000' : '1px solid #ddd' }}
            />
            {product.secondaryImage && (
              <img
                src={product.secondaryImage}
                alt="Thumb 2"
                onClick={() => setActiveImage(product.secondaryImage)}
                style={{ width: '70px', height: '90px', objectFit: 'cover', cursor: 'pointer', border: activeImage === product.secondaryImage ? '2px solid #000' : '1px solid #ddd' }}
              />
            )}
          </div>
        </div>

        {/* GARMENT DETAILS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {product.badge && (
            <span style={{ display: 'inline-block', background: '#000', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '4px 10px', textTransform: 'uppercase', width: 'max-content' }}>
              {product.badge}
            </span>
          )}

          <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: '700', textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
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

            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {product.sizes && product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    border: selectedSize === size ? '2px solid #000' : '1px solid #ccc',
                    background: selectedSize === size ? '#000' : '#fff',
                    color: selectedSize === size ? '#fff' : '#000',
                    padding: '10px 16px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    minWidth: '50px'
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
                onClick={() => setQuantity(q => Math.min(99, q + 1))}
                style={{ border: '1px solid #000', width: '36px', height: '36px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <button
              disabled={!product.inStock} onClick={handleAddToCart}
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
              {product.inStock ? 'Add to Cart' : 'Sold out'}
            </button>

            <button
              disabled={!product.inStock} onClick={handleBuyNow}
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
              Checkout availability
            </button>
          </div>


        </div>

      </div>

    </div>
  );
}
