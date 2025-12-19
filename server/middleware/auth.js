// server/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

// Authentication Middleware
export default async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";

    // Expect: "Bearer <token>"
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];

    // Verify token & decode user ID
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the logged-in user
    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error("auth error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
