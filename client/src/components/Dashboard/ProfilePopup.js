// client/src/components/Dashboard/ProfilePopup.js
import { useState } from "react";
import API from "../../api";

export default function ProfilePopup({ user, onClose, onSave }) {
  const [name, setName] = useState(user?.name || "");
  const [status, setStatus] = useState(user?.status || "");
  const [photo, setPhoto] = useState(user?.photo || "");
  const [loading, setLoading] = useState(false);

  /* ---------------- PHOTO UPLOAD ---------------- */
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  /* ---------------- SAVE PROFILE ---------------- */
  const saveProfile = async () => {
    try {
      setLoading(true);

      const res = await API.put(`/user/update/${user._id}`, {
        name,
        status,
        photo,
      });

      // 🔥 SAFE RESPONSE HANDLING
      const updatedUser = res.data?.user || res.data;

      if (!updatedUser || !updatedUser._id) {
        throw new Error("Invalid user response from server");
      }

      // ✅ Send user back to Dashboard ONLY
      onSave(updatedUser);
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <h2 style={styles.title}>Edit Profile</h2>

        {/* AVATAR */}
        <div style={styles.avatarContainer}>
          <img
            src={photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="profile"
            style={styles.avatar}
          />

          <label style={styles.uploadBtn}>
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {/* NAME */}
        <div style={styles.field}>
          <label>Name</label>
          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* STATUS */}
        <div style={styles.field}>
          <label>Status</label>
          <input
            style={styles.input}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div style={styles.btnRow}>
          <button
            style={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            style={styles.saveBtn}
            onClick={saveProfile}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  box: {
    width: 350,
    padding: 25,
    background: "#111B21",
    color: "white",
    borderRadius: 12,
    border: "1px solid #2A3942",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  avatarContainer: {
    textAlign: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 95,
    height: 95,
    borderRadius: "50%",
    border: "3px solid #00A884",
    objectFit: "cover",
  },
  uploadBtn: {
    marginTop: 10,
    padding: "6px 12px",
    background: "#00A884",
    color: "#111B21",
    borderRadius: 18,
    cursor: "pointer",
    display: "inline-block",
    fontWeight: "bold",
  },
  field: {
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    background: "#2A3942",
    border: "1px solid #2A3942",
    borderRadius: 5,
    color: "white",
  },
  btnRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  cancelBtn: {
    background: "#2A3942",
    padding: "8px 16px",
    color: "white",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
  saveBtn: {
    background: "#00A884",
    padding: "8px 16px",
    color: "#111B21",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
