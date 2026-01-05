import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    /* ===============================
       CHAT TARGET
    =============================== */

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
      index: true,
    },

    // For private chats → userA_userB
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
       RECEIVER (PRIVATE CHAT ONLY)
    =============================== */

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    /* ===============================
       MESSAGE TEXT
       🔥 OPTIONAL (for image/audio/file)
    =============================== */

    message: {
      type: String,
      default: "",   // ✅ FIXED
      trim: true,
    },

    deleted: {
      type: Boolean,
      default: false,
    },

    /* ===============================
       READ STATUS
    =============================== */

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /* ===============================
       MESSAGE TYPE
    =============================== */

    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
      index: true,
    },

    /* ===============================
       FILE OBJECT (🔥 IMPORTANT)
       DO NOT USE STRING HERE
    =============================== */

    file: {
      name: {
        type: String,
        default: "",
      },
      size: {
        type: Number,
        default: 0,
      },
      type: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
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
  {
    versionKey: false,
  }
);

/* ===============================
   INDEXES (FAST QUERIES)
=============================== */

// Fast chat load
messageSchema.index({ groupId: 1, timestamp: -1 });
messageSchema.index({ privateRoom: 1, timestamp: -1 });

// Fast unread count
messageSchema.index({ senderId: 1, readBy: 1 });

export default mongoose.model("Message", messageSchema);
