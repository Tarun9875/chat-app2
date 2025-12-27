// server/models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  /* ===============================
     CHAT TYPE
  =============================== */
  groupId: {
    type: String,
    default: null, // group chat id
  },

  privateRoom: {
    type: String,
    default: null, // private room (sorted user ids)
  },

  isPrivate: {
    type: Boolean,
    default: false,
  },

  /* ===============================
     SENDER INFO
  =============================== */
  senderId: {
    type: String,
    required: true,
  },

  senderName: {
    type: String,
    required: true,
  },

  senderPhoto: {
    type: String,
    default: "",
  },

  /* ===============================
     RECEIVER INFO (PRIVATE CHAT)
  =============================== */
  toUserId: {
    type: String,
    default: null,
  },

  /* ===============================
     MESSAGE CONTENT
  =============================== */
  message: {
    type: String,
    required: true,
  },

  /* ===============================
     DELIVERY & SEEN STATUS
     ✔ deliveredTo → ✔✔ grey
     ✔ readBy      → ✔✔ blue
  =============================== */
  deliveredTo: {
    type: [String], // userIds who received message
    default: [],
  },

  readBy: {
    type: [String], // userIds who read message
    default: [],
  },

  /* ===============================
     TIME
  =============================== */
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

/* ===============================
   INDEXES (IMPORTANT FOR SPEED)
=============================== */
messageSchema.index({ groupId: 1, timestamp: 1 });
messageSchema.index({ privateRoom: 1, timestamp: 1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ toUserId: 1 });

export default mongoose.model("Message", messageSchema);
