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

  /* ================================
     LOAD GROUPS (WITH UNREAD COUNT)
  ================================= */
  const loadGroups = async () => {
    try {
      const res = await API.get("/group/with-last");
      if (Array.isArray(res.data)) {
        setGroups(res.data);
      }
    } catch (err) {
      console.error("Failed to load groups:", err);
    }
  };

  /* ================================
     LOAD USERS (REMOVE SELF)
  ================================= */
  const loadUsers = async () => {
    try {
      const res = await API.get("/user/all");
      if (Array.isArray(res.data)) {
        setUsers(res.data.filter((u) => u._id !== user?._id));
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  /* ================================
     SOCKET + INITIAL LOAD
  ================================= */
  useEffect(() => {
    if (!user?._id) return;

    // initial load
    loadGroups();
    loadUsers();

    const refreshAll = () => {
      loadGroups();
      loadUsers();
    };

    socket.on("groups-updated", loadGroups);
    socket.on("receiveMessage", refreshAll);

    // 🔥 when unread resets to 0
    socket.on("messages-seen", () =>
       { 
      loadGroups();
      loadUsers();});

    socket.on("online-users", (list) => {
      setOnlineUsers(Array.isArray(list) ? list : []);
    });

    socket.emit("user-online", user._id);

   return () => {
  socket.off("groups-updated", loadGroups);
  socket.off("receiveMessage", refreshAll);
  socket.off("messages-seen", refreshAll);
  socket.off("online-users");

  socket.emit("user-offline", user._id);
};

  }, [user?._id]);

  /* ================================
     FILTER GROUPS WHERE USER IS MEMBER
  ================================= */
  const userGroups = groups.filter((g) =>
    (g.members || []).some((m) =>
      typeof m === "string" ? m === user?._id : m?._id === user?._id
    )
  );

  /* ================================
     RENDER
  ================================= */
  return (
    <div style={{ ...styles.sidebar, display: "flex", flexDirection: "column" }}>
      {/* LIST AREA */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <GroupList groups={userGroups} openChat={openChat} />

        <UserList
          users={users}
          onlineUsers={onlineUsers}
          openChat={openChat}
          currentUserId={user?._id}
        />
      </div>

      {/* PROFILE FOOTER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
          background: hover ? "#1A2328" : "#111B21",
          borderTop: "1px solid #2A3942",
          cursor: "pointer",
          transition: ".25s",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onOpenProfile}
      >
        <img
          src={
            user?.photo ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="avatar"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #00A884",
          }}
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
