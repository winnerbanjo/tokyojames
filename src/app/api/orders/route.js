import { NextResponse } from 'next/server';

// Memory store fallback for orders
const memoryOrders = [
  {
    id: 'TJ-849201',
    customerName: 'Amina Al-Mansoor',
    email: 'amina@example.com',
    items: [
      { id: 'tj-1', title: 'Sculptural Cowhide-Panelled Wool Blazer', size: '48', priceEUR: 1850, quantity: 1 }
    ],
    totalEUR: 1850.00,
    shippingAddress: '14 Mayfair Square, London W1J 8AJ, UK',
    paymentMethod: 'Credit Card (**** 4242)',
    status: 'Confirmed & Processing',
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  return NextResponse.json({ success: true, data: memoryOrders });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, email, address, city, country, zip, items, totalEUR, paymentMethod } = body;

    if (!customerName || !email || !items || !items.length) {
      return NextResponse.json({ success: false, message: 'Customer details and order items are required' }, { status: 400 });
    }

    const newOrder = {
      id: `TJ-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      email,
      items,
      totalEUR: parseFloat(totalEUR),
      shippingAddress: `${address}, ${city}, ${country} ${zip}`,
      paymentMethod: paymentMethod || 'Credit Card (Simulated)',
      status: 'Confirmed & Processing',
      createdAt: new Date().toISOString()
    };

    memoryOrders.unshift(newOrder);

    return NextResponse.json({ success: true, message: 'Order created successfully', data: newOrder });

  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
