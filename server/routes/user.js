// server/routes/user.js
import express from "express";
import User from "../models/User.js";
import Message from "../models/Message.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ------------------------------------------------------
   GET ALL USERS WITH:
   - lastMessage
   - unreadCount
------------------------------------------------------ */
router.get("/all", auth, async (req, res) => {
  try {
    const myId = req.user._id.toString();

    // Get all users except me
    const users = await User.find(
      { _id: { $ne: myId } },
      "name photo status"
    ).lean();

    const result = [];

    for (const u of users) {
      const room = [myId, u._id.toString()].sort().join("_");

      // last message
      const lastMessage = await Message.findOne({
        privateRoom: room,
      })
        .sort({ createdAt: -1 })
        .lean();

      // unread count
      const unreadCount = await Message.countDocuments({
        privateRoom: room,
        senderId: u._id.toString(),
        readBy: { $ne: myId },
      });

      result.push({
        _id: u._id,
        name: u.name,
        photo: u.photo || "",
        status: u.status || "",
        lastMessage: lastMessage
          ? {
              text: lastMessage.deleted
                ? "🚫 This message was deleted"
                : lastMessage.message,
              createdAt: lastMessage.createdAt,
            }
          : null,
        unreadCount,
      });
    }

    res.json(result);
  } catch (err) {
    console.error("user all error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------------------------------
   UPDATE USER PROFILE
------------------------------------------------------ */
router.put("/update/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;

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
