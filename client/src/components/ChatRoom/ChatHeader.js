//src/components/ChatRoom/ChatHeader.js
export default function ChatHeader({
  title,
  subtitle,
  avatar,
  onAvatarClick,
  isPrivate,
}) {
  return (
    <div style={styles.header}>
      <div style={styles.left} onClick={onAvatarClick}>
        <div style={styles.avatarWrap}>
          <img
            src={
              avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="avatar"
            style={styles.avatar}
          />
          {isPrivate && <span style={styles.onlineDot} />}
        </div>

        <div>
          <div style={styles.name}>{title}</div>
          <div style={styles.sub}>{subtitle}</div>
        </div>
      </div>

      {!isPrivate && (
        <button style={styles.infoBtn} onClick={onAvatarClick}>
        {/* three dots */}
          ⋮
        </button>
      )}
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
    padding: "0 16px",
    borderBottom: "1px solid #2A3942",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #2A3942",
  },
  onlineDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 11,
    height: 11,
    background: "#00FF77",
    borderRadius: "50%",
    border: "2px solid #202C33",
  },
  name: { fontWeight: 600, fontSize: 16 },
  sub: { fontSize: 12, color: "#AEBAC1" },
  infoBtn: {
    background: "none",
    border: "none",
    color: "#E9EDEF",
    fontSize: 22,
    cursor: "pointer",
  },
};