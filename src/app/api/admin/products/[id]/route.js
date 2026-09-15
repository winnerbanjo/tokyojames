import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth';
import { failure } from '@/lib/api';
import { productData } from '@/lib/product-validation';

export async function PUT(request, { params }) {
  const denied = await requireAdmin(request); if (denied) return denied;
  try {
    const body = productData(await request.json());
    await connectToDatabase();
    const data = await Product.findOneAndUpdate({ id: (await params).id }, { $set: body }, { new: true, runValidators: true }).lean();
    return NextResponse.json({ success: Boolean(data), data, message: data ? 'Product updated.' : 'Product not found.' }, { status: data ? 200 : 404 });
  } catch (error) { return failure(error); }
}
export async function DELETE(request, { params }) {
  const denied = await requireAdmin(request); if (denied) return denied;
  try {
    await connectToDatabase();
    const result = await Product.deleteOne({ id: (await params).id });
    return NextResponse.json({ success: result.deletedCount === 1, message: result.deletedCount ? 'Product deleted.' : 'Product not found.' }, { status: result.deletedCount ? 200 : 404 });
  } catch (error) { return failure(error); }
}
