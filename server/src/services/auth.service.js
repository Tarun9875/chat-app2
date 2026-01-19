// server/src/services/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";
const TOKEN_EXPIRES = "7d";

/* ================================
   HELPERS
================================ */
function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    photo: user.photo || "",
    status: user.status || "",
  };
}

/* ================================
   REGISTER USER
================================ */
export async function registerUser({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("Email already used");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
  });

  const token = jwt.sign(
    { id: user._id },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES }
  );

  return {
    token,
    user: sanitizeUser(user),
  };
}

/* ================================
   LOGIN USER
================================ */
export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES }
  );

  return {
    token,
    user: sanitizeUser(user),
  };
}
