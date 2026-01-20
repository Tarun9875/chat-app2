// server/services/user.service.js
import mongoose from "mongoose";
import User from "../models/User.js";
import Message from "../models/Message.js";

/* ======================================================
   GET ALL USERS WITH:
   - lastMessage
   - unreadCount
====================================================== */
export async function getAllUsersWithUnread(myId) {
  const uid = new mongoose.Types.ObjectId(myId);

  const users = await User.find(
    { _id: { $ne: uid } },
    "name photo status"
  ).lean();

  return Promise.all(
    users.map(async (u) => {
      const room = [uid.toString(), u._id.toString()].sort().join("_");

      // last private message
      const lastMessage = await Message.findOne({
        privateRoom: room,
      })
        .sort({ createdAt: -1 })
        .lean();

      // unread count
      const unreadCount = await Message.countDocuments({
        privateRoom: room,
        senderId: u._id,
        readBy: { $ne: uid },
      });

      return {
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
      };
    })
  );
}

/* ======================================================
   UPDATE USER PROFILE
====================================================== */
export async function updateProfile(userId, data) {
  const updated = await User.findByIdAndUpdate(
    userId,
    data,
    { new: true }
  ).lean();

  if (!updated) throw new Error("User not found");

  return {
    _id: updated._id,
    name: updated.name,
    photo: updated.photo || "",
    status: updated.status || "",
  };
}
