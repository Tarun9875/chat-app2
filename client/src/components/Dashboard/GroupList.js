// client/src/components/Dashboard/GroupList.js
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
                {g.avatar ? (
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
                ) : (
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: "#2A3942",
                      color: "#E9EDEF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: 16,
                      border: "2px solid #2A3942",
                    }}
                  >
                    {g.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* GROUP INFO */}
              <div>
                <div style={{ color: "white", fontSize: 15 }}>
                  {g.name}
                </div>
                <div style={{ color: "#8696A0", fontSize: 12 }}>
                  {(g.members?.length || 1)} members
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
