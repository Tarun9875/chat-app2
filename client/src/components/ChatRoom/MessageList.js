// client/src/components/ChatRoom/MessageList.js

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
          <div key={i}>
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
            />
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
