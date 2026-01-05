// server/routes/upload.js

import express from "express";
import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

const router = express.Router();

/* ======================================================
   1️⃣ ENSURE UPLOAD DIRECTORY EXISTS
   ------------------------------------------------------
   Without this, multer fails silently on Windows/Linux
====================================================== */

const uploadDir = path.join(process.cwd(), "uploads", "images");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ======================================================
   2️⃣ MULTER STORAGE CONFIG
   ------------------------------------------------------
   - Files saved in: server/uploads/images
   - Unique filename using UUID
====================================================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  },
});

/* ======================================================
   3️⃣ FILE FILTER (OPTIONAL BUT RECOMMENDED)
   ------------------------------------------------------
   Prevents invalid file types
====================================================== */

const fileFilter = (req, file, cb) => {
  cb(null, true); // accept all (image, video, audio, doc)
};

/* ======================================================
   4️⃣ MULTER INSTANCE
====================================================== */

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

/* ======================================================
   5️⃣ UPLOAD API
   ------------------------------------------------------
   POST /upload
   form-data: file
====================================================== */

router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      url: `/uploads/images/${req.file.filename}`, // ✅ public URL
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "File upload failed" });
  }
});

export default router;
