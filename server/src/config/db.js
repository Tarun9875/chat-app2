// src/config/db.js
import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/chatapp");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ Mongo error:", err);
    process.exit(1);
  }
}
