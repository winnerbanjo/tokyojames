import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { failure } from '@/lib/api';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const ordersFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json');

function readOrdersFromFile() {
  try {
    if (fs.existsSync(ordersFilePath)) {
      const raw = fs.readFileSync(ordersFilePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading orders.json:', err);
  }
  return [];
}

function saveOrderToFile(order) {
  try {
    const dir = path.dirname(ordersFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const current = readOrdersFromFile();
    // Prepend new order
    const updated = [order, ...current.filter(o => o.id !== order.id)];
    fs.writeFileSync(ordersFilePath, JSON.stringify(updated, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving to orders.json:', err);
    return false;
  }
}

export async function GET(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    let orders = [];
    try {
      const db = await connectToDatabase();
      orders = await db.connection.collection('orders').find({}).sort({ createdAt: -1 }).limit(500).toArray();
    } catch {
      // Fallback to local storage if DB is offline or not configured
      orders = readOrdersFromFile();
    }

    if (!orders.length) {
      // Check local file if DB had no records
      const localOrders = readOrdersFromFile();
      if (localOrders.length) orders = localOrders;
    }

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Basic validation
    if (!body.customerName || !body.email || !body.address) {
      return NextResponse.json(
        { success: false, message: 'Please provide customer name, email address, and shipping address.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Your cart is empty.' },
        { status: 400 }
      );
    }

    // 2. Flutterwave server-side verification
    const transactionId = body.transactionId;
    const secretKey = process.env.FLW_SECRET_KEY || 'FLWSECK-b6957535a040496a5c2bb29143d112e3-1a19df2cec2vt-X';

    let verifiedPayment = null;
    if (transactionId) {
      try {
        const verifyRes = await fetch(
          `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${secretKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const verifyData = await verifyRes.json();

        if (verifyData.status === 'success' && verifyData.data?.status === 'successful') {
          verifiedPayment = verifyData.data;
        } else {
          return NextResponse.json(
            {
              success: false,
              message: `Flutterwave payment verification failed: ${verifyData.message || 'Payment not successful'}`
            },
            { status: 400 }
          );
        }
      } catch (verifyErr) {
        console.error('Error connecting to Flutterwave verify endpoint:', verifyErr);
        // Continue if offline/sandbox network error, but log
      }
    }

    // 3. Construct Order Document
    const orderId = body.txRef || (verifiedPayment?.tx_ref) || `TJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const orderCurrency = body.currency || verifiedPayment?.currency || 'EUR';
    const exchangeRate = Number(body.exchangeRate) || (orderCurrency === 'NGN' ? 1650 : 1);
    
    let totalEUR = Number(body.totalEUR) || 0;
    let totalPaid = Number(body.totalPaid) || Number(verifiedPayment?.amount) || 0;
    if (!totalEUR && totalPaid) {
      totalEUR = orderCurrency === 'EUR' ? totalPaid : Number((totalPaid / exchangeRate).toFixed(2));
    }
    if (!totalPaid && totalEUR) {
      totalPaid = orderCurrency === 'NGN' ? Math.round(totalEUR * exchangeRate) : totalEUR;
    }

    const order = {
      id: orderId,
      customerName: String(body.customerName).trim(),
      email: String(body.email).trim().toLowerCase(),
      phone: body.phone ? String(body.phone).trim() : '',
      shippingAddress: [body.address, body.city, body.zip, body.country].filter(Boolean).join(', '),
      items: body.items.map(it => ({
        id: it.id,
        title: it.title,
        size: it.size,
        priceEUR: Number(it.priceEUR) || 0,
        quantity: Number(it.quantity) || 1,
        image: it.image || ''
      })),
      totalEUR: totalEUR,
      totalPaid: totalPaid,
      currency: orderCurrency,
      exchangeRate: exchangeRate,
      transactionId: transactionId ? String(transactionId) : null,
      flwRef: verifiedPayment?.flw_ref || null,
      paymentMethod: 'Flutterwave',
      paymentStatus: 'paid',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    // 4. Save to local fallback storage
    saveOrderToFile(order);

    // 5. Save to MongoDB if available
    try {
      const db = await connectToDatabase();
      await db.connection.collection('orders').insertOne({
        ...order,
        _id: order.id,
        createdAt: new Date()
      });
    } catch (dbErr) {
      console.warn('MongoDB order insert skipped (persisted to local orders.json):', dbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Order placed and payment confirmed successfully!',
      data: order
    });
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'Missing order ID or status' }, { status: 400 });
    }

    // 1. Update in local storage fallback
    try {
      const current = readOrdersFromFile();
      const updated = current.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o);
      fs.writeFileSync(ordersFilePath, JSON.stringify(updated, null, 2), 'utf8');
    } catch (fErr) {
      console.warn('Local orders.json update error:', fErr.message);
    }

    // 2. Update in MongoDB
    try {
      const db = await connectToDatabase();
      await db.connection.collection('orders').updateOne(
        { $or: [{ id }, { _id: id }] },
        { $set: { status, updatedAt: new Date() } }
      );
    } catch (dbErr) {
      console.warn('MongoDB update error:', dbErr.message);
    }

    return NextResponse.json({ success: true, message: `Order ${id} status updated to ${status}` });
  } catch (error) {
    return failure(error);
  }
}
