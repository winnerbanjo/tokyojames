import mongoose from 'mongoose';
const cached = global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });
export async function connectToDatabase() {
  if (!process.env.MONGODB_URI) throw new Error('Database is not configured');
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 5000 });
  try { cached.conn = await cached.promise; return cached.conn; }
  catch (error) { cached.promise = null; cached.conn = null; throw error; }
}
