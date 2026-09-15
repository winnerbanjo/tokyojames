import { NextResponse } from 'next/server';
export function failure(error) {
  if (error instanceof SyntaxError || error.name === 'ValidationError' || error.status === 400) return NextResponse.json({ success: false, message: error.status === 400 ? error.message : 'Invalid request data.' }, { status: 400 });
  console.error('API operation failed:', error.name);
  return NextResponse.json({ success: false, message: 'Service temporarily unavailable. Please try again.' }, { status: 503 });
}
export function invalid(message) { throw Object.assign(new Error(message), { status: 400 }); }
