import Message from "../models/Message.js";

export async function getPrivateMessages(a, b) {
  const room = [a, b].sort().join("_");
  return Message.find({ privateRoom: room, isPrivate: true }).sort({
    timestamp: 1,
  });
}

export async function getGroupMessages(groupId) {
  return Message.find({ groupId, isPrivate: false }).sort({ timestamp: 1 });
}

export async function markAsRead({ userId, groupId, privateRoom }) {
  const filter = groupId
    ? { groupId, senderId: { $ne: userId }, readBy: { $ne: userId } }
    : { privateRoom, senderId: { $ne: userId }, readBy: { $ne: userId } };

  await Message.updateMany(filter, {
    $addToSet: { readBy: userId },
  });
}
