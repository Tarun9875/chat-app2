import React, { useRef, useState } from "react";
import {
  Drawer,
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";

/* ======================================================
   GROUP INFO PANEL – WHATSAPP STYLE (SAFE)
====================================================== */

export default function GroupInfoPanel({
  visible = false,
  group,
  currentUserId,

  onClose = () => {},
  onAddClick = () => {},
  onGroupAvatarUpdate = () => {},

  onPromoteAdmin = () => {},
  onDismissAdmin = () => {},
  onRemoveMember = () => {},
}) {
  const fileRef = useRef(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  if (!group || !currentUserId) return null;

  /* ======================================================
     NORMALIZE IDS (🔥 VERY IMPORTANT)
  ===================================================== */
  const myId = currentUserId.toString();
  const ownerId = group.ownerId?.toString();

  const admins = (group.admins || []).map((a) => a.toString());

  const members =
    group.membersInfo ||
    (group.members || []).map((m) =>
      typeof m === "object"
        ? m
        : { _id: m, name: "Unknown", photo: "", status: "" }
    );

  /* ======================================================
     PERMISSIONS
  ===================================================== */
  const isOwner = ownerId === myId;
  const isAdmin = isOwner || admins.includes(myId);

  const isMemberAdmin = (id) =>
    admins.includes(id?.toString());

  /* ======================================================
     AVATAR UPLOAD
  ===================================================== */
  const handleAvatarChange = (e) => {
    if (!isAdmin) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("groupId", group._id);

    onGroupAvatarUpdate(formData);
  };

  /* ======================================================
     MENU HANDLING
  ===================================================== */
  const openMenu = (event, member) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMember(member);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedMember(null);
  };

  /* ======================================================
     ACTIONS
  ===================================================== */
  const promoteAdmin = () => {
    onPromoteAdmin(selectedMember);
    closeMenu();
  };

  const dismissAdmin = () => {
    onDismissAdmin(selectedMember);
    closeMenu();
  };

  const removeMember = () => {
    onRemoveMember(selectedMember);
    closeMenu();
  };

  /* ======================================================
     UI
  ===================================================== */
  return (
    <Drawer
      anchor="right"
      open={visible}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 380 },
          bgcolor: "#111B21",
          color: "#E9EDEF",
        },
      }}
    >
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderBottom: "1px solid #2A3942",
        }}
      >
        <Typography fontWeight={600}>Group info</Typography>
        <IconButton onClick={onClose} sx={{ color: "#E9EDEF" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* ================= GROUP AVATAR ================= */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 3,
          gap: 1,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={group.avatar || ""}
            alt={group.name}
            sx={{
              width: 120,
              height: 120,
              bgcolor: "#202C33",
              border: "3px solid #00A884",
              fontSize: 40,
            }}
          >
            {!group.avatar && group.name?.[0]}
          </Avatar>

          {isAdmin && (
            <>
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  bottom: 6,
                  right: 6,
                  bgcolor: "#00A884",
                  color: "#111B21",
                  "&:hover": { bgcolor: "#02c39a" },
                }}
                onClick={() => fileRef.current.click()}
              >
                <CameraAltIcon fontSize="small" />
              </IconButton>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </>
          )}
        </Box>

        <Typography fontSize={18} fontWeight={700}>
          {group.name}
        </Typography>

        <Typography fontSize={13} color="#8696A0">
          {members.length} members
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#2A3942" }} />

      {/* ================= ADD MEMBER ================= */}
      {isAdmin && (
        <Box sx={{ px: 2, py: 1 }}>
          <Button
            startIcon={<GroupAddIcon />}
            onClick={onAddClick}
            sx={{
              color: "#00A884",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Add member
          </Button>
        </Box>
      )}

      {/* ================= MEMBERS LIST ================= */}
      <List disablePadding>
        {members.map((m) => {
          const memberId = m._id?.toString();
          const owner = memberId === ownerId;
          const admin = isMemberAdmin(memberId);

          return (
            <ListItem
              key={memberId}
              secondaryAction={
                (isOwner || isAdmin) &&
                !owner &&
                memberId !== myId && (
                  <IconButton
                    onClick={(e) => openMenu(e, m)}
                    sx={{ color: "#8696A0" }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )
              }
            >
              <ListItemAvatar>
                <Avatar src={m.photo || ""} />
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Typography fontSize={15} fontWeight={600}>
                    {memberId === myId ? "You" : m.name}
                    {owner && " 👑"}
                    {admin && !owner && (
                      <StarIcon
                        sx={{ fontSize: 14, ml: 0.5, color: "#00A884" }}
                      />
                    )}
                  </Typography>
                }
                secondary={
                  <Typography fontSize={12} color="#8696A0">
                    {m.status || ""}
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
      </List>

      {/* ================= MEMBER MENU ================= */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        PaperProps={{
          sx: {
            bgcolor: "#202C33",
            color: "#E9EDEF",
          },
        }}
      >
        {isOwner &&
          selectedMember &&
          !isMemberAdmin(selectedMember._id) && (
            <MenuItem onClick={promoteAdmin}>
              Make group admin
            </MenuItem>
          )}

        {isOwner &&
          selectedMember &&
          isMemberAdmin(selectedMember._id) && (
            <MenuItem onClick={dismissAdmin}>
              Dismiss admin
            </MenuItem>
          )}

        {(isOwner || isAdmin) && (
          <MenuItem
            onClick={removeMember}
            sx={{ color: "#FF6B6B" }}
          >
            Remove
          </MenuItem>
        )}
      </Menu>
    </Drawer>
  );
}
