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

/* ================= APP ================= */
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

/* ================= DB ================= */
mongoose
  .connect("mongodb://127.0.0.1:27017/chatapp")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(console.error);

/* ================= ROUTES ================= */
app.use("/auth", authRoutes);
app.use("/group", auth, groupRoutes);
app.use("/messages", auth, messageRoutes);
app.use("/user", auth, userRoutes);

/* ================= SOCKET ================= */
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

app.set("io", io);

/* ================= HELPERS ================= */
const onlineUsers = new Map(); // userId → socketId
const makeRoom = (a, b) => [a, b].sort().join("_");

/* ================= SOCKET LOGIC ================= */
io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  /* ---------- ONLINE ---------- */
  socket.on("user-online", (userId) => {
    if (!userId) return;
    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
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

  /* ---------- JOIN / LEAVE ---------- */
  socket.on("joinRoom", (room) => room && socket.join(room));
  socket.on("leaveRoom", (room) => room && socket.leave(room));

  /* ---------- SEND MESSAGE ---------- */
  socket.on("sendMessage", async (data) => {
    try {
      const { isPrivate, senderId, senderName, message, groupId, toUserId } = data;
      if (!senderId || !message) return;

      const sender = await User.findById(senderId).lean();

      /* ===== PRIVATE ===== */
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
          deliveredTo: [],
          readBy: [senderId],
          timestamp: Date.now(),
        });

        io.to(privateRoom).emit("receiveMessage", saved);

        const receiverSocket = onlineUsers.get(toUserId);
        if (receiverSocket) {
          await Message.updateOne(
            { _id: saved._id },
            { $addToSet: { deliveredTo: toUserId } }
          );

          const senderSocket = onlineUsers.get(senderId);
          if (senderSocket) {
            io.to(senderSocket).emit("message-delivered", {
              messageId: saved._id,
              deliveredTo: toUserId,
            });
          }
        }
        return;
      }

      /* ===== GROUP ===== */
      const saved = await Message.create({
        groupId,
        isPrivate: false,
        senderId,
        senderName,
        senderPhoto: sender?.photo || "",
        message,
        deliveredTo: [],
        readBy: [senderId],
        timestamp: Date.now(),
      });

      io.to(groupId).emit("receiveMessage", saved);
    } catch (err) {
      console.error("❌ sendMessage:", err);
    }
  });

  /* ---------- DISCONNECT (ONLY ONE) ---------- */
  socket.on("disconnect", async () => {
    for (const [uid, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(uid);
        await User.findByIdAndUpdate(uid, { lastSeen: new Date() });
        break;
      }
    }
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});

/* ================= START ================= */
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
