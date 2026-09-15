import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/lib/models/Product';
import { failure } from '@/lib/api';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  try {
    await connectToDatabase();
    const category = new URL(request.url).searchParams.get('category');
    const data = await Product.find(category && category !== 'all' ? { category } : {}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data });
  } catch (error) { return failure(error); }
}
