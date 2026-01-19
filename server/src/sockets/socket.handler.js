// src/sockets/socket.handler.js
import { Server } from "socket.io";
import Message from "../models/Message.js";
import User from "../models/User.js";

const onlineUsers = new Map();
const makeRoom = (a, b) => [a, b].sort().join("_");

export function initSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  // ✅ app is Express app → has .set()
  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("⚡ Socket connected:", socket.id);

    socket.on("user-online", (userId) => {
      if (!userId) return;
      onlineUsers.set(userId, socket.id);
      io.emit("online-users", [...onlineUsers.keys()]);
    });

    socket.on("joinRoom", (room) => room && socket.join(room));
    socket.on("leaveRoom", (room) => room && socket.leave(room));

    socket.on("typing", ({ room, userName }) => {
      room && socket.to(room).emit("typing", { userName });
    });

    socket.on("stop-typing", ({ room }) => {
      room && socket.to(room).emit("stop-typing");
    });

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

    socket.on("disconnect", async () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          await User.findByIdAndUpdate(userId, {
            lastSeen: new Date(),
          });
          break;
        }
      }
      io.emit("online-users", [...onlineUsers.keys()]);
    });
  });
}
