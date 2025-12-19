// client/src/components/Dashboard/UserList.js

import { styles } from "./styles";

export default function UserList({ users, onlineUsers, openChat }) {
  return (
    <>
      <div style={styles.sectionTitle}>Users</div>

      {users.map((u) => (
        <div
          key={u._id}
          style={styles.chatRow}
          onClick={() => openChat(u._id, u.name, true, u)}

        >
          <div style={styles.chatRowLeft}>
            {/* USER AVATAR */}
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

              {/* ONLINE GREEN DOT */}
              {onlineUsers.includes(u._id) && (
                <span
                  style={{
                    position: "absolute",
                    bottom: -1,
                    right: -1,
                    width: 11,
                    height: 11,
                    background: "#00FF77",
                    borderRadius: "50%",
                    border: "2px solid #111B21",
                  }}
                ></span>
              )}
            </div>

            <div>
              <div style={{ color: "white", fontSize: 15 }}>{u.name}</div>
              <div style={{ color: "#8696A0", fontSize: 12 }}>
                {u.status || "Available"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
