import { useState } from "react";

export default function RightInfoPanel({
  isOpen,
  onClose,
  group,
  members,
  onAddMember,
}) {
  if (!isOpen) return null;

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <span style={styles.title}>{group.name}</span>
        <button style={styles.closeBtn} onClick={onClose}>✖</button>
      </div>

      {/* ---- Overview ---- */}
      <div style={styles.section}>
        <h3>Overview</h3>
        <p>Created: {group.createdAt}</p>
        <p>{group.description}</p>
      </div>

      {/* ---- Members ---- */}
      <div style={styles.section}>
        <h3>Members</h3>

        {members.map((m) => (
          <div key={m.id} style={styles.memberItem}>
            <img src={m.avatar} alt="" style={styles.avatar} />
            <span>{m.name}</span>
          </div>
        ))}

        <button style={styles.addBtn} onClick={onAddMember}>
          ➕ Add Member
        </button>
      </div>

      {/* ---- Call buttons ---- */}
      <div style={styles.section}>
        <h3>Actions</h3>

        <button style={styles.actionBtn}>📞 Voice Call</button>
        <button style={styles.actionBtn}>🎥 Video Call</button>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    width: "350px",
    height: "100vh",
    background: "#111B21",
    color: "#E9EDEF",
    borderLeft: "1px solid #2A3942",
    position: "absolute",
    right: 0,
    top: 0,
    overflowY: "auto",
    zIndex: 50,
  },
  header: {
    padding: "15px",
    background: "#202C33",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
  },
  title: { fontSize: "18px", fontWeight: "bold" },
  section: {
    padding: "15px",
    borderBottom: "1px solid #2A3942",
  },
  memberItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 0",
  },
  avatar: { width: "35px", height: "35px", borderRadius: "50%" },
  addBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#005C4B",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
  },
  actionBtn: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#202C33",
    border: "1px solid #2A3942",
    color: "white",
    cursor: "pointer",
    borderRadius: "6px",
  },
};
