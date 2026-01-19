// server/routes/messages.js
import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

/* ==============================
   PRIVATE CHAT HISTORY
================================ */
router.get("/private/:currentUserId/:otherUserId", async (req, res) => {
  try {
    const { currentUserId, otherUserId } = req.params;
    const room = [currentUserId, otherUserId].sort().join("_");

    const messages = await Message.find({
      privateRoom: room,
      isPrivate: true,
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Private history error:", err);
    res.status(500).send("Server error");
  }
});

/* ==============================
   GROUP CHAT HISTORY
================================ */
router.get("/:groupId", async (req, res) => {
  try {
    const messages = await Message.find({
      groupId: req.params.groupId,
      isPrivate: false,
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Group history error:", err);
    res.status(500).send("Server error");
  }
});

/* ==============================
   DELETE MESSAGE
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).send("Message not found");

    await msg.deleteOne();
    res.send("Message deleted");
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send("Server error");
  }
});
/* ==============================
   MARK AS READ (✅ FINAL, SAFE)
================================ */
router.post("/mark-read", async (req, res) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { groupId, privateRoom } = req.body;

    if (!groupId && !privateRoom) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // -----------------------------
    // UPDATE DB (SOURCE OF TRUTH)
    // -----------------------------
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

    // -----------------------------
    // SOCKET EMIT (GLOBAL SAFE)
    // -----------------------------
    const io = req.app.get("io");

    io.emit("messages-seen", {
      groupId: groupId || null,
      privateRoom: privateRoom || null,
      seenBy: userId,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("mark-read error:", err);
    res.status(500).json({ message: "Failed to mark read" });
  }
});


export default router;
