// server/routes/message.routes.js
import express from "express";
import verifyAccessToken from "../middleware/authGuard.js";
import validate from "../middleware/validate.js";
import MessageValidation from "../validations/message.validation.js";
import * as MessageController from "../controllers/message.controller.js";

const router = express.Router();

/* ================= PRIVATE CHAT ================= */
router.get(
  "/private/:currentUserId/:otherUserId",
  verifyAccessToken,
  validate(MessageValidation.privateHistory, "params"),
  MessageController.privateHistory
);

/* ================= GROUP CHAT ================= */
router.get(
  "/:groupId",
  verifyAccessToken,
  validate(MessageValidation.groupHistory, "params"),
  MessageController.groupHistory
);

/* ================= MARK AS READ ================= */
router.post(
  "/mark-read",
  verifyAccessToken,
  validate(MessageValidation.markRead),
  MessageController.markRead
);

export default router;
