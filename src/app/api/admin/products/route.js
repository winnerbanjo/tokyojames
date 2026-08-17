import { NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import Product from '@/lib/models/Product';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, categoryName, priceEUR, originalPriceEUR, badge, primaryImage, secondaryImage, description, sizes } = body;

    if (!title || !priceEUR || !primaryImage) {
      return NextResponse.json({ success: false, message: 'Title, price, and primary image are required' }, { status: 400 });
    }

    const newProduct = {
      id: `tj-${Date.now()}`,
      title,
      category: category || 'tailoring',
      categoryName: categoryName || 'Bespoke Tailoring',
      priceEUR: parseFloat(priceEUR),
      originalPriceEUR: originalPriceEUR ? parseFloat(originalPriceEUR) : undefined,
      badge: badge || '',
      badgeClass: badge === 'Sale' ? 'badge-sale' : 'badge-signature',
      primaryImage,
      secondaryImage: secondaryImage || primaryImage,
      description: description || 'Handcrafted TOKYO JAMES luxury piece.',
      sizes: sizes && sizes.length ? sizes : ['46', '48', '50', '52'],
      inStock: true
    };

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const created = await Product.create(newProduct);
        return NextResponse.json({ success: true, message: 'Product created successfully in MongoDB', data: created });
      }
    } catch (err) {
      console.warn('MongoDB create error, adding to memoryStore:', err.message);
    }

    memoryStore.products.unshift(newProduct);
    return NextResponse.json({ success: true, message: 'Product created successfully', data: newProduct });

  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
