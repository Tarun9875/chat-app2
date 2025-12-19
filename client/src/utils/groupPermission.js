// server/utils/groupPermission.js
export const isOwner = (group, userId) =>
  group.ownerId.toString() === userId.toString();

export const isAdmin = (group, userId) =>
  isOwner(group, userId) ||
  group.admins.some((a) => a.toString() === userId.toString());
