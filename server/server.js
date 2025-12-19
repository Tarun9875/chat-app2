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

/* ---------------------------- APP SETUP ---------------------------- */
const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

/* ---------------------------- STATIC UPLOADS ---------------------------- */
app.use("/uploads", express.static(path.resolve("uploads")));

/* ---------------------------- MONGO ---------------------------- */
mongoose
  .connect("mongodb://127.0.0.1:27017/chatapp")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));

/* ---------------------------- ROUTES ---------------------------- */
app.use("/auth", authRoutes);
app.use("/group", auth, groupRoutes);
app.use("/messages", auth, messageRoutes);
app.use("/user", auth, userRoutes);

/* ---------------------------- SOCKET ---------------------------- */
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.set("io", io);

/* ---------------------------- HELPERS ---------------------------- */
const onlineUsers = new Map();
const makeRoom = (a, b) => [a, b].sort().join("_");

/* ---------------------------- SOCKET LOGIC ---------------------------- */
io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  socket.on("user-online", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("joinRoom", (room) => {
    if (!socket.rooms.has(room)) socket.join(room);
  });

  socket.on("leaveRoom", (room) => {
    if (socket.rooms.has(room)) socket.leave(room);
  });

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

      const sender = await User.findById(senderId);

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
          timestamp: Date.now(),
        });

        io.to(privateRoom).emit("receiveMessage", saved);
        return;
      }

      const saved = await Message.create({
        groupId,
        isPrivate: false,
        senderId,
        senderName,
        senderPhoto: sender?.photo || "",
        message,
        timestamp: Date.now(),
      });

      io.to(groupId).emit("receiveMessage", saved);
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  });

  socket.on("disconnect", () => {
    for (let [uid, sid] of onlineUsers.entries()) {
      if (sid === socket.id) onlineUsers.delete(uid);
    }
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});

/* ---------------------------- START ---------------------------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
