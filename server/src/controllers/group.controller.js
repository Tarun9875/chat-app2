// server/controllers/group.controller.js

import mongoose from "mongoose";
import Group from "../models/Group.js";
import Message from "../models/Message.js";

/**
 * ------------------------------------------------------
 * GET USER GROUPS WITH:
 * - last message
 * - unread message count
 * ------------------------------------------------------
 * Route: GET /group/with-last
 * Access: Authenticated
 * ------------------------------------------------------
 */
export const getGroupsWithLast = async (req, res) => {
  try {
    // ✅ Ensure ObjectId (important for Mongo performance)
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // --------------------------------------------------
    // 1️⃣ Fetch groups where user is a member
    // --------------------------------------------------
    const groups = await Group.find({
      members: userId,
    }).lean();

    // --------------------------------------------------
    // 2️⃣ Enrich each group with:
    //    - unreadCount
    //    - lastMessage
    // --------------------------------------------------
    const result = await Promise.all(
      groups.map(async (group) => {
        // ✅ UNREAD COUNT (WhatsApp-style)
        const unreadCount = await Message.countDocuments({
          groupId: group._id,
          isPrivate: false,
          readBy: { $nin: [userId] }, // user has NOT read
        });

        // ✅ LAST MESSAGE
        const lastMessage = await Message.findOne({
          groupId: group._id,
          isPrivate: false,
        })
          .sort({ timestamp: -1 }) // latest message
          .lean();

        return {
          ...group,

          unreadCount,

          lastMessage: lastMessage
            ? {
                _id: lastMessage._id,
                message: lastMessage.deleted
                  ? "🚫 This message was deleted"
                  : lastMessage.message,
                senderName: lastMessage.senderName,
                timestamp: lastMessage.timestamp,
              }
            : null,
        };
      })
    );

    // --------------------------------------------------
    // 3️⃣ Send response
    // --------------------------------------------------
    res.json(result);
  } catch (error) {
    console.error("❌ getGroupsWithLast error:", error);
    res.status(500).json({
      message: "Failed to load groups",
    });
  }
};
