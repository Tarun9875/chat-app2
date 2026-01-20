// server/controllers/group.controller.js
import * as GroupService from "../services/group.service.js";

export async function createGroup(req, res) {
  try {
    const group = await GroupService.createGroup(req.user._id, req.body.name);
    res.status(201).json({ message: "Group created", group });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getGroupsWithLast(req, res) {
  try {
    const groups = await GroupService.getGroupsWithLast(req.user._id);
    res.json(groups);
  } catch {
    res.status(500).json({ message: "Failed to load groups" });
  }
}

export async function getGroupDetails(req, res) {
  try {
    const group = await GroupService.getGroupDetails(
      req.params.id,
      req.user._id
    );
    res.json(group);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
}

export async function addMember(req, res) {
  try {
    await GroupService.addMember(
      req.params.id,
      req.user._id,
      req.body.memberId
    );
    res.json({ message: "Member added" });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
}

export async function promoteAdmin(req, res) {
  try {
    await GroupService.promoteAdmin(
      req.params.id,
      req.user._id,
      req.body.memberId
    );
    res.json({ message: "Admin promoted" });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
}

export async function dismissAdmin(req, res) {
  try {
    await GroupService.dismissAdmin(
      req.params.id,
      req.user._id,
      req.body.memberId
    );
    res.json({ message: "Admin dismissed" });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
}

export async function removeMember(req, res) {
  try {
    await GroupService.removeMember(
      req.params.id,
      req.user._id,
      req.body.memberId
    );
    res.json({ message: "Member removed" });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
}

export async function uploadAvatar(req, res) {
  try {
    const avatar = await GroupService.uploadAvatar(
      req.body.groupId,
      req.user._id,
      req.file,
      req
    );
    res.json({ message: "Avatar updated", avatar });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
