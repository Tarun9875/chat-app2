// client/src/components/Dashboard/TopBar.js
import { styles } from "./styles";

export default function TopBar({ name, onCreateGroup, onLogout }) {
  return (
    <div style={styles.topBar}>
      
      {/* LEFT — App Title + Username */}
      <div>
        <div style={styles.appTitle}>Chat Web</div>
        <div style={styles.subtitle}>Logged in as {name}</div>
      </div>

      {/* RIGHT — Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button style={styles.iconButton} onClick={onCreateGroup}>
          ➕ Create Group
        </button>
        <button style={styles.iconButton} onClick={onLogout}>
          Logout
        </button>
      </div>

    </div>
  );
}
