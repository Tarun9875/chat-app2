// server/middleware/upload.middleware.js
import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

/* ======================================================
   UPLOAD DIRECTORY
====================================================== */
const uploadDir = path.join(process.cwd(), "uploads", "images");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ======================================================
   STORAGE CONFIG
====================================================== */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),

  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  },
});

/* ======================================================
   FILE FILTER
====================================================== */
const fileFilter = (_, file, cb) => {
  cb(null, true); // accept all types
};

/* ======================================================
   EXPORT DEFAULT
====================================================== */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

export default upload;
