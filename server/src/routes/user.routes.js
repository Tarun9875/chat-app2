// server/routes/user.routes.js
import express from "express";
import verifyAccessToken from "../middleware/authGuard.js";
import validate from "../middleware/validate.js";
import UserValidation from "../validations/user.validation.js";
import * as UserController from "../controllers/user.controller.js";

const router = express.Router();

/* ======================================================
   GET ALL USERS
====================================================== */
router.get(
  "/all",
  verifyAccessToken,
  UserController.getAllUsers
);

/* ======================================================
   UPDATE PROFILE
====================================================== */
router.put(
  "/update/:id",
  verifyAccessToken,
  validate(UserValidation.updateProfile),
  UserController.updateProfile
);

export default router;
