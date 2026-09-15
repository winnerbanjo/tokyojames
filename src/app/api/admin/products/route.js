import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth';
import { failure } from '@/lib/api';
import { productData } from '@/lib/product-validation';
import { randomUUID } from 'node:crypto';
export async function POST(request) {
  const denied = await requireAdmin(request); if (denied) return denied;
  try {
    const body = productData(await request.json());
    await connectToDatabase();
    const data = await Product.create({ ...body, id: `tj-${randomUUID()}` });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) { return failure(error); }
}
