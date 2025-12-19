import User from "../models/User.js";
import Message from "../models/Message.js";

export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    const users = await User.find(
      { _id: { $ne: currentUserId } },
      "name photo status"
    ).lean();

    const result = await Promise.all(
      users.map(async (u) => {
        const unreadCount = await Message.countDocuments({
          isPrivate: true,
          senderId: u._id.toString(),
          toUserId: currentUserId,
          readBy: { $ne: currentUserId }, // 🔥 NOT READ
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
