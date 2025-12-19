import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";

export default function GroupHeader({ groupName, onOpenProfile }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  return (
    <div style={styles.header}>
      <div>
        <div style={styles.title}>{groupName}</div>
        <div style={styles.subtitle}>Group Chat</div>
      </div>

      <IconButton onClick={openMenu} sx={{ color: "#E9EDEF" }}>
        <MoreVertIcon />
      </IconButton>

      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            onOpenProfile();
            closeMenu();
          }}
        >
          Group Info
        </MenuItem>
      </Menu>
    </div>
  );
}

const styles = {
  header: {
    height: 60,
    background: "#202C33",
    color: "#E9EDEF",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    borderBottom: "1px solid #2A3942",
  },
  title: { fontSize: 17, fontWeight: "bold" },
  subtitle: { fontSize: 12, color: "#8696A0" },
};
