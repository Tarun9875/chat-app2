import { useEffect, useState, useRef, useCallback } from "react";
import socket from "../socket";
import API from "../api";

import ChatHeader from "../components/ChatRoom/ChatHeader";
import MessageList from "../components/ChatRoom/MessageList";
import InputBar from "../components/ChatRoom/InputBar";

import GroupInfoPanel from "../components/Group/GroupInfoPanel";
import AddMemberPopup from "../components/Group/AddMemberPopup";
import UserProfilePopup from "../components/Group/UserProfilePopup";

/* ======================================================
   COLOR SYSTEM (WHATSAPP STYLE)
====================================================== */
const senderColors = {};
const palette = ["#53BDEB", "#49E0A2", "#FFB86C", "#FF6B6B", "#C792EA"];

function getSenderColor(id) {
  if (!senderColors[id]) {
    senderColors[id] =
      palette[Object.keys(senderColors).length % palette.length];
  }
  return senderColors[id];
}

/* ======================================================
   CHAT ROOM PAGE
====================================================== */
export default function ChatRoom({
  groupId,
  groupName,
  isPrivate = false,
  activeUser,
}) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  /* ---------------- STATE ---------------- */
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);

  const [groupInfo, setGroupInfo] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showGroupPanel, setShowGroupPanel] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);

  const bottomRef = useRef(null);
  const currentRoomRef = useRef(null);

  /* ======================================================
     FORMAT DATE
  ===================================================== */
  const formatDate = useCallback((ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  /* ======================================================
     LOAD GROUP INFO
  ===================================================== */
  const loadGroupInfo = async () => {
    if (isPrivate || !groupId) return;
    try {
      const res = await API.get(`/group/${groupId}`);
      setGroupInfo(res.data);
    } catch (err) {
      console.error("Group info error:", err);
    }
  };

  useEffect(() => {
    loadGroupInfo();
  }, [groupId, isPrivate]);

  /* ======================================================
     JOIN ROOM (NO LOOP)
  ===================================================== */
  useEffect(() => {
    if (!user || !groupId) return;

    const room = isPrivate
      ? [user._id, groupId].sort().join("_")
      : groupId;

    if (currentRoomRef.current === room) return;

    if (currentRoomRef.current) {
      socket.emit("leaveRoom", currentRoomRef.current);
    }

    socket.emit("joinRoom", room);
    currentRoomRef.current = room;

    const loadHistory = async () => {
      try {
        const url = isPrivate
          ? `/messages/private/${user._id}/${groupId}`
          : `/messages/${groupId}`;

        const res = await API.get(url);
        setChat(res.data || []);
      } catch (err) {
        console.error("Message load error:", err);
      }
    };

    loadHistory();
  }, [groupId, isPrivate, user?._id]);

  /* ======================================================
     SOCKET LISTENER
  ===================================================== */
  useEffect(() => {
    const onReceive = (msg) => {
      const msgRoom = msg.isPrivate
        ? [msg.senderId, msg.toUserId].sort().join("_")
        : msg.groupId;

      if (msgRoom === currentRoomRef.current) {
        setChat((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", onReceive);
    return () => socket.off("receiveMessage", onReceive);
  }, []);

  /* ======================================================
     AUTO SCROLL
  ===================================================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  /* ======================================================
     SEND MESSAGE
  ===================================================== */
  const sendMsg = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      isPrivate,
      groupId,
      senderId: user._id,
      senderName: user.name,
      senderAvatar: user.photo || "",
      toUserId: isPrivate ? groupId : null,
      message: message.trim(),
    });

    setMessage("");
  };

  /* ======================================================
     MESSAGE ACTIONS
  ===================================================== */
  const handleDeleteMessage = async (id) => {
    try {
      await API.delete(`/messages/${id}`);
      setChat((prev) => prev.filter((m) => m._id !== id));
      setMenuOpenId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleCopyMessage = async (text) => {
    await navigator.clipboard.writeText(text);
    setMenuOpenId(null);
  };

  /* ======================================================
     GROUP AVATAR UPDATE
  ===================================================== */
  const handleGroupAvatarUpdate = async (formData) => {
    try {
      const res = await API.post("/group/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setGroupInfo((prev) => ({
        ...prev,
        avatar: res.data.avatar,
      }));
    } catch (err) {
      console.error("Avatar update failed:", err);
      alert("Failed to update group avatar");
    }
  };

  /* ======================================================
     ADMIN / MEMBER ACTIONS (🔥 FIX)
  ===================================================== */
  const promoteAdmin = async (member) => {
    try {
      await API.post(`/group/${groupId}/promote-admin`, {
        memberId: member._id,
      });
      loadGroupInfo();
    } catch (err) {
      alert("Only owner can promote admin");
    }
  };

  const dismissAdmin = async (member) => {
    try {
      await API.post(`/group/${groupId}/dismiss-admin`, {
        memberId: member._id,
      });
      loadGroupInfo();
    } catch (err) {
      alert("Only owner can dismiss admin");
    }
  };

  const removeMember = async (member) => {
    try {
      await API.post(`/group/${groupId}/remove-member`, {
        memberId: member._id,
      });
      loadGroupInfo();
    } catch (err) {
      alert("Permission denied");
    }
  };

  /* ======================================================
     HEADER DATA
  ===================================================== */
  const headerTitle = isPrivate ? activeUser?.name : groupInfo?.name;
  const headerAvatar = isPrivate ? activeUser?.photo : groupInfo?.avatar;
  const headerSubtitle = isPrivate
    ? activeUser?.status || "Online"
    : `${groupInfo?.members?.length || 1} members`;

  /* ======================================================
     RENDER
  ===================================================== */
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <ChatHeader
        title={headerTitle}
        subtitle={headerSubtitle}
        avatar={headerAvatar}
        isPrivate={isPrivate}
        onAvatarClick={() => !isPrivate && setShowGroupPanel(true)}
      />

      <MessageList
        chat={chat}
        user={user}
        getSenderColor={getSenderColor}
        menuOpenId={menuOpenId}
        setMenuOpenId={setMenuOpenId}
        formatDate={formatDate}
        bottomRef={bottomRef}
        onAvatarClick={setSelectedUser}
        onDelete={handleDeleteMessage}
        onCopy={handleCopyMessage}
      />

      <InputBar message={message} setMessage={setMessage} sendMsg={sendMsg} />

      {!isPrivate && groupInfo && (
        <GroupInfoPanel
          visible={showGroupPanel}
          group={groupInfo}
          currentUserId={user._id}
          onClose={() => setShowGroupPanel(false)}
          onAddClick={() => setShowAddPopup(true)}
          onGroupAvatarUpdate={handleGroupAvatarUpdate}
          onPromoteAdmin={promoteAdmin}
          onDismissAdmin={dismissAdmin}
          onRemoveMember={removeMember}
        />
      )}

      {showAddPopup && groupInfo && (
        <AddMemberPopup
          groupId={groupInfo._id}
          existingMembers={(groupInfo.members || []).map((m) =>
            typeof m === "string" ? m : m._id
          )}
          onClose={() => setShowAddPopup(false)}
        />
      )}

      {selectedUser && (
        <UserProfilePopup
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
