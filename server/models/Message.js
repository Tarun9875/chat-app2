import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    /* ===============================
       CHAT TYPE
    =============================== */

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
      index: true,
    },

    privateRoom: {
      type: String,
      default: null,
      index: true,
    },

    isPrivate: {
      type: Boolean,
      default: false,
      index: true,
    },

    /* ===============================
       SENDER INFO
    =============================== */

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
       RECEIVER (PRIVATE CHAT)
    =============================== */

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    /* ===============================
       MESSAGE CONTENT
    =============================== */

    message: {
      type: String,
      required: true,
      trim: true,
    },

    deleted: {
      type: Boolean,
      default: false,
    },

    /* ===============================
       READ STATUS (🔥 FIXED)
    =============================== */

    readBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [], // 🔥 VERY IMPORTANT
      index: true,
    },

    /* ===============================
       TIME
    =============================== */

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { versionKey: false }
);

/* ===============================
   INDEXES (🔥 OPTIMIZED)
=============================== */

// Last message fast lookup
messageSchema.index({ groupId: 1, timestamp: -1 });
messageSchema.index({ privateRoom: 1, timestamp: -1 });

// 🔥 UNREAD COUNT FAST QUERY
messageSchema.index({
  groupId: 1,
  senderId: 1,
  readBy: 1,
});

export default mongoose.model("Message", messageSchema);
