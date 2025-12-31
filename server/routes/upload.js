// server/routes/upload.js
import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

router.post("/file", upload.single("file"), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});
