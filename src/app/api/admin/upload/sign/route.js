import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { failure } from '@/lib/api';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { folder = 'tokyojames' } = await request.json().catch(() => ({}));
    const timestamp = Math.round(Date.now() / 1000);
    const params = { timestamp, folder };
    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    return failure(error);
  }
}
