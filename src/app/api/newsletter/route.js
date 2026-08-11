import { NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import Subscriber from '@/lib/models/Subscriber';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Invalid email address' }, { status: 400 });
    }

    try {
      const conn = await connectToDatabase();
      if (conn) {
        await Subscriber.create({ email });
        return NextResponse.json({ success: true, message: 'Subscribed to TOKYO JAMES archives!' });
      }
    } catch (err) {
      console.warn('Saving subscriber to memory fallback:', err.message);
    }

    memoryStore.subscribers.push({ email, createdAt: new Date() });
    return NextResponse.json({ success: true, message: 'Subscribed to TOKYO JAMES archives!' });

  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
