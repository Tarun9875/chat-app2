import DateSeparator from "./DateSeparator";
import MessageBubble from "./MessageBubble";
import { styles } from "./styles";

export default function MessageList({
  chat,
  user,
  isPrivate,
  getSenderColor,
  menuOpenId,
  setMenuOpenId,
  onDelete,
  onCopy,          // ✅ FIX
  onAvatarClick,   // ✅ FIX
  bottomRef,
  formatDate,
}) {
  return (
    <div style={styles.chatBox}>
      {chat.map((m, i) => {
        const isMe = m.senderId === user._id;
        const prev = chat[i - 1];

        const showDate =
          !prev ||
          new Date(prev.timestamp).toDateString() !==
            new Date(m.timestamp).toDateString();

        return (
          <div key={m._id}> {/* ✅ FIX */}
            {showDate && (
              <DateSeparator text={formatDate(m.timestamp)} />
            )}

            <MessageBubble
              message={m}
              isMe={isMe}
              isPrivate={isPrivate}
              color={getSenderColor(m.senderId)}
              menuOpenId={menuOpenId}
              setMenuOpenId={setMenuOpenId}
              onDelete={onDelete}
              onCopy={onCopy}              // ✅ FIX
              onAvatarClick={onAvatarClick} // ✅ FIX
            />
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
