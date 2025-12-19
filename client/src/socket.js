// client/src/socket.js
import { io } from "socket.io-client";

/*
  🔹 SOCKET SERVER URL
  - Local dev  : http://localhost:5000
  - Same WiFi  : http://<PC-IP>:5000
  - Production: https://your-domain.com
*/

const SERVER_URL =
  process.env.REACT_APP_SOCKET_URL ||
  "http://localhost:5000";

/*
  🔹 Socket configuration
  - websocket first (prevents polling errors)
  - fallback to polling if needed
  - credentials enabled (JWT / cookies)
*/

const socket = io(SERVER_URL, {
  transports: ["websocket", "polling"], // ✅ FIXES WebSocket closed error
  withCredentials: true,
  autoConnect: true,
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
