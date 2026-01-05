// server/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

import authRoutes from "./routes/auth.js";
import groupRoutes from "./routes/group.js";
import messageRoutes from "./routes/messages.js";
import userRoutes from "./routes/user.js";
import uploadRoutes from "./routes/upload.js";

import Message from "./models/Message.js";
import User from "./models/User.js";
import auth from "./middleware/auth.js";

/* ================= APP ================= */
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// serve uploaded files
app.use("/uploads", express.static(path.resolve("uploads")));

/* ================= DB ================= */
mongoose
  .connect("mongodb://127.0.0.1:27017/chatapp")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

/* ================= ROUTES ================= */
app.use("/auth", authRoutes);
app.use("/group", auth, groupRoutes);
app.use("/messages", auth, messageRoutes);
app.use("/user", auth, userRoutes);
app.use("/upload", auth, uploadRoutes);

// 🔥 REQUIRED so other users can view/download images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


/* ================= SOCKET SERVER ================= */
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.set("io", io);

/* ================= HELPERS ================= */
const onlineUsers = new Map(); // userId -> socketId
const makeRoom = (a, b) => [a, b].sort().join("_");

/* ================= SOCKET LOGIC ================= */
io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  /* ---------- USER ONLINE ---------- */
  socket.on("user-online", (userId) => {
    if (!userId) return;
    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  /* ---------- JOIN / LEAVE ROOM ---------- */
  socket.on("joinRoom", (room) => {
    if (room) socket.join(room);
  });

  socket.on("leaveRoom", (room) => {
    if (room) socket.leave(room);
  });

  /* ---------- TYPING ---------- */
  socket.on("typing", ({ room, userName }) => {
    if (!room) return;
    socket.to(room).emit("typing", { userName });
  });

  socket.on("stop-typing", ({ room }) => {
    if (!room) return;
    socket.to(room).emit("stop-typing");
  });

  /* =====================================================
     SEND MESSAGE (🔥 FIXED – TEXT + FILE SUPPORT)
  ===================================================== */
  socket.on("sendMessage", async (data) => {
    try {
      const {
        isPrivate,
        senderId,
        senderName,
        senderPhoto,
        message,
        file,
        messageType,
        groupId,
        toUserId,
      } = data;

      if (!senderId) return;

      /* ===== PRIVATE CHAT ===== */
      if (isPrivate) {
        const privateRoom = makeRoom(senderId, toUserId);

        const saved = await Message.create({
          privateRoom,
          isPrivate: true,
          senderId,
          senderName,
          senderPhoto,
          toUserId,
          message,
          messageType,
          file,
          readBy: [senderId],
          timestamp: Date.now(),
        });

        io.to(privateRoom).emit("receiveMessage", saved);
        return;
      }

      /* ===== GROUP CHAT ===== */
      const saved = await Message.create({
        groupId,
        senderId,
        senderName,
        senderPhoto,
        message,
        messageType,
        file,
        readBy: [senderId],
      });

      io.to(groupId).emit("receiveMessage", saved);
    } catch (err) {
      console.error("❌ sendMessage error:", err);
    }
  });

  /* ---------- DISCONNECT ---------- */
  socket.on("disconnect", async () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
        break;
      }
    }
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
