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

import Message from "./models/Message.js";
import User from "./models/User.js";
import auth from "./middleware/auth.js";

/* ========================= APP SETUP ========================= */
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

/* ========================= STATIC UPLOADS ========================= */
app.use("/uploads", express.static(path.resolve("uploads")));

/* ========================= MONGO ========================= */
mongoose
  .connect("mongodb://127.0.0.1:27017/chatapp")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

/* ========================= ROUTES ========================= */
app.use("/auth", authRoutes);
app.use("/group", auth, groupRoutes);
app.use("/messages", auth, messageRoutes);
app.use("/user", auth, userRoutes);

/* ========================= SERVER + SOCKET ========================= */
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.set("io", io);

/* ========================= HELPERS ========================= */
const onlineUsers = new Map(); // userId -> socketId
const makeRoom = (a, b) => [a, b].sort().join("_");

/* ========================= SOCKET LOGIC ========================= */
io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  /* ---------- USER ONLINE ---------- */
  socket.on("user-online", (userId) => {
    if (!userId) return;

    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
  // 🔥 TYPING INDICATOR
  socket.on("typing", ({ room, userName }) => {
    socket.to(room).emit("typing", { userName });
  });

  socket.on("stop-typing", ({ room }) => {
    socket.to(room).emit("stop-typing");
  });
  // ================== LAST SEEN ==================
  socket.on("disconnect", async () => {
    for (let [uid, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(uid);

        // 🔥 SAVE LAST SEEN
        await User.findByIdAndUpdate(uid, {
          lastSeen: new Date(),
        });
      }
    }

    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  /* ---------- JOIN ROOM ---------- */
  socket.on("joinRoom", (room) => {
    if (!room) return;
    socket.join(room);
  });

  /* ---------- LEAVE ROOM ---------- */
  socket.on("leaveRoom", (room) => {
    if (!room) return;
    socket.leave(room);
  });

  /* =========================================================
     SEND MESSAGE
     ✔ Sent
     ✔✔ Delivered (socket)
     ✔✔ Seen (via mark-read route)
  ========================================================= */
  socket.on("sendMessage", async (data) => {
    try {
      const {
        isPrivate,
        senderId,
        senderName,
        message,
        groupId,
        toUserId,
      } = data;

      if (!senderId || !message) return;

      const sender = await User.findById(senderId).lean();

      /* ================= PRIVATE CHAT ================= */
      if (isPrivate) {
        const privateRoom = makeRoom(senderId, toUserId);

        const saved = await Message.create({
          privateRoom,
          isPrivate: true,
          senderId,
          senderName,
          senderPhoto: sender?.photo || "",
          toUserId,
          message,
          deliveredTo: [],      // 🔥 delivered users
          readBy: [senderId],   // 🔥 sender already read
          timestamp: Date.now(),
        });

        // 🔥 SEND MESSAGE
        io.to(privateRoom).emit("receiveMessage", saved);

        // 🔥 MARK DELIVERED (receiver socket exists)
        if (onlineUsers.has(toUserId)) {
          await Message.updateOne(
            { _id: saved._id },
            { $addToSet: { deliveredTo: toUserId } }
          );

          io.emit("message-delivered", {
            messageId: saved._id,
            deliveredTo: toUserId,
          });
        }

        return;
      }

      /* ================= GROUP CHAT ================= */
      const saved = await Message.create({
        groupId,
        isPrivate: false,
        senderId,
        senderName,
        senderPhoto: sender?.photo || "",
        message,
        deliveredTo: [],      // 🔥 delivered users
        readBy: [senderId],   // 🔥 sender already read
        timestamp: Date.now(),
      });

      io.to(groupId).emit("receiveMessage", saved);

      // 🔥 GROUP DELIVERED (simplified)
      io.emit("message-delivered", {
        messageId: saved._id,
        deliveredTo: "GROUP",
      });
    } catch (err) {
      console.error("❌ sendMessage error:", err);
    }
  });

  /* ---------- DISCONNECT ---------- */
  socket.on("disconnect", () => {
    for (const [uid, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(uid);
        break;
      }
    }
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});

/* ========================= START SERVER ========================= */
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
