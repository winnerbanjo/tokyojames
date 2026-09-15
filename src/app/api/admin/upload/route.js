import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { requireAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Media from '@/lib/models/Media';
import { failure, invalid } from '@/lib/api';
export async function POST(request) {
  const denied = await requireAdmin(request); if (denied) return denied;
  try {
    if (Number(request.headers.get('content-length')) > 6 * 1024 * 1024) invalid('Maximum image size is 5 MB.');
    const form = await request.formData(); const file = form.get('file');
    if (!file || typeof file === 'string' || !file.size || file.size > 5 * 1024 * 1024) invalid('Choose an image up to 5 MB.');
    const data = Buffer.from(await file.arrayBuffer());
    let contentType;
    if (data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) contentType = 'image/png';
    else if (data[0] === 255 && data[1] === 216 && data[2] === 255) contentType = 'image/jpeg';
    else if (data.toString('ascii',0,4) === 'RIFF' && data.toString('ascii',8,12) === 'WEBP') contentType = 'image/webp';
    else invalid('Only JPEG, PNG, and WebP images are supported.');
    await connectToDatabase(); const id = randomUUID();
    await Media.create({ _id: id, data, contentType });
    return NextResponse.json({ success: true, url: `/api/media/${id}` }, { status: 201 });
  } catch (error) { return failure(error); }
}
