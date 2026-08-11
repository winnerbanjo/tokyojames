import { NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import Product from '@/lib/models/Product';
import { INITIAL_PRODUCTS } from '@/lib/seedData';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    const conn = await connectToDatabase();
    if (conn) {
      let query = {};
      if (category && category !== 'all') {
        query.category = category;
      }
      let products = await Product.find(query).lean();
      if (!products || products.length === 0) {
        // Auto-seed if empty
        await Product.insertMany(INITIAL_PRODUCTS);
        products = await Product.find(query).lean();
      }
      return NextResponse.json({ success: true, data: products, source: 'mongodb' });
    }
  } catch (err) {
    console.warn('API falling back to memory store:', err.message);
  }

  // Fallback to memory store
  let data = memoryStore.products;
  if (category && category !== 'all') {
    data = data.filter(p => p.category === category);
  }
  return NextResponse.json({ success: true, data, source: 'seed-memory' });
}
