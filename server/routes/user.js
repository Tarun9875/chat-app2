// server/routes/user.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

/* ------------------------------------------------------
   GET ALL USERS (name, photo, status)
------------------------------------------------------ */
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}, "name photo status").lean();
    res.json(users);
  } catch (err) {
    console.error("user all error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------------------------------
   UPDATE USER PROFILE
   Requires auth → req.user is available
------------------------------------------------------ */
router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!req.user)
      return res.status(401).json({ message: "Unauthorized" });

    // User can only update their own profile
    if (req.user._id.toString() !== id)
      return res.status(403).json({ message: "Forbidden" });

    const { name, status, photo } = req.body;

    const updated = await User.findByIdAndUpdate(
      id,
      { name, status, photo },
      { new: true }
    ).lean();

    if (!updated)
      return res.status(404).json({ message: "User not found" });

    res.json({
      _id: updated._id,
      name: updated.name,
      photo: updated.photo || "",
      status: updated.status || "",
    });
  } catch (err) {
    console.error("user update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
