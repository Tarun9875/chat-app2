import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Dialog,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import API from "../../api";
import AddMemberModal from "./AddMemberModal";

export default function GroupProfile({
  groupId,
  onClose,
  currentUserId,
}) {
  const [group, setGroup] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(() => {
    loadGroup();
  }, []);

  const loadGroup = async () => {
    const res = await API.get(`/group/${groupId}`);
    setGroup(res.data);
    setEditName(res.data.name);
    setEditDesc(res.data.description || "");
  };

  const updateGroup = async () => {
    await API.post("/group/update", {
      id: groupId,
      name: editName,
      description: editDesc,
    });
    loadGroup();
  };

  const changeIcon = async (file) => {
    const form = new FormData();
    form.append("icon", file);

    await API.post(`/group/${groupId}/icon`, form);
    loadGroup();
  };

  const removeMember = async (uid) => {
    await API.post(`/group/remove-member`, {
      groupId,
      userId: uid,
    });
    loadGroup();
  };

  const deleteGroup = async () => {
    await API.delete(`/group/${groupId}`);
    window.location.reload();
  };

  if (!group) return null;

  return (
    <div style={styles.panel}>
      {/* HEADER */}
      <div style={styles.header}>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
        <h2>Group Info</h2>
      </div>

      {/* GROUP ICON */}
      <div style={styles.center}>
        <Avatar
          src={group.icon}
          sx={{ width: 120, height: 120 }}
        />
        <Button
          variant="contained"
          color="success"
          component="label"
          sx={{ mt: 1 }}
        >
          Change Icon
          <input
            hidden
            type="file"
            onChange={(e) => changeIcon(e.target.files[0])}
          />
        </Button>
      </div>

      {/* EDITABLE FIELDS */}
      <div style={styles.card}>
        <TextField
          fullWidth
          label="Group Name"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Description"
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
        />

        <Button sx={{ mt: 2 }} variant="contained" onClick={updateGroup}>
          Save
        </Button>
      </div>

      {/* MEMBERS LIST */}
      <h3 style={styles.section}>Members</h3>

      <List>
        {group.members.map((m) => (
          <ListItem
            key={m._id}
            secondaryAction={
              currentUserId === group.admin &&
              m._id !== group.admin && (
                <IconButton onClick={() => removeMember(m._id)}>
                  <DeleteIcon sx={{ color: "#ff6b6b" }} />
                </IconButton>
              )
            }
          >
            <ListItemAvatar>
              <Avatar src={m.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={m.name}
              secondary={m._id === group.admin ? "Admin" : ""}
            />
          </ListItem>
        ))}
      </List>

      {/* ADD MEMBER */}
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setOpenAddModal(true)}
        sx={{ mt: 1 }}
      >
        Add Member
      </Button>

      {/* DELETE GROUP */}
      {currentUserId === group.admin && (
        <Button
          fullWidth
          color="error"
          variant="contained"
          sx={{ mt: 2 }}
          onClick={deleteGroup}
        >
          Delete Group
        </Button>
      )}

      {/* MODAL */}
      <AddMemberModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        groupId={groupId}
      />
    </div>
  );
}

const styles = {
  panel: {
    position: "fixed",
    right: 0,
    top: 0,
    width: 400,
    height: "100vh",
    background: "#1E1E1E",
    color: "#fff",
    padding: 20,
    overflowY: "auto",
    borderLeft: "1px solid #333",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  center: {
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    background: "#2A2A2A",
    padding: 15,
    borderRadius: 10,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
};
