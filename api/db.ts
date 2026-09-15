import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  if (!MONGODB_URI) return false;
  if (mongoose.connection.readyState === 1) return true;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGODB_URI).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }
  await connectionPromise;
  return Number(mongoose.connection.readyState) === 1;
}

export function databaseStatus() {
  return Number(mongoose.connection.readyState) === 1 ? "connected" : "disconnected";
}