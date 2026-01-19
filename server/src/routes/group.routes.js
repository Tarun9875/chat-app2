// server/routes/group.js
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";

import Group from "../models/Group.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const router = express.Router();

/* ======================================================
   UPLOAD CONFIG (GROUP AVATAR)
====================================================== */

const uploadDir = path.join("uploads", "groups");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `group-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ======================================================
   PERMISSION HELPERS
====================================================== */

const isOwner = (group, userId) =>
  group.ownerId.toString() === userId.toString();

const isAdmin = (group, userId) =>
  isOwner(group, userId) ||
  group.admins.some((a) => a.toString() === userId.toString());

/* ======================================================
   CREATE GROUP (OWNER = CREATOR)
====================================================== */
router.post("/create", async (req, res) => {
  try {
    const userId = req.user._id;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Group name required" });
    }

    const owner = await User.findById(userId).lean();

    const group = await Group.create({
      name: name.trim(),
      ownerId: userId,
      ownerName: owner?.name || "",
      avatar: "",
      members: [userId],
      admins: [], // owner is implicit admin
      isPrivate: false,
    });

    req.app.get("io")?.emit("groups-updated");
    res.json({ message: "Group created", group });
  } catch (err) {
    console.error("CREATE GROUP:", err);
    res.status(500).json({ message: "Failed to create group" });
  }
});
/* ======================================================
   GET USER GROUPS (WITH LAST MESSAGE + UNREAD COUNT)
====================================================== */
router.get("/with-last", async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const groups = await Group.find({ members: userId }).lean();

    const result = await Promise.all(
      groups.map(async (g) => {
        // ✅ LAST MESSAGE
        const last = await Message.findOne({
          groupId: g._id.toString(),
          isPrivate: false,
        })
          .sort({ createdAt: -1 }) // ✅ SAFE SORT
          .lean();

        // ✅ UNREAD COUNT
        const unreadCount = await Message.countDocuments({
          groupId: g._id.toString(),
          senderId: { $ne: userId },
          readBy: { $ne: userId },
        });

        return {
          ...g,

          // ✅ LAST MESSAGE PREVIEW
          lastMessage: last
            ? {
                text: last.deleted
                  ? "🚫 This message was deleted"
                  : last.message,
                senderName: last.senderName,
                timestamp: last.createdAt,
              }
            : null,

          // ✅ WHATSAPP STYLE BADGE
          unreadCount,

          // ✅ MUTE SUPPORT (future ready)
          isMuted: g.mutedBy?.includes(userId) || false,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("WITH-LAST:", err);
    res.status(500).json({ message: "Failed to load groups" });
  }
});

/* ======================================================
   GET GROUP DETAILS (WITH MEMBERS INFO)
====================================================== */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid group id" });
    }

    const group = await Group.findById(id).lean();
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (
      !group.members.some(
        (m) => m.toString() === req.user._id.toString()
      )
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const membersInfo = await User.find(
      { _id: { $in: group.members } },
      "name photo status"
    ).lean();

    res.json({ ...group, membersInfo });
  } catch (err) {
    console.error("GET GROUP:", err);
    res.status(500).json({ message: "Failed to load group" });
  }
});

/* ======================================================
   ADD MEMBER (OWNER / ADMIN)
====================================================== */
router.post("/:id/add-member", async (req, res) => {
  try {
    const { memberId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!isAdmin(group, req.user._id)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    if (
      !group.members.some(
        (m) => m.toString() === memberId
      )
    ) {
      group.members.push(memberId);
      await group.save();
    }

    req.app.get("io")?.emit("groups-updated");
    res.json({ message: "Member added" });
  } catch (err) {
    console.error("ADD MEMBER:", err);
    res.status(500).json({ message: "Failed to add member" });
  }
});

/* ======================================================
   PROMOTE TO ADMIN (OWNER ONLY)
====================================================== */
router.post("/:id/promote-admin", async (req, res) => {
  try {
    const { memberId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!isOwner(group, req.user._id)) {
      return res.status(403).json({ message: "Only owner can promote" });
    }

    if (
      !group.admins.some(
        (a) => a.toString() === memberId
      )
    ) {
      group.admins.push(memberId);
      await group.save();
    }

    req.app.get("io")?.emit("groups-updated");
    res.json({ message: "Admin promoted" });
  } catch (err) {
    console.error("PROMOTE ADMIN:", err);
    res.status(500).json({ message: "Failed to promote admin" });
  }
});

/* ======================================================
   DISMISS ADMIN (OWNER ONLY)
====================================================== */
router.post("/:id/dismiss-admin", async (req, res) => {
  try {
    const { memberId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!isOwner(group, req.user._id)) {
      return res.status(403).json({ message: "Only owner can dismiss" });
    }

    group.admins = group.admins.filter(
      (a) => a.toString() !== memberId
    );

    await group.save();
    req.app.get("io")?.emit("groups-updated");
    res.json({ message: "Admin dismissed" });
  } catch (err) {
    console.error("DISMISS ADMIN:", err);
    res.status(500).json({ message: "Failed to dismiss admin" });
  }
});

/* ======================================================
   REMOVE MEMBER (OWNER / ADMIN)
====================================================== */
router.post("/:id/remove-member", async (req, res) => {
  try {
    const { memberId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!isAdmin(group, req.user._id)) {
      return res.status(403).json({ message: "Permission denied" });
    }
    if (isOwner(group, memberId)) {
      return res.status(400).json({ message: "Owner cannot be removed" });
    }

    group.members = group.members.filter(
      (m) => m.toString() !== memberId
    );
    group.admins = group.admins.filter(
      (a) => a.toString() !== memberId
    );

    await group.save();
    req.app.get("io")?.emit("groups-updated");
    res.json({ message: "Member removed" });
  } catch (err) {
    console.error("REMOVE MEMBER:", err);
    res.status(500).json({ message: "Failed to remove member" });
  }
});

/* ======================================================
   UPDATE GROUP AVATAR (OWNER / ADMIN)
====================================================== */
router.post(
  "/upload-avatar",
  upload.single("image"),
  async (req, res) => {
    try {
      const { groupId } = req.body;
      const group = await Group.findById(groupId);

      if (!group) return res.status(404).json({ message: "Group not found" });
      if (!isAdmin(group, req.user._id)) {
        return res.status(403).json({ message: "Permission denied" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const avatarUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/groups/${req.file.filename}`;

      group.avatar = avatarUrl;
      await group.save();

      req.app.get("io")?.emit("groups-updated");
      res.json({ message: "Avatar updated", avatar: avatarUrl });
    } catch (err) {
      console.error("UPLOAD AVATAR:", err);
      res.status(500).json({ message: "Avatar upload failed" });
    }
  }
);

export default router;
