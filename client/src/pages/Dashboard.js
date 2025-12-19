import { useEffect, useState } from "react";
import API from "../api";

import ChatRoom from "./ChatRoom";
import TopBar from "../components/Dashboard/TopBar";
import Sidebar from "../components/Dashboard/Sidebar";
import ChatPlaceholder from "../components/Dashboard/ChatPlaceholder";
import ProfilePopup from "../components/Dashboard/ProfilePopup";
import { styles } from "../components/Dashboard/styles";

import { getStoredUser } from "../utils/getStoredUser";

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);

  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatName, setActiveChatName] = useState("");
  const [activeIsPrivate, setActiveIsPrivate] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  const [profileOpen, setProfileOpen] = useState(false);

  /* ---------------- LOAD USER ON START ---------------- */
  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) return;

    setUser(stored);
    loadGroups();
    loadUsers(stored._id);
  }, []);

  /* ---------------- LOAD GROUPS ---------------- */
  const loadGroups = async () => {
    try {
      const res = await API.get("/group/with-last");
      setGroups(res.data || []);
    } catch (err) {
      console.error("Load groups failed:", err);
    }
  };

  /* ---------------- LOAD USERS ---------------- */
  const loadUsers = async (myId) => {
    try {
      const res = await API.get("/user/all");
      setUsers((res.data || []).filter((u) => u._id !== myId));
    } catch (err) {
      console.error("Load users failed:", err);
    }
  };

  /* ---------------- OPEN CHAT ---------------- */
  const openChat = (id, name, isPrivate, userObj = null) => {
    setActiveChatId(id);
    setActiveChatName(name);
    setActiveIsPrivate(isPrivate);
    setActiveUser(userObj); // ✅ private user avatar & name
  };

  /* ---------------- SAVE PROFILE ---------------- */
  const handleProfileSave = (updatedUser) => {
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    loadGroups();
    loadUsers(updatedUser._id);
    setProfileOpen(false);
  };

  /* ---------------- CREATE GROUP ---------------- */
  const createGroup = async () => {
    const name = prompt("Enter group name");
    if (!name) return;

    try {
      await API.post("/group/create", { name });
      await loadGroups(); // 🔥 refresh sidebar
    } catch (err) {
      console.error("Group create failed:", err);
      alert("Failed to create group");
    }
  };

  return (
    <div style={styles.page}>
      {/* TOP BAR */}
      {user && (
        <TopBar
          user={user}
          name={user.name}
          onLogout={onLogout}
          onCreateGroup={createGroup}   // ✅ REQUIRED
          onOpenProfile={() => setProfileOpen(true)}
        />

      )}

      <div style={styles.main}>
        {/* SIDEBAR */}
        <Sidebar
          groups={groups}
          users={users}
          openChat={openChat}
          user={user}
          onOpenProfile={() => setProfileOpen(true)}
        />

        {/* CHAT AREA */}
        <div style={styles.chatArea}>
          {activeChatId ? (
            <ChatRoom
              groupId={activeChatId}
              groupName={activeChatName}
              isPrivate={activeIsPrivate}
              activeUser={activeUser}
            />
          ) : (
            <ChatPlaceholder name={user?.name} />
          )}
        </div>
      </div>

      {/* PROFILE POPUP */}
      {profileOpen && user && (
        <ProfilePopup
          user={user}
          onClose={() => setProfileOpen(false)}
          onSave={handleProfileSave}
        />
      )}
    </div>
  );
}
