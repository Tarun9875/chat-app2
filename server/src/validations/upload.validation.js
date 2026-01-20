// server/validations/upload.validation.js
import Joi from "joi";

/**
 * Used for validating upload requests
 * (query / body based validation)
 */
const uploadFile = Joi.object({
  // Optional: future-proof (file is handled by multer)
  type: Joi.string()
    .valid("image", "video", "audio", "file")
    .optional(),
});

export default {
  uploadFile,
};
