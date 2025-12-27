// client/src/components/Dashboard/Sidebar.js
import { styles } from "./styles";
import GroupList from "./GroupList";
import UserList from "./UserList";
import { useEffect, useState } from "react";
import socket from "../../socket";
import API from "../../api";

export default function Sidebar({
  groups: initialGroups = [],
  users: initialUsers = [],
  onOpenProfile,
  openChat,
  user,
}) {
  const [hover, setHover] = useState(false);
  const [groups, setGroups] = useState(initialGroups);
  const [users, setUsers] = useState(initialUsers);
  const [onlineUsers, setOnlineUsers] = useState([]);

  /* ---------- PROFILE HOVER UI ---------- */
  const profileStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    background: hover ? "#1A2328" : "#111B21",
    borderTop: "1px solid #2A3942",
    cursor: "pointer",
    transition: ".25s",
  };

  const avatarStyle = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #00A884",
    transition: ".25s",
    transform: hover ? "scale(1.07)" : "scale(1)",
    boxShadow: hover ? "0 0 10px #00A884" : "none",
  };

  /* ---------- LOAD GROUPS ---------- */
  const loadGroups = async () => {
    try {
      const res = await API.get("/group/with-last");
      if (res?.data) setGroups(res.data);
    } catch (err) {
      console.error("Failed to load groups:", err);
    }
  };

  /* ---------- LOAD USERS ---------- */
  const loadUsers = async () => {
    try {
      const res = await API.get("/user/all");
      if (res?.data) setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  /* ---------- EFFECT: Fetch + Socket Events ---------- */
  useEffect(() => {
    loadGroups();
    loadUsers();

    socket.on("groups-updated", loadGroups);

    // 🔥 NEW — refresh unread counts when message arrives
    socket.on("receiveMessage", () => {
      loadGroups();
      loadUsers();
    });

    socket.on("online-users", (list) => {
      setOnlineUsers(list || []);
    });

    if (user?._id) {
      socket.emit("user-online", user._id);
    }

    return () => {
      socket.off("groups-updated", loadGroups);
      socket.off("receiveMessage"); // 🔥 NEW cleanup
      socket.off("online-users");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  /* ---------- FILTER GROUPS WHERE USER IS MEMBER ---------- */
  const userGroups = groups.filter((g) =>
    (g.members || []).some((m) => {
      if (!m) return false;
      if (typeof m === "string") return m === user?._id;
      if (typeof m === "object") return m._id === user?._id;
      return false;
    })
  );

  /* ---------- RENDER ---------- */
  return (
    <div style={{ ...styles.sidebar, display: "flex", flexDirection: "column" }}>
      
      {/* LIST AREA */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <GroupList groups={userGroups} openChat={openChat} />

        <UserList
          users={users}
          onlineUsers={onlineUsers}
          openChat={openChat}
          currentUserId={user?._id} // 🔥 IMPORTANT
        />
      </div>

      {/* PROFILE BOTTOM */}
      <div
        style={profileStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onOpenProfile}
      >
        <img
          src={
            user?.photo ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt=""
          style={avatarStyle}
        />

        <div>
          <div style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>
            {user?.name}
          </div>
          <div style={{ color: "#8696A0", fontSize: 12 }}>
            {user?.status || "Hey there! I am using Chat Web"}
          </div>
        </div>
      </div>

    </div>
  );
}
