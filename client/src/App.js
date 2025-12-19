// client/src/App.js
import { useEffect, useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChatRoom from "./pages/ChatRoom";
import socket from "./socket";

/* =====================================================
   APP ROOT (WHATSAPP STYLE FLOW)
===================================================== */

export default function App() {
  /* ---------------- AUTH STATE ---------------- */
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  /* ---------------- PAGE STATE ---------------- */
  const [page, setPage] = useState(user ? "dashboard" : "login");

  /* ---------------- CHAT STATE ---------------- */
  const [chatInfo, setChatInfo] = useState({
    id: null,
    name: "",
    isPrivate: false,
    activeUser: null,
  });

  /* =====================================================
     SOCKET – CONNECT ONCE
  ===================================================== */
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  /* =====================================================
     LOGIN HANDLER
  ===================================================== */
  const handleLogin = () => {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        setPage("dashboard");
      }
    } catch {
      alert("Login failed. Please login again.");
      setPage("login");
    }
  };

  /* =====================================================
     LOGOUT HANDLER
  ===================================================== */
  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    setChatInfo({
      id: null,
      name: "",
      isPrivate: false,
      activeUser: null,
    });
    setPage("login");
  };

  /* =====================================================
     OPEN CHAT (GROUP OR PRIVATE)
  ===================================================== */
  const openChat = (id, name, isPrivate = false, activeUser = null) => {
    setChatInfo({
      id,
      name,
      isPrivate,
      activeUser,
    });
    setPage("chat");
  };

  /* =====================================================
     GO BACK FROM CHAT
  ===================================================== */
  const goBackToDashboard = () => {
    setChatInfo({
      id: null,
      name: "",
      isPrivate: false,
      activeUser: null,
    });
    setPage("dashboard");
  };

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <>
      {/* ========== REGISTER ========== */}
      {page === "register" && (
        <Register
          onDone={() => setPage("login")}
          goLogin={() => setPage("login")}
        />
      )}

      {/* ========== LOGIN ========== */}
      {page === "login" && (
        <Login
          onLogin={handleLogin}
          goRegister={() => setPage("register")}
        />
      )}

      {/* ========== DASHBOARD ========== */}
      {page === "dashboard" && user && (
        <Dashboard
          user={user}
          openChat={openChat}
          onLogout={handleLogout}
        />
      )}

      {/* ========== CHAT ROOM ========== */}
      {page === "chat" && chatInfo.id && user && (
        <ChatRoom
          groupId={chatInfo.id}
          groupName={chatInfo.name}
          isPrivate={chatInfo.isPrivate}
          activeUser={chatInfo.activeUser}
          onBack={goBackToDashboard}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
