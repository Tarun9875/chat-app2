// server/src/middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

/* ======================================================
   UPLOAD DIRECTORY
====================================================== */
const uploadDir = path.join("uploads", "groups");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ======================================================
   MULTER STORAGE
====================================================== */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `group-${Date.now()}${ext}`);
  },
});

/* ======================================================
   FILE FILTER (OPTIONAL BUT PROFESSIONAL)
====================================================== */
const fileFilter = (_, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files allowed"), false);
  }
  cb(null, true);
};

/* ======================================================
   EXPORT DEFAULT (IMPORTANT 🔥)
====================================================== */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
