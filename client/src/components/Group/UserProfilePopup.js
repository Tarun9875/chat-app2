// client/src/components/Group/UserProfilePopup.js
export default function UserProfilePopup({ user, onClose }) {
  if (!user) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <button style={styles.closeBtn} onClick={onClose}>✖</button>

        <img src={user.photo || user.avatar || "/default-avatar.png"} alt="" style={styles.avatar} />

        <h2 style={styles.name}>{user.name}</h2>
        {user.email && <div style={styles.info}>{user.email}</div>}
        <div style={styles.info}>{user.status || "Hey there! I am using Chat Web"}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 900,
  },
  box: {
    width: 320,
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    textAlign: "center",
    color: "#111",
    position: "relative",
  },
  closeBtn: { position: "absolute", right: 12, top: 8, background: "none", border: "none", fontSize: 18, cursor: "pointer" },
  avatar: { width: 110, height: 110, borderRadius: "50%", objectFit: "cover", marginBottom: 12 },
  name: { fontSize: 20, margin: 0, marginBottom: 6 },
  info: { color: "#666", fontSize: 13, marginTop: 6 },
};
