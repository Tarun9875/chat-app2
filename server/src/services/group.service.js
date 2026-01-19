import Group from "../models/Group.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

export async function getGroupsWithLast(userId) {
  const uid = new mongoose.Types.ObjectId(userId);
  const groups = await Group.find({ members: uid }).lean();

  return Promise.all(
    groups.map(async (g) => {
      const unreadCount = await Message.countDocuments({
        groupId: g._id,
        isPrivate: false,
        readBy: { $nin: [uid] },
      });

      const last = await Message.findOne({
        groupId: g._id,
        isPrivate: false,
      }).sort({ timestamp: -1 });

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
}
