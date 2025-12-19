import Group from "../models/Group.js";
import Message from "../models/Message.js";

export const getGroupsWithLast = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const groups = await Group.find({ members: userId }).lean();

    const result = await Promise.all(
      groups.map(async (g) => {
        const unreadCount = await Message.countDocuments({
          groupId: g._id.toString(),
          isPrivate: false,
          readBy: { $ne: userId }, // 🔥 NOT READ
        });

        const last = await Message.findOne({
          groupId: g._id.toString(),
          isPrivate: false,
        })
          .sort({ timestamp: -1 })
          .lean();

        return {
          ...g,
          unreadCount,
          lastMessage: last
            ? {
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
