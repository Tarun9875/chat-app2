// server/controllers/user.controller.js

import mongoose from "mongoose";
import User from "../models/User.js";
import Message from "../models/Message.js";

/**
 * ------------------------------------------------------
 * GET ALL USERS WITH:
 * - unread private message count
 * ------------------------------------------------------
 * Route: GET /user/all
 * Access: Authenticated
 * ------------------------------------------------------
 */
export const getAllUsers = async (req, res) => {
  try {
    // --------------------------------------------------
    // 1️⃣ Current logged-in user (ObjectId)
    // --------------------------------------------------
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);

    // --------------------------------------------------
    // 2️⃣ Fetch all users except current user
    // --------------------------------------------------
    const users = await User.find(
      { _id: { $ne: currentUserId } },
      "name photo status"
    ).lean();

    // --------------------------------------------------
    // 3️⃣ Attach unread count for each user
    // --------------------------------------------------
    const result = await Promise.all(
      users.map(async (user) => {
        const unreadCount = await Message.countDocuments({
          isPrivate: true,
          senderId: user._id,           // sender = other user
          toUserId: currentUserId,      // receiver = me
          readBy: { $ne: currentUserId }, // not read by me
        });

        return {
          ...user,
          unreadCount,
        };
      })
    );

    // --------------------------------------------------
    // 4️⃣ Send response
    // --------------------------------------------------
    res.json(result);
  } catch (error) {
    console.error("❌ getAllUsers error:", error);
    res.status(500).json({
      message: "Failed to load users",
    });
  }
};
