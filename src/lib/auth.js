import { connectToDatabase } from './db';
import AdminSession from './models/AdminSession';
import { failure } from './api';
import { createHmac, randomBytes, timingSafeEqual, scryptSync } from 'node:crypto';
import { NextResponse } from 'next/server';
export const COOKIE = 'tj_admin_session';
export const MAX_AGE = 8 * 60 * 60;
export function configured() { return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET?.length >= 32); }
export function verifyPassword(password, stored = process.env.ADMIN_PASSWORD_HASH || '') {
  try {
    const [salt, hash] = stored.split(':');
    const expected = Buffer.from(hash, 'hex');
    const actual = scryptSync(password, salt, 64);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch { return false; }
}
function sign(value) { return createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(value).digest('hex'); }
export function createSession() {
  const value = `${Date.now() + MAX_AGE * 1000}.${randomBytes(24).toString('hex')}`;
  return `${value}.${sign(value)}`;
}
export function validSession(token) {
  if (!configured() || !token) return false;
  const [expires, nonce, signature, extra] = token.split('.');
  if (extra || !nonce || !signature || Number(expires) <= Date.now()) return false;
  const expected = Buffer.from(sign(`${expires}.${nonce}`));
  const supplied = Buffer.from(signature);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
export function sameOrigin(request) {
  const origin = request.headers.get('origin');
  return origin === new URL(process.env.APP_URL || request.url).origin;
}
export async function authenticated(request) {
  const token = request.cookies.get(COOKIE)?.value;
  if (!validSession(token)) return false;
  await connectToDatabase();
  return Boolean(await AdminSession.exists({ _id: token.split('.')[1], expiresAt: { $gt: new Date() } }));
}
export async function requireAdmin(request) {
  try {

  if (!await authenticated(request)) return NextResponse.json({ success: false, message: 'Please sign in to admin.' }, { status: 401 });
  if (!['GET', 'HEAD'].includes(request.method) && !sameOrigin(request)) return NextResponse.json({ success: false, message: 'Invalid request origin.' }, { status: 403 });
  return null;
  } catch (error) { return failure(error); }
}
