// client/src/components/Dashboard/ChatPlaceholder.js
import { styles } from "./styles";

export default function ChatPlaceholder({ name }) {
  return (
    <div style={styles.emptyChat}>
      <h2>Welcome, {name} 👋</h2>
      <p>Select a chat from the left.</p>
    </div>
  );
}
