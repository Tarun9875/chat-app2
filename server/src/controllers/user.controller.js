// server/controllers/user.controller.js
import * as UserService from "../services/user.service.js";

/* ======================================================
   GET ALL USERS
====================================================== */
export async function getAllUsers(req, res) {
  try {
    const users = await UserService.getAllUsersWithUnread(req.user._id);
    res.json(users);
  } catch (err) {
    console.error("❌ getAllUsers:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
}

/* ======================================================
   UPDATE PROFILE
====================================================== */
export async function updateProfile(req, res) {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await UserService.updateProfile(
      req.params.id,
      req.body
    );

    res.json(user);
  } catch (err) {
    console.error("❌ updateProfile:", err);
    res.status(400).json({ message: err.message });
  }
}
