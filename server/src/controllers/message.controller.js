// server/controllers/message.controller.js
import * as MessageService from "../services/message.service.js";

/* ================= PRIVATE CHAT HISTORY ================= */
export async function privateHistory(req, res) {
  try {
    const messages = await MessageService.getPrivateMessages(
      req.params.currentUserId,
      req.params.otherUserId
    );
    res.json(messages);
  } catch (err) {
    console.error("privateHistory:", err);
    res.status(500).json({ message: "Failed to load private messages" });
  }
}

/* ================= GROUP CHAT HISTORY ================= */
export async function groupHistory(req, res) {
  try {
    const messages = await MessageService.getGroupMessages(
      req.params.groupId
    );
    res.json(messages);
  } catch (err) {
    console.error("groupHistory:", err);
    res.status(500).json({ message: "Failed to load group messages" });
  }
}

/* ================= MARK AS READ ================= */
export async function markRead(req, res) {
  try {
    const payload = await MessageService.markAsRead({
      userId: req.user._id.toString(),
      ...req.body,
    });

    // 🔥 GLOBAL SOCKET EMIT
    req.app.get("io").emit("messages-seen", payload);

    res.json({ success: true });
  } catch (err) {
    console.error("markRead:", err);
    res.status(500).json({ message: "Failed to mark messages read" });
  }
}
