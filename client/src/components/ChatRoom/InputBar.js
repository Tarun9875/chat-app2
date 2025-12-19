// client/src/components/ChatRoom/InputBar.js
import { styles } from "./styles";

export default function InputBar({ message, setMessage, sendMsg }) {
  return (
    <div style={styles.inputBar}>
      <input
        style={styles.input}
        value={message}
        placeholder="Type a message..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMsg()}
      />

      <button style={styles.sendBtn} onClick={sendMsg}>
        Send
      </button>
    </div>
  );
}
