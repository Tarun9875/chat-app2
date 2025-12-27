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
    background: "#111B21",   // WhatsApp dark pill
    color: "#E4E6EB",        // Slightly brighter text
    padding: "4px 12px",     // Inner spacing
    borderRadius: 12,        // Fully rounded shape
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
    textAlign: "center",
    opacity: 0.9,            // subtle fade like WhatsApp
    //display: "inline-block", /// left side show becuse the alignSelf is center
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
    maxWidth: "100%",
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
    marginTop: 4,
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
};