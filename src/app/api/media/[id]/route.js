import { connectToDatabase } from '@/lib/db';
import Media from '@/lib/models/Media';
import { failure } from '@/lib/api';
export async function GET(request, { params }) {
  try {
    await connectToDatabase(); const media = await Media.findById((await params).id);
    if (!media) return new Response(null, { status: 404 });
    return new Response(new Uint8Array(media.data), { headers: { 'Content-Type': media.contentType, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=31536000, immutable' } });
  } catch (error) { return failure(error); }
}
