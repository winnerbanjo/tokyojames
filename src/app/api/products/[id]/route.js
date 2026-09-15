import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/lib/models/Product';
import { failure } from '@/lib/api';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const data = await Product.findOne({ id: (await params).id }).lean();
    return NextResponse.json({ success: Boolean(data), data, ...(!data && { message: 'Product not found.' }) }, { status: data ? 200 : 404 });
  } catch (error) { return failure(error); }
}
