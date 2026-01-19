import User from "../models/User.js";
import Message from "../models/Message.js";

export async function getAllUsersWithUnread(myId) {
  const users = await User.find({ _id: { $ne: myId } }).lean();
  const result = [];

  for (const u of users) {
    const room = [myId, u._id.toString()].sort().join("_");

    const unreadCount = await Message.countDocuments({
      privateRoom: room,
      senderId: u._id,
      readBy: { $ne: myId },
    });

    result.push({ ...u, unreadCount });
  }

  return result;
}

export async function updateProfile(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true }).lean();
}
