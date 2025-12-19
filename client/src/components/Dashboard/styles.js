// client/src/components/Dashboard/styles.js

export const styles = {
  page: { 
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#111B21",
    overflow: "hidden",
  },

  /* ---------------- TOP BAR ---------------- */
  topBar: {
    height: 60,
    background: "#202C33",
    color: "#E9EDEF",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    justifyContent: "space-between",
    borderBottom: "1px solid #2A3942",
  },

  appTitle: { fontSize: 20, fontWeight: "bold", color: "#E9EDEF" },
  subtitle: { fontSize: 12, color: "#8696A0" },

  iconButton: {
    background: "#00A884",
    border: "none",
    padding: "6px 12px",
    color: "#111B21",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
  },

  /* ---------------- MAIN LAYOUT ---------------- */
  main: { 
    flex: 1,
    display: "flex",
    background: "#111B21",
    overflow: "hidden",
  },

  sidebar: {
    width: 320,
    background: "#111B21",
    borderRight: "1px solid #2A3942",
    overflowY: "auto",
    color: "#E9EDEF",
  },

  chatArea: { 
    flex: 1,
    background: "#0B141A",
    color: "#E9EDEF",
    overflow: "hidden",
  },

  emptyChat: {
    textAlign: "center",
    marginTop: 80,
    color: "#8696A0",
  },

  sectionTitle: {
    fontSize: 14,
    padding: "10px 14px",
    background: "#202C33",
    borderBottom: "1px solid #2A3942",
    color: "#E9EDEF",
    fontWeight: "bold",
  },

  chatRow: {
    padding: "10px 14px",
    cursor: "pointer",
    borderBottom: "1px solid #2A3942",
    display: "flex",
    alignItems: "center",
    transition: "0.2s",
  },

  chatRowLeft: { 
    display: "flex",
    gap: 10,
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#202C33",
    color: "#E9EDEF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  onlineDot: {
    width: 11,
    height: 11,
    borderRadius: "50%",
    background: "#00FF77",
    position: "absolute",
    bottom: -1,
    right: -1,
    border: "2px solid #111B21",
  },
};
