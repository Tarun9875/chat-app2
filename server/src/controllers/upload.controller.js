// server/controllers/upload.controller.js

export async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      url: `/uploads/images/${req.file.filename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "File upload failed" });
  }
}
