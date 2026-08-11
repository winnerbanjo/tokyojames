import mongoose from 'mongoose';
import { INITIAL_PRODUCTS, INITIAL_LOOKBOOKS } from './seedData.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tokyo_james';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch((err) => {
      console.warn('MongoDB connection failed, falling back to seed dataset mode:', err.message);
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
  }

  return cached.conn;
}

// Memory fallback store if DB is offline
export let memoryStore = {
  products: [...INITIAL_PRODUCTS],
  lookbooks: [...INITIAL_LOOKBOOKS],
  subscribers: []
};
