import { NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import Product from '@/lib/models/Product';

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const body = await request.json();

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const updated = await Product.findOneAndUpdate({ id }, body, { new: true }).lean();
        if (updated) {
          return NextResponse.json({ success: true, message: 'Product updated in MongoDB', data: updated });
        }
      }
    } catch (err) {
      console.warn('DB update fallback to memory:', err.message);
    }

    const idx = memoryStore.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      memoryStore.products[idx] = { ...memoryStore.products[idx], ...body };
      return NextResponse.json({ success: true, message: 'Product updated', data: memoryStore.products[idx] });
    }

    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    try {
      const conn = await connectToDatabase();
      if (conn) {
        await Product.deleteOne({ id });
      }
    } catch (err) {
      console.warn('DB delete fallback to memory:', err.message);
    }

    memoryStore.products = memoryStore.products.filter(p => p.id !== id);
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
