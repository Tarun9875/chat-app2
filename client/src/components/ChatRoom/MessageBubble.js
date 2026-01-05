import { styles } from "./styles";

export default function MessageBubble({
  message,
  isMe,
  isPrivate,
  color,
  menuOpenId,
  setMenuOpenId,
  onDelete,
  onCopy,
  onAvatarClick,
}) {
  /* ===============================
     READ / DELIVERED LOGIC
     ✔   = sent
     ✔✔  = delivered
     ✔✔ blue = seen
  =============================== */

  const readBy = Array.isArray(message.readBy) ? message.readBy : [];

  const isDelivered = readBy.length >= 1;
  const isSeen = readBy.length > 1;

  let tickIcon = "✔";
  let tickColor = "#8696A0";

  if (isDelivered) tickIcon = "✔✔";
  if (isSeen) tickColor = "#53BDEB";

  /* ===============================
     FILE URL HELPER (SAFE)
  =============================== */

  const fileUrl =
    message?.file?.url
      ? `http://localhost:5000${message.file.url}`
      : null;

  return (
    <div style={isMe ? styles.myMsgWrapper : styles.otherMsgWrapper}>
      <div style={isMe ? styles.myMsg : styles.otherMsg}>

        {/* ================= SENDER NAME (GROUP CHAT ONLY) ================= */}
        {!isPrivate && !isMe && (
          <div
            style={{ ...styles.senderName, color, cursor: "pointer" }}
            onClick={() => onAvatarClick(message)}
          >
            {message.senderName}
          </div>
        )}

        {/* ================= MESSAGE BODY ================= */}

        {/* TEXT MESSAGE */}
        {message.message && (
          <div style={styles.msgText}>{message.message}</div>
        )}

        {/* IMAGE MESSAGE */}
        {message.messageType === "image" && fileUrl && (
          <img
            src={fileUrl}
            alt="sent-img"
            style={styles.imageMsg}
            loading="lazy"        // 🔥 performance improvement
          />
        )}

        {/* VIDEO MESSAGE */}
        {message.messageType === "video" && fileUrl && (
          <video
            src={fileUrl}
            controls
            style={styles.videoMsg}
          />
        )}

        {/* AUDIO MESSAGE */}
        {message.messageType === "audio" && fileUrl && (
          <audio
            src={fileUrl}
            controls
            style={styles.audioMsg}
          />
        )}

        {/* DOCUMENT / FILE */}
        {message.messageType === "file" && fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            style={styles.fileMsg}
          >
            📄 {message.file?.name || "Download file"}
          </a>
        )}

        {/* ================= META (TIME + TICKS) ================= */}
        <div style={styles.metaRow}>
          <span style={styles.time}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isMe && (
            <span style={{ ...styles.tick, color: tickColor }}>
              {tickIcon}
            </span>
          )}
        </div>

        {/* ================= OPTIONS MENU (ONLY MY MESSAGE) ================= */}
        {isMe && (
          <div style={styles.dotWrapper}>
            <button
              style={styles.dotsBtn}
              onClick={() =>
                setMenuOpenId(
                  menuOpenId === message._id ? null : message._id
                )
              }
            >
              ⋮
            </button>

            {menuOpenId === message._id && (
              <div style={styles.menuBox}>
                <div
                  style={styles.menuItem}
                  onClick={() => onDelete(message._id)}
                >
                  Delete
                </div>

                {/* Copy only when text exists */}
                {message.message && (
                  <div
                    style={styles.menuItem}
                    onClick={() => onCopy(message.message)}
                  >
                    Copy
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
