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
     DELIVERY + SEEN LOGIC
     ✔   = sent
     ✔✔  = delivered
     ✔✔  = seen (blue)
  ===================================================== */

  // delivered when receiver socket got message
  const isDelivered =
    Array.isArray(message.deliveredTo) && message.deliveredTo.length > 0;

  // seen when receiver opened chat
  const isSeen =
    Array.isArray(message.readBy) && message.readBy.length >= 2;

  // decide tick + color
  let tickIcon = "✔";
  let tickColor = "#8696A0"; // grey

  if (isDelivered) tickIcon = "✔✔";
  if (isSeen) {
    tickIcon = "✔✔";
    tickColor = "#53BDEB"; // blue
  }

  return (
    <div style={isMe ? styles.myMsgWrapper : styles.otherMsgWrapper}>
      <div style={isMe ? styles.myMsg : styles.otherMsg}>

        {/* SENDER NAME (GROUP CHAT ONLY) */}
        {!isPrivate && !isMe && (
          <div
            style={{ ...styles.senderName, color, cursor: "pointer" }}
            onClick={() => onAvatarClick(message)}
          >
            {message.senderName}
          </div>
        )}

        {/* MESSAGE TEXT */}
        <div style={styles.msgText}>{message.message}</div>

        {/* OPTIONS MENU (ONLY MY MESSAGE) */}
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

                <div
                  style={styles.menuItem}
                  onClick={() => onCopy(message.message)}
                >
                  Copy
                </div>
              </div>
            )}
          </div>
        )}

        {/* TIME + TICKS */}
        <div style={styles.metaRow}>
          <span style={styles.time}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {/* ✔ / ✔✔ / ✔✔ (BLUE) — ONLY MY MESSAGE */}
          {isMe && (
            <span
              style={{
                ...styles.tick,
                color: tickColor,
              }}
            >
              {tickIcon}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
