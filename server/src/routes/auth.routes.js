// server/src/routes/auth.js
import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import validate from "../middleware/validate.js";
import AuthValidation from "../validations/auth.validation.js";

const router = express.Router();

// Register
router.post(
  "/register",
  validate(AuthValidation.register),
  register
);

// Login
router.post(
  "/login",
  validate(AuthValidation.login),
  login
);

export default router;
