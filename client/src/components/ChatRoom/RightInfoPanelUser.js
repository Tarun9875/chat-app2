// SRC/COMPONENTS/CHATROOM/RightInfoPanelUser.js

export default function RightInfoPanelUser({
  isOpen,
  onClose,
  user,
}) {
  if (!user) return null;

  return (
    <>
      {/* OVERLAY */}
      <div
        style={{
          ...styles.overlay,
          pointerEvents: isOpen ? "auto" : "none",
          opacity: isOpen ? 1 : 0,
        }}
        onClick={onClose}
      />

      {/* PANEL */}
      <div
        style={{
          ...styles.panel,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* HEADER */}
        <div style={styles.header}>
          <span style={styles.title}>Contact Info</span>
          <button
            style={styles.closeBtn}
            onClick={onClose}
            aria-label="Close profile panel"
          >
            ✖
          </button>
        </div>

        {/* PROFILE */}
        <div style={{ ...styles.section, textAlign: "center" }}>
          <img
            src={
              user.photo ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="User avatar"
            style={styles.bigAvatar}
          />
          <h3 style={styles.name}>{user.name}</h3>
          <p style={styles.status}>
            {user.status || "Offline"}
          </p>
        </div>

        {/* ABOUT */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>About</h4>
          <p style={styles.sectionText}>
            {user.about || "Hey there! I am using Chat App"}
          </p>
        </div>

        {/* ACTIONS */}
        <div style={styles.section}>
          <button style={styles.actionBtn}>📞 Voice Call</button>
          <button style={styles.actionBtn}>🎥 Video Call</button>
        </div>
      </div>
    </>
  );
}

/* =======================
   STYLES
======================= */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 49,
    transition: "opacity 0.25s ease",
  },

  panel: {
    width: 350,
    height: "100vh",
    background: "#111B21",
    color: "#E9EDEF",
    borderLeft: "1px solid #2A3942",
    position: "fixed",
    right: 0,
    top: 0,
    overflowY: "auto",
    zIndex: 50,
    transition: "transform 0.25s ease-in-out",
    boxShadow: "-4px 0 12px rgba(0,0,0,0.4)",
  },

  header: {
    padding: "14px 16px",
    background: "#202C33",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },

  closeBtn: {
    background: "none",
    border: "none",
    color: "#E9EDEF",
    fontSize: 20,
    cursor: "pointer",
  },

  title: {
    fontSize: 16,
    fontWeight: 600,
  },

  section: {
    padding: 16,
    borderBottom: "1px solid #2A3942",
  },

  bigAvatar: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    marginBottom: 12,
    objectFit: "cover",
  },

  name: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
  },

  status: {
    marginTop: 4,
    fontSize: 13,
    color: "#25D366",
  },

  sectionTitle: {
    fontSize: 13,
    color: "#8696A0",
    marginBottom: 6,
  },

  sectionText: {
    fontSize: 14,
    lineHeight: 1.4,
  },

  actionBtn: {
    width: "100%",
    padding: "10px 12px",
    marginTop: 10,
    background: "#202C33",
    border: "1px solid #2A3942",
    color: "#E9EDEF",
    cursor: "pointer",
    borderRadius: 6,
    fontSize: 14,
  },
};
