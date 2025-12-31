// server/controllers/userController.js
import User from "../models/User.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);

    const users = await User.find(
      { _id: { $ne: currentUserId } },
      "name photo status"
    ).lean();

    const result = await Promise.all(
      users.map(async (u) => {
        const unreadCount = await Message.countDocuments({
          isPrivate: true,
          senderId: u._id,              // ✅ ObjectId
          toUserId: currentUserId,      // ✅ ObjectId
          readBy: { $ne: currentUserId }, // ✅ ObjectId
        });

        return {
          ...u,
          unreadCount,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("user unread error:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
};
