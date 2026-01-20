// server/services/group.service.js
import mongoose from "mongoose";
import Group from "../models/Group.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

/* ======================================================
   PERMISSION HELPERS
====================================================== */
const isOwner = (group, userId) =>
  group.ownerId.toString() === userId.toString();

const isAdmin = (group, userId) =>
  isOwner(group, userId) ||
  group.admins.some((a) => a.toString() === userId.toString());

/* ======================================================
   CREATE GROUP
====================================================== */
export async function createGroup(userId, name) {
  if (!name?.trim()) {
    throw new Error("Group name required");
  }

  const owner = await User.findById(userId).select("name");

  const group = await Group.create({
    name: name.trim(),
    ownerId: userId,
    ownerName: owner?.name || "",
    avatar: "",
    members: [userId],
    admins: [],
    isPrivate: false,
  });

  return group;
}

/* ======================================================
   GET GROUPS WITH LAST MESSAGE + UNREAD COUNT
====================================================== */
export async function getGroupsWithLast(userId) {
  const uid = new mongoose.Types.ObjectId(userId);

  const groups = await Group.find({
    members: uid,
  }).lean();

  return Promise.all(
    groups.map(async (group) => {
      // 🔹 Unread messages count
      const unreadCount = await Message.countDocuments({
        groupId: group._id,
        isPrivate: false,
        readBy: { $nin: [uid] },
      });

      // 🔹 Last message
      const last = await Message.findOne({
        groupId: group._id,
        isPrivate: false,
      })
        .sort({ timestamp: -1 })
        .lean();

      return {
        ...group,
        unreadCount,
        lastMessage: last
          ? {
              message: last.deleted
                ? "🚫 This message was deleted"
                : last.message,
              senderName: last.senderName,
              timestamp: last.timestamp,
            }
          : null,
      };
    })
  );
}

/* ======================================================
   GET GROUP DETAILS (🔥 FIXED – MEMBERS INFO ADDED)
====================================================== */
export async function getGroupDetails(groupId, userId) {
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    throw new Error("Invalid group id");
  }

  const group = await Group.findById(groupId).lean();
  if (!group) {
    throw new Error("Group not found");
  }

  // 🔐 Access control
  if (
    !group.members.some(
      (m) => m.toString() === userId.toString()
    )
  ) {
    throw new Error("Forbidden");
  }

  // 🔥 THIS WAS MISSING (CAUSE OF “UNKNOWN”)
  const membersInfo = await User.find(
    { _id: { $in: group.members } },
    "name photo status"
  ).lean();

  return {
    ...group,
    membersInfo, // ✅ frontend now gets name, photo, status
  };
}

/* ======================================================
   ADD MEMBER (ADMIN / OWNER)
====================================================== */
export async function addMember(groupId, userId, memberId) {
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");
  if (!isAdmin(group, userId)) throw new Error("Permission denied");

  if (
    !group.members.some(
      (m) => m.toString() === memberId.toString()
    )
  ) {
    group.members.push(memberId);
    await group.save();
  }
}

/* ======================================================
   PROMOTE ADMIN (OWNER ONLY)
====================================================== */
export async function promoteAdmin(groupId, userId, memberId) {
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");
  if (!isOwner(group, userId)) throw new Error("Only owner allowed");

  if (
    !group.admins.some(
      (a) => a.toString() === memberId.toString()
    )
  ) {
    group.admins.push(memberId);
    await group.save();
  }
}

/* ======================================================
   DISMISS ADMIN (OWNER ONLY)
====================================================== */
export async function dismissAdmin(groupId, userId, memberId) {
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");
  if (!isOwner(group, userId)) throw new Error("Only owner allowed");

  group.admins = group.admins.filter(
    (a) => a.toString() !== memberId.toString()
  );

  await group.save();
}

/* ======================================================
   REMOVE MEMBER (ADMIN / OWNER)
====================================================== */
export async function removeMember(groupId, userId, memberId) {
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");
  if (!isAdmin(group, userId)) throw new Error("Permission denied");

  if (isOwner(group, memberId)) {
    throw new Error("Owner cannot be removed");
  }

  group.members = group.members.filter(
    (m) => m.toString() !== memberId.toString()
  );
  group.admins = group.admins.filter(
    (a) => a.toString() !== memberId.toString()
  );

  await group.save();
}

/* ======================================================
   UPLOAD GROUP AVATAR
====================================================== */
export async function uploadAvatar(groupId, userId, file, req) {
  if (!file) throw new Error("No image uploaded");

  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");
  if (!isAdmin(group, userId)) throw new Error("Permission denied");

  const avatarUrl = `${req.protocol}://${req.get(
    "host"
  )}/uploads/groups/${file.filename}`;

  group.avatar = avatarUrl;
  await group.save();

  return avatarUrl;
}
