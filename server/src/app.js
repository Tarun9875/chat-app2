// src/app.js
import express from "express";
import cors from "cors";
import path from "path";

import { connectDB } from "./config/db.js";
import auth from "./middleware/auth.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import groupRoutes from "./routes/group.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

export function createApp() {
  const app = express();

  connectDB();

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(express.json());

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.use("/auth", authRoutes);
  app.use("/group", auth, groupRoutes);
  app.use("/messages", auth, messageRoutes);
  app.use("/user", auth, userRoutes);
  app.use("/upload", auth, uploadRoutes);

  return app;
}
