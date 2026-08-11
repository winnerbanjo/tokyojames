import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/lib/models/Product';
import Lookbook from '@/lib/models/Lookbook';
import { INITIAL_PRODUCTS, INITIAL_LOOKBOOKS } from '@/lib/seedData';

export async function POST() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await Product.deleteMany({});
      await Lookbook.deleteMany({});

      const insertedProducts = await Product.insertMany(INITIAL_PRODUCTS);
      const insertedLookbooks = await Lookbook.insertMany(INITIAL_LOOKBOOKS);

      return NextResponse.json({
        success: true,
        message: 'Database seeded successfully with TOKYO JAMES collections!',
        productsCount: insertedProducts.length,
        lookbooksCount: insertedLookbooks.length
      });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Seeded in memory mode' });
}
