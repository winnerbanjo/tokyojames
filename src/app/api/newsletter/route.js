import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Subscriber from '@/lib/models/Subscriber';
import { failure, invalid } from '@/lib/api';
export async function POST(request) {
  try {
    const body = await request.json();
    if (typeof body.email !== 'string' || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) invalid('Enter a valid email address.');
    const email = body.email.trim().toLowerCase();
    await connectToDatabase();
    await Subscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
    return NextResponse.json({ success: true, message: 'Thank you for subscribing.' });
  } catch (error) { if (error.code === 11000) return NextResponse.json({ success: true, message: 'Thank you for subscribing.' }); return failure(error); }
}
