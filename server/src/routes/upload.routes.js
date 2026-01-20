// server/routes/upload.routes.js
import express from "express";
import upload from "../middleware/upload.chat.js";
import validate from "../middleware/validate.js";
import UploadValidation from "../validations/upload.validation.js";
import { uploadFile } from "../controllers/upload.controller.js";

const router = express.Router();

/**
 * POST /upload
 * form-data → file
 */
router.post(
  "/",
  upload.single("file"),
  validate(UploadValidation.uploadFile),
  uploadFile
);

export default router;
