import { NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import Product from '@/lib/models/Product';
import { INITIAL_PRODUCTS } from '@/lib/seedData';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const product = await Product.findOne({ id }).lean();
      if (product) {
        return NextResponse.json({ success: true, data: product, source: 'mongodb' });
      }
    }
  } catch (err) {
    console.warn('DB fetch error, checking memory:', err.message);
  }

  const found = memoryStore.products.find(p => p.id === id) || INITIAL_PRODUCTS.find(p => p.id === id);
  if (found) {
    return NextResponse.json({ success: true, data: found, source: 'seed-memory' });
  }

  return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
}
