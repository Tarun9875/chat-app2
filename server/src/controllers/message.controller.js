import {
  getPrivateMessages,
  getGroupMessages,
  markAsRead,
} from "../services/message.service.js";

export async function privateHistory(req, res) {
  res.json(
    await getPrivateMessages(
      req.params.currentUserId,
      req.params.otherUserId
    )
  );
}

export async function groupHistory(req, res) {
  res.json(await getGroupMessages(req.params.groupId));
}

export async function markRead(req, res) {
  await markAsRead({
    userId: req.user._id.toString(),
    ...req.body,
  });
  req.app.get("io").emit("messages-seen", req.body);
  res.json({ success: true });
}
