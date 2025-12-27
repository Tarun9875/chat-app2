import { styles } from "./styles";
import { getImageUrl } from "../../utils/getImageUrl";

export default function GroupList({ groups = [], openChat }) {
  if (!groups.length) return null;

  return (
    <>
      <div style={styles.sectionTitle}>Groups</div>

      {groups.map((g) => {
        const avatarUrl = getImageUrl(g.avatar);

        return (
          <div
            key={g._id}
            style={styles.chatRow}
            onClick={() => openChat(g._id, g.name, false)}
          >
            <div style={styles.chatRowLeft}>
              
              {/* GROUP AVATAR */}
              <div style={{ position: "relative" }}>
                <img
                  src={avatarUrl}
                  alt={g.name}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #2A3942",
                  }}
                />

                {/* 🔥 UNREAD BADGE */}
                {g.unreadCount > 0 && (
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
                    {g.unreadCount}
                  </span>
                )}
              </div>

              {/* GROUP INFO */}
              <div>
                <div style={{ color: "white", fontSize: 15 }}>
                  {g.name}
                </div>
                <div style={{ color: "#8696A0", fontSize: 12 }}>
                  {g.members?.length || 1} members
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
