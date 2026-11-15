import mongoose, { type Mongoose } from "mongoose";

// Connection string, read from .env.local
const MONGODB_URI = process.env.MONGODB_URI;

// Shape of the cached connection
interface MongooseCache {
  conn: Mongoose | null; // the finished connection
  promise: Promise<Mongoose> | null; // a connection that is still opening
}

// Tell TypeScript that the global object may hold our cache
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Reuse the cache if it exists, otherwise create an empty one.
// The global object survives hot reloads in development, so the
// connection is not reopened every time a file is saved.
const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};
global.mongooseCache = cached;

async function connectDB(): Promise<Mongoose> {
  // Already connected: reuse it
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  // Start a new connection only if one is not already opening
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Clear the failed attempt so the next call can try again
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
