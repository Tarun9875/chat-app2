// server/src/services/message.service.js
import Message from "../models/Message.js";

/* ================= PRIVATE HISTORY ================= */
export async function getPrivateMessages(userA, userB) {
  const room = [userA, userB].sort().join("_");

  return Message.find({
    privateRoom: room,
    isPrivate: true,
  }).sort({ timestamp: 1 });
}

/* ================= GROUP HISTORY ================= */
export async function getGroupMessages(groupId) {
  return Message.find({
    groupId,
    isPrivate: false,
  }).sort({ timestamp: 1 });
}

/* ================= MARK AS READ ================= */
export async function markAsRead({ userId, groupId, privateRoom }) {
  const filter = groupId
    ? {
        groupId,
        senderId: { $ne: userId },
        readBy: { $ne: userId },
      }
    : {
        privateRoom,
        senderId: { $ne: userId },
        readBy: { $ne: userId },
      };

  await Message.updateMany(filter, {
    $addToSet: { readBy: userId },
  });

  return {
    groupId: groupId || null,
    privateRoom: privateRoom || null,
    seenBy: userId,
  };
}
