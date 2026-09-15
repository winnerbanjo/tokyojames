import { NextResponse } from 'next/server';
import defaults from '@/data/site_content.json';
import { connectToDatabase } from '@/lib/db';
import SiteContent from '@/lib/models/SiteContent';
import { requireAdmin } from '@/lib/auth';
import { failure, invalid } from '@/lib/api';
export const dynamic = 'force-dynamic';
export async function GET() {
  try { await connectToDatabase(); const row = await SiteContent.findById('site').lean(); return NextResponse.json({ success: true, data: row?.data || defaults }); }
  catch (error) { return failure(error); }
}
export async function PUT(request) {
  const denied = await requireAdmin(request); if (denied) return denied;
  try {
    const body = await request.json();
    const data = {};
    for (const [section, fields] of Object.entries(defaults)) {
      if (!body[section] || typeof body[section] !== 'object') invalid(`Missing ${section}.`);
      data[section] = {};
      for (const key of Object.keys(fields)) {
        const value = body[section][key];
        if (section === 'rates') { if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > 10000) invalid('Invalid exchange rate.'); }
        else if (typeof value !== 'string' || value.length > 10000) invalid(`Invalid ${key}.`);
        data[section][key] = value;
      }
    }
    if (data.footer.instagramUrl && !/^https:\/\/[^\s]+$/.test(data.footer.instagramUrl)) invalid('Social link must use HTTPS.');
    if (data.footer.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.footer.contactEmail)) invalid('Invalid contact email.');
    await connectToDatabase();
    await SiteContent.findByIdAndUpdate('site', { $set: { data } }, { upsert: true, runValidators: true });
    return NextResponse.json({ success: true, data });
  } catch (error) { return failure(error); }
}
export const POST = PUT;
