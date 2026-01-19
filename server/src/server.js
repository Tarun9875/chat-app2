// src/server.js
import http from "http";
import { createApp } from "./app.js";
import { initSocket } from "./sockets/socket.handler.js";

const PORT = process.env.PORT || 5000;

const app = createApp();
const server = http.createServer(app);

// 🔥 Attach socket.io to SAME server
initSocket(server, app);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
