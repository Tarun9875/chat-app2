// client/src/socket.js
import { io } from "socket.io-client";

/*
  🔹 SOCKET SERVER URL
*/
const SERVER_URL =
  process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

/*
  🔹 Create socket instance (NO auto-connect)
*/
const socket = io(SERVER_URL, {
  transports: ["websocket", "polling"],
  autoConnect: false,      // 🔥 IMPORTANT
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  timeout: 20000,
});

/* ===================== DEBUG LOGS ===================== */
socket.on("connect", () => {
  console.log("🟢 Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});
/* ===================================================== */

export default socket;
