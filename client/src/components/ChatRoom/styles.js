// client/src/components/ChatRoom/styles.js

export const styles = {
  page: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#0B141A",
  },

  /* ----------- TOP BAR ----------- */
  topBar: {
    height: 60,
    background: "#202C33",
    color: "#E9EDEF",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid #2A3942",
  },

  groupTitle: { fontSize: 17, fontWeight: "bold" },
  subtitle: { fontSize: 12, color: "#8696A0" },

  /* ----------- CHAT LIST ----------- */
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
  },

  dateSeparator: {
    alignSelf: "center",
    background: "#111B21",
    color: "#E4E6EB",
    padding: "4px 12px",
    borderRadius: 12,
    margin: "10px 0",
    fontSize: 12,
    opacity: 0.9,
  },

  myMsgWrapper: { display: "flex", justifyContent: "flex-end" },
  otherMsgWrapper: { display: "flex", justifyContent: "flex-start" },

  myMsg: {
    background: "#005C4B",
    color: "#E9EDEF",
    padding: "10px 14px",
    borderRadius: "12px 12px 0 12px",
    maxWidth: "70%",
    marginBottom: 10,
    position: "relative",
  },

  otherMsg: {
    background: "#202C33",
    color: "#E9EDEF",
    padding: "10px 14px",
    borderRadius: "12px 12px 12px 0",
    maxWidth: "70%",
    marginBottom: 10,
  },

  senderName: {
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 3,
  },

  msgText: { fontSize: 16 },

  time: {
    fontSize: 10,
    color: "#8696A0",
    textAlign: "right",
  },

  dotWrapper: {
    position: "absolute",
    top: 12,
    right: -4,
  },

  dotsBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: 18,
    cursor: "pointer",
  },

  menuBox: {
    position: "absolute",
    top: 25,
    right: 0,
    background: "#233138",
    borderRadius: 8,
    padding: "5px 0",
    boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
    minWidth: 120,
    zIndex: 20,
  },

  menuItem: {
    padding: "8px 12px",
    fontSize: 14,
    cursor: "pointer",
    color: "#E9EDEF",
    borderBottom: "1px solid #2A3942",
  },

  /* ----------- INPUT BAR ----------- */
  inputBarWrapper: {
    position: "relative", // ✅ kept single definition
  },

  inputBar: {
    display: "flex",
    padding: "12px",
    background: "#202C33",
    borderTop: "1px solid #2A3942",
  },

  input: {
    flex: 1,
    padding: "10px",
    background: "#2A3942",
    border: "1px solid #2A3942",
    borderRadius: 25,
    color: "white",
    outline: "none",
  },

  sendBtn: {
    marginLeft: 10,
    background: "#00A884",
    color: "#111B21",
    padding: "10px 18px",
    borderRadius: 25,
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },

  metaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    marginTop: 4,
  },

  tick: {
    fontSize: 12,
    fontWeight: "bold",
    userSelect: "none",
  },

  emojiBtn: {
    background: "transparent",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    marginRight: 6,
  },

  emojiBox: {
    position: "absolute",
    bottom: 65,
    right: 20,
    zIndex: 9999,
    boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
    borderRadius: 12,
  },

  /* ----------- ATTACHMENT MENU ----------- */
  attachMenu: {
    background: "#202C33",
    borderRadius: 12,
    padding: "6px 0",
    width: 240,
  },

  attachRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "10px 16px",
    cursor: "pointer",
    color: "#E9EDEF",
    fontSize: 14,
    transition: "background 0.15s",
  },

  attachRowHover: {
    background: "#2A3942",
  },

  attachRowIcon: {
    color: "#8696A0",
  },

  attachIconCircle: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },

  /* ----------- MEDIA ----------- */
  imageMsg: {
    maxWidth: 260,
    maxHeight: 260,
    borderRadius: 10,
    marginTop: 6,
  },

  videoMsg: {
    maxWidth: 260,
    borderRadius: 10,
    marginTop: 6,
  },

  audioMsg: {
    marginTop: 6,
    width: 240,
  },

  fileMsg: {
    display: "inline-block",
    marginTop: 6,
    color: "#53BDEB",
    textDecoration: "none",
    fontSize: 14,
  },

  previewBox: {
    position: "absolute",
    bottom: 70,
    left: 20,
    background: "#202C33",
    padding: 6,
    borderRadius: 8,
    zIndex: 9999,
  },

  previewImg: {
    width: 160, // ✅ single definition kept
    borderRadius: 8,
    objectFit: "cover",
  },

  previewVideo: {
    width: 160,
    borderRadius: 8,
  },
};
