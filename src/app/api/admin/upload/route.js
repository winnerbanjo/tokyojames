import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAdmin } from '@/lib/auth';
import { failure, invalid } from '@/lib/api';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  const denied = await requireAdmin(request); if (denied) return denied;
  try {
    if (Number(request.headers.get('content-length')) > 6 * 1024 * 1024) invalid('Maximum image size is 5 MB.');
    const form = await request.formData(); const file = form.get('file');
    if (!file || typeof file === 'string' || !file.size || file.size > 5 * 1024 * 1024) invalid('Choose an image up to 5 MB.');
    const data = Buffer.from(await file.arrayBuffer());

    // Validate file type
    let contentType;
    if (data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) contentType = 'image/png';
    else if (data[0] === 255 && data[1] === 216 && data[2] === 255) contentType = 'image/jpeg';
    else if (data.toString('ascii',0,4) === 'RIFF' && data.toString('ascii',8,12) === 'WEBP') contentType = 'image/webp';
    else invalid('Only JPEG, PNG, and WebP images are supported.');

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'tokyojames', resource_type: 'image' },
        (error, result) => { if (error) reject(error); else resolve(result); }
      );
      stream.end(data);
    });

    return NextResponse.json({ success: true, url: result.secure_url }, { status: 201 });
  } catch (error) { return failure(error); }
}
