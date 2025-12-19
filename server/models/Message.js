// server/models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  groupId: { type: String, default: null },
  privateRoom: { type: String, default: null },
  isPrivate: { type: Boolean, default: false },
  senderId: String,
  senderName: String,
  toUserId: { type: String, default: null },
  message: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
