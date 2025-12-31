// client/src/components/ChatRoom/MessageBubble.js
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
  /* ======================================================
     TICK LOGIC
     ✔   = sent
     ✔✔  = delivered
     ✔✔  blue = seen
  ===================================================== */
  const isSeen =
    Array.isArray(message.readBy) && message.readBy.length > 1;

  const isDelivered =
    Array.isArray(message.readBy) && message.readBy.length >= 1;

  let tickIcon = "✔";
  let tickColor = "#8696A0";

  if (isDelivered) tickIcon = "✔✔";
  if (isSeen) tickColor = "#53BDEB";

  return (
    <div style={isMe ? styles.myMsgWrapper : styles.otherMsgWrapper}>
      <div style={isMe ? styles.myMsg : styles.otherMsg}>

        {/* 👤 SENDER NAME (GROUP CHAT ONLY) */}
        {!isPrivate && !isMe && (
          <div
            style={{ ...styles.senderName, color, cursor: "pointer" }}
            onClick={() => onAvatarClick(message)}
          >
            {message.senderName}
          </div>
        )}

        {/* 🖼️ IMAGE MESSAGE (WHATSAPP STYLE) */}
        {message.file?.type === "image" && (
          <img
            src={message.file.url}
            alt="chat-img"
            style={styles.msgImage}
            onClick={() => window.open(message.file.url, "_blank")}
          />
        )}

        {/* 📝 TEXT MESSAGE / IMAGE CAPTION */}
        {message.message && (
          <div style={styles.msgText}>{message.message}</div>
        )}

        {/* ⋮ OPTIONS MENU (ONLY MY MESSAGE) */}
        {isMe && (
          <div style={styles.dotWrapper}>
            <button
              style={styles.dotsBtn}
              onClick={() =>
                setMenuOpenId(menuOpenId === message._id ? null : message._id)
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

        {/* ⏰ TIME + ✔✔ */}
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
      </div>
    </div>
  );
}
