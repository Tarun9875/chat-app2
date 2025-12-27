// client/src/components/Dashboard/UserList.js
import { styles } from "./styles";

export default function UserList({
  users = [],
  onlineUsers = [],
  openChat,
  currentUserId, // 🔥 PASS LOGGED-IN USER ID
}) {
  return (
    <>
      <div style={styles.sectionTitle}>Users</div>

      {users
        // 🔥 REMOVE LOGGED-IN USER FROM LIST
        .filter((u) => u._id !== currentUserId)
        .map((u) => {
          const isOnline = Array.isArray(onlineUsers)
            ? onlineUsers.includes(u._id)
            : false;

          return (
            <div
              key={u._id}
              style={styles.chatRow}
              onClick={() => openChat(u._id, u.name, true, u)}
            >
              <div style={styles.chatRowLeft}>
                <div style={{ position: "relative" }}>
                  <img
                    src={
                      u.photo ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="avatar"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #2A3942",
                    }}
                  />

                  {/* 🟢 ONLINE DOT */}
                  {isOnline && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: -1,
                        right: -1,
                        width: 10,
                        height: 10,
                        background: "#00FF77",
                        borderRadius: "50%",
                        border: "2px solid #111B21",
                      }}
                    />
                  )}

                  {/* 🔥 UNREAD COUNT */}
                  {u.unreadCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                        minWidth: 18,
                        height: 18,
                        background: "#25D366",
                        color: "#111",
                        fontSize: 11,
                        fontWeight: "bold",
                        borderRadius: 9,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {u.unreadCount}
                    </span>
                  )}
                </div>

                <div>
                  <div style={{ color: "white", fontSize: 15 }}>
                    {u.name}
                  </div>
                  <div style={{ color: "#8696A0", fontSize: 12 }}>
                    {isOnline ? "Online" : u.status || "Offline"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
}
