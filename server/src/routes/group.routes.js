// server/routes/group.routes.js
import express from "express";
import verifyAccessToken from "../middleware/authGuard.js";
import validate from "../middleware/validate.js";
import upload from "../middleware/upload.avatar.js";
import GroupValidation from "../validations/group.validation.js";
import * as GroupController from "../controllers/group.controller.js";

const router = express.Router();

router.post(
  "/create",
  verifyAccessToken,
  validate(GroupValidation.createGroup),
  GroupController.createGroup
);

router.get(
  "/with-last",
  verifyAccessToken,
  GroupController.getGroupsWithLast
);

router.get(
  "/:id",
  verifyAccessToken,
  GroupController.getGroupDetails
);

router.post(
  "/:id/add-member",
  verifyAccessToken,
  validate(GroupValidation.addMember),
  GroupController.addMember
);

router.post(
  "/:id/promote-admin",
  verifyAccessToken,
  validate(GroupValidation.memberAction),
  GroupController.promoteAdmin
);

router.post(
  "/:id/dismiss-admin",
  verifyAccessToken,
  validate(GroupValidation.memberAction),
  GroupController.dismissAdmin
);

router.post(
  "/:id/remove-member",
  verifyAccessToken,
  validate(GroupValidation.memberAction),
  GroupController.removeMember
);

router.post(
  "/upload-avatar",
  verifyAccessToken,
  upload.single("image"),
  validate(GroupValidation.uploadAvatar),
  GroupController.uploadAvatar
);

export default router;
