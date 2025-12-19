// server/routes/messages.js
import express from "express";
import Message from "../models/Message.js";

const router = express.Router();


// ------------------------------
// Get Group Chat History
// ------------------------------
router.get("/:groupId", async (req, res) => {
  try {
    const messages = await Message.find({
      groupId: req.params.groupId,
      isPrivate: false
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Group history error:", err);
    res.status(500).send("Server error");
  }
});


// ------------------------------
// Get Private Chat History
// /messages/private/:currentUserId/:otherUserId
// ------------------------------
router.get("/private/:currentUserId/:otherUserId", async (req, res) => {
  try {
    const { currentUserId, otherUserId } = req.params;
    const room = [currentUserId, otherUserId].sort().join("_");

    const messages = await Message.find({
      privateRoom: room,
      isPrivate: true
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Private history error:", err);
    res.status(500).send("Server error");
  }
});


// ------------------------------
// DELETE Message
// ------------------------------
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


export default router;
