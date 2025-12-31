// server/controllers/groupController.js
import Group from "../models/Group.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

export const getGroupsWithLast = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const groups = await Group.find({ members: userId }).lean();

    const result = await Promise.all(
      groups.map(async (g) => {
        // ✅ CORRECT unread count
        const unreadCount = await Message.countDocuments({
          groupId: g._id,           // ✅ ObjectId
          isPrivate: false,
          readBy: { $nin: [userId] } // ✅ NOT IN ARRAY
        });

        const last = await Message.findOne({
          groupId: g._id,
          isPrivate: false,
        })
          .sort({ timestamp: -1 })
          .lean();

        return {
          ...g,
          unreadCount,
          lastMessage: last
            ? {
                _id: last._id,
                message: last.message,
                senderName: last.senderName,
                timestamp: last.timestamp,
              }
            : null,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("group unread error:", err);
    res.status(500).json({ message: "Failed to load groups" });
  }
};
