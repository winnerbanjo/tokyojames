import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { failure } from '@/lib/api';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const denied = await requireAdmin(request); if (denied) return denied;
  try {
    const db = await connectToDatabase();
    const data = await db.connection.collection('orders').find({}).sort({ createdAt: -1 }).limit(500).toArray();
    return NextResponse.json({ success: true, data });
  } catch (error) { return failure(error); }
}
export async function POST() {
  return NextResponse.json({ success: false, message: 'Online checkout is not available yet. Please contact the store for assistance.' }, { status: 503 });
}
