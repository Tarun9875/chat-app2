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
}) {
  return (
    <div style={isMe ? styles.myMsgWrapper : styles.otherMsgWrapper}>
      <div style={isMe ? styles.myMsg : styles.otherMsg}>

        {/* Sender in group chat */}
        {!isPrivate && !isMe && (
          <div style={{ ...styles.senderName, color }}>
            {message.senderName}
          </div>
        )}

        <div style={styles.msgText}>{message.message}</div>

        {/* Options menu */}
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
                  onClick={() =>
                    navigator.clipboard.writeText(message.message)
                  }
                >
                  Copy
                </div>
              </div>
            )}
          </div>
        )}

        <div style={styles.time}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
