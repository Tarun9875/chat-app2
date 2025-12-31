export default function RightInfoPanelUser({
  isOpen,
  onClose,
  user,
}) {
  if (!isOpen || !user) return null;

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <span style={styles.title}>Contact Info</span>
        <button style={styles.closeBtn} onClick={onClose}>✖</button>
      </div>

      <div style={{ ...styles.section, textAlign: "center" }}>
        <img
          src={
            user.photo ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt=""
          style={styles.bigAvatar}
        />
        <h3>{user.name}</h3>
        <p style={{ color: "#25D366" }}>
          {user.status || "Offline"}
        </p>
      </div>

      <div style={styles.section}>
        <h3>About</h3>
        <p>{user.about || "Hey there! I am using Chat App"}</p>
      </div>

      <div style={styles.section}>
        <button style={styles.actionBtn}>📞 Voice Call</button>
        <button style={styles.actionBtn}>🎥 Video Call</button>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    width: 350,
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
    padding: 15,
    background: "#202C33",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: 20,
    cursor: "pointer",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  section: {
    padding: 15,
    borderBottom: "1px solid #2A3942",
  },
  bigAvatar: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    marginBottom: 10,
  },
  actionBtn: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    background: "#202C33",
    border: "1px solid #2A3942",
    color: "white",
    cursor: "pointer",
    borderRadius: 6,
  },
};
