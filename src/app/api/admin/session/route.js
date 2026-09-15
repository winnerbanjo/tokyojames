import AdminSession from '@/lib/models/AdminSession';
import { NextResponse } from 'next/server';
import { COOKIE, MAX_AGE, configured, createSession, authenticated, verifyPassword, sameOrigin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import LoginAttempt from '@/lib/models/LoginAttempt';
import { failure } from '@/lib/api';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  try { return NextResponse.json({ success: true, authenticated: await authenticated(request) }, { headers: { 'Cache-Control': 'no-store' } }); } catch (error) { return failure(error); }
}
export async function POST(request) {
  if (!sameOrigin(request)) return NextResponse.json({ success: false, message: 'Invalid request origin.' }, { status: 403 });
  if (!configured()) return NextResponse.json({ success: false, message: 'Admin access has not been configured.' }, { status: 503 });
  try {
    const { username, password } = await request.json();
    if (typeof username !== 'string' || typeof password !== 'string' || password.length > 256) return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 400 });
    await connectToDatabase();
    const window = Math.floor(Date.now() / 900000);
    const attempt = await LoginAttempt.findOneAndUpdate({ _id: `admin:${window}` }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + 1800000) } }, { upsert: true, new: true });
    if (attempt.count > 20) return NextResponse.json({ success: false, message: 'Too many sign-in attempts. Try again in 15 minutes.' }, { status: 429 });
    const passwordOK = verifyPassword(password);
    if (username !== process.env.ADMIN_USERNAME || !passwordOK) return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
    const response = NextResponse.json({ success: true });
    const token = createSession();
    await AdminSession.create({ _id: token.split('.')[1], expiresAt: new Date(Number(token.split('.')[0])) });
    response.cookies.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: MAX_AGE });
    return response;
  } catch (error) { return failure(error); }
}
export async function DELETE(request) {
  if (!sameOrigin(request)) return NextResponse.json({ success: false }, { status: 403 });
  try {
    const token = request.cookies.get(COOKIE)?.value;
    if (token) { await connectToDatabase(); await AdminSession.deleteOne({ _id: token.split('.')[1] }); }
  } catch (error) { return failure(error); }
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
  return response;
}
