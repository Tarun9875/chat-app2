import { useState } from "react";

export default function ProfilePanel({ user, onClose, onLogout, onUpdate }) {
  const [editName, setEditName] = useState(user.name);
  const [editAbout, setEditAbout] = useState(user.about);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const saveChanges = () => {
    onUpdate("name", editName);
    onUpdate("about", editAbout);
    showToast("Profile updated");
  };

  return (
    <div style={styles.wrapper}>

      {/* LEFT SIDE MENU */}
      <div style={styles.menu}>
        <div style={styles.menuItem}>General</div>
        <div style={styles.menuItem}>Account</div>
        <div style={styles.menuItem}>Chats</div>
        <div style={styles.menuItem}>Video & voice</div>
        <div style={styles.menuItem}>Notifications</div>
        <div style={styles.menuItem}>Personalization</div>
        <div style={styles.menuItem}>Storage</div>
        <div style={styles.menuItem}>Shortcuts</div>
        <div style={styles.menuItem} onClick={onClose}>Close</div>

        <div style={styles.menuBottom}>
          <span style={{ color: "#0f0" }}>●</span> Profile
        </div>
      </div>

      {/* RIGHT PROFILE PANEL */}
      <div style={styles.panel}>

        <h2 style={styles.title}>Profile</h2>

        {/* AVATAR */}
        <div style={styles.avatarBox}>
          <img
            src={user.avatar || "/default-profile.png"}
            style={styles.avatar}
          />

          <label style={styles.avatarEditBtn}>
            ✎
            <input
              hidden
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  onUpdate("avatar", url);
                  showToast("Avatar updated");
                }
              }}
            />
          </label>
        </div>

        {/* NAME */}
        <div style={styles.fieldBox}>
          <div style={styles.label}>Name</div>

          <div style={styles.inputRow}>
            <input
              style={styles.input}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <span style={styles.editIcon}>✎</span>
          </div>
        </div>

        {/* ABOUT */}
        <div style={styles.fieldBox}>
          <div style={styles.label}>About</div>

          <div style={styles.inputRow}>
            <input
              style={styles.input}
              value={editAbout}
              onChange={(e) => setEditAbout(e.target.value)}
            />
            <span style={styles.editIcon}>✎</span>
          </div>
        </div>

        {/* PHONE */}
        <div style={styles.fieldBox}>
          <div style={styles.label}>Phone number</div>
          <div style={styles.phoneValue}>{user.phone}</div>
        </div>

        {/* SAVE BUTTON */}
        <button style={styles.saveBtn} onClick={saveChanges}>
          Save
        </button>

        {/* LOGOUT */}
        <button style={styles.logoutBtn} onClick={onLogout}>
          Log out
        </button>

        {/* TOAST */}
        {toast && <div style={styles.toast}>{toast}</div>}

      </div>
    </div>
  );
}

/* =============== WHATSAPP DESKTOP STYLE =============== */

const styles = {
  wrapper: {
    display: "flex",
    width: "100%",
    height: "100%",
    background: "#1E1E1E",
    color: "#fff",
  },

  /* LEFT MENU */
  menu: {
    width: 200,
    background: "#151515",
    borderRight: "1px solid #2c2c2c",
    paddingTop: 15,
    display: "flex",
    flexDirection: "column",
  },

  menuItem: {
    padding: "12px 20px",
    fontSize: 15,
    color: "#ccc",
    cursor: "pointer",
    borderBottom: "1px solid #222",
  },

  menuBottom: {
    marginTop: "auto",
    padding: 15,
    fontSize: 14,
    borderTop: "1px solid #222",
    display: "flex",
    gap: 8,
  },

  /* RIGHT PANEL */
  panel: {
    flex: 1,
    padding: 25,
    background: "#1C1C1C",
  },

  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 600,
  },

  avatarBox: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },

  avatar: {
    width: 140,
    height: 140,
    borderRadius: "50%",
    objectFit: "cover",
  },

  avatarEditBtn: {
    position: "absolute",
    bottom: 5,
    right: "calc(50% - 70px)",
    background: "#222",
    borderRadius: "50%",
    width: 36,
    height: 36,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },

  fieldBox: {
    marginBottom: 20,
  },

  label: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 5,
  },

  inputRow: {
    display: "flex",
    alignItems: "center",
    background: "#0F0F0F",
    borderRadius: 6,
    border: "1px solid #333",
  },

  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    padding: "10px 12px",
    color: "#fff",
    outline: "none",
    fontSize: 16,
  },

  editIcon: {
    padding: "0 10px",
    cursor: "pointer",
    color: "#888",
  },

  phoneValue: {
    background: "#0F0F0F",
    padding: "12px",
    borderRadius: 6,
    border: "1px solid #333",
  },

  saveBtn: {
    background: "#00A884",
    padding: "12px",
    border: "none",
    borderRadius: 6,
    fontSize: 16,
    color: "#000",
    cursor: "pointer",
    marginTop: 20,
  },

  logoutBtn: {
    background: "#d9534f",
    padding: "12px",
    border: "none",
    borderRadius: 6,
    fontSize: 16,
    color: "#fff",
    cursor: "pointer",
    marginTop: 10,
  },

  toast: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#00A884",
    padding: "10px 16px",
    borderRadius: 8,
    color: "#000",
    fontWeight: "bold",
  },
};
